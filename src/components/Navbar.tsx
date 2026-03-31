"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, Globe, CloudSun, Clock } from "lucide-react";
import { useWeather } from "@/hooks/useWeather";

const navLinks = [
  { href: "/", label: "Início" },
  { href: "/noticias", label: "Notícias" },
  { href: "/turismo", label: "Turismo" },
  { href: "/quem-somos", label: "Quem Somos" },
  { href: "/contato", label: "Contato" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { weather, loading } = useWeather();

  // ── Brasília live clock ──────────────────────────────────
  const [clock, setClock] = useState("");
  useEffect(() => {
    const tick = () => {
      const now = new Date();
      // Brasília is UTC-3 always
      const bsb = new Date(now.toLocaleString("en-US", { timeZone: "America/Sao_Paulo" }));
      const h = bsb.getHours().toString().padStart(2, "0");
      const m = bsb.getMinutes().toString().padStart(2, "0");
      const s = bsb.getSeconds().toString().padStart(2, "0");
      setClock(`${h}:${m}:${s}`);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-200/60 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group hover:scale-105 transition-transform">
            <img 
              src="/DESCUBRAOBRASIL/logo-descubra.png" 
              alt="Descubra o Brasil" 
              className="h-10 w-auto object-contain"
            />
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-4 py-2 rounded-full text-sm font-semibold text-slate-600 hover:text-emerald-600 hover:bg-emerald-50 transition-all"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Weather + Clock Badges */}
          <div className="flex items-center gap-3">
            {/* Weather Badge */}
            {!loading && weather && (
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-blue-50 to-emerald-50 border border-blue-100 text-sm">
                <span className="text-lg">{weather.icon}</span>
                <span className="font-bold text-slate-800">{weather.temperature}°C</span>
                <span className="text-slate-500 text-xs max-w-[80px] truncate">{weather.city}</span>
              </div>
            )}
            {loading && (
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100/60 border border-slate-200/50 text-sm">
                <div className="w-4 h-4 rounded-full bg-slate-200 animate-pulse" />
                <div className="w-12 h-3 rounded bg-slate-200 animate-pulse" />
              </div>
            )}
            {/* Brasília Clock Badge */}
            {clock && (
              <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-50 border border-slate-200 text-sm">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span className="font-mono font-bold text-slate-700 text-xs">{clock}</span>
                <span className="text-slate-400 text-xs">BSB</span>
              </div>
            )}

            {/* Mobile hamburger */}
            <button
              onClick={() => setOpen(!open)}
              className="md:hidden p-2 rounded-lg hover:bg-slate-100 transition-colors"
              aria-label="Menu"
            >
              {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden bg-white/95 backdrop-blur-xl border-t border-slate-200 shadow-lg">
          <div className="px-4 py-4 space-y-1">
            {/* Mobile Weather */}
            {weather && (
              <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-blue-50 to-emerald-50 mb-3">
                <span className="text-2xl">{weather.icon}</span>
                <div>
                  <p className="font-bold text-slate-800">{weather.temperature}°C — {weather.description}</p>
                  <p className="text-xs text-slate-500">{weather.city}</p>
                </div>
              </div>
            )}
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="block px-4 py-3 rounded-xl text-sm font-semibold text-slate-700 hover:text-emerald-600 hover:bg-emerald-50 transition-all"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
