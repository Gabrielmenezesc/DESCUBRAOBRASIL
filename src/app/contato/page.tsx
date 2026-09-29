"use client";

import Navbar from '@/components/Navbar';
import FooterSection from '@/components/FooterSection';
import MayaChat from '@/components/MayaChat';
import { Mail, MessageCircle, Send } from 'lucide-react';

export default function ContatoPage() {
  function prepareEmail(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const subject = `Contato pelo site: ${String(data.get('assunto') || 'Mensagem')}`;
    const body = `Nome: ${String(data.get('nome') || '')}\nE-mail: ${String(data.get('email') || '')}\n\n${String(data.get('mensagem') || '')}`;
    window.location.href = `mailto:descubrabrasil@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  }
  return (
    <>
      <Navbar />
      <main className="pro-page">
        <div className="pro-container" style={{ maxWidth: 1040 }}>
          <p className="pro-kicker">CONTATO</p>
          <h1>Vamos conversar<br />sobre o Brasil.</h1>
          <p className="pro-lead">Envie uma mensagem, acompanhe nosso Instagram ou fale diretamente com a equipe.</p>

          <div className="pro-two" style={{ marginTop: 48 }}>
            <section className="pro-feature">
              <h2>Envie sua mensagem</h2>
              <form onSubmit={prepareEmail} style={{ display: 'grid', gap: 16 }}>
                <label>Nome<input name="nome" required maxLength={100} placeholder="Como podemos chamar você?" /></label>
                <label>E-mail<input name="email" type="email" required maxLength={254} placeholder="seuemail@exemplo.com" /></label>
                <label>Assunto<select name="assunto" required defaultValue=""><option value="" disabled>Selecione</option><option>Planejamento de viagem</option><option>Parceria comercial</option><option>Publicidade</option><option>Suporte</option><option>Outro assunto</option></select></label>
                <label>Mensagem<textarea name="mensagem" required minLength={10} maxLength={3000} rows={6} placeholder="Escreva sua mensagem"></textarea></label>
                <button className="pro-button" type="submit"><Send size={18} /> Enviar mensagem</button>
              </form>
            </section>

            <section className="pro-feature">
              <p className="pro-kicker">CANAIS OFICIAIS</p>
              <h2>Escolha como falar conosco.</h2>
              <div style={{ display: 'grid', gap: 14, marginTop: 28 }}>
                <a className="pro-button" href="mailto:descubrabrasil@gmail.com" aria-label="Enviar e-mail"><Mail size={20} /> descubrabrasil@gmail.com</a>
                <a className="pro-button" href="https://www.instagram.com/descubrabrasiloficial/" target="_blank" rel="noopener noreferrer" aria-label="Abrir Instagram"><img src="https://cdn.simpleicons.org/instagram/FFFFFF" alt="" aria-hidden="true" width={20} height={20} /> @descubrabrasiloficial</a>
                <a className="pro-button" href="https://wa.me/5561985630128" target="_blank" rel="noopener noreferrer" aria-label="Abrir atendimento"><MessageCircle size={20} /> Atendimento direto</a>
              </div>
              <p className="pro-lead" style={{ marginTop: 32, fontSize: 15 }}>Ao enviar, o aplicativo de e-mail do aparelho abre com destinatário, assunto e mensagem preenchidos para você revisar e confirmar.</p>
            </section>
          </div>
        </div>
      </main>
      <FooterSection />
      <MayaChat />
    </>
  );
}

