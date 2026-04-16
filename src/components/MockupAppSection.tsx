"use client";

import { motion } from "framer-motion";
import { Download, Compass } from "lucide-react";

import { usePWA } from "@/context/PWAProvider";

export default function MockupAppSection() {
  const { showInstallPrompt } = usePWA();

  return (
    <section id="app" className="py-24 relative overflow-hidden bg-white">
      <div className="absolute inset-0 bg-blue-50/50 -z-10" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* Content */}
          <div className="order-2 lg:order-1">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-6 text-slate-900">
                Experiência <span className="text-gradient">Interativa</span> <br />
                no seu Dispositivo
              </h2>
              <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                Navegue no nosso portal totalmente funcional ao lado. Experimente a inteligência da Maya AI, mapas interativos e roteiros personalizados sem precisar sair desta página.
              </p>

              <div className="space-y-4 mb-10">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center">
                    <Compass className="w-4 h-4 text-emerald-600" />
                  </div>
                  <span className="text-slate-800 font-medium">Turismo com navegação intuitiva em tempo real</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center">
                    <Compass className="w-4 h-4 text-emerald-600" />
                  </div>
                  <span className="text-slate-800 font-medium">Test-drive da Maya AI para dicas de roteiros</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center">
                    <Compass className="w-4 h-4 text-emerald-600" />
                  </div>
                  <span className="text-slate-800 font-medium">Mapas dinâmicos e destinos por estado</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <button 
                  onClick={showInstallPrompt}
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-primary to-emerald-400 text-white px-8 py-4 rounded-full font-bold text-lg hover:shadow-[0_0_20px_rgba(16,185,129,0.5)] transition-shadow"
                >
                  <Download className="w-5 h-5" />
                  Baixar App Agora
                </button>
                <a 
                  href="/app/index.html" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="inline-flex items-center gap-2 border-2 border-slate-200 text-slate-700 px-8 py-4 rounded-full font-bold text-lg hover:bg-slate-50 transition-colors"
                >
                  Abrir no Navegador
                </a>
              </div>
            </motion.div>
          </div>

          {/* 3D Phone Mockup Simulation with Real Iframe */}
          <div className="order-1 lg:order-2 flex justify-center perspective-1000">
            <motion.div
              initial={{ opacity: 0, rotateY: 30, scale: 0.9 }}
              whileInView={{ opacity: 1, rotateY: -10, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1, type: "spring", bounce: 0.4 }}
              animate={{ y: [0, -10, 0] }}
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-ignore
              transition={{ y: { repeat: Infinity, duration: 4, ease: "easeInOut" } }}
              className="relative w-[340px] h-[680px] rounded-[3.5rem] border-[12px] border-slate-100/80 bg-white shadow-2xl overflow-hidden glass-card ring-1 ring-slate-200"
            >
              {/* Fake notch */}
              <div className="absolute top-0 inset-x-0 h-6 flex justify-center z-20">
                <div className="w-36 h-full bg-slate-100/80 rounded-b-xl border-x border-b border-slate-200" />
              </div>
              
              {/* Inside screen - LIVE EMBEDDED APP */}
              <div className="relative w-full h-full bg-white flex flex-col pt-6 pointer-events-auto">
              {/* Functional App Iframe */}
            <iframe 
              src="/app/index.html" 
              className="w-full h-full border-none"
              title="Descubra o Brasil App Demo"
              loading="lazy"
                 />
              </div>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}
