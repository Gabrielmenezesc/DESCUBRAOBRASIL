const IBGE_MUNICIPIOS='https://servicodados.ibge.gov.br/api/v1/localidades/municipios';
const IBGE_STATE_SHAPES='https://servicodados.ibge.gov.br/api/v3/malhas/estados?formato=application/vnd.geo%2Bjson&qualidade=minima';
const BRAZIL=[-51.9253,-14.235];
const REGION_BY_UF={
  AC:'Norte',AL:'Nordeste',AP:'Norte',AM:'Norte',BA:'Nordeste',CE:'Nordeste',DF:'Centro-Oeste',ES:'Sudeste',GO:'Centro-Oeste',MA:'Nordeste',MT:'Centro-Oeste',MS:'Centro-Oeste',MG:'Sudeste',PA:'Norte',PB:'Nordeste',PR:'Sul',PE:'Nordeste',PI:'Nordeste',RJ:'Sudeste',RN:'Nordeste',RS:'Sul',RO:'Norte',RR:'Norte',SC:'Sul',SP:'Sudeste',SE:'Nordeste',TO:'Norte'
};
const REGION_COLORS={Norte:'#168f70',Nordeste:'#e6a31d','Centro-Oeste':'#0d719d',Sudeste:'#b54978',Sul:'#6849b7'};
const UF_BY_IBGE_CODE={11:'RO',12:'AC',13:'AM',14:'RR',15:'PA',16:'AP',17:'TO',21:'MA',22:'PI',23:'CE',24:'RN',25:'PB',26:'PE',27:'AL',28:'SE',29:'BA',31:'MG',32:'ES',33:'RJ',35:'SP',41:'PR',42:'SC',43:'RS',50:'MS',51:'MT',52:'GO',53:'DF'};
let maplibreReady;

function escapeHTML(value=''){return String(value).replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[char]));}
function normalize(value=''){return String(value).normalize('NFD').replace(/[\\u0300-\\u036f]/g,'').toLowerCase();}
function weatherText(code){
  if(code===0)return['Céu limpo','☀'];
  if([1,2].includes(code))return['Parcialmente nublado','⛅'];
  if(code===3)return['Nublado','☁'];
  if([45,48].includes(code))return['Neblina','◌'];
  if([51,53,55,56,57,61,63,65,66,67,80,81,82].includes(code))return['Chuva','☂'];
  if([95,96,99].includes(code))return['Trovoadas','ϟ'];
  return['Condição variável','◒'];
}
function loadMapLibre(){
  if(maplibreReady)return maplibreReady;
  maplibreReady=new Promise((resolve,reject)=>{
    if(window.maplibregl){resolve(window.maplibregl);return;}
    const css=document.createElement('link');css.rel='stylesheet';css.href='https://unpkg.com/maplibre-gl@5.1.0/dist/maplibre-gl.css';document.head.append(css);
    const script=document.createElement('script');script.src='https://unpkg.com/maplibre-gl@5.1.0/dist/maplibre-gl.js';script.async=true;
    script.onload=()=>window.maplibregl?resolve(window.maplibregl):reject(new Error('Mapa indisponível'));
    script.onerror=()=>reject(new Error('Não foi possível carregar o mapa.'));
    document.head.append(script);
  });
  return maplibreReady;
}
function insertStyles(){
  if(document.getElementById('mapa-vivo-styles'))return;
  const style=document.createElement('style');style.id='mapa-vivo-styles';style.textContent=`
  .map-live{position:relative;min-height:calc(100dvh - 72px);margin:-18px -14px 0;background:#082b23;color:#10221b;overflow:hidden}
  .map-live-canvas{position:absolute;inset:0;background:linear-gradient(145deg,#b9dff0,#dff2e4)}
  .map-live-canvas .maplibregl-ctrl-bottom-right,.map-live-canvas .maplibregl-ctrl-bottom-left{display:none}
  .map-live-top{position:relative;z-index:5;display:grid;gap:10px;padding:max(14px,env(safe-area-inset-top)) 14px 0;pointer-events:none}
  .map-live-search,.map-live-filters,.map-live-search *,.map-live-filters *{pointer-events:auto}
  .map-live-search{display:grid;grid-template-columns:1fr auto auto;gap:8px;max-width:900px;margin:0 auto;width:100%;padding:8px;border-radius:24px;background:rgba(255,255,255,.94);box-shadow:0 16px 44px rgba(2,26,18,.24);border:1px solid rgba(255,255,255,.82)}
  .map-live-search label{display:flex;gap:10px;align-items:center;min-width:0;padding:0 12px;border:1px solid #d7e4dc;border-radius:17px;background:#fff}
  .map-live-search label svg{width:21px;height:21px;flex:0 0 auto;color:#087447}
  .map-live-search input{width:100%;min-width:0;height:48px;border:0;outline:0;background:transparent;color:#10221b;font:inherit;font-size:15px}
  .map-live-search button,.map-live-pill,.map-live-action{border:0;cursor:pointer;font:inherit;font-weight:800}
  .map-live-search button{min-height:48px;border-radius:16px;padding:0 14px;color:#fff;background:#087447}
  .map-live-search button:hover,.map-live-action:hover{background:#075d3a}
  .map-voice-button{width:48px;padding:0!important;border-radius:16px!important}
  .map-live-filters{display:flex;gap:8px;overflow:auto;scrollbar-width:none;max-width:900px;width:100%;margin:0 auto;padding:2px}
  .map-live-filters::-webkit-scrollbar{display:none}.map-live-pill{white-space:nowrap;padding:10px 14px;color:#123426;background:rgba(255,255,255,.94);border-radius:999px;box-shadow:0 8px 22px rgba(2,26,18,.17)}
  .map-live-pill[aria-pressed="true"]{color:#fff;background:#087447}
  .map-live-suggestions{position:relative;max-width:640px;width:calc(100% - 12px);margin:0 auto;z-index:8;border-radius:16px;overflow:hidden;background:#fff;box-shadow:0 16px 38px rgba(2,26,18,.24)}
  .map-live-suggestions[hidden]{display:none}.map-live-suggestions button{display:block;width:100%;padding:12px 16px;text-align:left;border:0;border-bottom:1px solid #edf2ee;background:#fff;color:#10221b;font:inherit;cursor:pointer}.map-live-suggestions button:hover{background:#eff8f2}.map-live-suggestions small{display:block;color:#587066;margin-top:2px}
  .map-live-weather{position:absolute;z-index:4;right:14px;top:178px;width:min(298px,calc(100% - 28px));padding:14px;border-radius:21px;background:rgba(255,255,255,.93);box-shadow:0 15px 42px rgba(2,26,18,.22);backdrop-filter:blur(16px)}
  .map-live-weather-head{display:flex;justify-content:space-between;gap:10px}.map-live-weather h2{margin:0;color:#10221b;font-size:15px}.map-live-weather p{margin:3px 0 0;color:#527064;font-size:12px}.map-live-weather .map-temp{font-size:35px;font-weight:900;letter-spacing:-.07em;line-height:1}.map-live-weather .map-weather-icon{font-size:27px;color:#e19b13}
  .map-live-weather-stats{display:grid;grid-template-columns:repeat(3,1fr);gap:7px;margin-top:12px}.map-live-weather-stats div{padding:8px 5px;border-radius:12px;background:#eef7f1;text-align:center}.map-live-weather-stats strong{display:block;font-size:12px}.map-live-weather-stats span{font-size:10px;color:#577067}
  .map-live-tools{position:absolute;z-index:4;right:14px;top:318px;display:grid;gap:8px}.map-live-tools button{display:grid;place-items:center;width:46px;height:46px;border:0;border-radius:15px;background:#fff;color:#0b6842;box-shadow:0 9px 22px rgba(2,26,18,.2);font-weight:900;cursor:pointer}
  .map-live-sheet{position:absolute;z-index:5;left:50%;bottom:calc(18px + env(safe-area-inset-bottom));transform:translateX(-50%);width:min(660px,calc(100% - 28px));padding:12px;border-radius:25px;background:rgba(255,255,255,.96);box-shadow:0 18px 60px rgba(2,26,18,.3);display:grid;grid-template-columns:auto 1fr auto;gap:12px;align-items:center}
  .map-live-sheet[hidden]{display:none}.map-live-sheet img[hidden]{display:none}.map-live-sheet img{width:78px;height:78px;object-fit:cover;border-radius:17px;background:#dcebe2}.map-live-sheet h2{margin:0;color:#10221b;font-size:18px}.map-live-sheet p{margin:4px 0;color:#536f62;font-size:13px}.map-live-sheet .map-live-action{padding:13px 16px;border-radius:15px;color:#fff;background:#087447;white-space:nowrap}
  .map-live-status{position:absolute;z-index:7;left:50%;bottom:130px;transform:translateX(-50%);max-width:calc(100% - 36px);padding:9px 13px;border-radius:999px;background:rgba(3,34,24,.9);color:#fff;font-size:12px;box-shadow:0 10px 25px rgba(0,0,0,.25)}
  .map-live-status:empty{display:none}.map-live-region-legend{position:absolute;z-index:4;left:14px;bottom:156px;display:flex;gap:6px;flex-wrap:wrap;max-width:260px}.map-live-region-legend span{padding:7px 9px;border-radius:999px;background:rgba(255,255,255,.9);color:#18362a;font-size:10px;font-weight:800;box-shadow:0 7px 18px rgba(2,26,18,.14)}.map-live-region-legend i{display:inline-block;width:8px;height:8px;border-radius:50%;margin-right:4px}
  .map-live-marker{width:34px;height:34px;border:3px solid #fff;border-radius:50% 50% 50% 6px;transform:rotate(-45deg);box-shadow:0 8px 18px rgba(2,26,18,.34);display:grid;place-items:center}.map-live-marker b{transform:rotate(45deg);font-size:10px;color:#fff;line-height:1}.map-live-marker--free{background:#087447}.map-live-marker--culture{background:#a14777}.map-live-marker--nature{background:#158c74}.map-live-marker--partner{background:#d18a13}.map-live-marker--hotel{background:#226ba2}
  @media(max-width:700px){.map-live{margin:-12px -12px 0;min-height:calc(100dvh - 66px)}.map-live-top{padding:14px 10px 0}.map-live-search{grid-template-columns:1fr auto;gap:7px;padding:7px;border-radius:21px}.map-live-search label{grid-column:1/-1}.map-live-search input{height:46px;font-size:14px}.map-live-search button{min-height:44px;font-size:12px}.map-live-filters{padding-left:4px}.map-live-pill{padding:9px 12px;font-size:12px}.map-live-weather{top:151px;right:10px;width:206px;padding:11px}.map-live-weather h2{font-size:12px}.map-live-weather .map-temp{font-size:29px}.map-live-weather-stats{gap:4px;margin-top:8px}.map-live-weather-stats div{padding:6px 3px}.map-live-weather-stats strong{font-size:11px}.map-live-tools{right:10px;top:298px}.map-live-tools button{width:43px;height:43px}.map-live-region-legend{display:none}.map-live-sheet{bottom:max(12px,env(safe-area-inset-bottom));grid-template-columns:auto 1fr;gap:10px;border-radius:22px;padding:10px}.map-live-sheet img{width:62px;height:62px}.map-live-sheet h2{font-size:15px}.map-live-sheet p{font-size:11px}.map-live-sheet .map-live-action{grid-column:1/-1;width:100%;padding:11px}.map-live-status{bottom:140px;font-size:11px}.map-live-canvas .maplibregl-ctrl-top-right{top:0}.map-live-canvas .maplibregl-ctrl-group{border-radius:12px;overflow:hidden}}
  @media(prefers-reduced-motion:reduce){.map-live *{transition:none!important;animation:none!important}}
  `;document.head.append(style);
}
function pinElement(type='nature'){
  const el=document.createElement('button');el.type='button';el.className='map-live-marker map-live-marker--'+type;el.setAttribute('aria-label','Ver detalhes no mapa');el.innerHTML='<b>●</b>';return el;
}
function placeKind(place){
  const text=normalize([place.category,place.name,place.description].join(' '));
  if(place.partner||text.includes('diroma'))return'partner';
  if(text.includes('hotel')||text.includes('pousada'))return'hotel';
  if(text.includes('museu')||text.includes('cultura')||text.includes('histor'))return'culture';
  if(place.free)return'free';
  return'nature';
}
function placeImage(place){return place.image||place.photo||'';}
async function getWeather(lng,lat){
  const url=new URL('https://api.open-meteo.com/v1/forecast');url.searchParams.set('longitude',String(lng));url.searchParams.set('latitude',String(lat));url.searchParams.set('current','temperature_2m,apparent_temperature,relative_humidity_2m,wind_speed_10m,weather_code');url.searchParams.set('hourly','precipitation_probability');url.searchParams.set('timezone','auto');url.searchParams.set('forecast_days','1');
  const response=await fetch(url);if(!response.ok)throw new Error('Clima indisponível');const data=await response.json();const current=data.current||{};const now=new Date();const times=data.hourly?.time||[];const index=Math.max(0,times.findIndex(time=>new Date(time)>=now));return {temperature:Math.round(current.temperature_2m),feels:Math.round(current.apparent_temperature),humidity:Math.round(current.relative_humidity_2m),wind:Math.round(current.wind_speed_10m),rain:Math.round(data.hourly?.precipitation_probability?.[index]||0),condition:weatherText(current.weather_code),updated:current.time};
}
async function locatePlace(query){
  const url=new URL('https://geocoding-api.open-meteo.com/v1/search');url.searchParams.set('name',query);url.searchParams.set('count','10');url.searchParams.set('language','pt');url.searchParams.set('format','json');url.searchParams.set('countryCode','BR');
  const response=await fetch(url);if(!response.ok)throw new Error('Localização indisponível');return (await response.json()).results||[];
}
export async function mountBrazilMap(root,{places=[],askMaya,toast=()=>{}}={}){
  insertStyles();
  root.innerHTML=`<section class="map-live" aria-label="Mapa vivo do Brasil">
    <div class="map-live-canvas" id="brazil-live-map" role="application" aria-label="Mapa interativo 3D do Brasil"></div>
    <div class="map-live-top">
      <form class="map-live-search" id="map-live-search">
        <label><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m16 16 5 5"/></svg><input id="map-live-query" type="search" autocomplete="off" placeholder="Busque cidade, praia, hotel ou atração"></label>
        <button type="submit">Explorar</button><button type="button" class="map-voice-button" id="map-live-voice" aria-label="Falar com a Maya">Voz</button>
      </form>
      <div class="map-live-filters" aria-label="Categorias do mapa">
        <button class="map-live-pill" data-map-filter="all" aria-pressed="true">Tudo</button><button class="map-live-pill" data-map-filter="praia" aria-pressed="false">Praias</button><button class="map-live-pill" data-map-filter="cultura" aria-pressed="false">Cultura</button><button class="map-live-pill" data-map-filter="hotel" aria-pressed="false">Hotéis</button><button class="map-live-pill" data-map-filter="gastronomia" aria-pressed="false">Restaurantes</button><button class="map-live-pill" data-map-filter="gratis" aria-pressed="false">Grátis</button><button class="map-live-pill" data-map-filter="diroma" aria-pressed="false">diRoma</button>
      </div>
      <div class="map-live-suggestions" id="map-live-suggestions" hidden></div>
    </div>
    <aside class="map-live-weather" aria-live="polite"><div class="map-live-weather-head"><div><h2 id="map-weather-place">Clima no mapa</h2><div class="map-temp" id="map-temperature">--°</div><p id="map-weather-description">Escolha uma cidade ou ponto no mapa.</p></div><div class="map-weather-icon" id="map-weather-icon">◒</div></div><div class="map-live-weather-stats"><div><strong id="map-rain">--%</strong><span>Chuva</span></div><div><strong id="map-wind">-- km/h</strong><span>Vento</span></div><div><strong id="map-humidity">--%</strong><span>Umidade</span></div></div></aside>
    <div class="map-live-tools"><button type="button" id="map-locate" aria-label="Minha localização">◎</button><button type="button" id="map-rotate" aria-label="Girar mapa">3D</button><button type="button" id="map-recenter" aria-label="Ver Brasil">BR</button></div>
    <div class="map-live-region-legend" aria-label="Cores por região"><span><i style="background:#168f70"></i>Norte</span><span><i style="background:#e6a31d"></i>Nordeste</span><span><i style="background:#0d719d"></i>Centro-Oeste</span><span><i style="background:#b54978"></i>Sudeste</span><span><i style="background:#6849b7"></i>Sul</span></div>
    <div class="map-live-sheet" id="map-live-sheet" hidden><img id="map-sheet-image" alt="" /><div><h2 id="map-sheet-title">Explore o Brasil</h2><p id="map-sheet-meta">Selecione um marcador para ver detalhes.</p></div><button type="button" class="map-live-action" id="map-sheet-action">Perguntar à Maya</button></div>
    <p class="map-live-status" id="map-live-status" role="status"></p>
  </section>`;
  const $=id=>root.querySelector('#'+id);
  const setStatus=message=>{const status=$('map-live-status');status.textContent=message;clearTimeout(setStatus.timer);setStatus.timer=setTimeout(()=>{if(status)status.textContent='';},4200);};
  const query=$('map-live-query'),suggestions=$('map-live-suggestions'),sheet=$('map-live-sheet');
  let cities=[],activeFilter='all',markers=[],activePlace=null,map=null,maplibre=null;
  const cityCache=new Map();
  try{maplibre=await loadMapLibre();}catch(error){root.querySelector('.map-live').innerHTML='<div class="empty" style="padding:48px 20px;color:#fff">Não foi possível carregar o mapa agora. Verifique sua conexão e tente novamente.</div>';return;}
  if(!root.isConnected)return;
  map=new maplibre.Map({container:'brazil-live-map',style:{version:8,sources:{osm:{type:'raster',tiles:['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],tileSize:256,attribution:'© OpenStreetMap contributors'}},layers:[{id:'osm',type:'raster',source:'osm'}]},center:BRAZIL,zoom:3.4,pitch:43,bearing:-8,maxPitch:60,minZoom:3,maxZoom:18,attributionControl:true});
  map.addControl(new maplibre.NavigationControl({visualizePitch:true}),'bottom-right');
  const setWeather=async(lng,lat,label)=>{
    $('map-weather-place').textContent=label||'Clima do local';
    $('map-weather-description').textContent='Atualizando previsão...';
    try{const weather=await getWeather(lng,lat);if(!root.isConnected)return;const [description,icon]=weather.condition;$('map-temperature').textContent=Number.isFinite(weather.temperature)?weather.temperature+'°':'--°';$('map-weather-description').textContent=description+' · atualizado '+String(weather.updated||'agora').slice(11,16);$('map-weather-icon').textContent=icon;$('map-rain').textContent=weather.rain+'%';$('map-wind').textContent=weather.wind+' km/h';$('map-humidity').textContent=weather.humidity+'%';}catch{$('map-weather-description').textContent='Previsão indisponível agora.';}
  };
  const showPlace=place=>{
    activePlace=place;
    $('map-sheet-title').textContent=place.name||place.city||'Local selecionado';
    $('map-sheet-meta').textContent=[place.city,place.state,place.free?'Acesso gratuito indicado':'Consulte condições e preços locais'].filter(Boolean).join(' · ');
    const image=placeImage(place);const imageElement=$('map-sheet-image');if(image){imageElement.src=image;imageElement.alt=place.name||'Imagem do local';imageElement.hidden=false;}else{imageElement.removeAttribute('src');imageElement.alt='';imageElement.hidden=true;}
    sheet.hidden=false;setWeather(place.lng,place.lat,place.name||place.city);map.flyTo({center:[place.lng,place.lat],zoom:Math.max(map.getZoom(),place.zoom||12),pitch:55,bearing:map.getBearing(),essential:true});
  };
  const clearMarkers=()=>{markers.forEach(marker=>marker.remove());markers=[];};
  const renderMarkers=()=>{
    if(!map||!map.loaded())return;
    clearMarkers();
    const visible=places.filter(place=>{
      const kind=placeKind(place);const text=normalize([place.category,place.name,place.city,place.description].join(' '));
      if(activeFilter==='all')return true;
      if(activeFilter==='gratis')return Boolean(place.free);
      if(activeFilter==='diroma')return text.includes('diroma');
      if(activeFilter==='hotel')return kind==='hotel';
      if(activeFilter==='cultura')return kind==='culture';
      return text.includes(activeFilter);
    }).filter(place=>Number.isFinite(place.lng)&&Number.isFinite(place.lat));
    visible.forEach(place=>{const marker=new maplibre.Marker({element:pinElement(placeKind(place)),anchor:'bottom'}).setLngLat([place.lng,place.lat]).addTo(map);marker.getElement().onclick=()=>showPlace(place);markers.push(marker);});
  };
  const setFilter=filter=>{
    activeFilter=filter;
    root.querySelectorAll('[data-map-filter]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.mapFilter===filter)));
    if(filter==='diroma'){query.value='diRoma Caldas Novas';runSearch(query.value);return;}
    renderMarkers();setStatus(filter==='all'?'Mostrando os pontos do catálogo.':`Filtro ${filter} aplicado.`);
  };
  const moveToCity=async(city)=>{
    const cacheKey=city.nome+' '+city.uf;
    let result=cityCache.get(cacheKey);
    if(!result){const results=await locatePlace(city.nome+' '+city.uf+' Brasil');result=results.find(item=>item.country_code==='BR')||results[0];if(result)cityCache.set(cacheKey,result);}
    if(!result){setStatus('Não foi possível localizar essa cidade agora.');return;}
    const point={name:city.nome,city:city.nome,state:city.uf,lat:result.latitude,lng:result.longitude,free:false,zoom:11};
    showPlace(point);setStatus(city.nome+' · '+city.uf+' selecionada.');
  };
  const renderSuggestions=value=>{
    const term=normalize(value);if(term.length<2){suggestions.hidden=true;suggestions.innerHTML='';return;}
    const selected=cities.filter(city=>normalize(city.nome+' '+city.uf).includes(term)).slice(0,8);
    suggestions.innerHTML=selected.map((city,index)=>`<button type="button" data-city-index="${index}">${escapeHTML(city.nome)}<small>${escapeHTML(city.uf)} · ${escapeHTML(city.region)}</small></button>`).join('');
    suggestions.hidden=!selected.length;
    suggestions.querySelectorAll('[data-city-index]').forEach(button=>button.onclick=()=>{const city=selected[Number(button.dataset.cityIndex)];suggestions.hidden=true;query.value=city.nome+' · '+city.uf;moveToCity(city);});
  };
  const runSearch=async raw=>{
    const value=String(raw||'').trim();if(!value)return;
    const local=places.find(place=>normalize([place.name,place.city,place.state].join(' ')).includes(normalize(value)));
    if(local){showPlace(local);askMaya?.(`No mapa, mostre ${local.name} em ${local.city}. Conte o que é importante para planejar a visita.`);return;}
    const exact=cities.find(city=>normalize(city.nome+' '+city.uf)===normalize(value)||normalize(city.nome)===normalize(value));
    if(exact){await moveToCity(exact);askMaya?.(`Quero conhecer ${exact.nome}, ${exact.uf}. Sugira um roteiro e pontos de interesse.`);return;}
    const results=await locatePlace(value);const result=results.find(item=>item.country_code==='BR')||results[0];
    if(!result){setStatus('Não encontrei esse local. Tente cidade e estado.');return;}
    const isDiRoma=/diroma/i.test(value);const place={name:isDiRoma?'diRoma · Caldas Novas':(result.name||value),city:result.name||value,state:result.admin1||'Brasil',lat:result.latitude,lng:result.longitude,zoom:result.feature_code==='PPL'?11:13,partner:isDiRoma,description:isDiRoma?'Parceiro em Caldas Novas. Consulte endereço, preços e disponibilidade no canal oficial.':''};
    showPlace(place);askMaya?.(`No mapa, pesquise ${value} e me ajude a encontrar atrações, hospedagem, cultura e opções gratuitas.`);
  };
  $('map-live-search').onsubmit=event=>{event.preventDefault();suggestions.hidden=true;runSearch(query.value).catch(()=>setStatus('Pesquisa indisponível agora.'))};
  query.oninput=()=>renderSuggestions(query.value);
  $('map-live-voice').onclick=()=>{
    const Recognition=window.SpeechRecognition||window.webkitSpeechRecognition;
    if(!Recognition){setStatus('A busca por voz não é suportada neste navegador.');return;}
    const recognition=new Recognition();recognition.lang='pt-BR';recognition.interimResults=false;recognition.maxAlternatives=1;setStatus('Estou ouvindo. Diga uma cidade ou destino.');
    recognition.onresult=event=>{const text=event.results[0][0].transcript;query.value=text;runSearch(text).catch(()=>setStatus('Não consegui pesquisar por voz agora.'));askMaya?.(`O usuário falou: "${text}". Ajude no planejamento pelo mapa.`);};
    recognition.onerror=()=>setStatus('Não foi possível usar o microfone. Confira a permissão.');
    recognition.start();
  };
  $('map-locate').onclick=()=>{
    if(!navigator.geolocation){setStatus('Localização não disponível neste aparelho.');return;}
    navigator.geolocation.getCurrentPosition(position=>{const {latitude,longitude}=position.coords;const place={name:'Sua localização',city:'Sua localização',lat:latitude,lng:longitude,zoom:13};showPlace(place);setStatus('Sua localização foi centralizada no mapa.');},()=>setStatus('Permita sua localização para usar este recurso.'),{enableHighAccuracy:true,timeout:12000,maximumAge:60000});
  };
  $('map-recenter').onclick=()=>{sheet.hidden=true;map.flyTo({center:BRAZIL,zoom:3.4,pitch:43,bearing:-8,essential:true});setStatus('Voltamos para a visão geral do Brasil.');};
  $('map-rotate').onclick=()=>{const next=map.getPitch()>5?0:55;map.easeTo({pitch:next,bearing:next?map.getBearing()+26:0,duration:750});setStatus(next?'Visualização 3D ativada.':'Visualização plana ativada.');};
  $('map-sheet-action').onclick=()=>{if(!activePlace)return;askMaya?.(`Estou vendo ${activePlace.name||activePlace.city} no mapa. Monte um roteiro com locais gratuitos, culturais, hospedagem e cuidados para a visita.`);toast('A Maya recebeu o destino selecionado.');};
  root.querySelectorAll('[data-map-filter]').forEach(button=>button.onclick=()=>setFilter(button.dataset.mapFilter));
  map.on('load',async()=>{
    renderMarkers();setWeather(BRAZIL[0],BRAZIL[1],'Brasil');
    try{
      const response=await fetch(IBGE_STATE_SHAPES);if(!response.ok)throw new Error();const geojson=await response.json();if(!map.getSource('ibge-states')){
        map.addSource('ibge-states',{type:'geojson',data:geojson});
        const match=['match',['to-string',['coalesce',['get','codarea'],['get','id']]]];
        Object.entries(UF_BY_IBGE_CODE).forEach(([code,uf])=>match.push(code,REGION_COLORS[REGION_BY_UF[uf]]));
        match.push('#0b7757');
        map.addLayer({id:'ibge-states-3d',type:'fill-extrusion',source:'ibge-states',paint:{'fill-extrusion-color':match,'fill-extrusion-height':['interpolate',['linear'],['zoom'],3,12000,5,26000,8,70000],'fill-extrusion-opacity':.33}});
        map.addLayer({id:'ibge-states-outline',type:'line',source:'ibge-states',paint:{'line-color':'#ffffff','line-width':1.2,'line-opacity':.68}});
      }
    }catch{setStatus('Limites estaduais não puderam ser carregados agora. O mapa continua disponível.');}
    try{
      const response=await fetch(IBGE_MUNICIPIOS);if(!response.ok)throw new Error();const rows=await response.json();cities=rows.map(row=>{const uf=row.microrregiao?.mesorregiao?.UF||row.regiaoImediata?.regiaoIntermediaria?.UF||{};return{nome:row.nome,uf:uf.sigla||'',region:uf.regiao?.nome||REGION_BY_UF[uf.sigla]||'Brasil'};}).filter(city=>city.nome&&city.uf);setStatus(`${cities.length.toLocaleString('pt-BR')} municípios carregados para pesquisa.`);}catch{setStatus('A lista oficial de municípios não está disponível agora. Você ainda pode pesquisar destinos.');}
  });
}