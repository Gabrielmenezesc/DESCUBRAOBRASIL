"use client";

import { motion } from "framer-motion";
import { Play, Maximize2 } from "lucide-react";
import { useState } from "react";

const portfolioVideos = [
  {
    thumbnail: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=1074&auto=format&fit=crop",
    title: "Campanha de Verão",
    category: "Edição de Vídeo"
  },
  {
    thumbnail: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=1170&auto=format&fit=crop",
    title: "Identidade Digital",
    category: "Social Media"
  },
  {
    thumbnail: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1115&auto=format&fit=crop",
    title: "Lançamento Imobiliário",
    category: "Ads & Reels"
  }
];

export default function PortfolioSection() {
  const [sliderPos, setSliderPos] = useState(50);

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSliderPos(Number(e.target.value));
  };

  return (
    <section className="py-24 relative overflow-hidden bg-slate-50 dark:bg-slate-800/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-6"
          >
            Portfólio de <span className="text-gradient">Impacto</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto"
          >
            Confira alguns de nossos trabalhos e a transformação que geramos para nossos parceiros.
          </motion.p>
        </div>

        {/* Video Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
          {portfolioVideos.map((video, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.2 }}
              className="relative aspect-video rounded-3xl overflow-hidden group cursor-pointer shadow-xl shadow-slate-200"
            >
              <div 
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110" 
                style={{ backgroundImage: `url(${video.thumbnail})` }}
              />
              <div className="absolute inset-0 bg-slate-900/40 group-hover:bg-slate-900/20 transition-colors" />
              
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 transform scale-0 group-hover:scale-100 transition-transform duration-500 hover:bg-emerald-500 hover:border-emerald-400 group-hover:glow-primary">
                  <Play className="w-8 h-8 text-white fill-current" />
                </div>
              </div>

              <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">{video.category}</span>
                <h3 className="text-xl font-bold text-white mt-1">{video.title}</h3>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Before/After SliderSection */}
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Transformação Real</h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-2">Arraste para ver o poder do nosso design.</p>
          </div>

          <div className="relative aspect-[16/9] rounded-3xl overflow-hidden shadow-2xl shadow-slate-300 border border-white">
            {/* After Image */}
            <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1170&auto=format&fit=crop')" }}>
              <div className="absolute bottom-6 right-6 bg-emerald-500 text-white text-xs font-bold px-4 py-1.5 rounded-full uppercase">Depois</div>
            </div>

            {/* Before Image (clipped) */}
            <div 
              className="absolute inset-0 bg-cover bg-center" 
              style={{ 
                backgroundImage: "url('https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=1170&auto=format&fit=crop')",
                clipPath: `inset(0 ${100 - sliderPos}% 0 0)` 
              }}
            >
              <div className="absolute bottom-6 left-6 bg-slate-800 text-white text-xs font-bold px-4 py-1.5 rounded-full uppercase">Antes</div>
            </div>

            {/* Slider Handle */}
            <input 
              type="range" 
              min="0" 
              max="100" 
              value={sliderPos} 
              onChange={handleSliderChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-20"
            />
            <div 
              className="absolute top-0 bottom-0 w-1 bg-white dark:bg-slate-900 shadow-lg pointer-events-none z-10"
              style={{ left: `${sliderPos}%` }}
            >
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white dark:bg-slate-900 flex items-center justify-center shadow-xl border border-slate-200">
                <div className="flex gap-1">
                  <div className="w-1 h-3 bg-slate-300 rounded-full" />
                  <div className="w-1 h-3 bg-slate-300 rounded-full" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
