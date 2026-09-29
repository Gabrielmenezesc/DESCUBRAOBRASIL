import fs from 'node:fs';
const SOURCE='https://www.gov.br/turismo/pt-br/assuntos/noticias';
const response=await fetch(SOURCE,{headers:{'user-agent':'DescubraOBrasil/1.0 (+https://github.com/Gabrielmenezesc/DESCUBRAOBRASIL)'}});
if(!response.ok)throw new Error(`News source returned ${response.status}`);
const html=await response.text();
const decode=value=>value.replace(/<[^>]+>/g,' ').replace(/&amp;/g,'&').replace(/&quot;/g,'"').replace(/&#39;|&apos;/g,"'").replace(/&nbsp;/g,' ').replace(/\s+/g,' ').trim();
const items=[];
const matches=[...html.matchAll(/<h2 class="tileHeadline">[\s\S]*?<a class="summary url" href="(https:\/\/www\.gov\.br\/turismo\/[^"#]+)"[^>]*>([\s\S]*?)<\/a>[\s\S]*?<\/h2>/g)].slice(0,12);
for(let index=0;index<matches.length;index++){
 const link=matches[index];
 const end=matches[index+1]?.index ?? Math.min(html.length,link.index+4000);
 const date=html.slice(link.index,end).match(/(\d{2})\/(\d{2})\/(\d{4})/);
 items.push({title:decode(link[2]),url:link[1],date:date?`${date[3]}-${date[2]}-${date[1]}T12:00:00-03:00`:null});
}
if(items.length<3)throw new Error(`Only ${items.length} news items parsed; keeping existing file.`);
fs.mkdirSync('public/app/data',{recursive:true});
fs.writeFileSync('public/app/data/news.json',JSON.stringify({source:SOURCE,fetchedAt:new Date().toISOString(),items},null,2)+'\n');
console.log(`Updated ${items.length} tourism news items.`);
