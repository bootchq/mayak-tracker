/* ===== СБОРКА ЭКРАНА: навигация home/manage/form + старт ===== */
function renderHome(){
  drawFig(); renderList();
  // шапка «Непрерывно» (ударный режим)
  document.getElementById('streakN').textContent=STREAK;
  document.getElementById('udarBadge').style.display = STREAK>0 ? '' : 'none';
  // строка индекса
  const idx=mayakIndex(),b=bandFor(idx);
  document.getElementById('idxline').innerHTML=`Индекс Маяка <b style="color:#F5F5F7">${idx}</b> · <span style="color:${b[2]}">${b[1]}</span>`;
}
function show(id){
  document.querySelectorAll('.screen').forEach(s=>s.classList.remove('on'));
  document.getElementById(id).classList.add('on');curScreen=id;
  if(id==='home')renderHome();
}

show('home');
/* сигнал shell-у, что модуль загрузился (для error-boundary/изоляции) */
try{parent.postMessage({type:'tab-ready',tab:'radar'},'*');}catch(e){}
