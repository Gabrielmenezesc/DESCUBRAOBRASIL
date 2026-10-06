"use client";
import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { Sun, Moon, X, Sparkles, MapPin, Compass, Users, Megaphone, ChevronDown, Info, Building2, ShieldCheck, Home, Map, Waves, Award } from 'lucide-react';
import { useTheme } from 'next-themes';
import { assetPath } from '@/lib/assetPath';
import { motion, AnimatePresence } from 'framer-motion';

const mainNav = [
  { href: '/', label: 'Início' },
  { href: '/turismo', label: 'Destinos' },
  { href: '/aventura', label: 'Experiências' },
  { href: '/turismo', label: 'Mapa 3D' },
  {
    label: 'Saiba Mais',
    submenu: [
      { href: '/quem-somos', label: 'Quem Somos' },
      { href: '/anuncie', label: 'Anuncie Aqui' },
      { href: '/empresas', label: 'Para Empresas' },
      { href: '/termos', label: 'Termos de Uso' },
      { href: '/privacidade', label: 'Privacidade' },
    ]
  },
  { href: '/anuncie', label: 'Parceiros' },
];

const mobileNav = [
  { href: '/', label: 'Início', icon: Home },
  { href: '/turismo', label: 'Destinos & Cidades', icon: Map },
  { href: '/aventura', label: 'Experiências', icon: Waves },
  { href: '/quem-somos', label: 'Quem Somos', icon: Info },
  { href: '/anuncie', label: 'Parceiros & Anuncie', icon: Megaphone },
  { href: '/empresas', label: 'Para Empresas', icon: Building2 },
  { href: '/termos', label: 'Termos de Uso', icon: ShieldCheck },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [saibaMaisOpen, setSaibaMaisOpen] = useState(false);
  const { resolvedTheme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') { setOpen(false); setSaibaMaisOpen(false); } };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  return (
    <>
      <nav
        className={`cine-nav ${scrolled ? 'cine-nav--scrolled' : 'cine-nav--top'}`}
        aria-label="Navegação principal"
      >
        <div className="cine-nav-inner">
          {/* Brand */}
          <Link href="/" className="cine-brand" aria-label="Descubra o Brasil — Página inicial">
            <span className="cine-brand-logo" aria-hidden="true">◆</span>
            <span className="cine-brand-text">
              descubra<strong>o brasil</strong>
              <small>TURISMO · TECNOLOGIA · IA</small>
            </span>
          </Link>

          {/* Links desktop */}
          <div className="cine-nav-links" role="list">
            {mainNav.map((item) => (
              item.submenu ? (
                <div
                  key={item.label}
                  style={{ position: 'relative' }}
                  onMouseEnter={() => setSaibaMaisOpen(true)}
                  onMouseLeave={() => setSaibaMaisOpen(false)}
                >
                  <button
                    className="cine-nav-link"
                    style={{ display: 'flex', alignItems: 'center', gap: 4, background: 'none', border: 'none', cursor: 'pointer' }}
                    onClick={() => setSaibaMaisOpen(!saibaMaisOpen)}
                    aria-expanded={saibaMaisOpen}
                  >
                    {item.label}
                    <ChevronDown size={14} style={{ transform: saibaMaisOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
                  </button>

                  <AnimatePresence>
                    {saibaMaisOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.2 }}
                        style={{
                          position: 'absolute',
                          top: '100%',
                          left: 0,
                          minWidth: 180,
                          background: 'rgba(5, 20, 8, 0.95)',
                          backdropFilter: 'blur(20px)',
                          border: '1px solid rgba(255, 255, 255, 0.12)',
                          borderRadius: 14,
                          padding: '8px',
                          boxShadow: '0 12px 30px rgba(0,0,0,0.3)',
                          zIndex: 10,
                        }}
                      >
                        {item.submenu.map((sub) => (
                          <Link
                            key={sub.label}
                            href={sub.href}
                            className="cine-nav-link"
                            style={{ display: 'block', width: '100%', textAlign: 'left', padding: '10px 14px' }}
                            onClick={() => setSaibaMaisOpen(false)}
                          >
                            {sub.label}
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <Link
                  href={item.href}
                  key={item.label}
                  className="cine-nav-link"
                  role="listitem"
                >
                  {item.label}
                </Link>
              )
            ))}
          </div>

          {/* Ações */}
          <div className="cine-nav-actions">
            <a
              className="cine-maya-btn"
              href={assetPath('/app/index.html#noticias')}
              aria-label="Perguntar à Maya IA"
            >
              <Sparkles size={14} aria-hidden="true" />
              <span>Maya IA</span>
            </a>

            {mounted && (
              <button
                onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
                className="cine-theme-btn"
                aria-label={resolvedTheme === 'dark' ? 'Ativar tema claro' : 'Ativar tema escuro'}
              >
                {resolvedTheme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
              </button>
            )}

            <a className="cine-app-btn" href={assetPath('/app/index.html')}>
              Abrir App
            </a>

            <button
              className="cine-menu-toggle"
              aria-label={open ? 'Fechar menu' : 'Abrir menu'}
              aria-expanded={open}
              aria-controls="mobile-menu"
              onClick={() => setOpen(!open)}
            >
              <span className={`cine-hamburger ${open ? 'is-open' : ''}`}>
                <span /><span /><span />
              </span>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu — Tela Inteira */}
      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Menu de navegação"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="cine-mobile-overlay"
          >
            <video
              className="cine-mobile-bg-video"
              autoPlay muted loop playsInline
              aria-hidden="true"
            >
              <source src={assetPath('/media/brasil-menu-loop.mp4')} type="video/mp4" />
            </video>
            <div className="cine-mobile-overlay-shade" aria-hidden="true" />

            <div className="cine-mobile-content">
              <div className="cine-mobile-header">
                <Link href="/" className="cine-brand cine-brand--white" onClick={() => setOpen(false)}>
                  <span className="cine-brand-logo" aria-hidden="true">◆</span>
                  <span className="cine-brand-text">
                    descubra<strong>o brasil</strong>
                  </span>
                </Link>
                <button
                  onClick={() => setOpen(false)}
                  className="cine-close-btn"
                  aria-label="Fechar menu"
                >
                  <X size={22} />
                </button>
              </div>

              <nav className="cine-mobile-links" aria-label="Menu móvel">
                {mobileNav.map(({ href, label, icon: Icon }, i) => (
                  <motion.div
                    key={label}
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05, duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <Link
                      href={href}
                      className="cine-mobile-link"
                      onClick={() => setOpen(false)}
                    >
                      <span className="cine-mobile-link-icon" aria-hidden="true">
                        <Icon size={20} />
                      </span>
                      {label}
                    </Link>
                  </motion.div>
                ))}
              </nav>

              <motion.div
                className="cine-mobile-quick"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.4 }}
              >
                <a
                  href={assetPath('/app/index.html#noticias')}
                  className="cine-mobile-quick-btn"
                  onClick={() => setOpen(false)}
                >
                  <Sparkles size={16} aria-hidden="true" />
                  Perguntar à Maya
                </a>
                <a
                  href={assetPath('/app/index.html')}
                  className="cine-mobile-quick-btn cine-mobile-quick-btn--primary"
                  onClick={() => setOpen(false)}
                >
                  Abrir App
                </a>
              </motion.div>

              <p className="cine-mobile-footer-text">
                Um país. Infinitas possibilidades.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
