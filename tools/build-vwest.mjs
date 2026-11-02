#!/usr/bin/env node
// Package the seventeen imagegen figures and rebuild their shared 6×3 art.
import fs from 'node:fs';
import path from 'node:path';
import {execFileSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
const ROOT=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const REF=path.join(ROOT,'assets/ref/vwest'),OUT=path.join(ROOT,'assets/ref/cast');
const roster=JSON.parse(fs.readFileSync(path.join(REF,'roster.json'),'utf8'));
if(roster.length!==17)throw new Error('Expected sixteen players and their coach');
const run=(args,input)=>execFileSync('ffmpeg',['-v','error','-y',...args],{input,maxBuffer:48<<20,windowsHide:true});
const entries=[];
for(const person of roster){
  const input=path.join(REF,person.raw);
  const [w,h]=execFileSync('ffprobe',['-v','error','-show_entries','stream=width,height','-of','csv=p=0',input]).toString().trim().split(',').map(Number);
  const rgba=run(['-i',input,'-f','rawvideo','-pix_fmt','rgba','-']);
  let clear=0,x0=w,y0=h,x1=-1,y1=-1;
  // Normalize the generated matte: remove faint background residue, preserve
  // antialiasing at the contour, and keep opaque white shoes and clothing.
  for(let y=0;y<h;y++)for(let x=0;x<w;x++){
    const a=(y*w+x)*4+3;
    rgba[a]=rgba[a]<=96?0:Math.min(255,Math.round((rgba[a]-96)*255/144));
    if(rgba[a]===0){clear++;continue;}
    x0=Math.min(x0,x);x1=Math.max(x1,x);y0=Math.min(y0,y);y1=Math.max(y1,y);
  }
  if(clear<w*h*.20||x1<=x0||y1<=y0)throw new Error('Invalid figure alpha: '+person.index);
  const cw=x1-x0+1,ch=y1-y0+1,pad=8,file=`vwest-${person.index}.png`;
  const scale=Math.min(1,1084/ch),dw=Math.max(1,Math.round(cw*scale)),dh=Math.round(ch*scale);
  let helmetY=h;
  const yellow=(x,y)=>{const p=(y*w+x)*4;return rgba[p+3]>240&&rgba[p]>160&&rgba[p+1]>100&&rgba[p+1]<rgba[p]*1.05&&rgba[p+2]<rgba[p+1]*.65;};
  for(let y=y0;y<y0+ch*.4;y++)for(let x=x0;x<=x1;x++)if(yellow(x,y))helmetY=Math.min(helmetY,y);
  let sx=0,n=0;
  for(let y=helmetY;y<Math.min(h,helmetY+ch*.08);y++)for(let x=x0;x<=x1;x++)if(yellow(x,y)){sx+=x;n++;}
  const headX=Math.round(((n?sx/n:(x0+x1)/2)-x0)*scale)+pad;
  const headY=Math.round(((helmetY<h?helmetY+ch*.105:y0+ch*.14)-y0)*scale)+pad;
  run(['-f','rawvideo','-pix_fmt','rgba','-s',`${w}x${h}`,'-i','-','-vf',`crop=${cw}:${ch}:${x0}:${y0},scale=${dw}:${dh}:flags=lanczos,pad=${dw+16}:${dh+16}:8:8:color=black@0`,'-frames:v','1','-pix_fmt','rgba',path.join(OUT,file)],rgba);
  entries.push({file,w:dw+16,h:dh+16,headX,headY,source:[x0,y0],sheet:`vwest/${person.raw}`,name:person.name,armScale:.035,legScale:.07});
}
const W=1920,H=1080,COLS=6,ROWS=3,CW=W/COLS,CH=H/ROWS,group=Buffer.alloc(W*H*4);
for(let y=0;y<H;y++)for(let x=0;x<W;x++){
  const p=(y*W+x)*4,u=y/H;
  const field=y>H*.83;
  group[p]=field?31:Math.round(18+68*u);group[p+1]=field?116:Math.round(90+67*u);group[p+2]=field?71:Math.round(129+65*u);group[p+3]=255;
}
for(const [i,m] of entries.entries()){
  const inRow=Math.min(COLS,entries.length-Math.floor(i/COLS)*COLS);
  const k=Math.min((CH-28)/m.h,(CW-26)/m.w),dw=Math.round(m.w*k),dh=Math.round(m.h*k);
  const pixels=run(['-i',path.join(OUT,m.file),'-vf',`scale=${dw}:${dh}:flags=lanczos`,'-f','rawvideo','-pix_fmt','rgba','-']);
  const left=Math.round((W-inRow*CW)/2+(i%COLS)*CW+(CW-dw)/2),top=Math.round(Math.floor(i/COLS)*CH+CH-10-dh);
  for(let y=0;y<dh;y++)for(let x=0;x<dw;x++){
    const s=(y*dw+x)*4,d=((top+y)*W+left+x)*4,a=pixels[s+3]/255;
    for(let c=0;c<3;c++)group[d+c]=Math.round(pixels[s+c]*a+group[d+c]*(1-a));
  }
  m.groupFace=[Math.round(left+m.headX*k),Math.round(top+m.headY*k)];
}
run(['-f','rawvideo','-pix_fmt','rgba','-s',`${W}x${H}`,'-i','-','-frames:v','1',path.join(REF,'group.png')],group);
const manifestPath=path.join(OUT,'cast.json'),manifest=JSON.parse(fs.readFileSync(manifestPath,'utf8'));
manifest.vwest=entries;fs.writeFileSync(manifestPath,JSON.stringify(manifest,null,1)+'\n');
console.log('vwest: seventeen transparent sprites and 1920×1080 group art rebuilt');
