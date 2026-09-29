// Maya usa uma Edge Function como intermediária. A chave privada do provedor
// de IA permanece no servidor e nunca é enviada ao navegador.

export interface ChatMessage {
  role: "user" | "model";
  text: string;
}

interface MayaResponse {
  answer?: string;
}

let chatHistory: ChatMessage[] = [];

function getMayaConfig() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, "");
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const proxyUrl = process.env.NEXT_PUBLIC_MAYA_PROXY_URL ||
    (supabaseUrl ? `${supabaseUrl}/functions/v1/maya` : "");

  return { proxyUrl, supabaseKey };
}

export function resetChatHistory() {
  chatHistory = [];
}

export function addToChatHistory(role: "user" | "model", text: string) {
  chatHistory.push({ role, text });
  if (chatHistory.length > 16) chatHistory = chatHistory.slice(-16);
}

export async function askGemini(userMessage: string): Promise<string | null> {
  const { proxyUrl, supabaseKey } = getMayaConfig();
  if (!proxyUrl || !supabaseKey) {
    return "A Maya ainda não está conectada. Configure o serviço seguro de inteligência artificial para ativar as respostas.";
  }

  try {
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 55_000);
    const response = await fetch(proxyUrl, {
      method: "POST",
      signal: controller.signal,
      headers: {
        "Content-Type": "application/json",
        apikey: supabaseKey,
        Authorization: `Bearer ${supabaseKey}`,
      },
      body: JSON.stringify({
        question: userMessage,
        history: chatHistory.slice(-8),
        context: { source: "site", subject: "turismo no Brasil" },
        search: true,
      }),
    });
    window.clearTimeout(timeout);

    if (response.status === 429) {
      return "A Maya recebeu muitas perguntas agora. Aguarde um minuto e tente novamente, ou fale com nossa equipe pelo WhatsApp.";
    }
    if (!response.ok) return null;

    const data = (await response.json()) as MayaResponse;
    const answer = data.answer?.trim();
    if (!answer) return null;
    return answer.length > 2_000 ? `${answer.slice(0, 2_000)}...` : answer;
  } catch (error) {
    console.error("[Maya] Erro de conexão:", error);
    return "Não consegui completar a consulta agora. Tente novamente em alguns instantes.";
  }
}

export function isGeminiAvailable(): boolean {
  const { proxyUrl, supabaseKey } = getMayaConfig();
  return Boolean(proxyUrl && supabaseKey);
}

