import {normalize,escapeHTML as e,safeURL,dayKey,shuffle,dailyQuiz,freshProgress,cleanProgress,award,totalXP,checkVisit,offerPrice,offerIsActive} from './core.mjs';

import { mountMaya } from './maya.mjs?v=18';
import { mountBrazilMap } from './mapa-vivo.mjs?v=5';
import { introAudioData } from './intro-audio.mjs?v=1';

const $=id=>document.getElementById(id), content=$('content');
const paths={mapa:'<path d="M3 6l6-3 6 3 6-3v15l-6 3-6-3-6 3Z"/><path d="M9 3v15m6-12v15"/>',explorar:'<circle cx="11" cy="11" r="7"/><path d="m16 16 5 5"/>',jogos:'<path d="M8 6h8l4 5 1 7-3 1-4-4h-4l-4 4-3-1 1-7Z"/><path d="M6 10v4m-2-2h4m8-1h.1m2 2h.1"/>',ofertas:'<path d="M3 3h8l10 10-8 8L3 11Z"/><circle cx="7" cy="7" r="1"/>',noticias:'<path d="M4 3h16v18H4Z M8 7h8M8 11h8M8 15h8"/>',empresas:'<path d="M4 21V7l8-4 8 4v14M2 21h20M8 8v2m8-2v2M8 13v2m8-2v2M10 21v-4h4v4"/>',conta:'<circle cx="12" cy="8" r="4"/><path d="M4 21v-2a8 8 0 0 1 16 0v2"/>',sun:'<circle cx="12" cy="12" r="4"/><path d="M12 1v3m0 16v3M1 12h3m16 0h3M4 4l2 2m12 12 2 2M4 20l2-2M18 6l2-2"/>',moon:'<path d="M21 13A9 9 0 0 1 11 3a9 9 0 1 0 10 10Z"/>',arrow:'<path d="M4 12h16m-6-6 6 6-6 6"/>',heart:'<path d="M20 4c-3-3-7-1-8 1-1-2-5-4-8-1-4 4 0 9 8 16 8-7 12-12 8-16Z"/>',mic:'<rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3m-4 0h8"/>',locate:'<circle cx="12" cy="12" r="3"/><path d="M12 2v3m0 14v3M2 12h3m14 0h3"/>'};
const icon=name=>`<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[name]||paths.arrow}</svg>`;
const visualPhotos={
  'rio de janeiro':'photo-1483729558449-99ef09a8c325',
  'salvador':'photo-1549918864-48ac978761a4',
  'foz do iguacu':'photo-1610741083757-34e0a0e0f4ec',
  'fernando de noronha':'photo-1559825481-12a05cc00344',
  'brasilia':'photo-1598971457999-ca4ef48a9a71',
  'manaus':'photo-1516026672322-bc52d61a55d5'
};
const categoryPhotos={praia:'photo-1559825481-12a05cc00344',natureza:'photo-1516026672322-bc52d61a55d5',aventura:'photo-1610741083757-34e0a0e0f4ec',cultura:'photo-1549918864-48ac978761a4',gastronomia:'photo-1414235077428-338989a2e8c0'};
function photoFor(place){const city=normalize(place.city||'');const photo=visualPhotos[city]||categoryPhotos[place.category]||'photo-1500530855697-b586d89ba3ee';return 'https://images.unsplash.com/'+photo+'?auto=format&fit=crop&w=900&q=82';}

const labels={explorar:'Início',jogos:'Jogos',ofertas:'Ofertas',noticias:'Notícias',conta:'Conta'};
let states=[],places=[],config={},client=null,user=null,progress=freshProgress(),epoch=0,toastTimer,gameTimer,localOnly=false,mayaDrawerMounted=false;
let search=new URLSearchParams(location.search).get('q')||'',region='',selectedState='',selectedCategory='',onlySaved=false,nearbyCoordinates=null;

function setupMobileIntro(){
  const intro=$('mobile-intro');if(!intro)return;
  const mobile=matchMedia('(max-width:700px)').matches;
  if(!mobile){intro.remove();return;}
  const reduced=matchMedia('(prefers-reduced-motion:reduce)').matches;
  const connection=navigator.connection||navigator.mozConnection||navigator.webkitConnection;
  const capable=!reduced&&!connection?.saveData&&(navigator.deviceMemory||4)>=4&&(navigator.hardwareConcurrency||4)>=4;
  document.documentElement.classList.add(capable?'enhanced-motion':'standard-motion');
  const video=intro.querySelector('video');
  const introAudio=$('intro-audio'),soundButton=$('intro-sound');
  if(introAudio){introAudio.src=introAudioData;introAudio.load();}
  let audioStarted=false;
  const playIntroSound=()=>{
    if(!introAudio||audioStarted)return;
    introAudio.volume=.82;
    const playback=introAudio.play();
    if(playback&&typeof playback.catch==='function'){
      playback.then(()=>{audioStarted=true;soundButton?.setAttribute('hidden','');}).catch(()=>{
        intro.classList.add('sound-needs-gesture');
        soundButton?.removeAttribute('hidden');
      });
    }
  };
  video?.addEventListener('error',()=>intro.classList.add('video-unavailable'),{once:true});
  introAudio?.addEventListener('error',()=>soundButton?.setAttribute('hidden',''),{once:true});
  soundButton?.addEventListener('click',()=>{audioStarted=false;playIntroSound();});
  intro.addEventListener('pointerdown',playIntroSound,{once:true});
  setTimeout(playIntroSound,120);
  let closed=false;
  const releaseScroll=()=>{
    document.body.classList.remove('intro-open');
    document.body.style.removeProperty('overflow');
    document.documentElement.style.removeProperty('overflow');
  };
  const close=()=>{
    if(closed)return;
    closed=true;
    intro.classList.add('is-leaving');
    if(introAudio){introAudio.pause();introAudio.currentTime=0;}
    releaseScroll();
    setTimeout(()=>{intro.remove();releaseScroll();},850);
  };
  document.body.classList.add('intro-open');
  window.addEventListener('pageshow',()=>{if(!document.getElementById('mobile-intro'))releaseScroll();},{once:true});
  const introTimer=setTimeout(()=>intro.classList.add('is-ready'),6000);
  $('enter-app').onclick=()=>{clearTimeout(introTimer);close();};
  intro.querySelectorAll('[data-enter-app]').forEach(link=>link.onclick=()=>{clearTimeout(introTimer);close();});
  intro.querySelectorAll('[data-intro-account]').forEach(button=>button.onclick=()=>{
    clearTimeout(introTimer);
    const provider=button.dataset.introAccount;
    close();
    location.hash='conta';
    setTimeout(()=>toast(provider==='facebook'?'A entrada com Facebook será liberada após a configuração oficial.':'Continue o acesso pela área de conta.'),900);
  });
  intro.addEventListener('transitionend',()=>{if(intro.classList.contains('is-leaving'))releaseScroll();},{once:true});
}
setupMobileIntro();

function setupMayaDrawer(){
  const toggle=$('maya-toggle'),drawer=$('maya-drawer'),close=$('maya-close'),root=$('maya-drawer-root');
  if(!toggle||!drawer||!close||!root)return;
  const open=(question='')=>{
    drawer.hidden=false;
    toggle.setAttribute('aria-expanded','true');
    if(!mayaDrawerMounted){
      mayaDrawerMounted=true;
      mountMaya(root,{config,getContext:()=>({places:places.slice(0,12),activePage:location.hash.slice(1)||'explorar'})});
    }
    if(question) root.dispatchEvent(new CustomEvent('descubra:maya-question',{detail:{question}}));
  };
  const hide=()=>{drawer.hidden=true;toggle.setAttribute('aria-expanded','false');toggle.focus();};
  toggle.onclick=()=>open();
  close.onclick=hide;
  window.addEventListener('descubra:maya-question',event=>open(String(event.detail?.question||'')));
}
const money=cents=>(cents/100).toLocaleString('pt-BR',{style:'currency',currency:'BRL'});
const dateText=value=>new Date(value).toLocaleDateString('pt-BR',{timeZone:'America/Sao_Paulo'});
const key=()=>`descubra-progress-v2:${user?.id||'guest'}`;
function readProgress(){try{progress=cleanProgress(JSON.parse(localStorage.getItem(key())||'null'),new Set(places.map(p=>p.id)));}catch{progress=freshProgress();}}
function toast(message){clearTimeout(toastTimer);$('toast').textContent=message;toastTimer=setTimeout(()=>{$('toast').textContent='';},5500);}
async function syncProgressToCloud(){
  if(!client||!user)return false;
  try{
    const{error}=await client.from('traveler_progress').upsert({user_id:user.id,progress,updated_at:new Date().toISOString()});
    return !error;
  }catch{return false;}
}
async function loadProgressFromCloud(){
  if(!client||!user)return false;
  try{
    const{data,error}=await client.from('traveler_progress').select('progress').eq('user_id',user.id).maybeSingle();
    if(error||!data?.progress)return false;
    progress=cleanProgress(data.progress,new Set(places.map(p=>p.id)));
    try{localStorage.setItem(key(),JSON.stringify(progress));}catch{}
    return true;
  }catch{return false;}
}
function save(){
  try{localStorage.setItem(key(),JSON.stringify(progress));}catch{toast('O navegador não permitiu salvar. Seu progresso ficará disponível apenas nesta sessão.');}
  if(user&&client)void syncProgressToCloud();
}
function head(kicker,title,description){return `<p class="eyebrow">${kicker}</p><h1>${title}</h1><p class="page-lead">${description}</p>`;}
function nav(){const page=location.hash.slice(1)||'explorar';$('navigation').innerHTML=Object.entries(labels).map(([id,label])=>`<a href="#${id}" ${page===id?'aria-current="page"':''}>${icon(id)}<span>${label}</span></a>`).join('');}
function updateThemeButton(){const dark=document.documentElement.dataset.theme==='dark';$('theme-toggle').innerHTML=icon(dark?'sun':'moon');$('theme-toggle').setAttribute('aria-label',dark?'Ativar tema claro':'Ativar tema escuro');}
$('theme-toggle').onclick=()=>{const value=document.documentElement.dataset.theme==='dark'?'light':'dark';document.documentElement.dataset.theme=value;document.documentElement.style.colorScheme=value;try{localStorage.setItem('theme',value);}catch{}updateThemeButton();};updateThemeButton();

function placeCard(p){
  const saved=progress.favorites.includes(p.id);
  return `<article class="card card--visual"><img class="card-image" src="${photoFor(p)}" alt="Foto de apoio para ${e(p.city)}, ${e(p.state)}" loading="lazy" decoding="async">
    <span class="tag">${e(p.state)} · ${e(p.region)}</span>
    <h3>${e(p.name)}</h3>
    <p>${e(p.description)}</p>
    <span class="source">${e(p.city)} · ${p.free?'Acesso indicado como gratuito; confirme condições locais.':'Consulte preços e horários com o responsável.'}</span>
    <div class="actions">
      <a class="button primary" href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(p.name+' '+p.city)}" target="_blank" rel="noopener noreferrer">Ver no mapa</a>
      <button data-save="${e(p.id)}" aria-label="${saved?'Remover dos':'Adicionar aos'} favoritos: ${e(p.name)}" aria-pressed="${saved}">${icon('heart')}</button>
      <button data-add="${e(p.id)}">Adicionar ao roteiro</button>
    </div>
  </article>`;
}

function bindPlaces(){
  content.querySelectorAll('[data-save]').forEach(b=>b.onclick=()=>{
    const id=b.dataset.save;
    progress.favorites=progress.favorites.includes(id)?progress.favorites.filter(x=>x!==id):[...progress.favorites,id];
    save();
    renderPlaces();
  });
  content.querySelectorAll('[data-add]').forEach(b=>b.onclick=()=>{
    if(!progress.itinerary.includes(b.dataset.add)){
      progress.itinerary.push(b.dataset.add);
      save();
      renderItinerary();
      toast('Destino adicionado ao seu roteiro.');
    }else toast('Este destino já está no roteiro.');
  });
}

function renderPlaces(){
  const filtered=places.filter(p=>{
    const matchRegion = !region || p.region === region;
    const matchState = !selectedState || p.state === selectedState;
    const matchCategory = !selectedCategory || (
      selectedCategory==='gratis' ? p.free :
      normalize(`${p.name} ${p.description} ${p.city}`).includes(normalize(selectedCategory))
    );
    const matchSaved = !onlySaved || progress.favorites.includes(p.id);
    const matchSearch = !search || normalize(`${p.name} ${p.state} ${p.city} ${p.region} ${p.description}`).includes(normalize(search));
    const kilometers = nearbyCoordinates ? 6371 * 2 * Math.asin(Math.sqrt(Math.sin((p.lat-nearbyCoordinates.lat)*Math.PI/360)**2 + Math.cos(nearbyCoordinates.lat*Math.PI/180)*Math.cos(p.lat*Math.PI/180)*Math.sin((p.lng-nearbyCoordinates.lng)*Math.PI/360)**2)) : 0;
    const matchNearby = !nearbyCoordinates || kilometers <= 160;
    return matchRegion && matchState && matchCategory && matchSaved && matchSearch && matchNearby;
  });

  if ($('result-count')) $('result-count').textContent=`${filtered.length} locais encontrados`;
  if ($('place-results')) {
    $('place-results').innerHTML=filtered.slice(0,36).map(placeCard).join('')||'<p class="empty">Nenhum local corresponde à busca. Tente outra cidade ou remova os filtros.</p>';
    if(filtered.length>36) $('place-results').innerHTML+='<p class="source">Exibindo os primeiros 36 resultados. Refine a busca por cidade ou estado.</p>';
  }
  bindPlaces();
}

function renderItinerary(){
  const list=progress.itinerary.map(id=>places.find(p=>p.id===id)).filter(Boolean);
  if ($('itinerary')) {
    $('itinerary').innerHTML=list.length?list.map((p,i)=>`<div class="itinerary-row"><span class="tag">${i+1}</span><strong>${e(p.name)}<span class="source"> · ${e(p.city)}</span></strong><button data-up="${i}" aria-label="Mover ${e(p.name)} para cima" ${i===0?'disabled':''}>Subir</button><button data-remove="${e(p.id)}" aria-label="Remover ${e(p.name)}">Remover</button></div>`).join(''):'<p class="muted">Adicione lugares para montar uma lista na ordem da sua viagem.</p>';
    content.querySelectorAll('[data-up]').forEach(b=>b.onclick=()=>{const i=Number(b.dataset.up);[progress.itinerary[i-1],progress.itinerary[i]]=[progress.itinerary[i],progress.itinerary[i-1]];save();renderItinerary();});
    content.querySelectorAll('[data-remove]').forEach(b=>b.onclick=()=>{progress.itinerary=progress.itinerary.filter(x=>x!==b.dataset.remove);save();renderItinerary();});
  }
  if ($('export-trip')) $('export-trip').disabled=!list.length;
}

function download(name,text,type='text/plain'){
  const url=URL.createObjectURL(new Blob([text],{type}));
  const a=document.createElement('a');a.href=url;a.download=name;a.click();
  setTimeout(()=>URL.revokeObjectURL(url),1000);
}

const categoriesList = [
  { id: '', label: 'Todas' },
  { id: 'praia', label: 'Praias' },
  { id: 'natureza', label: 'Natureza' },
  { id: 'aventura', label: 'Aventura' },
  { id: 'cultura', label: 'Cultura' },
  { id: 'gastronomia', label: 'Gastronomia' },
  { id: 'gratis', label: 'Grátis' },
  { id: 'parque', label: 'Parques' },
  { id: 'museu', label: 'Museus' },
  { id: 'historico', label: 'Históricos' },
];

function explore(){
  const allStates = [...new Set(places.map(p=>p.state))].sort();
  const stateMenuOptions=[...new Map(places.map(p=>[p.code,{code:p.code,name:p.state}])).values()].sort((a,b)=>a.name.localeCompare(b.name,'pt-BR'));
  const storiesMarkup = `
    <div style="margin: 20px 0 28px; overflow-x: auto; display: flex; gap: 14px; padding-bottom: 6px;">
      ${[
        { name: 'Rio de Janeiro', uf: 'RJ', img: 'photo-1483729558449-99ef09a8c325' },
        { name: 'Salvador', uf: 'BA', img: 'photo-1549918864-48ac978761a4' },
        { name: 'Manaus', uf: 'AM', img: 'photo-1516026672322-bc52d61a55d5' },
        { name: 'Noronha', uf: 'PE', img: 'photo-1559825481-12a05cc00344' },
        { name: 'Brasília', uf: 'DF', img: 'photo-1598971457999-ca4ef48a9a71' },
        { name: 'Iguaçu', uf: 'PR', img: 'photo-1610741083757-34e0a0e0f4ec' }
      ].map(s => `
        <button type="button" data-story-uf="${s.uf}" style="flex-shrink:0; background:none; border:none; padding:0; text-align:center; cursor:pointer;">
          <div style="width:68px; height:68px; border-radius:50%; padding:2px; background:linear-gradient(135deg,#0e7c3a,#d4a017,#004a99); margin:0 auto 6px;">
            <img src="https://images.unsplash.com/${s.img}?auto=format&fit=crop&w=150&q=75" alt="${s.name}" style="width:100%; height:100%; border-radius:50%; object-fit:cover; border:2px solid var(--panel);">
          </div>
          <span style="font-size:11px; font-weight:700; color:var(--ink); font-family:inherit;">${s.name}</span>
        </button>
      `).join('')}
    </div>
  `;

  const homeQuick=`<section class="home-quick-discovery" aria-labelledby="home-quick-title">
    <div class="home-quick-copy"><p class="eyebrow">ENCONTRE O SEU PRÓXIMO DESTINO</p><h2 id="home-quick-title">Para onde você quer ir?</h2></div>
    <form id="home-quick-form" class="home-quick-search" role="search">
      <label class="sr-only" for="home-quick-query">Pesquise uma cidade, praia, restaurante ou atração</label>
      <span class="home-quick-icon" aria-hidden="true">${icon('explorar')}</span>
      <input id="home-quick-query" type="search" autocomplete="off" placeholder="Cidade, praia, restaurante ou atração">
      <button type="button" id="home-quick-voice" class="home-quick-voice" aria-label="Pesquisar por voz">${icon('mic')}<span>Voz</span></button>
      <button type="submit" class="home-quick-submit">Buscar</button>
    </form>
    <div class="home-quick-actions">
      <button type="button" id="home-quick-near">${icon('locate')}<span>Perto de mim</span></button>
      <button type="button" data-home-quick-category="praia">Praias</button>
      <button type="button" data-home-quick-category="gastronomia">Restaurantes</button>
      <button type="button" data-home-quick-category="hotel">Hotéis</button>
      <button type="button" id="home-quick-map">Abrir mapa 3D</button>
    </div>
    <p class="home-quick-weather" id="home-quick-weather">O clima aparece no mapa quando você escolher um local.</p>
  </section>`;

  const homeHero=`<section class="travel-hero" aria-label="Destaque de viagem">
    <img src="https://images.unsplash.com/photo-1483729558449-99ef09a8c325?auto=format&fit=crop&w=1400&q=84" alt="Vista do Rio de Janeiro" loading="eager">
    <div class="travel-hero-shade"></div>
    <div class="travel-hero-copy"><p>VIAGENS COM MAIS SENTIDO</p><h2>Explore o Brasil<br><em>ao seu estilo</em></h2><span>Destinos, experiências e roteiros para planejar com calma.</span><div><button type="button" id="hero-destinations">Ver destinos em destaque</button><button type="button" class="ghost" id="hero-maya">Criar roteiro com a Maya</button><button type="button" class="ghost" id="hero-business">Sou empresa? Anuncie aqui</button></div></div>
  </section>`;
  content.innerHTML=homeQuick+homeHero+head('Para onde você quer ir?','Encontre seu próximo destino','Busque por cidade, estado, atração ou categoria. Seus filtros e favoritos ficam salvos neste aparelho.')
    + storiesMarkup
    + `<section class="booking-panel"><div class="booking-tabs" role="tablist" aria-label="Como deseja planejar"><button type="button" id="mode-search" role="tab" aria-selected="true">Buscar viagem</button><button type="button" id="mode-map" role="tab" aria-selected="false">Explorar no mapa</button><button type="button" id="mode-itinerary" role="tab" aria-selected="false">Roteiros com IA</button></div><div class="filters" style="display:grid; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); gap:12px;">
      <label>Destino, cidade ou atração<input id="search" type="search" list="destination-suggestions" placeholder="Para onde você quer ir?" value="${e(search)}"><datalist id="destination-suggestions">${[...new Set(places.flatMap(p=>[p.name,p.city,p.state]))].sort().slice(0,250).map(item=>`<option value="${e(item)}"></option>`).join('')}</datalist></label>
      <label>Região<select id="region"><option value="">Todas as regiões</option>${['Norte','Nordeste','Centro-Oeste','Sudeste','Sul'].map(x=>`<option ${region===x?'selected':''}>${x}</option>`).join('')}</select></label>
      <label>Estado<select id="state-select"><option value="">Todos os estados</option>${allStates.map(x=>`<option value="${x}" ${selectedState===x?'selected':''}>${x}</option>`).join('')}</select></label>
    </div>

    <div style="margin: 16px 0; display:flex; gap:8px; overflow-x:auto; padding-bottom:4px;">
      ${categoriesList.map(c=>`
        <button type="button" data-cat="${c.id}" class="${selectedCategory===c.id?'primary':''}" style="white-space:nowrap; border-radius:999px; padding:6px 14px; font-size:12px;">${c.label}</button>
      `).join('')}
    </div>

    <div class="actions" style="margin-top:16px;">
      <button id="saved-filter" aria-pressed="${onlySaved}">${onlySaved?'Mostrar todos':'Meus favoritos'}</button>
      <button id="near-me-btn" class="subtle">Perto de mim</button>
      <button id="smart-itinerary-btn" class="subtle">Monte sua viagem com IA</button>
      <button id="search-with-maya" class="primary">Perguntar à Maya</button>
      <span class="source" id="result-count" role="status"></span>
    </div></section>
    <section class="home-state-map-section" aria-labelledby="home-map-heading">
      <div class="section-head"><div><p class="eyebrow">MAPA VIVO DO BRASIL</p><h2 id="home-map-heading">Explore por estado e categoria</h2></div><button type="button" class="subtle" id="home-map-fullscreen">Mapa em tela cheia</button></div>
      <p class="source">Escolha um estado e descubra referências de turismo, cultura, natureza e gastronomia. Os temas usam o catálogo dos 27 estados e podem ser enviados à Maya.</p>
      <label class="home-state-select-label">Estado<select id="home-state-menu"><option value="">Escolha um estado</option>${stateMenuOptions.map(item=>`<option value="${e(item.code)}">${e(item.name)}</option>`).join('')}</select></label>
      <div id="home-state-themes" class="home-state-themes"><p class="empty">Selecione um estado para ver categorias.</p></div>
      <div id="home-map-root" data-map-root aria-label="Mapa interativo na Home"></div>
    </section>


    <div id="smart-itinerary-box" style="display:none; margin:20px 0; padding:20px; border:1px solid var(--accent); border-radius:16px; background:var(--soft);">
      <h3>Monte sua Viagem Inteligente</h3>
      <p>A Maya cria um roteiro dia a dia para a sua viagem.</p>
      <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap:10px; margin-bottom:12px;">
        <label>Cidade/Estado <input id="it-city" placeholder="Ex: Brasília, RJ"></label>
        <label>Dias <input id="it-days" type="number" value="3" min="1" max="15"></label>
        <label>Perfil <select id="it-profile"><option>Família</option><option>Casal</option><option>Econômico</option><option>Aventura</option><option>Cultura</option></select></label>
      </div>
      <button id="it-generate" class="primary">Gerar Roteiro</button>
      <div id="it-output" style="margin-top:14px;"></div>
    </div>

    <div class="section-head"><div><p class="eyebrow">PARA COMEÇAR</p><h2>Destinos em alta</h2></div><button type="button" class="subtle" id="show-all-destinations">Ver todos</button></div>
    <div class="grid destination-rail" id="place-results"></div>
    <section class="home-category-section"><div class="section-head"><div><p class="eyebrow">ESCOLHA SEU ESTILO</p><h2>Explore por categoria</h2></div></div><div class="category-rail">
      <button type="button" class="category-card" data-cat="praia"><img src="https://images.unsplash.com/photo-1559825481-12a05cc00344?auto=format&fit=crop&w=500&q=80" alt="Praia brasileira" loading="lazy"><span>Praias</span></button>
      <button type="button" class="category-card" data-cat="natureza"><img src="https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?auto=format&fit=crop&w=500&q=80" alt="Natureza brasileira" loading="lazy"><span>Natureza</span></button>
      <button type="button" class="category-card" data-cat="aventura"><img src="https://images.unsplash.com/photo-1610741083757-34e0a0e0f4ec?auto=format&fit=crop&w=500&q=80" alt="Cachoeira brasileira" loading="lazy"><span>Aventura</span></button>
      <button type="button" class="category-card" data-cat="cultura"><img src="https://images.unsplash.com/photo-1549918864-48ac978761a4?auto=format&fit=crop&w=500&q=80" alt="Cultura brasileira" loading="lazy"><span>Cultura</span></button>
      <button type="button" class="category-card" data-cat="gastronomia"><img src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=500&q=80" alt="Gastronomia brasileira" loading="lazy"><span>Gastronomia</span></button>
    </div></section>
    <section class="maya-cta"><img src="maya-avatar.webp" alt="Maya, assistente de viagens"><div><p class="eyebrow">ROTEIROS PERSONALIZADOS</p><h2>Monte sua viagem com a Maya</h2><p>Conte seus interesses e receba sugestões ajustáveis ao seu plano.</p></div><button type="button" id="open-maya-cta">Criar meu roteiro</button></section>
    <a class="business-cta" href="#empresas"><span>PARA EMPRESAS</span><strong>Sou empresa? Anuncie aqui</strong><small>Divulgue seu serviço para viajantes em todo o Brasil.</small></a>
    <p class="source">Seleção editorial do projeto Descubra o Brasil. Consulte informações locais antes de viajar.</p>`;

  const quickForm=$('home-quick-form'), quickInput=$('home-quick-query');
  const runQuickSearch=question=>{
    search=String(question||'').trim();
    if($('search'))$('search').value=search;
    renderPlaces();
    $('place-results')?.scrollIntoView({behavior:'smooth',block:'start'});
  };
  quickForm.onsubmit=event=>{event.preventDefault();runQuickSearch(quickInput.value);};
  $('home-quick-voice').onclick=()=>{
    const Recognition=window.SpeechRecognition||window.webkitSpeechRecognition;
    if(!Recognition){toast('A pesquisa por voz não é compatível com este navegador.');return;}
    const recognition=new Recognition();recognition.lang='pt-BR';recognition.interimResults=false;recognition.maxAlternatives=1;
    $('home-quick-weather').textContent='Estou ouvindo. Diga uma cidade, praia, hotel ou atração.';
    recognition.onresult=event=>{const spoken=event.results[0][0].transcript;quickInput.value=spoken;runQuickSearch(spoken);window.dispatchEvent(new CustomEvent('descubra:maya-question',{detail:{question:`Quero pesquisar ${spoken}. Ajude com lugares, roteiro e opções gratuitas.`}}));};
    recognition.onerror=()=>{$('home-quick-weather').textContent='Não foi possível usar o microfone. Confira a permissão do navegador.';};
    recognition.start();
  };
  $('home-quick-near').onclick=()=>{$('near-me-btn')?.click();};
  $('home-quick-map').onclick=()=>{$('home-map-root')?.scrollIntoView({behavior:'smooth',block:'start'});};
  content.querySelectorAll('[data-home-quick-category]').forEach(button=>button.onclick=()=>{selectedCategory=button.dataset.homeQuickCategory||'';explore();setTimeout(()=>$('place-results')?.scrollIntoView({behavior:'smooth',block:'start'}),0);});

  $('search').oninput=ev=>{search=ev.target.value;renderPlaces();};
  $('region').onchange=ev=>{region=ev.target.value;renderPlaces();};
  $('mode-search').onclick=()=>$('search').focus();
  $('mode-map').onclick=()=>{$('home-map-root')?.scrollIntoView({behavior:'smooth',block:'start'});};
  $('mode-itinerary').onclick=()=>{const box=$('smart-itinerary-box');box.style.display='block';box.scrollIntoView({behavior:'smooth',block:'center'});};
  $('search-with-maya').onclick=()=>{
    const destination=$('search').value.trim()||'um destino no Brasil';
    const state=$('state-select').value||'qualquer estado';
    const regionValue=$('region').value||'qualquer região';
    const category=selectedCategory||'qualquer estilo de viagem';
    const question=`Quero planejar uma viagem para ${destination}. Região: ${regionValue}. Estado: ${state}. Interesse: ${category}. Sugira um roteiro prático, com opções e cuidados para eu decidir.`;
    window.dispatchEvent(new CustomEvent('descubra:maya-question',{detail:{question}}));
  };
  $('state-select').onchange=ev=>{selectedState=ev.target.value;renderPlaces();};
  $('saved-filter').onclick=()=>{onlySaved=!onlySaved;explore();};

  content.querySelectorAll('[data-cat]').forEach(b=>{
    b.onclick=()=>{
      selectedCategory=b.dataset.cat;
      explore();
    };
  });

  content.querySelectorAll('[data-story-uf]').forEach(b=>{
    b.onclick=()=>{
      const code=b.dataset.storyUf || b.getAttribute('data-story-uf');
      selectedState=places.find(place=>place.code===code)?.state||'';
      explore();
    };
  });

  $('near-me-btn').onclick=()=>{
    if (!navigator.geolocation) {
      toast('Geolocalização não suportada neste aparelho.');
      return;
    }
    toast('Consultando GPS para encontrar atrações perto de você...');
    navigator.geolocation.getCurrentPosition(pos=>{
      const {latitude, longitude} = pos.coords;
      nearbyCoordinates={lat:latitude,lng:longitude};renderPlaces();toast(`Mostrando locais em um raio aproximado de 160 km da sua posição.`);
    }, err=>{
      toast('Não foi possível obter a localização. Escolha uma cidade manualmente.');
    });
  };

  $('show-all-destinations').onclick=()=>{nearbyCoordinates=null;onlySaved=false;selectedCategory='';renderPlaces();$('place-results').scrollIntoView({behavior:'smooth',block:'start'});};
  $('open-maya-cta').onclick=()=>$('maya-toggle').click();

  $('smart-itinerary-btn').onclick=()=>{
    const box = $('smart-itinerary-box');
    box.style.display = box.style.display==='none' ? 'block' : 'none';
  };

  const homeMapRoot=$('home-map-root');
  if(homeMapRoot){
    mountBrazilMap(homeMapRoot,{places,toast,mode:'home',askMaya:question=>window.dispatchEvent(new CustomEvent('descubra:maya-question',{detail:{question}}))}).catch(()=>{homeMapRoot.innerHTML='<p class="empty">Não foi possível carregar o mapa agora. Tente novamente mais tarde.</p>';});
    $('home-map-fullscreen').onclick=()=>{location.hash='mapa';};
    const themeBox=$('home-state-themes'), stateMenu=$('home-state-menu');
    const drawThemes=entries=>{
      const code=stateMenu.value;
      const themes=entries.filter(item=>String(item.estado||'').startsWith(code+' '));
      themeBox.innerHTML=themes.length?themes.map(item=>`<button type="button" class="home-state-theme" data-state-theme="${e(item.busca)}"><span>${e(String(item.categoria||'').replace(/^0\\d_/,'').replaceAll('_',' '))}</span><strong>${e(item.busca)}</strong></button>`).join(''):'<p class="empty">Escolha um estado para acessar seus temas.</p>';
      themeBox.querySelectorAll('[data-state-theme]').forEach(button=>button.onclick=()=>{const query=button.dataset.stateTheme||'';homeMapRoot.scrollIntoView({behavior:'smooth',block:'start'});window.dispatchEvent(new CustomEvent('descubra:map-search',{detail:{query}}));window.dispatchEvent(new CustomEvent('descubra:maya-question',{detail:{question:`No mapa, quero explorar ${query}. Mostre opções culturais, de natureza, gratuitas e cuidados para planejar.`}}));});
    };
    fetch('./data/turismo-cultura-estados.json',{cache:'force-cache'}).then(response=>response.ok?response.json():Promise.reject()).then(entries=>{stateMenu.onchange=()=>drawThemes(entries);stateMenu.value=stateMenuOptions.find(item=>item.code==='DF')?.code||stateMenuOptions[0]?.code||'';drawThemes(entries);}).catch(()=>{themeBox.innerHTML='<p class="empty">O catálogo por estado não está disponível agora.</p>';});
  }

  $('it-generate').onclick=()=>{
    const city = $('it-city').value || 'Brasília';
    const days = Number($('it-days').value) || 3;
    const profile = $('it-profile').value;

    let html = `<div class="notice"><h4>Roteiro Gerado para ${e(city)} (${days} Dias · Perfil ${e(profile)})</h4>`;
    for(let d=1; d<=days; d++){
      html += `<p><strong>DIA ${d}</strong><br>• Manhã: Passeio cultural ou parque principal em ${e(city)}.<br>• Tarde: Almoço típico em restaurante regional e visita às atrações centrais.<br>• Noite: Jantar aconchegante e passeio ao ar livre.</p>`;
    }
    html += `<button type="button" class="button primary" id="add-smart-all">Adicionar locais ao meu roteiro</button></div>`;
    $('it-output').innerHTML = html;

    if($('add-smart-all')){
      $('add-smart-all').onclick=()=>{
        const cityPlaces = places.filter(p=>normalize(p.city).includes(normalize(city))).slice(0, days*2);
        cityPlaces.forEach(p=>{
          if(!progress.itinerary.includes(p.id)) progress.itinerary.push(p.id);
        });
        save();
        renderItinerary();
        toast(`${cityPlaces.length} locais de ${city} foram adicionados ao seu roteiro!`);
      };
    }
  };


  renderPlaces();
  renderItinerary();
  $('hero-destinations')?.addEventListener('click',()=>$('place-results')?.scrollIntoView({behavior:'smooth',block:'start'}));
  $('hero-maya')?.addEventListener('click',()=>$('maya-toggle')?.click());
  $('hero-business')?.addEventListener('click',()=>{location.hash='empresas';});
}

function games(){
  const xp=totalXP(progress), level=1+Math.floor(xp/200), visitCount=Object.keys(progress.awards).filter(x=>x.startsWith('visit:')).length;
  content.innerHTML=`<section class='page-hero games-hero'>
    <img src='https://images.unsplash.com/photo-1483729558449-99ef09a8c325?auto=format&fit=crop&w=1400&q=84' alt='Vista do Rio de Janeiro' loading='eager'>
    <div class='page-hero-shade'></div><div class='page-hero-copy'><p>DESCOBRIR TAMBÉM É JOGAR</p><h1>Viaje também<br><em>jogando</em></h1><span>Quiz, memória e missões que usam o Brasil como ponto de partida.</span></div>
  </section>
  <section class='app-section'><div class='section-title'><h2>Jogos em destaque</h2><span>${xp} pontos no passaporte</span></div>
  <div class='game-rail'>
    <article class='game-feature'><img src='https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?auto=format&fit=crop&w=900&q=82' alt='Floresta brasileira'><div><span>CONHECIMENTO</span><h3>Quiz de destinos</h3><p>Responda cinco perguntas sobre cidades, estados e capitais.</p><button type='button' class='primary' id='start-quiz'>Jogar agora</button></div></article>
    <article class='game-tile'><img src='https://images.unsplash.com/photo-1549918864-48ac978761a4?auto=format&fit=crop&w=560&q=80' alt='Cultura brasileira'><h3>Memória do Brasil</h3><p>Encontre os pares dos estados.</p><button type='button' id='start-memory'>Abrir jogo</button></article>
    <article class='game-tile'><img src='https://images.unsplash.com/photo-1610741083757-34e0a0e0f4ec?auto=format&fit=crop&w=560&q=80' alt='Cachoeira brasileira'><h3>Missões perto de você</h3><p>Use sua localização somente quando desejar.</p><button type='button' id='start-visit'>Ver missões</button></article>
  </div></section>
  <section class='progress-card'><div><p>SEU NÍVEL NO DESCOBRA O BRASIL</p><h2>Nível ${level} — ${level<2?'Viajante':level<3?'Explorador':level<4?'Aventureiro':level<5?'Explorador Brasil':'Mestre do Brasil'}</h2><span>${xp} / ${level*200} pontos</span></div><div class='progress-bar'><i style='width:${Math.min(100,Math.round((xp/(level*200))*100))}%'></i></div><small>${visitCount} visita${visitCount===1?'':'s'} registrada${visitCount===1?'':'s'} neste aparelho.</small></section>
  <div id='game-stage' class='game-stage' aria-live='polite'></div>`;
  $('start-quiz').onclick=quiz;$('start-memory').onclick=memory;$('start-visit').onclick=visits;
}
function showGame(html){clearTimeout(gameTimer);$('game-stage').innerHTML=html;$('game-stage').scrollIntoView({behavior:'auto',block:'start'});}
function quiz(){const questions=dailyQuiz(states),today=dayKey();let index=0,score=0,locked=false;
  function draw(){const q=questions[index];showGame(`<section class="panel"><p class="eyebrow">Quiz diário / ${index+1} de 5</p><h2>${e(q.prompt)}</h2><div class="progress"><div style="width:${index*20}%"></div></div><div class="answer-grid">${q.choices.map((c,i)=>`<button data-answer="${i}">${e(c)}</button>`).join('')}</div><p id="quiz-feedback" class="feedback" role="status"></p><button id="quiz-next" hidden class="primary">${index===4?'Ver resultado':'Próxima pergunta'}</button></section>`);locked=false;content.querySelectorAll('[data-answer]').forEach(b=>b.onclick=()=>{if(locked)return;locked=true;const selected=q.choices[Number(b.dataset.answer)],correct=selected===q.answer;if(correct)score+=20;content.querySelectorAll('[data-answer]').forEach(x=>{x.disabled=true;x.classList.toggle('correct',q.choices[Number(x.dataset.answer)]===q.answer);});if(!correct)b.classList.add('wrong');$('quiz-feedback').textContent=correct?'Resposta correta.':`A resposta correta é ${q.answer}.`;$('quiz-next').hidden=false;});$('quiz-next').onclick=()=>{index++;if(index<5)draw();else{const added=award(progress,`quiz:${today}`,score);save();showGame(`<section class="panel"><p class="eyebrow">Partida concluída</p><h2>${score/20} de 5 respostas corretas.</h2><p>${added?`${score} pontos adicionados ao seu passaporte.`:'Você já concluiu o desafio de hoje. Esta partida foi um treino, sem novos pontos.'}</p><p>Amanhã você encontra outra seleção de perguntas.</p><button id="back-games">Voltar aos jogos</button></section>`);$('back-games').onclick=games;}};}
  draw();}
function memory(){const turn=epoch;let cards=shuffle(shuffle(states).slice(0,6).flatMap(s=>[{id:s.code,name:s.name},{id:s.code,name:s.name}])),selected=[],matched=new Set(),moves=0,locked=false;
  showGame(`<section class="panel"><p class="eyebrow">Jogo da memória</p><h2>Encontre os seis pares.</h2><p id="memory-status">0 jogadas. Recorde: ${progress.bestMemory??'ainda não definido'}.</p><div class="memory-grid">${cards.map((_,i)=>`<button class="memory-card" data-card="${i}" aria-label="Revelar carta ${i+1}" aria-pressed="false">${String(i+1).padStart(2,'0')}</button>`).join('')}</div><div id="memory-result" role="status"></div></section>`);
  const buttons=[...content.querySelectorAll('[data-card]')];buttons.forEach(b=>b.onclick=()=>{const i=Number(b.dataset.card);if(locked||matched.has(i)||selected.includes(i))return;selected.push(i);b.textContent=cards[i].name;b.setAttribute('aria-label',cards[i].name);b.setAttribute('aria-pressed','true');if(selected.length<2)return;moves++;$('memory-status').textContent=`${moves} jogadas. ${matched.size/2} pares encontrados.`;const[a,z]=selected;if(cards[a].id===cards[z].id){for(const n of selected){matched.add(n);buttons[n].classList.add('matched');buttons[n].disabled=true;}selected=[];$('memory-status').textContent=`${moves} jogadas. ${matched.size/2} pares encontrados.`;if(matched.size===12){progress.bestMemory=Math.min(progress.bestMemory||Infinity,moves);const added=award(progress,`memory:${dayKey()}`,60);save();$('memory-result').innerHTML=`<h3>Todos os pares encontrados.</h3><p>${added?'Você ganhou 60 pontos.':'Desafio diário já pontuado; recorde atualizado.'} Seu melhor resultado é ${progress.bestMemory} jogadas.</p><button id="memory-again">Jogar novamente</button>`;$('memory-again').onclick=memory;}}else{locked=true;gameTimer=setTimeout(()=>{if(epoch!==turn)return;for(const n of selected){buttons[n].textContent=String(n+1).padStart(2,'0');buttons[n].setAttribute('aria-label',`Revelar carta ${n+1}`);buttons[n].setAttribute('aria-pressed','false');}selected=[];locked=false;},1000);}});}
function visits(){const targets=places.filter(p=>Number.isFinite(p.lat)&&Number.isFinite(p.lng));showGame(`<section class="panel"><p class="eyebrow">Missão no mundo real</p><h2>Registre uma descoberta.</h2><p>Escolha um lugar que você está visitando. O app só solicita sua localização quando você tocar em verificar. As coordenadas são usadas neste aparelho e não são armazenadas.</p><label>Local da visita<select id="visit-place">${targets.map(p=>`<option value="${e(p.id)}">${e(p.name)} — ${e(p.city)}</option>`).join('')}</select></label><div class="actions" style="margin-top:18px"><button id="verify-visit" class="primary">Verificar minha presença</button></div><p id="visit-status" class="feedback" role="status"></p><p class="source">Missão recreativa baseada no GPS do aparelho. Não comprova presença para benefícios comerciais.</p></section>`);
  $('verify-visit').onclick=()=>{const b=$('verify-visit'),status=$('visit-status'),p=targets.find(x=>x.id===$('visit-place').value);if(!navigator.geolocation){status.textContent='Este navegador não oferece localização.';return;}if(progress.awards[`visit:${p.id}`]){status.textContent='Você já registrou este local.';return;}b.disabled=true;status.textContent='Consultando o GPS...';navigator.geolocation.getCurrentPosition(pos=>{const result=checkVisit(pos.coords,p);if(result.ok){award(progress,`visit:${p.id}`,80);save();}status.textContent=result.message+(result.ok?' Você ganhou 80 pontos.':'');b.disabled=false;},err=>{status.textContent=err.code===1?'Permissão de localização não concedida. Você pode continuar nos outros jogos.':'Não foi possível obter a localização. Tente novamente em uma área aberta.';b.disabled=false;},{enableHighAccuracy:true,timeout:15000,maximumAge:0});};}

async function mapa(){
  content.innerHTML='<p class="sr-only">Carregando o Mapa Vivo do Brasil.</p>';
  try{
    await mountBrazilMap(content,{
      places,
      toast,
      askMaya:question=>window.dispatchEvent(new CustomEvent('descubra:maya-question',{detail:{question}}))
    });
  }catch{
    content.innerHTML=head('Mapa vivo indisponível','Não foi possível abrir o mapa agora.','Verifique a conexão e tente novamente.')+'<button type="button" id="retry-map" class="primary">Tentar novamente</button>';
    $('retry-map').onclick=mapa;
  }
}

async function offers(){
  const current=epoch;
  const partnerCard=`<article class="offer-feature"><img src="./assets/diroma-caldas-novas.jpg" alt="Parque aquático diRoma em Caldas Novas"><div><span class="offer-kicker">PARCEIRO OFICIAL · CALDAS NOVAS</span><h2>Experiência diRoma</h2><p>Hospedagem, lazer e parques aquáticos. Consulte regras, períodos e disponibilidade diretamente com o parceiro.</p><div class="coupon"><span>Cupom de parceria</span><strong>DESCUBRAOBRASIL</strong><button type="button" data-copy-coupon>Copiar cupom</button></div><a class="button primary" href="https://diroma.com.br/" target="_blank" rel="noopener noreferrer sponsored">Consultar parceiro oficial</a></div></article>`;
  content.innerHTML=`<section class="offers-hero"><p class="eyebrow">OFERTAS VERIFICADAS</p><h1>Condições para planejar melhor.</h1><p>Parcerias e oportunidades publicadas com origem identificada. A confirmação final é feita com a empresa responsável.</p></section><section class="offers-layout"><div class="offers-main"><div class="section-head"><div><p class="eyebrow">EM DESTAQUE</p><h2>Hospedagens e experiências</h2></div></div><div id="offers-list" class="offers-grid"><p class="empty">Consultando ofertas...</p></div></div><aside class="offers-aside"><p class="eyebrow">SUA EMPRESA</p><h2>Quer aparecer aqui?</h2><p>Apresente uma oferta com dados, regras e canal oficial para análise.</p><a class="button" href="#empresas">Anunciar no Descubra</a></aside></section><p class="source">Preço, prazo e disponibilidade dependem do parceiro. Confirme tudo antes de reservar.</p>`;
  const bindCoupon=()=>{const button=content.querySelector('[data-copy-coupon]');if(button)button.onclick=async()=>{try{await navigator.clipboard.writeText('DESCUBRAOBRASIL');button.textContent='Cupom copiado';toast('Cupom DESCUBRAOBRASIL copiado.');}catch{toast('Cupom: DESCUBRAOBRASIL');}};};
  const render=(items=[])=>{
    $('offers-list').innerHTML=partnerCard+items.map(o=>`<article class="offer-card"><span class="tag">${e(o.city)}</span><h2>${e(o.title)}</h2><p>${e(o.company_name)}</p><div class="offer-price"><del>${money(o.original_cents)}</del>${money(o.price_cents)}</div><p class="source">Válida de ${dateText(o.starts_at)} até ${dateText(o.ends_at)}</p><details><summary>Condições da oferta</summary><p>${e(o.terms)}</p><a href="${e(safeURL(o.source_url))}" target="_blank" rel="noopener noreferrer">Consultar fonte</a></details><a class="button primary" href="${e(safeURL(o.contact_url))}" target="_blank" rel="noopener noreferrer">Consultar disponibilidade</a></article>`).join('');
    bindCoupon();
  };
  if(!client){render();return;}
  const{data,error}=await client.from('tourism_offers').select('*').eq('status','approved').order('ends_at');
  if(current!==epoch)return;
  render(error?[]:(data||[]).filter(offerIsActive));
}

async function news(){
  const current=epoch; let category='destaque';
  content.innerHTML=`<section class='page-hero news-hero'><img src='https://images.unsplash.com/photo-1483729558449-99ef09a8c325?auto=format&fit=crop&w=1400&q=84' alt='Paisagem do Rio de Janeiro' loading='eager'><div class='page-hero-shade'></div><div class='page-hero-copy'><p>INFORMAÇÃO PARA VIAJAR MELHOR</p><h1>Notícias que<br><em>levam mais longe</em></h1><span>Publicações do turismo brasileiro com origem identificada.</span></div></section><nav class='content-tabs' aria-label='Categorias de notícias'><button data-news-category='destaque' aria-pressed='true'>Em destaque</button><button data-news-category='eventos'>Eventos</button><button data-news-category='tendencias'>Tendências</button><button data-news-category='cultura'>Cultura</button></nav><section class='app-section'><div class='section-title'><h2>Notícias em destaque</h2><a href='https://www.gov.br/turismo/pt-br/assuntos/noticias' target='_blank' rel='noopener noreferrer'>Ver todas</a></div><p id='news-updated' class='source'></p><div id='news-list' class='news-rail'><div class='skeleton-card'></div><div class='skeleton-card'></div><div class='skeleton-card'></div></div></section>`;
  const classify=item=>{const text=normalize(item.title||'');if(/evento|festival|show|feira/.test(text))return 'eventos';if(/cultur|patrimonio|historia|museu/.test(text))return 'cultura';if(/tend|cresce|recorde|pesquisa/.test(text))return 'tendencias';return 'destaque';};
  const draw=items=>{const view=category==='destaque'?items:items.filter(item=>classify(item)===category);$('news-list').innerHTML=(view.length?view:items).slice(0,12).map((n,i)=>`<article class='news-card'><img src='https://images.unsplash.com/${['photo-1483729558449-99ef09a8c325','photo-1549918864-48ac978761a4','photo-1610741083757-34e0a0e0f4ec','photo-1516026672322-bc52d61a55d5'][i%4]}?auto=format&fit=crop&w=620&q=80' alt='' loading='lazy'><div><span>${e(category==='destaque'?'TURISMO':category.toUpperCase())}</span><h3>${e(n.title)}</h3><time datetime='${e(n.date||'')}'>${n.date?dateText(n.date):'Data na fonte'}</time><a href='${e(safeURL(n.url))}' target='_blank' rel='noopener noreferrer'>Abrir publicação</a></div></article>`).join('')||'<p class=empty>Nenhuma publicação nesta categoria.</p>';};
  content.querySelectorAll('[data-news-category]').forEach(button=>button.onclick=()=>{category=button.dataset.newsCategory;content.querySelectorAll('[data-news-category]').forEach(item=>item.setAttribute('aria-pressed',String(item===button)));draw(window.__newsItems||[]);});
  try{const r=await fetch('./data/news.json',{cache:'no-store'});if(!r.ok)throw Error();const data=await r.json();if(current!==epoch)return;const items=data.items.filter(n=>safeURL(n.url)&&n.title);window.__newsItems=items;$('news-updated').textContent=data.fetchedAt?`Última atualização da fonte: ${dateText(data.fetchedAt)}.`:'Fonte: Ministério do Turismo.';draw(items);}catch{if(current===epoch)$('news-list').innerHTML='<p class=empty>Não foi possível atualizar as notícias agora. <a href=https://www.gov.br/turismo/pt-br/assuntos/noticias target=_blank rel=noopener>Consultar o portal oficial</a>.</p>';}
}
async function mayaNews(){
  const current=epoch;
  content.innerHTML=head('Maya · Sua assistente de viagem','Sua próxima viagem começa com uma pergunta.','Destinos, roteiros, gastronomia e dicas práticas. Converse com a Maya e descubra novas formas de explorar o Brasil.')+`<div id="maya-root"></div><div class="section-head"><div><p class="eyebrow">Informação para viajar melhor</p><h2>Notícias do turismo</h2></div></div><p id="news-updated" class="source"></p><div id="news-list" class="news-list"><p>Carregando notícias oficiais...</p></div>`;
  let newsItems=[];
  mountMaya($('maya-root'),{config,getContext:()=>({news:newsItems, destinations:places.map(p=>({name:p.name,city:p.city,state:p.state})).slice(0,20)})});
  try{
    const r=await fetch('./data/news.json',{cache:'no-store',signal:AbortSignal.timeout(15000)});
    if(!r.ok)throw Error();
    const data=await r.json();if(current!==epoch)return;
    newsItems=data.items.filter(n=>safeURL(n.url)&&n.title);
    $('news-updated').textContent=data.fetchedAt?`Atualizado em ${dateText(data.fetchedAt)}. Notícias com links para a fonte original.`:'';
    $('news-list').innerHTML=newsItems.map(n=>`<article class="panel"><time>${n.date?dateText(n.date):'Na fonte'}</time><div><span class="eyebrow">Turismo no Brasil</span><h3><a href="${e(safeURL(n.url))}" target="_blank" rel="noopener noreferrer">${e(n.title)}</a></h3><a href="${e(safeURL(n.url))}" target="_blank" rel="noopener noreferrer">Ler notícia ${icon('arrow')}</a></div></article>`).join('')||'<p>Nenhuma notícia disponível agora.</p>';
  }catch{if(current===epoch)$('news-list').innerHTML='<p>Não foi possível carregar as notícias. Você pode continuar conversando com a Maya.</p>';}
}

function business(){content.innerHTML=head('Para negócios locais','Sua empresa no caminho de novos viajantes.','Apresente seu negócio e proponha uma oferta com preço, validade e regras verificáveis.')+`<div class="grid two"><section class="panel"><h2>Como funciona</h2><div class="steps"><p><strong>Cadastre sua conta.</strong><br>Use seu e-mail profissional ou a opção Google quando disponível.</p><p><strong>Prepare uma oferta.</strong><br>Informe empresa, cidade, preço original, preço promocional e a página que comprova as condições.</p><p><strong>Aguarde a análise.</strong><br>Uma proposta só aparece para os viajantes após aprovação. Você acompanha o status aqui.</p><p><strong>Receba o contato.</strong><br>O viajante consulta as condições e finaliza diretamente no seu canal oficial.</p></div></section><section class="panel"><p class="eyebrow">Simulador de proposta</p><h2>Veja antes de enviar.</h2><p>Prepare uma proposta e confira o desconto calculado. A prévia não publica uma oferta.</p><form id="offer-form"><label>Nome da empresa<input name="company_name" required maxlength="100" placeholder="Nome comercial"></label><label>Título da oferta<input name="title" required maxlength="120" placeholder="Descreva o serviço ou experiência"></label><label>Cidade e estado<input name="city" required maxlength="100" placeholder="Cidade, UF"></label><div class="form-row"><label>Preço original (R$)<input name="original" type="number" min="0.01" max="1000000" step="0.01" required></label><label>Preço promocional (R$)<input name="promotional" type="number" min="0" max="1000000" step="0.01" required></label></div><div class="form-row"><label>Início<input name="starts_at" type="date" required></label><label>Fim<input name="ends_at" type="date" required></label></div><label>Condições de uso<textarea name="terms" required minlength="20" maxlength="2000" placeholder="Disponibilidade, o que está incluído e como utilizar."></textarea></label><label>Link oficial com a oferta<input name="source_url" type="url" required placeholder="https://" maxlength="500"></label><label>Canal de reserva ou contato<input name="contact_url" type="url" required placeholder="https://" maxlength="500"></label><label><input type="checkbox" name="authorized" required>Represento a empresa e confirmo que os preços e condições são verdadeiros.</label><button type="submit" class="primary">Calcular e visualizar proposta</button></form><div id="offer-preview" style="margin-top:20px" role="status"></div></section></div><section class="panel" style="margin-top:24px"><h2>Minhas propostas</h2><div id="my-offers"></div></section>`;
  $('offer-form').onsubmit=ev=>{ev.preventDefault();try{const f=Object.fromEntries(new FormData(ev.target)),price=offerPrice(f.original,f.promotional);if(!safeURL(f.source_url)||!safeURL(f.contact_url))throw Error('Os links precisam começar com https://.');const start=new Date(`${f.starts_at}T00:00:00-03:00`),end=new Date(`${f.ends_at}T23:59:59-03:00`);if(end<=start||end<=new Date())throw Error('A validade deve terminar no futuro e depois da data inicial.');const payload={company_name:f.company_name.trim(),title:f.title.trim(),city:f.city.trim(),original_cents:price.base,price_cents:price.price,starts_at:start.toISOString(),ends_at:end.toISOString(),terms:f.terms.trim(),source_url:safeURL(f.source_url),contact_url:safeURL(f.contact_url),status:'pending'};
  $('offer-preview').innerHTML=`<div class="notice"><span class="eyebrow">Prévia / não publicada</span><h3>${e(payload.title)}</h3><p>${e(payload.company_name)} · ${e(payload.city)}</p><strong>${money(price.price)} · ${price.percent}% de desconto</strong><p>${e(payload.terms)}</p><p>Validade: ${dateText(payload.starts_at)} a ${dateText(payload.ends_at)}</p><div class="actions"><button id="download-offer">Baixar proposta</button>${client&&user?'<button id="submit-offer" class="primary">Enviar para análise</button>':'<a href="#conta" class="button">Ver disponibilidade do cadastro</a>'}</div><p class="source">${client?'A proposta passa por verificação antes de ser publicada.':'Recebimento de propostas ainda não ativado. Você pode baixar e guardar sua proposta.'}</p></div>`;$('download-offer').onclick=()=>download('proposta-descubra-brasil.json',JSON.stringify(payload,null,2),'application/json');if($('submit-offer'))$('submit-offer').onclick=async()=>{const b=$('submit-offer');b.disabled=true;const{error}=await client.from('tourism_offers').insert({...payload,owner_id:user.id});if(error){toast('Não foi possível enviar. Confira a conexão e tente novamente.');b.disabled=false;}else{b.textContent='Enviado para análise';toast('Proposta enviada. Ela ainda não está publicada.');loadMyOffers();}};}catch(error){$('offer-preview').textContent=error.message;}};loadMyOffers();}
async function loadMyOffers(){const box=$('my-offers');if(!client||!user){box.innerHTML='<p>Entre em uma conta para enviar e acompanhar propostas. O simulador acima pode ser usado sem cadastro.</p>';return;}box.textContent='Consultando propostas...';const {data,error}=await client.from('tourism_offers').select('*').eq('owner_id',user.id).order('created_at',{ascending:false});if(!box.isConnected)return;box.innerHTML=error?'<p>Não foi possível consultar suas propostas.</p>':data?.length?data.map(o=>`<div class="itinerary-row"><strong>${e(o.title)}</strong><span class="tag">${{pending:'Em análise',approved:'Aprovada',rejected:'Não aprovada'}[o.status]||'Em análise'}</span>${o.status!=='approved'?`<button data-delete-offer="${e(o.id)}">Excluir proposta</button>`:''}</div>`).join(''):'<p>Você ainda não enviou propostas.</p>';box.querySelectorAll('[data-delete-offer]').forEach(b=>b.onclick=async()=>{if(!confirm('Excluir esta proposta?'))return;const{error}=await client.from('tourism_offers').delete().eq('id',b.dataset.deleteOffer);if(error)toast('Não foi possível excluir.');else loadMyOffers();});}

function account(){
  const xp=totalXP(progress), level=1+Math.floor(xp/200), displayName=user?.user_metadata?.full_name||user?.email?.split('@')[0]||'Viajante';
  content.innerHTML=`<section class='profile-hero'><img src='https://images.unsplash.com/photo-1483729558449-99ef09a8c325?auto=format&fit=crop&w=1200&q=82' alt='' loading='eager'><div class='profile-hero-shade'></div><div class='profile-summary'><div class='profile-avatar' aria-hidden='true'>${icon('conta')}</div><div><p>${user?'CONTA CONECTADA':'MODO VISITANTE'}</p><h1>${e(displayName)}</h1><span>${user?'Seus favoritos, roteiros e progresso são sincronizados com sua conta.':'Entre para manter seu progresso na nuvem e continuar em outro aparelho.'}</span></div></div></section>
  <section class='profile-stats' aria-label='Seu progresso'><div><strong>${progress.favorites.length}</strong><span>Favoritos</span></div><div><strong>${progress.itinerary.length}</strong><span>Roteiros</span></div><div><strong>${xp}</strong><span>Pontos</span></div><div><strong>${level}</strong><span>Nível</span></div></section>
  <section class='progress-card profile-progress'><div><p>SEU NÍVEL NO DESCOBRA O BRASIL</p><h2>Nível ${level} — ${level<2?'Viajante':level<3?'Explorador':level<4?'Aventureiro':level<5?'Explorador Brasil':'Mestre do Brasil'}</h2><span>Continue explorando para registrar novas conquistas.</span></div><div class='progress-bar'><i style='width:${Math.min(100,Math.round((xp/(level*200))*100))}%'></i></div></section>
  <section id='auth-panel' class='account-auth'></section>
  <section class='account-actions' aria-label='Ações da conta'><button type='button' data-account-action='favorites'>Meus favoritos</button><button type='button' data-account-action='itinerary'>Meu roteiro</button><button type='button' data-account-action='preferences'>Preferências</button><button type='button' id='maya-support'>Falar com o suporte pela Maya</button></section>
  <section class='panel account-cloud'><p class='eyebrow'>DADOS NA NUVEM</p><h2>${user?'Sua conta está conectada.':'Entre para sincronizar.'}</h2><p>${user?'O aplicativo sincroniza seu progresso quando você salva favoritos, roteiros e conquistas.':'No modo visitante, o progresso fica somente neste aparelho até você entrar em uma conta.'}</p>${user?'<button id="cloud-sync" class="primary">Sincronizar agora</button><p id="cloud-status" class="inline-status" role="status"></p>':''}</section>`;
  if(!client){$('auth-panel').innerHTML='<p class="eyebrow">CONTA</p><h2>Entre quando desejar.</h2><p>A conta online será disponibilizada depois da configuração do serviço.</p>';}
  else if(user){$('auth-panel').innerHTML=`<p class='eyebrow'>CONTA CONECTADA</p><h2>Olá, ${e(displayName)}.</h2><p>${e(user.email||'')}</p><button id='logout'>Sair da conta</button>`;$('logout').onclick=async()=>{const{error}=await client.auth.signOut();if(error)toast('Não foi possível sair agora.');};}
  else authForm();
  content.querySelectorAll('[data-account-action]').forEach(button=>button.onclick=()=>{const action=button.dataset.accountAction;if(action==='favorites'){onlySaved=true;location.hash='explorar';}if(action==='itinerary'){location.hash='explorar';setTimeout(()=>$('itinerary')?.scrollIntoView({behavior:'smooth'}),150);}if(action==='preferences'){$('theme-toggle').click();toast('Tema atualizado.');}});
  $('maya-support').onclick=()=>window.dispatchEvent(new CustomEvent('descubra:maya-question',{detail:{question:'Preciso de suporte com minha conta, favoritos, roteiro ou navegação no aplicativo. Pode me ajudar?'}}));
  if(user&&$('cloud-sync'))$('cloud-sync').onclick=async()=>{const button=$('cloud-sync');button.disabled=true;$('cloud-status').textContent='Sincronizando sua conta...';const ok=await syncProgressToCloud();$('cloud-status').textContent=ok?'Dados sincronizados com a sua conta.':'A sincronização não está disponível agora. Tente novamente mais tarde.';button.disabled=false;};
}
function authForm(){const box=$('auth-panel');box.innerHTML=`<h2>Entre ou crie sua conta</h2><p>Receba um link de acesso no seu e-mail. Você não precisa criar uma senha.</p><form id="email-login"><label>Seu e-mail<input type="email" name="email" autocomplete="email" required maxlength="254" placeholder="voce@exemplo.com"></label><label><input type="checkbox" required>Li os <a href="../termos/" target="_blank" rel="noopener">termos</a> e a <a href="../privacidade/" target="_blank" rel="noopener">política de privacidade</a>.</label><button type="submit" class="primary">Receber link de acesso</button></form>${config.googleEnabled?'<button id="google-login" style="margin-top:16px">Continuar com Google</button>':''}<p id="auth-status" class="inline-status" role="status"></p>`;
  const redirect=new URL('./index.html',location.href).href;
  $('email-login').onsubmit=async ev=>{ev.preventDefault();const b=ev.target.querySelector('button');b.disabled=true;$('auth-status').textContent='Solicitando link...';try{const{error}=await client.auth.signInWithOtp({email:new FormData(ev.target).get('email').trim(),options:{emailRedirectTo:redirect,shouldCreateUser:true}});$('auth-status').textContent=error?'Não foi possível enviar. Verifique o e-mail e tente novamente mais tarde.':'Se o endereço puder receber o acesso, o link chegará em instantes. Confira também a pasta de spam.';}catch{$('auth-status').textContent='Sem conexão. Tente novamente.';}b.disabled=false;};if($('google-login'))$('google-login').onclick=async()=>{if(!$('email-login').querySelector('input[type=checkbox]').checked){toast('Leia e aceite os termos antes de continuar.');return;}const{error}=await client.auth.signInWithOAuth({provider:'google',options:{redirectTo:redirect}});if(error)$('auth-status').textContent='Login com Google indisponível. Tente o acesso por e-mail.';};}

function route(){epoch++;clearTimeout(gameTimer);content._mapDestroy?.();content.querySelectorAll('[data-map-root]').forEach(node=>node._mapDestroy?.());nav();const page=location.hash.slice(1)||'explorar';document.title=`${labels[page]||'Explorar'} | Descubra o Brasil`;({explorar:explore,mapa,ofertas:offers,noticias:news,empresas:business,conta:account,jogos:games}[page]||explore)();window.scrollTo(0,0);content.focus({preventScroll:true});}

async function init(){try{const r=await fetch('./data/destinations.json');if(!r.ok)throw Error();const data=await r.json();states=data.states;places=data.places;readProgress();route();window.addEventListener('hashchange',route);}catch{content.innerHTML=head('Conexão indisponível','Não conseguimos carregar os destinos.','Verifique a conexão e recarregue a página.')+'<button id="retry">Tentar novamente</button>';$('retry').onclick=()=>location.reload();return;}
  try{config=await(await fetch('./config.json',{cache:'no-store'})).json();if(config.supabaseUrl&&config.supabaseKey&&window.supabase){client=window.supabase.createClient(config.supabaseUrl,config.supabaseKey,{auth:{detectSessionInUrl:true,persistSession:true,autoRefreshToken:true}});const{data}=await client.auth.getSession();user=data.session?.user||null;readProgress();client.auth.onAuthStateChange((event,session)=>{const next=session?.user||null;if(next?.id!==user?.id){user=next;readProgress();if(['conta','empresas','ofertas'].includes(location.hash.slice(1)))route();}});if(user){await loadProgressFromCloud();if(location.hash.includes('access_token')||location.hash===''||location.hash.includes('error'))history.replaceState(null,'',location.pathname+'#conta');}route();}}catch{localOnly=true;}
  if('serviceWorker'in navigator)navigator.serviceWorker.register('./sw.js').catch(()=>{});
}
let deferredInstall=null;window.addEventListener('beforeinstallprompt',event=>{event.preventDefault();deferredInstall=event;$('install').hidden=false;});$('install').onclick=async()=>{if(!deferredInstall)return;await deferredInstall.prompt();await deferredInstall.userChoice;deferredInstall=null;$('install').hidden=true;};window.addEventListener('appinstalled',()=>{$('install').hidden=true;});setupMayaDrawer();
init();