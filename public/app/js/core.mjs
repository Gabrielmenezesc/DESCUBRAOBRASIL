export const normalize = value => String(value).normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase();
export const escapeHTML = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function safeURL(value) { try { const u=new URL(value); return u.protocol==='https:'?u.href:''; } catch { return ''; } }
export function dayKey(date=new Date()) { return new Intl.DateTimeFormat('en-CA',{timeZone:'America/Sao_Paulo',year:'numeric',month:'2-digit',day:'2-digit'}).format(date); }
export function shuffle(items,random=Math.random) { const c=[...items];for(let i=c.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[c[i],c[j]]=[c[j],c[i]];}return c; }
export function dailyQuiz(states,day=dayKey()) {
 let seed=[...day].reduce((n,c)=>(n*31+c.charCodeAt(0))>>>0,7);
 const random=()=>((seed=(Math.imul(seed,1664525)+1013904223)>>>0)/4294967296);
 return shuffle(states,random).slice(0,5).map(s=>({id:s.code,prompt:`Qual é a capital de ${s.name}?`,answer:s.capital,choices:shuffle([s.capital,...shuffle(states.filter(x=>x.capital!==s.capital),random).slice(0,3).map(x=>x.capital)],random)}));
}
export const freshProgress=()=>({awards:{},favorites:[],itinerary:[],bestMemory:null});
export function cleanProgress(value,validIds=null) {
 const v=value&&typeof value==='object'?value:{};
 const ids=k=>Array.isArray(v[k])?[...new Set(v[k].filter(x=>typeof x==='string'&&(!validIds||validIds.has(x))))].slice(0,200):[];
 const awards={};for(const [k,p] of Object.entries(v.awards||{}))if(/^(quiz|memory|visit):[\w-]+$/.test(k)&&Number.isInteger(p)&&p>=0&&p<=100)awards[k]=p;
 return {awards,favorites:ids('favorites'),itinerary:ids('itinerary'),bestMemory:Number.isInteger(v.bestMemory)&&v.bestMemory>=6?v.bestMemory:null};
}
export function award(progress,key,points){if(Object.hasOwn(progress.awards,key))return false;progress.awards[key]=points;return true;}
export const totalXP=progress=>Object.values(progress.awards).reduce((s,x)=>s+x,0);
export function distanceMeters(a,b){const rad=x=>x*Math.PI/180,dLat=rad(b.lat-a.lat),dLng=rad(b.lng-a.lng);const h=Math.sin(dLat/2)**2+Math.cos(rad(a.lat))*Math.cos(rad(b.lat))*Math.sin(dLng/2)**2;return 6371000*2*Math.atan2(Math.sqrt(h),Math.sqrt(1-h));}
export function checkVisit(coords,place){if(!Number.isFinite(coords.accuracy)||coords.accuracy>100)return {ok:false,message:'O GPS está impreciso. Tente novamente em uma área aberta.'};const distance=distanceMeters({lat:coords.latitude,lng:coords.longitude},place);return {ok:distance<=300,distance,message:distance<=300?'Visita registrada.':`Você está a ${Math.round(distance).toLocaleString('pt-BR')} metros. Aproxime-se a até 300 metros do local.`};}
export function offerPrice(original,promotional){const base=Math.round(Number(original)*100),price=Math.round(Number(promotional)*100);if(!Number.isSafeInteger(base)||!Number.isSafeInteger(price)||base<=0||price<0||price>=base)throw new Error('Informe um preço promocional menor que o preço original.');return {base,price,percent:Math.round((base-price)/base*100)};}
export function offerIsActive(o,now=new Date()){return o.status==='approved'&&new Date(o.starts_at)<=now&&new Date(o.ends_at)>now&&o.original_cents>o.price_cents&&o.price_cents>=0;}
