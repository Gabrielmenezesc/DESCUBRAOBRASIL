// ── Maya AI — Powered by Groq (Llama 3.3 70B) ────────────────
// 100% LLM Driven Architecture

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";
const GROQ_MODEL = "llama-3.3-70b-versatile";

// ── System Prompt da Maya (Cérebro Completo) ───────────────────
const MAYA_SYSTEM_PROMPT = `Você é a **Maya**, a inteligência artificial especialista e vendedora oficial de pacotes de viagem do portal "Descubra o Brasil".

## 🎯 OBJETIVO PRINCIPAL:
Sua missão é encantar o cliente com dicas de destinos no Brasil e convertê-lo! Durante a conversa, faça perguntas orgânicas e contextuais (não pareça um robô) para descobrir: SEU NOME, PARA ONDE DESEJA IR, QUANDO, COM QUEM, e SEU ESTILO E ORÇAMENTO. 
Assim que o cliente demonstrar intenção real de viagem, incentive-o fortemente a clicar no botão de WhatsApp ou direcione-o no chat para falar com um de nossos especialistas reais! 
Link do Especialista WhatsApp: [Falar no WhatsApp](https://wa.me/5538991621135?text=Ol%C3%A1%2C%20falei%20com%20a%20Maya%20e%20quero%20ajuda%20com%20minha%20viagem!)

- **Tecnologia 3D e App**: Informe aos usuários que temos nosso próprio ambiente em 3D interativo para explorar o Brasil, e que eles podem instalar nosso Web App (PWA) clicando no botão verde de "Baixar App".
- **Conteúdo Premium e eBooks**: Informe que todo o conteúdo Premium (eBooks, roteiros detalhados, mapas offline e Maya ilimitada) é acessível **exclusivamente através do Aplicativo**. No site, eles podem ver fotos e notícias, mas a experiência completa é no App.

## 🧠 REGRAS DE COMPORTAMENTO:
1. **Atitude Premium:** Seja acolhedora, vibrante (use emojis 🌟🎒) mas muito profissional. Não seja uma IA genérica; você é uma especialista apaixonada pelo Brasil!
2. **Formatação Impecável:** Use **negrito** para nomes de lugares. Use \`bullet points\` para listar atrações e roteiros. Use links em Markdown apontando para o site local.
3. **Limite de Tema:** Fale APENAS sobre turismo, Brasil, viagens, do nosso site e app. Se falarem de outro tema, redirecione educadamente: "Vamos focar na sua próxima viagem pelo Brasil! 🌴 Posso te sugerir praias ou montanhas?"
4. **Respostas Diretas:** Mantenha suas respostas dinâmicas e que instiguem o usuário a continuar conversando (sempre devolva com uma pergunta leve se apropriado). Máximo de 200 palavras por turno.
5. **Ações Rápidas (Call to Action):** Se o usuário não sabe o que fazer finalmentem, dê opções prontas. Ex: "Quer que eu [Monte um Roteiro] ou prefere [Ver Notícias]?"
`;

// ── Histórico de conversa para contexto ────────────────────────
export interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

let chatHistory: ChatMessage[] = [];

export function resetChatHistory() {
  chatHistory = [];
}

export function addToChatHistory(role: "user" | "model", text: string) {
  const apiRole = role === "model" ? "assistant" : "user";
  chatHistory.push({ role: apiRole, content: text });
  
  // Guardar contexto maior: últimas 16 mensagens para fluxo longo e natural de vendas
  if (chatHistory.length > 16) {
    chatHistory = chatHistory.slice(-16);
  }
}

// ── Função principal: Perguntar à IA ───────────────────────────
export async function askGemini(userMessage: string): Promise<string | null> {
  const apiKey = getApiKey();
  if (!apiKey) {
    return "Ops! Parece que minha conexão inteligente (API Key do Groq) está desligada. Por favor, atualize minha chave! 🤖";
  }

  try {
    const messages: ChatMessage[] = [
      { role: "system", content: MAYA_SYSTEM_PROMPT },
      ...chatHistory,
      { role: "user", content: userMessage },
    ];

    const response = await fetch(GROQ_API_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: GROQ_MODEL,
        messages,
        temperature: 0.65, // Ideal balance between creativity and consistency
        max_tokens: 800,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return "Nossa, muita gente falando comigo agora! 😅 Tente de novo em alguns segundinhos, ou clique no botão de WhatsApp para falar agora mesmo com os humanos da equipe!";
      }
      return null;
    }

    const data = await response.json();
    let text = data.choices?.[0]?.message?.content;

    if (!text) return null;

    if (text.length > 2000) {
      text = text.substring(0, 2000) + "...";
    }

    return text;
  } catch (err) {
    console.error("[Maya/Groq IA] Erro:", err);
    return "Desculpe, tive um probleminha de conexão. 😥 Poderia tentar novamente?";
  }
}

function getApiKey(): string | null {
  const apiKey = process.env.NEXT_PUBLIC_GROQ_API_KEY;
  if (!apiKey || apiKey.includes("sua_chave_aqui") || !apiKey.startsWith("gsk_")) {
    return null; // Força aviso para o usuário arrumar a chave
  }
  return apiKey;
}

export function isGeminiAvailable(): boolean {
  return !!getApiKey();
}
