export const TILE = 60;
export const WIDTH = 960;
export const HEIGHT = 600;
export const TOWERS = {
  pea: { name: '豌豆射手', tag: '单体 · 快速', cost: 100, damage: 23, range: 155, cooldown: 0.64, color: '#619841', description: '可靠的花园小卫士，快速发射豌豆，优先攻击走在最前面的敌人。' },
  ice: { name: '冰铃花', tag: '减速 · 控场', cost: 130, damage: 13, range: 145, cooldown: 0.9, color: '#64b5c6', description: '冰凉的花瓣让敌人减速 45%，持续 2 秒。搭配其他炮塔效果更好。' },
  cannon: { name: '栗子大炮', tag: '范围 · 爆破', cost: 170, damage: 48, range: 175, cooldown: 1.6, color: '#b98050', description: '发射一颗大栗子，对落点附近的所有敌人造成范围伤害。' },
  spark: { name: '向日葵', tag: '连锁 · 群攻', cost: 200, damage: 27, range: 155, cooldown: 1.05, color: '#eab64d', description: '把阳光连成闪电，最多击中 3 个敌人。每次跳跃保留 80% 伤害。' },
};
const paths = [
 [[0,2],[5,2],[5,6],[10,6],[10,3],[13,3],[13,7],[15,7]],
 [[0,7],[3,7],[3,2],[8,2],[8,7],[12,7],[12,4],[15,4]],
 [[0,2],[4,2],[4,7],[8,7],[8,3],[12,3],[12,7],[15,7]],
 [[0,4],[3,4],[3,1],[8,1],[8,7],[12,7],[12,3],[15,3]],
 [[0,1],[5,1],[5,5],[2,5],[2,8],[10,8],[10,3],[15,3]],
 [[0,7],[4,7],[4,2],[11,2],[11,6],[7,6],[7,8],[15,8]],
 [[0,3],[3,3],[3,7],[7,7],[7,1],[12,1],[12,6],[15,6]],
 [[0,2],[6,2],[6,7],[2,7],[2,9],[11,9],[11,4],[15,4]],
 [[0,8],[3,8],[3,2],[7,2],[7,6],[11,6],[11,1],[14,1],[14,5],[15,5]],
 [[0,1],[4,1],[4,5],[1,5],[1,8],[8,8],[8,2],[12,2],[12,7],[15,7]],
];
const levelNames = ['初芽花园','溪边漫步','蘑菇小径','落日果园','金色沙丘','薄荷山谷','暮色森林','霜糖雪地','星光秘境','最后的花园'];
const themes = ['garden','garden','mushroom','sunset','sand','mint','dusk','snow','dusk','garden'];
export const LEVELS = levelNames.map((name, i) => ({ id: i+1, name, theme: themes[i], path: paths[i], waves: 4 + Math.floor(i/2), gold: 320+i*25, difficulty: i<3?'轻松':i<6?'进阶':i<9?'挑战':'终极', description: ['第一缕晨光，第一场守护。','来访的小怪物，脚步更快了。','蘑菇深处，大家伙正在靠近。','趁日落之前，守住这片温暖。','炎热沙丘里，敌人变得更顽强。','漫长的山路，也是绝佳的伏击点。','夜色渐浓，准备迎接密集进攻。','让温暖的阳光，照亮冰雪小路。','星星之下，守护最后一份宁静。','所有勇气，都会在此刻开花。'][i] }));
export const ENEMY_TYPES = {
 slime: { name:'果冻团', hp:1, speed:39, reward:12, damage:1 },
 rabbit: { name:'疾风兔', hp:0.74, speed:66, reward:13, damage:1 },
 beetle: { name:'甲壳虫', hp:2.4, speed:29, reward:22, damage:2 },
 boss: { name:'蘑菇大王', hp:13, speed:22, reward:100, damage:5 },
};
export function expandPath(corners) {
 const cells=[];
 for(let i=0;i<corners.length-1;i++) {
  let [x,y]=corners[i]; const [ex,ey]=corners[i+1];
  const dx=Math.sign(ex-x),dy=Math.sign(ey-y);
  while(x!==ex || y!==ey){ cells.push({col:x,row:y,x:x*TILE+30,y:y*TILE+30}); x+=dx;y+=dy; }
 }
 const [col,row]=corners.at(-1);cells.push({col,row,x:col*TILE+30,y:row*TILE+30});return cells;
}
export function waveEnemies(level, wave) {
 const count=6+wave*2+Math.floor(level.id*0.7);
 const result=Array.from({length:count},(_,i)=> level.id>=2 && (i+wave)%6===0?'rabbit':level.id>=3 && (i+wave)%7===0?'beetle':'slime');
 if(wave===level.waves && [3,6,9,10].includes(level.id)) result.push('boss');
 return result;
}
export function createGame(id=1) {
 const level=LEVELS[id-1]; if(!level) throw new Error('Invalid level');
 const path=expandPath(level.path);
 const slots=[];
 for(let row=0;row<10;row++) for(let col=1;col<15;col++) {
  if(path.some(p=>p.col===col&&p.row===row)) continue;
  const d=Math.min(...path.map(p=>Math.hypot(p.col-col,p.row-row)));
  if(d<=2.05 && (row+col)%2===0) slots.push({col,row,x:col*TILE+30,y:row*TILE+30});
 }
 return { level,path,slots,gold:level.gold,lives:20,wave:0,status:'planning',paused:false,speed:1,towers:[],enemies:[],projectiles:[],effects:[],events:[],queue:[],spawnTimer:0,time:0,kills:0,nextId:1,stars:0 };
}
export function towerStats(tower) {
 const base=TOWERS[tower.type]; return {...base,damage:base.damage*(1+0.7*(tower.level-1)),range:base.range+12*(tower.level-1),cooldown:base.cooldown/(1+0.1*(tower.level-1))};
}
export function upgradeCost(tower) { return Math.round(TOWERS[tower.type].cost*(tower.level===1?0.8:1.2)); }
export function sellValue(tower) { return Math.floor(tower.spent*7/10); }
export function buildTower(game,type,col,row) {
 if(!TOWERS[type] || ['won','lost'].includes(game.status) || game.paused) return null;
 const pad=game.slots.find(s=>s.col===col&&s.row===row);
 if(!pad || game.towers.some(t=>t.col===col&&t.row===row) || game.gold<TOWERS[type].cost) return null;
 game.gold-=TOWERS[type].cost;
 const tower={...pad,id:game.nextId++,type,level:1,spent:TOWERS[type].cost,cooldown:0,angle:0,kick:0};
 game.towers.push(tower); game.effects.push({x:pad.x,y:pad.y,type:'build',life:0.6,maxLife:0.6,color:TOWERS[type].color});game.events.push('build');return tower;
}
export function upgradeTower(game,id) {
 const tower=game.towers.find(t=>t.id===id);
 if(!tower || tower.level>=3 || game.gold<upgradeCost(tower) || game.paused || ['won','lost'].includes(game.status)) return false;
 const cost=upgradeCost(tower);game.gold-=cost;tower.spent+=cost;tower.level++;
 game.effects.push({x:tower.x,y:tower.y,type:'build',life:0.7,maxLife:0.7,color:'#f8d678'});game.events.push('build');return true;
}
export function sellTower(game,id) {
 if(game.paused || ['won','lost'].includes(game.status)) return false;
 const tower=game.towers.find(t=>t.id===id);if(!tower)return false;
 game.gold+=sellValue(tower);game.towers=game.towers.filter(t=>t.id!==id);return true;
}
export function startWave(game) {
 if(game.status!=='planning' || game.paused)return false;
 game.wave++;game.queue=waveEnemies(game.level,game.wave);game.spawnTimer=0.3;game.status='running';game.events.push('wave');return true;
}
function spawn(game,type) {
 const base=ENEMY_TYPES[type];const hp=28*Math.pow(1.17,game.level.id-1)*Math.pow(1.14,game.wave-1)*base.hp;
 game.enemies.push({id:game.nextId++,type,hp,maxHp:hp,progress:0,x:game.path[0].x,y:game.path[0].y,slow:0,flash:0,speed:base.speed*(1+(game.level.id-1)*0.019),reward:base.reward,damage:base.damage});
}
function hurt(game,enemy,damage,type) {
 if(enemy.hp<=0)return;
 enemy.hp-=damage;enemy.flash=0.12;
 if(type==='ice')enemy.slow=2;
 if(enemy.hp<=0){game.gold+=enemy.reward;game.kills++;game.effects.push({x:enemy.x,y:enemy.y,type:'coin',text:`+${enemy.reward}`,color:'#fff4b0',life:0.8,maxLife:0.8});game.events.push('kill');}
}
export function updateGame(game,delta) {
 if(game.paused || ['won','lost'].includes(game.status))return;
 let remaining=Math.min(delta,0.2)*game.speed;
 while(remaining>0){const dt=Math.min(remaining,0.035);tick(game,dt);remaining-=dt;if(['won','lost'].includes(game.status))break;}
}
function tick(game,dt) {
 game.time+=dt;
 game.effects.forEach(e=>e.life-=dt);game.effects=game.effects.filter(e=>e.life>0);
 game.projectiles.forEach(p=>p.life-=dt);game.projectiles=game.projectiles.filter(p=>p.life>0);
 game.towers.forEach(t=>{t.kick=Math.max(0,t.kick-dt*5);t.cooldown=Math.max(0,t.cooldown-dt);});
 if(game.status!=='running')return;
 game.spawnTimer-=dt;
 if(game.queue.length && game.spawnTimer<=0){spawn(game,game.queue.shift());game.spawnTimer=Math.max(0.4,1.05-game.level.id*0.035-game.wave*0.025);}
 for(const enemy of game.enemies) {
  if(enemy.hp<=0)continue;
  enemy.slow=Math.max(0,enemy.slow-dt);enemy.flash=Math.max(0,enemy.flash-dt);
  enemy.progress+=enemy.speed*dt*(enemy.slow>0?0.55:1);
  const step=enemy.progress/TILE;const index=Math.floor(step);
  if(index>=game.path.length-1){enemy.escaped=true;game.lives=Math.max(0,game.lives-enemy.damage);game.effects.push({x:enemy.x,y:enemy.y,type:'hit',color:'#e47158',life:0.5,maxLife:0.5});game.events.push('hurt');continue;}
  const a=game.path[index],b=game.path[index+1],f=step-index;enemy.x=a.x+(b.x-a.x)*f;enemy.y=a.y+(b.y-a.y)*f;
 }
 game.enemies=game.enemies.filter(e=>!e.escaped&&e.hp>0);
 if(game.lives===0){game.status='lost';game.events.push('lost');return;}
 for(const tower of game.towers) {
  const stats=towerStats(tower);
  const targets=game.enemies.filter(e=>e.hp>0 && Math.hypot(e.x-tower.x,e.y-tower.y)<=stats.range).sort((a,b)=>b.progress-a.progress);
  if(!targets.length)continue;
  const target=targets[0];tower.angle=Math.atan2(target.y-tower.y,target.x-tower.x);
  if(tower.cooldown>0)continue;
  tower.cooldown=stats.cooldown;tower.kick=1;
  game.projectiles.push({x:tower.x,y:tower.y-12,tx:target.x,ty:target.y,type:tower.type,life:0.22,maxLife:0.22});
  if(tower.type==='cannon'){
   game.enemies.filter(e=>e.hp>0 && Math.hypot(e.x-target.x,e.y-target.y)<78).forEach(e=>hurt(game,e,stats.damage,tower.type));
   game.effects.push({x:target.x,y:target.y,type:'blast',color:'#e9b665',life:0.4,maxLife:0.4});
  } else if(tower.type==='spark') {
   const chain=[target];let previous=target;
   for(let i=0;i<2;i++){const next=game.enemies.filter(e=>e.hp>0&&!chain.includes(e)&&Math.hypot(e.x-previous.x,e.y-previous.y)<115).sort((a,b)=>Math.hypot(a.x-previous.x,a.y-previous.y)-Math.hypot(b.x-previous.x,b.y-previous.y))[0];if(!next)break;chain.push(next);previous=next;}
   chain.forEach((e,i)=>{hurt(game,e,stats.damage*Math.pow(0.8,i),tower.type);if(i)game.projectiles.push({x:chain[i-1].x,y:chain[i-1].y,tx:e.x,ty:e.y,type:'spark',life:0.22,maxLife:0.22});});
  } else hurt(game,target,stats.damage,tower.type);
 }
 game.enemies=game.enemies.filter(e=>e.hp>0);
 if(!game.queue.length&&!game.enemies.length){
  if(game.wave>=game.level.waves){game.status='won';game.stars=game.lives===20?3:game.lives>=14?2:1;game.events.push('won');}
  else {game.status='planning';const bonus=40+game.level.id*5;game.gold+=bonus;game.events.push('clear');game.effects.push({x:WIDTH/2,y:HEIGHT/2,type:'bonus',text:`波次完成  +${bonus} 阳光`,color:'#fff4b0',life:2,maxLife:2});}
 }
}
