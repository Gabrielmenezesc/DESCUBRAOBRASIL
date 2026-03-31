/**
 * Descubra o Brasil — Guia de Turismo Nacional
 * Notícias curadas sobre turismo pelos 26 estados + DF.
 * Foco: lugares gratuitos, economia para viajar, melhores épocas.
 */

const TOURISM_NEWS = [
  // ── NORTE ──
  {
    t: "Amazônia Gratuita: Trilhas Abertas e Praias de Rio em Manaus (AM)",
    d: "O Parque do Mindu e a Praia da Ponta Negra oferecem experiências incríveis sem nenhum custo. Melhor época: junho a outubro (seca).",
    tl: "🌿 Amazonas",
    tag: "tag-trend",
    img: "https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=500&q=75",
    url: "https://g1.globo.com/am/amazonas/",
    estado: "AM"
  },
  {
    t: "Belém (PA): Capital da Gastronomia com Mercado Ver-o-Peso de Graça",
    d: "Visite o maior mercado aberto da América Latina sem gastar nada. A comida de rua paraense é a mais barata do Norte.",
    tl: "🍽️ Pará",
    tag: "tag-trend",
    img: "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=500&q=75",
    url: "https://g1.globo.com/pa/para/",
    estado: "PA"
  },
  {
    t: "Palmas (TO): A Capital Mais Jovem do Brasil e Suas Praias de Água Doce",
    d: "A Praia da Graciosa é gratuita e perfeita para famílias. Melhor época: maio a setembro. Hospedagem a partir de R$80/noite.",
    tl: "🏖️ Tocantins",
    tag: "tag-free",
    img: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=500&q=75",
    url: "https://g1.globo.com/to/tocantins/",
    estado: "TO"
  },
  {
    t: "Macapá (AP): Veja o Equador Cortando a Cidade no Marco Zero — Grátis!",
    d: "O Monumento Marco Zero do Equador e a Fortaleza de São José são gratuitos. Clima quente o ano todo.",
    tl: "🌍 Amapá",
    tag: "tag-free",
    img: "https://images.unsplash.com/photo-1518509562904-e7ef99cdcc86?w=500&q=75",
    url: "https://g1.globo.com/ap/amapa/",
    estado: "AP"
  },
  {
    t: "Boa Vista (RR): Porta de Entrada para o Monte Roraima",
    d: "A capital de Roraima é base para trilhas épicas. Praça do Centro Cívico e orla do Rio Branco são passeios gratuitos.",
    tl: "⛰️ Roraima",
    tag: "tag-adventure",
    img: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=500&q=75",
    url: "https://g1.globo.com/rr/roraima/",
    estado: "RR"
  },
  {
    t: "Porto Velho (RO): Estrada de Ferro Madeira-Mamoré e História Gratuita",
    d: "O complexo histórico da ferrovia é um passeio grátis imperdível. Melhor época: maio a setembro (menos chuvas).",
    tl: "🚂 Rondônia",
    tag: "tag-free",
    img: "https://images.unsplash.com/photo-1474487548417-781cb71495f3?w=500&q=75",
    url: "https://g1.globo.com/ro/rondonia/",
    estado: "RO"
  },
  {
    t: "Rio Branco (AC): Floresta Amazônica Acessível e Cultura Indígena",
    d: "O Parque Ambiental Chico Mendes é gratuito. A cidade oferece a experiência amazônica mais econômica do Brasil.",
    tl: "🌳 Acre",
    tag: "tag-free",
    img: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=500&q=75",
    url: "https://g1.globo.com/ac/acre/",
    estado: "AC"
  },

  // ── NORDESTE ──
  {
    t: "Salvador (BA): 365 Igrejas, Pelourinho e Praia — Tudo Grátis",
    d: "O centro histórico do Pelourinho é Patrimônio da UNESCO e gratuito. Praias como Farol da Barra não cobram nada.",
    tl: "🎭 Bahia",
    tag: "tag-trend",
    img: "https://images.unsplash.com/photo-1551524164-5b2a788b4eb2?w=500&q=75",
    url: "https://g1.globo.com/ba/bahia/",
    estado: "BA"
  },
  {
    t: "Recife (PE): Capital dos Arrecifes com Praias Urbanas Gratuitas",
    d: "Boa Viagem, Marco Zero e o Instituto Ricardo Brennand (terça grátis). Melhor época: setembro a março.",
    tl: "🌊 Pernambuco",
    tag: "tag-trend",
    img: "https://images.unsplash.com/photo-1559128010-7c1ad6e1b6a5?w=500&q=75",
    url: "https://g1.globo.com/pe/pernambuco/",
    estado: "PE"
  },
  {
    t: "Fortaleza (CE): Jericoacoara e Praias com os Menores Custos do Nordeste",
    d: "Beach Park é pago, mas a Praia do Futuro é grátis e incrível. Passagens aéreas mais baratas de julho a novembro.",
    tl: "☀️ Ceará",
    tag: "tag-economy",
    img: "https://images.unsplash.com/photo-1506929562872-bb421503ef21?w=500&q=75",
    url: "https://g1.globo.com/ce/ceara/",
    estado: "CE"
  },
  {
    t: "São Luís (MA): A Única Capital Brasileira Fundada por Franceses",
    d: "Centro histórico com azulejos portugueses  — tudo gratuito. Lençóis Maranhenses a 4h de ônibus (R$50).",
    tl: "🏛️ Maranhão",
    tag: "tag-trend",
    img: "https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?w=500&q=75",
    url: "https://g1.globo.com/ma/maranhao/",
    estado: "MA"
  },
  {
    t: "Natal (RN): Maior Cajueiro do Mundo e Dunas de Genipabu",
    d: "Praia de Ponta Negra e Forte dos Reis Magos são gratuitos. Alta temporada: dezembro a março, baixa (mais barata): maio a agosto.",
    tl: "🌅 Rio G. do Norte",
    tag: "tag-economy",
    img: "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?w=500&q=75",
    url: "https://g1.globo.com/rn/rio-grande-do-norte/",
    estado: "RN"
  },
  {
    t: "João Pessoa (PB): O Ponto Mais Oriental das Américas — Sem Custo",
    d: "Ponta do Seixas, Praia de Tambaú e pôr do sol na Praia do Jacaré (grátis). Cidade mais econômica do Nordeste.",
    tl: "🌄 Paraíba",
    tag: "tag-free",
    img: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=500&q=75",
    url: "https://g1.globo.com/pb/paraiba/",
    estado: "PB"
  },
  {
    t: "Aracaju (SE): A Capital Mais Tranquila do Brasil com Praias Desertas",
    d: "Orla de Atalaia totalmente gratuita com ciclovia, parques e feiras. Hospedagem a partir de R$60 na baixa temporada.",
    tl: "😌 Sergipe",
    tag: "tag-economy",
    img: "https://images.unsplash.com/photo-1505228395891-9a51e7e86bf6?w=500&q=75",
    url: "https://g1.globo.com/se/sergipe/",
    estado: "SE"
  },
  {
    t: "Maceió (AL): Piscinas Naturais de Pajuçara — Paraíso Acessível",
    d: "As piscinas naturais custam R$30 de jangada. Praias do Francês e Gunga são gratuitas. Melhor época: outubro a março.",
    tl: "🐠 Alagoas",
    tag: "tag-trend",
    img: "https://images.unsplash.com/photo-1519046904884-53103b34b206?w=500&q=75",
    url: "https://g1.globo.com/al/alagoas/",
    estado: "AL"
  },
  {
    t: "Teresina (PI): Capital Mais Quente e Delta do Parnaíba Inesquecível",
    d: "O Delta do Parnaíba é o único delta em mar aberto das Américas. Passeio de barco a partir de R$60. Cidade muito econômica.",
    tl: "🔥 Piauí",
    tag: "tag-adventure",
    img: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=500&q=75",
    url: "https://g1.globo.com/pi/piaui/",
    estado: "PI"
  },

  // ── CENTRO-OESTE ──
  {
    t: "Brasília (DF): Arquitetura de Niemeyer, Museus e Parques — Tudo Grátis",
    d: "Congresso Nacional, Catedral, Memorial JK e Ponte JK são gratuitos. Melhor época: maio a setembro (seco).",
    tl: "🏛️ Distrito Federal",
    tag: "tag-free",
    img: "https://images.unsplash.com/photo-1553708881-112abc53fe54?w=500&q=75",
    url: "https://g1.globo.com/df/distrito-federal/",
    estado: "DF"
  },
  {
    t: "Goiânia (GO): Cidade das Flores e Chapada dos Veadeiros Próxima",
    d: "Parque Vaca Brava e Bosque dos Buritis são grátis. Chapada dos Veadeiros (3h) com trilhas gratuitas no parque nacional.",
    tl: "🌻 Goiás",
    tag: "tag-trend",
    img: "https://images.unsplash.com/photo-1433086966358-54859d0ed716?w=500&q=75",
    url: "https://g1.globo.com/go/goias/",
    estado: "GO"
  },
  {
    t: "Campo Grande (MS): Portal de Bonito — O Ecoturismo Mais Famoso do Mundo",
    d: "Bonito fica a 4h. Flutuação a partir de R$150. Parque das Nações Indígenas em Campo Grande é gratuito.",
    tl: "💎 Mato G. do Sul",
    tag: "tag-trend",
    img: "https://images.unsplash.com/photo-1541355422896-bc98b7e2311b?w=500&q=75",
    url: "https://g1.globo.com/ms/mato-grosso-do-sul/",
    estado: "MS"
  },
  {
    t: "Cuiabá (MT): Porta do Pantanal e Chapada dos Guimarães",
    d: "A Chapada dos Guimarães tem mirantes gratuitos espetaculares. Pantanal: safári fotográfico a partir de R$200.",
    tl: "🐊 Mato Grosso",
    tag: "tag-adventure",
    img: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=500&q=75",
    url: "https://g1.globo.com/mt/mato-grosso/",
    estado: "MT"
  },

  // ── SUDESTE ──
  {
    t: "Rio de Janeiro (RJ): Cristo, Pão de Açúcar e Praias Inesquecíveis",
    d: "Copacabana, Ipanema e Arpoador são grátis. Trilha do Morro da Urca é gratuita. Melhor época: maio a outubro.",
    tl: "🏖️ Rio de Janeiro",
    tag: "tag-trend",
    img: "https://images.unsplash.com/photo-1483729558449-99ef09a8c325?w=500&q=75",
    url: "https://g1.globo.com/rj/rio-de-janeiro/",
    estado: "RJ"
  },
  {
    t: "São Paulo (SP): Museus Gratuitos, Parques e a Melhor Gastronomia do País",
    d: "Pinacoteca (sábado grátis), MASP (terça grátis), Parque Ibirapuera (grátis). Dica: viaje de ônibus interestadual para economizar.",
    tl: "🎨 São Paulo",
    tag: "tag-free",
    img: "https://images.unsplash.com/photo-1543059080-f9b1272213d5?w=500&q=75",
    url: "https://g1.globo.com/sp/sao-paulo/",
    estado: "SP"
  },
  {
    t: "Belo Horizonte (MG): Pampulha, Gastronomia Mineira e Serra do Cipó",
    d: "Circuito cultural da Pampulha e Praça da Liberdade são grátis. Comida mineira: prato feito completo por R$18.",
    tl: "🧀 Minas Gerais",
    tag: "tag-economy",
    img: "https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?w=500&q=75",
    url: "https://g1.globo.com/mg/minas-gerais/",
    estado: "MG"
  },
  {
    t: "Vitória (ES): Convento da Penha e Praias Tranquilas sem Multidão",
    d: "Convento da Penha (grátis) com vista panorâmica. Praia de Camburi, Ilha do Frade e Terceira Ponte — tudo acessível.",
    tl: "⛪ Espírito Santo",
    tag: "tag-free",
    img: "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?w=500&q=75",
    url: "https://g1.globo.com/es/espirito-santo/",
    estado: "ES"
  },

  // ── SUL ──
  {
    t: "Curitiba (PR): A Capital Mais Sustentável do Brasil — Jardim Botânico Grátis",
    d: "Jardim Botânico, Ópera de Arame e parques urbanos são gratuitos. Foz do Iguaçu a 6h de ônibus (R$90).",
    tl: "🌿 Paraná",
    tag: "tag-free",
    img: "https://images.unsplash.com/photo-1629813583279-d581297d02dc?w=500&q=75",
    url: "https://g1.globo.com/pr/parana/",
    estado: "PR"
  },
  {
    t: "Florianópolis (SC): 42 Praias para Todos os Gostos e Bolsos",
    d: "Praia da Joaquina, Lagoinha do Leste (trilha grátis) e Lagoa da Conceição. Melhor época: março a maio (menos lotado).",
    tl: "🏄 Santa Catarina",
    tag: "tag-trend",
    img: "https://images.unsplash.com/photo-1506929562872-bb421503ef21?w=500&q=75",
    url: "https://g1.globo.com/sc/santa-catarina/",
    estado: "SC"
  },
  {
    t: "Porto Alegre (RS): Cultura Gaúcha, Serra e Vinícolas a Preço Justo",
    d: "Parque da Redenção e Usina do Gasômetro são grátis. Serra Gaúcha: degustação em vinícolas a partir de R$30.",
    tl: "🍷 Rio G. do Sul",
    tag: "tag-economy",
    img: "https://images.unsplash.com/photo-1474487548417-781cb71495f3?w=500&q=75",
    url: "https://g1.globo.com/rs/rio-grande-do-sul/",
    estado: "RS"
  },
];

let currentNews = [];
let newsPage = 1;
const newsPerPage = 6;

function fetchRSSNews() {
  console.log("[Turismo] Carregando guia turístico nacional...");
  // Shuffle para variar a exibição
  currentNews = [...TOURISM_NEWS].sort(() => Math.random() - 0.5);
  renderRSSNews();
}

function renderRSSNews(append = false) {
  const grid = document.getElementById('news-grid');
  if (!grid) return;

  const end = newsPage * newsPerPage;
  const itemsToShow = currentNews.slice(0, end);

  grid.innerHTML = itemsToShow.map(n => `
    <article class="news-card">
      <img class="news-card-img" src="${n.img}" alt="${n.tl}" loading="lazy">
      <div class="news-card-content">
        <div class="news-card-header">
          <span class="news-tag ${n.tag}">${n.tl}</span>
        </div>
        <h3>${n.t}</h3>
        <p>${n.d}</p>
        <div class="news-card-actions">
          <a href="${n.url}" target="_blank" rel="noopener noreferrer" class="news-link">Ler mais</a>
          <button class="news-dest-btn" onclick="handleNewsDest('${n.estado}')">Ver no Mapa</button>
        </div>
      </div>
    </article>
  `).join('');

  // "Ver Mais" button
  const existingBtn = document.getElementById('news-load-more');
  if (existingBtn) existingBtn.remove();

  if (currentNews.length > end) {
    const btn = document.createElement('button');
    btn.id = 'news-load-more';
    btn.className = 'see-all-btn';
    btn.style.margin = '1rem auto';
    btn.style.display = 'block';
    btn.textContent = 'Ver Mais Destinos ↓';
    btn.onclick = () => {
      newsPage++;
      renderRSSNews();
    };
    grid.parentElement.appendChild(btn);
  }
}

function handleNewsDest(sigla) {
  if (typeof BRAZIL_STATES !== 'undefined') {
    const state = BRAZIL_STATES.find(s => s.sigla === sigla);
    if (state && typeof focusState === 'function') {
      focusState(sigla);
      return;
    }
  }
  // Fallback: abre o mapa
  if (typeof goScreen === 'function') {
    goScreen('map');
  }
}

// Inicia o fluxo
document.addEventListener('DOMContentLoaded', () => {
  fetchRSSNews();
  // Re-shuffle a cada 5 minutos para variar
  setInterval(fetchRSSNews, 300000);
});
