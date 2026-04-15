"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { ExternalLink, TrendingUp, RefreshCw, MapPin, Clock, Filter, ChevronDown } from "lucide-react";
import { useNews, type NewsItem } from "@/hooks/useNews";
import { useGeolocation, STATES_LIST } from "@/hooks/useGeolocation";

const CATEGORIES = ["Todos", "Praias", "Cultura", "Ecoturismo", "Gratuito", "Gastronomia", "Destinos", "Natureza", "Hospedagem"];

const SOURCE_COLORS: Record<string, string> = {
  "G1 Turismo": "bg-red-100 text-red-700",
  "Folha Turismo": "bg-amber-100 text-amber-700",
  "UOL Viagem": "bg-purple-100 text-purple-700",
  "Brasil Turismo": "bg-emerald-100 text-emerald-700",
};

function formatTimeAgo(dateStr: string): string {
  const now = new Date();
  const date = new Date(dateStr);
  const diffMs = now.getTime() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  
  if (diffMin < 1) return "agora";
  if (diffMin < 60) return `há ${diffMin}min`;
  const diffH = Math.floor(diffMin / 60);
  if (diffH < 24) return `há ${diffH}h`;
  const diffD = Math.floor(diffH / 24);
  return `há ${diffD}d`;
}

export default function NewsSection({ limit, showFilters = false }: { limit?: number; showFilters?: boolean }) {
  const { location } = useGeolocation();
  const [selectedState, setSelectedState] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [showStateDropdown, setShowStateDropdown] = useState(false);

  // Usar o estado selecionado ou o detectado pela localização
  const activeState = selectedState || location?.stateCode || "";
  const { news, loading, lastUpdate, refetch } = useNews(
    showFilters ? activeState : undefined
  );

  const filteredNews = useMemo(() => {
    let items = [...news];
    if (selectedCategory !== "Todos") {
      items = items.filter(n => n.category === selectedCategory);
    }
    return limit ? items.slice(0, limit) : items;
  }, [news, selectedCategory, limit]);

  return (
    <div>
      {/* Filtros */}
      {showFilters && (
        <div className="mb-8 space-y-4">
          {/* Estado + Atualização */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            {/* Seletor de Estado */}
            <div className="relative">
              <button
                onClick={() => setShowStateDropdown(!showStateDropdown)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 transition-colors text-sm font-semibold text-slate-700 shadow-sm"
              >
                <MapPin className="w-4 h-4 text-emerald-500" />
                {selectedState 
                  ? STATES_LIST.find(s => s.code === selectedState)?.name 
                  : location?.state 
                    ? `📍 ${location.state} (sua localização)` 
                    : "Todos os estados"}
                <ChevronDown className="w-4 h-4 text-slate-400" />
              </button>

              {showStateDropdown && (
                <div className="absolute top-full left-0 mt-2 w-72 max-h-80 overflow-y-auto bg-white border border-slate-200 rounded-xl shadow-xl z-50">
                  <button
                    onClick={() => { setSelectedState(""); setShowStateDropdown(false); }}
                    className="w-full text-left px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-emerald-50 transition-colors border-b border-slate-100"
                  >
                    🌍 Todos os estados
                  </button>
                  {location && (
                    <button
                      onClick={() => { setSelectedState(location.stateCode); setShowStateDropdown(false); }}
                      className="w-full text-left px-4 py-2.5 text-sm font-semibold text-emerald-600 hover:bg-emerald-50 transition-colors border-b border-slate-100"
                    >
                      📍 {location.state} (minha localização)
                    </button>
                  )}
                  {STATES_LIST.map(state => (
                    <button
                      key={state.code}
                      onClick={() => { setSelectedState(state.code); setShowStateDropdown(false); }}
                      className={`w-full text-left px-4 py-2 text-sm hover:bg-emerald-50 transition-colors flex items-center justify-between ${
                        selectedState === state.code ? "bg-emerald-50 text-emerald-700 font-bold" : "text-slate-600"
                      }`}
                    >
                      <span>{state.name}</span>
                      <span className="text-xs text-slate-400">{state.region}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Última atualização + refresh */}
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1.5 text-xs text-slate-400">
                <Clock className="w-3.5 h-3.5" />
                Atualizado: {lastUpdate.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
                <span className="text-slate-300">|</span>
                Próxima em 30min
              </span>
              <button
                onClick={refetch}
                className="p-2 rounded-lg hover:bg-slate-100 transition-colors text-slate-400 hover:text-emerald-500"
                title="Atualizar agora"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
              </button>
            </div>
          </div>

          {/* Categorias */}
          <div className="flex flex-wrap gap-2">
            <Filter className="w-4 h-4 text-slate-400 mt-1.5" />
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                  selectedCategory === cat
                    ? "bg-emerald-500 text-white shadow-sm"
                    : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Loading */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {Array.from({ length: limit || 6 }).map((_, i) => (
            <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-lg animate-pulse">
              <div className="h-48 bg-slate-200" />
              <div className="p-5 space-y-3">
                <div className="h-4 bg-slate-200 rounded w-3/4" />
                <div className="h-3 bg-slate-100 rounded w-full" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <>
          {filteredNews.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-slate-400 text-lg">Nenhuma notícia encontrada para os filtros selecionados.</p>
              <button onClick={() => { setSelectedCategory("Todos"); setSelectedState(""); }} className="mt-4 text-emerald-500 font-bold hover:underline">
                Limpar filtros
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredNews.map((news: NewsItem, i: number) => (
                <motion.a
                  key={i}
                  href={news.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className="group block bg-white rounded-2xl overflow-hidden shadow-lg shadow-slate-200/50 border border-slate-100 hover:shadow-xl hover:shadow-emerald-100/50 transition-all hover:-translate-y-1"
                >
                  <div className="relative h-48 overflow-hidden">
                    <div
                      className="absolute inset-0 bg-cover bg-center group-hover:scale-110 transition-transform duration-700"
                      style={{ backgroundImage: `url(${news.image})` }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                    
                    {/* Badges */}
                    <div className="absolute top-3 left-3 flex flex-wrap gap-2">
                      <span className={`${SOURCE_COLORS[news.source] || "bg-emerald-100 text-emerald-700"} px-3 py-1 rounded-full text-xs font-bold shadow-sm`}>
                        {news.source}
                      </span>
                      <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold shadow-sm">
                        {news.category}
                      </span>
                    </div>
                    
                    {/* Time */}
                    <div className="absolute bottom-3 right-3">
                      <span className="bg-black/50 backdrop-blur-sm text-white px-2 py-1 rounded-full text-[10px] font-bold flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatTimeAgo(news.publishedAt)}
                      </span>
                    </div>

                    {/* State badge */}
                    {news.state && (
                      <div className="absolute bottom-3 left-3">
                        <span className="bg-emerald-500 text-white px-2 py-1 rounded-full text-[10px] font-bold flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {news.state}
                        </span>
                      </div>
                    )}

                    {/* External link indicator */}
                    <div className="absolute top-3 right-3 w-8 h-8 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <ExternalLink className="w-4 h-4 text-slate-600" />
                    </div>
                  </div>
                  
                  <div className="p-5">
                    <h3 className="font-bold text-slate-900 leading-snug group-hover:text-emerald-600 transition-colors mb-2">
                      {news.title}
                    </h3>
                    {news.description && (
                      <p className="text-sm text-slate-500 leading-relaxed line-clamp-2">
                        {news.description}
                      </p>
                    )}
                  </div>
                </motion.a>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
