"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { Compass, MapPin, Sparkles, Navigation, ChevronRight } from "lucide-react";
import { visitState } from "@/lib/gamification";
import Link from "next/link";

// Lazy load Leaflet Map component to avoid Next.js SSR build errors
const MapContainer = dynamic(
  () => import("./MapExplorerComponent"),
  { ssr: false, loading: () => <MapFallback /> }
);

function MapFallback() {
  return (
    <div className="w-full h-[550px] rounded-3xl bg-slate-900/50 flex flex-col items-center justify-center border border-white/5 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-950/20 via-slate-950 to-indigo-950/20 pointer-events-none" />
      <Compass className="w-12 h-12 text-slate-700 animate-spin-slow mb-4" />
      <span className="text-slate-400 font-bold">Carregando Mapa Interativo do Brasil...</span>
      <span className="text-xs text-slate-500 mt-1">Carregando componentes cartográficos</span>
    </div>
  );
}

export interface StatePin {
  code: string;
  name: string;
  capital: string;
  region: string;
  lat: number;
  lng: number;
  slug: string;
  description: string;
}

export const STATE_PINS: StatePin[] = [
  { code: "RJ", name: "Rio de Janeiro", capital: "Rio de Janeiro", region: "Sudeste", lat: -22.906, lng: -43.178, slug: "rj", description: "Cristo Redentor, Pão de Açúcar, praias de Copacabana e Ipanema." },
  { code: "BA", name: "Bahia", capital: "Salvador", region: "Nordeste", lat: -12.971, lng: -38.510, slug: "ba", description: "Pelourinho, capoeira, acarajé e a bela Chapada Diamantina." },
  { code: "AM", name: "Amazonas", capital: "Manaus", region: "Norte", lat: -3.119, lng: -60.021, slug: "am", description: "Encontro das Águas, Teatro Amazonas, passeios de barco e selva." },
  { code: "SP", name: "São Paulo", capital: "São Paulo", region: "Sudeste", lat: -23.550, lng: -46.633, slug: "sp", description: "Avenida Paulista, gastronomia mundial, museus e vida urbana." },
  { code: "DF", name: "Distrito Federal", capital: "Brasília", region: "Centro-Oeste", lat: -15.780, lng: -47.929, slug: "df", description: "Arquitetura monumental de Niemeyer, monumentos e cerrado." },
  { code: "PR", name: "Paraná", capital: "Curitiba", region: "Sul", lat: -25.428, lng: -49.273, slug: "pr", description: "Cataratas do Iguaçu, Jardim Botânico e passeio de trem." },
  { code: "RS", name: "Rio Grande do Sul", capital: "Porto Alegre", region: "Sul", lat: -30.034, lng: -51.217, slug: "rs", description: "Catedral de Pedra de Canela, Vale dos Vinhedos e chimarrão." },
  { code: "SC", name: "Santa Catarina", capital: "Florianópolis", region: "Sul", lat: -27.595, lng: -48.548, slug: "sc", description: "Praia da Joaquina, Beto Carrero World e a bela Serra do Rio do Rastro." },
  { code: "GO", name: "Goiás", capital: "Goiânia", region: "Centro-Oeste", lat: -16.686, lng: -49.264, slug: "go", description: "Chapada dos Veadeiros, Pirenópolis e águas termais." },
  { code: "MA", name: "Maranhão", capital: "São Luís", region: "Nordeste", lat: -2.530, lng: -44.302, slug: "ma", description: "Dunas e lagoas dos Lençóis Maranhenses, casarões azulejados." },
  { code: "MG", name: "Minas Gerais", capital: "Belo Horizonte", region: "Sudeste", lat: -19.919, lng: -43.938, slug: "mg", description: "Cidades históricas, Ouro Preto, Inhotim e queijo artesanal." },
  { code: "PE", name: "Pernambuco", capital: "Recife", region: "Nordeste", lat: -8.047, lng: -34.877, slug: "pe", description: "Porto de Galinhas, Fernando de Noronha e Olinda colonial." }
];

export default function MapExplorerSection() {
  const [selectedState, setSelectedState] = useState<StatePin | null>(null);
  const [hasVisited, setHasVisited] = useState(false);

  useEffect(() => {
    if (!selectedState) return;
    setHasVisited(false);
  }, [selectedState]);

  const handleCollectStamp = async () => {
    if (!selectedState) return;
    await visitState(selectedState.code);
    setHasVisited(true);
  };

  return (
    <section id="map-explorer" className="py-24 relative overflow-hidden bg-slate-950 text-white">
      {/* Decorative Blur */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[400px] h-[400px] bg-emerald-500/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold mb-4 uppercase tracking-widest">
            Mapa Interativo
          </span>
          <h2 className="text-3xl md:text-5xl font-black tracking-tight text-white mb-4">
            Navegue Pelo <span className="text-gradient">Brasil</span>
          </h2>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            Clique nos estados sinalizados para revelar seus roteiros, belezas regionais, e carimbar seu passaporte de viajante direto pelo mapa.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          {/* Map canvas */}
          <div className="lg:col-span-2 h-[550px] rounded-3xl overflow-hidden border border-white/10 shadow-2xl relative z-0">
            <MapContainer onSelectState={setSelectedState} />
          </div>

          {/* Side Info Panel */}
          <div className="lg:col-span-1 rounded-3xl border border-white/10 bg-slate-900/40 backdrop-blur-md p-6 flex flex-col justify-between shadow-2xl relative">
            <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent rounded-3xl pointer-events-none" />
            
            {selectedState ? (
              <div className="space-y-6 flex-1 flex flex-col justify-between z-10">
                <div>
                  <div className="flex items-center justify-between gap-4 mb-4">
                    <span className="text-xs font-black text-emerald-400 uppercase tracking-wider bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full">
                      {selectedState.region}
                    </span>
                    <span className="text-slate-500 font-bold text-xs uppercase">
                      Capital: {selectedState.capital}
                    </span>
                  </div>

                  <h3 className="text-3xl font-black text-white flex items-center gap-2 mb-4">
                    <MapPin className="w-6 h-6 text-emerald-400" />
                    <span>{selectedState.name}</span>
                  </h3>

                  <p className="text-slate-300 text-sm md:text-base leading-relaxed mb-6 font-medium">
                    {selectedState.description}
                  </p>
                </div>

                <div className="space-y-4">
                  <button
                    onClick={handleCollectStamp}
                    disabled={hasVisited}
                    className={`w-full flex items-center justify-center gap-2 py-4 rounded-full font-black text-sm transition-all ${
                      hasVisited
                        ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 cursor-default"
                        : "bg-emerald-500 hover:bg-emerald-600 text-slate-950 hover:scale-105 active:scale-95 shadow-lg shadow-emerald-500/10"
                    }`}
                  >
                    {hasVisited ? (
                      <>
                        <span>✓ Carimbo Coletado (+150 XP)</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 animate-pulse" />
                        <span>Coletar Carimbo no Passaporte</span>
                      </>
                    )}
                  </button>

                  <Link
                    href={`/turismo/${selectedState.slug}`}
                    className="w-full flex items-center justify-center gap-1.5 bg-slate-950/80 hover:bg-slate-950 hover:text-emerald-400 border border-white/5 py-4 rounded-full font-bold text-sm text-slate-200 transition-all hover:scale-105"
                  >
                    <span>Ver Roteiro Completo</span>
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-8 text-slate-500 z-10">
                <Compass className="w-12 h-12 text-slate-700 mb-4 animate-bounce" />
                <span className="font-bold text-lg text-slate-400">Selecione um Estado</span>
                <span className="text-sm text-slate-500 mt-1 max-w-xs">Clique em qualquer marcador no mapa do Brasil à esquerda para explorar dados locais e carimbar seu passaporte.</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
