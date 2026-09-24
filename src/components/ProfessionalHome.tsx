"use client";
import { useState } from 'react';
import Link from 'next/link';
import { ArrowUpRight, ArrowRight, Compass, Layers3, MapPin, MoveUpRight, ShieldCheck, Store, Gamepad2 } from 'lucide-react';
import Globe from './Globe';
import Navbar from './Navbar';
import FooterSection from './FooterSection';
import { assetPath } from '@/lib/assetPath';

const destinations=[
 {name:'Rio de Janeiro',uf:'rj',kind:'Entre a cidade e o mar',image:'photo-1483729558449-99ef09a8c325'},
 {name:'Bahia',uf:'ba',kind:'Histórias em cada encontro',image:'photo-1549918864-48ac978761a4'},
 {name:'Amazonas',uf:'am',kind:'Outro tempo. Outra natureza.',image:'photo-1516026672322-bc52d61a55d5'},
];
export default function ProfessionalHome(){const[q,setQ]=useState('');return <><Navbar/><main className="pro-site">
 <section className="pro-hero pro-container">
 <div className="pro-hero-copy"><p className="pro-kicker">UM PAÍS. INFINITAS POSSIBILIDADES.</p><h1>O Brasil merece<br/>ser <em>descoberto.</em></h1><p className="pro-lead">Lugares que surpreendem. Histórias que aproximam. Planeje sua próxima viagem e encontre novas formas de viver o Brasil.</p>
 <form className="pro-search" action={assetPath('/app/index.html')}><label className="sr-only" htmlFor="destination-search">Qual é o seu próximo destino?</label><Compass size={21}/><input id="destination-search" name="q" value={q} onChange={ev=>setQ(ev.target.value)} placeholder="Qual é o seu próximo destino?"/><button aria-label="Buscar destino" type="submit"><ArrowRight size={22}/></button></form>
 <div className="pro-hero-links"><a href={assetPath('/app/index.html')} className="pro-link">Explorar o aplicativo <ArrowUpRight size={18}/></a><Link href="/empresas" className="pro-link secondary">Tenho uma empresa <ArrowUpRight size={18}/></Link></div>
 <div className="pro-proof"><span><strong>26 + DF</strong>unidades federativas</span><span><strong>5</strong>regiões para explorar</span><span><strong>No seu ritmo</strong>roteiros que você cria</span></div>
 </div>
 <div className="pro-globe-stage"><div className="pro-orbit-label"><span className="pro-live-dot"/>EXPLORAÇÃO EM 3D</div><div className="pro-globe"><Globe/></div><div className="pro-coordinate">14.2350° S / 51.9253° W</div><div className="pro-globe-caption"><Layers3 size={18}/><span>Arraste para girar. Selecione um ponto para explorar.</span></div><div className="pro-place-label"><MapPin size={16}/><span>O próximo destino<br/><strong>pode estar mais perto.</strong></span></div></div>
 </section>
 <div className="pro-ribbon"><span>NATUREZA</span><span>CULTURA</span><span>GASTRONOMIA</span><span>DESCOBERTAS</span><span>CONEXÕES LOCAIS</span></div>
 <section className="pro-container pro-section" id="destinos"><div className="pro-section-heading"><div><p className="pro-kicker">ESCOLHA SEU PONTO DE PARTIDA</p><h2>Uma viagem começa<br/>com uma curiosidade.</h2></div><Link href="/turismo" className="pro-link">Ver todos os estados <ArrowUpRight size={19}/></Link></div><div className="pro-destinations">{destinations.map((d,i)=><Link href={`/turismo/${d.uf}`} className="pro-destination" key={d.uf}><img src={`https://images.unsplash.com/${d.image}?auto=format&fit=crop&w=900&q=80`} alt={`Paisagem de ${d.name}`} loading="lazy"/><span className="pro-destination-number">0{i+1}</span><div><p>{d.kind}</p><h3>{d.name}<MoveUpRight size={24}/></h3></div></Link>)}</div></section>
 <section className="pro-container pro-section"><div className="pro-experience"><div><p className="pro-kicker">MAIS DO QUE ESCOLHER UM LUGAR</p><h2>Transforme curiosidade<br/>em descoberta.</h2><p className="pro-lead">Monte seu roteiro, teste o que sabe sobre o país e crie um passaporte das suas visitas. Tudo começa no seu navegador.</p><a href={assetPath('/app/index.html#jogos')} className="pro-button">Conhecer os jogos <ArrowUpRight size={20}/></a></div><div className="pro-game-stack"><div className="pro-game-card"><Gamepad2/><span>DESAFIO DIÁRIO</span><strong>Quanto do Brasil<br/>você já conhece?</strong><p>Cinco perguntas. Uma nova descoberta por dia.</p><a href={assetPath('/app/index.html#jogos')} className="pro-link">Jogar agora <ArrowRight size={19}/></a></div><div className="pro-small-card"><Compass/><div><strong>Seu passaporte de visitas</strong><span>Explore. Registre. Continue descobrindo.</span></div></div></div></div></section>
 <section className="pro-container pro-section"><div className="pro-section-heading"><div><p className="pro-kicker">PARA QUEM VIAJA. PARA QUEM RECEBE.</p><h2>Boas conexões<br/>movem o turismo.</h2></div></div><div className="pro-two"><article className="pro-feature"><Compass/><h3>Seu próximo roteiro,<br/>com a sua identidade.</h3><p>Encontre lugares por cidade ou região. Salve favoritos, organize a ordem das paradas e leve a lista com você.</p><a href={assetPath('/app/index.html#explorar')} className="pro-link">Montar meu roteiro <ArrowUpRight size={18}/></a></article><article className="pro-feature"><Store/><h3>Sua empresa,<br/>mais fácil de descobrir.</h3><p>Entenda como apresentar seu negócio e preparar ofertas com preços, validade e condições transparentes.</p><Link href="/empresas" className="pro-link">Conhecer a área de empresas <ArrowUpRight size={18}/></Link></article></div></section>
 <section className="pro-container pro-section"><div className="pro-last"><ShieldCheck size={34}/><div><h2>Informação clara. Experiências possíveis.</h2><p>Ofertas com condições verificáveis, notícias com fonte e jogos que respeitam o seu ritmo.</p></div><a href={assetPath('/app/index.html#noticias')} className="pro-button">Acompanhar notícias <ArrowUpRight size={18}/></a></div></section>
 </main><FooterSection/></>;}
