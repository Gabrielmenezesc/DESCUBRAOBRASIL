import {normalize,escapeHTML as e,safeURL,dayKey,shuffle,dailyQuiz,freshProgress,cleanProgress,award,totalXP,checkVisit,offerPrice,offerIsActive} from './core.mjs';

import { mountMaya } from './maya.mjs?v=22';

const $=id=>document.getElementById(id), content=$('content');
const paths={mapPin:'<path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.4"/>',sparkles:'<path d="m12 3 1.4 4.1L17.5 9l-4.1 1.4L12 14.5l-1.4-4.1L6.5 9l4.1-1.9Z"/><path d="m19 15 .8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8Z"/>',bot:'<rect x="5" y="7" width="14" height="11" rx="3"/><path d="M12 3v4M8 12h.1m7.9 0h.1M9 15h6"/>',beach:'<path d="M3 18h18M6 18c1-4 3-7 6-10 3 3 5 6 6 10M12 8V3"/>',leaf:'<path d="M20 4C11 4 5 8 5 15c0 3 2 5 5 5 7 0 10-7 10-16Z"/><path d="M5 20c3-4 7-7 12-10"/>',mountain:'<path d="m3 20 7-12 4 7 2-3 5 8Z"/>',landmark:'<path d="M3 10h18M5 10v8m4-8v8m6-8v8m4-8v8M2 21h20M12 3 3 8h18Z"/>',utensils:'<path d="M7 3v7m-2-7v4a2 2 0 0 0 4 0V3m-2 7v11M17 3v18M17 3c2 2 3 5 3 8h-3"/>',wallet:'<path d="M4 6h15a2 2 0 0 1 2 2v10H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h13"/><path d="M15 11h6"/>',trees:'<path d="m8 3-4 7h3l-4 7h10l-4-7h3ZM8 17v4M17 5l-3 6h2l-3 6h8l-3-6h2Z"/>',image:'<rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="8" cy="9" r="2"/><path d="m21 15-5-5L5 20"/>',castle:'<path d="M5 21V8h14v13M4 8V4h4v4m4 0V4h4v4m4 0V4h-4M3 21h18M9 21v-6h6v6"/>',explorar:'<circle cx="11" cy="11" r="7"/><path d="m16 16 5 5"/>',jogos:'<path d="M8 6h8l4 5 1 7-3 1-4-4h-4l-4 4-3-1 1-7Z"/><path d="M6 10v4m-2-2h4m8-1h.1m2 2h.1"/>',ofertas:'<path d="M3 3h8l10 10-8 8L3 11Z"/><circle cx="7" cy="7" r="1"/>',noticias:'<path d="M4 3h16v18H4Z M8 7h8M8 11h8M8 15h8"/>',empresas:'<path d="M4 21V7l8-4 8 4v14M2 21h20M8 8v2m8-2v2M8 13v2m8-2v2M10 21v-4h4v4"/>',conta:'<circle cx="12" cy="8" r="4"/><path d="M4 21v-2a8 8 0 0 1 16 0v2"/>',sun:'<circle cx="12" cy="12" r="4"/><path d="M12 1v3m0 16v3M1 12h3m16 0h3M4 4l2 2m12 12 2 2M4 20l2-2M18 6l2-2"/>',moon:'<path d="M21 13A9 9 0 0 1 11 3a9 9 0 1 0 10 10Z"/>',arrow:'<path d="M4 12h16m-6-6 6 6-6 6"/>',heart:'<path d="M20 4c-3-3-7-1-8 1-1-2-5-4-8-1-4 4 0 9 8 16 8-7 12-12 8-16Z"/>'};
const navIcons={inicio:'explorar',descobrir:'sparkles',mapa:'mapPin',viagens:'wallet',perfil:'conta'};
const icon=name=>`<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[navIcons[name]||name]||paths.arrow}</svg>`;
const labels={inicio:'Início',descobrir:'Descobrir',mapa:'Mapa',viagens:'Viagens',perfil:'Perfil'};
const mediaLoops=['../media/litoral-brasil.mp4','../media/cidade-noturna.mp4','../media/rotas-brasil.mp4','../media/brasil-menu-loop.mp4'];
let states=[],places=[],config={},client=null,user=null,progress=freshProgress(),epoch=0,toastTimer,gameTimer,localOnly=false;
let search=new URLSearchParams(location.search).get('q')||'',region='',selectedState='',selectedCity='',selectedCategory='',onlySaved=false,nearbyIds=null;

function showOnboarding(){const overlay=$('app-onboarding');if(!overlay||sessionStorage.getItem('descubra-onboarding-complete')==='yes')return;overlay.hidden=false;document.body.classList.add('onboarding-open');}
function finishOnboarding(){const overlay=$('app-onboarding');sessionStorage.setItem('descubra-onboarding-complete','yes');document.body.classList.remove('onboarding-open');overlay?.remove();}
function setupOnboarding(){const overlay=$('app-onboarding');if(!overlay)return;$('continue-visitor').onclick=finishOnboarding;$('onboarding-form').onsubmit=async event=>{event.preventDefault();const status=$('onboarding-status'),form=event.currentTarget;if(!client){status.textContent='A conexão da conta ainda está sendo preparada. Tente novamente em instantes.';return;}const button=form.querySelector('button');button.disabled=true;status.textContent='Enviando seu link de acesso...';const redirect=new URL('./index.html',location.href).href;try{const{error}=await client.auth.signInWithOtp({email:new FormData(form).get('email').trim(),options:{emailRedirectTo:redirect,shouldCreateUser:true}});status.textContent=error?'Não foi possível enviar o link agora. Tente novamente.':'Confira seu e-mail para continuar. Você pode usar o app como visitante enquanto isso.';if(!error)setTimeout(finishOnboarding,900);}catch{status.textContent='Sem conexão. Tente novamente.';}finally{button.disabled=false;}};$('onboarding-google').onclick=async()=>{const status=$('onboarding-status');if(!config.googleEnabled||!client){status.textContent='O acesso com Google será ativado após a configuração oficial do provedor.';return;}const redirect=new URL('./index.html',location.href).href;const{error}=await client.auth.signInWithOAuth({provider:'google',options:{redirectTo:redirect}});if(error)status.textContent='Não foi possível iniciar o acesso com Google.';};}
setupOnboarding();

const money=cents=>(cents/100).toLocaleString('pt-BR',{style:'currency',currency:'BRL'});
const dateText=value=>new Date(value).toLocaleDateString('pt-BR',{timeZone:'America/Sao_Paulo'});
const key=()=>`descubra-progress-v2:${user?.id||'guest'}`;
function readProgress(){try{progress=cleanProgress(JSON.parse(localStorage.getItem(key())||'null'),new Set(places.map(p=>p.id)));}catch{progress=freshProgress();}}
function toast(message){clearTimeout(toastTimer);$('toast').textContent=message;toastTimer=setTimeout(()=>{$('toast').textContent='';},5500);}
function save(){try{localStorage.setItem(key(),JSON.stringify(progress));}catch{toast('O navegador não permitiu salvar. Seu progresso ficará disponível apenas nesta sessão.');} }
function head(kicker,title,description){return `<p class="eyebrow">${kicker}</p><h1>${title}</h1><p class="page-lead">${description}</p>`;}
function nav(){const page=location.hash.slice(1)||'explorar';$('navigation').innerHTML=Object.entries(labels).map(([id,label])=>`<a href="#${id}" ${page===id?'aria-current="page"':''}>${icon(id)}<span>${label}</span></a>`).join('');}
function updateThemeButton(){const dark=document.documentElement.dataset.theme==='dark';$('theme-toggle').innerHTML=icon(dark?'sun':'moon');$('theme-toggle').setAttribute('aria-label',dark?'Ativar tema claro':'Ativar tema escuro');}
$('theme-toggle').onclick=()=>{const value=document.documentElement.dataset.theme==='dark'?'light':'dark';document.documentElement.dataset.theme=value;document.documentElement.style.colorScheme=value;try{localStorage.setItem('theme',value);}catch{}updateThemeButton();};updateThemeButton();

function placeCard(p){
  const saved=progress.favorites.includes(p.id);
  const photo=['photo-1483729558449-99ef09a8c325','photo-1507525428034-b723cf961d3e','photo-1544984243-ec57ea16fe25','photo-1516026672322-bc52d61a55d5'][Math.abs(p.id.split('').reduce((n,c)=>n+c.charCodeAt(0),0))%4];
  return `<article class="card place-card">
    <div class="place-card-visual"><img src="https://images.unsplash.com/${photo}?auto=format&fit=crop&w=900&q=82" alt="Vista de ${e(p.name)}" loading="lazy" onerror="this.onerror=null;this.src='../logo-descubra.png'"><span class="place-card-badge">${p.free?'Grátis':'Experiência local'}</span><button data-save="${e(p.id)}" class="place-card-heart" aria-label="${saved?'Remover dos':'Adicionar aos'} favoritos: ${e(p.name)}" aria-pressed="${saved}">${icon('heart')}</button></div>
    <div class="place-card-body"><span class="tag">${e(p.state)} · ${e(p.region)}</span><h3>${e(p.name)}</h3><p>${e(p.description)}</p><div class="place-card-meta"><strong>${p.free?'Gratuito':'Consulte valores'}</strong><span>★ 4.8</span></div><span class="source">${e(p.city)} · Confira horários e condições locais.</span>
    <div class="actions"><a class="button primary" href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(p.name+' '+p.city)}" target="_blank" rel="noopener noreferrer">Ver no mapa</a><button data-add="${e(p.id)}">Adicionar ao roteiro</button></div></div>
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
    const matchState = !selectedState || p.state === selectedState || p.code === selectedState;
    const matchCity = !selectedCity || p.city === selectedCity;
    const matchCategory = !selectedCategory || (
      selectedCategory==='gratis' ? p.free :
      normalize(`${p.category||''} ${p.name} ${p.description} ${p.city}`).includes(normalize(selectedCategory))
    );
    const matchSaved = !onlySaved || progress.favorites.includes(p.id);
    const matchSearch = !search || normalize(`${p.name} ${p.state} ${p.city} ${p.region} ${p.description}`).includes(normalize(search));
    const matchNearby = !nearbyIds || nearbyIds.includes(p.id);
    return matchRegion && matchState && matchCity && matchCategory && matchSaved && matchSearch && matchNearby;
  }).sort((a,b)=>nearbyIds ? nearbyIds.indexOf(a.id)-nearbyIds.indexOf(b.id) : 0);

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
  { id: '', label: 'Todas', icon: 'explorar' },
  { id: 'praia', label: 'Praias', icon: 'beach' },
  { id: 'natureza', label: 'Natureza', icon: 'leaf' },
  { id: 'aventura', label: 'Aventura', icon: 'mountain' },
  { id: 'cultura', label: 'Cultura', icon: 'landmark' },
  { id: 'gastronomia', label: 'Gastronomia', icon: 'utensils' },
  { id: 'gratis', label: 'Grátis', icon: 'wallet' },
  { id: 'parque', label: 'Parques', icon: 'trees' },
  { id: 'museu', label: 'Museus', icon: 'image' },
  { id: 'historico', label: 'Históricos', icon: 'castle' },
];

function explore(){
  const allStates = [...new Set(places.map(p=>p.state))].sort();
  const availableCities = [...new Set(places.filter(p=>!selectedState||p.state===selectedState||p.code===selectedState).map(p=>p.city))].sort();
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

  content.innerHTML=head('Para onde você quer ir?','Explore o Brasil ao seu estilo','Navegue por hierarquia regional, estados, cidades ou categorias específicas. Monte seu roteiro e descubra novos destinos.')
    + storiesMarkup
    + `<div class="filters" style="display:grid; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); gap:12px;">
      <label>Destino, cidade ou atração<input id="search" type="search" placeholder="Pergunte qualquer coisa sobre sua próxima viagem..." value="${e(search)}"></label>
      <label>Região<select id="region"><option value="">Todas as regiões</option>${['Norte','Nordeste','Centro-Oeste','Sudeste','Sul'].map(x=>`<option ${region===x?'selected':''}>${x}</option>`).join('')}</select></label>
      <label>Estado<select id="state-select"><option value="">Todos os estados</option>${allStates.map(x=>`<option value="${x}" ${selectedState===x?'selected':''}>${x}</option>`).join('')}</select></label>
      <label>Cidade<select id="city-select"><option value="">Todas as cidades</option>${availableCities.map(x=>`<option value="${x}" ${selectedCity===x?'selected':''}>${x}</option>`).join('')}</select></label>
    </div>

    <div style="margin: 16px 0; display:flex; gap:8px; overflow-x:auto; padding-bottom:4px;">
      ${categoriesList.map(c=>`
        <button type="button" data-cat="${c.id}" class="${selectedCategory===c.id?'primary':''}" style="white-space:nowrap; border-radius:999px; padding:6px 14px; font-size:12px;">${icon(c.icon)}<span>${c.label}</span></button>
      `).join('')}
    </div>

    <div class="actions" style="margin-top:16px;">
      <button id="saved-filter" aria-pressed="${onlySaved}">${onlySaved?'Mostrar todos':'Meus favoritos'}</button>
      <button id="near-me-btn" class="subtle">${icon('mapPin')}<span>Perto de mim</span></button>
      <button id="smart-itinerary-btn" class="subtle">${icon('sparkles')}<span>Monte sua viagem com IA</span></button>
      <span class="source" id="result-count" role="status"></span>
    </div>

    <div id="smart-itinerary-box" style="display:none; margin:20px 0; padding:20px; border:1px solid var(--accent); border-radius:16px; background:var(--soft);">
      <h3>${icon('bot')} Monte sua Viagem Inteligente</h3>
      <p>A Maya cria um roteiro dia a dia para a sua viagem.</p>
      <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap:10px; margin-bottom:12px;">
        <label>Cidade/Estado <input id="it-city" placeholder="Ex: Brasília, RJ"></label>
        <label>Dias <input id="it-days" type="number" value="3" min="1" max="15"></label>
        <label>Perfil <select id="it-profile"><option>Família</option><option>Casal</option><option>Econômico</option><option>Aventura</option><option>Cultura</option></select></label>
      </div>
      <button id="it-generate" class="primary">Gerar Roteiro</button>
      <div id="it-output" style="margin-top:14px;"></div>
    </div>

    <div class="section-head"><h2>Destinos encontrados</h2></div>
    <div class="grid" id="place-results"></div>
    <div class="section-head"><h2>Seu roteiro</h2><button id="export-trip">Baixar roteiro</button></div>
    <section class="panel" id="itinerary"></section>
    <p class="source">Seleção editorial do projeto Descubra o Brasil. Consulte informações locais antes de viajar.</p>`;

  $('search').oninput=ev=>{search=ev.target.value;renderPlaces();};
  $('region').onchange=ev=>{region=ev.target.value;renderPlaces();};
  $('state-select').onchange=ev=>{selectedState=ev.target.value;selectedCity='';nearbyIds=null;explore();};
  $('city-select').onchange=ev=>{selectedCity=ev.target.value;nearbyIds=null;renderPlaces();};
  $('saved-filter').onclick=()=>{onlySaved=!onlySaved;explore();};

  content.querySelectorAll('[data-cat]').forEach(b=>{
    b.onclick=()=>{
      selectedCategory=b.dataset.cat;
      explore();
    };
  });

  content.querySelectorAll('[data-story-uf]').forEach(b=>{
    b.onclick=()=>{
      selectedState=b.dataset.storyUF || b.getAttribute('data-story-uf');
      selectedCity='';nearbyIds=null;
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
      const rad=n=>n*Math.PI/180;
      const distance=p=>{const dLat=rad(p.lat-latitude),dLon=rad(p.lng-longitude),a=Math.sin(dLat/2)**2+Math.cos(rad(latitude))*Math.cos(rad(p.lat))*Math.sin(dLon/2)**2;return 6371*2*Math.atan2(Math.sqrt(a),Math.sqrt(1-a));};
      const nearest=places.filter(p=>Number.isFinite(p.lat)&&Number.isFinite(p.lng)).map(p=>({p,d:distance(p)})).sort((a,b)=>a.d-b.d).slice(0,18);
      nearbyIds=nearest.map(x=>x.p.id);region='';selectedState='';selectedCity='';selectedCategory='';search='';
      renderPlaces();
      $('result-count').textContent=`${nearest.length} lugares mais próximos · ${nearest[0]?.d.toFixed(1)||'0'} km a partir de você`;
      $('place-results').scrollIntoView({behavior:'smooth',block:'start'});
    }, err=>{
      toast('Não foi possível obter a localização. Escolha uma cidade manualmente.');
    });
  };

  $('smart-itinerary-btn').onclick=()=>{
    const box = $('smart-itinerary-box');
    box.style.display = box.style.display==='none' ? 'block' : 'none';
  };

  $('it-generate').onclick=()=>{
    const city = $('it-city').value || 'Brasília';
    const days = Number($('it-days').value) || 3;
    const profile = $('it-profile').value;

    const localPlaces=places.filter(p=>normalize(`${p.city} ${p.state} ${p.code}`).includes(normalize(city))).slice(0,days*3);
    let html = `<div class="notice"><h4>Base para ${e(city)} · ${days} dias · ${e(profile)}</h4>`;
    if(localPlaces.length){for(let d=1;d<=days;d++){const day=localPlaces.slice((d-1)*3,d*3);html+=`<div class="smart-day"><strong>DIA ${d}</strong>${day.map((p,i)=>`<p><span>${['Manhã','Tarde','Noite'][i]||'Parada'}</span> ${e(p.name)} · ${e(p.city)}</p>`).join('')}</div>`;}}else{html+='<p>Ainda não há atrações cadastradas para esse termo. A Maya pode pesquisar e montar uma sugestão mais ampla.</p>';}
    html += `<div class="actions"><button type="button" class="button primary" id="add-smart-all" ${localPlaces.length?'':'disabled'}>Adicionar locais ao roteiro</button><button type="button" class="button" id="ask-maya-plan">Aprimorar com a Maya IA</button></div></div>`;
    $('it-output').innerHTML = html;

    if($('add-smart-all')){
      $('add-smart-all').onclick=()=>{
        localPlaces.forEach(p=>{
          if(!progress.itinerary.includes(p.id)) progress.itinerary.push(p.id);
        });
        save();
        renderItinerary();
        toast(`${localPlaces.length} locais foram adicionados ao seu roteiro.`);
      };
    }
    $('ask-maya-plan').onclick=()=>{sessionStorage.setItem('maya-prefill',`Monte um roteiro de ${days} dias para ${city}, perfil ${profile}. Organize manhã, tarde e noite, incluindo atrações, lugares gratuitos e dicas práticas.`);location.hash='noticias';};
  };

  $('export-trip').onclick=()=>download('meu-roteiro.txt','MEU ROTEIRO — DESCUBRA O BRASIL\n\n'+progress.itinerary.map((id,i)=>{const p=places.find(x=>x.id===id);return `${i+1}. ${p.name} — ${p.city}, ${p.state}\nhttps://www.google.com/maps/search/?api=1&query=${encodeURIComponent(p.name+' '+p.city)}`;}).join('\n\n'));

  renderPlaces();
  renderItinerary();
}

function catalogCard(p,index=0){return `<article class="stream-card"><video autoplay muted loop playsinline preload="metadata"><source src="${mediaLoops[index%mediaLoops.length]}" type="video/mp4"></video><div><span>${e(p.state)} · ${e(p.region)}</span><h3>${e(p.name)}</h3><p>${e(p.city)}</p><a class="button" href="#descobrir" data-place-name="${e(p.name)}">Ver destino</a></div></article>`;}
function home(){const rows=[['Destinos recomendados para você',places.slice(0,8)],['Praias',places.filter(p=>/praia/i.test(`${p.category||''} ${p.name} ${p.description}`)).slice(0,8)],['Natureza e aventura',places.filter(p=>/natureza|aventura|parque|trilha|cachoeira/i.test(`${p.category||''} ${p.description}`)).slice(0,8)],['Cultura e história',places.filter(p=>/cultura|hist.r|museu|arquitetura/i.test(`${p.category||''} ${p.description}`)).slice(0,8)]];content.innerHTML=`<section class="app-welcome"><div><p class="eyebrow">Bem-vindo ao Descubra o Brasil</p><h1>Olá${user?.email?`, ${e(user.email.split("@")[0])}`:""}.</h1><p>Que destino vamos explorar hoje?</p></div><img src="../logo-descubra.png" alt="Identidade Descubra o Brasil"></section><section class="home-search"><label><span class="sr-only">Pesquisar destinos</span><input id="home-search" type="search" placeholder="Para onde você quer ir?"></label><button id="home-search-button" class="primary">Pesquisar</button></section><section class="category-strip"><a href="#descobrir" data-home-cat="">Todos</a><a href="#descobrir" data-home-cat="praia">Praias</a><a href="#descobrir" data-home-cat="natureza">Natureza</a><a href="#descobrir" data-home-cat="cultura">Cidades e história</a><a href="#descobrir" data-home-cat="aventura">Aventura</a><a href="#descobrir" data-home-cat="gastronomia">Gastronomia</a></section><section class="stream-hero"><video autoplay muted loop playsinline preload="metadata"><source src="${mediaLoops[3]}" type="video/mp4"></video><div class="stream-shade"></div><div class="stream-copy"><span class="eyebrow">Seu Brasil em um só lugar</span><h1>Descubra. Planeje. Viva.</h1><p>Destinos, mapa, roteiros, notícias, jogos e Maya reunidos em uma experiência feita para viajar melhor.</p><div class="actions"><a class="button primary" href="#descobrir">Começar a explorar</a><a class="button" href="#viagens">Continuar planejando</a></div></div></section>${rows.map(([title,list],row)=>`<section class="stream-row"><h2>${title}</h2><div class="stream-track">${list.map((p,i)=>catalogCard(p,i+row)).join('')||'<p class="empty">Novas experiências serão adicionadas após verificação.</p>'}</div></section>`).join('')}<section class="stream-row"><h2>Mais para descobrir</h2><div class="actions"><a class="button" href="#noticias">Notícias do turismo</a><a class="button" href="#jogos">Jogos e desafios</a><a class="button" href="#ofertas">Ofertas verificadas</a><a class="button" href="#viagens">Continue planejando</a></div></section>`;content.querySelectorAll('[data-place-name]').forEach(link=>link.onclick=()=>{search=link.dataset.placeName;});content.querySelectorAll('[data-home-cat]').forEach(link=>link.onclick=()=>{selectedCategory=link.dataset.homeCat;});$('home-search-button').onclick=()=>{search=$('home-search').value.trim();location.hash='descobrir';};}
function mapView(){
  const mapped=places.filter(p=>Number.isFinite(p.lat)&&Number.isFinite(p.lng));
  content.innerHTML=`<section class="br-map-head"><div><p class="eyebrow">GUIA BRASIL 3D</p><h1>Explore o Brasil com a Maya.</h1><p>Mapa real com pontos turísticos, hospedagens e experiências. Toque em um marcador para ver os detalhes.</p></div><button id="map-near-me" class="primary">⌖ Onde estou</button></section><section class="real-map-shell"><div class="map-filter-row"><button class="is-active" data-map-filter="todos">Tudo</button><button data-map-filter="gratis">Grátis</button><button data-map-filter="hotel">Hotéis</button><button data-map-filter="pousada">Pousadas</button><button data-map-filter="passeio">Passeios</button><button data-map-filter="cafe">Cafés</button></div><div id="real-brasil-map" class="real-brasil-map" aria-label="Mapa interativo do Brasil"></div><section id="map-sheet" class="map-bottom-sheet"><div class="sheet-photo"></div><div class="sheet-copy"><p class="eyebrow">ESCOLHA DA MAYA</p><h2 id="map-selected-name">Carregando mapa do Brasil</h2><p id="map-selected-detail">Preparando destinos, clima e cidades.</p><p id="map-weather" class="map-weather">☀ Clima será exibido aqui</p><div class="actions"><a id="map-open-place" class="button" href="#descobrir">Ver detalhes</a><a id="map-route" class="button primary" target="_blank" rel="noopener noreferrer">Traçar rota</a></div></div></section></section><p id="map-status" class="inline-status">Carregando base de municípios do IBGE…</p>`;
  let activeFilter='todos', map, selected=mapped[0];
  const photo='https://images.unsplash.com/photo-1483729558449-99ef09a8c325?auto=format&fit=crop&w=900&q=80';
  const visible=()=>mapped.filter(p=>activeFilter==='todos'||(activeFilter==='gratis'?p.free:normalize(`${p.category||''} ${p.name} ${p.description}`).includes(activeFilter)));
  const weather=async p=>{try{const r=await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${p.lat}&longitude=${p.lng}&current=temperature_2m,weather_code&timezone=auto`);const d=await r.json();const rain=[51,61,63,65,80,95].includes(d.current.weather_code);$('map-weather').textContent=`${rain?'🌧':'☀'} ${Math.round(d.current.temperature_2m)}°C · ${rain?'Pode chover':'Sem chuva indicada'}`;}catch{$('map-weather').textContent='Clima indisponível no momento.';}};
  const select=p=>{selected=p;$('map-selected-name').textContent=p.name;$('map-selected-detail').textContent=`${p.city}, ${p.code} · ${p.free?'Gratuito':'Consulte valores'}`;$('map-route').href=`https://www.google.com/maps/dir/?api=1&destination=${p.lat},${p.lng}`;$('map-open-place').onclick=()=>{search=p.name;location.hash='descobrir';};weather(p);};
  const data=()=>({type:'FeatureCollection',features:visible().map(p=>({type:'Feature',geometry:{type:'Point',coordinates:[p.lng,p.lat]},properties:{id:p.id,name:p.name}}))});
  const draw=()=>{if(!map?.getSource('places'))return;map.getSource('places').setData(data());$('map-status').textContent=`${visible().length} destinos exibidos no mapa. Municípios IBGE disponíveis para busca.`;};
  const boot=()=>{if(!window.maplibregl){$('map-status').textContent='Não foi possível carregar o mapa. Verifique a conexão e atualize a página.';return;}map=new window.maplibregl.Map({container:'real-brasil-map',style:'https://demotiles.maplibre.org/style.json',center:[-53,-14],zoom:3.15,pitch:35,bearing:-8,attributionControl:false});map.addControl(new window.maplibregl.NavigationControl({visualizePitch:true}),'bottom-right');map.on('load',()=>{map.addSource('places',{type:'geojson',data:data()});map.addLayer({id:'places-glow',type:'circle',source:'places',paint:{'circle-radius':15,'circle-color':'#f6d546','circle-opacity':.25}});map.addLayer({id:'places',type:'circle',source:'places',paint:{'circle-radius':7,'circle-color':'#087a43','circle-stroke-width':3,'circle-stroke-color':'#fff'}});map.on('click','places',e=>{const p=mapped.find(x=>x.id===e.features[0].properties.id);if(p){select(p);map.flyTo({center:[p.lng,p.lat],zoom:7,pitch:50,duration:900});}});map.on('mouseenter','places',()=>map.getCanvas().style.cursor='pointer');map.on('mouseleave','places',()=>map.getCanvas().style.cursor='');select(selected);draw();});};
  content.querySelectorAll('[data-map-filter]').forEach(b=>b.onclick=()=>{activeFilter=b.dataset.mapFilter;content.querySelectorAll('[data-map-filter]').forEach(x=>x.classList.toggle('is-active',x===b));draw();});
  $('map-near-me').onclick=()=>navigator.geolocation?.getCurrentPosition(pos=>{map?.flyTo({center:[pos.coords.longitude,pos.coords.latitude],zoom:8,pitch:45});$('map-status').textContent='Sua localização foi usada apenas nesta consulta.';},()=>{$('map-status').textContent='Não foi possível acessar sua localização.';},{enableHighAccuracy:true,timeout:12000});
  fetch('https://servicodados.ibge.gov.br/api/v1/localidades/municipios').then(r=>r.json()).then(cities=>{$('map-status').textContent=`${visible().length} destinos e ${cities.length.toLocaleString('pt-BR')} municípios do IBGE disponíveis.`;}).catch(()=>{$('map-status').textContent=`${visible().length} destinos exibidos. A base de cidades será carregada quando houver conexão.`;});
  const mayaMapHandler=event=>{const cmd=event.detail?.mapa_comando;if(!cmd)return;const filter={Tudo:'todos',Grátis:'gratis',Hotéis:'hotel',Pousadas:'pousada',Passeios:'passeio'}[cmd.aplicar_filtro];if(filter){activeFilter=filter;content.querySelectorAll('[data-map-filter]').forEach(b=>b.classList.toggle('is-active',b.dataset.mapFilter===filter));draw();}if(Array.isArray(cmd.coordenadas)&&map){map.flyTo({center:[cmd.coordenadas[1],cmd.coordenadas[0]],zoom:Math.max(1,Math.min(15,Number(cmd.zoom_level)||7)),pitch:48,duration:1000});}const card=event.detail.ui_card_sugestao;if(card){$('map-selected-name').textContent=card.titulo||'Sugestão da Maya';$('map-selected-detail').textContent=card.subtitulo||'';}if(event.detail.ui_painel_clima)$('map-weather').textContent=event.detail.ui_painel_clima;};window.addEventListener('maya-map-command',mayaMapHandler,{signal:new AbortController().signal});
  let mapTries=0;const waitForMap=()=>{if(window.maplibregl)boot();else if(mapTries++<80)setTimeout(waitForMap,100);else $('map-status').textContent='Não foi possível carregar o mapa. Verifique sua conexão e atualize a página.';};waitForMap();
}
function trips(){const saved=progress.favorites.map(id=>places.find(p=>p.id===id)).filter(Boolean);content.innerHTML=head('Suas viagens','Planeje e continue de onde parou.','Favoritos, roteiro e progresso ficam neste aparelho e podem ser sincronizados após o acesso à conta.')+`<div class="grid two"><section class="panel"><h2>Roteiro atual</h2><div id="itinerary"></div><div class="actions"><button id="export-trip">Compartilhar roteiro</button><button id="ask-maya-trip">Pedir sugestões à Maya</button></div></section><section class="panel"><h2>Favoritos</h2>${saved.length?saved.map(p=>`<p><strong>${e(p.name)}</strong><br><span class="source">${e(p.city)}, ${e(p.code)}</span></p>`).join(''):'<p class="muted">Salve destinos na área Descobrir.</p>'}</section></div><div class="actions" style="margin-top:20px"><a class="button" href="#mapa">Ver no mapa</a><a class="button" href="#descobrir">Adicionar destinos</a></div>`;renderItinerary();$('export-trip').onclick=()=>download('meu-roteiro.txt',progress.itinerary.map((id,i)=>`${i+1}. ${places.find(p=>p.id===id)?.name||id}`).join('\n'));$('ask-maya-trip').onclick=()=>openMaya('Analise meu roteiro atual e sugira uma organização por dias.');}

function games(){const xp=totalXP(progress);content.innerHTML=head('Central de jogos','Escolha uma aventura.','Uma vitrine interativa de conhecimento, memória e exploração real do Brasil.')+`<section class="stream-hero"><video autoplay muted loop playsinline><source src="${mediaLoops[2]}" type="video/mp4"></video><div class="stream-shade"></div><div class="stream-copy"><span class="eyebrow">Em destaque</span><h2>Descubra jogando.</h2><p>Complete desafios, ganhe experiência e construa seu passaporte cultural.</p><button id="start-quiz" class="primary">Jogar Brasil em 5</button></div></section><section class="game-profile"><div class="stats"><div><strong>${xp}</strong><span>Pontos de experiência</span></div><div><strong>${1+Math.floor(xp/200)}</strong><span>Nível do explorador</span></div><div><strong>${Object.keys(progress.awards).filter(x=>x.startsWith('visit:')).length}</strong><span>Visitas registradas</span></div></div></section><div class="stream-row"><h2>Continue explorando</h2><div class="stream-track"><article class="stream-card game-card"><video autoplay muted loop playsinline><source src="${mediaLoops[0]}" type="video/mp4"></video><div><span>CONHECIMENTO</span><h3>Brasil em cinco perguntas</h3><p>Capitais, regiões e cultura.</p><button id="start-quiz-card">Jogar agora</button></div></article><article class="stream-card game-card"><video autoplay muted loop playsinline><source src="${mediaLoops[1]}" type="video/mp4"></video><div><span>MEMÓRIA</span><h3>Pares do Brasil</h3><p>Encontre os estados correspondentes.</p><button id="start-memory">Jogar agora</button></div></article><article class="stream-card game-card"><video autoplay muted loop playsinline><source src="${mediaLoops[3]}" type="video/mp4"></video><div><span>MUNDO REAL</span><h3>Passaporte de visitas</h3><p>Registre descobertas com localização.</p><button id="start-visit">Explorar missões</button></div></article></div></div><div id="game-stage" class="game-stage" aria-live="polite"></div>`;
  $('start-quiz').onclick=quiz;$('start-quiz-card').onclick=quiz;$('start-memory').onclick=memory;$('start-visit').onclick=visits;}
function showGame(html){clearTimeout(gameTimer);$('game-stage').innerHTML=html;$('game-stage').scrollIntoView({behavior:'auto',block:'start'});}
function quiz(){const questions=dailyQuiz(states),today=dayKey();let index=0,score=0,locked=false;
  function draw(){const q=questions[index];showGame(`<section class="panel"><p class="eyebrow">Quiz diário / ${index+1} de 5</p><h2>${e(q.prompt)}</h2><div class="progress"><div style="width:${index*20}%"></div></div><div class="answer-grid">${q.choices.map((c,i)=>`<button data-answer="${i}">${e(c)}</button>`).join('')}</div><p id="quiz-feedback" class="feedback" role="status"></p><button id="quiz-next" hidden class="primary">${index===4?'Ver resultado':'Próxima pergunta'}</button></section>`);locked=false;content.querySelectorAll('[data-answer]').forEach(b=>b.onclick=()=>{if(locked)return;locked=true;const selected=q.choices[Number(b.dataset.answer)],correct=selected===q.answer;if(correct)score+=20;content.querySelectorAll('[data-answer]').forEach(x=>{x.disabled=true;x.classList.toggle('correct',q.choices[Number(x.dataset.answer)]===q.answer);});if(!correct)b.classList.add('wrong');$('quiz-feedback').textContent=correct?'Resposta correta.':`A resposta correta é ${q.answer}.`;$('quiz-next').hidden=false;});$('quiz-next').onclick=()=>{index++;if(index<5)draw();else{const added=award(progress,`quiz:${today}`,score);save();showGame(`<section class="panel"><p class="eyebrow">Partida concluída</p><h2>${score/20} de 5 respostas corretas.</h2><p>${added?`${score} pontos adicionados ao seu passaporte.`:'Você já concluiu o desafio de hoje. Esta partida foi um treino, sem novos pontos.'}</p><p>Amanhã você encontra outra seleção de perguntas.</p><button id="back-games">Voltar aos jogos</button></section>`);$('back-games').onclick=games;}};}
  draw();}
function memory(){const turn=epoch;let cards=shuffle(shuffle(states).slice(0,6).flatMap(s=>[{id:s.code,name:s.name},{id:s.code,name:s.name}])),selected=[],matched=new Set(),moves=0,locked=false;
  showGame(`<section class="panel"><p class="eyebrow">Jogo da memória</p><h2>Encontre os seis pares.</h2><p id="memory-status">0 jogadas. Recorde: ${progress.bestMemory??'ainda não definido'}.</p><div class="memory-grid">${cards.map((_,i)=>`<button class="memory-card" data-card="${i}" aria-label="Revelar carta ${i+1}" aria-pressed="false">${String(i+1).padStart(2,'0')}</button>`).join('')}</div><div id="memory-result" role="status"></div></section>`);
  const buttons=[...content.querySelectorAll('[data-card]')];buttons.forEach(b=>b.onclick=()=>{const i=Number(b.dataset.card);if(locked||matched.has(i)||selected.includes(i))return;selected.push(i);b.textContent=cards[i].name;b.setAttribute('aria-label',cards[i].name);b.setAttribute('aria-pressed','true');if(selected.length<2)return;moves++;$('memory-status').textContent=`${moves} jogadas. ${matched.size/2} pares encontrados.`;const[a,z]=selected;if(cards[a].id===cards[z].id){for(const n of selected){matched.add(n);buttons[n].classList.add('matched');buttons[n].disabled=true;}selected=[];$('memory-status').textContent=`${moves} jogadas. ${matched.size/2} pares encontrados.`;if(matched.size===12){progress.bestMemory=Math.min(progress.bestMemory||Infinity,moves);const added=award(progress,`memory:${dayKey()}`,60);save();$('memory-result').innerHTML=`<h3>Todos os pares encontrados.</h3><p>${added?'Você ganhou 60 pontos.':'Desafio diário já pontuado; recorde atualizado.'} Seu melhor resultado é ${progress.bestMemory} jogadas.</p><button id="memory-again">Jogar novamente</button>`;$('memory-again').onclick=memory;}}else{locked=true;gameTimer=setTimeout(()=>{if(epoch!==turn)return;for(const n of selected){buttons[n].textContent=String(n+1).padStart(2,'0');buttons[n].setAttribute('aria-label',`Revelar carta ${n+1}`);buttons[n].setAttribute('aria-pressed','false');}selected=[];locked=false;},1000);}});}
function visits(){const targets=places.filter(p=>Number.isFinite(p.lat)&&Number.isFinite(p.lng));showGame(`<section class="panel"><p class="eyebrow">Missão no mundo real</p><h2>Registre uma descoberta.</h2><p>Escolha um lugar que você está visitando. O app só solicita sua localização quando você tocar em verificar. As coordenadas são usadas neste aparelho e não são armazenadas.</p><label>Local da visita<select id="visit-place">${targets.map(p=>`<option value="${e(p.id)}">${e(p.name)} — ${e(p.city)}</option>`).join('')}</select></label><div class="actions" style="margin-top:18px"><button id="verify-visit" class="primary">Verificar minha presença</button></div><p id="visit-status" class="feedback" role="status"></p><p class="source">Missão recreativa baseada no GPS do aparelho. Não comprova presença para benefícios comerciais.</p></section>`);
  $('verify-visit').onclick=()=>{const b=$('verify-visit'),status=$('visit-status'),p=targets.find(x=>x.id===$('visit-place').value);if(!navigator.geolocation){status.textContent='Este navegador não oferece localização.';return;}if(progress.awards[`visit:${p.id}`]){status.textContent='Você já registrou este local.';return;}b.disabled=true;status.textContent='Consultando o GPS...';navigator.geolocation.getCurrentPosition(pos=>{const result=checkVisit(pos.coords,p);if(result.ok){award(progress,`visit:${p.id}`,80);save();}status.textContent=result.message+(result.ok?' Você ganhou 80 pontos.':'');b.disabled=false;},err=>{status.textContent=err.code===1?'Permissão de localização não concedida. Você pode continuar nos outros jogos.':'Não foi possível obter a localização. Tente novamente em uma área aberta.';b.disabled=false;},{enableHighAccuracy:true,timeout:15000,maximumAge:0});};}

async function offers(){const current=epoch;const partnerCard=`<article class="card partner-card"><img class="card-image" src="./assets/diroma-caldas-novas.jpg" alt="Parque aquático diRoma em Caldas Novas"><span class="tag">Parceiro oficial · Caldas Novas, GO</span><h2>Reserve sua experiência diRoma</h2><p>Hospedagem, lazer e parques aquáticos em Caldas Novas. Faça a reserva no site oficial e informe o cupom abaixo.</p><div class="coupon"><span>Cupom de parceria</span><strong>DESCUBRAOBRASIL</strong><button type="button" data-copy-coupon>Copiar cupom</button></div><p class="source">Consulte disponibilidade, regras, período de uso e benefício aplicável diretamente no site do diRoma antes de concluir a reserva.</p><a class="button primary" href="https://diroma.com.br/" target="_blank" rel="noopener noreferrer sponsored">Reservar no site oficial</a></article>`;content.innerHTML=head('Condições claras','Ofertas de quem recebe você.','Preço de referência, valor promocional, prazo e regras: tudo visível antes de entrar em contato com a empresa.')+'<div id="offers-list" class="grid"><p class="empty">Consultando ofertas...</p></div><div class="notice">Os jogos não geram cupons. Cada benefício depende da oferta publicada e das condições da empresa responsável.</div><a class="button" href="#empresas">Quero apresentar minha empresa</a>';
  const bindCoupon=()=>{const button=content.querySelector('[data-copy-coupon]');if(button)button.onclick=async()=>{try{await navigator.clipboard.writeText('DESCUBRAOBRASIL');button.textContent='Cupom copiado';toast('Cupom DESCUBRAOBRASIL copiado.');}catch{toast('Cupom: DESCUBRAOBRASIL');}};};
  if(!client){$('offers-list').innerHTML=partnerCard;bindCoupon();return;}
  const {data,error}=await client.from('tourism_offers').select('*').eq('status','approved').order('ends_at');if(current!==epoch)return;
  if(error){$('offers-list').innerHTML=partnerCard;bindCoupon();return;}
  const active=(data||[]).filter(x=>offerIsActive(x));$('offers-list').innerHTML=partnerCard+active.map(o=>`<article class="card"><span class="tag">${e(o.city)}</span><h2>${e(o.title)}</h2><p>${e(o.company_name)}</p><div class="offer-price"><del>${money(o.original_cents)}</del>${money(o.price_cents)}</div><p>${Math.round((1-o.price_cents/o.original_cents)*100)}% de desconto sobre o preço informado pela empresa.</p><p class="source">De ${dateText(o.starts_at)} até ${dateText(o.ends_at)}</p><details><summary>Condições e comprovação</summary><p>${e(o.terms)}</p><a href="${e(safeURL(o.source_url))}" target="_blank" rel="noopener noreferrer">Consultar fonte da oferta</a></details><a class="button primary" href="${e(safeURL(o.contact_url))}" target="_blank" rel="noopener noreferrer">Consultar disponibilidade</a></article>`).join('');bindCoupon();}

async function news(){const current=epoch;content.innerHTML=head('Informação com origem','O turismo em movimento.','Notícias do Ministério do Turismo, com data e acesso à publicação original.')+'<p id="news-updated" class="source"></p><div id="news-list" class="news-list"><p class="empty">Buscando publicações...</p></div><p class="source">Os títulos pertencem à fonte indicada. Leia a matéria completa no portal de origem.</p>';
  try{const r=await fetch('./data/news.json',{cache:'no-store'});if(!r.ok)throw Error();const data=await r.json();if(current!==epoch)return;$('news-updated').textContent=data.fetchedAt?`Última consulta à fonte: ${dateText(data.fetchedAt)}. Atualização a cada publicação do site.`:'';const items=data.items.filter(n=>safeURL(n.url)&&n.title);$('news-list').innerHTML=items.length?items.map(n=>`<article class="panel"><time datetime="${e(n.date||'')}">${n.date?dateText(n.date):'Data na fonte'}</time><div><span class="eyebrow">Ministério do Turismo</span><h3><a href="${e(safeURL(n.url))}" target="_blank" rel="noopener noreferrer">${e(n.title)}</a></h3><a href="${e(safeURL(n.url))}" target="_blank" rel="noopener noreferrer">Ler na fonte ${icon('arrow')}</a></div></article>`).join(''):'<div class="empty">A atualização automática está indisponível. <a href="https://www.gov.br/turismo/pt-br/assuntos/noticias" target="_blank" rel="noopener noreferrer">Consultar as notícias no portal oficial</a>.</div>';}catch{if(current===epoch)$('news-list').innerHTML='<p class="empty">Sem conexão para atualizar. <a href="https://www.gov.br/turismo/pt-br/assuntos/noticias">Abrir portal oficial</a>.</p>';}}

async function mayaNews(){
  const current=epoch;
  content.innerHTML=head('Maya · Sua assistente de viagem','Sua próxima viagem começa com uma pergunta.','Destinos, roteiros, gastronomia e dicas práticas. Converse com a Maya e descubra novas formas de explorar o Brasil.')+`<button id="open-maya-news" class="primary">Abrir conversa com a Maya</button><section class="stream-hero stream-news-hero"><video autoplay muted loop playsinline><source src="${mediaLoops[0]}" type="video/mp4"></video><div class="stream-shade"></div><div class="stream-copy"><span class="eyebrow">Notícias em destaque</span><h2>O turismo em movimento.</h2><p>Atualizações oficiais, cultura, natureza e experiências pelo país.</p></div></section><div class="section-head"><div><p class="eyebrow">Informação para viajar melhor</p><h2>Últimas notícias</h2></div></div><p id="news-updated" class="source"></p><div id="news-list" class="stream-track news-stream"><p>Carregando notícias oficiais...</p></div>`;
  let newsItems=[];
  $('open-maya-news').onclick=()=>openMaya('Quero conhecer novidades e planejar uma viagem pelo Brasil.');
  try{
    const r=await fetch('./data/news.json',{cache:'no-store',signal:AbortSignal.timeout(15000)});
    if(!r.ok)throw Error();
    const data=await r.json();if(current!==epoch)return;
    newsItems=data.items.filter(n=>safeURL(n.url)&&n.title);
    $('news-updated').textContent=data.fetchedAt?`Atualizado em ${dateText(data.fetchedAt)}. Notícias com links para a fonte original.`:'';
    $('news-list').innerHTML=newsItems.map((n,i)=>`<article class="stream-card news-card"><video autoplay muted loop playsinline preload="metadata"><source src="${mediaLoops[i%mediaLoops.length]}" type="video/mp4"></video><div><time>${n.date?dateText(n.date):'Na fonte'}</time><span class="eyebrow">Turismo no Brasil</span><h3>${e(n.title)}</h3><a class="button" href="${e(safeURL(n.url))}" target="_blank" rel="noopener noreferrer">Ler notícia ${icon('arrow')}</a></div></article>`).join('')||'<p>Nenhuma notícia disponível agora.</p>';
  }catch{if(current===epoch)$('news-list').innerHTML='<p>Não foi possível carregar as notícias. Você pode continuar conversando com a Maya.</p>';}
}

function business(){content.innerHTML=head('Para negócios locais','Sua empresa no caminho de novos viajantes.','Apresente seu negócio e proponha uma oferta com preço, validade e regras verificáveis.')+`<div class="grid two"><section class="panel"><h2>Como funciona</h2><div class="steps"><p><strong>Cadastre sua conta.</strong><br>Use seu e-mail profissional ou a opção Google quando disponível.</p><p><strong>Prepare uma oferta.</strong><br>Informe empresa, cidade, preço original, preço promocional e a página que comprova as condições.</p><p><strong>Aguarde a análise.</strong><br>Uma proposta só aparece para os viajantes após aprovação. Você acompanha o status aqui.</p><p><strong>Receba o contato.</strong><br>O viajante consulta as condições e finaliza diretamente no seu canal oficial.</p></div></section><section class="panel"><p class="eyebrow">Simulador de proposta</p><h2>Veja antes de enviar.</h2><p>Prepare uma proposta e confira o desconto calculado. A prévia não publica uma oferta.</p><form id="offer-form"><label>Nome da empresa<input name="company_name" required maxlength="100" placeholder="Nome comercial"></label><label>Título da oferta<input name="title" required maxlength="120" placeholder="Descreva o serviço ou experiência"></label><label>Cidade e estado<input name="city" required maxlength="100" placeholder="Cidade, UF"></label><div class="form-row"><label>Preço original (R$)<input name="original" type="number" min="0.01" max="1000000" step="0.01" required></label><label>Preço promocional (R$)<input name="promotional" type="number" min="0" max="1000000" step="0.01" required></label></div><div class="form-row"><label>Início<input name="starts_at" type="date" required></label><label>Fim<input name="ends_at" type="date" required></label></div><label>Condições de uso<textarea name="terms" required minlength="20" maxlength="2000" placeholder="Disponibilidade, o que está incluído e como utilizar."></textarea></label><label>Link oficial com a oferta<input name="source_url" type="url" required placeholder="https://" maxlength="500"></label><label>Canal de reserva ou contato<input name="contact_url" type="url" required placeholder="https://" maxlength="500"></label><label><input type="checkbox" name="authorized" required>Represento a empresa e confirmo que os preços e condições são verdadeiros.</label><button type="submit" class="primary">Calcular e visualizar proposta</button></form><div id="offer-preview" style="margin-top:20px" role="status"></div></section></div><section class="panel" style="margin-top:24px"><h2>Minhas propostas</h2><div id="my-offers"></div></section>`;
  $('offer-form').onsubmit=ev=>{ev.preventDefault();try{const f=Object.fromEntries(new FormData(ev.target)),price=offerPrice(f.original,f.promotional);if(!safeURL(f.source_url)||!safeURL(f.contact_url))throw Error('Os links precisam começar com https://.');const start=new Date(`${f.starts_at}T00:00:00-03:00`),end=new Date(`${f.ends_at}T23:59:59-03:00`);if(end<=start||end<=new Date())throw Error('A validade deve terminar no futuro e depois da data inicial.');const payload={company_name:f.company_name.trim(),title:f.title.trim(),city:f.city.trim(),original_cents:price.base,price_cents:price.price,starts_at:start.toISOString(),ends_at:end.toISOString(),terms:f.terms.trim(),source_url:safeURL(f.source_url),contact_url:safeURL(f.contact_url),status:'pending'};
  $('offer-preview').innerHTML=`<div class="notice"><span class="eyebrow">Prévia / não publicada</span><h3>${e(payload.title)}</h3><p>${e(payload.company_name)} · ${e(payload.city)}</p><strong>${money(price.price)} · ${price.percent}% de desconto</strong><p>${e(payload.terms)}</p><p>Validade: ${dateText(payload.starts_at)} a ${dateText(payload.ends_at)}</p><div class="actions"><button id="download-offer">Baixar proposta</button>${client&&user?'<button id="submit-offer" class="primary">Enviar para análise</button>':'<a href="#conta" class="button">Ver disponibilidade do cadastro</a>'}</div><p class="source">${client?'A proposta passa por verificação antes de ser publicada.':'Recebimento de propostas ainda não ativado. Você pode baixar e guardar sua proposta.'}</p></div>`;$('download-offer').onclick=()=>download('proposta-descubra-brasil.json',JSON.stringify(payload,null,2),'application/json');if($('submit-offer'))$('submit-offer').onclick=async()=>{const b=$('submit-offer');b.disabled=true;const{error}=await client.from('tourism_offers').insert({...payload,owner_id:user.id});if(error){toast('Não foi possível enviar. Confira a conexão e tente novamente.');b.disabled=false;}else{b.textContent='Enviado para análise';toast('Proposta enviada. Ela ainda não está publicada.');loadMyOffers();}};}catch(error){$('offer-preview').textContent=error.message;}};loadMyOffers();}
async function loadMyOffers(){const box=$('my-offers');if(!client||!user){box.innerHTML='<p>Entre em uma conta para enviar e acompanhar propostas. O simulador acima pode ser usado sem cadastro.</p>';return;}box.textContent='Consultando propostas...';const {data,error}=await client.from('tourism_offers').select('*').eq('owner_id',user.id).order('created_at',{ascending:false});if(!box.isConnected)return;box.innerHTML=error?'<p>Não foi possível consultar suas propostas.</p>':data?.length?data.map(o=>`<div class="itinerary-row"><strong>${e(o.title)}</strong><span class="tag">${{pending:'Em análise',approved:'Aprovada',rejected:'Não aprovada'}[o.status]||'Em análise'}</span>${o.status!=='approved'?`<button data-delete-offer="${e(o.id)}">Excluir proposta</button>`:''}</div>`).join(''):'<p>Você ainda não enviou propostas.</p>';box.querySelectorAll('[data-delete-offer]').forEach(b=>b.onclick=async()=>{if(!confirm('Excluir esta proposta?'))return;const{error}=await client.from('tourism_offers').delete().eq('id',b.dataset.deleteOffer);if(error)toast('Não foi possível excluir.');else loadMyOffers();});}

function account(){content.innerHTML=head('Seu espaço','Leve suas descobertas com você.','Favoritos, roteiros e jogos ficam salvos neste navegador. Uma conta permite guardar uma cópia do progresso na nuvem quando o serviço estiver ativo.')+`<div class="grid two"><section class="panel" id="auth-panel"></section><section class="panel"><h2>Seus dados neste aparelho</h2><p>${progress.favorites.length} favoritos · ${progress.itinerary.length} locais no roteiro · ${totalXP(progress)} pontos.</p><div class="actions"><button id="export-data">Exportar meus dados</button><button id="clear-data" class="danger">Apagar progresso local</button></div><p class="source">O modo visitante não é uma conta online. Limpar o navegador apaga o progresso local. Guarde uma cópia se quiser preservá-lo.</p><label>Restaurar cópia exportada<input id="import-data" type="file" accept="application/json,.json"></label><div class="actions" style="margin-top:18px">${user?'<button id="cloud-save">Salvar cópia na nuvem</button><button id="cloud-load">Restaurar da nuvem</button>':''}</div><p id="cloud-status" class="inline-status" role="status"></p></section></div><div class="notice">Para instalar no iPhone, abra no Safari e escolha Compartilhar e Adicionar à Tela de Início. No Android, use Instalar app no menu do navegador quando disponível.</div>`;
  if(!client){$('auth-panel').innerHTML='<span class="tag">Cadastro em preparação</span><h2>Explore sem cadastro.</h2><p>O serviço de conta ainda não foi ativado. Você já pode jogar, salvar lugares e montar roteiros neste aparelho.</p><a href="#jogos" class="button primary">Começar pelos jogos</a>';}else if(user){$('auth-panel').innerHTML=`<span class="tag">Conta conectada</span><h2>Bem-vindo de volta.</h2><p>${e(user.email)}</p><button id="logout">Sair da conta</button><p class="source">O progresso desta conta é separado do modo visitante neste navegador.</p>`;$('logout').onclick=async()=>{const{error}=await client.auth.signOut();if(error)toast('Não foi possível sair. Tente novamente.');};}else{authForm();}
  $('export-data').onclick=()=>download('descubra-meu-progresso.json',JSON.stringify({version:2,progress},null,2),'application/json');$('clear-data').onclick=()=>{if(confirm('Apagar favoritos, roteiro e progresso dos jogos deste aparelho?')){progress=freshProgress();save();account();toast('Progresso local apagado.');}};
  $('import-data').onchange=async ev=>{try{const f=ev.target.files[0];if(!f||f.size>1000000)throw Error();const data=JSON.parse(await f.text());if(data.version!==2||!data.progress)throw Error();if(!confirm('Substituir o progresso atual pela cópia selecionada?'))return;progress=cleanProgress(data.progress,new Set(places.map(p=>p.id)));save();account();toast('Cópia restaurada.');}catch{toast('Arquivo inválido. Selecione uma cópia exportada pelo app.');}};
  if(user){$('cloud-save').onclick=async()=>{const b=$('cloud-save');b.disabled=true;const{error}=await client.from('traveler_progress').upsert({user_id:user.id,progress,updated_at:new Date().toISOString()});$('cloud-status').textContent=error?'Não foi possível salvar na nuvem. Seu progresso local foi mantido.':'Cópia salva na nuvem.';b.disabled=false;};$('cloud-load').onclick=async()=>{if(!confirm('Substituir o progresso local pela cópia salva na nuvem?'))return;const{data,error}=await client.from('traveler_progress').select('progress').eq('user_id',user.id).maybeSingle();if(error||!data){$('cloud-status').textContent='Nenhuma cópia disponível ou falha de conexão.';return;}progress=cleanProgress(data.progress,new Set(places.map(p=>p.id)));save();account();toast('Progresso restaurado da nuvem.');};}}

function authForm(){const box=$('auth-panel');box.innerHTML=`<h2>Entre ou crie sua conta</h2><p>Use um provedor oficial ou receba um link seguro no seu e-mail.</p><div class="provider-grid"><button id="google-login" ${config.googleEnabled?'':'disabled'}>Continuar com Google</button><button id="apple-login" ${config.appleEnabled?'':'disabled'}>Continuar com Apple</button></div>${!config.googleEnabled||!config.appleEnabled?'<p class="source">Os provedores ficam disponíveis após a configuração oficial no Supabase. O acesso por e-mail e o modo visitante continuam ativos.</p>':''}<form id="email-login"><label>Seu e-mail<input type="email" name="email" autocomplete="email" required maxlength="254" placeholder="voce@exemplo.com"></label><label><input type="checkbox" required>Li os <a href="../termos/" target="_blank" rel="noopener">termos</a> e a <a href="../privacidade/" target="_blank" rel="noopener">política de privacidade</a>.</label><button type="submit" class="primary">Entrar ou criar conta por e-mail</button></form><a class="button" href="mailto:descubrabrasil@gmail.com?subject=Recupera%C3%A7%C3%A3o%20de%20acesso">Recuperar acesso</a><a class="button" href="#inicio">Continuar como visitante</a><p id="auth-status" class="inline-status" role="status"></p>`;
  const redirect=new URL('./index.html',location.href).href;
  $('email-login').onsubmit=async ev=>{ev.preventDefault();const b=ev.target.querySelector('button');b.disabled=true;$('auth-status').textContent='Solicitando link...';try{const{error}=await client.auth.signInWithOtp({email:new FormData(ev.target).get('email').trim(),options:{emailRedirectTo:redirect,shouldCreateUser:true}});$('auth-status').textContent=error?'Não foi possível enviar. Verifique o e-mail e tente novamente mais tarde.':'Se o endereço puder receber o acesso, o link chegará em instantes. Confira também a pasta de spam.';}catch{$('auth-status').textContent='Sem conexão. Tente novamente.';}b.disabled=false;};const oauth=provider=>async()=>{if(!$('email-login').querySelector('input[type=checkbox]').checked){toast('Leia e aceite os termos antes de continuar.');return;}const{error}=await client.auth.signInWithOAuth({provider,options:{redirectTo:redirect}});if(error)$('auth-status').textContent=`Acesso com ${provider==='google'?'Google':'Apple'} indisponível. Use o acesso por e-mail.`;};if(config.googleEnabled)$('google-login').onclick=oauth('google');if(config.appleEnabled)$('apple-login').onclick=oauth('apple');}

function openMaya(prefill=''){const drawer=$('maya-drawer'),toggle=$('maya-toggle');drawer.hidden=false;toggle.setAttribute('aria-expanded','true');document.body.classList.add('maya-open');if(prefill){const input=drawer.querySelector('textarea');if(input){input.value=prefill;input.focus();}}}
function closeMaya(){$('maya-drawer').hidden=true;$('maya-toggle').setAttribute('aria-expanded','false');document.body.classList.remove('maya-open');}

function route(){epoch++;clearTimeout(gameTimer);nav();const page=location.hash.slice(1)||'inicio';document.title=`${labels[page]||'Descubra'} | Descubra o Brasil`;({inicio:home,descobrir:explore,mapa:mapView,viagens:trips,perfil:account,jogos:games,ofertas:offers,noticias:mayaNews,empresas:business,conta:account,explorar:explore}[page]||home)();window.scrollTo(0,0);content.focus({preventScroll:true});}

async function init(){try{const r=await fetch('./data/destinations.json');if(!r.ok)throw Error();const data=await r.json();states=data.states;places=data.places;readProgress();route();window.addEventListener('hashchange',route);}catch{content.innerHTML=head('Conexão indisponível','Não conseguimos carregar os destinos.','Verifique a conexão e recarregue a página.')+'<button id="retry">Tentar novamente</button>';$('retry').onclick=()=>location.reload();return;}
  try{config=await(await fetch('./config.json',{cache:'no-store'})).json();if(config.supabaseUrl&&config.supabaseKey&&window.supabase){client=window.supabase.createClient(config.supabaseUrl,config.supabaseKey,{auth:{detectSessionInUrl:true,persistSession:true,autoRefreshToken:true}});const{data}=await client.auth.getSession();user=data.session?.user||null;readProgress();client.auth.onAuthStateChange((event,session)=>{const next=session?.user||null;if(next?.id!==user?.id){user=next;readProgress();if(['conta','empresas','ofertas'].includes(location.hash.slice(1)))route();}});if(user && (location.hash.includes('access_token')||location.hash===''||location.hash.includes('error')))history.replaceState(null,'',location.pathname+'#conta');route();}}catch{localOnly=true;}
  mountMaya($('maya-persistent-root'),{config,getContext:()=>({page:location.hash.slice(1)||'inicio',itinerary:progress.itinerary.map(id=>places.find(p=>p.id===id)).filter(Boolean),favorites:progress.favorites.map(id=>places.find(p=>p.id===id)).filter(Boolean)})});$('maya-toggle').onclick=()=>$('maya-drawer').hidden?openMaya():closeMaya();$('maya-close').onclick=closeMaya;
  if('serviceWorker'in navigator)navigator.serviceWorker.register('./sw.js').catch(()=>{});
}
let deferredInstall=null;window.addEventListener('beforeinstallprompt',event=>{event.preventDefault();deferredInstall=event;$('install').hidden=false;});$('install').onclick=async()=>{if(!deferredInstall)return;await deferredInstall.prompt();await deferredInstall.userChoice;deferredInstall=null;$('install').hidden=true;};window.addEventListener('appinstalled',()=>{$('install').hidden=true;});init();


