"use client";

import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import CollaboratorsSection from "@/components/CollaboratorsSection";
import PartnersSection from "@/components/PartnersSection";
import NewsSection from "@/components/NewsSection";
import TourismSection from "@/components/TourismSection";
import HowItWorksSection from "@/components/HowItWorksSection";
import MockupAppSection from "@/components/MockupAppSection";
import FinalCTASection from "@/components/FinalCTASection";
import FooterSection from "@/components/FooterSection";
import MayaChat from "@/components/MayaChat";
import LGPDBanner from "@/components/LGPDBanner";
import ThemeScrollSpy from "@/components/ThemeScrollSpy";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Megaphone } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground scroll-smooth transition-colors duration-700">
      <ThemeScrollSpy />
      <Navbar />
      <HeroSection />


      {/* Collaborators */}
      <CollaboratorsSection />

      {/* Business Partners */}
      <PartnersSection />

      {/* News Summary */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
            <div>
              <span className="inline-block px-4 py-1.5 rounded-full bg-blue-50 text-blue-600 text-sm font-bold mb-4">
                NOTÍCIAS
              </span>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900">
                Brasil em <span className="text-gradient">Destaque</span>
              </h2>
            </div>
            <Link
              href="/noticias"
              className="flex items-center gap-2 text-emerald-600 font-bold hover:text-emerald-500 transition-colors"
            >
              Ver todas
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <NewsSection limit={3} />
        </div>
      </section>

      {/* Tourism Summary */}
      <div id="turismo">
        <TourismSection />
      </div>

      {/* ── Visual transition: Turismo → Parcerias ── */}
      <div className="h-2 bg-gradient-to-r from-emerald-500 via-blue-500 to-indigo-600" />

      {/* Services Summary — Anuncie */}
      <section id="servicos-anuncie" className="py-24 bg-gradient-to-b from-slate-900 to-slate-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/20 text-blue-300 text-sm font-bold mb-4">
            <Megaphone className="w-4 h-4" />
            ANUNCIE NO DESCUBRA O BRASIL
          </span>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-white mb-6">
            Quer destacar seu destino turístico, hotel ou restaurante?
          </h2>
          <p className="text-slate-300 max-w-2xl mx-auto mb-10 text-lg">
            A gestão de publicidade, marketing e parcerias comerciais do aplicativo e site é realizada com exclusividade pela <strong className="text-emerald-400">Rede Brasília News</strong>. 
            Conecte-se com milhares de viajantes agora mesmo.
          </p>
          <a
            href="https://wa.me/5538991621135?text=Ol%C3%A1!%20Gostaria%20de%20anunciar%20meu%20neg%C3%B3cio%20no%20Descubra%20o%20Brasil%20atrav%C3%A9s%20da%20Rede%20Bras%C3%ADlia%20News."
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-emerald-400 text-white px-8 py-4 rounded-full font-bold text-lg hover:shadow-[0_0_30px_rgba(16,185,129,0.5)] hover:scale-105 transition-all"
          >
            Falar com Comercial
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </a>
        </div>
      </section>

      {/* How It Works */}
      <HowItWorksSection />

      {/* Interactive App Demo */}
      <MockupAppSection />

      {/* Final CTA */}
      <FinalCTASection />

      <FooterSection />
      <MayaChat />
      <LGPDBanner />
    </main>
  );
}
