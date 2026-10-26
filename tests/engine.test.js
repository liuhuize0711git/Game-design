import test from 'node:test';
import assert from 'node:assert/strict';
import { LEVELS, TOWERS, createGame, buildTower, upgradeTower, sellTower, upgradeCost, sellValue, startWave, updateGame, towerStats, waveEnemies } from '../src/engine.js';

function advance(game,until,max=10000){for(let i=0;i<max&&!until();i++){updateGame(game,.2);game.events.length=0;}assert.ok(until(),'simulation reached expected state');}

test('ten distinct valid maps with increasing enemy strength and nondecreasing wave counts',()=>{
 assert.equal(LEVELS.length,10);assert.equal(new Set(LEVELS.map(l=>JSON.stringify(l.path))).size,10);
 LEVELS.forEach((level,index)=>{const g=createGame(level.id);assert.ok(g.slots.length>=15);assert.ok(g.path.length>=25);for(let i=1;i<g.path.length;i++)assert.equal(Math.hypot(g.path[i].x-g.path[i-1].x,g.path[i].y-g.path[i-1].y),60);assert.ok(g.slots.every(s=>!g.path.some(p=>p.col===s.col&&p.row===s.row)));if(index)assert.ok(level.waves>=LEVELS[index-1].waves);});
 const early=createGame(1),late=createGame(10);startWave(early);startWave(late);advance(early,()=>early.enemies.length>0);advance(late,()=>late.enemies.length>0);assert.ok(late.enemies[0].maxHp>early.enemies[0].maxHp*3);
});

test('building validates terrain, balance and occupied spots without spending money',()=>{
 const g=createGame();const s=g.slots[0],p=g.path[0];assert.equal(buildTower(g,'pea',p.col,p.row),null);assert.equal(g.gold,320);
 const t=buildTower(g,'spark',s.col,s.row);assert.ok(t);assert.equal(g.gold,120);assert.equal(buildTower(g,'pea',s.col,s.row),null);assert.equal(buildTower(g,'spark',g.slots[1].col,g.slots[1].row),null);assert.equal(g.gold,120);
});

test('sale avoids floating-point rounding losses for a 170-sunshine cannon',()=>{
 const g=createGame(),s=g.slots[0],t=buildTower(g,'cannon',s.col,s.row);assert.equal(sellValue(t),119);assert.ok(sellTower(g,t.id));assert.equal(g.gold,269);
});

test('upgrades cap at level 3; sale refunds 70% of actual total cost',()=>{
 const g=createGame(10),s=g.slots[0],t=buildTower(g,'pea',s.col,s.row),initial=g.gold;
 assert.equal(upgradeCost(t),80);assert.ok(upgradeTower(g,t.id));assert.equal(upgradeCost(t),120);assert.ok(upgradeTower(g,t.id));assert.equal(t.level,3);assert.equal(t.spent,300);assert.equal(g.gold,initial-200);assert.equal(upgradeTower(g,t.id),false);assert.equal(sellValue(t),210);assert.ok(sellTower(g,t.id));assert.equal(g.towers.length,0);assert.equal(g.gold,initial+10);assert.equal(sellTower(g,t.id),false);
});

test('pause freezes spawning, time, and spending; a wave cannot be started twice',()=>{
 const g=createGame();assert.ok(startWave(g));assert.equal(startWave(g),false);g.paused=true;const s=g.slots[0];assert.equal(buildTower(g,'pea',s.col,s.row),null);updateGame(g,.2);assert.equal(g.time,0);assert.equal(g.enemies.length,0);g.paused=false;advance(g,()=>g.enemies.length>0);assert.equal(g.wave,1);
});

test('ice flowers slow real spawned enemies',()=>{
 const g=createGame();const s=g.slots.find(s=>s.col===1&&s.row===1);assert.ok(buildTower(g,'ice',s.col,s.row));startWave(g);advance(g,()=>g.enemies.some(e=>e.slow>0));assert.ok(g.enemies.some(e=>e.hp<e.maxHp));
});

test('unprotected pumpkin loses health and eventually loses; defeated games reject changes',()=>{
 const g=createGame();g.speed=3;
 for(let i=0;i<5000&&g.status!=='lost';i++){if(g.status==='planning')startWave(g);updateGame(g,.2);g.events=[];}
 assert.equal(g.status,'lost');assert.equal(g.lives,0);assert.equal(g.kills,0);assert.equal(startWave(g),false);const s=g.slots[0];assert.equal(buildTower(g,'pea',s.col,s.row),null);const time=g.time;updateGame(g,.2);assert.equal(g.time,time);
});

test('restarting creates isolated clean state without carrying towers or currency',()=>{const a=createGame(3),s=a.slots[0];buildTower(a,'pea',s.col,s.row);a.gold=0;a.lives=2;const b=createGame(3);assert.equal(b.gold,LEVELS[2].gold);assert.equal(b.lives,20);assert.equal(b.towers.length,0);assert.equal(b.wave,0);});

// A legal automated player: buys and upgrades using earned sunshine only.
// It scores positions by path coverage and does not modify enemy health or game state.
function improveDefense(g){
 for(let iter=0;iter<60;iter++){
  const options=[];
  for(const type of ['pea','cannon','spark','ice'])for(const s of g.slots){
   if(g.towers.some(t=>t.col===s.col&&t.row===s.row)||g.gold<TOWERS[type].cost)continue;
   const base=TOWERS[type];const coverage=g.path.filter(p=>Math.hypot(s.x-p.x,s.y-p.y)<base.range).length;
   const nearby=g.towers.filter(t=>Math.hypot(t.x-s.x,t.y-s.y)<160).length;
   const mult=type==='cannon'?2.3:type==='spark'?1.9:type==='ice'?(g.towers.some(t=>t.type==='ice')?0.8:1.6):1;
   options.push({score:coverage*base.damage/base.cooldown/base.cost*mult/(1+nearby*0.12),run:()=>buildTower(g,type,s.col,s.row)});
  }
  for(const t of g.towers){if(t.level>=3||g.gold<upgradeCost(t))continue;const stats=towerStats(t),coverage=g.path.filter(p=>Math.hypot(t.x-p.x,t.y-p.y)<stats.range).length,mult=t.type==='cannon'?2.3:t.type==='spark'?1.9:1;options.push({score:coverage*TOWERS[t.type].damage*0.85/stats.cooldown/upgradeCost(t)*mult,run:()=>upgradeTower(g,t.id)});}
  options.sort((a,b)=>b.score-a.score);if(!options.length)break;options[0].run();
 }
}
for(const level of LEVELS)test(`level ${level.id}: all ${level.waves} waves and bosses are beatable with legitimate earnings`,()=>{
 const g=createGame(level.id);g.speed=3;let steps=0;
 while(!['won','lost'].includes(g.status)&&steps<20000){if(g.status==='planning'){improveDefense(g);assert.ok(startWave(g));}if(steps%30===0)improveDefense(g);updateGame(g,.2);g.events=[];assert.ok(g.gold>=0);steps++;}
 assert.equal(g.status,'won');assert.equal(g.wave,level.waves);assert.ok(g.lives>0);assert.ok(g.stars>=1);const count=Array.from({length:level.waves},(_,i)=>waveEnemies(level,i+1).length).reduce((a,b)=>a+b,0);assert.equal(g.kills,count);assert.equal(g.enemies.length,0);assert.equal(g.queue.length,0);
});
