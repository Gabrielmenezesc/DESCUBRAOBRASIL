import Link from 'next/link';
import Navbar from '@/components/Navbar';
import FooterSection from '@/components/FooterSection';
import MayaChat from '@/components/MayaChat';

const states = [
  ['ac', 'Acre', 'Norte', 'photo-1614530842449-86b64c84e06d'],
  ['al', 'Alagoas', 'Nordeste', 'photo-1559825481-12a05cc00344'],
  ['ap', 'Amapá', 'Norte', 'photo-1516026672322-bc52d61a55d5'],
  ['am', 'Amazonas', 'Norte', 'photo-1516026672322-bc52d61a55d5'],
  ['ba', 'Bahia', 'Nordeste', 'photo-1549918864-48ac978761a4'],
  ['ce', 'Ceará', 'Nordeste', 'photo-1595965340046-bd3f8cd01024'],
  ['df', 'Distrito Federal', 'Centro-Oeste', 'photo-1598971457999-ca4ef48a9a71'],
  ['es', 'Espírito Santo', 'Sudeste', 'photo-1583417319070-4a69db38a482'],
  ['go', 'Goiás', 'Centro-Oeste', 'photo-1503756234508-e50e498b26c8'],
  ['ma', 'Maranhão', 'Nordeste', 'photo-1583417457280-4ad4c5f63b0e'],
  ['mt', 'Mato Grosso', 'Centro-Oeste', 'photo-1561361058-c24cecae35ca'],
  ['ms', 'Mato Grosso do Sul', 'Centro-Oeste', 'photo-1503756234508-e50e498b26c8'],
  ['mg', 'Minas Gerais', 'Sudeste', 'photo-1531761535209-180857e963b9'],
  ['pa', 'Pará', 'Norte', 'photo-1507003211169-0a1dd7228f2d'],
  ['pb', 'Paraíba', 'Nordeste', 'photo-1560472355-536de3962603'],
  ['pr', 'Paraná', 'Sul', 'photo-1610741083757-34e0a0e0f4ec'],
  ['pe', 'Pernambuco', 'Nordeste', 'photo-1559825481-12a05cc00344'],
  ['pi', 'Piauí', 'Nordeste', 'photo-1474314170901-f351b68f544f'],
  ['rj', 'Rio de Janeiro', 'Sudeste', 'photo-1483729558449-99ef09a8c325'],
  ['rn', 'Rio Grande do Norte', 'Nordeste', 'photo-1583417457280-4ad4c5f63b0e'],
  ['rs', 'Rio Grande do Sul', 'Sul', 'photo-1531761535209-180857e963b9'],
  ['ro', 'Rondônia', 'Norte', 'photo-1516026672322-bc52d61a55d5'],
  ['rr', 'Roraima', 'Norte', 'photo-1614530842449-86b64c84e06d'],
  ['sc', 'Santa Catarina', 'Sul', 'photo-1560472355-536de3962603'],
  ['sp', 'São Paulo', 'Sudeste', 'photo-1533060215434-e2093bf5c7c7'],
  ['se', 'Sergipe', 'Nordeste', 'photo-1549918864-48ac978761a4'],
  ['to', 'Tocantins', 'Norte', 'photo-1503756234508-e50e498b26c8'],
];

const regions = ['Norte', 'Nordeste', 'Centro-Oeste', 'Sudeste', 'Sul'];

const regionColors: Record<string, string> = {
  Norte: '#0e7c3a',
  Nordeste: '#d4a017',
  'Centro-Oeste': '#8b3a9e',
  Sudeste: '#004a99',
  Sul: '#c0392b',
};

export const metadata = {
  title: 'Destinos do Brasil | Descubra o Brasil',
  description: 'Explore todos os 26 estados e o Distrito Federal do Brasil. Descubra destinos, atrações, cultura e experiências em cada canto do país.',
};

export default function Turismo() {
  return (
    <>
      <Navbar />
      <main className="cine-site">

        {/* ── Hero da página ── */}
        <section
          style={{
            position: 'relative',
            minHeight: '55vh',
            display: 'flex',
            alignItems: 'flex-end',
            background: 'linear-gradient(135deg, #030d05, #071c18)',
            overflow: 'hidden',
          }}
          aria-labelledby="turismo-heading"
        >
          {/* Vídeo de fundo */}
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
            <source src="/media/brasil-menu-loop.mp4" type="video/mp4" />
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
              27 JEITOS DE CONHECER O PAÍS
            </p>
            <h1
              id="turismo-heading"
              style={{
                fontSize: 'clamp(38px, 6vw, 80px)',
                fontWeight: 350,
                lineHeight: 0.9,
                letterSpacing: '-0.07em',
                margin: '0 0 20px',
              }}
            >
              Escolha um estado.<br />
              <strong style={{ fontWeight: 900, color: '#d4a017' }}>Comece uma história.</strong>
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 15, lineHeight: 1.7, maxWidth: 540, margin: 0 }}>
              Explore destinos, cultura e experiências em todas as regiões.
              Confirme detalhes com os responsáveis antes de viajar.
            </p>
          </div>
        </section>

        {/* ── Filtro por região ── */}
        <div
          style={{
            background: 'var(--panel)',
            borderBottom: '1px solid var(--line)',
            position: 'sticky',
            top: 66,
            zIndex: 30,
          }}
          role="navigation"
          aria-label="Filtrar por região"
        >
          <div className="cine-container" style={{ display: 'flex', gap: 8, padding: '14px 0', flexWrap: 'wrap' }}>
            <span style={{ fontSize: 11, fontWeight: 750, color: 'var(--muted)', letterSpacing: '0.12em', alignSelf: 'center', marginRight: 8 }}>
              REGIÕES:
            </span>
            {regions.map(region => (
              <a
                key={region}
                href={`#${region.toLowerCase().replace('-', '')}`}
                style={{
                  padding: '6px 16px',
                  fontSize: 12,
                  fontWeight: 700,
                  borderRadius: 999,
                  border: `1px solid ${regionColors[region]}40`,
                  color: regionColors[region],
                  textDecoration: 'none',
                  transition: 'all 0.25s ease',
                  background: `${regionColors[region]}0d`,
                }}
              >
                {region}
              </a>
            ))}
          </div>
        </div>

        {/* ── Grid por regiões ── */}
        <div className="cine-section" style={{ paddingTop: 'clamp(48px, 5vw, 80px)' }}>
          <div className="cine-container">
            {regions.map(region => {
              const regionStates = states.filter(([, , r]) => r === region);
              return (
                <div
                  key={region}
                  id={region.toLowerCase().replace('-', '')}
                  style={{ marginBottom: 'clamp(48px, 6vw, 80px)' }}
                >
                  {/* Cabeçalho da região */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 24 }}>
                    <span style={{
                      width: 10,
                      height: 10,
                      borderRadius: '50%',
                      background: regionColors[region],
                      flexShrink: 0,
                    }} aria-hidden="true" />
                    <h2 style={{
                      fontSize: 'clamp(16px, 2vw, 22px)',
                      fontWeight: 750,
                      letterSpacing: '-0.03em',
                      margin: 0,
                      color: regionColors[region],
                    }}>
                      Região {region}
                    </h2>
                    <span style={{
                      fontSize: 11,
                      color: 'var(--muted)',
                      marginLeft: 4,
                    }}>
                      {regionStates.length} {regionStates.length === 1 ? 'estado' : 'estados'}
                    </span>
                  </div>

                  {/* Cards de estados */}
                  <div className="cine-states-grid">
                    {regionStates.map(([slug, name, , img], i) => (
                      <Link
                        href={`/turismo/${slug}`}
                        key={slug}
                        className="cine-state-card"
                        aria-label={`Explorar ${name}`}
                      >
                        <img
                          src={`https://images.unsplash.com/${img}?auto=format&fit=crop&w=400&q=75`}
                          alt={`Paisagem de ${name}`}
                          loading="lazy"
                          width={400}
                          height={300}
                        />
                        <div className="cine-state-card-overlay" aria-hidden="true" />
                        <div className="cine-state-card-info">
                          <p className="cine-state-card-region">{region}</p>
                          <h3 className="cine-state-card-name">{name}</h3>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── CTA final ── */}
        <div
          style={{
            background: 'linear-gradient(135deg, #030d05, #071c18)',
            padding: 'clamp(48px, 6vw, 80px) 0',
            textAlign: 'center',
            color: '#fff',
          }}
        >
          <div className="cine-container">
            <p className="cine-section-kicker" style={{ color: '#d4a017', justifyContent: 'center' }}>
              INTELIGÊNCIA ARTIFICIAL
            </p>
            <h2 style={{ fontSize: 'clamp(26px, 4vw, 48px)', fontWeight: 500, letterSpacing: '-0.05em', margin: '0 0 16px' }}>
              Não sabe por onde começar?
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 15, marginBottom: 32, maxWidth: 480, margin: '0 auto 32px' }}>
              A Maya pode montar seu roteiro personalizado baseado nas suas preferências,
              orçamento e tempo disponível.
            </p>
            <a
              href="/app/index.html#noticias"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 10,
                padding: '14px 28px',
                background: 'linear-gradient(135deg, #0e7c3a, #085c2b)',
                color: '#fff',
                borderRadius: 999,
                fontWeight: 750,
                fontSize: 13,
                letterSpacing: '0.06em',
                textDecoration: 'none',
                boxShadow: '0 8px 28px rgba(14, 124, 58, 0.45)',
              }}
            >
              ✨ Perguntar à Maya
            </a>
          </div>
        </div>

      </main>

      <FooterSection />
      <MayaChat />
    </>
  );
}
