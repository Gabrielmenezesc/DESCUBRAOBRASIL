import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Política de Privacidade | Descubra o Brasil",
  description: "Saiba como protegemos seus dados na plataforma Descubra o Brasil.",
};

export default function PrivacidadePage() {
  return (
    <main className="min-h-screen bg-white pt-24 pb-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-extrabold text-slate-900 mb-8 tracking-tight">
          Política de Privacidade
        </h1>
        <p className="text-sm text-slate-400 mb-8">Última atualização: Março de 2026</p>

        <div className="prose prose-slate max-w-none space-y-6 text-slate-700 leading-relaxed">
          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-3">1. Informações que Coletamos</h2>
            <p>A plataforma Descubra o Brasil pode coletar as seguintes informações:</p>
            <ul className="list-disc pl-6 space-y-2 mt-2">
              <li><strong>Dados de navegação:</strong> páginas visitadas, tempo de permanência, tipo de dispositivo e navegador</li>
              <li><strong>Localização aproximada:</strong> utilizada para exibir o clima local e personalizar a experiência turística</li>
              <li><strong>Dados da Maya AI:</strong> interações em texto e voz com a assistente virtual para melhorar respostas</li>
              <li><strong>Dados de contato:</strong> e-mail e telefone fornecidos voluntariamente via formulário de contato</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-3">2. Como Usamos Seus Dados</h2>
            <p>Utilizamos suas informações exclusivamente para:</p>
            <ul className="list-disc pl-6 space-y-2 mt-2">
              <li>Personalizar sua experiência na plataforma</li>
              <li>Melhorar a inteligência da Maya AI</li>
              <li>Enviar comunicações relevantes (somente com seu consentimento)</li>
              <li>Análises internas para melhoria dos serviços</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-3">3. Compartilhamento de Dados</h2>
            <p>Não vendemos, alugamos ou compartilhamos seus dados pessoais com terceiros para fins comerciais. Seus dados podem ser compartilhados apenas com:</p>
            <ul className="list-disc pl-6 space-y-2 mt-2">
              <li>Provedores de serviço essenciais ao funcionamento da plataforma</li>
              <li>Autoridades legais, quando exigido por lei</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-3">4. Cookies e Armazenamento Local</h2>
            <p>Utilizamos cookies e armazenamento local (localStorage) para manter suas preferências (como tipo de público selecionado) e garantir o funcionamento do Service Worker (PWA). Você pode gerenciar cookies nas configurações do seu navegador.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-3">5. Seus Direitos (LGPD)</h2>
            <p>De acordo com a Lei Geral de Proteção de Dados (LGPD), você tem direito a:</p>
            <ul className="list-disc pl-6 space-y-2 mt-2">
              <li>Acessar seus dados pessoais</li>
              <li>Solicitar a correção de dados incompletos ou incorretos</li>
              <li>Solicitar a exclusão de seus dados</li>
              <li>Revogar o consentimento a qualquer momento</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-3">6. Contato do Encarregado de Dados</h2>
            <p>Para exercer seus direitos ou esclarecer dúvidas sobre esta política, entre em contato:</p>
            <p className="mt-2">
              <strong>E-mail:</strong>{" "}
              <a href="mailto:contato@descubraobrasil.com" className="text-emerald-600 font-bold hover:underline">contato@descubraobrasil.com</a>
              <br />
              <strong>WhatsApp:</strong>{" "}
              <a href="https://wa.me/5538991621135" target="_blank" rel="noopener noreferrer" className="text-emerald-600 font-bold hover:underline">+55 38 99162-1135</a>
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
