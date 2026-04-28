"use client";

import { MapPin, ArrowUpRight } from "lucide-react";

export default function TourismSection() {
  const destinations = [
    {
      city: "Rio de Janeiro",
      state: "RJ",
      image: "https://images.unsplash.com/photo-1483729558449-99ef09a8c325?q=80&w=2070",
      description: "Cristo Redentor, Pão de Açúcar e praias inesquecíveis."
    },
    {
      city: "Bonito",
      state: "MS",
      image: "https://images.unsplash.com/photo-1541355422896-bc98b7e2311b?q=80&w=2070",
      description: "Ecoturismo, grutas azuis e flutuação em águas cristalinas."
    },
    {
      city: "Foz do Iguaçu",
      state: "PR",
      image: "https://images.unsplash.com/photo-1629813583279-d581297d02dc?q=80&w=2072",
      description: "Cataratas impressionantes e a força majestosa da natureza."
    }
  ];

  return (
    <section id="tourism" className="py-24 relative bg-slate-50 dark:bg-slate-800/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div className="max-w-2xl">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4 text-slate-900 dark:text-white">
              Destinos em <span className="text-gradient">Alta</span>
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-300">
              A IA Maya pré-configurou os roteiros perfeitos para estes locais. Visite-os no app.
            </p>
          </div>
          
          <a 
            href="/app/index.html"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-emerald-600 font-bold hover:text-emerald-500 transition-colors"
          >
            Ver Tudo no App
            <ArrowUpRight className="w-5 h-5" />
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {destinations.map((dest, i) => (
            <div
              key={i}
              className="group relative h-[400px] rounded-3xl overflow-hidden cursor-pointer shadow-lg shadow-slate-200 dark:shadow-slate-900/50"
            >
              <div 
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                style={{ backgroundImage: `url(${dest.image})` }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent" />
              
              <div className="absolute bottom-0 left-0 right-0 p-8">
                <div className="flex items-center gap-2 mb-3">
                  <MapPin className="w-5 h-5 text-emerald-400" />
                  <span className="text-emerald-100 font-medium tracking-wider text-sm">BRASIL</span>
                </div>
                <h3 className="text-2xl font-bold text-white mb-2 flex items-center justify-between">
                  {dest.city}, {dest.state}
                </h3>
                <p className="text-slate-200 text-sm max-w-xs transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                  {dest.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
