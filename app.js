(function(){
const {items:ITEMS,heroes:HEROES}=window.DOTA;
const app=document.getElementById('app');
const ATTRS=[['str','Strength'],['agi','Agility'],['int','Intelligence']];
const COLORS={str:'var(--str)',agi:'var(--agi)',int:'var(--int)'};
const state={q:'',attr:'all',role:'all'};
const ROLES=[...new Set(HEROES.flatMap(h=>h.roles))].sort();
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const byId=Object.fromEntries(HEROES.map(h=>[h.id,h]));

function chip(label,key,val){return `<button class="chip" data-k="${key}" data-v="${val}" aria-pressed="${state[key]===val}">${esc(label)}</button>`;}

function listView(){
  app.innerHTML=`<div class="tools">
    <input class="search" type="search" placeholder="Search ${HEROES.length} heroes…" value="${esc(state.q)}" aria-label="Search heroes" autocomplete="off">
    <div class="chips">${chip('All','attr','all')}${ATTRS.map(([k,l])=>chip(l,'attr',k)).join('')}</div>
    <div class="chips">${chip('Any role','role','all')}${ROLES.map(r=>chip(r,'role',r)).join('')}</div>
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
  const list=HEROES.filter(h=>(state.attr==='all'||h.attr===state.attr)&&(state.role==='all'||h.roles.includes(state.role))&&(!q||h.name.toLowerCase().includes(q)));
  const box=document.getElementById('results');
  if(!list.length){box.innerHTML='<p class="empty">No heroes match your search.</p>';return;}
  box.innerHTML=ATTRS.map(([k,l])=>{
    const g=list.filter(h=>h.attr===k).sort((a,b)=>a.name.localeCompare(b.name));
    if(!g.length)return '';
    return `<section class="group"><h2><span class="dot" style="background:${COLORS[k]}"></span>${l} <small style="color:var(--mute)">(${g.length})</small></h2>
      <div class="grid">${g.map(h=>`<a class="card" href="#/hero/${h.id}"><img src="img/heroes/${h.id}.png" alt="" loading="lazy" width="64" height="64"><b>${esc(h.name)}</b></a>`).join('')}</div></section>`;
  }).join('');
}

function itemHtml(id){return `<div class="item" title="${esc(ITEMS[id])}"><img src="img/items/${id}.png" alt="${esc(ITEMS[id])}" loading="lazy"><span>${esc(ITEMS[id])}</span></div>`;}
function phase(label,ids){return ids.length?`<div class="phase"><h4>${label}</h4><div class="items">${ids.map(itemHtml).join('')}</div></div>`:'';}

function heroView(id){
  const h=byId[id];
  if(!h){location.hash='#/';return;}
  const sorted=[...HEROES].sort((a,b)=>a.name.localeCompare(b.name));
  const i=sorted.indexOf(h),prev=sorted[(i-1+sorted.length)%sorted.length],next=sorted[(i+1)%sorted.length];
  const attrName=ATTRS.find(a=>a[0]===h.attr)[1];
  const lv=[...h.order].map((c,n)=>{
    const s=+c;
    if(!s)return `<div class="lvl"><i>${n+1}</i><div style="width:100%;max-width:56px;margin:0 auto;aspect-ratio:1;display:grid;place-items:center;border:1px dashed var(--line);border-radius:5px;color:var(--gold);font-size:1.4rem">+</div><small>Attributes</small></div>`;
    const sk=h.skills[s-1];
    return `<div class="lvl${s===4?' ult':''}"><i>Lv ${n+1}</i><img src="${sk.icon}" alt="${esc(sk.name)}" loading="lazy"><small>${esc(sk.name)}</small></div>`;}).join('');
  app.innerHTML=`<div class="nav"><a class="btn" href="#/">← All heroes</a><span style="display:flex;gap:8px"><a class="btn" href="#/hero/${prev.id}" aria-label="Previous hero: ${esc(prev.name)}">‹</a><a class="btn" href="#/hero/${next.id}" aria-label="Next hero: ${esc(next.name)}">›</a></span></div>
  <section class="hero"><img src="img/heroes/${h.id}.png" alt="${esc(h.name)}"><div><h1>${esc(h.name)}</h1>
    <div class="tags"><span class="tag attr ${h.attr}">${attrName}</span>${h.roles.map(r=>`<span class="tag">${esc(r)}</span>`).join('')}</div></div></section>
  <p class="tip">${esc(h.tip)}</p>
  <h2>Abilities</h2>
  <div class="skills">${h.skills.map((s,n)=>`<div class="skill"><img src="${s.icon}" alt="" loading="lazy"><div><small>${n===3?'Ultimate':'Skill '+(n+1)}</small><span>${esc(s.name)}</span></div></div>`).join('')}</div>
  <h2>Skill build</h2>
  <div class="order">${lv}</div>
  <p class="note">Ultimates are learned at levels 6, 11 and 16. “+” = put the point into attributes.</p>
  <h2>Item guides</h2>
  ${h.builds.map(b=>`<article class="build"><h3>${esc(b.title)}</h3>${phase('Starting',b.start)}${phase('Core',b.core)}${phase('Late game',b.late)}</article>`).join('')}`;
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
