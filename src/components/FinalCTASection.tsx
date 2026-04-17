"use client";

import { motion } from "framer-motion";
import { MessageCircle, Sparkles, ArrowRight, Compass, MapPin } from "lucide-react";

export default function FinalCTASection() {
  return (
    <section className="py-24 relative overflow-hidden bg-white dark:bg-slate-900">
      {/* Decorative Blur */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="glass-card bg-slate-900 rounded-[3rem] p-8 md:p-20 text-center relative overflow-hidden shadow-2xl shadow-emerald-500/10 border border-slate-800">
          
          {/* Internal Glow */}
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-emerald-500/20 blur-[80px] rounded-full" />
          <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-blue-500/20 blur-[80px] rounded-full" />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-bold mb-8"
          >
            <Sparkles className="w-4 h-4" />
            Sua Próxima Aventura Começa Aqui
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-black text-white mb-4 tracking-tight"
          >
            Explore o <span className="text-emerald-400">Brasil</span> Inteiro
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15 }}
            className="text-xl md:text-2xl text-slate-300 mb-8"
          >
            De praias paradisíacas a chapadas incríveis — cada estado é uma aventura.
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-lg text-slate-400 max-w-2xl mx-auto mb-12 leading-relaxed"
          >
            Descubra destinos por estado, acompanhe notícias de turismo atualizadas, encontre lugares gratuitos e planeje sua viagem pelo <span className="text-white font-bold">Brasil</span> mais lindo que existe.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-6 justify-center items-center"
          >
            <a 
              href="/turismo" 
              className="group flex items-center gap-2 bg-white dark:bg-slate-900 text-slate-900 dark:text-white px-10 py-5 rounded-2xl font-black text-lg transition-all transform hover:scale-105 hover:shadow-2xl hover:shadow-white/20 shadow-xl"
            >
              <Compass className="w-5 h-5" />
              Explorar Destinos
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </a>
            
            <a 
              href="https://wa.me/5538991621135" 
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-2 bg-emerald-500 text-white px-10 py-5 rounded-2xl font-black text-lg transition-all transform hover:scale-105 hover:shadow-[0_0_30px_rgba(16,185,129,0.4)] shadow-xl shadow-emerald-500/20"
            >
              <MessageCircle className="w-6 h-6" />
              Tirar Dúvidas
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
            className="mt-8 inline-flex items-center gap-2 text-emerald-400/60 text-sm font-medium"
          >
            <MapPin className="w-4 h-4" />
            27 estados, milhares de cidades, infinitos destinos
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 0.4 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6 }}
            className="mt-8 text-slate-500 dark:text-slate-400 text-sm font-medium tracking-widest uppercase"
          >
            Descubra o Brasil &copy; {new Date().getFullYear()}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
