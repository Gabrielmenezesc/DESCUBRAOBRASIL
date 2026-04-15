"use client";

import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import NewsSection from "@/components/NewsSection";
import TourismSection from "@/components/TourismSection";
import CultureSection from "@/components/CultureSection";
import FreeAttractionsSection from "@/components/FreeAttractionsSection";
import FinalCTASection from "@/components/FinalCTASection";
import FooterSection from "@/components/FooterSection";
import MayaChat from "@/components/MayaChat";
import LGPDBanner from "@/components/LGPDBanner";
import ThemeScrollSpy from "@/components/ThemeScrollSpy";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground scroll-smooth transition-colors duration-700">
      <ThemeScrollSpy />
      <Navbar />
      <HeroSection />

      {/* News Summary */}
      <section id="noticias" className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
            <div>
              <span className="inline-block px-4 py-1.5 rounded-full bg-blue-50 text-blue-600 text-sm font-bold mb-4">
                📰 NOTÍCIAS AO VIVO
              </span>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900">
                Turismo em <span className="text-gradient">Destaque</span>
              </h2>
              <p className="text-slate-500 mt-2 text-sm">Atualizado automaticamente a cada 30 minutos</p>
            </div>
            <Link
              href="/noticias"
              className="flex items-center gap-2 text-emerald-600 font-bold hover:text-emerald-500 transition-colors"
            >
              Ver todas por estado
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <NewsSection limit={6} />
        </div>
      </section>

      {/* Tourism Destinations */}
      <div id="turismo">
        <TourismSection />
      </div>

      {/* Culture by Region */}
      <CultureSection />

      {/* Visual transition */}
      <div className="h-2 bg-gradient-to-r from-emerald-500 via-blue-500 to-indigo-600" />

      {/* Free Attractions */}
      <FreeAttractionsSection />

      {/* Final CTA */}
      <FinalCTASection />

      <FooterSection />
      <MayaChat />
      <LGPDBanner />
    </main>
  );
}
