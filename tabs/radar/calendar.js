/* ===== КАЛЕНДАРЬ УДАРНОГО РЕЖИМА (правится отдельно) ===== */
/* демо: пропущенные дни (сколько дней назад). В Фазе 2 — из реальных checks. */
const MISSED_AGO=[7,12,13];

function renderCal(){
  const today=new Date(); today.setHours(0,0,0,0);
  let html='';
  for(let i=34;i>=0;i--){                // 34 дней назад → сегодня (5 недель)
    const d=new Date(today); d.setDate(d.getDate()-i);
    const miss=MISSED_AGO.includes(i), isToday=i===0;
    const cls = isToday ? 'today done' : (miss ? 'miss' : 'done');
    html+=`<div class="cal-cell ${cls}">${d.getDate()}</div>`;
  }
  document.getElementById('calGrid').innerHTML=html;
  const miss30=MISSED_AGO.filter(x=>x<30).length;
  document.getElementById('calSub').innerHTML=`<b>${STREAK}</b> дней подряд · пропусков за месяц: <b style="color:#FF453A">${miss30}</b>`;
}
function openCal(){renderCal();document.getElementById('calModal').classList.add('show');}
function closeCal(){document.getElementById('calModal').classList.remove('show');}
