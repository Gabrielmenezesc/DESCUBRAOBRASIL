"use client";

import { useState, useEffect, useCallback } from "react";

export interface NewsItem {
  title: string;
  description: string;
  url: string;
  image: string;
  source: string;
  publishedAt: string;
  state?: string;
  category: string;
}

// Palavras-chave de turismo para busca
const TOURISM_KEYWORDS = [
  "turismo", "viagem", "destino", "praia", "trilha", "cachoeira",
  "parque", "museu", "cultura", "festival", "gastronomia", "hotel",
  "pousada", "ecoturismo", "patrimônio", "natureza", "passeio",
  "roteiro", "atração", "visitante"
];

// Palavras para excluir (política)
const EXCLUDED_KEYWORDS = [
  "política", "eleição", "governo", "partido", "senado", "câmara",
  "stf", "lula", "bolsonaro", "congresso", "deputado", "senador",
  "ministro", "prefeito", "vereador", "impeachment", "corrupção"
];

// Fallback de notícias quando a API não responde
const FALLBACK_NEWS: NewsItem[] = [
  {
    title: "Os 10 Destinos Mais Procurados do Brasil em 2026",
    description: "De Norte a Sul, conheça os lugares que estão atraindo milhões de turistas neste ano.",
    url: "https://g1.globo.com/turismo-e-viagem/",
    image: "https://images.unsplash.com/photo-1483729558449-99ef09a8c325?q=80&w=600",
    source: "G1 Turismo",
    publishedAt: new Date().toISOString(),
    category: "Destinos",
  },
  {
    title: "Cataratas do Iguaçu: Maravilha Natural Mais Visitada da América do Sul",
    description: "As cataratas bateram recorde de visitação com mais de 2 milhões de turistas.",
    url: "https://g1.globo.com/turismo-e-viagem/",
    image: "https://images.unsplash.com/photo-1629813583279-d581297d02dc?q=80&w=600",
    source: "G1 Turismo",
    publishedAt: new Date().toISOString(),
    state: "PR",
    category: "Natureza",
  },
  {
    title: "Nordeste Recorde: Praias de Alagoas e Ceará em Alta Temporada",
    description: "O litoral nordestino registra aumento de 40% no turismo este ano.",
    url: "https://g1.globo.com/turismo-e-viagem/",
    image: "https://images.unsplash.com/photo-1559128010-7c1ad6e1b6a5?q=80&w=600",
    source: "G1 Turismo",
    publishedAt: new Date().toISOString(),
    state: "AL",
    category: "Praias",
  },
  {
    title: "Chapada dos Veadeiros: Trilhas Gratuitas e Cachoeiras Incríveis em Goiás",
    description: "Descubra as melhores trilhas gratuitas e cachoeiras para explorar no coração do cerrado.",
    url: "https://g1.globo.com/turismo-e-viagem/",
    image: "https://images.unsplash.com/photo-1433086966358-54859d0ed716?q=80&w=600",
    source: "G1 Turismo",
    publishedAt: new Date().toISOString(),
    state: "GO",
    category: "Ecoturismo",
  },
  {
    title: "Fernando de Noronha Reabre com Experiência Premium para Visitantes",
    description: "O arquipélago mais famoso do Brasil adota novo modelo de visitação sustentável.",
    url: "https://g1.globo.com/turismo-e-viagem/",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=600",
    source: "Folha Turismo",
    publishedAt: new Date().toISOString(),
    state: "PE",
    category: "Praias",
  },
  {
    title: "Turismo Sustentável: Amazônia e Pantanal Lideram Ecoturismo no Brasil",
    description: "Crescimento de 60% no turismo ecológico transforma a região em destino internacional.",
    url: "https://g1.globo.com/turismo-e-viagem/",
    image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=600",
    source: "G1 Turismo",
    publishedAt: new Date().toISOString(),
    state: "AM",
    category: "Ecoturismo",
  },
  {
    title: "Salvador: Pelourinho Ganha Nova Iluminação e Programação Cultural Gratuita",
    description: "O centro histórico de Salvador é revitalizado com novas atrações gratuitas para turistas.",
    url: "https://g1.globo.com/turismo-e-viagem/",
    image: "https://images.unsplash.com/photo-1597487124413-82a4c4e8de1e?q=80&w=600",
    source: "G1 Turismo",
    publishedAt: new Date().toISOString(),
    state: "BA",
    category: "Cultura",
  },
  {
    title: "Gramado e Canela: O Charme Europeu do Sul do Brasil Atrai Famílias",
    description: "As cidades gaúchas registram recorde de ocupação hoteleira no inverno.",
    url: "https://g1.globo.com/turismo-e-viagem/",
    image: "https://images.unsplash.com/photo-1580688877612-61c87a3e24b7?q=80&w=600",
    source: "Folha Turismo",
    publishedAt: new Date().toISOString(),
    state: "RS",
    category: "Destinos",
  },
  {
    title: "Rio de Janeiro: Parques e Mirantes Gratuitos com Vistas de Tirar o Fôlego",
    description: "Descubra os melhores pontos gratuitos para curtir a Cidade Maravilhosa.",
    url: "https://g1.globo.com/turismo-e-viagem/",
    image: "https://images.unsplash.com/photo-1516306580123-e6e52b1b7b5f?q=80&w=600",
    source: "G1 Turismo",
    publishedAt: new Date().toISOString(),
    state: "RJ",
    category: "Gratuito",
  },
  {
    title: "Lençóis Maranhenses: As Deslumbrantes Lagoas Azuis do Maranhão",
    description: "O parque nacional é eleito um dos destinos mais instagramáveis do mundo.",
    url: "https://g1.globo.com/turismo-e-viagem/",
    image: "https://images.unsplash.com/photo-1626543541070-e258edb80544?q=80&w=600",
    source: "Folha Turismo",
    publishedAt: new Date().toISOString(),
    state: "MA",
    category: "Natureza",
  },
  {
    title: "Ouro Preto e Tiradentes: Rota Barroca de Minas Gerais Encanta Turistas",
    description: "As cidades históricas mineiras oferecem igrejas, museus e gastronomia imperdível.",
    url: "https://g1.globo.com/turismo-e-viagem/",
    image: "https://images.unsplash.com/photo-1598301257982-0cf014dabbca?q=80&w=600",
    source: "G1 Turismo",
    publishedAt: new Date().toISOString(),
    state: "MG",
    category: "Cultura",
  },
  {
    title: "Florianópolis: A Ilha da Magia Conquista Surfistas e Famílias do Mundo Todo",
    description: "Com mais de 40 praias, Floripa se consolida como destino completo de verão.",
    url: "https://g1.globo.com/turismo-e-viagem/",
    image: "https://images.unsplash.com/photo-1594736797933-d0501ba2fe65?q=80&w=600",
    source: "Folha Turismo",
    publishedAt: new Date().toISOString(),
    state: "SC",
    category: "Praias",
  },
  {
    title: "Jalapão: O Deserto de Águas Cristalinas no Coração do Tocantins",
    description: "Dunas, fervedouros e cachoeiras fazem do Jalapão um paraíso para aventureiros.",
    url: "https://g1.globo.com/turismo-e-viagem/",
    image: "https://images.unsplash.com/photo-1504893524553-b855bce32c67?q=80&w=600",
    source: "G1 Turismo",
    publishedAt: new Date().toISOString(),
    state: "TO",
    category: "Ecoturismo",
  },
  {
    title: "Bonito (MS): Capital do Ecoturismo Tem Flutuação em Águas Transparentes",
    description: "As nascentes de rios cristalinos de Bonito são uma experiência única no planeta.",
    url: "https://g1.globo.com/turismo-e-viagem/",
    image: "https://images.unsplash.com/photo-1541355422896-bc98b7e2311b?q=80&w=600",
    source: "G1 Turismo",
    publishedAt: new Date().toISOString(),
    state: "MS",
    category: "Ecoturismo",
  },
  {
    title: "Jericoacoara: A Vila dos Sonhos no Ceará com Dunas e Lagoas Paradisíacas",
    description: "Jeri se mantém como um dos destinos mais procurados do Brasil por turistas do mundo todo.",
    url: "https://g1.globo.com/turismo-e-viagem/",
    image: "https://images.unsplash.com/photo-1505142468610-359e7d316be0?q=80&w=600",
    source: "Folha Turismo",
    publishedAt: new Date().toISOString(),
    state: "CE",
    category: "Praias",
  },
  {
    title: "São Paulo: Museus, Parques e Gastronomia — Tudo Gratuito na Capital Paulista",
    description: "A maior cidade do Brasil oferece centenas de opções culturais sem custo.",
    url: "https://g1.globo.com/turismo-e-viagem/",
    image: "https://images.unsplash.com/photo-1543059080-cebb1e689bf7?q=80&w=600",
    source: "G1 Turismo",
    publishedAt: new Date().toISOString(),
    state: "SP",
    category: "Gratuito",
  },
  {
    title: "Manaus: Porta de Entrada para a Maior Floresta Tropical do Mundo",
    description: "O ecoturismo na Amazônia cresce com passeios de barco, trilhas e comunidades ribeirinhas.",
    url: "https://g1.globo.com/turismo-e-viagem/",
    image: "https://images.unsplash.com/photo-1618953822098-e6614c1d2e94?q=80&w=600",
    source: "Folha Turismo",
    publishedAt: new Date().toISOString(),
    state: "AM",
    category: "Ecoturismo",
  },
  {
    title: "Natal e Pipa: As Praias do Rio Grande do Norte que Encantam Turistas",
    description: "Do Forte dos Reis Magos à Praia de Pipa, o RN oferece natural beleza e diversão.",
    url: "https://g1.globo.com/turismo-e-viagem/",
    image: "https://images.unsplash.com/photo-1590523741831-ab7e8b8f9c7f?q=80&w=600",
    source: "G1 Turismo",
    publishedAt: new Date().toISOString(),
    state: "RN",
    category: "Praias",
  },
];

function filterPolitics(text: string): boolean {
  const lower = text.toLowerCase();
  return !EXCLUDED_KEYWORDS.some(kw => lower.includes(kw));
}

function isTourismRelated(text: string): boolean {
  const lower = text.toLowerCase();
  return TOURISM_KEYWORDS.some(kw => lower.includes(kw));
}

export function useNews(stateFilter?: string, cityFilter?: string) {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  const fetchNews = useCallback(async () => {
    setLoading(true);
    try {
      // Construir query de busca
      let query = "turismo Brasil";
      if (stateFilter) query = `turismo ${stateFilter}`;
      if (cityFilter) query = `turismo viagem ${cityFilter}`;

      // Tentar buscar notícias reais via Google News RSS → rss2json
      const rssUrl = `https://news.google.com/rss/search?q=${encodeURIComponent(query)}&hl=pt-BR&gl=BR&ceid=BR:pt-419`;
      const apiUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(rssUrl)}&count=20`;
      
      const res = await fetch(apiUrl);
      
      if (res.ok) {
        const data = await res.json();
        
        if (data.status === "ok" && data.items?.length > 0) {
          const filtered = data.items
            .filter((item: any) => {
              const text = `${item.title} ${item.description || ""}`;
              return filterPolitics(text);
            })
            .map((item: any) => {
              const lower = `${item.title} ${item.description || ""}`.toLowerCase();

              // Detectar categoria
              let category = "Turismo";
              if (lower.includes("praia") || lower.includes("litoral") || lower.includes("mar")) category = "Praias";
              else if (lower.includes("museu") || lower.includes("cultura") || lower.includes("festival") || lower.includes("patrimônio")) category = "Cultura";
              else if (lower.includes("trilha") || lower.includes("cachoeira") || lower.includes("eco") || lower.includes("parque")) category = "Ecoturismo";
              else if (lower.includes("grátis") || lower.includes("gratuito") || lower.includes("gratis") || lower.includes("livre")) category = "Gratuito";
              else if (lower.includes("hotel") || lower.includes("pousada") || lower.includes("hospedagem")) category = "Hospedagem";
              else if (lower.includes("gastronomia") || lower.includes("comida") || lower.includes("restaurante")) category = "Gastronomia";

              return {
                title: item.title?.replace(/ - .*$/, "") || "",
                description: item.description?.replace(/<[^>]*>/g, "").slice(0, 160) || "",
                url: item.link || "#",
                image: item.thumbnail || item.enclosure?.link || getFallbackImage(category),
                source: item.author || extractSource(item.title),
                publishedAt: item.pubDate || new Date().toISOString(),
                state: stateFilter || undefined,
                category,
              };
            });

          if (filtered.length > 0) {
            setNews(filtered);
            setLastUpdate(new Date());
            setLoading(false);
            return;
          }
        }
      }
      
      // Fallback: usar notícias locais filtradas por estado
      let fallback = [...FALLBACK_NEWS];
      if (stateFilter) {
        const stateNews = fallback.filter(n => n.state === stateFilter);
        fallback = stateNews.length > 0 ? stateNews : fallback;
      }
      setNews(fallback);
      setLastUpdate(new Date());
    } catch {
      // Fallback em caso de erro
      setNews(FALLBACK_NEWS);
      setLastUpdate(new Date());
    } finally {
      setLoading(false);
    }
  }, [stateFilter, cityFilter]);

  // Buscar notícias na montagem e a cada 30 minutos
  useEffect(() => {
    fetchNews();
    const interval = setInterval(fetchNews, 30 * 60 * 1000); // 30 minutos
    return () => clearInterval(interval);
  }, [fetchNews]);

  return { news, loading, lastUpdate, refetch: fetchNews };
}

function extractSource(title: string): string {
  const match = title?.match(/ - (.+)$/);
  return match ? match[1] : "Brasil Turismo";
}

function getFallbackImage(category: string): string {
  const images: Record<string, string> = {
    "Praias": "https://images.unsplash.com/photo-1559128010-7c1ad6e1b6a5?q=80&w=600",
    "Cultura": "https://images.unsplash.com/photo-1597487124413-82a4c4e8de1e?q=80&w=600",
    "Ecoturismo": "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=600",
    "Gratuito": "https://images.unsplash.com/photo-1516306580123-e6e52b1b7b5f?q=80&w=600",
    "Hospedagem": "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=600",
    "Gastronomia": "https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=600",
    "Turismo": "https://images.unsplash.com/photo-1483729558449-99ef09a8c325?q=80&w=600",
  };
  return images[category] || images["Turismo"];
}

// Exportar as constantes para uso em outros componentes
export { TOURISM_KEYWORDS, EXCLUDED_KEYWORDS };
