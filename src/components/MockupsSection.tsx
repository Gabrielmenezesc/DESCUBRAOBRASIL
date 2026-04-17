"use client";

import { motion } from "framer-motion";
import { Smartphone, Laptop, Globe } from "lucide-react";

export default function MockupsSection() {
  return (
    <section className="py-24 relative overflow-hidden bg-slate-900 text-white">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500 blur-[120px] rounded-full" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500 blur-[120px] rounded-full" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-bold mb-6"
          >
            <Globe className="w-4 h-4" />
            Performance em Qualquer Tela
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6"
          >
            Design <span className="text-emerald-400">Responsivo</span> de Elite
          </motion.h2>
          <p className="text-xl text-slate-400 max-w-3xl mx-auto">
            Garantimos que a sua presença digital seja impecável em computadores, tablets e smartphones.
          </p>
        </div>

        <div className="relative flex flex-col md:flex-row items-center justify-center gap-12 lg:gap-24 py-12">
          
          {/* Laptop Mockup */}
          <motion.div
            initial={{ opacity: 0, x: -50, rotateY: 10 }}
            whileInView={{ opacity: 1, x: 0, rotateY: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="relative w-full max-w-2xl px-4"
          >
            <div className="relative aspect-[16/10] bg-slate-800 rounded-t-2xl border-x-8 border-t-8 border-slate-700 shadow-2xl group overflow-hidden">
               <div className="absolute top-0 left-0 w-full h-full bg-[url('https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?q=80&w=1169&auto=format&fit=crop')] bg-cover bg-center transition-transform duration-1000 group-hover:scale-105" />
               <div className="absolute inset-0 bg-slate-900/20" />
            </div>
            <div className="h-4 bg-slate-700 w-[105%] -ml-[2.5%] rounded-b-xl shadow-lg" />
            <div className="h-1 bg-slate-600 w-24 mx-auto rounded-full mt-2" />
            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 text-slate-500 dark:text-slate-400 font-mono text-xs uppercase tracking-widest">
              <Laptop className="w-4 h-4" />
              Desktop Professional
            </div>
          </motion.div>

          {/* Smartphone Mockup */}
          <motion.div
            initial={{ opacity: 0, x: 50, scale: 0.9 }}
            whileInView={{ opacity: 1, x: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative w-full max-w-[280px] z-20"
          >
            <div className="relative aspect-[9/19] bg-slate-900 rounded-[3rem] border-[10px] border-slate-800 shadow-2xl p-2 group overflow-hidden">
               <div className="absolute inset-0 m-2 rounded-[2.5rem] bg-[url('https://images.unsplash.com/photo-1547658719-da2b51169166?q=80&w=1064&auto=format&fit=crop')] bg-cover bg-center transition-transform duration-700 group-hover:scale-110" />
               {/* Phone Notch */}
               <div className="absolute top-6 left-1/2 -translate-x-1/2 w-20 h-5 bg-slate-800 rounded-full z-10" />
            </div>
            <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2 text-slate-500 dark:text-slate-400 font-mono text-xs uppercase tracking-widest">
              <Smartphone className="w-4 h-4" />
              Mobile Experience
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
