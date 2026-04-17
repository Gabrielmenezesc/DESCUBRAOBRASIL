"use client";

import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import FooterSection from "@/components/FooterSection";
import { Briefcase, CheckCircle2, Building, Send } from "lucide-react";
import { useState } from "react";

const plans = [
  {
    name: "Bronze",
    price: "R$ 99",
    period: "/mês",
    description: "Ideal para iniciar sua jornada digital",
    features: ["Perfil básico da empresa", "1 modalidade/cidade", "6 fotos em galeria", "Botão WhatsApp"],
    popular: false,
  },
  {
    name: "Prata",
    price: "R$ 249",
    period: "/mês",
    description: "Mais visibilidade regional",
    features: ["Tudo do plano Bronze", "Destaque na busca regional", "Cupom de desconto ativo", "Captação de Leads"],
    popular: true,
  },
  {
    name: "Ouro",
    price: "R$ 599",
    period: "/mês",
    description: "Presença forte no aplicativo",
    features: ["Tudo do plano Prata", "Slot patrocinado regional", "Pin promovido no mapa", "Dashboard de acesso"],
    popular: false,
  },
  {
    name: "Diamante",
    price: "R$ 1.490",
    period: "/mês",
    description: "Exclusividade e autoridade máxima",
    features: ["Tudo do plano Ouro", "Campanha nacional", "Prioridade de moderação", "Exclusividade na categoria local"],
    popular: false,
  }
];

export default function AnunciePage() {
  return (
    <main className="min-h-screen bg-background text-foreground scroll-smooth transition-colors duration-700 pt-20">
      <Navbar />
      
      <section className="py-24 relative overflow-hidden">
        {/* BG */}
        <div className="absolute inset-0 bg-slate-50/50 dark:bg-[#0B1120] -z-10" />
        <div className="absolute top-[20%] left-[-10%] w-96 h-96 rounded-full bg-blue-500/10 dark:bg-blue-500/5 blur-3xl animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[40rem] h-[40rem] rounded-full bg-emerald-500/10 dark:bg-emerald-500/5 blur-3xl animate-pulse delay-700" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100/50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 font-semibold text-sm mb-6 border border-blue-200 dark:border-blue-800/50"
            >
              <Briefcase className="w-4 h-4" />
              Parceiros Comerciais
            </motion.div>
            
            <motion.h1 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-5xl font-black mb-6 text-slate-900 dark:text-white"
            >
              Exiba seu negócio para milhares de <span className="text-gradient">viajantes</span>.
            </motion.h1>
            
            <motion.p 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-lg text-slate-600 dark:text-slate-400"
            >
              O ecossistema do Descubra O Brasil conecta hotéis, restaurantes e passeios diretamente a quem está planejando ou vivendo uma viagem.
            </motion.p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
            {plans.map((plan, idx) => (
              <motion.div 
                key={plan.name}
                initial={{ y: 40, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 + (idx * 0.1) }}
                className={`glass-card p-8 flex flex-col relative ${plan.popular ? 'border-emerald-500 shadow-emerald-500/20 shadow-xl' : ''}`}
              >
                {plan.popular && (
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-md">
                    Mais Popular
                  </div>
                )}
                
                <h3 className="text-xl font-bold mb-2 text-slate-900 dark:text-white">{plan.name}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 h-10">{plan.description}</p>
                <div className="mb-6">
                  <span className="text-4xl font-black text-slate-900 dark:text-white">{plan.price}</span>
                  <span className="text-slate-500 dark:text-slate-400 font-medium">{plan.period}</span>
                </div>
                
                <ul className="space-y-4 mb-8 flex-1 text-sm text-slate-700 dark:text-slate-300 font-medium">
                  {plan.features.map(feat => (
                    <li key={feat} className="flex flex-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
                
                <button className={`w-full py-3 rounded-xl font-bold transition-all ${plan.popular ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white hover:shadow-lg hover:shadow-emerald-500/30' : 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white hover:bg-slate-200 dark:hover:bg-slate-700'}`}>
                  Solicitar Contato
                </button>
              </motion.div>
            ))}
          </div>

          {/* Lead Form CTA */}
          <motion.div
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="mt-20 glass-card bg-gradient-to-br from-slate-900 to-slate-800 border-slate-700 p-8 md:p-12 text-center rounded-3xl"
          >
             <h2 className="text-3xl font-bold text-white mb-4">Quero ser um Parceiro</h2>
             <p className="text-slate-400 mb-8 max-w-2xl mx-auto">Deixe seus dados e nossa equipe comercial entrará em contato para definir o melhor plano para você.</p>
             
             <PartnerForm />
          </motion.div>
        </div>
      </section>

      <FooterSection />
    </main>
  );
}

function PartnerForm() {
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    
    const formData = new FormData(e.currentTarget);
    const data = {
      company_name: formData.get("company"),
      email: formData.get("email"),
      whatsapp: formData.get("whatsapp"),
      created_at: new Date().toISOString(),
    };

    try {
      const { supabase } = await import("@/lib/supabase");
      const { error } = await supabase.from("partner_leads").insert([data]);
      
      if (error) throw error;
      setSent(true);
    } catch (err) {
      console.error("Error sending lead:", err);
      alert("Ocorreu um erro ao enviar. Por favor, tente novamente ou entre em contato via WhatsApp.");
    } finally {
      setLoading(false);
    }
  }

  if (sent) {
    return (
      <div className="py-8 text-emerald-400 font-bold flex flex-col items-center gap-4">
        <CheckCircle2 className="w-12 h-12" />
        <p className="text-xl">Solicitação enviada com sucesso!</p>
        <p className="text-slate-400 font-normal">Nossa equipe entrará em contato em breve.</p>
      </div>
    );
  }

  return (
    <form className="max-w-md mx-auto grid gap-4" onSubmit={handleSubmit}>
      <input 
        name="company"
        type="text" 
        placeholder="Nome da Empresa" 
        required
        className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors" 
      />
      <input 
        name="email"
        type="email" 
        placeholder="E-mail corporativo" 
        required
        className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors" 
      />
      <input 
        name="whatsapp"
        type="tel" 
        placeholder="WhatsApp" 
        required
        className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors" 
      />
      <button 
        type="submit" 
        disabled={loading}
        className="w-full py-4 mt-2 rounded-xl bg-emerald-500 text-white font-bold flex items-center justify-center gap-2 hover:bg-emerald-400 transition-colors disabled:opacity-50 disabled:cursor-wait"
      >
        {loading ? (
          <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        ) : (
          <><Send className="w-5 h-5" /> Enviar Solicitação</>
        )}
      </button>
    </form>
  );
}
