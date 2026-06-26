/* ===== УПРАВЛЕНИЕ ЗАДАЧАМИ + ФОРМА (правится отдельно) ===== */
function openManage(id){
  selDir=selDir||id; const d=dirById(id);
  document.getElementById('mgTitle').textContent=d.name+' · задачи';
  const ts=dirTasks(id);
  document.getElementById('mgList').innerHTML=ts.map(t=>{
    const sch=t.sched==='daily'?'каждый день':t.sched.map(x=>WD[x]).join('·');
    return `<div class="mrow" onclick="openForm(${t.id})"><span class="nm">${t.name}</span>
      <span class="meta">${t.checksQ}/${t.normQ} кв<br>${sch}</span><span style="color:var(--muted)">›</span></div>`;}).join('')
    || '<p class="muted" style="padding:24px 18px;text-align:center">Пока нет задач. Добавь первую.</p>';
  document.getElementById('mgAdd').onclick=()=>openForm(null,id);
  show('manage');
}
function openForm(id,dirPre){
  editId=id;
  document.getElementById('fmTitle').textContent=id?'Изменить задачу':'Новая задача';
  document.getElementById('fmDeleteWrap').style.display=id?'block':'none';
  let t=id?tasks.find(x=>x.id===id):null;
  const curDir=t?t.dir:(dirPre||selDir||'telo'); fmDir=curDir;
  document.getElementById('fmDirs').innerHTML=DIRS.map(d=>`<span class="chip ${d.id===curDir?'sel':''}" data-id="${d.id}" onclick="pickDir('${d.id}')">${d.name}</span>`).join('');
  document.getElementById('fmName').value=t?t.name:'';
  document.getElementById('fmNorm').value=t?t.normQ:'';
  fmSched = t? (t.sched==='daily'?[0,1,2,3,4,5,6]:t.sched.slice()) : [1,3,5];
  renderDays();
  document.getElementById('fmBack').onclick=()=>show('manage');
  document.getElementById('fmSave').onclick=saveTask;
  document.getElementById('fmDelete').onclick=()=>{tasks=tasks.filter(x=>x.id!==id);toast('Задача удалена');openManage(t.dir);};
  show('form');
}
function pickDir(id){fmDir=id;document.querySelectorAll('#fmDirs .chip').forEach(c=>c.classList.toggle('sel',c.dataset.id===id));}
function renderDays(){document.getElementById('fmDays').innerHTML=[1,2,3,4,5,6,0].map(i=>`<div class="d ${fmSched.includes(i)?'sel':''}" onclick="toggleDay(${i})">${WD[i]}</div>`).join('');updateNormHint();}
function toggleDay(i){const k=fmSched.indexOf(i);if(k>=0)fmSched.splice(k,1);else fmSched.push(i);renderDays();}
function schedPreset(p){if(p==='daily')fmSched=[0,1,2,3,4,5,6];else if(p==='work')fmSched=[1,2,3,4,5];else if(p==='135')fmSched=[1,3,5];else fmSched=[];renderDays();}
function updateNormHint(){const perWeek=fmSched.length;const est=perWeek*13;document.getElementById('fmHintNorm').textContent=perWeek?('· '+perWeek+'×/нед ≈ '+est+'/квартал'):'';}
function setNorm(v){document.getElementById('fmNorm').value=v;}
function saveTask(){
  const name=document.getElementById('fmName').value.trim();
  const norm=parseInt(document.getElementById('fmNorm').value)||0;
  const dir=document.querySelector('#fmDirs .chip.sel')?.dataset.id||fmDir;
  if(!name){toast('Впиши название');return;}
  if(!fmSched.length){toast('Выбери дни расписания');return;}
  if(norm<=0){toast('Укажи квартальную норму');return;}
  const sched=fmSched.length===7?'daily':fmSched.slice().sort();
  if(editId){const t=tasks.find(x=>x.id===editId);Object.assign(t,{name,normQ:norm,sched,dir});}
  else tasks.push({id:++tid,dir,name,sched,normQ:norm,checksQ:0,doneToday:false});
  toast('Сохранено ✓');openManage(dir);
}
