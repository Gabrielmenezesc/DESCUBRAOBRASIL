import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Clock, MapPin, Share2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import FooterSection from "@/components/FooterSection";
import LGPDBanner from "@/components/LGPDBanner";
import localNews from "@/data/noticias.json";

// For static export
export function generateStaticParams() {
  return localNews.map((news) => ({
    slug: news.slug,
  }));
}

export default async function NoticiaPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const news = localNews.find((n) => n.slug === slug);

  if (!news) {
    notFound();
  }

  // Format date
  const dateStr = new Date(news.publishedAt).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });

  // Get 3 random related news
  const relatedNews = localNews
    .filter((n) => n.slug !== slug && (n.category === news.category || n.state === news.state))
    .slice(0, 3);

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white flex flex-col justify-between">
      <Navbar />

      <article className="pt-24 pb-16 flex-1">
        {/* Header Hero */}
        <header className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 mb-10 text-center">
          <Link href="/noticias" className="inline-flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold text-sm mb-6 hover:underline">
            <ArrowLeft className="w-4 h-4" /> Voltar para Notícias
          </Link>
          
          <div className="flex flex-wrap justify-center gap-2 mb-4">
            <span className="bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 px-3 py-1 rounded-full text-xs font-bold">
              {news.category}
            </span>
            <span className="bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
              <MapPin className="w-3 h-3" /> {news.state}
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight leading-tight mb-6">
            {news.title}
          </h1>
          
          <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 font-medium mb-8">
            {news.description}
          </p>

          <div className="flex items-center justify-center gap-6 text-sm text-slate-500 dark:text-slate-400 border-t border-slate-200 dark:border-slate-800 pt-6">
            <div className="flex items-center gap-2 font-bold text-slate-700 dark:text-slate-300">
              <img src="/logo-descubra.png" alt="Logo" className="w-6 h-6 object-contain bg-slate-900 rounded-full p-1" />
              {news.source}
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" /> {dateStr}
            </div>
          </div>
        </header>

        {/* Featured Image */}
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
          <div className="relative w-full aspect-video rounded-3xl overflow-hidden shadow-2xl">
            <img 
              src={news.image} 
              alt={news.title}
              className="absolute inset-0 w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Content Body */}
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="prose prose-lg dark:prose-invert prose-emerald max-w-none text-slate-700 dark:text-slate-300">
            {/* Simple text formatting since it's mock string */}
            {news.content.split('\n\n').map((paragraph, idx) => (
              <p key={idx} className="mb-6 leading-relaxed text-lg">
                {paragraph}
              </p>
            ))}
          </div>
          
          {/* Action Buttons */}
          <div className="flex items-center justify-between border-t border-slate-200 dark:border-slate-800 mt-12 pt-8">
            <button className="flex items-center gap-2 bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 px-6 py-3 rounded-full font-bold transition-all">
              <Share2 className="w-4 h-4" /> Compartilhar
            </button>
            <Link href="/turismo" className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white px-6 py-3 rounded-full font-bold shadow-lg shadow-emerald-500/20 transition-all hover:scale-105">
              Explorar Destinos
            </Link>
          </div>
        </div>
      </article>

      {/* Related News */}
      {relatedNews.length > 0 && (
        <section className="py-16 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-8">Veja Também</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedNews.map((rel) => (
                <Link key={rel.id} href={`/noticias/${rel.slug}`} className="group block bg-slate-50 dark:bg-slate-950 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all border border-slate-100 dark:border-slate-800">
                  <div className="relative h-40">
                    <div className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-500" style={{ backgroundImage: `url(${rel.image})` }} />
                  </div>
                  <div className="p-5">
                    <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 mb-2 block">{rel.category}</span>
                    <h4 className="font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 line-clamp-2">{rel.title}</h4>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <FooterSection />
      <LGPDBanner />
    </main>
  );
}
