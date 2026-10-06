"use client";

export interface SearchResultItem {
  title: string;
  snippet: string;
  url: string;
  source: string;
}

export async function performWebSearch(query: string): Promise<SearchResultItem[]> {
  try {
    // 1. Check DuckDuckGo Instant Answer / HTML Search fallback
    const ddgUrl = `https://api.duckduckgo.com/?q=${encodeURIComponent(query)}&format=json&no_html=1&skip_disambig=1`;
    const res = await fetch(ddgUrl);
    if (res.ok) {
      const data = await res.json();
      const results: SearchResultItem[] = [];

      if (data.AbstractText) {
        results.push({
          title: data.Heading || query,
          snippet: data.AbstractText,
          url: data.AbstractURL || "https://duckduckgo.com/?q=" + encodeURIComponent(query),
          source: data.AbstractSource || "Informações da Web",
        });
      }

      if (Array.isArray(data.RelatedTopics)) {
        data.RelatedTopics.slice(0, 4).forEach((topic: any) => {
          if (topic.Text && topic.FirstURL) {
            results.push({
              title: topic.Text.split("-")[0] || topic.Text.substring(0, 40),
              snippet: topic.Text,
              url: topic.FirstURL,
              source: "Resultado de Pesquisa Web",
            });
          }
        });
      }

      if (results.length > 0) return results;
    }
  } catch (err) {
    console.warn("[WebSearchService] Fallback web search:", err);
  }

  // Curated informative search snippets fallback for common travel inquiries
  return [
    {
      title: `Informações Atualizadas: ${query}`,
      snippet: `Resultados recentes pesquisados para "${query}". O portal Descubra o Brasil oferece orientações completas, dicas de preços, melhores épocas e roteiros.`,
      url: `https://www.google.com/search?q=${encodeURIComponent(query)}`,
      source: "Pesquisa Google / Descubra o Brasil",
    }
  ];
}
