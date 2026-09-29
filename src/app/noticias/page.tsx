import Navbar from '@/components/Navbar';
import FooterSection from '@/components/FooterSection';
import MayaChat from '@/components/MayaChat';
import { assetPath } from '@/lib/assetPath';
import news from '../../../public/app/data/news.json';

export default function NoticiasPage() {
  return <>
    <Navbar />
    <main className="pro-page">
      <div className="pro-container">
        <section className="cine-hero" style={{ minHeight: 520 }}>
          <video autoPlay muted loop playsInline className="cine-hero-video"><source src={assetPath('/media/litoral-brasil.mp4')} type="video/mp4" /></video>
          <div className="cine-hero-overlay" />
          <div className="cine-hero-content"><p className="pro-kicker">NOTÍCIAS</p><h1>O turismo brasileiro<br />em movimento.</h1><p className="pro-lead">Informação oficial, com data, fonte e acesso à publicação original.</p></div>
        </section>
        <section className="pro-section">
          <p className="pro-kicker">ÚLTIMAS PUBLICAÇÕES</p>
          <div className="pro-state-grid">
            {news.items.map((item) => <article className="pro-state-card" key={item.url}>
              <span>{item.date ? new Date(item.date).toLocaleDateString('pt-BR', { timeZone: 'America/Sao_Paulo' }) : 'Fonte oficial'}</span>
              <h2 style={{ fontSize: 22 }}>{item.title}</h2>
              <a className="pro-button" href={item.url} target="_blank" rel="noopener noreferrer">Ler na fonte</a>
            </article>)}
          </div>
        </section>
      </div>
    </main>
    <FooterSection /><MayaChat />
  </>;
}

