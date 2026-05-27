"use client";

import { motion } from "framer-motion";
import { MessageCircle, Sparkles, ArrowRight, Compass, MapPin } from "lucide-react";

export default function FinalCTASection() {
  return (
    <section className="py-28 relative overflow-hidden bg-slate-950">
      {/* Dynamic Background Gradients */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[500px] h-[500px] bg-emerald-500/10 blur-[130px] rounded-full pointer-events-none animate-float" />
      <div className="absolute top-1/3 right-1/4 -translate-y-1/2 w-[450px] h-[450px] bg-blue-500/10 blur-[120px] rounded-full pointer-events-none" style={{ animationDelay: "2s" }} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="relative rounded-[2.5rem] p-8 md:p-20 text-center overflow-hidden border border-white/10 bg-slate-900/40 backdrop-blur-2xl shadow-2xl">
          {/* Glass background shimmer */}
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-blue-500/5 pointer-events-none" />
          
          {/* Internal Glow Circles */}
          <div className="absolute -top-32 -right-32 w-80 h-80 bg-emerald-500/20 blur-[100px] rounded-full pointer-events-none" />
          <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-blue-500/20 blur-[100px] rounded-full pointer-events-none" />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs md:text-sm font-bold mb-8 uppercase tracking-widest"
          >
            <Sparkles className="w-4 h-4 animate-pulse" />
            Sua Próxima Aventura Começa Aqui
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tight leading-tight"
          >
            Explore o <span className="text-gradient">Brasil</span> Inteiro
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15 }}
            className="text-lg md:text-2xl text-slate-300 mb-8 max-w-3xl mx-auto font-medium"
          >
            De praias paradisíacas a chapadas exuberantes — viva experiências inesquecíveis e gamificadas em cada canto do país.
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-sm md:text-base text-slate-400 max-w-2xl mx-auto mb-12 leading-relaxed"
          >
            Descubra destinos emblemáticos, acumule conquistas no seu passaporte de viajante, resolva missões locais com a IA Maya e desfrute do melhor do turismo nacional.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-5 justify-center items-center relative z-20"
          >
            <a 
              href="/turismo" 
              className="group flex items-center gap-2 bg-white text-slate-950 hover:bg-slate-50 px-10 py-5 rounded-full font-black text-lg shadow-xl hover:scale-105 active:scale-98 transition-all duration-300"
            >
              <Compass className="w-5 h-5 text-slate-900" />
              Explorar Destinos
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </a>
            
            <a 
              href="https://wa.me/5561995659907" 
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-slate-950 px-10 py-5 rounded-full font-black text-lg shadow-xl shadow-emerald-500/20 hover:scale-105 active:scale-98 transition-all duration-300"
            >
              <MessageCircle className="w-6 h-6 text-slate-950" />
              Falar com Humano
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
            className="mt-12 inline-flex items-center gap-2 text-emerald-400/60 text-xs md:text-sm font-bold uppercase tracking-wider"
          >
            <MapPin className="w-4 h-4 text-emerald-400" />
            27 estados • Milhares de cidades • Infinitas possibilidades
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 0.4 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6 }}
            className="mt-8 text-slate-600 text-xs font-semibold tracking-widest uppercase"
          >
            Descubra o Brasil &copy; {new Date().getFullYear()}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
