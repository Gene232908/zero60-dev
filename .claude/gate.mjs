#!/usr/bin/env node
/**
 * Mechanical acceptance gate for the ZeroSixtyThree build loop.
 *
 * Maker/checker separation: this script is the ONLY authority on "done".
 * The agent never grades its own homework. Exit 2 blocks the Stop event and
 * throws the agent back in to keep fixing.
 *
 * TRACKS
 *   loop-state.json carries a `track`, so the two developers' acceptance
 *   criteria never contaminate each other:
 *     track "dev1" -> .claude/checks/m<N>.mjs       (Developer 1, milestones 1-3)
 *     track "dev2" -> .claude/checks/dev2-m<N>.mjs  (Developer 2, milestones 1-4)
 *   This matters because Developer 1's M3 module contains scope guards that
 *   deliberately FAIL when the admin side exists — which is precisely the work
 *   Developer 2 has to deliver. Same repo, opposite verdicts, so they are
 *   separate tracks rather than one shared checklist.
 *
 * STAGES
 *   1. static  - milestone checklist (file/grep assertions + scope guards)
 *   2. build   - next build (production)
 *   3. types   - tsc --noEmit
 *   4. lint    - eslint
 *   5. unit    - module-declared unit tests, run through Node's type stripping
 *   6. runtime - boot the prod server, fetch every route, optionally crawl every
 *                internal link, assert 200 + page markers + a 404 negative control
 *
 * AUTO-ADVANCE
 *   In --hook mode a GREEN milestone does not end the loop while later
 *   milestones remain: the gate advances loop-state.json to the next milestone,
 *   resets the iteration counter and blocks the stop again with the next
 *   milestone's brief. The loop therefore runs M1 -> M<final> unattended and
 *   only releases the agent when the FINAL milestone is green.
 *
 * Usage: node .claude/gate.mjs [--stage=static|types|lint|build|unit|runtime|all] [--hook]
 */
import { readFileSync, existsSync, writeFileSync, readdirSync, statSync } from 'node:fs';
import { execSync, spawn } from 'node:child_process';
import { join, relative } from 'node:path';

const ROOT = process.cwd();
const STATE = join(ROOT, '.claude', 'loop-state.json');
const args = process.argv.slice(2);
const stageArg = (args.find((a) => a.startsWith('--stage=')) || '--stage=all').split('=')[1];
const HOOK_MODE = args.includes('--hook');

function loadState() {
  try {
    return JSON.parse(readFileSync(STATE, 'utf8'));
  } catch {
    return { track: 'dev1', milestone: 1, iterations: 0, lastResult: null };
  }
}
function saveState(s) {
  writeFileSync(STATE, JSON.stringify(s, null, 2) + '\n');
}

/** Where a track keeps its per-milestone checklist. */
function moduleFor(track, n) {
  return track === 'dev1' ? `./checks/m${n}.mjs` : `./checks/${track}-m${n}.mjs`;
}
async function importCheck(track, n) {
  return import(new URL(moduleFor(track, n), import.meta.url).href);
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

/** Source files a check will usually want to sweep. */
const srcFiles = () =>
  [...walk('app'), ...walk('components'), ...walk('lib'), ...walk('content')].filter((f) =>
    /\.(ts|tsx)$/.test(f),
  );

/**
 * Strip comments before scanning for forbidden CODE.
 * Documenting an ownership seam is exactly what we want in the source;
 * implementing the other developer's task is not. A scope guard that cannot
 * tell prose from code punishes good comments.
 */
const stripComments = (src) =>
  src.replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|[^:])\/\/.*$/gm, '$1');

const ctx = { P, exists, read, walk, pkg, deps, srcFiles, stripComments, ROOT };

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
 * Unit stage — runs real assertions against real TypeScript source.
 *
 * Node 22 strips types natively, so a .mjs test can import the project's .ts
 * helper directly and exercise its arithmetic. This is how the partnership
 * computation (2% capped at AED 250) is verified: not by reading the code and
 * believing it, but by running it and checking the numbers.
 *
 * Requirement it imposes: a module under test must use RELATIVE imports, since
 * Node does not resolve the "@/" TS path alias.
 */
function runUnitTests(tests) {
  const failures = [];
  for (const t of tests) {
    if (!existsSync(P(t))) {
      failures.push(`${t} -> test file missing`);
      continue;
    }
    try {
      sh(`node --experimental-strip-types --no-warnings "${t}"`);
    } catch (e) {
      const out = [e.stdout, e.stderr, e.message].filter(Boolean).join('\n');
      failures.push(`${t} ->\n${out.split('\n').filter(Boolean).slice(-25).join('\n')}`);
    }
  }
  return failures.length ? { name: 'unit', ok: false, detail: failures.join('\n\n') } : { name: 'unit', ok: true };
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

/** Internal hrefs in a rendered page, normalised, minus assets and fragments. */
function internalLinks(html) {
  const out = new Set();
  for (const m of html.matchAll(/href="(\/[^"#?]*)"/g)) {
    const href = m[1];
    if (/\.(png|jpe?g|svg|webp|avif|ico|css|js|txt|xml|woff2?)$/i.test(href)) continue;
    if (href.startsWith('/_next')) continue;
    out.add(href.length > 1 ? href.replace(/\/$/, '') : href);
  }
  return [...out];
}

async function runRuntime(mod) {
  const routes = mod.routes || ['/'];
  const probe = mod.notFoundProbe;
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
  /** path -> rendered HTML, so live probes can inspect what actually shipped. */
  const pages = new Map();

  for (const route of routes) {
    const path = typeof route === 'string' ? route : route.path;
    const expect = typeof route === 'string' ? null : route.expect;
    const forbid = typeof route === 'string' ? null : route.forbid;
    const status = (typeof route === 'string' ? null : route.status) ?? 200;
    try {
      const res = await fetch(`http://127.0.0.1:${port}${path}`, { redirect: 'manual' });
      const html = await res.text();
      pages.set(path, html);
      if (res.status !== status) {
        failures.push(`${path} -> HTTP ${res.status} (expected ${status})`);
        continue;
      }
      for (const marker of [].concat(expect || [])) {
        if (!html.includes(marker)) failures.push(`${path} -> ${status} but page marker missing: "${marker}"`);
      }
      for (const marker of [].concat(forbid || [])) {
        if (html.includes(marker)) failures.push(`${path} -> still contains forbidden marker: "${marker}"`);
      }
      if (status === 200 && html.length < 800) {
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

  /**
   * Link crawl — "check every page and link" as an assertion rather than a
   * promise. Every internal href on every rendered page must resolve.
   */
  if (mod.crawl) {
    const seen = new Set(pages.keys());
    const queue = [];
    for (const html of pages.values()) for (const href of internalLinks(html)) if (!seen.has(href)) queue.push(href);
    const skip = new RegExp(mod.crawlSkip || '(?!)');
    while (queue.length) {
      const href = queue.shift();
      if (seen.has(href) || skip.test(href)) continue;
      seen.add(href);
      try {
        const res = await fetch(`http://127.0.0.1:${port}${href}`, { redirect: 'manual' });
        if (res.status >= 400) failures.push(`link crawl: ${href} -> HTTP ${res.status} (broken internal link)`);
      } catch (e) {
        failures.push(`link crawl: ${href} -> fetch failed: ${e.message}`);
      }
    }
  }

  // Module-supplied assertions over the rendered HTML (titles, meta, sitemap...).
  for (const probeFn of mod.liveProbes || []) {
    try {
      const verdict = await probeFn({ pages, port, fetch });
      if (verdict !== true) failures.push(`live probe [${probeFn.id || probeFn.name}] -> ${verdict}`);
    } catch (e) {
      failures.push(`live probe [${probeFn.id || probeFn.name}] threw: ${e.message}`);
    }
  }

  stopServer(child);
  return failures.length
    ? { name: 'runtime', ok: false, detail: failures.join('\n') }
    : { name: 'runtime', ok: true };
}

// ---------- main ----------
const state = loadState();
const track = state.track || 'dev1';
const mNum = state.milestone || 1;
const CEILING = state.ceiling || 12;
const FINAL = state.finalMilestone || mNum;

let mod;
try {
  mod = await importCheck(track, mNum);
} catch (e) {
  console.error(`gate: no check module for track ${track} milestone ${mNum} — ${e.message}`);
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
if ((stageArg === 'all' || stageArg === 'unit') && (mod.tests || []).length) {
  stages.push(runUnitTests(mod.tests));
}
if ((stageArg === 'all' || stageArg === 'runtime') && stages.every((s) => s.ok)) {
  stages.push(await runRuntime(mod));
}

// ---------- report ----------
const passCount = results.filter((r) => r.ok).length;
const lines = [];
lines.push(`\n===== ACCEPTANCE GATE — ${track.toUpperCase()} MILESTONE ${mNum}/${FINAL}: ${mod.title} =====`);
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

  if (allOk) {
    // ---- Milestone accepted. Advance, or release the loop if this was the last.
    const history = state.completed || [];
    if (!history.includes(mNum)) history.push(mNum);
    state.completed = history;

    if (mNum >= FINAL) {
      saveState(state);
      console.error(`gate: ${track} milestone ${mNum} GREEN and it is the final milestone — loop complete.`);
      process.exit(0);
    }

    const next = mNum + 1;
    let nextMod = null;
    try {
      nextMod = await importCheck(track, next);
    } catch {
      /* reported below */
    }
    if (!nextMod) {
      saveState(state);
      console.error(`gate: milestone ${mNum} GREEN but no check module for milestone ${next} — stopping.`);
      process.exit(0);
    }

    state.milestone = next;
    state.iterations = 0;
    state.lastResult = null;
    saveState(state);
    console.log(
      JSON.stringify({
        decision: 'block',
        reason:
          `MILESTONE ${mNum} ACCEPTED — the gate is green and the work is verified.\n\n` +
          `Do not stop. The loop now advances to MILESTONE ${next} of ${FINAL}: ${nextMod.title}\n\n` +
          `${nextMod.brief || ''}\n\n` +
          `Build every task above, then the gate re-runs. Iteration budget for this milestone: ${CEILING}.`,
      }),
    );
    process.exit(2);
  }

  saveState(state);

  if (state.iterations >= CEILING) {
    console.error(
      `gate: ceiling of ${CEILING} iterations reached on milestone ${mNum} — stopping. ` +
        `The agent must report the remaining failures honestly rather than claim completion.`,
    );
    process.exit(0);
  }

  const failed = [
    ...staticFailures,
    ...stages.filter((s) => !s.ok).map((s) => `[stage:${s.name}]\n      -> ${s.detail}`),
  ];
  console.log(
    JSON.stringify({
      decision: 'block',
      reason:
        `${track.toUpperCase()} milestone ${mNum}/${FINAL} acceptance gate is RED ` +
        `(iteration ${state.iterations}/${CEILING}). Fix every item below, then re-run the WHOLE checklist:\n\n` +
        `${failed.join('\n\n')}`,
    }),
  );
  process.exit(2);
}
process.exit(allOk ? 0 : 1);
