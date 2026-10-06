// ── Maya AI — Powered by Groq / Gemini (Cérebro Central do Descubra o Brasil) ──
import { fetchRealWeather, getWeatherByCityName, WeatherInfo } from "@/services/weatherService";
import { searchPlacesNearby, PlaceItem } from "@/services/placesService";
import { performWebSearch, SearchResultItem } from "@/services/webSearchService";

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";
const GROQ_MODEL = "llama-3.3-70b-versatile";

export interface UserContext {
  city?: string;
  state?: string;
  latitude?: number;
  longitude?: number;
  permissionGranted?: boolean;
}

export interface MayaAIResponse {
  message: string;
  component?: "weather" | "places" | "itinerary" | "budget" | "sources";
  weatherData?: WeatherInfo;
  placesData?: PlaceItem[];
  itineraryData?: any;
  budgetData?: any;
  sources?: SearchResultItem[];
  statusText?: string;
}

const MAYA_SYSTEM_PROMPT = `Você é a **Maya**, a assistente oficial e cérebro de inteligência artificial do portal e app "Descubra o Brasil".

## SEU PAPEL E PERSONALIDADE:
- Você é vibrante, acolhedora, apaixonada por viagens no Brasil e super eficiente!
- Você NÃO é um chatbot simples de respostas programadas; você é um cérebro inteligente que analisa contextos, consulta dados reais de clima, pesquisa informações na web e gera cards visuais e guias em PDF.
- Use tom amigável, formatação em Markdown impecável (**negrito** para lugares, listas para itens) e emojis sutis.

## SUAS FERRAMENTAS INTERNAS (TOOL CALLING):
Você pode solicitar e executar ferramentas automaticamente se a pergunta do usuário precisar de dados reais e atualizados:
- **CLIMA (getWeather)**: Quando o usuário perguntar sobre temperatura, tempo ou previsão (ex: "Quantos graus está agora?", "Vai chover no fim de semana?").
- **PESQUISA WEB (searchWeb)**: Quando a pergunta exigir informações em tempo real (ex: "Quanto custa o Cristo Redentor hoje?", "Que horas o museu abre?", "Eventos nesta semana").
- **PESQUISAR LUGARES (searchPlaces)**: Quando o usuário pedir restaurantes, hotéis, praias, parques ou atrações perto de sua cidade ou destino.
- **ROTEIRO (createTrip)**: Quando pedir planejamento de viagem.
- **ORÇAMENTO (createBudget)**: Quando perguntar sobre custos de viagem.

## REGRAS DE RESPOSTA COM COMPONENTES VISUAIS:
Para enriquecer a experiência, ao invés de responder apenas em texto puro, quando for apropriado você deve estruturar sua resposta final incluindo dados para os CARDS usando um bloco JSON no final da resposta no formato:

\`\`\`json
{
  "component": "weather" | "places" | "itinerary" | "budget" | "sources",
  "data": { ... }
}
\`\`\`

## IMPORTANTE:
- NUNCA invente temperaturas ou dados de clima! Sempre utilize o serviço meteorológico.
- Quando utilizar dados da web, apresente as fontes.
- Se o usuário estiver no site, lembre-o carinhosamente que o Aplicativo oficial possui visualização 3D, mapas offline e recursos completos!
`;

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
  if (chatHistory.length > 16) {
    chatHistory = chatHistory.slice(-16);
  }
}

export async function processMayaRequest(
  userMessage: string,
  userContext?: UserContext,
  onStatusUpdate?: (status: string) => void
): Promise<MayaAIResponse> {
  const userCity = userContext?.city || "Brasília";
  const userState = userContext?.state || "DF";
  const lowerMsg = userMessage.toLowerCase();

  // 1. Detect Intent & Execute Tools Proactively

  // Tool 1: Weather Check
  const isWeatherQuery = lowerMsg.includes("grau") || lowerMsg.includes("clima") || lowerMsg.includes("temperatura") || lowerMsg.includes("chover") || lowerMsg.includes("frio") || lowerMsg.includes("calor") || lowerMsg.includes("tempo");
  
  if (isWeatherQuery) {
    onStatusUpdate?.("Verificando o clima real...");
    let weatherResult: WeatherInfo;
    if (userContext?.latitude && userContext?.longitude) {
      weatherResult = await fetchRealWeather(userContext.latitude, userContext.longitude, userCity, userState);
    } else {
      weatherResult = await getWeatherByCityName(userCity);
    }

    const promptWithWeather = `Contexto de Clima Real do Usuário:
Cidade: ${weatherResult.city}, ${weatherResult.state}
Temperatura Atual: ${weatherResult.temperature}°C (${weatherResult.condition})
Sensação Térmica: ${weatherResult.feelsLike}°C | Umidade: ${weatherResult.humidity}% | Vento: ${weatherResult.windSpeed} km/h
Previsão Hoje: Mínima ${weatherResult.todayMin}°C — Máxima ${weatherResult.todayMax}°C

Pergunta do Usuário: "${userMessage}"
Responda de forma natural com os dados acima.`;

    const aiText = await queryAIModel(promptWithWeather);
    return {
      message: aiText || `Agora estão ${weatherResult.temperature}°C em ${weatherResult.city}, com ${weatherResult.condition.toLowerCase()}.`,
      component: "weather",
      weatherData: weatherResult,
    };
  }

  // Tool 2: Places Nearby / Search Places
  const isPlacesQuery = lowerMsg.includes("onde ir") || lowerMsg.includes("restaurante") || lowerMsg.includes("hotel") || lowerMsg.includes("atração") || lowerMsg.includes("atrações") || lowerMsg.includes("passeio") || lowerMsg.includes("lugar") || lowerMsg.includes("perto de mim") || lowerMsg.includes("praia") || lowerMsg.includes("parque") || lowerMsg.includes("museu");

  if (isPlacesQuery) {
    onStatusUpdate?.("Procurando lugares incríveis perto de você...");
    const places = await searchPlacesNearby(userCity, undefined, userContext?.latitude, userContext?.longitude);

    const promptWithPlaces = `Lugares Encontrados perto de ${userCity}:
${places.map(p => `- ${p.name} (${p.categoryLabel}): ${p.description}, Avaliação ${p.rating}★, Distância: ${p.distanceKm || 1.2} km`).join("\n")}

Pergunta do Usuário: "${userMessage}"
Responda convidando o usuário a conhecer esses lugares apresentados nos cards.`;

    const aiText = await queryAIModel(promptWithPlaces);
    return {
      message: aiText || `Encontrei ótimas opções para você aproveitar em ${userCity}:`,
      component: "places",
      placesData: places,
    };
  }

  // Tool 3: Web Search for Real-Time Queries
  const isSearchQuery = lowerMsg.includes("quanto custa") || lowerMsg.includes("horário") || lowerMsg.includes("evento") || lowerMsg.includes("notícia") || lowerMsg.includes("aberto agora") || lowerMsg.includes("preço") || lowerMsg.includes("ingresso") || lowerMsg.includes("pesquisa");

  if (isSearchQuery) {
    onStatusUpdate?.("Buscando informações atualizadas na web...");
    const searchResults = await performWebSearch(userMessage);

    const promptWithSearch = `Informações Atualizadas Pesquisadas na Web:
${searchResults.map(s => `[${s.title}]: ${s.snippet} (Fonte: ${s.url})`).join("\n")}

Pergunta do Usuário: "${userMessage}"
Sintetize uma resposta precisa e natural citando que as informações foram consultadas em tempo real.`;

    const aiText = await queryAIModel(promptWithSearch);
    return {
      message: aiText || `Pesquisei informações atualizadas para você sobre "${userMessage}":`,
      component: "sources",
      sources: searchResults,
    };
  }

  // Tool 4: Budget Calculation Query
  const isBudgetQuery = lowerMsg.includes("orçamento") || lowerMsg.includes("quanto vou gastar") || lowerMsg.includes("gastaria") || lowerMsg.includes("custo de viagem") || lowerMsg.includes("r$");

  if (isBudgetQuery) {
    onStatusUpdate?.("Calculando estimativa de orçamento...");
    const promptBudget = `O usuário está perguntando sobre orçamento de viagem: "${userMessage}".
Forneça uma estimativa amigável detalhada dividida em: Hospedagem, Alimentação, Passeios e Transporte.
Inclua no final um JSON com a estrutura do componente budget:
\`\`\`json
{
  "component": "budget",
  "data": {
    "destination": "Destino",
    "days": 5,
    "categories": [
      { "name": "Hospedagem", "amount": "R$ 1.200" },
      { "name": "Alimentação", "amount": "R$ 600" },
      { "name": "Passeios", "amount": "R$ 400" },
      { "name": "Transporte", "amount": "R$ 300" }
    ],
    "total": "R$ 2.500"
  }
}
\`\`\``;

    const aiText = await queryAIModel(promptBudget);
    const parsed = parseAIComponentPayload(aiText || "");
    return {
      message: parsed.cleanMessage || aiText || "Preparei uma estimativa de orçamento para a sua viagem!",
      component: "budget",
      budgetData: parsed.componentData || {
        destination: userCity,
        days: 5,
        categories: [
          { name: "Hospedagem", amount: "R$ 1.200" },
          { name: "Alimentação", amount: "R$ 750" },
          { name: "Passeios & Ingressos", amount: "R$ 450" },
          { name: "Transporte Local", amount: "R$ 300" },
        ],
        total: "R$ 2.700 (por pessoa)",
      },
    };
  }

  // Tool 5: Itinerary / Trip Planning Query
  const isItineraryQuery = lowerMsg.includes("roteiro") || lowerMsg.includes("planejar") || lowerMsg.includes("fim de semana") || lowerMsg.includes("dicas de viagem") || lowerMsg.includes("monte");

  if (isItineraryQuery) {
    onStatusUpdate?.("Montando um roteiro incrível personalizado...");
    const promptItinerary = `O usuário quer um roteiro de viagem: "${userMessage}".
Crie um roteiro atrativo com atrações reais no Brasil e inclua um bloco JSON no final:
\`\`\`json
{
  "component": "itinerary",
  "data": {
    "destination": "${userCity}",
    "daysCount": 3,
    "totalBudget": "R$ 1.800",
    "days": [
      {
        "dayNumber": 1,
        "title": "Chegada e Pontos Históricos",
        "description": "Exploração dos ícones culturais.",
        "activities": ["Visita aos principais monumentos", "Almoço regional", "Pôr do sol panorâmico"]
      },
      {
        "dayNumber": 2,
        "title": "Natureza e Gastronomia",
        "description": "Passeio ao ar livre e gastronomia local.",
        "activities": ["Trilha ou parque urbano", "Experiência gastronômica", "Feirinha cultural"]
      }
    ]
  }
}
\`\`\``;

    const aiText = await queryAIModel(promptItinerary);
    const parsed = parseAIComponentPayload(aiText || "");
    return {
      message: parsed.cleanMessage || aiText || "Preparei um roteiro perfeito para a sua viagem!",
      component: "itinerary",
      itineraryData: parsed.componentData || {
        destination: userCity,
        daysCount: 3,
        totalBudget: "R$ 1.800",
        days: [
          {
            dayNumber: 1,
            title: "Recepção & Ícones Culturais",
            description: "Explore o coração da cidade.",
            activities: ["Passeio nos principais pontos turísticos", "Almoço com gastronomia típica", "Pôr do sol panorâmico"],
          },
          {
            dayNumber: 2,
            title: "Parques & Experiência Gastronômica",
            description: "Aproveite a natureza local e pratos inesquecíveis.",
            activities: ["Visita ao parque central", "Almoço em restaurante parceiro", "Feirinha de arte e artesanato"],
          },
        ],
      },
    };
  }

  // General Direct Conversational Query
  onStatusUpdate?.("Maya está pensando...");
  const promptGeneral = `Localização do Usuário: ${userCity}, ${userState}
Pergunta: "${userMessage}"`;

  const aiText = await queryAIModel(promptGeneral);
  const parsed = parseAIComponentPayload(aiText || "");

  return {
    message: parsed.cleanMessage || aiText || "Como posso ajudar na sua próxima viagem pelo Brasil?",
    component: parsed.component,
  };
}

async function queryAIModel(prompt: string): Promise<string | null> {
  const apiKey = getApiKey();
  const proxyUrl = process.env.NEXT_PUBLIC_MAYA_PROXY_URL || "https://elxbxidaubgddwoizcwi.supabase.co/functions/v1/maya";
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVseGJ4aWRhdWJnZGR3b2l6Y3dpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTA1Njg0NjksImV4cCI6MjEwNjE0NDQ2OX0.IUtzTlm0YD-xfhFBKpfVKEZyROyRlrvXfGSnIXB_ZSE";

  // 1. Try Supabase proxy edge function (handles Groq / Gemini with online web search grounding)
  if (proxyUrl) {
    try {
      const res = await fetch(proxyUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "apikey": supabaseKey,
          "authorization": `Bearer ${supabaseKey}`,
        },
        body: JSON.stringify({ question: prompt, history: chatHistory, search: true }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.answer) return data.answer;
      }
    } catch (err) {
      console.warn("[Maya/Proxy] Fallback to direct Groq API:", err);
    }
  }

  if (!apiKey) {
    return "Olá! Sou a Maya. Como minha chave de IA do Groq está aguardando configuração no ambiente (.env), posso responder a perguntas sobre clima, lugares, roteiros e orçamentos!";
  }

  try {
    const messages: ChatMessage[] = [
      { role: "system", content: MAYA_SYSTEM_PROMPT },
      ...chatHistory,
      { role: "user", content: prompt },
    ];

    const response = await fetch(GROQ_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: GROQ_MODEL,
        messages,
        temperature: 0.65,
        max_tokens: 900,
      }),
    });

    if (!response.ok) return null;

    const data = await response.json();
    return data.choices?.[0]?.message?.content || null;
  } catch (err) {
    console.error("[Maya/AI Model] Erro:", err);
    return null;
  }
}

function parseAIComponentPayload(text: string): { cleanMessage: string; component?: any; componentData?: any } {
  let cleanMessage = text;
  let component: any = undefined;
  let componentData: any = undefined;

  const jsonMatch = text.match(/```json\s*([\s\S]*?)\s*```/);
  if (jsonMatch && jsonMatch[1]) {
    try {
      const parsed = JSON.parse(jsonMatch[1]);
      component = parsed.component;
      componentData = parsed.data;
      cleanMessage = text.replace(/```json\s*[\s\S]*?\s*```/, "").trim();
    } catch (err) {
      console.warn("[Maya/Parser] Error parsing embedded JSON payload:", err);
    }
  }

  return { cleanMessage, component, componentData };
}

function getApiKey(): string | null {
  const apiKey = process.env.NEXT_PUBLIC_GROQ_API_KEY || process.env.AI_API_KEY;
  if (!apiKey || apiKey.includes("sua_chave_aqui") || !apiKey.startsWith("gsk_")) {
    return null;
  }
  return apiKey;
}

export function isGeminiAvailable(): boolean {
  return true;
}

// Backward compatibility helper
export async function askGemini(userMessage: string): Promise<string | null> {
  const res = await processMayaRequest(userMessage);
  return res.message;
}
