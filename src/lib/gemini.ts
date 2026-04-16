// ── Maya AI — Powered by Groq (Llama 3.3 70B) ────────────────
// Gratuito, rápido e sem restrição regional!
// Gere sua chave em: https://console.groq.com

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";
const GROQ_MODEL = "llama-3.3-70b-versatile";

// ── System Prompt da Maya ──────────────────────────────────────
const MAYA_SYSTEM_PROMPT = `Você é a **Maya**, assistente virtual de turismo do portal "Descubra o Brasil".

## Sua Personalidade:
- Você é brasileira, simpática, carismática e apaixonada por viagens
- Use emojis com moderação (2-4 por resposta)
- Seja objetiva mas calorosa
- Use **negrito** para destacar nomes de lugares e informações importantes
- Organize respostas com bullet points quando apropriado
- Responda SEMPRE em português brasileiro

## Suas Regras:
1. SOMENTE responda sobre turismo, viagens, destinos, cultura, gastronomia, hospedagem, transporte e eventos NO BRASIL
2. Se perguntarem sobre algo fora do tema turismo brasileiro, responda gentilmente: "Sou especialista em turismo no Brasil! 🇧🇷 Posso te ajudar com destinos, roteiros, hospedagem, gastronomia e muito mais. O que gostaria de saber?"
3. NUNCA invente informações falsas — se não tiver certeza, diga "Recomendo confirmar essa informação antes de viajar"
4. Sempre sugira destinos, atividades gratuitas e dicas de economia quando possível
5. Quando apropriado, mencione que o usuário pode falar com um especialista via WhatsApp para planejamento personalizado
6. Mantenha as respostas com no máximo 250 palavras
7. Inclua dicas práticas (melhor época, orçamento estimado, como chegar)

## Contexto:
- O portal Descubra o Brasil oferece roteiros, guias e planejamento de viagens
- Os usuários são brasileiros ou pessoas interessadas em viajar pelo Brasil
- O WhatsApp do especialista está disponível para atendimento personalizado`;

// ── Histórico de conversa para contexto ────────────────────────
interface ChatMessage {
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
  // Manter só as últimas 10 mensagens para não estourar o contexto
  if (chatHistory.length > 10) {
    chatHistory = chatHistory.slice(-10);
  }
}

// ── Função principal: Perguntar à IA ───────────────────────────
export async function askGemini(userMessage: string): Promise<string | null> {
  const apiKey = getApiKey();
  if (!apiKey) return null;

  try {
    // Montar mensagens com system prompt + histórico + nova mensagem
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
        temperature: 0.7,
        max_tokens: 800,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("[Maya/Groq] API error:", response.status, errorText);

      if (response.status === 429) {
        return "Estou com muitas consultas no momento. 😅 Tente novamente em alguns instantes, ou fale diretamente com nosso especialista via WhatsApp!";
      }

      return null;
    }

    const data = await response.json();
    const text = data.choices?.[0]?.message?.content;

    if (!text) return null;

    // Limitar resposta se muito longa
    if (text.length > 1500) {
      return text.substring(0, 1500) + "...";
    }

    return text;
  } catch (err: any) {
    console.error("[Maya/Groq] Erro na requisição:", err?.message || err);
    return null;
  }
}

// ── Helpers ────────────────────────────────────────────────────
function getApiKey(): string | null {
  const apiKey = process.env.NEXT_PUBLIC_GROQ_API_KEY;
  if (!apiKey || apiKey === "sua_chave_aqui") {
    console.warn("[Maya/Groq] API key não configurada. Usando apenas respostas locais.");
    return null;
  }
  return apiKey;
}

export function isGeminiAvailable(): boolean {
  const apiKey = process.env.NEXT_PUBLIC_GROQ_API_KEY;
  return !!apiKey && apiKey !== "sua_chave_aqui";
}
