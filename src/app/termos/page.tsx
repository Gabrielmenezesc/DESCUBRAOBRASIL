import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Termos de Uso | Descubra o Brasil",
  description: "Termos e condições de uso da plataforma Descubra o Brasil.",
};

export default function TermosPage() {
  return (
    <main className="min-h-screen bg-white dark:bg-slate-900 pt-24 pb-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white mb-8 tracking-tight">
          Termos de Uso
        </h1>
        <p className="text-sm text-slate-400 mb-8">Última atualização: Março de 2026</p>

        <div className="prose prose-slate max-w-none space-y-6 text-slate-700 dark:text-slate-200 leading-relaxed">
          <section>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">1. Aceitação dos Termos</h2>
            <p>Ao acessar e utilizar a plataforma Descubra o Brasil, incluindo o site, o aplicativo web (PWA) e a assistente virtual Maya, você concorda em cumprir e ficar vinculado a estes Termos de Uso. Se você não concordar com qualquer parte destes termos, não utilize nossos serviços.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">2. Descrição do Serviço</h2>
            <p>O Descubra o Brasil é um ecossistema digital que oferece:</p>
            <ul className="list-disc pl-6 space-y-2 mt-2">
              <li>Mapa interativo 3D com destinos turísticos brasileiros</li>
              <li>Assistente virtual Maya com inteligência artificial para planejamento de viagens</li>
              <li>Portal de notícias com dicas gratuitas e destinos turísticos</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">3. Uso Aceitável</h2>
            <p>Você concorda em não utilizar nossos serviços para fins ilegais, fraudulentos ou que violem direitos de terceiros. É proibido coletar dados de outros usuários, interferer no funcionamento da plataforma ou tentar acessar áreas restritas sem autorização.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">4. Propriedade Intelectual</h2>
            <p>Todo o conteúdo da plataforma, incluindo textos, imagens, vídeos, código-fonte, design, logotipos e a marca &quot;Descubra o Brasil&quot;, é de propriedade exclusiva da Rede Brasília News LTDA e está protegido pelas leis brasileiras de propriedade intelectual.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">5. Limitação de Responsabilidade</h2>
            <p>A plataforma é fornecida &quot;como está&quot;. Não garantimos disponibilidade ininterrupta, ausência de erros ou precisão total das informações turísticas apresentadas. O uso da plataforma é de sua inteira responsabilidade.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">6. Contato</h2>
            <p>Para dúvidas sobre estes Termos de Uso, entre em contato pelo e-mail <a href="mailto:contato@descubraobrasil.com" className="text-emerald-600 font-bold hover:underline">contato@descubraobrasil.com</a> ou pelo WhatsApp <a href="https://wa.me/5538991621135" target="_blank" rel="noopener noreferrer" className="text-emerald-600 font-bold hover:underline">+55 38 99162-1135</a>.</p>
          </section>
        </div>
      </div>
    </main>
  );
}
