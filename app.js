(function(){
const {heroes:HEROES}=window.DOTA;
const app=document.getElementById('app');
const ATTRS=[['str','Strength'],['agi','Agility'],['int','Intelligence']];
const COLORS={str:'var(--str)',agi:'var(--agi)',int:'var(--int)'};
const state={q:'',attr:'all'};
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const byId=Object.fromEntries(HEROES.map(h=>[h.id,h]));

function chip(label,key,val){return `<button class="chip" data-k="${key}" data-v="${val}" aria-pressed="${state[key]===val}">${esc(label)}</button>`;}

function listView(){
  app.innerHTML=`<div class="tools">
    <input class="search" type="search" placeholder="Search ${HEROES.length} heroes…" value="${esc(state.q)}" aria-label="Search heroes" autocomplete="off">
    <div class="chips">${chip('All','attr','all')}${ATTRS.map(([k,l])=>chip(l,'attr',k)).join('')}</div>
  </div><div id="results"></div>`;
  const input=app.querySelector('.search');
  input.addEventListener('input',()=>{state.q=input.value;renderResults();});
  app.querySelectorAll('.chip').forEach(b=>b.addEventListener('click',()=>{
    state[b.dataset.k]=b.dataset.v;
    app.querySelectorAll(`.chip[data-k="${b.dataset.k}"]`).forEach(x=>x.setAttribute('aria-pressed',x===b));
    renderResults();}));
  renderResults();
}
function renderResults(){
  const q=state.q.trim().toLowerCase();
  const list=HEROES.filter(h=>(state.attr==='all'||h.attr===state.attr)&&(!q||h.name.toLowerCase().includes(q)));
  const box=document.getElementById('results');
  if(!list.length){box.innerHTML='<p class="empty">No heroes match your search.</p>';return;}
  box.innerHTML=ATTRS.map(([k,l])=>{
    const g=list.filter(h=>h.attr===k).sort((a,b)=>a.name.localeCompare(b.name));
    if(!g.length)return '';
    return `<section class="group"><h2><span class="dot" style="background:${COLORS[k]}"></span>${l} <small style="color:var(--mute)">(${g.length})</small></h2>
      <div class="grid">${g.map(h=>`<a class="card" href="#/hero/${h.id}"><img src="img/heroes/${h.id}.png" alt="" loading="lazy" width="64" height="64"><b>${esc(h.name)}${h.guide?' ★':''}</b></a>`).join('')}</div></section>`;
  }).join('');
}

function itemHtml(it){return `<div class="item" title="${esc(it.name)}"><img src="img/items/${it.id}.png" alt="${esc(it.name)}" loading="lazy"><span>${esc(it.name)}</span></div>`;}
function phase(label,its){return its.length?`<div class="phase"><h4>${label}</h4><div class="items">${its.map(itemHtml).join('')}</div></div>`:'';}

function guideHtml(g){
  const lv=g.order.map((s,n)=>s.icon
    ?`<div class="lvl"><i>Lv ${n+1}</i><img src="${s.icon}" alt="Skill for level ${n+1}" loading="lazy"></div>`
    :`<div class="lvl"><i>Lv ${n+1}</i><div class="plus">+</div></div>`).join('');
  return `<h2>Guide</h2>
  <p class="source">Source: <a href="${esc(g.source.url)}" target="_blank" rel="noopener">${esc(g.source.name)}</a><br><small>${esc(g.source.note)}</small></p>
  ${g.info?`<p class="tip">${esc(g.info)}</p>`:''}
  ${g.stats?`<ul class="stats">${g.stats.map(s=>`<li>${esc(s)}</li>`).join('')}</ul>`:''}
  <h2>Skill order</h2>
  <div class="order">${lv}</div>
  <p class="note">“+” = put the point into attributes.</p>
  <h2>Item guides</h2>
  ${g.builds.map(b=>`<article class="build"><h3>${esc(b.title)}</h3>${phase('Begin',b.start)}${phase('Half',b.mid)}${phase('End',b.end)}</article>`).join('')}`;
}

function heroView(id){
  const h=byId[id];
  if(!h){location.hash='#/';return;}
  const sorted=[...HEROES].sort((a,b)=>a.name.localeCompare(b.name));
  const i=sorted.indexOf(h),prev=sorted[(i-1+sorted.length)%sorted.length],next=sorted[(i+1)%sorted.length];
  const attrName=ATTRS.find(a=>a[0]===h.attr)[1];
  app.innerHTML=`<div class="nav"><a class="btn" href="#/">← All heroes</a><span style="display:flex;gap:8px"><a class="btn" href="#/hero/${prev.id}" aria-label="Previous hero: ${esc(prev.name)}">‹</a><a class="btn" href="#/hero/${next.id}" aria-label="Next hero: ${esc(next.name)}">›</a></span></div>
  <section class="hero"><img src="img/heroes/${h.id}.png" alt="${esc(h.name)}"><div><h1>${esc(h.name)}</h1>
    <div class="tags"><span class="tag attr ${h.attr}">${attrName}</span></div></div></section>
  <h2>Abilities</h2>
  <div class="skillrow">${h.skills.map(s=>`<img src="${s}" alt="" loading="lazy">`).join('')}</div>
  ${h.guide?guideHtml(h.guide):`<p class="tip">No guide yet. Only guides that come from a named source are shown here, and none has been added for this hero.</p>`}`;
  document.title=h.name+' – DotA Allstars Guide';
  window.scrollTo(0,0);
}

function route(){
  const m=location.hash.match(/^#\/hero\/([\w-]+)/);
  if(m)heroView(m[1]);
  else{document.title='DotA Allstars Hero Guides';const y=window.__y||0;listView();window.scrollTo(0,y);}
}
window.addEventListener('scroll',()=>{if(!location.hash.startsWith('#/hero'))window.__y=scrollY;},{passive:true});
window.addEventListener('hashchange',route);
route();
})();
