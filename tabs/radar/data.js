/* ===== ДАННЫЕ + РАСЧЁТЫ (источник правды экрана «Радар») ===== */

/* геометрия фигуры: центр уменьшен на ~15%, кольцо-сектора шире */
const C={x:180,y:180}, Ro=152, Ri=78;
function P(a,rad){const t=a*Math.PI/180;return{x:C.x+rad*Math.sin(t),y:C.y-rad*Math.cos(t)};}
function fmtP(p){return p.map(q=>q.x.toFixed(1)+','+q.y.toFixed(1)).join(' ');}

const WD=['вс','пн','вт','ср','чт','пт','сб']; // getDay 0..6
const TODAY=(new Date()).getDay();

const DIRS=[
 {id:'duh',   name:'Дух',          a:0,   col:'#64D2FF', tri:'Ф'},
 {id:'komm',  name:'Коммуникации', a:60,  col:'#FF9F0A', tri:'Р'},
 {id:'telo',  name:'Тело',         a:120, col:'#30D158', tri:'Ф'},
 {id:'delo',  name:'Дело',         a:180, col:'#FFD54A', tri:'Р'},
 {id:'razum', name:'Разум',        a:240, col:'#BF5AF2', tri:'Ф'},
 {id:'energy',name:'Энергия',      a:300, col:'#FF453A', tri:'Р'},
];
const dirById=id=>DIRS.find(d=>d.id===id);

/* непрерывный режим (демо; в Фазе 2 — из реальных данных) */
const STREAK=7;

let tid=0;
let tasks=[
 ['duh','Намаз 5 раз','daily',150,120,true],
 ['duh','Чтение Корана','daily',90,64,false],
 ['telo','Тренировка',[1,3,5],39,22,false],
 ['telo','Сон 7+ часов','daily',90,70,true],
 ['telo','10 000 шагов','daily',90,55,false],
 ['razum','Чтение книг','daily',90,75,true],
 ['razum','Обучение/курс',[2,4],26,18,false],
 ['komm','Время с детьми','daily',80,34,false],
 ['komm','Звонок родителям',[0],13,7,false],
 ['komm','Встреча с друзьями',[6],12,4,false],
 ['energy','Прогулка','daily',60,48,true],
 ['energy','Медитация','daily',90,60,false],
 ['delo','Глубокая работа',[1,2,3,4,5],100,80,false],
 ['delo','Контент-выход',[1,3,5],39,35,false],
].map(t=>({id:++tid,dir:t[0],name:t[1],sched:t[2],normQ:t[3],checksQ:t[4],doneToday:t[5]}));

/* состояние UI */
let selDir=null, editId=null, curScreen='home', fmDir='telo', fmSched=[];

/* расчёты */
const isToday=t=> t.sched==='daily' || (Array.isArray(t.sched)&&t.sched.includes(TODAY));
const todayTasks=()=>tasks.filter(isToday);
const dirTasks=id=>tasks.filter(t=>t.dir===id);
const dirTodayTasks=id=>dirTasks(id).filter(isToday);
function dayPoints(){const tt=todayTasks();if(!tt.length)return{done:0,total:0,pts:0};
  const done=tt.filter(t=>t.doneToday).length;return{done,total:tt.length,pts:Math.round(done/tt.length*100)};}
function dirQ(id){const ts=dirTasks(id);if(!ts.length)return 0;
  let s=0;ts.forEach(t=>s+=t.normQ>0?Math.min(t.checksQ/t.normQ,1.2):0);return s/ts.length;}
function mayakIndex(){return Math.round(DIRS.reduce((a,d)=>a+Math.min(dirQ(d.id),1),0)/DIRS.length*100);}
const pc=v=>Math.round(v*100);

const BANDS=[[0,'Железо','#9aa0aa'],[15,'Бронза','#C97B43'],[30,'Серебро','#C7CCD6'],
  [45,'Золото','#E0A23C'],[60,'Платина','#7FE0D0'],[75,'Алмаз','#7CC4FF'],[90,'Обсидиан','#B58Cff']];
const bandFor=i=>{let b=BANDS[0];for(const x of BANDS)if(i>=x[0])b=x;return b;};

let _t;function toast(m){const n=document.getElementById('toast');n.textContent=m;n.classList.add('show');clearTimeout(_t);_t=setTimeout(()=>n.classList.remove('show'),2000);}
