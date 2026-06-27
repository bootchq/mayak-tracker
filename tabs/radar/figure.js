/* ===== ФИГУРА: КОЛЕСО-ДОЛЬКИ (правится отдельно от списка) ===== */
/* Постоянный ЛИНЕЙНЫЙ зазор между секторами (одинаковая щель от центра к краю). */
const GAP_PX=6;
function sectorPath(a, rIn, rOut){
  const insO=(GAP_PX/2)/rOut*180/Math.PI;   // угловой отступ у внешней дуги
  const insI=(GAP_PX/2)/rIn *180/Math.PI;    // больший — у внутренней (щель та же по ширине)
  const o1=P(a-30+insO,rOut), o2=P(a+30-insO,rOut), i2=P(a+30-insI,rIn), i1=P(a-30+insI,rIn);
  return `M${o1.x.toFixed(1)} ${o1.y.toFixed(1)} A${rOut} ${rOut} 0 0 1 ${o2.x.toFixed(1)} ${o2.y.toFixed(1)} `+
         `L${i2.x.toFixed(1)} ${i2.y.toFixed(1)} A${rIn} ${rIn} 0 0 0 ${i1.x.toFixed(1)} ${i1.y.toFixed(1)} Z`;
}

function drawWheel(){
  const sel=selDir;
  let defs='<defs>', seg='';
  DIRS.forEach(d=>{
    const k=Math.min(dirQ(d.id),1), rFill=Ri+k*(Ro-Ri), dim=sel&&sel!==d.id;
    // трек-долька (тап-зона)
    seg+=`<path class="hit" data-id="${d.id}" d="${sectorPath(d.a,Ri,Ro)}" fill="${d.col}" fill-opacity="${dim?.10:.16}" stroke="${sel===d.id?'#F5F5F7':d.col}" stroke-opacity="${sel===d.id?.9:.35}" stroke-width="${sel===d.id?2:1}" style="cursor:pointer;transition:fill-opacity .2s,stroke-opacity .2s"/>`;
    // заливка по квартальному %
    if(k>0.01) seg+=`<path d="${sectorPath(d.a,Ri,rFill)}" fill="${d.col}" fill-opacity="${dim?.32:.9}" pointer-events="none" style="transition:fill-opacity .2s"/>`;
    // название ПО ДУГЕ снаружи (для нижней половины — дуга разворачивается, чтобы текст не был вверх ногами)
    const lower=d.a>90&&d.a<270, R=Ro+9;
    const p1=P(lower?d.a+25:d.a-25,R), p2=P(lower?d.a-25:d.a+25,R), id='arc_'+d.id;
    defs+=`<path id="${id}" d="M${p1.x.toFixed(1)} ${p1.y.toFixed(1)} A${R} ${R} 0 0 ${lower?0:1} ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}"/>`;
    seg+=`<text pointer-events="none" fill="${d.col}" fill-opacity="${dim?.5:1}" font-family="JetBrains Mono" font-weight="600" font-size="12"><textPath href="#${id}" startOffset="50%" text-anchor="middle">${d.name}</textPath></text>`;
    // % внутри сектора
    const m=P(d.a,(Ri+Ro)/2);
    seg+=`<text pointer-events="none" x="${m.x.toFixed(1)}" y="${(m.y+5.5).toFixed(1)}" text-anchor="middle" fill="#F5F5F7" fill-opacity="${dim?.5:1}" font-family="JetBrains Mono" font-weight="700" font-size="16">${pc(dirQ(d.id))}%</text>`;
  });
  defs+='</defs>';
  // центр — ПРОГРЕСС ДНЯ: кольцо + % + X/Y задач
  const dp=dayPoints();
  const rRing=Ri-13, circ=2*Math.PI*rRing, fillLen=circ*dp.pts/100;
  const center=
    `<circle cx="${C.x}" cy="${C.y}" r="${Ri-3}" fill="#0d0d12" stroke="#23232d" stroke-width="1.5"/>`+
    `<circle cx="${C.x}" cy="${C.y}" r="${rRing}" fill="none" stroke="#1b1b22" stroke-width="6"/>`+
    `<circle cx="${C.x}" cy="${C.y}" r="${rRing}" fill="none" stroke="#FF9F0A" stroke-width="6" stroke-linecap="round" stroke-dasharray="${fillLen.toFixed(1)} ${(circ-fillLen).toFixed(1)}" transform="rotate(-90 ${C.x} ${C.y})" style="transition:stroke-dasharray .5s"/>`+
    `<text x="${C.x}" y="${C.y-3}" text-anchor="middle" fill="#F5F5F7" font-family="JetBrains Mono" font-weight="800" font-size="31">${dp.pts}%</text>`+
    `<text x="${C.x}" y="${C.y+15}" text-anchor="middle" fill="#8A8F99" font-family="JetBrains Mono" font-weight="700" font-size="11.5">${dp.done} / ${dp.total} задач</text>`+
    `<text x="${C.x}" y="${C.y+29}" text-anchor="middle" fill="#5a5f6a" font-family="DM Sans" font-weight="600" font-size="9" letter-spacing="2">СЕГОДНЯ</text>`;
  document.getElementById('fig').innerHTML=defs+seg+center;
  bindHits();
}
function drawFig(){drawWheel();}
function bindHits(){document.querySelectorAll('#fig .hit').forEach(el=>el.addEventListener('click',()=>tapSector(el.dataset.id)));}
function tapSector(id){
  selDir = (selDir===id ? null : id);
  drawFig(); renderList();
  if(selDir) setTimeout(()=>{const r=document.querySelector('.litem.open');if(r)r.scrollIntoView({behavior:'smooth',block:'nearest'});},120);
}
