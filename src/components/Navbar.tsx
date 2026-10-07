"use client";
import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { Sun, Moon, X, Sparkles, Home, Users, Mail } from 'lucide-react';
import { useTheme } from 'next-themes';
import { assetPath } from '@/lib/assetPath';
import { motion, AnimatePresence } from 'framer-motion';

const mainLinks = [
  { href: '/', label: 'Início', icon: Home },
  { href: '/quem-somos', label: 'Quem Somos', icon: Users },
  { href: '/anuncie', label: 'Contato', icon: Mail },
];

const mobileLinks = mainLinks;

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { resolvedTheme, setTheme } = useTheme();
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    setMounted(true);
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Fechar menu ao apertar Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  // Bloquear scroll quando mobile menu aberto
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  return (
    <>
      <nav
        ref={navRef}
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
            {mainLinks.map(({ href, label }) => (
              <Link
                href={href}
                key={label}
                className="cine-nav-link"
                role="listitem"
              >
                {label}
              </Link>
            ))}
          </div>

          {/* Ações */}
          <div className="cine-nav-actions">
            <a className="cine-social-nav" href="https://wa.me/5561995659907" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">
              <svg viewBox="0 0 32 32" aria-hidden="true"><path fill="currentColor" d="M16 3a13 13 0 0 0-11.1 19.8L3 29l6.4-1.7A13 13 0 1 0 16 3Zm0 23.7a10.7 10.7 0 0 1-5.5-1.5l-.4-.2-3.8 1 1-3.7-.2-.4A10.7 10.7 0 1 1 16 26.7Z"/></svg>
            </a>
            <span className="cine-social-nav" aria-label="Instagram em configuração" title="Instagram em configuração">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r=".8" fill="currentColor"/></svg>
            </span>
            {/* Maya */}
            <a
              className="cine-maya-btn"
              href={assetPath('/app/index.html#noticias')}
              aria-label="Perguntar à Maya IA"
            >
              <Sparkles size={14} aria-hidden="true" />
              <span>Maya IA</span>
            </a>

            {/* Tema */}
            {mounted && (
              <button
                onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
                className="cine-theme-btn"
                aria-label={resolvedTheme === 'dark' ? 'Ativar tema claro' : 'Ativar tema escuro'}
              >
                {resolvedTheme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
              </button>
            )}

            {/* Abrir App */}
            <a className="cine-app-btn" href="#baixar-app">
              Baixar para smartphone
            </a>

            {/* Menu mobile */}
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
            {/* Fundo com vídeo */}
            <video
              className="cine-mobile-bg-video"
              autoPlay muted loop playsInline
              aria-hidden="true"
            >
              <source src={assetPath('/media/brasil-menu-loop.mp4')} type="video/mp4" />
            </video>
            <div className="cine-mobile-overlay-shade" aria-hidden="true" />

            {/* Conteúdo */}
            <div className="cine-mobile-content">
              {/* Header do menu */}
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

              {/* Links */}
              <nav className="cine-mobile-links" aria-label="Menu móvel">
                {mobileLinks.map(({ href, label, icon: Icon }, i) => (
                  <motion.div
                    key={label}
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.06, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <Link
                      href={href}
                      className="cine-mobile-link"
                      onClick={() => setOpen(false)}
                    >
                      <span className="cine-mobile-link-icon" aria-hidden="true"><Icon size={18} /></span>
                      {label}
                    </Link>
                  </motion.div>
                ))}
              </nav>

              {/* Ações rápidas */}
              <motion.div
                className="cine-mobile-quick"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.5 }}
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

              {/* Rodapé */}
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
