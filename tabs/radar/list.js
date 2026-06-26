/* ===== АККОРДЕОН-СПИСОК НАПРАВЛЕНИЙ (правится отдельно от фигуры) ===== */
/* слева — шеврон-стрелка вниз (подсказка «можно раскрыть»), при открытии поворачивается вверх */
function chevSVG(col){
  return `<svg class="chev" width="16" height="16" viewBox="0 0 16 16" style="color:${col}"><path d="M4 6l4 4 4-4" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
}
function renderList(){
  document.getElementById('dlist').innerHTML=DIRS.map(d=>{
    const q=dirQ(d.id), open=selDir===d.id;
    const tt=dirTodayTasks(d.id);
    let exp='';
    if(open){
      const rows=tt.length
        ? tt.map(t=>`<div class="titem ${t.doneToday?'done':''}" style="color:${d.col}" onclick="event.stopPropagation();toggle(${t.id})"><span class="box">${t.doneToday?'✓':''}</span><span class="nm">${t.name}</span><span class="q">${t.checksQ}/${t.normQ} кв</span></div>`).join('')
        : `<div class="empty">На сегодня (${WD[TODAY]}) задач в этом направлении нет.<br>Добавь или измени расписание ниже.</div>`;
      exp=`<div class="lexp">${rows}<div class="foot"><button class="lnk" onclick="event.stopPropagation();openManage('${d.id}')">Изменить задачи ›</button></div></div>`;
    }
    return `<div class="litem ${open?'open':''}">
      <div class="lrow" onclick="tapSector('${d.id}')">
        ${chevSVG(d.col)}
        <span class="lname">${d.name}</span>
        <span class="lbar"><i style="width:${pc(Math.min(q,1))}%;background:${d.col}"></i></span>
        <span class="lpc" style="color:${d.col}">${pc(q)}%</span>
      </div>${exp}</div>`;
  }).join('');
}
function toggle(id){
  const t=tasks.find(x=>x.id===id);if(!t)return;
  if(t.doneToday){t.doneToday=false;t.checksQ=Math.max(0,t.checksQ-1);}
  else{t.doneToday=true;t.checksQ=Math.min(t.checksQ+1,Math.round(t.normQ*1.2));}
  drawFig(); renderList();
  const tt=dirTodayTasks(t.dir),done=tt.filter(x=>x.doneToday).length;
  if(tt.length&&done===tt.length) toast('«'+dirById(t.dir).name+'» закрыт на сегодня ✓');
}
