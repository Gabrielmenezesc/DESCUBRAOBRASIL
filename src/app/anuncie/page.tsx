import Navbar from '@/components/Navbar';
import FooterSection from '@/components/FooterSection';
import MayaChat from '@/components/MayaChat';
import Link from 'next/link';
import { assetPath } from '@/lib/assetPath';
import { ArrowUpRight, Megaphone, CheckCircle2, ShieldCheck, Sparkles, Image, Video, MapPin, Tag, Globe, Bot } from 'lucide-react';

export const metadata = {
  title: 'Anuncie no Descubra o Brasil | Oportunidades para Empresas',
  description: 'Apresente seu hotel, restaurante, atração ou parque no ecossistema Descubra o Brasil. Conecte-se com viajantes interessados no seu destino.',
};

const adFormats = [
  {
    icon: Image,
    title: 'Banner Premium',
    desc: 'Banners de alto impacto colocados estrategicamente na homepage e nas páginas de destinos mais acessadas.',
  },
  {
    icon: Video,
    title: 'Vídeo Patrocinado',
    desc: 'Exibição cinematográfica na área "Brasil em Movimento" com link direto para sua oferta ou site.',
  },
  {
    icon: MapPin,
    title: 'Destaque no Mapa 3D',
    desc: 'Sua atração ou estabelecimento destacado com marcador pulsante e card informativo no mapa interativo.',
  },
  {
    icon: Tag,
    title: 'Card de Oferta Verificada',
    desc: 'Publicação de ofertas promocionais com preço original, preço promocional, período e regras claras.',
  },
  {
    icon: Globe,
    title: 'Destaque Regional por Estado',
    desc: 'Visibilidade para viajantes filtrando destinos na sua região, estado ou cidade específica.',
  },
  {
    icon: Bot,
    title: 'Recomendação Contextual Maya',
    desc: 'Indicação da sua empresa quando viajantes buscarem por opções na sua cidade ou categoria.',
  },
];

export default function AnunciePage() {
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
          aria-labelledby="anuncie-heading"
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
            <source src={assetPath('/media/rotas-brasil.mp4')} type="video/mp4" />
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
              PARA HOTÉIS, RESTAURANTES, PARQUES E PASSEIOS
            </p>
            <h1
              id="anuncie-heading"
              style={{
                fontSize: 'clamp(38px, 6vw, 80px)',
                fontWeight: 350,
                lineHeight: 0.9,
                letterSpacing: '-0.07em',
                margin: '0 0 20px',
              }}
            >
              Conecte sua marca a<br />
              <strong style={{ fontWeight: 900, color: '#d4a017' }}>quem está viajando.</strong>
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 16, lineHeight: 1.75, maxWidth: 600, margin: 0 }}>
              Apresente seu negócio para milhares de pessoas que buscam destinos, roteiros e experiências no Brasil diariamente.
            </p>
          </div>
        </section>

        {/* Formatos Publicitários */}
        <section className="cine-section">
          <div className="cine-container">
            <div className="cine-section-heading">
              <div>
                <p className="cine-section-kicker">FORMATOS DISPONÍVEIS</p>
                <h2 className="cine-section-title">
                  Espaços premium de divulgação
                </h2>
              </div>
            </div>

            <div className="cine-advertise-grid" style={{ marginBottom: 64 }}>
              {adFormats.map(({ icon: Icon, title, desc }) => (
                <div key={title} className="cine-ad-format">
                  <div className="cine-ad-format-icon" style={{ color: 'var(--accent)' }}>
                    <Icon size={28} />
                  </div>
                  <h3 className="cine-ad-format-name">{title}</h3>
                  <p className="cine-ad-format-desc">{desc}</p>
                </div>
              ))}
            </div>

            {/* Transparência e Regras */}
            <div
              style={{
                background: 'var(--panel)',
                border: '1px solid var(--line)',
                borderRadius: 24,
                padding: 'clamp(28px, 4vw, 48px)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
                <ShieldCheck size={28} style={{ color: 'var(--accent)' }} />
                <h3 style={{ fontSize: 22, fontWeight: 700, margin: 0 }}>Compromisso com a Transparência</h3>
              </div>
              <p style={{ color: 'var(--muted)', fontSize: 15, lineHeight: 1.8, marginBottom: 24, maxWidth: 780 }}>
                No Descubra o Brasil, prezamos pela confiança do viajante. Todo conteúdo patrocinado é claramente identificado com o selo <strong>PUBLICIDADE</strong> ou <strong>CONTEÚDO PATROCINADO</strong>. Não inventamos vínculos nem divulgamos ofertas sem autorização expressa dos parceiros.
              </p>

              <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                <a
                  href="https://wa.me/5561995659907?text=Ol%C3%A1%2C%20gostaria%20de%20anunciar%20minha%20empresa%20no%20Descubra%20o%20Brasil"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="cine-btn-explore"
                >
                  <Megaphone size={16} /> FALE COM NOSSA EQUIPE
                </a>
                <Link href="/empresas" className="cine-btn-app" style={{ background: 'var(--soft)', color: 'var(--ink)', border: '1px solid var(--line)' }}>
                  Simular Proposta no App
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <FooterSection />
      <MayaChat />
    </>
  );
}
