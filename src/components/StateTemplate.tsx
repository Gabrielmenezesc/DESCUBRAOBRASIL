"use client";

import dynamic from "next/dynamic";
import { MapPin, Info, DollarSign, Calendar, Navigation, Sunrise, TreePine, ChefHat, Sparkles } from "lucide-react";

// Import map component dynamically to disable SSR (Leaflet requires window)
const StateMap = dynamic(() => import("@/components/StateMap"), {
  ssr: false,
  loading: () => (
    <div className="h-[420px] w-full rounded-2xl bg-slate-100 dark:bg-slate-800 animate-pulse flex items-center justify-center border border-slate-200 dark:border-slate-700">
      <span className="text-slate-400 font-medium flex items-center gap-2">
        <MapPin className="w-5 h-5 animate-bounce" /> Carregando mapa...
      </span>
    </div>
  ),
});

export default function StateTemplate({ data }: { data: any }) {
  if (!data) return <div>Dados não encontrados.</div>;

  return (
    <article className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-24">
      
      {/* Hero Section */}
      <header className="grid grid-cols-1 md:grid-cols-[160px_1fr] gap-6 md:gap-10 items-center mb-12">
        <div className="w-[120px] h-[120px] md:w-[160px] md:h-[160px] flex-shrink-0 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl p-6 shadow-xl shadow-slate-200/50 dark:shadow-none flex items-center justify-center">
          {/* Placeholder for SVG Mini Map. Ideally /assets/maps/am.svg etc. */}
          <div className="text-center">
            <MapPin className="w-12 h-12 text-emerald-500 mx-auto opacity-50 mb-2" />
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{data.uf_code}</span>
          </div>
        </div>

        <div>
          <p className="text-emerald-600 dark:text-emerald-400 font-semibold tracking-wider text-sm mb-2 uppercase">
            {data.region} • Capital {data.capital}
          </p>
          <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-4">
            {data.state_name}
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-300 max-w-3xl mb-6">
            {data.general_info.intro}
          </p>

          <ul className="flex flex-wrap gap-2">
            <li className="bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 px-4 py-1.5 rounded-full text-sm font-medium border border-emerald-200/50 dark:border-emerald-800/50 flex items-center gap-1.5">
              <Sunrise className="w-4 h-4" /> {data.general_info.climate}
            </li>
            <li className="bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-4 py-1.5 rounded-full text-sm font-medium border border-blue-200/50 dark:border-blue-800/50 flex items-center gap-1.5">
              <Calendar className="w-4 h-4" /> Melhor época: {data.general_info.best_time}
            </li>
            <li className="bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 px-4 py-1.5 rounded-full text-sm font-medium border border-amber-200/50 dark:border-amber-800/50 flex items-center gap-1.5">
              <TreePine className="w-4 h-4" /> {data.general_info.biomes.join(", ")}
            </li>
          </ul>
        </div>
      </header>

      {/* Grid: Free Tourism & Top Attractions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        
        {/* Turismo Gratuito */}
        <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
              <Sparkles className="w-5 h-5" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Turismo Gratuito</h2>
          </div>

          <div className="space-y-6">
            {data.free_tourism.public_beaches?.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-3 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Praias Públicas
                </h3>
                <div className="grid gap-3">
                  {data.free_tourism.public_beaches.map((item: any, idx: number) => (
                    <div key={idx} className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-700/50">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-bold text-slate-900 dark:text-slate-100">{item.name}</h4>
                          <p className="text-sm text-slate-500 dark:text-slate-400 mb-2">{item.city}</p>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {item.tags?.map((tag: string, t: number) => (
                          <span key={t} className="px-2 py-0.5 rounded-md bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-500 dark:text-slate-400">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {data.free_tourism.parks?.length > 0 && (
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-3 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Parques e Praças
                </h3>
                <ul className="space-y-2">
                  {data.free_tourism.parks.map((item: any, idx: number) => (
                    <li key={idx} className="flex justify-between items-center py-2 border-b border-dashed border-slate-200 dark:border-slate-700 last:border-0">
                      <span className="font-medium text-slate-700 dark:text-slate-300">{item.name}</span>
                      <span className="text-xs text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-md">{item.city}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </section>

        {/* Top Attractions */}
        <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-600">
              <MapPin className="w-5 h-5" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Top Atrações</h2>
          </div>

          <div className="grid gap-4">
            {data.top_attractions.map((item: any, idx: number) => (
              <div key={idx} className="group relative bg-slate-50 dark:bg-slate-800/50 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 p-5 rounded-2xl border border-slate-100 dark:border-slate-700/50 transition-colors">
                <div className="flex justify-between items-start mb-1">
                  <h3 className="font-bold text-lg text-slate-900 dark:text-slate-100 group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">
                    {item.name}
                  </h3>
                  <span className={`text-xs font-bold px-2 py-1 rounded-md uppercase tracking-wider ${item.is_free ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-300'}`}>
                    {item.is_free ? 'Grátis' : 'Pago'}
                  </span>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">{item.short_description}</p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-2 py-1 rounded-md bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-500 font-medium">
                    📍 {item.city}
                  </span>
                  <span className="px-2 py-1 rounded-md bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-500 font-medium">
                    🏷️ {item.category}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Grid: Gastronomy & Itineraries */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        
        {/* Gastronomia */}
        <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600">
              <ChefHat className="w-5 h-5" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Gastronomia</h2>
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="text-sm uppercase tracking-widest font-bold text-slate-400 mb-3">Pratos Típicos</h3>
              <div className="flex flex-wrap gap-2">
                {data.gastronomy.signature_dishes.map((dish: string, idx: number) => (
                  <span key={idx} className="bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300 px-4 py-2 rounded-xl text-sm font-medium border border-orange-100 dark:border-orange-800/30">
                    {dish}
                  </span>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-6 border-t border-slate-100 dark:border-slate-800">
              <div>
                <h3 className="text-sm uppercase tracking-widest font-bold text-slate-400 mb-3">Comida de Rua</h3>
                <ul className="space-y-2">
                  {data.gastronomy.street_food.map((item: string, idx: number) => (
                    <li key={idx} className="text-slate-700 dark:text-slate-300 text-sm flex items-start gap-2">
                      <span className="text-orange-400 mt-0.5">•</span> {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="text-sm uppercase tracking-widest font-bold text-slate-400 mb-3">Opções Econômicas</h3>
                <ul className="space-y-2">
                  {data.gastronomy.budget_eats.map((item: string, idx: number) => (
                    <li key={idx} className="text-slate-700 dark:text-slate-300 text-sm flex items-start gap-2">
                      <span className="text-orange-400 mt-0.5">•</span> {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Roteiros */}
        <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
              <Navigation className="w-5 h-5" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Sugestões de Roteiro</h2>
          </div>

          <div className="space-y-6">
            <div className="relative pl-6 border-l-2 border-blue-100 dark:border-blue-900">
              <div className="absolute w-4 h-4 bg-blue-500 rounded-full border-4 border-white dark:border-slate-900 -left-[9px] top-0"></div>
              <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-2 -mt-1">Roteiro 1 Dia</h3>
              <ul className="space-y-1">
                {data.itineraries.one_day.map((item: string, idx: number) => (
                  <li key={idx} className="text-sm text-slate-600 dark:text-slate-400">{idx + 1}. {item}</li>
                ))}
              </ul>
            </div>

            <div className="relative pl-6 border-l-2 border-blue-100 dark:border-blue-900">
              <div className="absolute w-4 h-4 bg-blue-500 rounded-full border-4 border-white dark:border-slate-900 -left-[9px] top-0"></div>
              <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-2 -mt-1">Roteiro 3 Dias</h3>
              <ul className="space-y-1">
                {data.itineraries.three_days.map((item: string, idx: number) => (
                  <li key={idx} className="text-sm text-slate-600 dark:text-slate-400">{item}</li>
                ))}
              </ul>
            </div>

            <div className="relative pl-6 border-l-2 border-transparent">
              <div className="absolute w-4 h-4 bg-blue-500 rounded-full border-4 border-white dark:border-slate-900 -left-[9px] top-0"></div>
              <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-2 -mt-1">Roteiro 7 Dias</h3>
              <ul className="space-y-1">
                {data.itineraries.seven_days.map((item: string, idx: number) => (
                  <li key={idx} className="text-sm text-slate-600 dark:text-slate-400">{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      </div>

      {/* Mapa Interativo */}
      <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 shadow-sm mb-8">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Mapa do Destino</h2>
              <p className="text-sm text-slate-500">Explore as principais atrações de {data.state_name}</p>
            </div>
          </div>
        </div>
        
        <StateMap 
          center={data.map_settings.default_center} 
          zoom={data.map_settings.default_zoom} 
          attractions={data.top_attractions} 
        />
      </section>

      {/* Maya AI Snippets */}
      <section className="bg-emerald-900 border border-emerald-800 rounded-3xl p-6 md:p-8 shadow-lg overflow-hidden relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/20 rounded-full blur-3xl -mr-20 -mt-20"></div>
        
        <div className="flex items-center gap-3 mb-8 relative z-10">
          <div className="w-12 h-12 rounded-full bg-emerald-800 border-2 border-emerald-400 flex items-center justify-center overflow-hidden">
            <img src="/logo-descubra.png" alt="Maya" className="w-full h-full object-cover" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">Pergunte para a Maya</h2>
            <p className="text-emerald-200/80 text-sm">Exemplos de como a IA pode te ajudar no app</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative z-10">
          {data.maya_snippets.map((snippet: any, idx: number) => (
            <div key={idx} className="bg-emerald-950/50 border border-emerald-800/50 rounded-2xl p-5 backdrop-blur-sm">
              <div className="mb-4">
                <span className="inline-block px-2 py-1 rounded bg-emerald-800/50 text-emerald-300 text-[10px] uppercase font-bold tracking-widest mb-2 border border-emerald-700/50">
                  {snippet.intent}
                </span>
                <p className="text-white text-sm font-medium flex items-start gap-2">
                  <span className="text-emerald-400 mt-1 text-xs">👤</span> "{snippet.user_example}"
                </p>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                <p className="text-emerald-50 text-sm leading-relaxed flex items-start gap-2">
                  <Sparkles className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                  {snippet.assistant_snippet}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

    </article>
  );
}
