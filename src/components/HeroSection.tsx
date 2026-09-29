"use client";

import { useState, useEffect } from "react";
import { Sparkles, MapPin, Compass, Search, Globe as GlobeIcon, Camera, ChevronRight, Navigation } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Globe from "./Globe";

const SLIDES = [
  {
    city: "Rio de Janeiro",
    state: "RJ",
    image: "https://images.unsplash.com/photo-1483729558449-99ef09a8c325?q=80&w=2070",
    description: "Cartão-postal do Brasil, abençoado pelo Cristo Redentor e banhado por praias icônicas.",
    tag: "Cultura & Praia"
  },
  {
    city: "Amazônia",
    state: "AM",
    image: "https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?q=80&w=2072",
    description: "A maior biodiversidade do planeta, rios majestosos e uma conexão mística com a natureza.",
    tag: "Ecoturismo"
  },
  {
    city: "Lençóis Maranhenses",
    state: "MA",
    image: "https://images.unsplash.com/photo-1568213816046-0ee1c42bd559?q=80&w=2072",
    description: "Um deserto de dunas brancas e lagoas de água doce azul-turquesa esculpidas pelo vento.",
    tag: "Aventura"
  },
  {
    city: "Salvador",
    state: "BA",
    image: "https://images.unsplash.com/photo-1549918864-48ac978761a4?q=80&w=2070",
    description: "História viva, ladeiras coloridas do Pelourinho, axé, fé e o sabor incomparável da Bahia.",
    tag: "História & Cultura"
  },
  {
    city: "Bonito",
    state: "MS",
    image: "https://images.unsplash.com/photo-1541355422896-bc98b7e2311b?q=80&w=2070",
    description: "Flutuação em rios transparentes repletos de peixes e grutas com lagos azuis surreais.",
    tag: "Ecoturismo"
  }
];

export default function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showGlobe, setShowGlobe] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (showGlobe) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
    }, 8000);
    return () => clearInterval(interval);
  }, [showGlobe]);

  return (
    <section className="relative min-h-[92vh] md:min-h-screen flex items-center justify-center overflow-hidden bg-slate-950">
      {/* Cinematic Slideshow Background */}
      <div className="absolute inset-0 z-0">
        <AnimatePresence mode="wait">
          {!showGlobe ? (
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, scale: 1.08 }}
              animate={{ opacity: 1, scale: 1.02 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${SLIDES[currentSlide].image})` }}
            />
          ) : (
            <motion.div
              key="globe-bg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.2 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-gradient-to-br from-emerald-950/40 via-slate-950 to-blue-950/40"
            />
          )}
        </AnimatePresence>
        
        {/* Dark Overlays for legibility */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/80 via-slate-900/60 to-slate-950 z-0" />
        
        {/* 3D Interactive Globe Overlay */}
        <AnimatePresence>
          {showGlobe && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.8 }}
              className="absolute inset-0 z-10"
            >
              <Globe />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Content wrapper */}
      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-24 pb-12 flex flex-col items-center justify-between min-h-[92vh] md:min-h-screen">
        <div className="flex-1 flex flex-col items-center justify-center max-w-4xl w-full">
          {/* Tagline Badge */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 backdrop-blur-md shadow-sm mb-6"
          >
            <Sparkles className="w-4 h-4 text-emerald-400 animate-pulse" />
            <span className="text-xs md:text-sm font-bold text-emerald-300 tracking-wider uppercase">
              Turismo Gamificado & Inteligente do Brasil
            </span>
          </motion.div>

          {/* Heading */}
          <h1 className="text-4xl md:text-7xl font-extrabold tracking-tight text-white leading-[1.1] mb-6 select-none">
            {!showGlobe ? (
              <>
                Descubra o Melhor <br />
                <span className="text-gradient">do Brasil</span>
              </>
            ) : (
              <>
                Explore o Brasil <br />
                <span className="text-gradient">Em Três Dimensões</span>
              </>
            )}
          </h1>

          {/* Subtitle / Description */}
          <div className="h-20 mb-8 max-w-2xl">
            <AnimatePresence mode="wait">
              {!showGlobe ? (
                <motion.p
                  key={currentSlide}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.6 }}
                  className="text-base md:text-xl text-slate-200 font-medium leading-relaxed"
                >
                  {SLIDES[currentSlide].description}
                </motion.p>
              ) : (
                <motion.p
                  key="globe-desc"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  className="text-base md:text-xl text-slate-200 font-medium leading-relaxed"
                >
                  Gire o globo 3D interativo e clique nas marcações para desvendar roteiros fascinantes criados por nossa Inteligência Artificial.
                </motion.p>
              )}
            </AnimatePresence>
          </div>

          {/* Interactive Unified Search Bar */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="w-full max-w-2xl mb-8"
          >
            <div className="glass flex items-center p-1.5 rounded-2xl md:rounded-full shadow-2xl border border-white/10 bg-slate-950/40 backdrop-blur-xl">
              <Search className="w-6 h-6 text-slate-400 ml-4 hidden sm:block" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar cidade, estado, cachoeira ou museu..."
                className="w-full bg-transparent border-none outline-none px-4 py-3.5 text-white placeholder-slate-400 font-semibold text-base md:text-lg"
              />
              <button className="bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 hover:text-slate-900 px-6 py-3.5 rounded-xl md:rounded-full font-bold shadow-lg shadow-emerald-500/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-2">
                <span>Buscar</span>
              </button>
            </div>
          </motion.div>

          {/* CTA Actions Button Bar */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex flex-wrap gap-4 justify-center items-center w-full"
          >
            <a
              href="#turismo"
              className="flex items-center gap-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-slate-950 px-8 py-4 rounded-full font-black text-lg transition-all shadow-xl shadow-emerald-500/20 hover:scale-105 hover:shadow-2xl active:scale-98"
            >
              <Compass className="w-5 h-5" />
              Explorar Destinos
            </a>

            <button
              onClick={() => setShowGlobe(!showGlobe)}
              className="flex items-center gap-2.5 bg-white/10 hover:bg-white/15 border border-white/20 text-white px-8 py-4 rounded-full font-bold text-lg transition-all backdrop-blur-md hover:scale-105 active:scale-98"
            >
              {showGlobe ? (
                <>
                  <Camera className="w-5 h-5 text-emerald-400" />
                  <span>Ver Fotos</span>
                </>
              ) : (
                <>
                  <GlobeIcon className="w-5 h-5 text-emerald-400 animate-spin-slow" />
                  <span>Mapa 3D Interativo</span>
                </>
              )}
            </button>

            <button
              onClick={() => document.getElementById("maya-chat-button")?.click()}
              className="flex items-center gap-2.5 bg-slate-900 hover:bg-slate-800 text-emerald-400 hover:text-emerald-300 border border-slate-800 px-8 py-4 rounded-full font-black text-lg transition-all hover:scale-105 active:scale-98 shadow-xl"
            >
              Falar com Maya
              <Sparkles className="w-5 h-5 animate-pulse" />
            </button>
          </motion.div>
        </div>

        {/* Cinematic Bottom Bar / Active Destination details */}
        <div className="w-full flex flex-col md:flex-row justify-between items-center gap-6 mt-12 border-t border-white/5 pt-8">
          {/* Active slide details */}
          {!showGlobe ? (
            <div className="flex items-center gap-4 text-left">
              <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white">
                <Navigation className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <span className="text-xs font-black text-emerald-400 uppercase tracking-widest block">
                  {SLIDES[currentSlide].tag}
                </span>
                <span className="text-lg font-bold text-white">
                  {SLIDES[currentSlide].city}, {SLIDES[currentSlide].state}
                </span>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-4 text-left">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                <GlobeIcon className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <span className="text-xs font-black text-emerald-400 uppercase tracking-widest block">
                  Modo Imersivo
                </span>
                <span className="text-lg font-bold text-white">
                  Navegação Global
                </span>
              </div>
            </div>
          )}

          {/* Quick stats / Features */}
          <div className="flex items-center gap-6 md:gap-8 flex-wrap justify-center">
            <div className="text-center md:text-left">
              <span className="block text-2xl font-black text-white">27</span>
              <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider">Estados</span>
            </div>
            <div className="w-px h-8 bg-white/10 hidden sm:block" />
            <div className="text-center md:text-left">
              <span className="block text-2xl font-black text-white">5</span>
              <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider">Regiões</span>
            </div>
            <div className="w-px h-8 bg-white/10 hidden sm:block" />
            <div className="text-center md:text-left">
              <span className="block text-2xl font-black text-emerald-400">100%</span>
              <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider">Gamificado</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

