import fs from 'node:fs';
import path from 'node:path';

const roots=fs.readdirSync('src/data/states').filter(file=>file.endsWith('.json')).sort();
const states=[];const places=[];
for(const file of roots){
  const data=JSON.parse(fs.readFileSync(path.join('src/data/states',file),'utf8'));
  states.push({code:data.uf_code,name:data.state_name,capital:data.capital,region:data.region});
  for(const [index,item] of (data.top_attractions||[]).entries()){
    if(!Number.isFinite(item.lat)||!Number.isFinite(item.lng))continue;
    places.push({id:`${data.uf_code.toLowerCase()}-${index}-${String(item.name).normalize('NFD').replace(/\p{Diacritic}/gu,'').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')}`,name:item.name,description:item.short_description||`Conheça ${item.name}.`,category:item.category||'turismo',free:Boolean(item.is_free),city:item.city||data.capital,state:data.state_name,code:data.uf_code,region:data.region,lat:item.lat,lng:item.lng});
  }
}
fs.mkdirSync('public/app/data',{recursive:true});
fs.writeFileSync('public/app/data/destinations.json',JSON.stringify({updatedAt:new Date().toISOString(),states,places},null,2)+'\n');
console.log(`Generated ${states.length} states and ${places.length} destinations.`);
