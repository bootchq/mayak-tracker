/* ===== ФИГУРА: КОЛЕСО-ДОЛЬКИ (правится отдельно от списка) ===== */
const GAP=1.6; // угловой зазор между дольками, °

function annular(a1,a2,rIn,rOut){
  const o1=P(a1,rOut),o2=P(a2,rOut),i2=P(a2,rIn),i1=P(a1,rIn);
  return `M${o1.x.toFixed(1)} ${o1.y.toFixed(1)} A${rOut} ${rOut} 0 0 1 ${o2.x.toFixed(1)} ${o2.y.toFixed(1)} `+
         `L${i2.x.toFixed(1)} ${i2.y.toFixed(1)} A${rIn} ${rIn} 0 0 0 ${i1.x.toFixed(1)} ${i1.y.toFixed(1)} Z`;
}

function drawWheel(){
  const sel=selDir;
  let seg='';
  DIRS.forEach(d=>{
    const a1=d.a-30+GAP, a2=d.a+30-GAP;
    const k=Math.min(dirQ(d.id),1);
    const rFill=Ri+k*(Ro-Ri);
    const dim=sel&&sel!==d.id;
    // трек-долька (тап-зона)
    seg+=`<path class="hit" data-id="${d.id}" d="${annular(a1,a2,Ri,Ro)}" fill="${d.col}" fill-opacity="${dim?.10:.16}" stroke="${sel===d.id?'#F5F5F7':d.col}" stroke-opacity="${sel===d.id?.9:.35}" stroke-width="${sel===d.id?2:1}" style="cursor:pointer;transition:fill-opacity .2s,stroke-opacity .2s"/>`;
    // заливка по квартальному %
    if(k>0.01) seg+=`<path d="${annular(a1,a2,Ri,rFill)}" fill="${d.col}" fill-opacity="${dim?.32:.9}" pointer-events="none" style="transition:fill-opacity .2s"/>`;
    // подпись: название + %
    const rMid=(Ri+Ro)/2, m=P(d.a,rMid);
    seg+=`<g pointer-events="none" fill-opacity="${dim?.5:1}">`+
      `<text x="${m.x.toFixed(1)}" y="${(m.y-2).toFixed(1)}" text-anchor="middle" fill="#F5F5F7" font-family="DM Sans" font-weight="700" font-size="13.5">${d.name}</text>`+
      `<text x="${m.x.toFixed(1)}" y="${(m.y+16).toFixed(1)}" text-anchor="middle" fill="#F5F5F7" font-family="JetBrains Mono" font-weight="700" font-size="12" opacity=".85">${pc(dirQ(d.id))}%</text>`+
      `</g>`;
  });
  // центр (уменьшен) — ПРОГРЕСС ДНЯ: кольцо + % + X/Y задач
  const dp=dayPoints();
  const rRing=Ri-13, circ=2*Math.PI*rRing, fillLen=circ*dp.pts/100;
  const center=
    `<circle cx="${C.x}" cy="${C.y}" r="${Ri-3}" fill="#0d0d12" stroke="#23232d" stroke-width="1.5"/>`+
    `<circle cx="${C.x}" cy="${C.y}" r="${rRing}" fill="none" stroke="#1b1b22" stroke-width="6"/>`+
    `<circle cx="${C.x}" cy="${C.y}" r="${rRing}" fill="none" stroke="#FF9F0A" stroke-width="6" stroke-linecap="round" stroke-dasharray="${fillLen.toFixed(1)} ${(circ-fillLen).toFixed(1)}" transform="rotate(-90 ${C.x} ${C.y})" style="transition:stroke-dasharray .5s"/>`+
    `<text x="${C.x}" y="${C.y-3}" text-anchor="middle" fill="#F5F5F7" font-family="JetBrains Mono" font-weight="800" font-size="31">${dp.pts}%</text>`+
    `<text x="${C.x}" y="${C.y+15}" text-anchor="middle" fill="#8A8F99" font-family="JetBrains Mono" font-weight="700" font-size="11.5">${dp.done} / ${dp.total} задач</text>`+
    `<text x="${C.x}" y="${C.y+29}" text-anchor="middle" fill="#5a5f6a" font-family="DM Sans" font-weight="600" font-size="9" letter-spacing="2">СЕГОДНЯ</text>`;
  document.getElementById('fig').innerHTML=seg+center;
  bindHits();
}
function drawFig(){drawWheel();}
function bindHits(){document.querySelectorAll('#fig .hit').forEach(el=>el.addEventListener('click',()=>tapSector(el.dataset.id)));}
function tapSector(id){
  selDir = (selDir===id ? null : id);
  drawFig(); renderList();
  if(selDir) setTimeout(()=>{const r=document.querySelector('.litem.open');if(r)r.scrollIntoView({behavior:'smooth',block:'nearest'});},120);
}
