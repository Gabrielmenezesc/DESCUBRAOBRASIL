"use client";

import { motion } from "framer-motion";
import { Landmark, Music, Utensils, Palette, TreePine } from "lucide-react";

const regions = [
  {
    name: "Norte",
    states: "AC, AM, AP, PA, RO, RR, TO",
    stateCount: 7,
    highlight: "Amazônia, lendas ribeirinhas, Festival de Parintins, Boi-Bumbá e Círio de Nazaré",
    image: "https://images.unsplash.com/photo-1618953822098-e6614c1d2e94?q=80&w=600",
    color: "from-emerald-600 to-green-500",
    icon: TreePine,
  },
  {
    name: "Nordeste",
    states: "AL, BA, CE, MA, PB, PE, PI, RN, SE",
    stateCount: 9,
    highlight: "Frevo, São João, acarajé, cangaço, rendas, forró e Lavagem do Bonfim",
    image: "https://images.unsplash.com/photo-1597487124413-82a4c4e8de1e?q=80&w=600",
    color: "from-amber-500 to-orange-500",
    icon: Music,
  },
  {
    name: "Centro-Oeste",
    states: "DF, GO, MS, MT",
    stateCount: 4,
    highlight: "Cerrado, Pantanal, Cavalhadas de Pirenópolis, sertanejo e culinária goiana",
    image: "https://images.unsplash.com/photo-1433086966358-54859d0ed716?q=80&w=600",
    color: "from-yellow-500 to-amber-500",
    icon: Landmark,
  },
  {
    name: "Sudeste",
    states: "ES, MG, RJ, SP",
    stateCount: 4,
    highlight: "Barroco mineiro, carnaval carioca, café, samba, gastronomia e museus",
    image: "https://images.unsplash.com/photo-1483729558449-99ef09a8c325?q=80&w=600",
    color: "from-blue-500 to-indigo-500",
    icon: Palette,
  },
  {
    name: "Sul",
    states: "PR, RS, SC",
    stateCount: 3,
    highlight: "Chimarrão, churrasco, imigração europeia, Oktoberfest e vinícolas",
    image: "https://images.unsplash.com/photo-1580688877612-61c87a3e24b7?q=80&w=600",
    color: "from-red-500 to-rose-500",
    icon: Utensils,
  },
];

export default function CultureSection() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="inline-block px-4 py-1.5 rounded-full bg-amber-50 text-amber-600 text-sm font-bold mb-4"
          >
            CULTURAS DO BRASIL
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-bold tracking-tight text-slate-900 mb-4"
          >
            Explore por <span className="text-gradient">Região</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg text-slate-600 max-w-2xl mx-auto"
          >
            O Brasil é um mosaico de culturas, sabores e tradições. Descubra o que cada região tem de melhor para oferecer.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {regions.map((region, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={`group relative rounded-3xl overflow-hidden cursor-pointer shadow-lg ${
                i < 2 ? "h-[380px]" : "h-[320px]"
              } ${i === 4 ? "md:col-span-2 lg:col-span-1" : ""}`}
            >
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                style={{ backgroundImage: `url(${region.image})` }}
              />
              <div className={`absolute inset-0 bg-gradient-to-t ${region.color} opacity-70`} />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

              <div className="absolute top-4 right-4">
                <div className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-white text-xs font-bold">
                  {region.stateCount} estados
                </div>
              </div>

              <div className="absolute bottom-0 left-0 right-0 p-6">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                    <region.icon className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-2xl font-extrabold text-white">{region.name}</h3>
                </div>
                <p className="text-white/80 text-sm mb-2">{region.highlight}</p>
                <p className="text-white/50 text-xs font-mono tracking-wide">{region.states}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
