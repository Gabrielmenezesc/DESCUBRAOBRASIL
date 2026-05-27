"use client";

import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import NewsSection from "@/components/NewsSection";
import TourismSection from "@/components/TourismSection";
import CultureSection from "@/components/CultureSection";
import FreeAttractionsSection from "@/components/FreeAttractionsSection";
import MockupAppSection from "@/components/MockupAppSection";
import FinalCTASection from "@/components/FinalCTASection";
import FooterSection from "@/components/FooterSection";
import MayaChat from "@/components/MayaChat";
import LGPDBanner from "@/components/LGPDBanner";
import ThemeScrollSpy from "@/components/ThemeScrollSpy";
import StatsSection from "@/components/StatsSection";
import ScrollReveal from "@/components/ScrollReveal";
import MapExplorerSection from "@/components/MapExplorerSection";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground scroll-smooth transition-colors duration-700">
      <ThemeScrollSpy />
      <Navbar />
      <HeroSection />

      {/* News Summary */}
      <section id="noticias" className="py-24 bg-slate-50 dark:bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal direction="up" className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
            <div>
              <span className="inline-block px-4 py-1.5 rounded-full bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 text-sm font-bold mb-4 uppercase tracking-wider">
                📰 NOTÍCIAS AO VIVO
              </span>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900 dark:text-white">
                Turismo em <span className="text-gradient">Destaque</span>
              </h2>
              <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm">Atualizado automaticamente a cada 30 minutos</p>
            </div>
            <Link
              href="/noticias"
              className="flex items-center gap-2 text-emerald-600 font-bold hover:text-emerald-500 transition-colors"
            >
              Ver todas por estado
              <ArrowRight className="w-4 h-4" />
            </Link>
          </ScrollReveal>
          
          <ScrollReveal direction="up" delay={0.1}>
            <NewsSection limit={6} />
          </ScrollReveal>
        </div>
      </section>

      {/* Animated Counter Stats Section */}
      <StatsSection />

      {/* Tourism Destinations */}
      <div id="turismo">
        <ScrollReveal direction="up">
          <TourismSection />
        </ScrollReveal>
      </div>

      {/* Map Explorer Section */}
      <ScrollReveal direction="up">
        <MapExplorerSection />
      </ScrollReveal>

      {/* Interactive Hub */}
      <ScrollReveal direction="up">
        <MockupAppSection />
      </ScrollReveal>

      {/* Culture by Region */}
      <ScrollReveal direction="up">
        <CultureSection />
      </ScrollReveal>

      {/* Visual transition */}
      <div className="h-2 bg-gradient-to-r from-emerald-500 via-blue-500 to-indigo-600" />

      {/* Free Attractions */}
      <ScrollReveal direction="up">
        <FreeAttractionsSection />
      </ScrollReveal>

      {/* Final CTA */}
      <ScrollReveal direction="up">
        <FinalCTASection />
      </ScrollReveal>

      <FooterSection />
      <MayaChat />
      <LGPDBanner />
    </main>
  );
}
