"use client";

import { motion } from "framer-motion";
import { MapPin, Star, Ticket, TreePine, Landmark, Waves } from "lucide-react";

const attractions = [
  {
    name: "Parque Ibirapuera",
    city: "São Paulo",
    state: "SP",
    type: "Parque",
    icon: TreePine,
    image: "https://images.unsplash.com/photo-1543059080-cebb1e689bf7?q=80&w=600",
    description: "O maior parque urbano de SP com museus, trilhas e área verde.",
  },
  {
    name: "Cristo Redentor (mirante externo)",
    city: "Rio de Janeiro",
    state: "RJ",
    type: "Mirante",
    icon: Landmark,
    image: "https://images.unsplash.com/photo-1516306580123-e6e52b1b7b5f?q=80&w=600",
    description: "Vista gratuita de diversos mirantes ao redor do Corcovado.",
  },
  {
    name: "Praia de Jericoacoara",
    city: "Jijoca de Jericoacoara",
    state: "CE",
    type: "Praia",
    icon: Waves,
    image: "https://images.unsplash.com/photo-1505142468610-359e7d316be0?q=80&w=600",
    description: "Uma das praias mais bonitas do mundo com dunas e lagoas.",
  },
  {
    name: "Pelourinho",
    city: "Salvador",
    state: "BA",
    type: "Centro Histórico",
    icon: Landmark,
    image: "https://images.unsplash.com/photo-1597487124413-82a4c4e8de1e?q=80&w=600",
    description: "Patrimônio UNESCO com arquitetura colonial e música ao vivo.",
  },
  {
    name: "Parque Nacional da Chapada dos Veadeiros",
    city: "Alto Paraíso",
    state: "GO",
    type: "Parque Nacional",
    icon: TreePine,
    image: "https://images.unsplash.com/photo-1433086966358-54859d0ed716?q=80&w=600",
    description: "Cachoeiras e trilhas no cerrado com entrada gratuita.",
  },
  {
    name: "Praia de Porto de Galinhas",
    city: "Ipojuca",
    state: "PE",
    type: "Praia",
    icon: Waves,
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=600",
    description: "Piscinas naturais cristalinas e recifes de coral.",
  },
  {
    name: "Museu do Amanhã",
    city: "Rio de Janeiro",
    state: "RJ",
    type: "Museu",
    icon: Landmark,
    image: "https://images.unsplash.com/photo-1555685812-4b943f1cb0eb?q=80&w=600",
    description: "Terças-feiras com entrada gratuita. Ciência e futuro.",
  },
  {
    name: "Mercado Ver-o-Peso",
    city: "Belém",
    state: "PA",
    type: "Mercado",
    icon: Ticket,
    image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=600",
    description: "O maior mercado a céu aberto da América Latina. Livre.",
  },
];

const typeColors: Record<string, string> = {
  "Parque": "bg-emerald-100 text-emerald-700",
  "Mirante": "bg-blue-100 text-blue-700",
  "Praia": "bg-cyan-100 text-cyan-700",
  "Centro Histórico": "bg-amber-100 text-amber-700",
  "Parque Nacional": "bg-green-100 text-green-700",
  "Museu": "bg-purple-100 text-purple-700",
  "Mercado": "bg-orange-100 text-orange-700",
};

export default function FreeAttractionsSection() {
  return (
    <section className="py-24 bg-slate-50 dark:bg-slate-800/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="inline-block px-4 py-1.5 rounded-full bg-emerald-50 text-emerald-600 text-sm font-bold mb-4"
          >
            💰 GRATUITO
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-bold tracking-tight text-slate-900 dark:text-white mb-4"
          >
            Lugares <span className="text-gradient">Gratuitos</span> para Visitar
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto"
          >
            Viajar pelo Brasil não precisa ser caro. Confira atrações incríveis sem gastar nada.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {attractions.map((att, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="group bg-white dark:bg-slate-900 rounded-2xl overflow-hidden shadow-md shadow-slate-200/50 border border-slate-100 hover:shadow-xl transition-all hover:-translate-y-1"
            >
              <div className="relative h-40 overflow-hidden">
                <div
                  className="absolute inset-0 bg-cover bg-center group-hover:scale-110 transition-transform duration-700"
                  style={{ backgroundImage: `url(${att.image})` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                
                {/* Type badge */}
                <div className="absolute top-2 left-2">
                  <span className={`${typeColors[att.type] || "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200"} px-2 py-0.5 rounded-full text-[10px] font-bold`}>
                    {att.type}
                  </span>
                </div>
                
                {/* Free badge */}
                <div className="absolute top-2 right-2">
                  <span className="bg-emerald-500 text-white px-2 py-0.5 rounded-full text-[10px] font-extrabold flex items-center gap-1">
                    <Star className="w-3 h-3" />
                    GRÁTIS
                  </span>
                </div>
              </div>
              
              <div className="p-4">
                <h3 className="font-bold text-slate-900 dark:text-white text-sm leading-snug mb-1 group-hover:text-emerald-600 transition-colors">
                  {att.name}
                </h3>
                <div className="flex items-center gap-1 text-xs text-slate-400 mb-2">
                  <MapPin className="w-3 h-3" />
                  {att.city}, {att.state}
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{att.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
