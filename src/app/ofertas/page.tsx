import Navbar from '@/components/Navbar';
import FooterSection from '@/components/FooterSection';

export default function OfertasPage() {
  return (
    <>
      <Navbar />
      <main className="pro-page">
        <section className="pro-container" style={{ maxWidth: 980 }}>
          <p className="pro-kicker">OFERTAS E PARCEIROS</p>
          <h1>Condições claras antes de reservar.</h1>
          <p className="pro-lead">
            As ofertas verificadas ficam no aplicativo, com empresa responsável, período e regras de uso.
            Nunca confirme uma reserva sem conferir as condições no canal oficial.
          </p>
          <div className="pro-card-grid">
            <article className="pro-card">
              <h2>Ofertas no aplicativo</h2>
              <p>Consulte experiências, hospedagens e benefícios publicados pelos parceiros.</p>
              <a className="pro-btn pro-btn-primary" href="/app/index.html#ofertas">Ver ofertas verificadas</a>
            </article>
            <article className="pro-card">
              <h2>É uma empresa?</h2>
              <p>Envie sua proposta com preço, validade e regras para análise antes da publicação.</p>
              <a className="pro-btn" href="/anuncie/">Apresentar minha empresa</a>
            </article>
          </div>
          <p className="pro-note">Disponibilidade, preços e cancelamentos são definidos pelo parceiro. A reserva é concluída no canal oficial informado.</p>
        </section>
      </main>
      <FooterSection />
    </>
  );
}