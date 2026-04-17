/* ═══════════════════════════════════════════════════════════════
   DESCUBRA O BRASIL — main.js v3 (Uber-Style Complete)
   Screens: home / map / hotels
   Features: search-lupa, live-news (30min cache), POI map,
             Maya chat, drive-modal (GMaps/Waze/OSM), reservations
═══════════════════════════════════════════════════════════════ */
'use strict';

const API = `http://${window.location.hostname}:3000/api`;

/* ── State ─────────────────────────────────────────────────── */
let map = null;
let userLatLng = [-15.78, -47.93]; // Brasília default
let userMarker = null;
let watchId = null;
let followUser = false;
let allHotels = [], allPOIs = [];
let allMarkers = [];
let routeLine = null;
let currentFilter = 'all';
let activePOI = null;
let activeNav = null; // current drive destination {lat,lng,name}

/* ── CAT CONFIG ────────────────────────────────────────────── */
const CAT = {
    hotel: { icon: '🏨', color: '#0057B8', label: 'Hotel', tag: 'tag-trend' },
    restaurante: { icon: '🍽️', color: '#DC2626', label: 'Restaurante', tag: 'tag-food' },
    bar: { icon: '🍺', color: '#D97706', label: 'Bar', tag: 'tag-adventure' },
    turismo: { icon: '📸', color: '#059669', label: 'Turismo Gratuito', tag: 'tag-eco' }
};

const MAYA_TIPS = {
    hotel: ['Reserve logo antes que esgote! 🏨', 'Verifique disponibilidade para as suas datas!', 'Um dos hotéis mais bem avaliados da região!'],
    restaurante: ['Reserve uma mesa — fins de semana enchem rápido! 🍽️', 'Experimente a especialidade da casa!', 'Culinária local que vai te encantar!'],
    bar: ['Melhor horário: a partir das 19h! 🍺', 'Peça a bebida da casa!', 'Ótimas avaliações de atmosfera!'],
    turismo: ['Entrada GRATUITA! 📸 Chegue cedo para melhores fotos!', 'Um patrimônio imperdível do Brasil!', 'Coloque no topo do seu roteiro!']
};

/* ── NEWS DATA (12 items rotated) ──────────────────────────── */
const NEWS_DB = [
    { t: 'Rio de Janeiro bate recorde de visitantes em 2026', d: 'A Cidade Maravilhosa recebeu 1,5 mi de turistas estrangeiros no primeiro trimestre — recorde histórico.', tag: 'tag-trend', tl: '📈 Tendência', img: 'https://images.unsplash.com/photo-1483729558449-99ef09a8c325?w=500&q=75', url: 'https://www.riotur.rio/' },
    { t: 'Lençóis Maranhenses: lagoas cheias até julho', d: 'A temporada de chuvas garantiu as lagoas mais belas dos últimos anos. Visite antes do mês acabar!', tag: 'tag-eco', tl: '🌿 Ecoturismo', img: 'https://images.unsplash.com/photo-1627845348873-10e9f1a7b056?w=500&q=75', url: 'https://www.turismo.ma.gov.br' },
    { t: 'Gastronomia mineira vira patrimônio da UNESCO', d: 'Pão de queijo, frango com quiabo e doce de leite são reconhecidos como patrimônio cultural imaterial.', tag: 'tag-food', tl: '🍽️ Gastronomia', img: 'https://images.unsplash.com/photo-1543343549-9df2436159af?w=500&q=75', url: 'https://www.turismodeminas.com.br' },
    { t: 'Fernando de Noronha amplia acesso para 2026', d: 'O paraíso ecológico abre 15% mais vagas com trilhas supervisionadas em áreas antes protegidas.', tag: 'tag-eco', tl: '🌊 Aventura', img: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=500&q=75', url: 'https://www.noronha.pe.gov.br' },
    { t: 'Teatro Amazonas: temporada 2026 com artistas internacionais', d: 'O icônico teatro de Manaus recebe shows exclusivos de julho a novembro com ingressos a partir de R$40.', tag: 'tag-culture', tl: '🎬 Cultura', img: 'https://images.unsplash.com/photo-1433086966358-54859d0ed716?w=500&q=75', url: 'https://www.turismo.am.gov.br' },
    { t: 'Bonito (MS): temporada de mergulho aberta', d: 'As águas cristalinas do Rio da Prata estão no auge. Agende sua flutuação com antecedência!', tag: 'tag-eco', tl: '🤿 Ecoturismo', img: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=500&q=75', url: 'https://www.bonito.ms.gov.br' },
    { t: 'Pelourinho: eleito mais belo centro histórico das Américas', d: 'O coração de Salvador recebe prêmio internacional de preservação cultural sustentável em 2026.', tag: 'tag-culture', tl: '🏛️ Patrimônio', img: 'https://images.unsplash.com/photo-1605647540924-852290f6b0d5?w=500&q=75', url: 'https://www.bahiatursa.ba.gov.br' },
    { t: 'Pantanal é o melhor destino de observação de aves do mundo', d: 'Com 650+ espécies registradas, o Pantanal conquista o primeiro lugar no ranking global de birdwatching.', tag: 'tag-eco', tl: '🦜 Natureza', img: 'https://images.unsplash.com/photo-1553361371-9b22f78e8b1d?w=500&q=75', url: 'https://www.turismo.mt.gov.br' },
    { t: 'Florianópolis entre as 10 melhores cidades costeiras do mundo', d: 'A Ilha da Magia é reconhecida pelo Condé Nast Traveler pelo segundo ano consecutivo.', tag: 'tag-trend', tl: '🌟 Destaque', img: 'https://images.unsplash.com/photo-1519451241324-20b4ea2c4220?w=500&q=75', url: 'https://www.descubrafloripa.com.br' },
    { t: 'Carnaval 2027: pré-venda de camarotes no Rio esgota em horas', d: 'O maior espetáculo do mundo começa a se preparar. Reserve agora para garantir o melhor lugar!', tag: 'tag-trend', tl: '🎉 Evento', img: 'https://images.unsplash.com/photo-1547895426-b7efae84c2a0?w=500&q=75', url: 'https://www.riotur.rio/carnaval' },
    { t: 'SP Gastronomia 2026: 400 restaurantes participam', d: 'O maior festival gastronômico da América Latina volta com menus exclusivos e preços acessíveis.', tag: 'tag-food', tl: '🍴 Festival', img: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=500&q=75', url: 'https://www.spgastronomia.com.br' },
    { t: 'Chapada dos Veadeiros: trekking sob as estrelas', d: 'O Cerrado goiano oferece trilhas noturnas guiadas com visão privilegiada da Via Láctea.', tag: 'tag-eco', tl: '⛺ Aventura', img: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=500&q=75', url: 'https://www.goias.go.gov.br/turismo' }
];

const POPULAR_DESTS = [
    { name: 'Rio de Janeiro', img: 'https://images.unsplash.com/photo-1483729558449-99ef09a8c325?w=300&q=70', lat: -22.91, lng: -43.19 },
    { name: 'Florianópolis', img: 'https://images.unsplash.com/photo-1519451241324-20b4ea2c4220?w=300&q=70', lat: -27.59, lng: -48.54 },
    { name: 'Salvador', img: 'https://images.unsplash.com/photo-1605647540924-852290f6b0d5?w=300&q=70', lat: -12.97, lng: -38.50 },
    { name: 'Manaus', img: 'https://images.unsplash.com/photo-1433086966358-54859d0ed716?w=300&q=70', lat: -3.12, lng: -60.02 },
    { name: 'Lençóis MA', img: 'https://images.unsplash.com/photo-1627845348873-10e9f1a7b056?w=300&q=70', lat: -2.55, lng: -43.12 },
    { name: 'Bonito MS', img: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=300&q=70', lat: -21.12, lng: -56.48 }
];

/* ── Render States ────────────────────────────────────────── */
function renderStates() {
    const el = document.getElementById('states-scroll');
    if (!el || !window.BRAZIL_STATES) return;

    el.innerHTML = BRAZIL_STATES.map(s => `
        <div class="state-pill" onclick="focusState('${s.sigla}')">
            <img class="state-pill-img" src="${s.img}" alt="${s.name}" loading="lazy">
            <span class="state-pill-name">${s.name}</span>
            <span class="state-pill-sigla">${s.sigla}</span>
        </div>
    `).join('');
}

function focusState(sigla) {
    const s = BRAZIL_STATES.find(state => state.sigla === sigla);
    if (!s) return;

    // 1. Go to Map Screen
    goScreen('map');

    // 2. Fly to position
    if (map) {
        map.flyTo([s.lat, s.lng], 7, { duration: 1.5 });
    }

    // 3. Trigger Maya
    if (typeof openMayaChat === 'function') {
        openMayaChat();
        
        // Use MayaVoice to speak if available
        if (typeof handleMayaAIResponse === 'function') {
            const prompt = `Fale sobre o estado do ${s.name}. Cite ${s.pois}.`;
            // Mock a response for immediate feedback
            handleMayaAIResponse({
                fala: `Com certeza! O estado do ${s.name} é maravilhoso. Você não pode deixar de conhecer o ${s.pois}. Já estou focando o mapa para você!`,
                acao: "focar_estado",
                destino: s.name
            });
        }
    }
}

/* ══════════════════════════════════════════════════════════════
   INIT
══════════════════════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
    spawnParticles();
    initGreeting();
    // renderDestinations();
    // loadNews();
    // setInterval(loadNews, 30 * 60 * 1000); // 30-min refresh
    renderDestinations();

    initSearch();
    initChips();
    initBottomNav();
    initMapScreen();
    initMayaFab();
    initMayaChat();
    initAuth();
    initReservation();
    initDriveModal();
    initPOIPanel();
    initAppWeatherClock(); // Weather + Clock
    initRoteiros(); // Roteiros platform
    renderStates(); // Render the 27 states
});

/* ── App Weather + Clock ──────────────────────────────────── */
function initAppWeatherClock() {
    // ── Live Brasília Clock ──
    const clockEl = document.getElementById('app-clock');
    if (clockEl) {
        const tick = () => {
            const now = new Date();
            const bsb = new Date(now.toLocaleString('en-US', { timeZone: 'America/Sao_Paulo' }));
            const h = bsb.getHours().toString().padStart(2, '0');
            const m = bsb.getMinutes().toString().padStart(2, '0');
            const s = bsb.getSeconds().toString().padStart(2, '0');
            clockEl.textContent = `${h}:${m}:${s}`;
        };
        tick();
        setInterval(tick, 1000);
    }

    // ── Weather via IP geolocation + Open-Meteo ──
    const WMO = {
        0: ['☀️','Céu claro'], 1: ['🌤️','Maiorm. claro'], 2: ['⛅','Parcialm. nublado'],
        3: ['☁️','Nublado'], 45: ['🌫️','Neblina'], 48: ['🌫️','Neblina'],
        51: ['🌧️','Chuvisco'], 61: ['🌧️','Chuva'], 80: ['🌦️','Aguaceiro'],
        95: ['⛈️','Temporal'], 99: ['⛈️','Temporal com granizo']
    };

    const updateWeatherUI = (icon, temp, city) => {
        const iconEl = document.getElementById('app-weather-icon');
        const tempEl = document.getElementById('app-weather-temp');
        const cityEl = document.getElementById('app-weather-city');
        if (iconEl) iconEl.textContent = icon;
        if (tempEl) tempEl.textContent = `${Math.round(temp)}°C`;
        if (cityEl) cityEl.textContent = city;
    };

    // Try IP geolocation first
    fetch('https://ip-api.com/json/?fields=lat,lon,city')
        .then(r => r.json())
        .then(geo => {
            const lat = geo.lat, lon = geo.lon, city = geo.city || 'Brasil';
            return fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&hourly=apparent_temperature&timezone=auto`)
                .then(r => r.json())
                .then(data => {
                    const cw = data.current_weather;
                    const wmo = WMO[cw.weathercode] || ['🌡️', ''];
                    updateWeatherUI(wmo[0], cw.temperature, city);
                    // Also update user location for the map
                    userLatLng = [lat, lon];
                });
        })
        .catch(() => {
            // Fallback to Brasília
            fetch('https://api.open-meteo.com/v1/forecast?latitude=-15.78&longitude=-47.93&current_weather=true&timezone=America/Sao_Paulo')
                .then(r => r.json())
                .then(data => {
                    const cw = data.current_weather;
                    const wmo = WMO[cw.weathercode] || ['🌡️', ''];
                    updateWeatherUI(wmo[0], cw.temperature, 'Brasília');
                })
                .catch(() => updateWeatherUI('🌡️', '--', 'Brasília'));
        });
}

/* ══════════════════════════════════════════════════════════════
   ROTEIROS PLATFORM
══════════════════════════════════════════════════════════════ */
const ROTEIROS_DB = [
    {
        id: 1, cat: 'praia',
        title: '3 Dias Incríveis em Arraial do Cabo',
        subtitle: 'Rio de Janeiro • Praias Paradisíacas',
        img: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=500&q=70',
        duration: '3 dias', style: '🏖️ Praia', price: 47, oldPrice: 97,
        tags: ['praia', 'barco', 'trilha'],
        highlight: '⭐ Mais Vendido',
    },
    {
        id: 2, cat: 'natureza',
        title: '5 Dias de Ecoturismo no Pantanal',
        subtitle: 'Mato Grosso do Sul • Natureza Selvagem',
        img: 'https://images.unsplash.com/photo-1553361371-9b22f78e8b1d?w=500&q=70',
        duration: '5 dias', style: '🌿 Natureza', price: 67, oldPrice: 127,
        tags: ['pantanal', 'animais', 'natureza'],
        highlight: '🔥 Em Alta',
    },
    {
        id: 3, cat: 'aventura',
        title: '4 Dias na Chapada dos Veadeiros',
        subtitle: 'Goiás • Cachoeiras e Trilhas',
        img: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=500&q=70',
        duration: '4 dias', style: '🧗 Aventura', price: 57, oldPrice: 107,
        tags: ['trilha', 'cachoeira', 'aventura'],
        highlight: '🆕 Novo',
    },
    {
        id: 4, cat: 'cultural',
        title: '3 Dias em Salvador — Pelourinho',
        subtitle: 'Bahia • Cultura, Axé e Gastronomia',
        img: 'https://images.unsplash.com/photo-1605647540924-852290f6b0d5?w=500&q=70',
        duration: '3 dias', style: '🏛️ Cultural', price: 47, oldPrice: 87,
        tags: ['cultura', 'bahia', 'gastronomia'],
        highlight: '💛 Favorito',
    },
    {
        id: 5, cat: 'gastronomia',
        title: '2 Dias de Gastronomia em SP',
        subtitle: 'São Paulo • Restaurantes, Mercados e Cervejas',
        img: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=500&q=70',
        duration: '2 dias', style: '🍽️ Gastronomia', price: 37, oldPrice: 67,
        tags: ['gastronomia', 'sp', 'urbano'],
        highlight: null,
    },
    {
        id: 6, cat: 'praia',
        title: '7 Dias em Jericoacoara',
        subtitle: 'Ceará • Dunas, Lagoas e Pôr do Sol',
        img: 'https://images.unsplash.com/photo-1627845348873-10e9f1a7b056?w=500&q=70',
        duration: '7 dias', style: '🏖️ Praia', price: 97, oldPrice: 187,
        tags: ['praia', 'ceara', 'dunas'],
        highlight: '🌟 Premium',
    },
];

let currentRoteiroCat = 'all';

function initRoteiros() {
    // Wire up bnav-roteiros
    document.getElementById('bnav-roteiros')?.addEventListener('click', () => {
        document.querySelectorAll('.bnav-item').forEach(b => b.classList.remove('active'));
        document.getElementById('bnav-roteiros')?.classList.add('active');
        goScreen('roteiros');
    });

    renderRoteiros('all');

    // Search
    document.getElementById('roteiro-search')?.addEventListener('input', (e) => {
        const q = e.target.value.toLowerCase();
        const filtered = q.length < 2
            ? ROTEIROS_DB.filter(r => currentRoteiroCat === 'all' || r.cat === currentRoteiroCat)
            : ROTEIROS_DB.filter(r => r.title.toLowerCase().includes(q) || r.subtitle.toLowerCase().includes(q) || r.tags.some(t => t.includes(q)));
        renderRoteiroDom(filtered);
    });
}

function renderRoteiros(cat) {
    currentRoteiroCat = cat;
    const filtered = cat === 'all' ? ROTEIROS_DB : ROTEIROS_DB.filter(r => r.cat === cat);
    renderRoteiroDom(filtered);
    const countEl = document.getElementById('roteiro-count');
    if (countEl) countEl.textContent = `${filtered.length} roteiro${filtered.length !== 1 ? 's' : ''}`;
}

function renderRoteiroDom(list) {
    const grid = document.getElementById('roteiros-grid');
    if (!grid) return;
    grid.innerHTML = list.map(r => `
        <div class="roteiro-card" onclick="openRoteiroDetail(${r.id})">
            <img class="roteiro-card-img" src="${r.img}" alt="${r.title}" loading="lazy"
                 onerror="this.src='https://images.unsplash.com/photo-1483729558449-99ef09a8c325?w=500&q=60'" />
            <div class="roteiro-card-body">
                <div class="roteiro-card-tags">
                    ${r.highlight ? `<span class="roteiro-tag orange">${r.highlight}</span>` : ''}
                    <span class="roteiro-tag green">${r.style}</span>
                    <span class="roteiro-tag">📅 ${r.duration}</span>
                </div>
                <div class="roteiro-card-title">${r.title}</div>
                <div class="roteiro-card-meta">
                    <span>📍 ${r.subtitle}</span>
                </div>
                <div class="roteiro-card-footer">
                    <div class="roteiro-price">
                        <small>eBook digital</small>
                        R$ ${r.price}
                    </div>
                    <button class="roteiro-btn" onclick="event.stopPropagation();buyRoteiro(${r.id})">Comprar →</button>
                </div>
            </div>
        </div>
    `).join('');
}

function filterRoteiros(btn, cat) {
    document.querySelectorAll('.rot-chip').forEach(c => c.classList.remove('active'));
    btn.classList.add('active');
    renderRoteiros(cat);
}
window.filterRoteiros = filterRoteiros;

function openRoteiroDetail(id) {
    if (id === 1) {
        openEbookModal();
    } else {
        const r = ROTEIROS_DB.find(x => x.id === id);
        if (!r) return;
        const waMsg = encodeURIComponent(`Olá! Tenho interesse no eBook: "${r.title}". Quero saber mais e como comprar!`);
        window.open(`https://wa.me/5538991621135?text=${waMsg}`, '_blank');
    }
}
window.openRoteiroDetail = openRoteiroDetail;

function buyRoteiro(id) {
    const r = ROTEIROS_DB.find(x => x.id === id);
    if (!r) return;
    const waMsg = encodeURIComponent(`Olá! Quero comprar o eBook: "${r.title}" por R$${r.price}. Como fazer o pagamento?`);
    window.open(`https://wa.me/5538991621135?text=${waMsg}`, '_blank');
}
window.buyRoteiro = buyRoteiro;

function openEbookModal() {
    document.getElementById('modal-ebook')?.classList.remove('hidden');
}
window.openEbookModal = openEbookModal;

function buyEbook() {
    const waMsg = encodeURIComponent('Olá! Quero comprar o eBook "3 Dias Incríveis no Litoral Brasileiro - Arraial do Cabo" por R$47. Como pagar?');
    window.open(`https://wa.me/5538991621135?text=${waMsg}`, '_blank');
}
window.buyEbook = buyEbook;

function togglePref(btn) {
    btn.classList.toggle('selected');
}
window.togglePref = togglePref;

function submitTripForm(e) {
    e.preventDefault();
    const destino = document.getElementById('tf-destino')?.value || '';
    const estilo = document.getElementById('tf-estilo')?.value || '';
    const duracao = document.getElementById('tf-duracao')?.value || '';
    const orcamento = document.getElementById('tf-orcamento')?.value || '';
    const wpp = document.getElementById('tf-whatsapp')?.value || '';
    const prefs = Array.from(document.querySelectorAll('.pref-tag.selected')).map(b => b.textContent.trim()).join(', ');

    const msg = encodeURIComponent(
        `🗺️ *Solicitação de Roteiro Personalizado — Descubra o Brasil*\n\n` +
        `📍 Destinos: ${destino}\n` +
        `🎒 Estilo: ${estilo}\n` +
        `📅 Duração: ${duracao}\n` +
        `💰 Orçamento: ${orcamento}\n` +
        `⭐ Preferências: ${prefs || 'Nenhuma específica'}\n` +
        `📱 WhatsApp do cliente: ${wpp}`
    );
    window.open(`https://wa.me/5538991621135?text=${msg}`, '_blank');
    document.getElementById('trip-form')?.reset();
    document.querySelectorAll('.pref-tag.selected').forEach(b => b.classList.remove('selected'));
}
window.submitTripForm = submitTripForm;

/* ── App Weather + Clock ──────────────────────────────────── */
function initAppWeatherClock() {
    // ── Live Brasília Clock ──
    const clockEl = document.getElementById('app-clock');
    if (clockEl) {
        const tick = () => {
            const now = new Date();
            const bsb = new Date(now.toLocaleString('en-US', { timeZone: 'America/Sao_Paulo' }));
            const h = bsb.getHours().toString().padStart(2, '0');
            const m = bsb.getMinutes().toString().padStart(2, '0');
            const s = bsb.getSeconds().toString().padStart(2, '0');
            clockEl.textContent = `${h}:${m}:${s}`;
        };
        tick();
        setInterval(tick, 1000);
    }

    // ── Weather via IP geolocation + Open-Meteo ──
    const WMO = {
        0: ['☀️','Céu claro'], 1: ['🌤️','Maiorm. claro'], 2: ['⛅','Parcialm. nublado'],
        3: ['☁️','Nublado'], 45: ['🌫️','Neblina'], 48: ['🌫️','Neblina'],
        51: ['🌧️','Chuvisco'], 61: ['🌧️','Chuva'], 80: ['🌦️','Aguaceiro'],
        95: ['⛈️','Temporal'], 99: ['⛈️','Temporal com granizo']
    };

    const updateWeatherUI = (icon, temp, city) => {
        const iconEl = document.getElementById('app-weather-icon');
        const tempEl = document.getElementById('app-weather-temp');
        const cityEl = document.getElementById('app-weather-city');
        if (iconEl) iconEl.textContent = icon;
        if (tempEl) tempEl.textContent = `${Math.round(temp)}°C`;
        if (cityEl) cityEl.textContent = city;
    };

    // Try IP geolocation first
    fetch('https://ip-api.com/json/?fields=lat,lon,city')
        .then(r => r.json())
        .then(geo => {
            const lat = geo.lat, lon = geo.lon, city = geo.city || 'Brasil';
            return fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&hourly=apparent_temperature&timezone=auto`)
                .then(r => r.json())
                .then(data => {
                    const cw = data.current_weather;
                    const wmo = WMO[cw.weathercode] || ['🌡️', ''];
                    updateWeatherUI(wmo[0], cw.temperature, city);
                    // Also update user location for the map
                    userLatLng = [lat, lon];
                });
        })
        .catch(() => {
            // Fallback to Brasília
            fetch('https://api.open-meteo.com/v1/forecast?latitude=-15.78&longitude=-47.93&current_weather=true&timezone=America/Sao_Paulo')
                .then(r => r.json())
                .then(data => {
                    const cw = data.current_weather;
                    const wmo = WMO[cw.weathercode] || ['🌡️', ''];
                    updateWeatherUI(wmo[0], cw.temperature, 'Brasília');
                })
                .catch(() => updateWeatherUI('🌡️', '--', 'Brasília'));
        });
}

/* ── Particles ─────────────────────────────────────────────── */
function spawnParticles() {
    const el = document.getElementById('hero-particles');
    if (!el) return;
    for (let i = 0; i < 14; i++) {
        const p = document.createElement('div');
        p.className = 'particle';
        const size = 6 + Math.random() * 20;
        p.style.cssText = `
            width:${size}px; height:${size}px;
            left:${Math.random() * 100}%;
            bottom:${-size}px;
            animation-duration:${6 + Math.random() * 10}s;
            animation-delay:${Math.random() * 8}s;
        `;
        el.appendChild(p);
    }
}

/* ── Greeting ──────────────────────────────────────────────── */
function initGreeting() {
    const el = document.getElementById('greeting-text');
    if (!el) return;
    const h = new Date().getHours();
    const greet = h < 12 ? 'Bom dia! Onde vamos hoje?' : h < 19 ? 'Boa tarde! Para onde vamos?' : 'Boa noite! Que tal explorar o Brasil?';
    el.textContent = greet;
}

/* ── Destination Strip ─────────────────────────────────────── */
function renderDestinations() {
    const el = document.getElementById('dest-scroll');
    if (!el) return;
    el.innerHTML = POPULAR_DESTS.map(d => `
        <div class="dest-card" onclick="goToMapDest(${d.lat}, ${d.lng}, '${d.name}')">
            <img src="${d.img}" alt="${d.name}" loading="lazy">
            <div class="dest-card-label">${d.name}</div>
        </div>
    `).join('');
    document.getElementById('see-all-destinations')?.addEventListener('click', () => goScreen('map'));
}

/* ── NEWS ──────────────────────────────────────────────────── */
const NEWS_CACHE_KEY = 'db_news_cache';
const NEWS_CACHE_TTL = 30 * 60 * 1000;

function loadNews() {
    const cached = localStorage.getItem(NEWS_CACHE_KEY);
    if (cached) {
        try {
            const { data, ts } = JSON.parse(cached);
            if (Date.now() - ts < NEWS_CACHE_TTL) {
                renderNews(data);
                return;
            }
        } catch (e) { }
    }
    // Simulate fresh fetch (shuffle)
    const fresh = [...NEWS_DB].sort(() => .5 - Math.random()).slice(0, 6);
    localStorage.setItem(NEWS_CACHE_KEY, JSON.stringify({ data: fresh, ts: Date.now() }));
    renderNews(fresh);
}

function renderNews(items) {
    const grid = document.getElementById('news-grid');
    const ts = document.getElementById('news-timestamp');
    if (!grid) return;

    grid.style.opacity = '0';
    setTimeout(() => {
        grid.innerHTML = items.map(n => `
            <article class="news-card">
                <img class="news-card-img" src="${n.img}" alt="" loading="lazy"
                     onerror="this.src='https://images.unsplash.com/photo-1483729558449-99ef09a8c325?w=500&q=60'">
                <div class="news-card-body">
                    <span class="news-tag ${n.tag}">${n.tl}</span>
                    <h3>${n.t}</h3>
                    <p>${n.d}</p>
                    <a class="news-link" href="${n.url}" target="_blank" rel="noopener noreferrer">
                        Saber mais →
                    </a>
                </div>
            </article>
        `).join('');
        grid.style.transition = 'opacity .4s';
        grid.style.opacity = '1';
    }, 250);

    if (ts) {
        const now = new Date();
        ts.textContent = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    }
}

/* ══════════════════════════════════════════════════════════════
   SCREEN SYSTEM
══════════════════════════════════════════════════════════════ */
function goScreen(name) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    const el = document.getElementById(`screen-${name}`);
    if (el) el.classList.add('active');

    // Map must invalidate size
    if (name === 'map' && map) setTimeout(() => map.invalidateSize(), 200);
    if (name === 'hotels') renderHotelsGrid();
}

function goHome() { goScreen('home'); }
window.goHome = goHome;

/* ── Bottom Nav ────────────────────────────────────────────── */
function initBottomNav() {
    const items = {
        'bnav-home': 'home',
        'bnav-map': 'map',
        'bnav-hotels': 'hotels',
        'bnav-account': null
    };
    Object.entries(items).forEach(([id, screen]) => {
        const btn = document.getElementById(id);
        if (!btn) return;
        btn.addEventListener('click', () => {
            document.querySelectorAll('.bnav-item').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            if (screen) goScreen(screen);
            else openLoginOrAccount();
        });
    });
}

function openLoginOrAccount() {
    const user = getUser();
    if (user) {
        Swal.fire({
            title: `Olá, ${user.nome.split(' ')[0]}! 👋`, text: 'Sua conta está ativa.', icon: 'info',
            showDenyButton: true, confirmButtonText: 'OK', denyButtonText: 'Sair',
            confirmButtonColor: '#0057B8'
        }).then(r => { if (r.isDenied) logout(); });
    } else {
        document.getElementById('modal-login').classList.remove('hidden');
    }
}

/* ── Search ─────────────────────────────────────────────────── */
function initSearch() {
    const input = document.getElementById('search-input');
    const drop = document.getElementById('search-drop');
    const results = document.getElementById('search-results');
    const clear = document.getElementById('search-clear');

    if (!input) return;

    const buildPool = () => [
        ...allHotels.map(h => ({
            name: h.nome, cat: 'Hotel', icon: '🏨',
            go: () => goToMapDest(h.latitude, h.longitude, h.nome, h)
        })),
        ...allPOIs.map(p => ({
            name: p.nome,
            cat: (CAT[p.categoria] || CAT.turismo).label,
            icon: p.icone || (CAT[p.categoria] || CAT.turismo).icon,
            go: () => goToMapDest(p.latitude, p.longitude, p.nome, null, p)
        })),
        ...POPULAR_DESTS.map(d => ({
            name: d.name, cat: 'Cidade', icon: '📍',
            go: () => goToMapDest(d.lat, d.lng, d.name)
        }))
    ];

    input.addEventListener('input', () => {
        const q = input.value.trim();
        clear.classList.toggle('hidden', !q);
        if (q.length < 2) { drop.classList.add('hidden'); return; }

        const pool = buildPool();
        const matches = pool.filter(p => p.name.toLowerCase().includes(q.toLowerCase())).slice(0, 8);

        if (!matches.length) { drop.classList.add('hidden'); return; }

        results.innerHTML = matches.map((m, i) => `
            <div class="result-item" data-idx="${i}">
                <div class="result-icon">${m.icon}</div>
                <div>
                    <div class="result-name">${highlight(m.name, q)}</div>
                    <div class="result-cat">${m.cat}</div>
                </div>
            </div>
        `).join('');

        results.querySelectorAll('.result-item').forEach((el, i) => {
            el.addEventListener('click', () => {
                input.value = matches[i].name;
                drop.classList.add('hidden');
                matches[i].go();
            });
        });

        drop.classList.remove('hidden');
    });

    clear.addEventListener('click', () => {
        input.value = '';
        drop.classList.add('hidden');
        clear.classList.add('hidden');
        input.focus();
    });

    document.addEventListener('click', e => {
        if (!e.target.closest('#search-input') && !e.target.closest('#search-drop'))
            drop.classList.add('hidden');
    });

    input.addEventListener('keydown', e => {
        if (e.key === 'Enter' && input.value.trim()) {
            drop.classList.add('hidden');
            goScreen('map');
        }
    });
}

function highlight(text, q) {
    const idx = text.toLowerCase().indexOf(q.toLowerCase());
    if (idx === -1) return text;
    return text.substring(0, idx) +
        `<mark style="background:#DBEAFE;color:#1D4ED8;border-radius:2px">${text.substring(idx, idx + q.length)}</mark>` +
        text.substring(idx + q.length);
}

/* ── Quick Chips ────────────────────────────────────────────── */
function initChips() {
    const chips = {
        'chip-map': () => goScreen('map'),
        'chip-drive': () => {
            // Drive to nearest popular dest
            if (allPOIs.length) {
                const p = allPOIs[0];
                activeNav = { lat: p.latitude, lng: p.longitude, name: p.nome };
            } else {
                activeNav = { lat: -22.9519, lng: -43.2105, name: 'Cristo Redentor' };
            }
            openDriveModal();
        },
        'chip-hotel': () => goScreen('hotels'),
        'chip-food': () => {
            goScreen('map');
            setTimeout(() => activateFilter('restaurante'), 400);
        },
        'chip-free': () => {
            goScreen('map');
            setTimeout(() => activateFilter('turismo'), 400);
        }
    };
    Object.entries(chips).forEach(([id, fn]) => {
        document.getElementById(id)?.addEventListener('click', fn);
    });
}

/* ── Go to map destination ─────────────────────────────────── */
window.goToMapDest = function (lat, lng, name, hotel = null, poi = null) {
    goScreen('map');
    document.getElementById('map-destination-label').textContent = name;

    setTimeout(() => {
        if (map) {
            map.setView([lat, lng], 14, { animate: true });
            drawRoute([lat, lng]);

            if (hotel) {
                showSheet(hotel.nome, `${CAT.hotel.icon} Hotel • R$${hotel.preco_por_noite}/noite`, CAT.hotel.icon);
                activeNav = { lat, lng, name: hotel.nome };
                document.getElementById('sheet-btn-book').onclick = () => openReservation(hotel);
            } else if (poi) {
                showSheet(poi.nome, `${(CAT[poi.categoria] || CAT.turismo).label} • ${poi.cidade || 'Brasil'}`, poi.icone || (CAT[poi.categoria] || CAT.turismo).icon);
                activeNav = { lat, lng, name: poi.nome };
                document.getElementById('sheet-btn-book').onclick = null;
            } else {
                showSheet(name, '📍 Destino selecionado', '📍');
                activeNav = { lat, lng, name };
            }

            updateMayaMap(`Indo para ${name}! 🧭 Escolha como quer chegar!`, true);
        }
    }, 300);
};

/* ══════════════════════════════════════════════════════════════
   MAP SCREEN
══════════════════════════════════════════════════════════════ */
function initMapScreen() {
    document.getElementById('map-back')?.addEventListener('click', goHome);

    map = L.map('map-container', { zoomControl: false, attributionControl: true }).setView(userLatLng, 5);

    L.control.zoom({ position: 'topright' }).addTo(map);

    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        attribution: '© OpenStreetMap © CARTO',
        subdomains: 'abcd',
        maxZoom: 20
    }).addTo(map);

    // Sheet close
    document.getElementById('sheet-close')?.addEventListener('click', closeSheet);

    // Geolocation
    document.getElementById('btn-geolocate')?.addEventListener('click', () => {
        followUser = !followUser;
        const fab = document.getElementById('btn-geolocate');
        if (followUser) {
            fab.style.background = '#10B981';
            fab.style.color = 'white';
            doGeolocate();
            Swal.fire({ title: 'Rastreamento Ativo', text: 'O mapa seguirá sua posição em tempo real.', icon: 'success', toast: true, position: 'top', showConfirmButton: false, timer: 2000 });
        } else {
            fab.style.background = 'white';
            fab.style.color = '#1e293b';
            if (watchId) navigator.geolocation.clearWatch(watchId);
            watchId = null;
        }
    });

    // Maya body click
    document.getElementById('maya-body-click')?.addEventListener('click', () => {
        document.getElementById('maya-chat').style.display = 'flex';
        document.querySelector('.maya-chat').style.display = 'flex';
    });

    // Category filter pills
    document.querySelectorAll('.filter-pill').forEach(pill => {
        pill.addEventListener('click', () => {
            document.querySelectorAll('.filter-pill').forEach(p => p.classList.remove('active'));
            pill.classList.add('active');
            currentFilter = pill.dataset.cat;
            renderMarkers();
        });
    });

    // Start navigation button
    document.getElementById('sheet-start')?.addEventListener('click', () => {
        if (activeNav) openDriveModal();
    });

    // Drive button on sheet
    document.getElementById('sheet-btn-drive')?.addEventListener('click', () => {
        if (activeNav) openDriveModal();
    });

    // Save button
    document.getElementById('sheet-btn-save')?.addEventListener('click', () => {
        Swal.fire({ title: '⭐ Salvo!', text: 'Local salvo nos seus favoritos.', icon: 'success', timer: 1800, showConfirmButton: false });
    });

    // Load data
    loadMapData();
}

async function loadMapData() {
    try {
        const [hRes, pRes] = await Promise.all([
            axios.get(`${API}/hotels`).catch(() => ({ data: [] })),
            axios.get(`${API}/pois`).catch(() => ({ data: [] }))
        ]);
        allHotels = hRes.data || [];
        allPOIs = pRes.data || [];

        if (!allHotels.length && !allPOIs.length) {
            await axios.post(`${API}/seed`).catch(() => { });
            const [h2, p2] = await Promise.all([axios.get(`${API}/hotels`), axios.get(`${API}/pois`)]);
            allHotels = h2.data || [];
            allPOIs = p2.data || [];
        }
    } catch (e) {
        console.warn('Backend offline, using fallbacks');
    }

    if (!allHotels.length && !allPOIs.length) {
        allPOIs = [
            { nome: 'Cristo Redentor', categoria: 'turismo', icone: '🗽', latitude: -22.9519, longitude: -43.2105, descricao: 'Uma das 7 Maravilhas do Mundo Moderno.', tipo_preco: 'Gratuito', cidade: 'Rio de Janeiro' },
            { nome: 'Pelourinho', categoria: 'turismo', icone: '⛪', latitude: -12.9714, longitude: -38.5102, descricao: 'Centro histórico de Salvador.', tipo_preco: 'Gratuito', cidade: 'Salvador' },
            { nome: 'Teatro Amazonas', categoria: 'turismo', icone: '🎭', latitude: -3.1303, longitude: -60.0229, descricao: 'Ópera histórica em Manaus.', tipo_preco: 'R$ 40-120', cidade: 'Manaus' }
        ];
        allHotels = [
            { id: 1, nome: 'Hotel Copacabana Palace (Demo)', categoria: 'hotel', estrelas: 5, preco_por_noite: 1500, latitude: -22.9670, longitude: -43.1779, descricao: 'Luxo à beira-mar no Rio.', cidade: 'Rio de Janeiro' }
        ];
    }

    renderMarkers();
    updateMayaMap('🗺️ Mapa carregado! Clique em qualquer marcador para explorar!', false);
}

/* ── Markers ────────────────────────────────────────────────── */
function renderMarkers(filter = currentFilter) {
    allMarkers.forEach(m => m.remove());
    allMarkers = [];

    const combined = [];
    if (filter === 'all' || filter === 'hotel') {
        allHotels.forEach(h => combined.push({ ...h, _t: 'hotel', categoria: 'hotel' }));
    }
    const filtered = filter === 'all' ? allPOIs : allPOIs.filter(p => p.categoria === filter);
    filtered.forEach(p => combined.push({ ...p, _t: 'poi' }));

    if (!document.getElementById('_mk-style')) {
        const s = document.createElement('style');
        s.id = '_mk-style';
        s.textContent = `
            .mk { width:38px;height:38px;border-radius:50% 50% 50% 0;transform:rotate(-45deg);
                  display:flex;align-items:center;justify-content:center;
                  box-shadow:0 3px 12px rgba(0,0,0,.25);border:2px solid white;transition:.2s; }
            .mk:hover { transform:rotate(-45deg) scale(1.15); }
            .mk span { transform:rotate(45deg);font-size:15px; }
        `;
        document.head.appendChild(s);
    }

    combined.forEach(item => {
        if (!item.latitude || !item.longitude) return;
        const cfg = CAT[item.categoria] || CAT.turismo;
        const icon = L.divIcon({
            className: '',
            html: `<div class="mk" style="background:${cfg.color}"><span>${item.icone || cfg.icon}</span></div>`,
            iconSize: [38, 38], iconAnchor: [19, 38], popupAnchor: [0, -40]
        });
        const m = L.marker([item.latitude, item.longitude], { icon }).addTo(map);
        m.on('click', () => {
            if (item._t === 'hotel') handleHotelClick(item);
            else handlePOIClick(item);
        });
        allMarkers.push(m);
    });
}

function activateFilter(cat) {
    currentFilter = cat;
    document.querySelectorAll('.filter-pill').forEach(p => {
        p.classList.toggle('active', p.dataset.cat === cat);
    });
    renderMarkers(cat);
}

/* ── Hotel / POI click ─────────────────────────────────────── */
function handleHotelClick(hotel) {
    activePOI = hotel;
    activeNav = { lat: hotel.latitude, lng: hotel.longitude, name: hotel.nome };
    drawRoute([hotel.latitude, hotel.longitude]);
    const dm = calcKm(userLatLng, [hotel.latitude, hotel.longitude]);
    showSheet(hotel.nome, `${'⭐'.repeat(hotel.estrelas || 3)} • R$${hotel.preco_por_noite}/noite • ${dm.toFixed(0)} km`, '🏨');
    fillTransport(dm);
    document.getElementById('sheet-btn-book').onclick = () => openReservation(hotel);
    updateMayaMap(randTip('hotel'), true);
}

function handlePOIClick(poi) {
    activePOI = poi;
    activeNav = { lat: poi.latitude, lng: poi.longitude, name: poi.nome };
    drawRoute([poi.latitude, poi.longitude]);
    const dm = calcKm(userLatLng, [poi.latitude, poi.longitude]);
    showSheet(poi.nome, `${(CAT[poi.categoria] || CAT.turismo).label} • ${poi.cidade || 'Brasil'} • ${dm.toFixed(0)} km`, poi.icone || (CAT[poi.categoria] || CAT.turismo).icon);
    fillTransport(dm);
    document.getElementById('sheet-btn-book').onclick = null;
    updateMayaMap(randTip(poi.categoria), true);
    // Also update POI panel
    fillPOIPanel(poi);
}

/* ── POI Panel ─────────────────────────────────────────────── */
function initPOIPanel() {
    document.getElementById('poi-panel-close')?.addEventListener('click', () => {
        document.getElementById('poi-panel').classList.add('hidden');
    });
}

function fillPOIPanel(poi) {
    const panel = document.getElementById('poi-panel');
    const cfg = CAT[poi.categoria] || CAT.turismo;
    panel.querySelector('.poi-inner')?.remove(); // reset
    panel.innerHTML = `
        <div class="poi-inner">
            <button class="poi-panel-close" id="poi-panel-close">✕</button>
            <div class="poi-header">
                <span class="poi-big-icon">${poi.icone || cfg.icon}</span>
                <div>
                    <h3>${poi.nome}</h3>
                    <div class="poi-tags">
                        <span class="poi-tag">${cfg.label}</span>
                        <span class="poi-city">📍 ${poi.cidade || 'Brasil'}</span>
                    </div>
                </div>
            </div>
            <p class="poi-desc">${poi.descricao || ''}</p>
            <div class="poi-price-row">
                <span>Preço médio</span>
                <strong>${poi.tipo_preco || 'Gratuito'}</strong>
            </div>
            <div class="poi-actions">
                <button class="btn-blue btn-full" id="poi-drive-btn">🚗 Como chegar (Google Maps)</button>
                <button class="btn-outline-blue btn-full mt-8" id="poi-chat-btn">💬 Perguntar à Maya</button>
            </div>
            <div class="maya-tip-box">
                <div class="maya-tip-ava">M</div>
                <p>${randTip(poi.categoria)}</p>
            </div>
        </div>
    `;
    document.getElementById('poi-panel-close').addEventListener('click', () => panel.classList.add('hidden'));
    document.getElementById('poi-drive-btn').addEventListener('click', () => {
        activeNav = { lat: poi.latitude, lng: poi.longitude, name: poi.nome };
        openDriveModal();
    });
    document.getElementById('poi-chat-btn').addEventListener('click', () => {
        panel.classList.add('hidden');
        openMayaChat();
        document.getElementById('maya-input').value = `Me fale sobre ${poi.nome} em ${poi.cidade || 'Brasil'}`;
    });
    panel.classList.remove('hidden');
}

/* ── Sheet helpers ─────────────────────────────────────────── */
function showSheet(title, subtitle, icon) {
    document.getElementById('sheet-title').textContent = title;
    document.getElementById('sheet-subtitle').textContent = subtitle;
    document.getElementById('sheet-icon').textContent = icon;
    document.getElementById('bottom-sheet').classList.add('open');
}

function closeSheet() {
    document.getElementById('bottom-sheet').classList.remove('open');
    if (routeLine) { map.removeLayer(routeLine); routeLine = null; }
}

function fillTransport(distKm) {
    const fmt = m => m < 60 ? `${Math.round(m)} min` : `${Math.floor(m / 60)}h ${Math.round(m % 60)}m`;
    const opts = [
        { icon: '🚗', name: 'Carro Próprio', time: fmt(distKm / 60 * 60), detail: `${distKm.toFixed(0)} km`, price: `R$ ${(distKm * .5).toFixed(2)}` },
        { icon: '🚌', name: 'Ônibus', time: fmt(distKm / 50 * 60 + 30), detail: 'Econômico', price: `R$ ${(50 + distKm * .12).toFixed(2)}` }
    ];
    if (distKm > 200) opts.push({ icon: '✈️', name: 'Voo', time: fmt(distKm / 800 * 60 + 120), detail: 'Mais Rápido', price: `R$ ${(250 + distKm * .8).toFixed(2)}` });

    document.getElementById('transport-list').innerHTML = opts.map((o, i) => `
        <li class="transport-card ${i === 0 ? 'selected' : ''}" onclick="selTransport(this)">
            <span class="t-icon">${o.icon}</span>
            <div class="t-info"><h4>${o.name}</h4><p>${o.time} • ${o.detail}</p></div>
            <span class="t-price">${o.price}</span>
        </li>
    `).join('');
}
window.selTransport = el => {
    document.querySelectorAll('.transport-card').forEach(c => c.classList.remove('selected'));
    el.classList.add('selected');
};

function drawRoute(dest) {
    if (routeLine) map.removeLayer(routeLine);
    routeLine = L.polyline([userLatLng, dest], { color: '#0057B8', weight: 4, dashArray: '10,8', lineCap: 'round' }).addTo(map);
    map.fitBounds(routeLine.getBounds(), { padding: [60, 60] });
}

function calcKm(from, to) {
    return map ? map.distance(from, to) / 1000 : 100;
}

function randTip(cat) {
    const tips = MAYA_TIPS[cat] || MAYA_TIPS.turismo;
    return tips[Math.floor(Math.random() * tips.length)];
}

/* ── Geolocate ─────────────────────────────────────────────── */
function doGeolocate() {
    const btn = document.getElementById('btn-geolocate');
    if (!btn) return;
    btn.textContent = '⏳';
    navigator.geolocation?.getCurrentPosition(pos => {
        userLatLng = [pos.coords.latitude, pos.coords.longitude];
        map.setView(userLatLng, 13);
        const icon = L.divIcon({ className: '', html: `<div style="width:14px;height:14px;background:#0057B8;border:3px solid white;border-radius:50%;box-shadow:0 0 0 6px rgba(0,87,184,.2)"></div>`, iconSize: [14, 14], iconAnchor: [7, 7] });
        L.marker(userLatLng, { icon, zIndexOffset: 1000 }).addTo(map).bindPopup('Você está aqui 📍').openPopup();
        btn.textContent = '📍';
        updateMayaMap('Localização encontrada! 📍 Agora calcularei distâncias a partir daqui.', true);
    }, () => { btn.textContent = '📍'; });
}

/* ── Maya on map ───────────────────────────────────────────── */
function updateMayaMap(text, animate = false) {
    const el = document.getElementById('maya-speech');
    if (!el) return;
    if (animate) { el.style.opacity = '0'; setTimeout(() => { el.textContent = text; el.style.opacity = '1'; el.style.transition = 'opacity .3s'; }, 200); }
    else el.textContent = text;
}

/* ══════════════════════════════════════════════════════════════
   DRIVE MODAL
══════════════════════════════════════════════════════════════ */
function initDriveModal() {
    document.getElementById('modal-drive-close')?.addEventListener('click', () => {
        document.getElementById('modal-drive').classList.add('hidden');
    });
}

function openDriveModal() {
    if (!activeNav) return;
    doc('drive-dest-label').textContent = `Destino: ${activeNav.name}`;
    const lat = activeNav.lat, lng = activeNav.lng, name = encodeURIComponent(activeNav.name);

    doc('drive-google').onclick = () => {
        window.open(`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&destination_place_id=${name}`, '_blank');
    };
    doc('drive-waze').onclick = () => {
        window.open(`https://waze.com/ul?ll=${lat},${lng}&navigate=yes`, '_blank');
    };
    doc('drive-osm').onclick = () => {
        window.open(`https://www.openstreetmap.org/directions?engine=fossgis_osrm_car&route=;${lat},${lng}&to=${name}`, '_blank');
    };

    document.getElementById('modal-drive').classList.remove('hidden');
}

/* ══════════════════════════════════════════════════════════════
   HOTELS SCREEN
══════════════════════════════════════════════════════════════ */
function renderHotelsGrid() {
    const grid = document.getElementById('hotels-grid');
    if (!grid) return;
    if (!allHotels.length) {
        grid.innerHTML = '<p style="padding:1rem;color:#6B7280">Carregando hotéis...</p>';
        return;
    }
    grid.innerHTML = allHotels.map(h => `
        <div class="hotel-card">
            <img src="${h.imagem_url || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&q=70'}"
                 alt="${h.nome}" loading="lazy"
                 onerror="this.src='https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=400&q=70'">
            <div class="hotel-card-body">
                <h3>${h.nome}</h3>
                <div class="hotel-stars">${'⭐'.repeat(h.estrelas || 3)}</div>
                <p>${h.descricao || ''}</p>
                <div class="hotel-card-foot">
                    <span class="hotel-card-price">R$ ${(h.preco_por_noite || 0).toFixed(2)} <small>/noite</small></span>
                    <button class="btn-pill-sm" onclick="openReservation(${JSON.stringify(h).replace(/"/g, '&quot;')})">Reservar</button>
                </div>
            </div>
        </div>
    `).join('');
}
window.openReservation = openReservation;

/* ══════════════════════════════════════════════════════════════
   RESERVATION MODAL
══════════════════════════════════════════════════════════════ */
function initReservation() {
    document.getElementById('modal-res-close')?.addEventListener('click', () => {
        document.getElementById('modal-reservation').classList.add('hidden');
    });

    const cin = document.getElementById('res-checkin');
    const cout = document.getElementById('res-checkout');
    const calcTotal = () => {
        const h = window._resHotel;
        if (!cin?.value || !cout?.value || !h) return;
        const diff = Math.ceil((new Date(cout.value) - new Date(cin.value)) / 86400000);
        doc('res-total-display').textContent = diff > 0 ? `R$ ${(diff * h.preco_por_noite).toFixed(2)}` : 'Datas inválidas';
    };
    cin?.addEventListener('change', calcTotal);
    cout?.addEventListener('change', calcTotal);

    document.getElementById('reservation-form')?.addEventListener('submit', e => {
        e.preventDefault();
        const h = window._resHotel;
        const total = doc('res-total-display').textContent;
        document.getElementById('modal-reservation').classList.add('hidden');
        Swal.fire({ title: '🎉 Reserva Confirmada!', html: `<b>${h?.nome}</b><br>Total: ${total}<br><br>Voucher enviado ao seu email!`, icon: 'success', confirmButtonColor: '#0057B8' });
    });
}

function openReservation(hotel) {
    const token = localStorage.getItem('token');
    if (!token) {
        Swal.fire({ title: '🔑 Login necessário', text: 'Faça login para reservar.', icon: 'warning', confirmButtonText: 'Fazer Login', confirmButtonColor: '#0057B8' })
            .then(r => { if (r.isConfirmed) document.getElementById('modal-login').classList.remove('hidden'); });
        return;
    }
    window._resHotel = hotel;
    doc('res-hotel-name').textContent = hotel.nome;
    doc('res-price-display').textContent = `R$ ${hotel.preco_por_noite.toFixed(2)}/noite`;
    doc('res-total-display').textContent = 'R$ 0,00';
    document.getElementById('res-checkin').value = '';
    document.getElementById('res-checkout').value = '';
    document.getElementById('modal-reservation').classList.remove('hidden');
}

/* ══════════════════════════════════════════════════════════════
   AUTH
══════════════════════════════════════════════════════════════ */
function initAuth() {
    updateAuthUI(getUser());

    // Open / close
    doc('btn-login-open')?.addEventListener('click', () => doc('modal-login').classList.remove('hidden'));
    doc('btn-register-open')?.addEventListener('click', () => doc('modal-register').classList.remove('hidden'));
    doc('modal-login-close')?.addEventListener('click', () => doc('modal-login').classList.add('hidden'));
    doc('modal-register-close')?.addEventListener('click', () => doc('modal-register').classList.add('hidden'));

    // Switch
    doc('switch-to-register')?.addEventListener('click', e => {
        e.preventDefault();
        doc('modal-login').classList.add('hidden');
        doc('modal-register').classList.remove('hidden');
    });
    doc('switch-to-login')?.addEventListener('click', e => {
        e.preventDefault();
        doc('modal-register').classList.add('hidden');
        doc('modal-login').classList.remove('hidden');
    });

    // Close on backdrop
    document.querySelectorAll('.modal-bg').forEach(bg => bg.addEventListener('click', e => {
        if (e.target === bg) bg.classList.add('hidden');
    }));

    // Login form
    doc('login-form')?.addEventListener('submit', async e => {
        e.preventDefault();
        try {
            const res = await axios.post(`${API}/auth/login`, { email: doc('login-email').value, senha: doc('login-password').value });
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('user', JSON.stringify(res.data.user));
            doc('modal-login').classList.add('hidden');
            updateAuthUI(res.data.user);
            Swal.fire('Bem-vindo! 🎉', `Olá, ${res.data.user.nome.split(' ')[0]}!`, 'success');
        } catch (err) {
            Swal.fire('Erro', err.response?.data?.error || 'Falha no login.', 'error');
        }
    });

    // Register form
    doc('register-form')?.addEventListener('submit', async e => {
        e.preventDefault();
        try {
            await axios.post(`${API}/auth/register`, { nome: doc('reg-name').value, email: doc('reg-email').value, senha: doc('reg-password').value });
            doc('modal-register').classList.add('hidden');
            doc('modal-login').classList.remove('hidden');
            Swal.fire('Sucesso!', 'Conta criada! Faça login.', 'success');
        } catch (err) {
            Swal.fire('Erro', err.response?.data?.error || 'Falha no cadastro.', 'error');
        }
    });
}

function updateAuthUI(user) {
    const area = doc('top-auth-area');
    if (!area) return;
    if (user) {
        area.innerHTML = `<span style="font-size:.82rem;font-weight:600">Olá, ${user.nome.split(' ')[0]}! 👋</span>
        <button class="btn-ghost" onclick="logout()">Sair</button>`;
    } else {
        area.innerHTML = `<button class="btn-ghost" id="btn-login-open">Entrar</button>
        <button class="btn-pill-sm" id="btn-register-open">Cadastrar</button>`;
        setTimeout(() => {
            doc('btn-login-open')?.addEventListener('click', () => doc('modal-login').classList.remove('hidden'));
            doc('btn-register-open')?.addEventListener('click', () => doc('modal-register').classList.remove('hidden'));
            initGoogleAuth();
        }, 50);
    }
}

function initGoogleAuth() {
    // Requires physical script to be loaded in index.html, we check if google obj is ready
    if (typeof google === 'undefined' || !google.accounts) return;

    // Check if running as Chrome Extension
    const isExtension = typeof chrome !== 'undefined' && chrome.identity;

    if (isExtension) {
        // Setup Native Extension Login Buttons
        const loginBtn = doc('google-login-btn');
        if (loginBtn) {
            loginBtn.innerHTML = '<div class="btn-outline-blue" style="width:100%;text-align:center;padding:12px;cursor:pointer;font-weight:700">Login com Google (Extensão)</div>';
            loginBtn.addEventListener('click', triggerChromeIdentityAuth);
        }

        const regBtn = doc('google-register-btn');
        if (regBtn) {
            regBtn.innerHTML = '<div class="btn-outline-blue" style="width:100%;text-align:center;padding:12px;cursor:pointer;font-weight:700">Registrar com Google (Extensão)</div>';
            regBtn.addEventListener('click', triggerChromeIdentityAuth);
        }
    } else {
        // Setup standard Google Identity Services (Web)
        google.accounts.id.initialize({
            client_id: 'dummy-client-id-for-testing', // Replace with real Client ID in production
            callback: handleGoogleResponse
        });

        const opts = { theme: 'outline', size: 'large', width: 280, locale: 'pt-BR' };

        const loginBtn = doc('google-login-btn');
        if (loginBtn) google.accounts.id.renderButton(loginBtn, opts);

        const regBtn = doc('google-register-btn');
        if (regBtn) google.accounts.id.renderButton(regBtn, opts);
    }
}

function triggerChromeIdentityAuth() {
    chrome.identity.getAuthToken({ interactive: true }, async function (token) {
        if (chrome.runtime.lastError || !token) {
            console.error('Chrome Auth Error:', chrome.runtime.lastError);
            Swal.fire('Erro', 'O Login com o Google foi cancelado ou falhou na configuração da Extensão.', 'error');
            return;
        }

        try {
            // Obter informações do perfil com o token
            const userInfoRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
                headers: { Authorization: `Bearer ${token}` }
            });
            const userInfo = await userInfoRes.json();

            // Mapear paron o nosso backend
            const res = await axios.post(`${API}/auth/google`, {
                chromeInfo: {
                    email: userInfo.email,
                    name: userInfo.name,
                    picture: userInfo.picture,
                    sub: userInfo.sub
                }
            });

            localStorage.setItem('token', res.data.token);
            localStorage.setItem('user', JSON.stringify(res.data.user));

            doc('modal-login').classList.add('hidden');
            doc('modal-register').classList.add('hidden');

            updateAuthUI(res.data.user);
            Swal.fire('Bem-vindo! 🎉', `Olá, ${res.data.user.nome.split(' ')[0]}!`, 'success');

        } catch (err) {
            Swal.fire('Erro', err.response?.data?.error || 'Falha na ponte com o Backend usando Chrome Identity.', 'error');
        }
    });
}

async function handleGoogleResponse(response) {
    try {
        const res = await axios.post(`${API}/auth/google`, { credential: response.credential });
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('user', JSON.stringify(res.data.user));

        doc('modal-login').classList.add('hidden');
        doc('modal-register').classList.add('hidden');

        updateAuthUI(res.data.user);
        Swal.fire('Bem-vindo! 🎉', `Olá, ${res.data.user.nome.split(' ')[0]}!`, 'success');
    } catch (err) {
        Swal.fire('Erro', err.response?.data?.error || 'Falha no login com Google.', 'error');
    }
}

function getUser() { try { return JSON.parse(localStorage.getItem('user') || 'null'); } catch { return null; } }

function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    updateAuthUI(null);
    Swal.fire('Até logo! 👋', '', 'info');
}
window.logout = logout;

/* ══════════════════════════════════════════════════════════════
   MAYA AI CHAT ENGINE — Powered by Groq (Llama 3.3 70B)
   100% LLM Driven — Same brain as the main site
══════════════════════════════════════════════════════════════ */
const MAYA_WA = 'https://wa.me/5538991621135?text=';

const MAYA_APP_SYSTEM_PROMPT = `Você é a **Maya**, a inteligência artificial especialista e vendedora oficial de pacotes de viagem do portal "Descubra o Brasil".

## 🎯 OBJETIVO PRINCIPAL:
Sua missão é encantar o cliente com dicas de destinos no Brasil e convertê-lo! Durante a conversa, faça perguntas orgânicas e contextuais (não pareça um robô) para descobrir: SEU NOME, PARA ONDE DESEJA IR, QUANDO, COM QUEM, e SEU ESTILO E ORÇAMENTO.
Assim que o cliente demonstrar intenção real de viagem, incentive-o fortemente a falar com um especialista via WhatsApp!

## 🗺️ FUNCIONALIDADES DO APP:
Você está dentro do aplicativo mobile do Descubra o Brasil. O app possui:
- **Mapa Interativo** com hotéis, restaurantes, bares e pontos turísticos gratuitos
- **Roteiros & eBooks** com pacotes de viagem completos
- **Hotéis** com sistema de reserva integrado
- **Notícias de Turismo** atualizadas em tempo real
- **Busca por Estados** (todos os 27 estados do Brasil)
Incentive o usuário a explorar essas funcionalidades!

## 🧠 REGRAS:
1. Seja acolhedora, vibrante (use emojis 🌟🎒) mas profissional.
2. Use **negrito** e bullet points para organizar informações.
3. Fale APENAS sobre turismo, Brasil, viagens e funcionalidades do app.
4. Respostas curtas e dinâmicas (máximo 150 palavras por turno).
5. Sempre devolva com uma pergunta leve para manter a conversa.`;

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const GROQ_MODEL = 'llama-3.3-70b-versatile';

let mayaChatHistory = [];

function getGroqApiKey() {
    // In the app context, we read from a global injected during build, or fallback
    // The key is injected by the Next.js build into the parent page
    // When running standalone, we check for a global or localStorage
    try {
        // Try reading from parent frame (when embedded as iframe in site)
        if (window.parent && window.parent !== window) {
            const parentKey = window.parent.__GROQ_KEY__;
            if (parentKey) return parentKey;
        }
    } catch(e) { /* cross-origin, ignore */ }

    // Check localStorage for manually set key
    const stored = localStorage.getItem('groq_api_key');
    if (stored && stored.startsWith('gsk_')) return stored;

    // Hardcoded fallback (injected during GitHub Actions build via env)
    const buildKey = typeof __GROQ_API_KEY__ !== 'undefined' ? __GROQ_API_KEY__ : null;
    if (buildKey && buildKey.startsWith('gsk_')) return buildKey;

    return null;
}

async function askMayaAI(userMessage) {
    const apiKey = getGroqApiKey();

    if (!apiKey) {
        return '😅 Minha conexão com a inteligência artificial está desligada neste momento. Mas você pode falar diretamente com nossos especialistas pelo WhatsApp! 💬';
    }

    try {
        const messages = [
            { role: 'system', content: MAYA_APP_SYSTEM_PROMPT },
            ...mayaChatHistory.slice(-12),
            { role: 'user', content: userMessage }
        ];

        const response = await fetch(GROQ_API_URL, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: GROQ_MODEL,
                messages,
                temperature: 0.65,
                max_tokens: 600
            })
        });

        if (!response.ok) {
            if (response.status === 429) {
                return 'Muita gente falando comigo agora! 😅 Tente de novo em alguns segundinhos, ou clique no botão de WhatsApp!';
            }
            return null;
        }

        const data = await response.json();
        let text = data.choices?.[0]?.message?.content;
        if (!text) return null;
        if (text.length > 1500) text = text.substring(0, 1500) + '...';

        // Track history
        mayaChatHistory.push({ role: 'user', content: userMessage });
        mayaChatHistory.push({ role: 'assistant', content: text });

        return text;
    } catch (err) {
        console.error('[Maya/Groq App] Erro:', err);
        return 'Desculpe, tive um probleminha de conexão. 😥 Tente novamente!';
    }
}

function initMayaFab() {
    doc('maya-fab-btn')?.addEventListener('click', openMayaChat);
}

function openMayaChat() {
    const chat = doc('maya-chat');
    if (!chat) return;
    chat.style.display = 'flex';
    if (!chat.dataset.init) {
        chat.dataset.init = '1';
        appendMayaMsg('Olá! 🌟 Eu sou a **Maya**, a inteligência artificial do Descubra o Brasil!\n\nComo posso ajudar a planejar a sua próxima viagem inesquecível pelo país? ✈️', 'ai');
    }
    // Focus input
    setTimeout(() => { doc('maya-input')?.focus(); }, 300);
}

function initMayaChat() {
    doc('maya-chat-close')?.addEventListener('click', () => { doc('maya-chat').style.display = 'none'; });

    const inp = doc('maya-input');
    const snd = doc('maya-send');

    // Re-enable the input and send (they were hidden in the old flow code)
    if (inp) {
        inp.style.display = '';
        inp.placeholder = 'Pergunte sobre destinos, roteiros...';
    }
    if (snd) snd.style.display = '';

    // Send on click
    snd?.addEventListener('click', () => sendMayaMessage());

    // Send on Enter
    inp?.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') sendMayaMessage();
    });
}

async function sendMayaMessage() {
    const inp = doc('maya-input');
    const text = inp?.value?.trim();
    if (!text) return;

    // Show user message
    appendMayaMsg(text, 'user');
    inp.value = '';
    inp.disabled = true;

    // Show thinking indicator
    const thinkEl = doc('maya-thinking-indicator');
    if (thinkEl) thinkEl.style.display = 'inline';

    // Call AI
    const response = await askMayaAI(text);

    if (thinkEl) thinkEl.style.display = 'none';
    inp.disabled = false;
    inp.focus();

    if (response) {
        appendMayaMsg(response, 'ai');
    } else {
        appendMayaMsg('Eita, minhas engrenagens travaram! 😅 Tente de novo ou fale com nossos especialistas pelo WhatsApp.', 'ai');
    }
}

function appendMayaMsg(text, role) {
    const body = doc('maya-messages');
    if (!body) return;

    // Format markdown-like syntax
    const formatted = text
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\n/g, '<br>');

    const div = document.createElement('div');
    div.className = `msg ${role}`;

    if (role === 'ai') {
        div.innerHTML = `<div class="bubble" style="border-left:3px solid #10B981;background:#f0fdf9;">
            <div style="font-size:9px;color:#059669;font-weight:700;margin-bottom:4px;display:flex;align-items:center;gap:3px;">🤖 IA da Maya</div>
            ${formatted}
        </div>`;
    } else {
        div.innerHTML = `<div class="bubble">${formatted}</div>`;
    }

    body.appendChild(div);
    body.scrollTo(0, body.scrollHeight);
    return div;
}

/* ── Utility ───────────────────────────────────────────────── */
function doc(id) { return document.getElementById(id); }


