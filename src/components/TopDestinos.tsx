"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { MapPin, Trophy } from "lucide-react";

const TOP_DESTINOS = [
  { rank: 1, name: "Rio de Janeiro", state: "RJ", image: "https://images.unsplash.com/photo-1483729558449-99ef09a8c325?q=80&w=400", slug: "rio-de-janeiro" },
  { rank: 2, name: "Lençóis Maranhenses", state: "MA", image: "https://images.unsplash.com/photo-1597487124413-82a4c4e8de1e?q=80&w=400", slug: "lencois-maranhenses" },
  { rank: 3, name: "Foz do Iguaçu", state: "PR", image: "https://images.unsplash.com/photo-1629813583279-d581297d02dc?q=80&w=400", slug: "foz-do-iguacu" },
  { rank: 4, name: "Gramado", state: "RS", image: "https://images.unsplash.com/photo-1559128010-7c1ad6e1b6a5?q=80&w=400", slug: "gramado" },
  { rank: 5, name: "Chapada Diamantina", state: "BA", image: "https://images.unsplash.com/photo-1433086966358-54859d0ed716?q=80&w=400", slug: "chapada-diamantina" },
  { rank: 6, name: "Fernando de Noronha", state: "PE", image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=400", slug: "fernando-de-noronha" },
  { rank: 7, name: "Bonito", state: "MS", image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=400", slug: "bonito" },
  { rank: 8, name: "Jalapão", state: "TO", image: "https://images.unsplash.com/photo-1518638150340-f706e86654de?q=80&w=400", slug: "jalapao" },
  { rank: 9, name: "Jericoacoara", state: "CE", image: "https://images.unsplash.com/photo-1605281317010-fe5ffe798166?q=80&w=400", slug: "jericoacoara" },
  { rank: 10, name: "Chapada dos Veadeiros", state: "GO", image: "https://images.unsplash.com/photo-1579883584852-60293ee099fa?q=80&w=400", slug: "chapada-dos-veadeiros" },
];

export default function TopDestinos() {
  return (
    <section className="py-12 bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-900/50 flex items-center justify-center text-amber-600 dark:text-amber-400">
            <Trophy className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white">Em Alta no Descubra o Brasil</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">Os 10 destinos mais procurados nesta temporada</p>
          </div>
        </div>

        <div className="flex overflow-x-auto gap-4 pb-4 snap-x snap-mandatory hide-scrollbar">
          {TOP_DESTINOS.map((destino) => (
            <Link 
              href={`/turismo/${destino.state.toLowerCase()}`}
              key={destino.rank}
              className="relative flex-none w-64 h-80 rounded-2xl overflow-hidden snap-center group shadow-lg"
            >
              <div 
                className="absolute inset-0 bg-cover bg-center group-hover:scale-110 transition-transform duration-700"
                style={{ backgroundImage: `url(${destino.image})` }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              
              <div className="absolute top-4 left-4 w-8 h-8 rounded-full bg-emerald-500 text-white font-black flex items-center justify-center shadow-lg">
                {destino.rank}
              </div>

              <div className="absolute bottom-4 left-4 right-4">
                <h3 className="text-white font-bold text-xl leading-tight mb-1">{destino.name}</h3>
                <div className="flex items-center gap-1 text-emerald-400 text-xs font-bold">
                  <MapPin className="w-3 h-3" />
                  {destino.state}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
