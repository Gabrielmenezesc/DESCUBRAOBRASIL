"use client";

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { ArrowRight, ArrowUpRight, Sparkles, Compass, MapPin, Map as MapIcon, Play, Sun, Trees, Mountain, Utensils, Landmark, Hotel, Calendar, Coins, Users, Heart, Waves, Info, ShieldCheck, Building2, Award } from 'lucide-react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import dynamic from 'next/dynamic';
import Navbar from './Navbar';
import FooterSection from './FooterSection';
import MayaChat from './MayaChat';
import { assetPath } from '@/lib/assetPath';

const Globe = dynamic(() => import('./Globe'), { ssr: false });

/* ── Dados ─────────────────────────────────────────────────────────────────── */

const destinations = [
  {
    name: 'Rio de Janeiro',
    uf: 'rj',
    region: 'SUDESTE',
    tagline: 'Entre a cidade e o mar',
    image: 'photo-1483729558449-99ef09a8c325',
  },
  {
    name: 'Bahia',
    uf: 'ba',
    region: 'NORDESTE',
    tagline: 'Histórias em cada encontro',
    image: 'photo-1549918864-48ac978761a4',
  },
  {
    name: 'Amazonas',
    uf: 'am',
    region: 'NORTE',
    tagline: 'Outro tempo. Outra natureza.',
    image: 'photo-1516026672322-bc52d61a55d5',
  },
  {
    name: 'Fernando de Noronha',
    uf: 'pe',
    region: 'NORDESTE',
    tagline: 'O paraíso no meio do oceano',
    image: 'photo-1559825481-12a05cc00344',
  },
  {
    name: 'Iguaçu',
    uf: 'pr',
    region: 'SUL',
    tagline: 'A maior força da natureza',
    image: 'photo-1610741083757-34e0a0e0f4ec',
  },
  {
    name: 'Brasília',
    uf: 'df',
    region: 'CENTRO-OESTE',
    tagline: 'Arquitetura que define o futuro',
    image: 'photo-1598971457999-ca4ef48a9a71',
  },
];

const categories = [
  { icon: Sun, label: 'Praias', img: 'photo-1559825481-12a05cc00344', href: '/aventura#praias' },
  { icon: Trees, label: 'Natureza', img: 'photo-1516026672322-bc52d61a55d5', href: '/aventura#natureza' },
  { icon: Mountain, label: 'Aventura', img: 'photo-1610741083757-34e0a0e0f4ec', href: '/aventura' },
  { icon: Utensils, label: 'Gastronomia', img: 'photo-1414235077428-338989a2e8c0', href: '/aventura#gastronomia' },
  { icon: Landmark, label: 'Cultura', img: 'photo-1598971457999-ca4ef48a9a71', href: '/aventura#cultura' },
  { icon: Hotel, label: 'Hotéis', img: 'photo-1566073771259-6a8506099945', href: '/ofertas' },
  { icon: Calendar, label: 'Eventos', img: 'photo-1549918864-48ac978761a4', href: '/aventura#eventos' },
  { icon: Coins, label: 'Grátis', img: 'photo-1483729558449-99ef09a8c325', href: '/aventura#gratis' },
  { icon: Users, label: 'Família', img: 'photo-1530521954074-e64f6810b32d', href: '/aventura#familia' },
  { icon: Heart, label: 'Romance', img: 'photo-1474314170901-f351b68f544f', href: '/aventura#romance' },
];

const whatWeDo = [
  { icon: MapPin, title: 'Descoberta de Destinos', desc: 'Explore lugares incríveis em todos os estados do Brasil com informações oficiais e nítidas.' },
  { icon: Compass, title: 'Planejamento de Viagens', desc: 'Monte seu roteiro personalizado com paradas e experiências que combinam com seu perfil.' },
  { icon: Sparkles, title: 'Assistente Maya IA', desc: 'Pergunte qualquer coisa sobre turismo no Brasil com recomendações dinâmicas e visuais.' },
  { icon: MapIcon, title: 'Mapa Interativo 3D', desc: 'Explore o Brasil em 3D. Veja estados, cidades e pontos turísticos com marcadores ativos.' },
  { icon: Landmark, title: 'Notícias de Turismo', desc: 'Acompanhe novidades e informações do turismo brasileiro com fontes oficiais verificadas.' },
  { icon: Building2, title: 'Para Empresas', desc: 'Apresente seu hotel, parque ou restaurante para viajantes que estão planejando sua viagem.' },
  { icon: Coins, title: 'Lugares Gratuitos', desc: 'Descubra atrações, parques públicos e patrimônios sem custo em todo o país.' },
  { icon: Award, title: 'Games Culturais', desc: 'Aprenda sobre o Brasil de forma divertida com quizzes, pares e passaporte de visitas.' },
];

const stories = [
  { label: 'Rio', img: 'photo-1483729558449-99ef09a8c325', href: '/turismo/rj' },
  { label: 'Salvador', img: 'photo-1549918864-48ac978761a4', href: '/turismo/ba' },
  { label: 'Amazônia', img: 'photo-1516026672322-bc52d61a55d5', href: '/turismo/am' },
  { label: 'Noronha', img: 'photo-1559825481-12a05cc00344', href: '/turismo/pe' },
  { label: 'Iguaçu', img: 'photo-1610741083757-34e0a0e0f4ec', href: '/turismo/pr' },
  { label: 'Brasília', img: 'photo-1598971457999-ca4ef48a9a71', href: '/turismo/df' },
  { label: 'Bonito', img: 'photo-1503756234508-e50e498b26c8', href: '/turismo/ms' },
  { label: 'Ceará', img: 'photo-1595965340046-bd3f8cd01024', href: '/turismo/ce' },
];

const ribbonItems = [
  'NATUREZA', 'CULTURA', 'GASTRONOMIA', 'DESCOBERTAS', 'CONEXÕES LOCAIS',
  'AVENTURA', 'PRAIAS', 'HISTÓRIA', 'TURISMO SUSTENTÁVEL', 'EXPERIÊNCIAS',
  'NATUREZA', 'CULTURA', 'GASTRONOMIA', 'DESCOBERTAS', 'CONEXÕES LOCAIS',
];

const UNSPLASH = 'https://images.unsplash.com';

function unsplash(id: string, w = 900) {
  return `${UNSPLASH}/${id}?auto=format&fit=crop&w=${w}&q=80`;
}

export default function ProfessionalHome() {
  const [intro, setIntro] = useState(false);
  const [q, setQ] = useState('');
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '18%']);

  useEffect(() => {
    setIntro(sessionStorage.getItem('brasil-intro-seen') !== '1');
  }, []);

  const closeIntro = () => {
    sessionStorage.setItem('brasil-intro-seen', '1');
    setIntro(false);
  };

  return (
    <>
      {/* ── Abertura cinematográfica ── */}
      <AnimatePresence>
        {intro && (
          <motion.div
            className="cine-opening"
            role="dialog"
            aria-modal="true"
            aria-label="Boas-vindas ao Descubra o Brasil"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.04 }}
            transition={{ duration: 0.7 }}
          >
            <video
              className="cine-opening-video"
              autoPlay muted loop playsInline preload="auto"
              aria-hidden="true"
            >
              <source src={assetPath('/media/brasil-menu-loop.mp4')} type="video/mp4" />
            </video>
            <div className="cine-opening-shade" aria-hidden="true" />

            <div className="cine-opening-content">
              <motion.span
                className="cine-opening-kicker"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.6 }}
              >
                UMA EXPERIÊNCIA CHAMADA
              </motion.span>

              <h1 className="cine-opening-title">
                <motion.span
                  initial={{ opacity: 0, y: 50, rotateX: -30 }}
                  animate={{ opacity: 1, y: 0, rotateX: 0 }}
                  transition={{ delay: 0.3, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                  style={{ display: 'block' }}
                >
                  DESCUBRA
                </motion.span>
                <motion.strong
                  initial={{ opacity: 0, y: 50, rotateX: -30 }}
                  animate={{ opacity: 1, y: 0, rotateX: 0 }}
                  transition={{ delay: 0.55, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                  style={{ display: 'block', color: '#d4a017', fontWeight: 900 }}
                >
                  O BRASIL
                </motion.strong>
              </h1>

              <motion.p
                className="cine-opening-slogan"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.7 }}
              >
                Um país. Infinitas possibilidades.
              </motion.p>

              <motion.p
                className="cine-opening-slogan-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.0, duration: 0.6 }}
              >
                Explore lugares. Viva experiências. Descubra o Brasil.
              </motion.p>

              <motion.div
                className="cine-opening-buttons"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.1, duration: 0.6 }}
              >
                <a
                  href="#destinos"
                  className="cine-btn-explore"
                  onClick={closeIntro}
                  style={{ padding: '14px 28px' }}
                >
                  <Compass size={16} aria-hidden="true" />
                  EXPLORAR AGORA
                </a>
                <a
                  href={assetPath('/app/index.html')}
                  className="cine-btn-app"
                  onClick={closeIntro}
                >
                  ABRIR APP
                </a>
                <a
                  href={assetPath('/app/index.html#noticias')}
                  className="cine-btn-maya"
                  onClick={closeIntro}
                >
                  <Sparkles size={14} aria-hidden="true" />
                  MAYA IA
                </a>
              </motion.div>

              <motion.button
                type="button"
                className="cine-opening-enter"
                onClick={closeIntro}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.4, duration: 0.6 }}
              >
                Entrar na experiência <ArrowRight size={18} aria-hidden="true" />
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <Navbar />

      <main className="cine-site">

        {/* ── HERO ────────────────────────────────────────────────────────── */}
        <section
          ref={heroRef}
          className="cine-hero-stage"
          aria-label="Bem-vindo ao Descubra o Brasil"
        >
          <motion.video
            className="cine-hero-video"
            autoPlay muted loop playsInline preload="metadata"
            aria-hidden="true"
            style={{ y: heroY }}
          >
            <source src={assetPath('/media/brasil-menu-loop.mp4')} type="video/mp4" />
          </motion.video>
          <div className="cine-hero-overlay" aria-hidden="true" />

          <motion.div
            className="cine-hero-content"
            style={{ opacity: heroOpacity }}
          >
            {/* Copy */}
            <div className="cine-hero-copy">

              {/* Destaque de Identidade & Marcas Parceiras de Destaque no Topo */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20, flexWrap: 'wrap' }}>
                <span style={{ fontSize: 10, letterSpacing: '0.24em', fontWeight: 800, color: '#d4a017', textTransform: 'uppercase' }}>
                  PLATAFORMA NACIONAL
                </span>
                <span style={{ color: 'rgba(255,255,255,0.2)' }}>|</span>
                <span style={{ fontSize: 10, letterSpacing: '0.15em', color: 'rgba(255,255,255,0.6)', fontWeight: 700 }}>
                  PARCEIROS: diRoma · Rede Brasília Digital
                </span>
              </div>

              <h1 className="cine-hero-title">
                <motion.span
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                >
                  DESCUBRA
                </motion.span>
                <motion.strong
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                  style={{ color: '#d4a017' }}
                >
                  O BRASIL
                </motion.strong>
              </h1>

              <motion.p
                className="cine-hero-slogan"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9, duration: 0.7 }}
              >
                O país que surpreende a cada descoberta.
              </motion.p>

              <motion.p
                className="cine-hero-slogan-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.1, duration: 0.6 }}
              >
                Explore lugares. Viva experiências. Descubra o Brasil.
              </motion.p>

              {/* Busca inteligente */}
              <motion.div
                className="cine-search-wrapper"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2, duration: 0.6 }}
              >
                <form
                  className="cine-search"
                  action={assetPath('/app/index.html')}
                  aria-label="Busca de destinos"
                >
                  <label className="sr-only" htmlFor="hero-search">
                    Pergunte qualquer coisa sobre sua próxima viagem
                  </label>
                  <Compass size={18} style={{ color: 'rgba(255,255,255,0.45)', flexShrink: 0 }} aria-hidden="true" />
                  <input
                    id="hero-search"
                    name="q"
                    value={q}
                    onChange={e => setQ(e.target.value)}
                    placeholder="Pergunte qualquer coisa sobre sua próxima viagem..."
                    autoComplete="off"
                  />
                  <button type="submit" className="cine-search-btn" aria-label="Buscar">
                    <ArrowRight size={18} aria-hidden="true" />
                  </button>
                </form>
              </motion.div>

              {/* Botões */}
              <motion.div
                className="cine-hero-buttons"
                style={{ marginTop: 24 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.3, duration: 0.6 }}
              >
                <a href="#destinos" className="cine-btn-explore">
                  <MapPin size={16} aria-hidden="true" />
                  EXPLORAR AGORA
                </a>
                <a href={assetPath('/app/index.html')} className="cine-btn-app">
                  ABRIR APP
                </a>
                <a href={assetPath('/app/index.html#noticias')} className="cine-btn-maya">
                  <Sparkles size={14} aria-hidden="true" />
                  PERGUNTAR À MAYA
                </a>
              </motion.div>

              {/* Stats */}
              <motion.div
                className="cine-hero-stats"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5, duration: 0.8 }}
              >
                <div className="cine-hero-stat">
                  <strong>27</strong>
                  <span>Estados + DF</span>
                </div>
                <div className="cine-hero-stat">
                  <strong>5</strong>
                  <span>Regiões exploráveis</span>
                </div>
                <div className="cine-hero-stat">
                  <strong>Maya</strong>
                  <span>IA integrada</span>
                </div>
              </motion.div>
            </div>

            {/* Globe 3D */}
            <div className="cine-hero-globe" aria-label="Globo 3D interativo do Brasil">
              <Globe />
              <div style={{
                position: 'absolute',
                top: 18,
                left: 18,
                fontSize: 9,
                letterSpacing: '0.2em',
                color: 'rgba(255,255,255,0.4)',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
              }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#0e7c3a', display: 'block' }} />
                EXPLORAÇÃO 3D
              </div>
              <div style={{
                position: 'absolute',
                bottom: 18,
                left: 0,
                right: 0,
                textAlign: 'center',
                fontSize: 10,
                color: 'rgba(255,255,255,0.35)',
                letterSpacing: '0.12em',
              }}>
                Arraste para girar · Clique para explorar
              </div>
            </div>
          </motion.div>

          {/* Scroll indicator */}
          <div className="cine-scroll-indicator" aria-hidden="true">
            <div className="cine-scroll-line" />
            <span>SCROLL</span>
          </div>
        </section>

        {/* ── RIBBON ──────────────────────────────────────────────────────── */}
        <div className="cine-ribbon" aria-hidden="true">
          <div className="cine-ribbon-track">
            {ribbonItems.map((item, i) => (
              <span key={i} className="cine-ribbon-item">{item}</span>
            ))}
          </div>
        </div>

        {/* ── STORIES DE DESTINOS ─────────────────────────────────────────── */}
        <section className="cine-section" aria-labelledby="stories-heading">
          <div className="cine-container">
            <div className="cine-section-heading">
              <div>
                <p className="cine-section-kicker">DESCUBRA HOJE</p>
                <h2 id="stories-heading" className="cine-section-title">
                  Os destinos mais explorados
                </h2>
              </div>
              <Link href="/turismo" className="cine-link">
                Ver todos <ArrowUpRight size={16} aria-hidden="true" />
              </Link>
            </div>

            <div className="cine-stories" role="list">
              {stories.map(({ label, img, href }) => (
                <Link
                  key={label}
                  href={href}
                  className="cine-story"
                  role="listitem"
                  aria-label={`Explorar ${label}`}
                >
                  <div className="cine-story-ring">
                    <div className="cine-story-inner">
                      <img
                        src={unsplash(img, 200)}
                        alt={label}
                        loading="lazy"
                        width={82}
                        height={82}
                      />
                    </div>
                  </div>
                  <span className="cine-story-label">{label}</span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ── BRASIL EM MOVIMENTO (Film Grid) ─────────────────────────────── */}
        <section
          className="cine-section"
          style={{ paddingTop: 0 }}
          aria-labelledby="brasil-movimento"
        >
          <div className="cine-container">
            <div className="cine-section-heading">
              <div>
                <p className="cine-section-kicker">BRASIL EM MOVIMENTO</p>
                <h2 id="brasil-movimento" className="cine-section-title">
                  Paisagens que convidam<br />você a seguir viagem.
                </h2>
              </div>
              <p style={{ color: 'var(--muted)', fontSize: 14, maxWidth: 320, lineHeight: 1.7, margin: 0 }}>
                Do encontro entre cidade e natureza às rotas que conectam destinos.
              </p>
            </div>

            <div className="cine-film-grid">
              <article className="cine-film cine-film-wide">
                <video autoPlay muted loop playsInline preload="metadata">
                  <source src={assetPath('/media/litoral-brasil.mp4')} type="video/mp4" />
                </video>
                <div className="cine-film-overlay" aria-hidden="true" />
                <div className="cine-film-info">
                  <p className="cine-film-kicker">NATUREZA E LITORAL</p>
                  <h3 className="cine-film-title">Respire novos horizontes.</h3>
                  <a href={assetPath('/app/index.html#explorar')} className="cine-film-btn">
                    Explorar destinos <ArrowUpRight size={14} aria-hidden="true" />
                  </a>
                </div>
              </article>

              <article className="cine-film">
                <video autoPlay muted loop playsInline preload="metadata">
                  <source src={assetPath('/media/cidade-noturna.mp4')} type="video/mp4" />
                </video>
                <div className="cine-film-overlay" aria-hidden="true" />
                <div className="cine-film-info">
                  <p className="cine-film-kicker">VIDA URBANA</p>
                  <h3 className="cine-film-title">Descubra a cidade depois do pôr do sol.</h3>
                </div>
              </article>

              <article className="cine-film">
                <video autoPlay muted loop playsInline preload="metadata">
                  <source src={assetPath('/media/rotas-brasil.mp4')} type="video/mp4" />
                </video>
                <div className="cine-film-overlay" aria-hidden="true" />
                <div className="cine-film-info">
                  <p className="cine-film-kicker">ROTAS E CONEXÕES</p>
                  <h3 className="cine-film-title">Planeje caminhos que combinam com você.</h3>
                </div>
              </article>
            </div>
          </div>
        </section>

        {/* ── DESTINOS EM DESTAQUE ─────────────────────────────────────────── */}
        <section className="cine-section" id="destinos" aria-labelledby="destinos-heading">
          <div className="cine-container">
            <div className="cine-section-heading">
              <div>
                <p className="cine-section-kicker">ESCOLHA SEU PONTO DE PARTIDA</p>
                <h2 id="destinos-heading" className="cine-section-title">
                  Uma viagem começa<br />com uma curiosidade.
                </h2>
              </div>
              <Link href="/turismo" className="cine-link">
                Ver todos os estados <ArrowUpRight size={16} aria-hidden="true" />
              </Link>
            </div>

            <div className="cine-destinations">
              {destinations.slice(0, 3).map((d, i) => (
                <Link
                  key={d.uf}
                  href={`/turismo/${d.uf}`}
                  className="cine-destination"
                  aria-label={`Explorar ${d.name}`}
                >
                  <img
                    src={unsplash(d.image)}
                    alt={`Paisagem de ${d.name}`}
                    loading="lazy"
                  />
                  <div className="cine-destination-overlay" aria-hidden="true" />
                  <span className="cine-destination-num" aria-hidden="true">
                    0{i + 1}
                  </span>
                  <div className="cine-destination-info">
                    <p className="cine-destination-region">{d.region}</p>
                    <h3 className="cine-destination-name">{d.name}</h3>
                    <p className="cine-destination-tagline">{d.tagline}</p>
                  </div>
                </Link>
              ))}
            </div>

            <div className="cine-destinations" style={{ marginTop: 16 }}>
              {destinations.slice(3).map((d, i) => (
                <Link
                  key={d.uf}
                  href={`/turismo/${d.uf}`}
                  className="cine-destination"
                  style={{ height: 300 }}
                  aria-label={`Explorar ${d.name}`}
                >
                  <img
                    src={unsplash(d.image)}
                    alt={`Paisagem de ${d.name}`}
                    loading="lazy"
                  />
                  <div className="cine-destination-overlay" aria-hidden="true" />
                  <span className="cine-destination-num" aria-hidden="true">
                    0{i + 4}
                  </span>
                  <div className="cine-destination-info">
                    <p className="cine-destination-region">{d.region}</p>
                    <h3 className="cine-destination-name" style={{ fontSize: 'clamp(18px,2vw,24px)' }}>{d.name}</h3>
                    <p className="cine-destination-tagline">{d.tagline}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ── CATEGORIAS SEM EMOJIS ────────────────────────────────────────── */}
        <section
          className="cine-section"
          style={{ background: 'var(--soft)' }}
          aria-labelledby="categorias-heading"
        >
          <div className="cine-container">
            <div className="cine-section-heading">
              <div>
                <p className="cine-section-kicker">EXPLORE POR INTERESSE</p>
                <h2 id="categorias-heading" className="cine-section-title">
                  Como você prefere<br />viver o Brasil?
                </h2>
              </div>
            </div>

            <div className="cine-categories">
              {categories.map(({ icon: Icon, label, img, href }) => (
                <Link
                  key={label}
                  href={href}
                  className="cine-category"
                  aria-label={label}
                >
                  <img
                    src={unsplash(img, 400)}
                    alt=""
                    loading="lazy"
                    aria-hidden="true"
                  />
                  <div className="cine-category-overlay" aria-hidden="true" />
                  <div className="cine-category-info">
                    <span className="cine-category-icon" aria-hidden="true" style={{ display: 'grid', placeItems: 'center' }}>
                      <Icon size={24} style={{ color: '#d4a017' }} />
                    </span>
                    <span className="cine-category-label">{label}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ── MAYA EM DESTAQUE ─────────────────────────────────────────────── */}
        <section className="cine-section" aria-labelledby="maya-heading">
          <div className="cine-container">
            <div className="cine-maya-feature">
              <div>
                <p className="cine-section-kicker" style={{ color: '#d4a017' }}>
                  INTELIGÊNCIA ARTIFICIAL
                </p>
                <h2 id="maya-heading" className="cine-section-title" style={{ color: '#fff', marginBottom: 20 }}>
                  Apresentamos a<br /><strong style={{ color: '#d4a017', fontWeight: 900 }}>Maya</strong>, sua guia.
                </h2>
                <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: 15, lineHeight: 1.75, marginBottom: 28, maxWidth: 400 }}>
                  A Maya entende perguntas em linguagem natural e recomenda atrações,
                  roteiros, restaurantes e experiências com cards visuais ricos.
                </p>

                <div className="cine-maya-suggestions">
                  {[
                    'O que fazer em Brasília?',
                    'Quero praia no Nordeste',
                    'Destinos gratuitos em SP',
                    'Viagem em família em Salvador',
                    'Roteiro de 3 dias em Goiânia',
                    'Melhores cachoeiras de Minas',
                  ].map(s => (
                    <a
                      key={s}
                      href={assetPath(`/app/index.html#noticias`)}
                      className="cine-maya-suggestion"
                    >
                      {s}
                    </a>
                  ))}
                </div>

                <a
                  href={assetPath('/app/index.html#noticias')}
                  className="cine-btn-explore"
                  style={{ marginTop: 32, display: 'inline-flex' }}
                >
                  <Sparkles size={16} aria-hidden="true" />
                  CONVERSAR COM A MAYA
                </a>
              </div>

              <div>
                <div className="cine-maya-bubble" aria-live="polite">
                  <strong>Maya IA Assistente</strong>
                  <p style={{ marginTop: 12, marginBottom: 0 }}>
                    Olá! Sou a Maya. Para onde vamos hoje?<br />
                    Posso organizar roteiros, recomendar praias, cachoeiras, gastronomia e hotéis.
                  </p>
                </div>
                <div className="cine-maya-bubble" aria-hidden="true">
                  <strong>Exemplo de resposta:</strong>
                  <p style={{ marginTop: 8, marginBottom: 0, color: 'rgba(255,255,255,0.7)', fontStyle: 'italic' }}>
                    "Quero viajar para Brasília com minha família durante 3 dias."
                  </p>
                </div>
                <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', marginTop: 16, letterSpacing: '0.08em' }}>
                  MAYA IA • Desenvolvido com Google Gemini
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── O QUE FAZEMOS ───────────────────────────────────────────────── */}
        <section
          className="cine-section"
          style={{ background: 'var(--soft)' }}
          aria-labelledby="o-que-fazemos"
        >
          <div className="cine-container">
            <div className="cine-section-heading">
              <div>
                <p className="cine-section-kicker">PLATAFORMA COMPLETA</p>
                <h2 id="o-que-fazemos" className="cine-section-title">
                  O que fazemos
                </h2>
              </div>
            </div>

            <div className="cine-what-grid">
              {whatWeDo.map(({ icon: Icon, title, desc }) => (
                <div key={title} className="cine-what-card">
                  <span className="cine-what-icon" aria-hidden="true" style={{ color: 'var(--accent)' }}>
                    <Icon size={28} />
                  </span>
                  <h3 className="cine-what-title">{title}</h3>
                  <p className="cine-what-desc">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── QUEM SOMOS / SAIBA MAIS ─────────────────────────────────────── */}
        <section className="cine-section" aria-labelledby="quem-somos-heading">
          <div className="cine-container">
            <div className="cine-about-grid">
              <div className="cine-about-visual">
                <video
                  autoPlay muted loop playsInline preload="metadata"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  aria-hidden="true"
                >
                  <source src={assetPath('/media/litoral-brasil.mp4')} type="video/mp4" />
                </video>
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(0deg, rgba(3,13,5,0.7), transparent 60%)',
                }} aria-hidden="true" />
                <div className="cine-about-stats">
                  <div className="cine-about-stat">
                    <strong>27</strong>
                    <span>Estados</span>
                  </div>
                  <div className="cine-about-stat">
                    <strong>IA</strong>
                    <span>Integrada</span>
                  </div>
                  <div className="cine-about-stat">
                    <strong>3D</strong>
                    <span>Interativo</span>
                  </div>
                </div>
              </div>

              <div>
                <p className="cine-section-kicker">SAIBA MAIS</p>
                <h2 id="quem-somos-heading" className="cine-section-title" style={{ marginBottom: 20 }}>
                  Uma plataforma nacional<br />de turismo inteligente.
                </h2>
                <p style={{ color: 'var(--muted)', fontSize: 15, lineHeight: 1.8, marginBottom: 28 }}>
                  O Descubra o Brasil nasceu para conectar viajantes
                  aos melhores destinos, experiências e informações turísticas do país.
                  Unimos tecnologia de ponta, inteligência artificial e paixão pelo Brasil.
                </p>

                <div className="cine-about-subsections">
                  <div className="cine-about-sub">
                    <h4>Nossa Missão</h4>
                    <p>Fazer o Brasil ser descoberto em toda a sua diversidade, com informação confiável e experiências reais.</p>
                  </div>
                  <div className="cine-about-sub">
                    <h4>Nossa Visão</h4>
                    <p>Ser a principal plataforma digital de turismo brasileiro, integrando IA, 3D e conteúdo humano.</p>
                  </div>
                  <div className="cine-about-sub">
                    <h4>Tecnologia</h4>
                    <p>Maya IA, mapa 3D, roteiros inteligentes e PWA para acesso em qualquer dispositivo.</p>
                  </div>
                  <div className="cine-about-sub">
                    <h4>Para Viajantes</h4>
                    <p>Destinos organizados, categorias claras, roteiros personalizados e muito mais.</p>
                  </div>
                </div>

                <Link href="/quem-somos" className="cine-link" style={{ marginTop: 28, display: 'inline-flex' }}>
                  Conhecer nossa história <ArrowUpRight size={16} aria-hidden="true" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ── PATROCINADORES DE DESTAQUE (diRoma & Rede Brasília Digital) ─── */}
        <section
          className="cine-section"
          style={{ background: 'var(--soft)', paddingBlock: 'clamp(48px, 6vw, 80px)' }}
          aria-labelledby="patrocinadores-heading"
        >
          <div className="cine-container">
            <div className="cine-section-heading" style={{ marginBottom: 36 }}>
              <div>
                <p className="cine-section-kicker">PARCEIROS E PATROCINADORES</p>
                <h2 id="patrocinadores-heading" className="cine-section-title" style={{ fontSize: 'clamp(22px, 2.5vw, 32px)' }}>
                  Nossos parceiros em destaque
                </h2>
              </div>
              <Link href="/anuncie" className="cine-link">
                Anuncie aqui <ArrowUpRight size={16} aria-hidden="true" />
              </Link>
            </div>

            {/* Banner diRoma */}
            <div className="cine-partner-banner" style={{ marginBottom: 32 }}>
              <span className="cine-partner-banner-label">CONTEÚDO PATROCINADO</span>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', minHeight: 260 }}>
                <img
                  src={assetPath('/app/assets/diroma-caldas-novas.jpg')}
                  alt="Parque aquático diRoma em Caldas Novas"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  loading="lazy"
                />
                <div style={{ padding: 'clamp(24px, 4vw, 48px)' }}>
                  <span className="cine-section-kicker">CALDAS NOVAS · GO</span>
                  <h3 style={{ fontSize: 'clamp(20px, 2.5vw, 32px)', fontWeight: 700, letterSpacing: '-0.04em', marginBottom: 12 }}>
                    diRoma
                  </h3>
                  <p style={{ color: 'var(--muted)', fontSize: 14, lineHeight: 1.75, marginBottom: 24 }}>
                    Hospedagem, lazer e parques aquáticos em Caldas Novas.
                    Uma das maiores experiências de resort do Brasil.
                  </p>
                  <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center', marginBottom: 16 }}>
                    <span style={{ fontSize: 11, padding: '5px 12px', border: '1px solid var(--line)', borderRadius: 999, color: 'var(--muted)', fontWeight: 700, letterSpacing: '0.06em' }}>
                      CUPOM: DESCUBRAOBRASIL
                    </span>
                  </div>
                  <a
                    href="https://diroma.com.br/"
                    target="_blank"
                    rel="noopener noreferrer sponsored"
                    className="cine-btn-explore"
                    style={{ fontSize: 12 }}
                  >
                    Conhecer diRoma <ArrowUpRight size={14} aria-hidden="true" />
                  </a>
                </div>
              </div>
            </div>

            {/* Banner Rede Brasília Digital */}
            <div className="cine-partner-banner" style={{ marginBottom: 32, background: 'var(--panel)' }}>
              <span className="cine-partner-banner-label">PARCEIRO INSTITUCIONAL</span>
              <div style={{ padding: 'clamp(24px, 4vw, 36px)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 20 }}>
                <div>
                  <span className="cine-section-kicker">DISTRITO FEDERAL</span>
                  <h3 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>Rede Brasília Digital</h3>
                  <p style={{ color: 'var(--muted)', fontSize: 14, margin: 0, maxWidth: 500 }}>
                    Parceria de comunicação e inovação digital promovendo o turismo e a cultura da capital do país.
                  </p>
                </div>
                <a
                  href="/anuncie"
                  className="cine-btn-app"
                  style={{ background: 'var(--soft)', color: 'var(--ink)', border: '1px solid var(--line)' }}
                >
                  Conhecer Parceria
                </a>
              </div>
            </div>

            {/* Track de parceiros */}
            <div className="cine-partners-track-wrap">
              <div className="cine-partners-track" aria-label="Parceiros do Descubra o Brasil">
                {[
                  'diRoma', 'Rede Brasília Digital', 'Band', 'Gospel FM',
                  'Parceiro Premium', 'Parceiro Premium',
                  'diRoma', 'Rede Brasília Digital', 'Band', 'Gospel FM',
                  'Parceiro Premium', 'Parceiro Premium',
                ].map((name, i) => (
                  <div key={i} className="cine-partner-slot" aria-label={name}>
                    {name}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── ANUNCIE ─────────────────────────────────────────────────────── */}
        <section className="cine-section" aria-labelledby="anuncie-heading">
          <div className="cine-container">
            <div className="cine-section-heading">
              <div>
                <p className="cine-section-kicker">PUBLICIDADE</p>
                <h2 id="anuncie-heading" className="cine-section-title">
                  Anuncie no Descubra o Brasil
                </h2>
              </div>
              <a
                href="https://wa.me/5561995659907?text=Ol%C3%A1%2C%20quero%20anunciar%20no%20Descubra%20o%20Brasil"
                target="_blank"
                rel="noopener noreferrer"
                className="cine-link"
              >
                Fale conosco <ArrowUpRight size={16} aria-hidden="true" />
              </a>
            </div>

            <div className="cine-advertise-grid">
              {[
                { icon: MapPin, name: 'Banner Premium', desc: 'Grande visibilidade na homepage e nas páginas de destino.' },
                { icon: Play, name: 'Vídeo Patrocinado', desc: 'Seu vídeo integrado na seção "Brasil em Movimento".' },
                { icon: Compass, name: 'Destino Patrocinado', desc: 'Destaque no mapa interativo e nas listagens de estados.' },
                { icon: Landmark, name: 'Card Patrocinado', desc: 'Card integrado nas categorias e listagens de lugares.' },
                { icon: MapIcon, name: 'Campanha Regional', desc: 'Segmentação por estado, região, cidade ou categoria.' },
                { icon: Building2, name: 'Publicidade no App', desc: 'Visibilidade dentro do aplicativo para usuários ativos.' },
              ].map(({ icon: Icon, name, desc }) => (
                <div key={name} className="cine-ad-format">
                  <div className="cine-ad-format-icon" aria-hidden="true" style={{ color: 'var(--accent)' }}>
                    <Icon size={28} />
                  </div>
                  <h3 className="cine-ad-format-name">{name}</h3>
                  <p className="cine-ad-format-desc">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

      </main>

      <FooterSection />
      <MayaChat />

      {/* WhatsApp Flutuante com Vetor limpo */}
      <a
        href="https://wa.me/5561995659907?text=Ol%C3%A1%2C%20vim%20pelo%20Descubra%20o%20Brasil"
        target="_blank"
        rel="noopener noreferrer"
        className="cine-whatsapp-float"
        aria-label="Falar conosco pelo WhatsApp"
        style={{ position: 'fixed', right: 20, bottom: 90, zIndex: 79 }}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M12.012 2c-5.506 0-9.989 4.478-9.99 9.984 0 1.762.459 3.479 1.332 4.992l-1.416 5.17 5.291-1.387c1.455.794 3.097 1.21 4.78 1.211h.004c5.505 0 9.988-4.478 9.989-9.985.001-2.668-1.034-5.177-2.918-7.062a9.92 9.92 0 0 0-7.062-2.923zm.004 1.737c4.545 0 8.247 3.701 8.248 8.247 0 2.201-.856 4.27-2.41 5.823a8.19 8.19 0 0 1-5.836 2.413h-.003c-1.472 0-2.916-.395-4.175-1.144l-.299-.178-3.104.813.827-3.021-.195-.311c-.822-1.309-1.258-2.825-1.257-4.394.001-4.546 3.703-8.248 8.249-8.248zm-3.568 4.41c-.22 0-.58.082-.884.413-.304.331-1.16 1.134-1.16 2.766s1.189 3.208 1.354 3.428c.166.22 2.304 3.518 5.582 4.933.78.337 1.389.538 1.864.689.783.249 1.496.214 2.06.13.629-.094 1.933-.79 2.204-1.554.271-.764.271-1.417.19-1.554-.081-.137-.301-.22-.629-.384s-1.933-.954-2.231-1.062c-.298-.108-.515-.162-.732.162-.218.324-.843 1.062-1.034 1.28-.19.218-.381.245-.709.081-.328-.163-1.385-.511-2.639-1.628-.976-.87-1.635-1.944-1.826-2.271-.19-.328-.02-.505.144-.668.148-.147.328-.381.492-.572.164-.191.218-.328.328-.546.109-.218.055-.409-.027-.572-.082-.163-.732-1.766-1.003-2.417-.264-.634-.533-.548-.732-.558-.19-.01-.409-.01-.629-.01z"/>
        </svg>
        <span className="cine-whatsapp-tooltip" aria-hidden="true">Fale conosco</span>
      </a>
    </>
  );
}
