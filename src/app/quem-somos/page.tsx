import Navbar from '@/components/Navbar';
import FooterSection from '@/components/FooterSection';
import MayaChat from '@/components/MayaChat';
import Link from 'next/link';
import { assetPath } from '@/lib/assetPath';
import { ArrowUpRight, Compass, Sparkles, MapPin, ShieldCheck, Globe, Target, Eye, Cpu, HeartHandshake, Map, Smartphone, Gamepad2, Briefcase } from 'lucide-react';

export const metadata = {
  title: 'Quem Somos | Descubra o Brasil',
  description: 'Conheça o Descubra o Brasil — Plataforma nacional de turismo brasileiro combinando tecnologia, IA e cultura.',
};

export default function QuemSomos() {
  return (
    <>
      <Navbar />
      <main className="cine-site">
        {/* Hero */}
        <section
          style={{
            position: 'relative',
            minHeight: '55vh',
            display: 'flex',
            alignItems: 'flex-end',
            background: 'linear-gradient(135deg, #030d05, #071c18)',
            overflow: 'hidden',
          }}
          aria-labelledby="about-heading"
        >
          <video
            autoPlay muted loop playsInline preload="metadata"
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              opacity: 0.35,
              filter: 'saturate(0.9) contrast(1.1)',
            }}
            aria-hidden="true"
          >
            <source src={assetPath('/media/litoral-brasil.mp4')} type="video/mp4" />
          </video>
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(0deg, rgba(3,13,5,0.97), rgba(3,13,5,0.5) 60%, transparent)',
          }} aria-hidden="true" />

          <div
            className="cine-container"
            style={{
              position: 'relative',
              zIndex: 2,
              color: '#fff',
              paddingBottom: 'clamp(48px, 6vw, 80px)',
              paddingTop: '140px',
            }}
          >
            <p className="cine-section-kicker" style={{ color: '#d4a017' }}>
              SOBRE A PLATAFORMA
            </p>
            <h1
              id="about-heading"
              style={{
                fontSize: 'clamp(38px, 6vw, 80px)',
                fontWeight: 350,
                lineHeight: 0.9,
                letterSpacing: '-0.07em',
                margin: '0 0 20px',
              }}
            >
              Tecnologia, Turismo &<br />
              <strong style={{ fontWeight: 900, color: '#d4a017' }}>Inteligência Artificial.</strong>
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 16, lineHeight: 1.75, maxWidth: 600, margin: 0 }}>
              O Descubra o Brasil é um portal nacional dedicado a conectar viajantes a histórias,
              destinos e culturas de todo o território brasileiro de forma moderna, inteligente e imersiva.
            </p>
          </div>
        </section>

        {/* Conteúdo Institucional */}
        <section className="cine-section">
          <div className="cine-container">
            <div className="cine-about-grid" style={{ marginBottom: 64 }}>
              <div>
                <p className="cine-section-kicker">NOSSA HISTÓRIA</p>
                <h2 className="cine-section-title" style={{ marginBottom: 20 }}>
                  Transformando a forma de explorar o Brasil
                </h2>
                <p style={{ color: 'var(--muted)', fontSize: 15, lineHeight: 1.8, marginBottom: 20 }}>
                  O projeto nasceu com o propósito de valorizar as belezas naturais, patrimônios culturais
                  e a rica gastronomia das 27 unidades federativas. Não somos apenas um guia de viagem:
                  somos um ecossistema completo que une tecnologia 3D, assistente virtual inteligente e dados oficiais.
                </p>
                <p style={{ color: 'var(--muted)', fontSize: 15, lineHeight: 1.8 }}>
                  Nossa missão é facilitar o planejamento de roteiros, promover estabelecimentos locais
                  e apresentar o Brasil para brasileiros e estrangeiros com a qualidade cinematográfica que o país merece.
                </p>
              </div>

              <div className="cine-about-subsections" style={{ marginTop: 0 }}>
                <div className="cine-about-sub">
                  <h4 style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Target size={18} style={{ color: 'var(--accent)' }} /> Nossa Missão
                  </h4>
                  <p>Promover a descoberta turística inclusiva, sustentável e acessível em todo o território nacional.</p>
                </div>
                <div className="cine-about-sub">
                  <h4 style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Eye size={18} style={{ color: 'var(--accent)' }} /> Nossa Visão
                  </h4>
                  <p>Tornar-se a referência nacional em inovação tecnológica voltada para o turismo brasileiro.</p>
                </div>
                <div className="cine-about-sub">
                  <h4 style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Cpu size={18} style={{ color: 'var(--accent)' }} /> Inteligência Artificial
                  </h4>
                  <p>Integração com a Maya IA para roteiros adaptados ao perfil, orçamento e preferências de cada viajante.</p>
                </div>
                <div className="cine-about-sub">
                  <h4 style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <HeartHandshake size={18} style={{ color: 'var(--accent)' }} /> Para Empresas
                  </h4>
                  <p>Canal direto para promover pousadas, hotéis, restaurantes e atrações parceiras sem complicação.</p>
                </div>
              </div>
            </div>

            {/* O Que Fazemos */}
            <div style={{ marginTop: 64 }}>
              <p className="cine-section-kicker">NOSSO ECOSSISTEMA</p>
              <h2 className="cine-section-title" style={{ marginBottom: 36 }}>
                Tecnologia a serviço de quem viaja
              </h2>

              <div className="cine-what-grid">
                {[
                  { icon: MapPin, title: 'Guia de Destinos', desc: 'Informações detalhadas sobre estados, praias, parques, cultura e patrimônio histórico.' },
                  { icon: Sparkles, title: 'Maya IA Assistente', desc: 'Respostas em tempo real para dúvidas de viagem, roteiros por dias e dicas locais.' },
                  { icon: Globe, title: 'Exploração 3D', desc: 'Visualização do mapa brasileiro em 3D com estados e atrações interativas.' },
                  { icon: Compass, title: 'Aplicativo PWA', desc: 'Acesso completo no celular, instalável sem necessidade de loja de aplicativos.' },
                  { icon: ShieldCheck, title: 'Passaporte & Games', desc: 'Desafios recreativos diários para testar e expandir seus conhecimentos sobre o Brasil.' },
                  { icon: Briefcase, title: 'Portal de Ofertas', desc: 'Espaço para empresas apresentarem suas ofertas e pacotes turísticos com transparência.' },
                ].map(({ icon: Icon, title, desc }) => (
                  <div key={title} className="cine-what-card">
                    <span className="cine-what-icon" style={{ color: 'var(--accent)' }}>
                      <Icon size={26} />
                    </span>
                    <h3 className="cine-what-title">{title}</h3>
                    <p className="cine-what-desc">{desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section
          style={{
            background: 'linear-gradient(135deg, #030d05, #071c18)',
            padding: 'clamp(48px, 6vw, 80px) 0',
            textAlign: 'center',
            color: '#fff',
          }}
        >
          <div className="cine-container">
            <h2 style={{ fontSize: 'clamp(26px, 4vw, 48px)', fontWeight: 500, letterSpacing: '-0.05em', margin: '0 0 16px' }}>
              Pronto para descobrir o Brasil?
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 15, marginBottom: 32, maxWidth: 480, margin: '0 auto 32px' }}>
              Abra nosso aplicativo ou converse com a Maya para planejar sua próxima aventura.
            </p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
              <a
                href={assetPath('/app/index.html')}
                className="cine-btn-explore"
              >
                Abrir Aplicativo
              </a>
              <a
                href={assetPath('/app/index.html#noticias')}
                className="cine-btn-maya"
              >
                <Sparkles size={14} /> Perguntar à Maya
              </a>
            </div>
          </div>
        </section>
      </main>
      <FooterSection />
      <MayaChat />
    </>
  );
}
