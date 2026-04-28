"use client";

import Navbar from "@/components/Navbar";
import FooterSection from "@/components/FooterSection";
import MayaChat from "@/components/MayaChat";
import LGPDBanner from "@/components/LGPDBanner";
import { motion } from "framer-motion";
import { Calendar, Map, DollarSign, Sun, Compass, Utensils, Heart, Shield, ArrowRight, Backpack, Clock, Languages } from "lucide-react";

const tips = [
  {
    icon: Calendar,
    title: "Melhor Época para Viajar",
    desc: "O Nordeste é incrível o ano todo. O Sul brilha no inverno. A Amazônia é ideal de junho a novembro (seca). O Sudeste aquece de dezembro a março.",
    color: "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400",
    border: "border-blue-100 dark:border-blue-800",
  },
  {
    icon: DollarSign,
    title: "Viaje Gastando Pouco",
    desc: "Use ônibus interestaduais, pousadas familiares, e explore atrações gratuitas como parques nacionais, praias e centros históricos.",
    color: "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400",
    border: "border-emerald-100 dark:border-emerald-800",
  },
  {
    icon: Map,
    title: "Roteiros por Estado",
    desc: "De Roraima ao Rio Grande do Sul — cada estado tem circuitos turísticos completos. Monte seu roteiro por região e aproveite mais.",
    color: "bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400",
    border: "border-amber-100 dark:border-amber-800",
  },
  {
    icon: Utensils,
    title: "Gastronomia Regional",
    desc: "Acarajé na Bahia, churrasco no RS, tacacá no Pará, pão de queijo em MG, barreado no PR — o Brasil é um festival de sabores.",
    color: "bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400",
    border: "border-rose-100 dark:border-rose-800",
  },
  {
    icon: Backpack,
    title: "O que Levar na Mala",
    desc: "Protetor solar sempre! Para o Norte/Nordeste: roupas leves. Para o Sul: agasalhos no inverno. Para trilhas: tênis reforçado e água.",
    color: "bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400",
    border: "border-purple-100 dark:border-purple-800",
  },
  {
    icon: Shield,
    title: "Segurança do Viajante",
    desc: "Evite ostentar objetos caros, guarde documentos em local seguro, mantenha cópias digitais e compartilhe seu roteiro com alguém de confiança.",
    color: "bg-cyan-50 dark:bg-cyan-900/20 text-cyan-600 dark:text-cyan-400",
    border: "border-cyan-100 dark:border-cyan-800",
  },
];

const stateGuides = [
  {
    state: "Bahia",
    code: "BA",
    top: "Salvador, Chapada Diamantina, Praia do Forte",
    bestTime: "Set – Mar",
    free: "Pelourinho, Farol da Barra, Igreja do Bonfim",
    image: "https://images.unsplash.com/photo-1597487124413-82a4c4e8de1e?q=80&w=400",
  },
  {
    state: "Rio de Janeiro",
    code: "RJ",
    top: "Cristo, Sugarloaf, Búzios, Paraty",
    bestTime: "Mai – Out",
    free: "Aterro do Flamengo, Mirante Dona Marta, Escadaria Selarón",
    image: "https://images.unsplash.com/photo-1483729558449-99ef09a8c325?q=80&w=400",
  },
  {
    state: "Ceará",
    code: "CE",
    top: "Jericoacoara, Canoa Quebrada, Fortaleza",
    bestTime: "Jul – Jan",
    free: "Praia de Jeri, Duna do Pôr do Sol, Centro Dragão do Mar",
    image: "https://images.unsplash.com/photo-1505142468610-359e7d316be0?q=80&w=400",
  },
  {
    state: "Minas Gerais",
    code: "MG",
    top: "Ouro Preto, Tiradentes, Serra do Cipó, Capitólio",
    bestTime: "Abr – Set",
    free: "Igrejas barrocas, Mirantes do Capitólio, Cachoeira Tabuleiro",
    image: "https://images.unsplash.com/photo-1598301257982-0cf014dabbca?q=80&w=400",
  },
  {
    state: "Amazonas",
    code: "AM",
    top: "Manaus, Encontro das Águas, Reserva Mamirauá",
    bestTime: "Jun – Nov",
    free: "Teatro Amazonas (entrada gratuita terças), Porto flutuante",
    image: "https://images.unsplash.com/photo-1618953822098-e6614c1d2e94?q=80&w=400",
  },
  {
    state: "Santa Catarina",
    code: "SC",
    top: "Florianópolis, Balneário Camboriú, Bombinhas",
    bestTime: "Dez – Mar",
    free: "Lagoinha do Leste (trilha), Mirante do Morro da Cruz",
    image: "https://images.unsplash.com/photo-1594736797933-d0501ba2fe65?q=80&w=400",
  },
];

export default function ServicosPage() {
  return (
    <main className="min-h-screen bg-background text-foreground flex flex-col">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-gradient-to-b from-emerald-50 to-white dark:from-emerald-950/30 dark:to-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="animate-fade-in inline-block px-4 py-1.5 rounded-full bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 text-sm font-bold mb-4">
            🧭 DICAS DE VIAGEM
          </span>
          <h1 className="animate-fade-in-up text-4xl md:text-6xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-6">
            Tudo para sua <span className="text-gradient">Viagem</span> pelo Brasil
          </h1>
          <p className="animate-fade-in-up animate-delay-100 text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed">
            Dicas práticas, melhores épocas, gastronomia regional, roteiros gratuitos e guias rápidos por estado para você aproveitar ao máximo.
          </p>
        </div>
      </section>

      {/* Tips Cards */}
      <section className="py-16 bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {tips.map((tip, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`p-8 rounded-3xl border ${tip.border} bg-white dark:bg-slate-900 hover:shadow-xl transition-all group`}
              >
                <div className={`w-14 h-14 rounded-2xl ${tip.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                  <tip.icon className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">{tip.title}</h3>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">{tip.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* State Quick Guides */}
      <section className="py-20 bg-slate-50 dark:bg-slate-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4 text-center">
            Guia Rápido por <span className="text-gradient">Estado</span>
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-center mb-12 max-w-2xl mx-auto">
            Destinos top, melhor época e atrações gratuitas nos estados mais procurados
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {stateGuides.map((guide, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white dark:bg-slate-900 rounded-2xl overflow-hidden shadow-md border border-slate-100 dark:border-slate-800 hover:shadow-xl transition-all"
              >
                <div className="relative h-40 overflow-hidden">
                  <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: `url(${guide.image})` }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <div className="absolute bottom-3 left-4">
                    <h3 className="text-xl font-extrabold text-white">{guide.state}</h3>
                    <span className="text-emerald-300 text-xs font-bold">{guide.code}</span>
                  </div>
                </div>
                <div className="p-5 space-y-3">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Top destinos</span>
                    <p className="text-sm text-slate-700 dark:text-slate-200 font-medium">{guide.top}</p>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                      <Sun className="w-3 h-3" /> Melhor época
                    </span>
                    <p className="text-sm text-emerald-600 dark:text-emerald-400 font-bold">{guide.bestTime}</p>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">💰 Gratuito</span>
                    <p className="text-sm text-slate-600 dark:text-slate-300">{guide.free}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA to Contact */}
      <section className="py-16 bg-white dark:bg-slate-900">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4">
            Precisa de ajuda para planejar?
          </h2>
          <p className="text-slate-600 dark:text-slate-300 mb-8">
            Nosso time vive e respira turismo. Fale com a gente no WhatsApp!
          </p>
          <a
            href="https://wa.me/5538991621135"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-emerald-500 text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-emerald-600 transition-colors"
          >
            💬 Falar com o Time
            <ArrowRight className="w-5 h-5" />
          </a>
        </div>
      </section>

      <FooterSection />
      <MayaChat />
      <LGPDBanner />
    </main>
  );
}
