import sharp from 'sharp';
import { mkdir, readFile } from 'node:fs/promises';
const logoPath = process.argv[2];
const logo = logoPath ? await sharp(logoPath).resize(274,102).png().toBuffer() : null;
const poses = await Promise.all(Array.from({ length: 23 }, (_, index) => readFile(`../avatar-frames/${String(index).padStart(2, '0')}.png`)));
await mkdir('../avatar-video-frames', { recursive: true });
const keys = [{t:0,x:0,y:0},{t:1,x:-1,y:0},{t:2.5,x:1,y:0},{t:3.5,x:0,y:0},{t:4.5,x:0,y:-1},{t:5.5,x:0,y:1},{t:6.5,x:0,y:0},{t:8,x:0,y:0}];
for(let index=0;index<192;index++){
 const t=index/24; let k=0; while(keys[k+1] && t>keys[k+1].t)k++;
 const a=keys[k],b=keys[Math.min(k+1,keys.length-1)],p=Math.min(1,(t-a.t)/(b.t-a.t||1)),e=p*p*(3-2*p);
 const x=a.x+(b.x-a.x)*e,y=a.y+(b.y-a.y)*e;
 const column=Math.max(0,Math.min(6,Math.round((x+1)*3))),row=Math.max(0,Math.min(2,Math.round(y+1)));
 let frame=row*7+column; if(t>=7.05 && t<7.11)frame=21; if(t>=7.11&&t<7.17)frame=22;if(t>=7.17&&t<7.22)frame=21;
 const avatar=await sharp(poses[frame]).resize(420,560).png().toBuffer();
 const layers=[{input:avatar,left:430,top:120}]; if(logo) layers.unshift({input:logo,left:64,top:40});
 await sharp({create:{width:1280,height:720,channels:3,background:'#0b0f19'}}).composite(layers).png().toFile(`../avatar-video-frames/${String(index).padStart(3,'0')}.png`);
}
console.log('Rendered 8-second avatar motion study at 24 fps.');
