"use client";

import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
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
