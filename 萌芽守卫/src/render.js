import { WIDTH, HEIGHT, TOWERS, towerStats } from './engine.js';
const palettes={garden:['#b8ce8b','#acc47f','#8eaf65','#efd5a0','#bfa170'],mushroom:['#b7c58c','#aabb7a','#83995f','#e6cda3','#b89b75'],sunset:['#d4c48b','#c5b879','#a99d65','#efd3a1','#c2a174'],sand:['#dcd39e','#d1c58b','#b5ad76','#f3dfb4','#c2ad7a'],mint:['#accdb0','#9cc09f','#79a580','#dfd5a6','#aaa17b'],dusk:['#b3b8cc','#a2abc1','#8d94ac','#d8c7ad','#a79789'],snow:['#d9e7df','#c7dcd1','#9dbcae','#e6d9c1','#b9ad99']};
function ellipse(c,x,y,rx,ry,fill,stroke,line=2){c.beginPath();c.ellipse(x,y,rx,ry,0,0,Math.PI*2);c.fillStyle=fill;c.fill();if(stroke){c.strokeStyle=stroke;c.lineWidth=line;c.stroke();}}
function line(c,points,color,width=2){c.beginPath();points.forEach(([x,y],i)=>i?c.lineTo(x,y):c.moveTo(x,y));c.strokeStyle=color;c.lineWidth=width;c.lineCap='round';c.lineJoin='round';c.stroke();}
function round(c,x,y,w,h,r,fill,stroke){c.beginPath();c.roundRect(x,y,w,h,r);c.fillStyle=fill;c.fill();if(stroke){c.strokeStyle=stroke;c.lineWidth=2;c.stroke();}}
function eyes(c,x,y,gap=8){ellipse(c,x-gap,y,2.5,3.5,'#374534');ellipse(c,x+gap,y,2.5,3.5,'#374534');ellipse(c,x-gap-5,y+7,4,2,'#e99878');ellipse(c,x+gap+5,y+7,4,2,'#e99878');}
export function drawPumpkin(c,x,y,scale=1,time=0){c.save();c.translate(x,y+Math.sin(time*2)*1.5);c.scale(scale,scale);ellipse(c,0,24,31,9,'#4b68442c');ellipse(c,-13,0,20,26,'#e9954d','#ad733f');ellipse(c,13,0,20,26,'#e9954d','#ad733f');ellipse(c,0,0,20,29,'#f5b566','#bc8045');ellipse(c,-7,-11,5,9,'#ffcf86');line(c,[[0,-27],[2,-36],[8,-40]],'#5d7848',6);c.save();c.translate(7,-32);c.rotate(-0.5);ellipse(c,7,0,13,6,'#73964d','#54783f');c.restore();eyes(c,0,4,9);line(c,[[-4,13],[0,16],[4,13]],'#624f32',2);c.restore();}
export function drawTower(c,type,x,y,scale=1,level=1,angle=0,kick=0,time=0){
 c.save();c.translate(x,y);c.scale(scale,scale);
 ellipse(c,0,18,26,9,'#4b68442b');
 ellipse(c,0,15,24,10,'#e0cf9b','#9d9e69');ellipse(c,0,11,23,9,'#f1e2b3','#a8aa73');
 c.translate(-Math.cos(angle)*kick*2,-Math.sin(angle)*kick*2);
 if(type==='pea'){
  line(c,[[0,9],[0,-13]],'#588344',8);ellipse(c,-11,2,12,5,'#7fa451','#507b42');ellipse(c,11,5,11,5,'#90b65d','#507b42');
  ellipse(c,0,-15,21,20,'#8fbb59','#4d7943',2.5);ellipse(c,-6,-24,9,5,'#b6d779');
  const dir=Math.cos(angle)>=0?1:-1;c.save();c.scale(dir,1);round(c,8,-22,21,17,7,'#91b860','#507b42');ellipse(c,28,-14,6,9,'#608c45','#4d7943');ellipse(c,29,-14,2.5,4,'#3e6438');ellipse(c,-4,-17,3,4,'#344a31');ellipse(c,-6,-8,4,2,'#dbb481');c.restore();
 }else if(type==='ice'){
  line(c,[[0,10],[0,-15]],'#6c9f91',7);ellipse(c,-10,3,13,5,'#86bab1','#5b928c');ellipse(c,10,6,10,4,'#9dccbf','#5b928c');
  for(let i=0;i<6;i++){c.save();c.translate(0,-18);c.rotate(i*Math.PI/3+Math.sin(time)*0.03);ellipse(c,0,-15,9,14,'#b4e2e7','#6ca5b4');c.restore();}
  ellipse(c,0,-18,13,13,'#e8f7e9','#80b1b5');eyes(c,0,-19,5);line(c,[[-2,-12],[2,-12]],'#567f86');
 }else if(type==='cannon'){
  ellipse(c,-14,10,8,10,'#7c694e','#574b39');ellipse(c,14,10,8,10,'#7c694e','#574b39');
  ellipse(c,0,-5,23,22,'#b87f50','#77543c');ellipse(c,0,-13,24,13,'#d4a168','#91643f');
  for(let i=-15;i<18;i+=8)line(c,[[i,-18],[i+4,-9]],'#ad7d4d',2);
  c.save();c.rotate(angle+Math.PI/2);round(c,-9,-31,18,28,5,'#a98158','#70523d');ellipse(c,0,-29,9,5,'#6a5743','#70523d');ellipse(c,0,-29,4,2,'#463f33');c.restore();
  eyes(c,0,0,9);
 }else{
  line(c,[[0,10],[0,-14]],'#628b45',7);ellipse(c,-11,4,12,5,'#85a84f','#628541');ellipse(c,11,7,11,5,'#85a84f','#628541');
  for(let i=0;i<9;i++){c.save();c.translate(0,-20);c.rotate(i*Math.PI*2/9+Math.sin(time)*0.04);ellipse(c,0,-18,8,13,'#f3c44f','#c6943e');c.restore();}
  ellipse(c,0,-20,16,16,'#a47d4d','#7f653f');ellipse(c,0,-21,13,12,'#c49a5b');eyes(c,0,-22,6);line(c,[[-3,-15],[0,-13],[3,-15]],'#634e32',2);
 }
 if(level>1){for(let i=0;i<level;i++)ellipse(c,-(level-1)*4+i*8,24,2.5,2.5,'#fff0a7','#cba958',1);}
 c.restore();
}
export function sprite(type){const cv=document.createElement('canvas');cv.width=160;cv.height=150;const c=cv.getContext('2d');if(type==='pumpkin')drawPumpkin(c,80,83,1.8);else drawTower(c,type,80,94,1.65);return cv.toDataURL();}
function random(seed){return()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;};}
function bush(c,x,y,s,color){c.save();c.translate(x,y);c.scale(s,s);ellipse(c,0,10,25,8,'#45633c20');ellipse(c,-14,0,15,13,color,'#6c8a4a');ellipse(c,12,0,17,14,color,'#6c8a4a');ellipse(c,-2,-8,18,17,color,'#6c8a4a');line(c,[[-11,-11],[-8,-15]],'#d8e5a37a',3);line(c,[[4,-16],[8,-12]],'#d8e5a37a',3);c.restore();}
function mushroom(c,x,y,s){c.save();c.translate(x,y);c.scale(s,s);round(c,-4,-1,8,14,3,'#f6e6ba','#b49b72');c.beginPath();c.ellipse(0,0,15,13,0,Math.PI,0);c.closePath();c.fillStyle='#d98f76';c.fill();c.strokeStyle='#a4715c';c.lineWidth=1.5;c.stroke();ellipse(c,-5,-6,3,2,'#fbe6bc');ellipse(c,7,-4,2,2,'#fbe6bc');c.restore();}
function flower(c,x,y,col,s=1){for(let i=0;i<5;i++)ellipse(c,x+Math.cos(i*1.256)*4*s,y+Math.sin(i*1.256)*4*s,3*s,3*s,col);ellipse(c,x,y,2*s,2*s,'#d5a854');}
function drawEnemy(c,e,time){
 c.save();c.translate(e.x,e.y+Math.sin(time*9+e.id)*2);const boss=e.type==='boss';if(boss)c.scale(1.55,1.55);
 ellipse(c,0,11,boss?21:16,6,'#4f58422d');
 if(e.type==='rabbit'){
  c.save();c.rotate(-0.12);ellipse(c,-7,-21,5,15,'#f9e9d2','#aa9277');ellipse(c,-7,-22,2,9,'#e6aaa1');c.restore();ellipse(c,7,-23,5,14,'#f9e9d2','#aa9277');ellipse(c,7,-24,2,8,'#e6aaa1');ellipse(c,0,-2,16,17,'#f9ead6','#aa9277');eyes(c,0,-4,6);ellipse(c,0,3,2,2,'#b78375');
 }else if(e.type==='beetle'){
  for(let i=0;i<3;i++){const yy=-7+i*7;line(c,[[-12,yy],[-20,yy+3]],'#68675d',3);line(c,[[12,yy],[20,yy+3]],'#68675d',3);}
  ellipse(c,0,-3,17,20,'#a990b6','#736880');line(c,[[0,-21],[0,8]],'#82718f',2);ellipse(c,-8,-9,3,4,'#c4afd0');ellipse(c,0,7,12,9,'#d1b9d4','#736880');eyes(c,0,5,5);
 }else if(boss){
  round(c,-15,-10,30,27,9,'#edcda3','#987e63');c.beginPath();c.ellipse(0,-9,25,22,0,Math.PI,0);c.lineTo(25,-7);c.quadraticCurveTo(0,0,-25,-7);c.fillStyle='#bb7b85';c.fill();c.strokeStyle='#885f68';c.lineWidth=2;c.stroke();ellipse(c,-11,-19,5,3,'#f8d9bd');ellipse(c,8,-24,5,4,'#f8d9bd');ellipse(c,18,-12,3,2,'#f8d9bd');eyes(c,0,4,6);line(c,[[-8,-4],[-3,-2]],'#654e46',2);line(c,[[8,-4],[3,-2]],'#654e46',2);
 }else{
  c.beginPath();c.moveTo(-17,8);c.bezierCurveTo(-20,-1,-13,-22,0,-20);c.bezierCurveTo(13,-23,21,-1,17,8);c.quadraticCurveTo(10,15,4,10);c.quadraticCurveTo(0,15,-5,11);c.quadraticCurveTo(-14,15,-17,8);c.fillStyle=e.flash>0?'#eef6d4':'#d2df93';c.fill();c.strokeStyle='#7e985e';c.lineWidth=2;c.stroke();ellipse(c,-7,-11,4,3,'#edf0bc');eyes(c,0,-2,6);line(c,[[-2,5],[2,5]],'#677c46',1.5);
 }
 if(e.slow>0){ellipse(c,0,2,22,22,'#aee4ee30','#c7f2fa',1.5);}
 if(e.hp<e.maxHp || boss){const yy=boss?-40:e.type==='rabbit'?-45:-30;round(c,-18,yy,36,5,3,'#63734a70');round(c,-17,yy+1,Math.max(1,34*e.hp/e.maxHp),3,2,e.slow?'#9ad9e5':'#80b458');}
 c.restore();
}
export class Renderer {
 constructor(canvas){this.canvas=canvas;this.ctx=canvas.getContext('2d');this.background=null;this.level=0;}
 makeBackground(game){
  this.level=game.level.id;const cv=document.createElement('canvas');cv.width=WIDTH;cv.height=HEIGHT;const c=cv.getContext('2d'),p=palettes[game.level.theme],rnd=random(41+game.level.id);
  c.fillStyle=p[0];c.fillRect(0,0,WIDTH,HEIGHT);
  for(let i=0;i<80;i++){ellipse(c,rnd()*WIDTH,rnd()*HEIGHT,15+rnd()*60,8+rnd()*24,p[1]+'60');}
  for(let i=0;i<1700;i++){const x=rnd()*WIDTH,y=rnd()*HEIGHT;c.fillStyle=i%2?p[2]+'20':'#ffffff15';c.fillRect(x,y,1.5,1.5);}
  const path=game.path.map(p=>[p.x,p.y]);path[0]=[-25,path[0][1]];path[path.length-1]=[WIDTH+25,path.at(-1)[1]];
  line(c,path,p[2]+'70',64);line(c,path,p[4],55);line(c,path,p[3],49);line(c,path,'#ffedc225',37);
  game.path.forEach((pt,i)=>{
   if(i%2===0){const x=pt.x+(rnd()-0.5)*13,y=pt.y+(rnd()-0.5)*13;ellipse(c,x,y,10+rnd()*4,4+rnd()*3,'#fff5d026');}
   if(i>0&&i<game.path.length-1){const prev=game.path[i-1],next=game.path[i+1];if(prev.x===next.x)line(c,[[pt.x-22,pt.y+29],[pt.x+20,pt.y+30]],p[4]+'49',1);else if(prev.y===next.y)line(c,[[pt.x+29,pt.y-22],[pt.x+30,pt.y+20]],p[4]+'49',1);}
   ellipse(c,pt.x+(rnd()-0.5)*33,pt.y+(rnd()-0.5)*33,1.8,1.2,p[4]+'65');
  });
  for(let i=0;i<200;i++){
   const x=rnd()*WIDTH,y=rnd()*HEIGHT;if(game.path.some(pt=>Math.hypot(pt.x-x,pt.y-y)<49)||game.slots.some(s=>Math.hypot(s.x-x,s.y-y)<26))continue;
   if(i%6===0)flower(c,x,y,['#fff3cc','#f5ddab','#e9b0a1'][i%3],0.8);
   else line(c,[[x-3,y],[x-5,y-4],[x,y],[x+3,y-5]],p[2]+'70',1.4);
  }
  const decorations=[[55,42,1.2],[95,52,0.75],[222,35,0.8],[875,40,1.5],[920,63,0.8],[44,542,1.3],[90,566,1],[890,546,1.4],[941,566,1],[415,552,1.2],[720,38,0.9]];
  decorations.forEach(([x,y,s])=>{if(!game.path.some(pt=>Math.hypot(pt.x-x,pt.y-y)<60)&&!game.slots.some(pt=>Math.hypot(pt.x-x,pt.y-y)<38))bush(c,x,y,s,p[2]);});
  [[190,310],[452,445],[748,548],[825,100],[77,280],[680,312]].forEach(([x,y],i)=>{if(!game.path.some(pt=>Math.hypot(pt.x-x,pt.y-y)<54)&&!game.slots.some(pt=>Math.hypot(pt.x-x,pt.y-y)<35)){mushroom(c,x,y,0.85);mushroom(c,x+16,y+5,0.5);}});
  // A tiny handmade garden fence.
  if(game.level.id===1){for(let x=615;x<=795;x+=30){round(c,x,520,7,33,2,'#eee0af','#a99c6e');}round(c,606,529,207,7,2,'#e3d09b','#a99c6e');flower(c,648,564,'#f7eed4');flower(c,774,565,'#f4baa3');}
  this.background=cv;
 }
 draw(game,selectedType,selectedTowerId,hover){
  if(!this.background||this.level!==game.level.id)this.makeBackground(game);
  const c=this.ctx,dpr=Math.min(window.devicePixelRatio||1,2);if(this.canvas.width!==WIDTH*dpr){this.canvas.width=WIDTH*dpr;this.canvas.height=HEIGHT*dpr;}
  c.setTransform(dpr,0,0,dpr,0,0);c.drawImage(this.background,0,0);
  const selected=game.towers.find(t=>t.id===selectedTowerId);
  if(selected){const s=towerStats(selected);ellipse(c,selected.x,selected.y,s.range,s.range,'#fff9d523','#fff4bb99',1.5);}
  for(const slot of game.slots){
   if(game.towers.some(t=>t.col===slot.col&&t.row===slot.row))continue;
   const isHover=hover&&hover.col===slot.col&&hover.row===slot.row;
   ellipse(c,slot.x,slot.y+3,20,9,'#6b86451c');ellipse(c,slot.x,slot.y,20,15,selectedType?'#f7eed987':'#ecedc539',selectedType?'#f8f4d9aa':'#e7e9bd70',1.4);
   if(selectedType){line(c,[[slot.x-5,slot.y],[slot.x+5,slot.y]],'#78915d',2);line(c,[[slot.x,slot.y-5],[slot.x,slot.y+5]],'#78915d',2);}
   else {ellipse(c,slot.x-3,slot.y-1,4,2,'#90a76c');ellipse(c,slot.x+3,slot.y+2,4,2,'#90a76c');}
   if(isHover&&selectedType){const spec=TOWERS[selectedType];ellipse(c,slot.x,slot.y,spec.range,spec.range,'#fff9d52b','#fff4bbaa',1.5);c.globalAlpha=0.6;drawTower(c,selectedType,slot.x,slot.y,1);c.globalAlpha=1;}
  }
  const start=game.path[0],end=game.path.at(-1);
  line(c,[[start.x-8,start.y-20],[start.x-8,start.y-61]],'#8c805a',4);round(c,start.x-9,start.y-62,43,22,4,'#f9edd0','#b7a16e');c.fillStyle='#877d53';c.font='bold 11px sans-serif';c.textAlign='center';c.fillText('入口',start.x+12,start.y-47);
  ellipse(c,end.x,end.y+16,34,15,'#fff1c3a0');drawPumpkin(c,end.x-7,end.y-5,1.03,game.time);
  const objects=[...game.towers.map(t=>({kind:'tower',y:t.y,obj:t})),...game.enemies.map(e=>({kind:'enemy',y:e.y,obj:e}))].sort((a,b)=>a.y-b.y);
  for(const item of objects){const t=item.obj;if(item.kind==='tower'){if(t.id===selectedTowerId)ellipse(c,t.x,t.y+12,28,15,'#ffefb640','#fff0b5',2.5);drawTower(c,t.type,t.x,t.y,1,t.level,t.angle,t.kick,game.time);}else drawEnemy(c,t,game.time);}
  for(const p of game.projectiles){const f=1-p.life/p.maxLife;if(p.type==='spark'){line(c,[[p.x,p.y],[(p.x+p.tx)/2+9,(p.y+p.ty)/2-10],[p.tx,p.ty]],'#ffdf6d',4);line(c,[[p.x,p.y],[(p.x+p.tx)/2+9,(p.y+p.ty)/2-10],[p.tx,p.ty]],'#fff4bd',1.5);}else{const x=p.x+(p.tx-p.x)*f,y=p.y+(p.ty-p.y)*f-(p.type==='cannon'?Math.sin(f*Math.PI)*40:0);ellipse(c,x,y,p.type==='cannon'?7:5,p.type==='cannon'?7:5,p.type==='ice'?'#d6f6ff':p.type==='cannon'?'#9d7050':'#d9ed94',p.type==='ice'?'#7fbccd':p.type==='cannon'?'#79543c':'#73944a',1.5);}}
  for(const e of game.effects){const f=1-e.life/e.maxLife;c.globalAlpha=Math.min(1,e.life*3);if(e.type==='coin'||e.type==='bonus'){c.font=e.type==='bonus'?'bold 22px sans-serif':'bold 14px sans-serif';c.textAlign='center';c.strokeStyle='#657143';c.lineWidth=3;c.strokeText(e.text,e.x,e.y-f*30);c.fillStyle=e.color;c.fillText(e.text,e.x,e.y-f*30);}else{ellipse(c,e.x,e.y,10+f*(e.type==='blast'?65:38),10+f*(e.type==='blast'?65:38),e.color+'30',e.color,2);for(let i=0;i<6;i++){const a=i*Math.PI/3;ellipse(c,e.x+Math.cos(a)*f*40,e.y+Math.sin(a)*f*40,3,3,e.color);}}c.globalAlpha=1;}
  if(game.paused){c.fillStyle='#334b3b55';c.fillRect(0,0,WIDTH,HEIGHT);round(c,WIDTH/2-95,HEIGHT/2-32,190,64,22,'#fffcf0');c.fillStyle='#42583d';c.font='bold 24px sans-serif';c.textAlign='center';c.fillText('休息一下',WIDTH/2,HEIGHT/2+9);}
 }
}
