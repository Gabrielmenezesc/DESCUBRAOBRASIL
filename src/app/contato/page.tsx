"use client";

import Navbar from "@/components/Navbar";
import FooterSection from "@/components/FooterSection";
import MayaChat from "@/components/MayaChat";
import LGPDBanner from "@/components/LGPDBanner";
import { motion } from "framer-motion";
import { Send, MessageCircle, Mail, Phone, MapPin } from "lucide-react";
import { useState } from "react";

export default function ContatoPage() {
  const [sent, setSent] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // Simulate form submission
    setSent(true);
    setTimeout(() => setSent(false), 3000);
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      <Navbar />

      <section className="pt-28 pb-16 bg-gradient-to-b from-amber-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="inline-block px-4 py-1.5 rounded-full bg-amber-100 text-amber-700 text-sm font-bold mb-4"
          >
            CONTATO
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-extrabold text-slate-900 tracking-tight mb-4"
          >
            Fale <span className="text-gradient">Conosco</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-slate-600 max-w-2xl mx-auto"
          >
            Estamos prontos para tirar suas dúvidas sobre destinos, roteiros e parcerias turísticas no Brasil.
          </motion.p>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Form */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="bg-white rounded-2xl p-8 shadow-xl border border-slate-100">
                <h2 className="text-2xl font-bold text-slate-900 mb-6">Envie uma Mensagem</h2>
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Nome</label>
                    <input
                      type="text"
                      required
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all bg-slate-50"
                      placeholder="Seu nome completo"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Email</label>
                    <input
                      type="email"
                      required
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all bg-slate-50"
                      placeholder="seuemail@exemplo.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Mensagem</label>
                    <textarea
                      required
                      rows={5}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all bg-slate-50 resize-none"
                      placeholder="Como podemos ajudar?"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-emerald-400 text-white py-4 rounded-xl font-bold text-lg hover:shadow-lg hover:shadow-emerald-500/30 transition-all"
                  >
                    {sent ? (
                      <>✓ Mensagem Enviada!</>
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        Enviar Mensagem
                      </>
                    )}
                  </button>
                </form>
              </div>
            </motion.div>

            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              {/* WhatsApp CTA */}
              <a
                href="https://wa.me/5538991621135?text=Olá!%20Gostaria%20de%20saber%20mais%20sobre%20os%20serviços%20do%20Descubra%20o%20Brasil."
                target="_blank"
                rel="noopener noreferrer"
                className="block bg-green-50 border border-green-200 rounded-2xl p-6 hover:bg-green-100 hover:shadow-lg transition-all group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-green-500 flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg shadow-green-500/30">
                    <MessageCircle className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-lg">WhatsApp Direto</h3>
                    <p className="text-green-600 font-medium">+55 38 99162-1135</p>
                    <p className="text-slate-500 text-sm">Resposta rápida • Atendimento personalizado</p>
                  </div>
                </div>
              </a>

              {/* Contact Cards */}
              <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm space-y-5">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                    <Mail className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">E-mail</h4>
                    <a href="mailto:contato@descubraobrasil.com" className="text-slate-600 text-sm hover:text-emerald-600 transition-colors">
                      contato@descubraobrasil.com
                    </a>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center">
                    <Phone className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">Telefone</h4>
                    <p className="text-slate-600 text-sm">+55 38 99162-1135</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-amber-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">Localização</h4>
                    <p className="text-slate-600 text-sm">Brasil, 100% Digital</p>
                  </div>
                </div>
              </div>

              {/* Social Links */}
              <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
                <h3 className="font-bold text-slate-900 mb-4">Redes Sociais</h3>
                <div className="flex gap-3">
                  <a href="#" className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center text-white hover:scale-110 transition-transform shadow-lg shadow-pink-500/20">
                    📸
                  </a>
                  <a href="#" className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white hover:scale-110 transition-transform shadow-lg shadow-blue-500/20">
                    📘
                  </a>
                  <a href="#" className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center text-white hover:scale-110 transition-transform shadow-lg shadow-red-500/20">
                    ▶️
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>


      <FooterSection />
      <MayaChat />
      <LGPDBanner />
    </main>
  );
}
