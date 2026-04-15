"use client";

import Link from "next/link";
import { Mail, MapPin, Phone, Camera, Globe } from "lucide-react";

export default function FooterSection() {
  return (
    <footer id="contact" className="bg-slate-900 pt-24 pb-12 relative overflow-hidden text-slate-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          {/* Brand Col */}
          <div className="space-y-6">
            <img 
              src="/DESCUBRAOBRASIL/logo-descubra.png" 
              alt="Descubra o Brasil" 
              className="h-12 w-auto object-contain"
            />
            <p className="text-sm leading-relaxed">
              Dedicado a revelar as belezas e o potencial turístico inesgotável do Brasil. 
              Explore com a gente.
            </p>
            <div className="flex gap-4">
              <a href="https://instagram.com/descubraobrasiloficial" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-emerald-500 hover:text-white transition-colors border border-slate-700">
                <Camera className="w-5 h-5" />
              </a>
              <a href="/DESCUBRAOBRASIL/app/index.html" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-emerald-500 hover:text-white transition-colors border border-slate-700">
                <Globe className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Nav Col */}
          <div>
            <h4 className="text-white font-bold mb-6 font-mono tracking-wider">NAVEGAÇÃO</h4>
            <ul className="space-y-4">
              <li><Link href="/" className="hover:text-emerald-400 transition-colors">Início</Link></li>
              <li><Link href="/turismo" className="hover:text-emerald-400 transition-colors">Turismo</Link></li>
              <li><Link href="/servicos" className="hover:text-emerald-400 transition-colors">Dicas de Viagem</Link></li>
              <li><Link href="/noticias" className="hover:text-emerald-400 transition-colors">Notícias</Link></li>
              <li><Link href="/contato" className="hover:text-emerald-400 transition-colors">Contato</Link></li>
            </ul>
          </div>

          {/* Contact Col */}
          <div>
            <h4 className="text-white font-bold mb-6 font-mono tracking-wider">CONTATO</h4>
            <ul className="space-y-4">
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-emerald-400" />
                <a href="https://wa.me/5538991621135" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">+55 38 99162-1135</a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-emerald-400" />
                <a href="mailto:contato@descubraobrasil.com" className="hover:text-white transition-colors">contato@descubraobrasil.com</a>
              </li>
              <li className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-emerald-400" />
                <span>Brasil, 100% Digital</span>
              </li>
            </ul>
          </div>

          {/* App QRC Col */}
          <div>
            <h4 className="text-white font-bold mb-6 font-mono tracking-wider">BAIXE O APP</h4>
            <p className="text-sm mb-4">Escaneie o QR Code ou clique para baixar o app completo no seu celular.</p>
            <a href="/DESCUBRAOBRASIL/app/index.html" target="_blank" rel="noopener noreferrer" className="inline-block bg-white p-2 rounded-xl group hover:scale-105 transition-transform">
              <img 
                src={"https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://gabrielmenezesc.github.io/DESCUBRAOBRASIL/app/index.html"} 
                alt="QR Code do App Descubra o Brasil" 
                className="w-24 h-24 object-contain group-hover:opacity-80 transition-opacity" 
              />
            </a>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm">
          <p>&copy; {new Date().getFullYear()} Descubra o Brasil. Todos os direitos reservados.</p>
          <div className="flex gap-6">
            <Link href="/termos" className="hover:text-white transition-colors">Termos de Uso</Link>
            <Link href="/privacidade" className="hover:text-white transition-colors">Política de Privacidade</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
