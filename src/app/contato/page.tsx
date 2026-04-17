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
            className="text-4xl md:text-6xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-4"
          >
            Fale <span className="text-gradient">Conosco</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto"
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
              <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 shadow-xl border border-slate-100">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Envie uma Mensagem</h2>
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-1.5">Nome</label>
                    <input
                      type="text"
                      required
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all bg-slate-50 dark:bg-slate-800/50"
                      placeholder="Seu nome completo"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-1.5">Email</label>
                    <input
                      type="email"
                      required
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all bg-slate-50 dark:bg-slate-800/50"
                      placeholder="seuemail@exemplo.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-1.5">Mensagem</label>
                    <textarea
                      required
                      rows={5}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all bg-slate-50 dark:bg-slate-800/50 resize-none"
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
                    <h3 className="font-bold text-slate-900 dark:text-white text-lg">WhatsApp Direto</h3>
                    <p className="text-green-600 font-medium">+55 38 99162-1135</p>
                    <p className="text-slate-500 dark:text-slate-400 text-sm">Resposta rápida • Atendimento personalizado</p>
                  </div>
                </div>
              </a>

              {/* Contact Cards */}
              <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-100 shadow-sm space-y-5">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                    <Mail className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white text-sm">E-mail</h4>
                    <a href="mailto:contato@descubraobrasil.com" className="text-slate-600 dark:text-slate-300 text-sm hover:text-emerald-600 transition-colors">
                      contato@descubraobrasil.com
                    </a>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center">
                    <Phone className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white text-sm">Telefone</h4>
                    <p className="text-slate-600 dark:text-slate-300 text-sm">+55 38 99162-1135</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-amber-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white text-sm">Localização</h4>
                    <p className="text-slate-600 dark:text-slate-300 text-sm">Brasil, 100% Digital</p>
                  </div>
                </div>
              </div>

              {/* Social Links */}
              <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-100 shadow-sm">
                <h3 className="font-bold text-slate-900 dark:text-white mb-4">Redes Sociais</h3>
                <div className="flex gap-3">
                  <a href="https://instagram.com/descubraobrasiloficial" className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center text-white dark:text-slate-900 hover:scale-110 transition-transform shadow-lg shadow-pink-500/20">
                    <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                  </a>
                  <a href="#" className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white dark:text-slate-900 hover:scale-110 transition-transform shadow-lg shadow-blue-500/20">
                    <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
                  </a>
                  <a href="#" className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center text-white dark:text-slate-900 hover:scale-110 transition-transform shadow-lg shadow-red-500/20">
                    <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon></svg>
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
