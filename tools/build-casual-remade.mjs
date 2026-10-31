#!/usr/bin/env node
// Rebuild the twelve shared casual sprites from approved individual imagegen
// PNGs, preserving alpha and leaving every other cast unchanged.
import fs from 'node:fs';
import path from 'node:path';
import {execFileSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
const ROOT=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const REF=path.join(ROOT,'assets/ref/casual-remade'),OUT=path.join(ROOT,'assets/ref/cast');
const run=args=>execFileSync('ffmpeg',['-v','error','-y',...args],{maxBuffer:32<<20});
const names=['前原純華','葉山陽和','小鷹咲希','橘雪乃','小日向理瀬','ミシェル・イェーガー','アシュリー・ヴァンクロフト','桜井羽月','御社智','末宗祐里子','本田千尋','ティーナ・メルキース'];
const entries=[];
for(let i=0;i<12;i++){
  const input=path.join(REF,`transparent-${i}.png`);
  const [w,h]=execFileSync('ffprobe',['-v','error','-show_entries','stream=width,height','-of','csv=p=0',input]).toString().trim().split(',').map(Number);
  const rgba=run(['-i',input,'-f','rawvideo','-pix_fmt','rgba','-']);
  let x0=w,y0=h,x1=-1,y1=-1,clear=0;
  for(let y=0;y<h;y++)for(let x=0;x<w;x++){
    if(rgba[(y*w+x)*4+3]<8){clear++;continue;}
    x0=Math.min(x0,x);x1=Math.max(x1,x);y0=Math.min(y0,y);y1=Math.max(y1,y);
  }
  if(clear<w*h*.15||x1<=x0||y1<=y0)throw new Error('Missing alpha or character '+i);
  const cw=x1-x0+1,ch=y1-y0+1,pad=8,file=`casual-${i}.png`;
  let sx=0,n=0;
  for(let y=y0;y<y0+ch*.14;y++)for(let x=x0;x<=x1;x++)if(rgba[(y*w+x)*4+3]>128){sx+=x-x0+pad;n++;}
  run(['-i',input,'-vf',`crop=${cw}:${ch}:${x0}:${y0},pad=${cw+16}:${ch+16}:8:8:color=black@0`,'-frames:v','1','-pix_fmt','rgba',path.join(OUT,file)]);
  entries.push({file,w:cw+16,h:ch+16,headX:Math.round(sx/Math.max(1,n)),headY:Math.round(ch*.10)+pad,
    source:[x0-pad,y0-pad],sheet:`casual-remade/transparent-${i}.png`,name:names[i],armScale:.08,legScale:.15});
}
const mp=path.join(OUT,'cast.json'),manifest=JSON.parse(fs.readFileSync(mp,'utf8'));
if(manifest.casual?.length!==12)throw new Error('Expected the existing twelve-person casual cast');
manifest.casual=entries;fs.writeFileSync(mp,JSON.stringify(manifest,null,1)+'\n');
const W=1920,H=1080,CW=W/6,CH=H/2,figH=490,canvas=Buffer.alloc(W*H*4);
for(let y=0;y<H;y++)for(let x=0;x<W;x++){
  const o=(y*W+x)*4,u=y/H;
  canvas[o]=Math.round(218-52*u);canvas[o+1]=Math.round(240-40*u);canvas[o+2]=Math.round(255-20*u);canvas[o+3]=255;
}
for(let i=0;i<12;i++){
  const m=entries[i],k=Math.min(figH/m.h,(CW-24)/m.w),dw=Math.round(m.w*k),dh=Math.round(m.h*k);
  const image=run(['-i',path.join(OUT,m.file),'-vf',`scale=${dw}:${dh}:flags=lanczos`,'-f','rawvideo','-pix_fmt','rgba','-']);
  const left=Math.round((i%6)*CW+(CW-dw)/2),top=Math.round(Math.floor(i/6)*CH+CH-12-dh);
  for(let y=0;y<dh;y++)for(let x=0;x<dw;x++){
    const s=(y*dw+x)*4,a=image[s+3]/255,d=((top+y)*W+left+x)*4;
    for(let c=0;c<3;c++)canvas[d+c]=Math.round(image[s+c]*a+canvas[d+c]*(1-a));
  }
}
execFileSync('ffmpeg',['-v','error','-y','-f','rawvideo','-pix_fmt','rgba','-s',`${W}x${H}`,'-i','-','-frames:v','1',path.join(REF,'group.png')],{input:canvas});
console.log('casual: replaced twelve sprites and rebuilt 1920×1080 6×2 group image');
