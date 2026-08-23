#!/usr/bin/env node
/**
 * Mechanical acceptance gate for the ZeroSixtyThree build loop.
 *
 * Maker/checker separation: this script is the ONLY authority on "done".
 * The agent never grades its own homework. Exit 2 blocks the Stop event and
 * throws the agent back in to keep fixing.
 *
 * Stages:
 *   1. static  - milestone checklist (file/grep assertions + scope guards)
 *   2. types   - tsc --noEmit
 *   3. lint    - eslint
 *   4. build   - next build (production)
 *   5. runtime - boot the prod server, fetch every route, assert 200 + no error markers
 *
 * Usage: node .claude/gate.mjs [--stage=static|types|lint|build|runtime|all] [--hook]
 */
import { readFileSync, existsSync, writeFileSync, readdirSync, statSync } from 'node:fs';
import { execSync, spawn } from 'node:child_process';
import { join, relative } from 'node:path';

const ROOT = process.cwd();
const STATE = join(ROOT, '.claude', 'loop-state.json');
const args = process.argv.slice(2);
const stageArg = (args.find((a) => a.startsWith('--stage=')) || '--stage=all').split('=')[1];
const HOOK_MODE = args.includes('--hook');
const CEILING = 12;

function loadState() {
  try {
    return JSON.parse(readFileSync(STATE, 'utf8'));
  } catch {
    return { milestone: 1, iterations: 0, lastResult: null };
  }
}
function saveState(s) {
  writeFileSync(STATE, JSON.stringify(s, null, 2) + '\n');
}

// ---------- helpers exposed to check modules ----------
const P = (p) => join(ROOT, p);
const exists = (p) => existsSync(P(p));
const read = (p) => {
  try {
    return readFileSync(P(p), 'utf8');
  } catch {
    return '';
  }
};
function walk(dir, out = []) {
  const abs = P(dir);
  if (!existsSync(abs)) return out;
  for (const e of readdirSync(abs)) {
    if (['node_modules', '.next', '.git', '.claude', 'docs', 'loop-engineering'].includes(e)) continue;
    const full = join(abs, e);
    const rel = relative(ROOT, full).split('\\').join('/');
    if (statSync(full).isDirectory()) walk(rel, out);
    else out.push(rel);
  }
  return out;
}
const pkg = () => {
  try {
    return JSON.parse(read('package.json'));
  } catch {
    return {};
  }
};
const deps = () => ({ ...(pkg().dependencies || {}), ...(pkg().devDependencies || {}) });
const ctx = { P, exists, read, walk, pkg, deps, ROOT };

// ---------- runners ----------
function sh(cmd, opts = {}) {
  return execSync(cmd, {
    cwd: ROOT,
    stdio: 'pipe',
    encoding: 'utf8',
    maxBuffer: 64 * 1024 * 1024,
    ...opts,
  });
}
function tryStage(name, fn) {
  try {
    fn();
    return { name, ok: true };
  } catch (e) {
    const out = [e.stdout, e.stderr, e.message].filter(Boolean).join('\n');
    return { name, ok: false, detail: out.split('\n').filter(Boolean).slice(-40).join('\n') };
  }
}

/**
 * Kill the server and everything under it.
 * On Windows, spawning with `shell: true` means child.pid is the shell wrapper —
 * killing it leaves the real `next start` orphaned and still holding the port,
 * which then serves stale responses to the NEXT gate run. taskkill /T kills the
 * whole tree.
 */
function stopServer(child) {
  try {
    if (process.platform === 'win32' && child.pid) {
      execSync(`taskkill /PID ${child.pid} /T /F`, { stdio: 'ignore' });
    } else {
      child.kill('SIGTERM');
    }
  } catch {
    try {
      child.kill('SIGKILL');
    } catch {
      /* already gone */
    }
  }
}

async function runRuntime(routes, probe) {
  const port = 3987;
  const child = spawn('npx', ['next', 'start', '-p', String(port)], {
    cwd: ROOT,
    stdio: 'pipe',
    shell: true,
  });
  let log = '';
  child.stdout.on('data', (d) => (log += d));
  child.stderr.on('data', (d) => (log += d));

  const deadline = Date.now() + 90000;
  let up = false;
  while (Date.now() < deadline) {
    try {
      const r = await fetch(`http://127.0.0.1:${port}/`);
      if (r.status) {
        up = true;
        break;
      }
    } catch {
      await new Promise((r) => setTimeout(r, 700));
    }
  }
  if (!up) {
    stopServer(child);
    return { name: 'runtime', ok: false, detail: 'server did not boot in 90s\n' + log.slice(-2000) };
  }

  const failures = [];
  for (const route of routes) {
    const path = typeof route === 'string' ? route : route.path;
    const expect = typeof route === 'string' ? null : route.expect;
    try {
      const res = await fetch(`http://127.0.0.1:${port}${path}`);
      const html = await res.text();
      if (res.status !== 200) {
        failures.push(`${path} -> HTTP ${res.status} (expected 200)`);
        continue;
      }
      if (expect && !html.includes(expect)) {
        failures.push(`${path} -> 200 but page marker missing: "${expect}"`);
      }
      if (html.length < 800) {
        failures.push(`${path} -> suspiciously small HTML (${html.length}b), likely blank render`);
      }
    } catch (e) {
      failures.push(`${path} -> fetch failed: ${e.message}`);
    }
  }

  // Negative control: if an unknown path also returns 200, the checks above
  // prove nothing. This must 404.
  if (probe) {
    try {
      const res = await fetch(`http://127.0.0.1:${port}${probe}`);
      if (res.status !== 404) {
        failures.push(`${probe} -> HTTP ${res.status} (expected 404; route matching is broken)`);
      }
    } catch (e) {
      failures.push(`${probe} -> fetch failed: ${e.message}`);
    }
  }

  stopServer(child);
  return failures.length
    ? { name: 'runtime', ok: false, detail: failures.join('\n') }
    : { name: 'runtime', ok: true };
}

// ---------- main ----------
const state = loadState();
const mNum = state.milestone || 1;
let mod;
try {
  mod = await import(new URL(`./checks/m${mNum}.mjs`, import.meta.url).href);
} catch (e) {
  console.error(`gate: no check module for milestone ${mNum} — ${e.message}`);
  process.exit(1);
}

const results = [];
const staticFailures = [];

if (stageArg === 'all' || stageArg === 'static') {
  for (const c of mod.checks) {
    let verdict;
    try {
      verdict = c.run(ctx);
    } catch (e) {
      verdict = `threw: ${e.message}`;
    }
    const ok = verdict === true;
    results.push({ id: c.id, desc: c.desc, ok, reason: ok ? '' : String(verdict) });
    if (!ok) staticFailures.push(`[${c.id}] ${c.desc}\n      -> ${verdict}`);
  }
}

const stages = [];
// Build runs FIRST: Next generates .next/types/** route validators during the
// build, and tsc type-checks against them. Running tsc first would validate
// against stale types from a previous route layout.
if (stageArg === 'all' || stageArg === 'build') {
  stages.push(tryStage('build', () => sh('npx next build')));
}
if (stageArg === 'all' || stageArg === 'types') {
  stages.push(tryStage('types', () => sh('npx tsc --noEmit')));
}
if (stageArg === 'all' || stageArg === 'lint') {
  stages.push(tryStage('lint', () => sh('npx eslint . --max-warnings=0')));
}
if ((stageArg === 'all' || stageArg === 'runtime') && stages.every((s) => s.ok)) {
  stages.push(await runRuntime(mod.routes || ['/'], mod.notFoundProbe));
}

// ---------- report ----------
const passCount = results.filter((r) => r.ok).length;
const lines = [];
lines.push(`\n===== ACCEPTANCE GATE — MILESTONE ${mNum}: ${mod.title} =====`);
if (results.length) {
  lines.push(`\n-- Checklist (${passCount}/${results.length} PASS) --`);
  for (const r of results) {
    lines.push(`  ${r.ok ? 'PASS' : 'FAIL'}  [${r.id}] ${r.desc}${r.ok ? '' : `\n          reason: ${r.reason}`}`);
  }
}
if (stages.length) {
  lines.push(`\n-- Toolchain --`);
  for (const s of stages) {
    lines.push(
      `  ${s.ok ? 'PASS' : 'FAIL'}  ${s.name}${s.ok ? '' : `\n${s.detail.split('\n').map((l) => '          ' + l).join('\n')}`}`,
    );
  }
}
const allOk = staticFailures.length === 0 && stages.every((s) => s.ok);
lines.push(`\n===== RESULT: ${allOk ? 'GREEN — milestone acceptance met' : 'RED — milestone NOT done'} =====\n`);
const report = lines.join('\n');
console.log(report);
writeFileSync(join(ROOT, '.claude', 'last-report.txt'), report);

if (HOOK_MODE) {
  state.iterations = (state.iterations || 0) + 1;
  state.lastResult = allOk ? 'green' : 'red';
  saveState(state);
  if (allOk) process.exit(0);
  if (state.iterations >= CEILING) {
    console.error(`gate: ceiling of ${CEILING} iterations reached — stopping, agent must report failures.`);
    process.exit(0);
  }
  const failed = [
    ...staticFailures,
    ...stages.filter((s) => !s.ok).map((s) => `[stage:${s.name}]\n      -> ${s.detail}`),
  ];
  console.log(
    JSON.stringify({
      decision: 'block',
      reason: `Milestone ${mNum} acceptance gate is RED (iteration ${state.iterations}/${CEILING}). Fix every item below, then re-run the WHOLE checklist:\n\n${failed.join('\n\n')}`,
    }),
  );
  process.exit(2);
}
process.exit(allOk ? 0 : 1);
