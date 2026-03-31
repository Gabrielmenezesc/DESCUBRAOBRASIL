"use client";

import { motion } from "framer-motion";
import { ExternalLink, TrendingUp } from "lucide-react";

const newsList = [
  {
    title: "Os 10 Destinos Mais Procurados do Brasil em 2026 para Férias Inesquecíveis",
    source: "G1 Turismo",
    sourceColor: "bg-red-100 text-red-700",
    image: "https://images.unsplash.com/photo-1483729558449-99ef09a8c325?q=80&w=600",
    url: "https://g1.globo.com/turismo-e-viagem/",
    trend: true,
  },
  {
    title: "Cataratas do Iguaçu Eleitas Maravilha Natural Mais Visitada da América do Sul",
    source: "Folha Turismo",
    sourceColor: "bg-amber-100 text-amber-700",
    image: "https://images.unsplash.com/photo-1629813583279-d581297d02dc?q=80&w=600",
    url: "https://www.folha.uol.com.br/turismo/",
    trend: true,
  },
  {
    title: "Nordeste Bate Recorde: Praias de Alagoas e Ceará Lotam na Alta Temporada",
    source: "G1 Turismo",
    sourceColor: "bg-red-100 text-red-700",
    image: "https://images.unsplash.com/photo-1559128010-7c1ad6e1b6a5?q=80&w=600",
    url: "https://g1.globo.com/turismo-e-viagem/",
    trend: true,
  },
  {
    title: "Chapada dos Veadeiros: Trilhas Gratuitas e Cachoeiras para Explorar em Goiás",
    source: "G1 Turismo",
    sourceColor: "bg-red-100 text-red-700",
    image: "https://images.unsplash.com/photo-1433086966358-54859d0ed716?q=80&w=600",
    url: "https://g1.globo.com/turismo-e-viagem/",
    trend: false,
  },
  {
    title: "Fernando de Noronha Reabre com Limite de Visitantes e Experiência Premium",
    source: "Folha Turismo",
    sourceColor: "bg-amber-100 text-amber-700",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=600",
    url: "https://www.folha.uol.com.br/turismo/",
    trend: false,
  },
  {
    title: "Turismo Sustentável Cresce 60%: Amazônia e Pantanal Lideram Ecoturismo",
    source: "G1 Turismo",
    sourceColor: "bg-red-100 text-red-700",
    image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=600",
    url: "https://g1.globo.com/turismo-e-viagem/",
    trend: false,
  },
];

export default function NewsSection({ limit }: { limit?: number }) {
  const items = limit ? newsList.slice(0, limit) : newsList;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {items.map((news, i) => (
        <motion.a
          key={i}
          href={news.url}
          target="_blank"
          rel="noopener noreferrer"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.1 }}
          className="group block bg-white rounded-2xl overflow-hidden shadow-lg shadow-slate-200/50 border border-slate-100 hover:shadow-xl hover:shadow-emerald-100/50 transition-all hover:-translate-y-1"
        >
          <div className="relative h-48 overflow-hidden">
            <div
              className="absolute inset-0 bg-cover bg-center group-hover:scale-110 transition-transform duration-700"
              style={{ backgroundImage: `url(${news.image})` }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
            <div className="absolute top-3 left-3 flex gap-2">
              <span className={`${news.sourceColor} px-3 py-1 rounded-full text-xs font-bold shadow-sm`}>
                {news.source}
              </span>
            </div>
            {news.trend && (
              <div className="absolute top-3 right-3">
                <span className="inline-flex items-center gap-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-extrabold shadow-lg animate-pulse">
                  <TrendingUp className="w-3 h-3" />
                  TENDÊNCIA 2026
                </span>
              </div>
            )}
            {!news.trend && (
              <div className="absolute top-3 right-3 w-8 h-8 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <ExternalLink className="w-4 h-4 text-slate-600" />
              </div>
            )}
          </div>
          <div className="p-5">
            <h3 className="font-bold text-slate-900 leading-snug group-hover:text-emerald-600 transition-colors">
              {news.title}
            </h3>
          </div>
        </motion.a>
      ))}
    </div>
  );
}
