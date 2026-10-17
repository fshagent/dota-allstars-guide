// Parses heroes-*.txt into ../data/data.js. Run: node tools/build.js
const fs=require('fs'),path=require('path');
const root=path.join(__dirname,'..');
const ITEM_NAMES={
'armlet':'Armlet of Mordiggian','basher-2':'Abyssal Blade','basher':'Skull Basher','battle-fury':'Battle Fury','buriza':'Buriza-do Kyanon','butterfly':'Butterfly','crys':'Crystalys','ethereal-blade':'Ethereal Blade','lotar':"Lothar's Edge",'monkey-king-bar':'Monkey King Bar','radiance':'Radiance','rapira':'Divine Rapier',
'bottle':'Bottle','dust':'Dust of Appearance','heal-potion':'Healing Salve','mana-potion':'Clarity Potion','portal':'Scroll of Town Portal','smoke':'Smoke of Deceit','tango':'Tango','ward':'Observer Ward','ward-2':'Sentry Ward',
'dagon':'Dagon','discord':'Veil of Discord','force-staff':'Force Staff','hex':'Scythe of Vyse','necronomicon':'Necronomicon','orchid':'Orchid Malevolence','refresher':'Refresher Orb','veter':"Eul's Scepter of Divinity",
'boots':'Boots of Speed','cloak':'Cloak','dagger':'Blink Dagger','gem':'Gem of True Sight','ghost-scepter':'Ghost Scepter','haste':'Gloves of Haste','magic-wand-0':'Magic Stick','mask-death':'Mask of Death','ring-of-r':'Ring of Regeneration','shadow-amulet':'Shadow Amulet','sobi-mask':"Sage's Mask",'talisman':'Talisman of Evasion',
'desolator':'Desolator','diffuse-blade':'Diffusal Blade','dominator':'Helm of the Dominator','halberd':"Heaven's Halberd",'madjonir':'Mjollnir','maelstrom':'Maelstrom','mom':'Mask of Madness','sasha':'Sange','sasha-yasha':'Sange and Yasha','satanic':'Satanic','skadi':'Eye of Skadi','yasha':'Yasha',
'boots-of-travel':'Boots of Travel','bracer':'Bracer','magic-wand':'Magic Wand','midas':'Hand of Midas','null':'Null Talisman','oblivion-staff':'Oblivion Staff','perseverance':'Perseverance','phase-boots':'Phase Boots','pos':'Power Treads','shield-2':"Poor Man's Shield",'soul-ring':'Soul Ring',
'demon-edge':'Demon Edge','eaglehorn':'Eaglesong','energy-booster':'Energy Booster','hyperstone':'Hyperstone','messer':"Messerschmidt's Reaver",'mystic-staff':'Mystic Staff','orb-of-venom':'Orb of Venom','point-booster':'Point Booster','ring-of-h':'Ring of Health','sacred':'Sacred Relic','vitality-booster':'Vitality Booster','void-stone':'Void Stone',
'avatar':'Black King Bar','bloodstone':'Bloodstone','cirassa':'Assault Cuirass','hood':'Hood of Defiance','manta-style':'Manta Style','roshan-shield':'Blade Mail','shiva':"Shiva's Guard",'soul-booster':'Soul Booster','sphere':"Linken's Sphere",'taraska':'Heart of Tarrasque','vanguard':'Vanguard',
'belt-of-str':'Belt of Giant Strength','blade-of-a':'Blade of Alacrity','boots-of-elven':'Boots of Elvenskin','circlet':'Circlet of Nobility','mantle':'Mantle of Intelligence','ogre-axe':'Ogre Axe','ogre':'Gauntlets of Strength','robe-of-the-mage':'Robe of the Magi','spider-leg':'Slippers of Agility','staff-of-w':'Staff of Wizardry','ultimate-orb':'Ultimate Orb','vetka':'Ironwood Branch',
'aquila':'Ring of Aquila','arcane-boots':'Arcane Boots','basilus':'Ring of Basilius','buckler':'Buckler','endur':'Drum of Endurance','headdress':'Headdress of Rejuvenation','medal':'Medallion of Courage','meka':'Mekansm','pipe':'Pipe of Insight','tran-boots':'Tranquil Boots','urna':'Urn of Shadows','vladimir':"Vladmir's Offering",
'blades-of-a':'Blades of Attack','broadsword':'Broadsword','chain':'Chainmail','claymore':'Claymore','helm-of-i':'Helm of Iron Will','javelin':'Javelin','multi-hammer':'Mithril Hammer','plate-mail':'Platemail','quart':'Quarterstaff','ring-of-p':'Ring of Protection','shield':'Stout Shield','toporik':'Battle Axe'};
const ALIAS={'blink-dagger':'dagger','blade-mail':'roshan-shield','heart':'taraska','abyssal':'basher-2'};
const SKILLPFX={admiral:'kunka',dk:'drakon-knight',io:'wisp',rigwarl:'kaban'};
const ATTR={};
for(const [a,d] of [['str','Strength'],['agi','Agility'],['int','Intelegence']])
  for(const n of fs.readdirSync('/tmp/src/images/heroes/'+d))ATTR[n.replace('.png','')]=a;
const heroes=[],errs=[];
for(const f of ['str','agi','int']){
  for(const line of fs.readFileSync(path.join(__dirname,`heroes-${f}.txt`),'utf8').split('\n').filter(Boolean)){
    const [code,name,skills,roles,order,tip,builds]=line.split('|');
    const sk=skills.split(';');
    if(sk.length!==4)errs.push(code+': skills');
    if(order.length!==16||!/^[0-4]+$/.test(order))errs.push(code+': order '+order);
    if(ATTR[code]!==f)errs.push(code+': attr '+ATTR[code]+' vs '+f);
    const pfx=SKILLPFX[code]||code;
    const skillsOut=sk.map((s,i)=>{const file=`img/skills/${pfx}-${i+1}.png`;if(!fs.existsSync(path.join(root,file)))errs.push(code+': missing '+file);return {name:s,icon:file};});
    const bs=builds.split('||').map(b=>{
      const [title,rest]=b.split(':').map(x=>x.trim());
      const [start,core,late]=rest.split('/').map(g=>g.trim().split(/\s+/).filter(Boolean).map(i=>ALIAS[i]||i));
      for(const i of [...start,...core,...late])if(!ITEM_NAMES[i])errs.push(code+': item '+i);
      return {title,start,core,late};
    });
    heroes.push({id:code,name,attr:f,roles:roles.split(','),skills:skillsOut,order,tip,builds:bs});
  }
}
const missingH=Object.keys(ATTR).filter(c=>!heroes.some(h=>h.id===c));
console.log('heroes',heroes.length,'not included:',missingH.join(','));
if(errs.length){console.log(errs.join('\n'));process.exit(1);}
fs.mkdirSync(path.join(root,'data'),{recursive:true});
fs.writeFileSync(path.join(root,'data/data.js'),'window.DOTA='+JSON.stringify({items:ITEM_NAMES,heroes})+';\n');
