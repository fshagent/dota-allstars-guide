// Builds data/data.js from tools/heroes.txt (id|name|attr|skill icon prefix) and tools/guides.json (sourced guides only).
const fs=require('fs'),path=require('path');
const root=path.join(__dirname,'..');
const guides=JSON.parse(fs.readFileSync(path.join(__dirname,'guides.json'),'utf8'));
const errs=[],heroes=[];
for(const line of fs.readFileSync(path.join(__dirname,'heroes.txt'),'utf8').split('\n').filter(Boolean)){
  const [id,name,attr,pfx]=line.split('|');
  const skills=[1,2,3,4].map(i=>`img/skills/${pfx}-${i}.png`).filter(f=>fs.existsSync(path.join(root,f)));
  if(!fs.existsSync(path.join(root,`img/heroes/${id}.png`)))errs.push('missing portrait '+id);
  heroes.push({id,name,attr,skills,guide:guides[id]||null});
}
for(const g of Object.values(guides)){
  for(const s of g.order)if(s.icon&&!fs.existsSync(path.join(root,s.icon)))errs.push('missing '+s.icon);
  for(const b of g.builds)for(const ph of ['start','mid','end'])for(const it of b[ph])if(!fs.existsSync(path.join(root,'img/items/'+it.id+'.png')))errs.push('missing item '+it.id);
}
if(errs.length){console.log(errs.join('\n'));process.exit(1);}
fs.writeFileSync(path.join(root,'data/data.js'),'window.DOTA='+JSON.stringify({heroes})+';\n');
console.log('heroes',heroes.length,'with guide',heroes.filter(h=>h.guide).length);
