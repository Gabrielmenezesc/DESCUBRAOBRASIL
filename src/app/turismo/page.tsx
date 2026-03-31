"use client";

import Navbar from "@/components/Navbar";
import TourismSection from "@/components/TourismSection";
import FooterSection from "@/components/FooterSection";
import MayaChat from "@/components/MayaChat";
import LGPDBanner from "@/components/LGPDBanner";
import { motion } from "framer-motion";
import { MapPin, Smartphone } from "lucide-react";

const extraDestinations = [
  {
    city: "Salvador",
    state: "BA",
    image: "https://images.unsplash.com/photo-1597487124413-82a4c4e8de1e?q=80&w=600",
    description: "Pelourinho, axé music e culinária baiana inesquecível.",
  },
  {
    city: "Gramado",
    state: "RS",
    image: "https://images.unsplash.com/photo-1580688877612-61c87a3e24b7?q=80&w=600",
    description: "Charme europeu, chocolates e festivais de cinema.",
  },
  {
    city: "Fernando de Noronha",
    state: "PE",
    image: "https://images.unsplash.com/photo-1589802829985-817e51171b92?q=80&w=600",
    description: "Praias paradisíacas e mergulho em águas cristalinas.",
  },
  {
    city: "Manaus",
    state: "AM",
    image: "https://images.unsplash.com/photo-1618953822098-e6614c1d2e94?q=80&w=600",
    description: "Portal para a Amazônia e o encontro das águas.",
  },
  {
    city: "Florianópolis",
    state: "SC",
    image: "https://images.unsplash.com/photo-1594736797933-d0501ba2fe65?q=80&w=600",
    description: "Ilha da Magia com praias e lagoas deslumbrantes.",
  },
  {
    city: "Chapada dos Veadeiros",
    state: "GO",
    image: "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?q=80&w=600",
    description: "Cachoeiras, trilhas e a energia do cerrado goiano.",
  },
];

export default function TurismoPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <Navbar />

      <section className="pt-28 pb-16 bg-gradient-to-b from-emerald-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="inline-block px-4 py-1.5 rounded-full bg-emerald-100 text-emerald-700 text-sm font-bold mb-4"
          >
            TURISMO
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-extrabold text-slate-900 tracking-tight mb-4"
          >
            Destinos <span className="text-gradient">Incríveis</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-slate-600 max-w-2xl mx-auto mb-8"
          >
            Explore os melhores destinos do Brasil. Para uma experiência completa com roteiros, mapas e Maya AI, abra nosso app.
          </motion.p>
          <motion.a
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            href="/DESCUBRAOBRASIL/app/index.html"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-emerald-400 text-white px-8 py-4 rounded-full font-bold text-lg hover:shadow-[0_0_20px_rgba(16,185,129,0.5)] transition-shadow"
          >
            <Smartphone className="w-5 h-5" />
            Explorar no App
          </motion.a>
        </div>
      </section>

      <TourismSection />

      {/* Extra Destinations */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-12 text-center">
            Mais Destinos para <span className="text-gradient">Descobrir</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {extraDestinations.map((dest, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group relative h-[320px] rounded-2xl overflow-hidden shadow-lg"
              >
                <div
                  className="absolute inset-0 bg-cover bg-center group-hover:scale-110 transition-transform duration-700"
                  style={{ backgroundImage: `url(${dest.image})` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/30 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <div className="flex items-center gap-2 mb-2">
                    <MapPin className="w-4 h-4 text-emerald-400" />
                    <span className="text-emerald-200 text-sm font-medium">{dest.state}</span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-1">{dest.city}</h3>
                  <p className="text-slate-300 text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {dest.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <FooterSection />
      <MayaChat />
      <LGPDBanner />
    </main>
  );
}
