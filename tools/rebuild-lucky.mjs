#!/usr/bin/env node
// Package the seven approved imagegen cutouts, preserving the existing whale.
// Rebuild all replacement sprites and the group image: node tools/rebuild-lucky.mjs
import fs from 'node:fs';
import path from 'node:path';
import {execFileSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const REF = path.join(ROOT, 'assets/ref'), CAST = path.join(REF, 'cast');
const manifestPath = path.join(CAST, 'cast.json');
const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
if(manifest.lucky?.length !== 8) throw new Error('Expected the existing eight-person lucky cast');
const names = ['鯨魚娘', '咕咕嘎嘎', '鋒兄', '塗哥', '喵布布', '喵白白', '牙妹', '魚妹'];
const run = args => execFileSync('ffmpeg', ['-v', 'error', '-y', ...args], {maxBuffer: 32 << 20});
for(let i = 1; i < 8; i++){
  const sheet = `lucky-remade/lucky-${i}.png`, input = path.join(REF, sheet);
  const [w, h] = execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'stream=width,height', '-of', 'csv=p=0', input]).toString().trim().split(',').map(Number);
  const rgba = run(['-i', input, '-f', 'rawvideo', '-pix_fmt', 'rgba', '-']);
  let x0 = w, x1 = -1, y0 = h, y1 = -1, transparent = 0;
  for(let y = 0; y < h; y++) for(let x = 0; x < w; x++){
    if(rgba[(y*w + x)*4 + 3] < 8){ transparent++; continue; }
    x0 = Math.min(x0, x); x1 = Math.max(x1, x);
    y0 = Math.min(y0, y); y1 = Math.max(y1, y);
  }
  if(transparent < w*h*.2 || x1 <= x0 || y1 <= y0) throw new Error(`Missing alpha or foreground: ${sheet}`);
  const cw = x1 - x0 + 1, ch = y1 - y0 + 1, pad = 8;
  // Head position is estimated from the top of the opaque silhouette, excluding
  // the outstretched hands. Preserve source RGB/alpha; do not flood-fill white.
  let headSum = 0, headPixels = 0;
  for(let y = y0; y < y0 + ch*.12; y++) for(let x = x0; x <= x1; x++){
    if(rgba[(y*w + x)*4 + 3] > 128){ headSum += x - x0 + pad; headPixels++; }
  }
  const file = `lucky-${i}.png`;
  run(['-i', input, '-vf', `crop=${cw}:${ch}:${x0}:${y0},pad=${cw+pad*2}:${ch+pad*2}:${pad}:${pad}:color=black@0`, '-frames:v', '1', '-pix_fmt', 'rgba', path.join(CAST, file)]);
  manifest.lucky[i] = {file, w: cw + pad*2, h: ch + pad*2,
    headX: Math.round(headSum/Math.max(1, headPixels)), headY: Math.round(ch*.09) + pad,
    source: [x0 - pad, y0 - pad], sheet, name: names[i]};
  console.log(`${names[i]}: ${cw+pad*2}×${ch+pad*2}`);
}
fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 1) + '\n');
execFileSync(process.execPath, [path.join(ROOT, 'tools/build-group.mjs')], {stdio: 'inherit'});
