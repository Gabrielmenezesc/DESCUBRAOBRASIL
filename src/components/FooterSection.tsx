import Link from 'next/link';
import { assetPath } from '@/lib/assetPath';

const navCols = [
  {
    title: 'Explorar',
    links: [
      { href: '/turismo', label: 'Todos os Destinos' },
      { href: '/turismo/rj', label: 'Rio de Janeiro' },
      { href: '/turismo/ba', label: 'Bahia' },
      { href: '/turismo/am', label: 'Amazonas' },
      { href: '/turismo/pr', label: 'Paraná' },
      { href: '/turismo/df', label: 'Brasília' },
    ],
  },
  {
    title: 'Plataforma',
    links: [
      { href: assetPath('/app/index.html'), label: 'Abrir App', external: true },
      { href: assetPath('/app/index.html#noticias'), label: 'Maya IA', external: true },
      { href: assetPath('/app/index.html#jogos'), label: 'Jogos Culturais', external: true },
      { href: assetPath('/app/index.html#ofertas'), label: 'Ofertas', external: true },
      { href: '/aventura', label: 'Experiências' },
    ],
  },
  {
    title: 'Empresa',
    links: [
      { href: '/quem-somos', label: 'Quem Somos' },
      { href: '/contato', label: 'Contato' },
      { href: '/empresas', label: 'Para Empresas' },
      { href: '/anuncie', label: 'Anuncie Aqui' },
      { href: '/termos', label: 'Termos de Uso' },
      { href: '/privacidade', label: 'Privacidade' },
    ],
  },
];

const socials = [
  {
    label: 'WhatsApp',
    href: 'https://wa.me/5561985630128',
    iconUrl: 'https://cdn.simpleicons.org/whatsapp/FFFFFF',
    external: true,
  },
  {
    label: 'Instagram',
    href: 'https://www.instagram.com/descubrabrasiloficial/',
    iconUrl: 'https://cdn.simpleicons.org/instagram/FFFFFF',
    external: true,
  },
  {
    label: 'YouTube',
    href: '#',
    iconUrl: 'https://cdn.simpleicons.org/youtube/FFFFFF',
    external: true,
    disabled: true,
  },
  {
    label: 'TikTok',
    href: '#',
    iconUrl: 'https://cdn.simpleicons.org/tiktok/FFFFFF',
    external: true,
    disabled: true,
  },
];

export default function FooterSection() {
  return (
    <footer className="cine-footer" aria-label="Rodapé do Descubra o Brasil">
      <div className="cine-container">
        {/* Grid principal */}
        <div className="cine-footer-grid">
          {/* Coluna da marca */}
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

            {/* Redes sociais */}
            <div className="cine-footer-socials" aria-label="Redes sociais">
              {socials.map(({ label, href, iconUrl, external, disabled }) => (
                disabled ? (
                  <span
                    key={label}
                    className="cine-footer-social"
                    aria-label={`${label} (em breve)`}
                    title={`${label} — em breve`}
                    style={{ cursor: 'default', opacity: 0.4 }}
                  >
                    <img src={iconUrl} alt="" aria-hidden="true" width={20} height={20} />
                  </span>
                ) : (
                  <a
                    key={label}
                    href={href}
                    className="cine-footer-social"
                    aria-label={label}
                    target={external ? '_blank' : undefined}
                    rel={external ? 'noopener noreferrer' : undefined}
                  >
                    <img src={iconUrl} alt="" aria-hidden="true" width={20} height={20} />
                  </a>
                )
              ))}
            </div>
          </div>

          {/* Colunas de links */}
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
            <Link href="/termos" className="cine-footer-link">Termos de Uso</Link>
            <Link href="/privacidade" className="cine-footer-link">Privacidade</Link>
            <a
              href="mailto:descubrabrasil@gmail.com"
              className="cine-footer-link"
            >
              Contato
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

