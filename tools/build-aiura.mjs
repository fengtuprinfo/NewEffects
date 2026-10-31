#!/usr/bin/env node
// Package the imagegen transparent atlas as three sprites and a PV group image.
// Rebuild: node tools/build-aiura.mjs
import fs from 'node:fs';
import path from 'node:path';
import {execFileSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const REF = path.join(ROOT, 'assets/ref'), OUT = path.join(REF, 'cast');
const input = path.join(REF, 'aiura-sprites.png');
const run = args => execFileSync('ffmpeg', ['-v', 'error', '-y', ...args], {maxBuffer: 32 << 20});
const [width, height] = execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'stream=width,height', '-of', 'csv=p=0', input]).toString().trim().split(',').map(Number);
if(width !== 1536 || height !== 1024) throw new Error('Expected the approved 1536×1024 atlas');
const rgba = run(['-i', input, '-f', 'rawvideo', '-pix_fmt', 'rgba', '-']);
const cuts = [0, 556, 1054, width];
const heads = [[298, 178], [783, 151], [1284, 185]];
const names = ['天谷奏香', '岩沢彩生', '上原歩子'];
const entries = [];
for(let i = 0; i < 3; i++){
  let x0 = width, y0 = height, x1 = 0, y1 = 0, transparent = 0;
  for(let y = 0; y < height; y++) for(let x = cuts[i]; x < cuts[i + 1]; x++){
    const a = rgba[(y*width + x)*4 + 3];
    if(a < 8){ transparent++; continue; }
    x0 = Math.min(x0, x); x1 = Math.max(x1, x);
    y0 = Math.min(y0, y); y1 = Math.max(y1, y);
  }
  if(transparent < 10000 || x1 <= x0 || y1 <= y0) throw new Error('Missing transparency or sprite ' + i);
  x0 = Math.max(cuts[i], x0 - 8); x1 = Math.min(cuts[i + 1] - 1, x1 + 8);
  y0 = Math.max(0, y0 - 8); y1 = Math.min(height - 1, y1 + 8);
  const w = x1 - x0 + 1, h = y1 - y0 + 1, file = `aiura-${i}.png`;
  run(['-i', input, '-vf', `crop=${w}:${h}:${x0}:${y0}`, '-frames:v', '1', path.join(OUT, file)]);
  entries.push({file, w, h, headX: heads[i][0] - x0, headY: heads[i][1] - y0,
    source: [x0, y0], sheet: 'aiura-sprites.png', name: names[i], armScale: .12});
}
const manifestPath = path.join(OUT, 'cast.json');
const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
manifest.aiura = entries;
fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 1) + '\n');

// One complete figure per slot; Kanaka is the lead at center.
const order = [1, 0, 2], centers = [440, 960, 1480], spriteHeight = 860, baseline = 1020;
const args = ['-f', 'lavfi', '-i', 'color=c=0xfff4df:s=1920x1080'];
for(const index of order) args.push('-i', path.join(OUT, entries[index].file));
let filter = '[0:v]drawbox=x=0:y=0:w=iw:h=24:color=0x7fbfba:t=fill,drawbox=x=0:y=960:w=iw:h=120:color=0xf4d5bc:t=fill[bg];';
for(let i = 0; i < 3; i++) filter += `[${i + 1}:v]scale=-1:${spriteHeight}[sp${i}];`;
for(let i = 0; i < 3; i++) filter += `[${i ? 'layer' + (i - 1) : 'bg'}][sp${i}]overlay=x=${centers[i]}-overlay_w/2:y=${baseline - spriteHeight}[layer${i}];`;
filter += '[layer2]format=rgb24[out]';
run([...args, '-filter_complex', filter, '-map', '[out]', '-frames:v', '1', path.join(REF, 'aiura-group.png')]);
console.log('aiura: three transparent sprites and 1920×1080 group image');
for(let k = 0; k < 3; k++){
  const index = order[k], m = entries[index], scale = spriteHeight/m.h;
  console.log(`${names[index]} face: [${Math.round(centers[k] + (m.headX - m.w/2)*scale)}, ${Math.round(baseline - spriteHeight + m.headY*scale)}]`);
}
