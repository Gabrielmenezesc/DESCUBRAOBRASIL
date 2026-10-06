import Link from 'next/link';
import { assetPath } from '@/lib/assetPath';

const navCols = [
  {
    title: 'Destinos & Cidades',
    links: [
      { href: '/turismo', label: 'Todos os Estados' },
      { href: '/turismo/rj', label: 'Rio de Janeiro' },
      { href: '/turismo/ba', label: 'Bahia' },
      { href: '/turismo/am', label: 'Amazonas' },
      { href: '/turismo/pr', label: 'Paraná' },
      { href: '/turismo/df', label: 'Brasília' },
    ],
  },
  {
    title: 'Plataforma & IA',
    links: [
      { href: assetPath('/app/index.html'), label: 'Abrir Aplicativo', external: true },
      { href: assetPath('/app/index.html#noticias'), label: 'Maya IA Assistente', external: true },
      { href: assetPath('/app/index.html#jogos'), label: 'Games Culturais', external: true },
      { href: assetPath('/app/index.html#ofertas'), label: 'Ofertas & Descontos', external: true },
      { href: '/aventura', label: 'Experiências' },
    ],
  },
  {
    title: 'Saiba Mais',
    links: [
      { href: '/quem-somos', label: 'Quem Somos' },
      { href: '/empresas', label: 'Para Empresas' },
      { href: '/anuncie', label: 'Parceiros & Anuncie' },
      { href: '/termos', label: 'Termos de Uso' },
      { href: '/privacidade', label: 'Privacidade' },
    ],
  },
];

const socialIcons = {
  whatsapp: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12.012 2c-5.506 0-9.989 4.478-9.99 9.984 0 1.762.459 3.479 1.332 4.992l-1.416 5.17 5.291-1.387c1.455.794 3.097 1.21 4.78 1.211h.004c5.505 0 9.988-4.478 9.989-9.985.001-2.668-1.034-5.177-2.918-7.062a9.92 9.92 0 0 0-7.062-2.923zm.004 1.737c4.545 0 8.247 3.701 8.248 8.247 0 2.201-.856 4.27-2.41 5.823a8.19 8.19 0 0 1-5.836 2.413h-.003c-1.472 0-2.916-.395-4.175-1.144l-.299-.178-3.104.813.827-3.021-.195-.311c-.822-1.309-1.258-2.825-1.257-4.394.001-4.546 3.703-8.248 8.249-8.248zm-3.568 4.41c-.22 0-.58.082-.884.413-.304.331-1.16 1.134-1.16 2.766s1.189 3.208 1.354 3.428c.166.22 2.304 3.518 5.582 4.933.78.337 1.389.538 1.864.689.783.249 1.496.214 2.06.13.629-.094 1.933-.79 2.204-1.554.271-.764.271-1.417.19-1.554-.081-.137-.301-.22-.629-.384s-1.933-.954-2.231-1.062c-.298-.108-.515-.162-.732.162-.218.324-.843 1.062-1.034 1.28-.19.218-.381.245-.709.081-.328-.163-1.385-.511-2.639-1.628-.976-.87-1.635-1.944-1.826-2.271-.19-.328-.02-.505.144-.668.148-.147.328-.381.492-.572.164-.191.218-.328.328-.546.109-.218.055-.409-.027-.572-.082-.163-.732-1.766-1.003-2.417-.264-.634-.533-.548-.732-.558-.19-.01-.409-.01-.629-.01z"/>
    </svg>
  ),
  instagram: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
    </svg>
  ),
  youtube: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
    </svg>
  ),
  tiktok: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.89 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.27 0 .54.04.79.11V9.43a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V9.05a8.28 8.28 0 0 0 4.77 1.5v-3.86a4.83 4.83 0 0 1-1.0.0z"/>
    </svg>
  )
};

const socials = [
  {
    label: 'WhatsApp',
    href: 'https://wa.me/5561995659907',
    icon: socialIcons.whatsapp,
    external: true,
  },
  {
    label: 'Instagram',
    href: 'https://instagram.com/descubraobrasil.oficial',
    icon: socialIcons.instagram,
    external: true,
  },
  {
    label: 'YouTube',
    href: 'https://youtube.com/@descubraobrasil',
    icon: socialIcons.youtube,
    external: true,
  },
  {
    label: 'TikTok',
    href: 'https://tiktok.com/@descubraobrasil',
    icon: socialIcons.tiktok,
    external: true,
  },
];

export default function FooterSection() {
  return (
    <footer className="cine-footer" aria-label="Rodapé do Descubra o Brasil">
      <div className="cine-container">
        <div className="cine-footer-grid">
          {/* Marca e parceiros em destaque */}
          <div>
            <Link href="/" className="cine-footer-brand" aria-label="Descubra o Brasil — Página inicial">
              <div className="cine-footer-brand-name">
                descubra <span>o brasil</span>
              </div>
            </Link>
            <p className="cine-footer-desc">
              Conectamos a curiosidade de quem viaja com a identidade de cada lugar.
              Tecnologia, turismo e inteligência artificial a serviço do Brasil.
            </p>

            {/* Marcas Parceiras de Destaque no Rodapé */}
            <div style={{ marginBottom: 20, paddingTop: 12, borderTop: '1px solid rgba(255,255,255,0.08)' }}>
              <span style={{ fontSize: 9, letterSpacing: '0.18em', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', fontWeight: 800, display: 'block', marginBottom: 8 }}>
                PARCEIROS DE DESTAQUE
              </span>
              <div style={{ display: 'flex', gap: 12, fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.7)' }}>
                <span>diRoma</span>
                <span>·</span>
                <span>Rede Brasília Digital</span>
              </div>
            </div>

            {/* Redes sociais */}
            <div className="cine-footer-socials" aria-label="Redes sociais">
              {socials.map(({ label, href, icon, external }) => (
                <a
                  key={label}
                  href={href}
                  className="cine-footer-social"
                  aria-label={label}
                  target={external ? '_blank' : undefined}
                  rel={external ? 'noopener noreferrer' : undefined}
                >
                  {icon}
                </a>
              ))}
            </div>
          </div>

          {/* Colunas de navegação */}
          {navCols.map(({ title, links }) => (
            <div key={title}>
              <h3 className="cine-footer-col-title">{title}</h3>
              <nav className="cine-footer-links" aria-label={title}>
                {links.map(({ href, label, external }) => (
                  external ? (
                    <a
                      key={label}
                      href={href}
                      className="cine-footer-link"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {label}
                    </a>
                  ) : (
                    <Link key={label} href={href} className="cine-footer-link">
                      {label}
                    </Link>
                  )
                ))}
              </nav>
            </div>
          ))}
        </div>

        {/* Rodapé inferior */}
        <div className="cine-footer-bottom">
          <span>
            Descubra o Brasil · {new Date().getFullYear()} ·{' '}
            <span style={{ color: '#d4a017' }}>Um país. Infinitas possibilidades.</span>
          </span>
          <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
            <Link href="/quem-somos" className="cine-footer-link">Quem Somos</Link>
            <Link href="/anuncie" className="cine-footer-link">Anuncie Aqui</Link>
            <Link href="/termos" className="cine-footer-link">Termos de Uso</Link>
            <Link href="/privacidade" className="cine-footer-link">Privacidade</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
