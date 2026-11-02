#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const ref=path.join(root,'assets/ref/bubu-fur');
const lines=fs.readFileSync(path.join(ref,'lyrics-zh.txt'),'utf8').split(/\r?\n/).filter(l=>l.trim());
const {duration,cues}=JSON.parse(fs.readFileSync(path.join(ref,'timings-zh.json'),'utf8'));
if(lines.length!==48||cues.length!==48||!Number.isFinite(duration)||duration<=0) throw Error('Expected 48 matching lyrics/timing cues');
const stamp=t=>{
  const ms=Math.round(t*1000),pad=(v,n=2)=>String(v).padStart(n,'0');
  return `${pad(Math.floor(ms/3600000))}:${pad(Math.floor(ms/60000)%60)}:${pad(Math.floor(ms/1000)%60)},${pad(ms%1000,3)}`;
};
const blocks=cues.map((c,i)=>{
  if(c.line!==i+1||!Number.isFinite(c.start)||!Number.isFinite(c.end)||c.start<0||c.end-c.start<.5||c.end>duration||(i&&c.start<cues[i-1].end)) throw Error(`Invalid cue ${i+1}`);
  return `${i+1}\n${stamp(c.start)} --> ${stamp(c.end)}\n${lines[i]}\n`;
});
fs.writeFileSync(path.join(root,'喵布布本喵掉的毛.srt'),blocks.join('\n'));
console.log(`喵布布本喵掉的毛: ${cues.length} cues, ${duration.toFixed(2)} seconds`);
