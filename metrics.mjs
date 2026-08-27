import fs from 'node:fs';
const b = fs.readFileSync('archivo.ttf');
const u16 = o => b.readUInt16BE(o), i16 = o => b.readInt16BE(o), u32 = o => b.readUInt32BE(o);

const numTables = u16(4);
const tables = {};
for (let i = 0; i < numTables; i++) {
  const o = 12 + i * 16;
  tables[b.toString('ascii', o, o + 4).trim()] = { off: u32(o + 8), len: u32(o + 12) };
}

const head = tables.head.off;
const unitsPerEm = u16(head + 18);
const indexToLocFormat = i16(head + 50);

const hhea = tables.hhea.off;
const hheaAsc = i16(hhea + 4), hheaDesc = i16(hhea + 6), hheaGap = i16(hhea + 8);

const os2 = tables['OS/2'].off;
const typoAsc = i16(os2 + 68), typoDesc = i16(os2 + 70), typoGap = i16(os2 + 72);
const winAsc = u16(os2 + 74), winDesc = u16(os2 + 76);
const capHeight = i16(os2 + 88);

// cmap format 4 -> glyph id for 'Y'
const cm = tables.cmap.off;
let sub = null;
for (let i = 0; i < u16(cm + 2); i++) {
  const r = cm + 4 + i * 8;
  const pid = u16(r), eid = u16(r + 2), off = u32(r + 4);
  if ((pid === 3 && (eid === 1 || eid === 10)) || pid === 0) { sub = cm + off; break; }
}
function gidFor(cp) {
  const fmt = u16(sub);
  if (fmt !== 4) throw new Error('cmap fmt ' + fmt);
  const segX2 = u16(sub + 6);
  const endO = sub + 14, startO = endO + segX2 + 2, deltaO = startO + segX2, rangeO = deltaO + segX2;
  for (let s = 0; s < segX2 / 2; s++) {
    if (cp <= u16(endO + s * 2) && cp >= u16(startO + s * 2)) {
      const ro = u16(rangeO + s * 2);
      if (ro === 0) return (cp + i16(deltaO + s * 2)) & 0xffff;
      const gi = u16(rangeO + s * 2 + ro + (cp - u16(startO + s * 2)) * 2);
      return gi ? (gi + i16(deltaO + s * 2)) & 0xffff : 0;
    }
  }
  return 0;
}
function bbox(cp) {
  const gid = gidFor(cp);
  const loca = tables.loca.off;
  const g0 = indexToLocFormat ? u32(loca + gid * 4) : u16(loca + gid * 2) * 2;
  const g1 = indexToLocFormat ? u32(loca + (gid + 1) * 4) : u16(loca + (gid + 1) * 2) * 2;
  if (g0 === g1) return null;
  const g = tables.glyf.off + g0;
  return { yMin: i16(g + 4), yMax: i16(g + 8) };
}

const pct = v => (v / unitsPerEm);
console.log('unitsPerEm      ', unitsPerEm);
console.log('hhea asc/desc/gap', hheaAsc, hheaDesc, hheaGap, '-> content box', pct(hheaAsc - hheaDesc + hheaGap).toFixed(4), 'em');
console.log('typo asc/desc/gap', typoAsc, typoDesc, typoGap);
console.log('win asc/desc     ', winAsc, winDesc, '-> content box', pct(winAsc + winDesc).toFixed(4), 'em');
console.log('capHeight        ', capHeight, '=', pct(capHeight).toFixed(4), 'em');
console.log('');
for (const ch of ['Y', 'Z', 'O', 'S', 'X', 'T', 'E', 'R']) {
  const bb = bbox(ch.codePointAt(0));
  console.log(`  ${ch}  yMin=${String(bb.yMin).padStart(6)} (${pct(bb.yMin).toFixed(4)}em)  yMax=${String(bb.yMax).padStart(5)} (${pct(bb.yMax).toFixed(4)}em)`);
}
