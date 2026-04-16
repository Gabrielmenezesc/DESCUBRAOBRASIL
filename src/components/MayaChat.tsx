"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, MessageCircle, Mic, MicOff, Loader2, MapPin, Sparkles, Volume2, VolumeX } from "lucide-react";

const WHATSAPP_NUMBER = "5538991621135";
const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=`;
const INSTAGRAM_URL = "https://instagram.com/descubraobrasiloficial";

// ── Types ──────────────────────────────────────────────────────
interface Message {
  from: "maya" | "user";
  text: string;
  timestamp: Date;
  quickReplies?: QuickReply[];
}

interface QuickReply {
  label: string;
  value: string;
}

interface LeadData {
  nome?: string;
  destino?: string;
  estado?: string;
  regiao?: string;
  periodo?: string;
  duracao?: string;
  orcamento?: string;
  estilo?: string;
  pessoas?: string;
  tipoGrupo?: string;
  interesses?: string[];
  whatsapp?: string;
}

type ConversationStage =
  | "greeting"
  | "menu"
  | "exploring_destinations"
  | "exploring_by_region"
  | "exploring_by_state"
  | "exploring_by_type"
  | "destination_detail"
  | "free_attractions"
  | "hotels"
  | "restaurants"
  | "itinerary"
  | "qualifying"
  | "qualifying_name"
  | "qualifying_destination"
  | "qualifying_dates"
  | "qualifying_duration"
  | "qualifying_budget"
  | "qualifying_group"
  | "qualifying_people"
  | "qualifying_style"
  | "conversion"
  | "whatsapp_offer"
  | "ebook_offer"
  | "general_help"
  | "best_time"
  | "economic_travel"
  | "compare_destinations";

// ── Destination Knowledge Base ─────────────────────────────────
const DESTINATIONS: Record<string, {
  name: string;
  state: string;
  region: string;
  type: string[];
  description: string;
  highlights: string[];
  freeAttractions: string[];
  bestTime: string;
  avgBudget: string;
}> = {
  "fernando_de_noronha": {
    name: "Fernando de Noronha",
    state: "PE",
    region: "Nordeste",
    type: ["praia", "ecoturismo", "mergulho"],
    description: "Arquipélago paradisíaco com águas cristalinas e vida marinha exuberante.",
    highlights: ["Baía do Sancho", "Praia do Leão", "Mergulho com golfinhos"],
    freeAttractions: ["Mirante do Boldró", "Praia do Cachorro", "Forte de Nossa Senhora dos Remédios"],
    bestTime: "Agosto a Dezembro (seco, mar calmo)",
    avgBudget: "R$ 400-800/dia"
  },
  "jericoacoara": {
    name: "Jericoacoara",
    state: "CE",
    region: "Nordeste",
    type: ["praia", "aventura", "romântico"],
    description: "Vila rústica com dunas impressionantes, lagoas e pôr do sol inesquecível.",
    highlights: ["Duna do Pôr do Sol", "Lagoa do Paraíso", "Pedra Furada"],
    freeAttractions: ["Duna do Pôr do Sol", "Praia de Jericoacoara", "Serrote"],
    bestTime: "Julho a Dezembro (sem chuvas)",
    avgBudget: "R$ 200-500/dia"
  },
  "arraial_do_cabo": {
    name: "Arraial do Cabo",
    state: "RJ",
    region: "Sudeste",
    type: ["praia", "mergulho", "econômico"],
    description: "O Caribe Brasileiro, com praias de água azul turquesa e mergulhos fantásticos.",
    highlights: ["Praia do Forno", "Prainhas do Pontal", "Gruta Azul"],
    freeAttractions: ["Praia dos Anjos", "Mirante da Atalaia", "Praia Grande"],
    bestTime: "Novembro a Março (verão)",
    avgBudget: "R$ 150-350/dia"
  },
  "salvador": {
    name: "Salvador",
    state: "BA",
    region: "Nordeste",
    type: ["cultura", "história", "gastronomia", "praia"],
    description: "Capital da alegria, com o Pelourinho, axé, acarajé e praias urbanas incríveis.",
    highlights: ["Pelourinho", "Elevador Lacerda", "Mercado Modelo"],
    freeAttractions: ["Pelourinho (caminhar)", "Farol da Barra", "Igreja do Bonfim", "Porto da Barra"],
    bestTime: "Dezembro a Março (verão e Carnaval)",
    avgBudget: "R$ 150-400/dia"
  },
  "ouro_preto": {
    name: "Ouro Preto",
    state: "MG",
    region: "Sudeste",
    type: ["história", "cultura", "gastronomia"],
    description: "Patrimônio mundial com igrejas barrocas, ladeiras históricas e culinária mineira.",
    highlights: ["Igreja de São Francisco de Assis", "Mina de Ouro", "Museu da Inconfidência"],
    freeAttractions: ["Caminhar pelas ladeiras históricas", "Praça Tiradentes", "Mirantes naturais"],
    bestTime: "Abril a Setembro (seco)",
    avgBudget: "R$ 150-300/dia"
  },
  "chapada_dos_veadeiros": {
    name: "Chapada dos Veadeiros",
    state: "GO",
    region: "Centro-Oeste",
    type: ["ecoturismo", "aventura", "natureza"],
    description: "Cachoeiras espetaculares, trilhas e formações rochosas no coração do cerrado.",
    highlights: ["Cachoeira Santa Bárbara", "Vale da Lua", "Mirante da Janela"],
    freeAttractions: ["Trilhas no Parque Nacional", "Cachoeira Almécegas 1000", "Vila de São Jorge"],
    bestTime: "Maio a Setembro (seco, cachoeiras cheias)",
    avgBudget: "R$ 150-350/dia"
  },
  "pantanal": {
    name: "Pantanal",
    state: "MS/MT",
    region: "Centro-Oeste",
    type: ["ecoturismo", "natureza", "aventura", "safari"],
    description: "Maior planície alagada do mundo, paraíso de fauna e flora.",
    highlights: ["Safari fotográfico", "Pesca esportiva", "Observação de onças"],
    freeAttractions: ["Estrada Parque (autoguiada)", "Observação de aves", "Pôr do sol no rio"],
    bestTime: "Maio a Setembro (seco, animais concentrados)",
    avgBudget: "R$ 300-600/dia"
  },
  "amazonia": {
    name: "Amazônia",
    state: "AM",
    region: "Norte",
    type: ["ecoturismo", "natureza", "aventura", "cultural"],
    description: "A maior floresta tropical do planeta. Experiência única de conexão com a natureza.",
    highlights: ["Encontro das Águas", "Floresta de igapó", "Comunidades ribeirinhas"],
    freeAttractions: ["Praia da Ponta Negra", "Mercado Municipal de Manaus", "Teatro Amazonas (externo)"],
    bestTime: "Junho a Novembro (seco, praias fluviais)",
    avgBudget: "R$ 250-500/dia"
  },
  "gramado": {
    name: "Gramado",
    state: "RS",
    region: "Sul",
    type: ["romântico", "gastronomia", "frio", "família"],
    description: "Cidade encantadora na Serra Gaúcha, com charme europeu e fondue.",
    highlights: ["Lago Negro", "Mini Mundo", "Natal Luz"],
    freeAttractions: ["Lago Negro", "Rua Coberta", "Praça das Etnias"],
    bestTime: "Junho a Agosto (frio intenso, fondue) ou Dezembro (Natal Luz)",
    avgBudget: "R$ 200-500/dia"
  },
  "bonito": {
    name: "Bonito",
    state: "MS",
    region: "Centro-Oeste",
    type: ["ecoturismo", "aventura", "mergulho", "natureza"],
    description: "Capital do ecoturismo com rios cristalinos, grutas e flutuação.",
    highlights: ["Gruta do Lago Azul", "Rio da Prata", "Abismo Anhumas"],
    freeAttractions: ["Balneário Municipal", "Praça da Liberdade", "Rio Formoso (trechos)"],
    bestTime: "Dezembro a Março (cheias, melhor flutuação)",
    avgBudget: "R$ 200-450/dia"
  },
  "sao_luis": {
    name: "São Luís",
    state: "MA",
    region: "Nordeste",
    type: ["cultura", "história", "gastronomia"],
    description: "Patrimônio UNESCO com azulejos portugueses, reggae e bumba-meu-boi.",
    highlights: ["Centro Histórico", "Bumba-meu-boi", "Lençóis Maranhenses (próximo)"],
    freeAttractions: ["Centro Histórico", "Praias urbanas", "Feira da Praia Grande"],
    bestTime: "Julho a Dezembro (seco)",
    avgBudget: "R$ 120-300/dia"
  },
  "lencois_maranhenses": {
    name: "Lençóis Maranhenses",
    state: "MA",
    region: "Nordeste",
    type: ["natureza", "aventura", "praia"],
    description: "Dunas imensas com lagoas de água doce cristalina — paisagem surreal.",
    highlights: ["Lagoa Azul", "Lagoa Bonita", "Passeio de 4x4"],
    freeAttractions: ["Dunas próximas a Barreirinhas", "Rio Preguiças (trechos)", "Santo Amaro"],
    bestTime: "Junho a Setembro (lagoas cheias)",
    avgBudget: "R$ 150-350/dia"
  },
  "foz_do_iguacu": {
    name: "Foz do Iguaçu",
    state: "PR",
    region: "Sul",
    type: ["natureza", "aventura", "família"],
    description: "Cataratas impressionantes, Patrimônio UNESCO e tríplice fronteira.",
    highlights: ["Cataratas do Iguaçu", "Itaipu", "Marco das Três Fronteiras"],
    freeAttractions: ["Bosque Guarani (gratuito em dias específicos)", "Marco das Três Fronteiras (vista)", "Mesquita Omar Ibn Al-Khattab"],
    bestTime: "Março a Maio e Agosto a Novembro (clima agradável, bom volume de água)",
    avgBudget: "R$ 200-400/dia"
  },
  "rio_de_janeiro": {
    name: "Rio de Janeiro",
    state: "RJ",
    region: "Sudeste",
    type: ["praia", "cultura", "gastronomia", "urbano", "família"],
    description: "A Cidade Maravilhosa com praias icônicas, Cristo Redentor e samba.",
    highlights: ["Cristo Redentor", "Pão de Açúcar", "Copacabana"],
    freeAttractions: ["Praia de Copacabana", "Ipanema", "Parque Lage", "Mureta da Urca", "Escadaria Selarón"],
    bestTime: "Maio a Novembro (menos chuvas, temperatura agradável)",
    avgBudget: "R$ 200-500/dia"
  },
  "florianopolis": {
    name: "Florianópolis",
    state: "SC",
    region: "Sul",
    type: ["praia", "natureza", "surf", "gastronomia"],
    description: "Ilha da Magia com 42 praias, trilhas e gastronomia à base de frutos do mar.",
    highlights: ["Praia da Joaquina", "Lagoa da Conceição", "Santo Antônio de Lisboa"],
    freeAttractions: ["Praias (todas gratuitas)", "Trilha da Lagoinha do Leste", "Mirante do Morro da Cruz"],
    bestTime: "Dezembro a Março (verão)",
    avgBudget: "R$ 200-450/dia"
  },
  "natal": {
    name: "Natal",
    state: "RN",
    region: "Nordeste",
    type: ["praia", "aventura", "família", "econômico"],
    description: "Cidade do sol, com praias quentes o ano inteiro, dunas e passeios de buggy.",
    highlights: ["Praia de Ponta Negra", "Genipabu", "Forte dos Reis Magos"],
    freeAttractions: ["Ponta Negra", "Praia de Redinha", "Centro Histórico de Natal"],
    bestTime: "Setembro a Fevereiro (sol pleno)",
    avgBudget: "R$ 150-350/dia"
  },
  "porto_de_galinhas": {
    name: "Porto de Galinhas",
    state: "PE",
    region: "Nordeste",
    type: ["praia", "mergulho", "romântico", "família"],
    description: "Piscinas naturais de águas mornas e cristalinas na costa pernambucana.",
    highlights: ["Piscinas naturais", "Praia de Cupe", "Passeio de jangada"],
    freeAttractions: ["Praia de Porto de Galinhas", "Vila (centro)", "Praia de Maracaípe"],
    bestTime: "Setembro a Março (mar calmo, sol)",
    avgBudget: "R$ 200-450/dia"
  },
  "chapada_diamantina": {
    name: "Chapada Diamantina",
    state: "BA",
    region: "Nordeste",
    type: ["ecoturismo", "aventura", "natureza", "trilha"],
    description: "Paisagens épicas com grutas, cachoeiras e trilhas no coração da Bahia.",
    highlights: ["Cachoeira da Fumaça", "Poço Azul", "Vale do Pati"],
    freeAttractions: ["Morro do Pai Inácio (vista)", "Cachoeiras acessíveis", "Vilas históricas"],
    bestTime: "Maio a Outubro (seco)",
    avgBudget: "R$ 150-350/dia"
  },
  "campos_do_jordao": {
    name: "Campos do Jordão",
    state: "SP",
    region: "Sudeste",
    type: ["frio", "romântico", "gastronomia", "aventura"],
    description: "A Suíça brasileira, com clima frio, chocolaterias e natureza na serra paulista.",
    highlights: ["Pico do Itapeva", "Teleférico", "Horto Florestal"],
    freeAttractions: ["Praça do Capivari", "Ducha de Prata", "Trilhas no Horto Florestal"],
    bestTime: "Maio a Agosto (frio intenso, Festival de Inverno)",
    avgBudget: "R$ 250-500/dia"
  },
  "maceio": {
    name: "Maceió",
    state: "AL",
    region: "Nordeste",
    type: ["praia", "mergulho", "econômico", "família"],
    description: "Praias de águas verde-esmeralda e piscinas naturais no litoral alagoano.",
    highlights: ["Praia do Francês", "Maragogi", "Praia de Pajuçara"],
    freeAttractions: ["Praia de Pajuçara", "Orla de Ponta Verde", "Mercado do Artesanato"],
    bestTime: "Outubro a Março (verão, mar calmo)",
    avgBudget: "R$ 150-350/dia"
  },
};

// ── Region/State mappings ─────────────────────────────────────
const REGIONS: Record<string, string[]> = {
  "Norte": ["AM", "PA", "AC", "RR", "RO", "AP", "TO"],
  "Nordeste": ["BA", "CE", "MA", "PE", "PI", "RN", "PB", "SE", "AL"],
  "Sudeste": ["SP", "RJ", "MG", "ES"],
  "Sul": ["PR", "SC", "RS"],
  "Centro-Oeste": ["GO", "MT", "MS", "DF"]
};

const STATE_NAMES: Record<string, string> = {
  "AC": "Acre", "AL": "Alagoas", "AP": "Amapá", "AM": "Amazonas",
  "BA": "Bahia", "CE": "Ceará", "DF": "Distrito Federal", "ES": "Espírito Santo",
  "GO": "Goiás", "MA": "Maranhão", "MT": "Mato Grosso", "MS": "Mato Grosso do Sul",
  "MG": "Minas Gerais", "PA": "Pará", "PB": "Paraíba", "PR": "Paraná",
  "PE": "Pernambuco", "PI": "Piauí", "RJ": "Rio de Janeiro", "RN": "Rio Grande do Norte",
  "RS": "Rio Grande do Sul", "RO": "Rondônia", "RR": "Roraima", "SC": "Santa Catarina",
  "SP": "São Paulo", "SE": "Sergipe", "TO": "Tocantins"
};

const TRIP_TYPES: Record<string, string[]> = {
  "praia": ["praia", "mar", "litoral", "areia", "mergulho", "surf"],
  "ecoturismo": ["eco", "natureza", "trilha", "cachoeira", "floresta", "mata", "parque"],
  "cultura": ["cultura", "história", "museu", "igreja", "patrimônio", "arquitetura"],
  "aventura": ["aventura", "radical", "rapel", "escalada", "rafting", "boia"],
  "gastronomia": ["gastronomia", "comida", "restaurante", "culinária", "comer"],
  "romântico": ["romântico", "casal", "lua de mel", "honeymoon"],
  "família": ["família", "criança", "kids", "parque", "diversão"],
  "econômico": ["barato", "econômico", "economia", "gastar pouco", "orçamento baixo", "grátis", "gratuito"],
  "frio": ["frio", "serra", "inverno", "montanha", "chocolate", "fondue"],
};

// ── Helpers ────────────────────────────────────────────────────
function parseMarkdown(text: string): string {
  return text
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/\n/g, "<br/>");
}

function normalize(text: string): string {
  return text.toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .trim();
}

function findDestinations(input: string): string[] {
  const norm = normalize(input);
  const matches: string[] = [];
  
  for (const [key, dest] of Object.entries(DESTINATIONS)) {
    const destNorm = normalize(dest.name);
    if (norm.includes(destNorm) || destNorm.includes(norm)) {
      matches.push(key);
      continue;
    }
    // Check state
    if (norm.includes(normalize(dest.state)) || norm.includes(normalize(STATE_NAMES[dest.state] || ""))) {
      matches.push(key);
    }
  }
  return matches;
}

function findByRegion(region: string): string[] {
  const norm = normalize(region);
  return Object.entries(DESTINATIONS)
    .filter(([, d]) => normalize(d.region).includes(norm))
    .map(([key]) => key);
}

function findByType(input: string): { type: string; destinations: string[] } | null {
  const norm = normalize(input);
  for (const [type, keywords] of Object.entries(TRIP_TYPES)) {
    if (keywords.some(kw => norm.includes(kw))) {
      const dests = Object.entries(DESTINATIONS)
        .filter(([, d]) => d.type.includes(type))
        .map(([key]) => key);
      return { type, destinations: dests };
    }
  }
  return null;
}

function detectRegion(input: string): string | null {
  const norm = normalize(input);
  for (const region of Object.keys(REGIONS)) {
    if (norm.includes(normalize(region))) return region;
  }
  return null;
}

function detectState(input: string): string | null {
  const norm = normalize(input);
  for (const [abbr, name] of Object.entries(STATE_NAMES)) {
    if (norm.includes(normalize(name)) || norm.includes(normalize(abbr))) return abbr;
  }
  return null;
}

function detectIntent(input: string): string[] {
  const norm = normalize(input);
  const intents: string[] = [];
  
  const intentMap: Record<string, string[]> = {
    "greeting": ["ola", "oi", "bom dia", "boa tarde", "boa noite", "hey", "eae", "fala", "salve", "hello"],
    "destination": ["destino", "lugar", "onde ir", "visitar", "conhecer", "viajar para", "quero ir"],
    "itinerary": ["roteiro", "itinerario", "planejamento", "planejar", "montar roteiro", "organizar viagem"],
    "free": ["gratis", "gratuito", "de graca", "sem pagar", "economizar", "barato"],
    "hotel": ["hotel", "hospedagem", "pousada", "hostel", "onde ficar", "dormir", "airbnb", "reserva"],
    "restaurant": ["restaurante", "comer", "comida", "gastronomia", "culinaria", "onde comer"],
    "best_time": ["melhor epoca", "quando ir", "melhor mes", "clima", "temperatura", "chuva"],
    "whatsapp": ["whatsapp", "falar com alguem", "atendimento", "humano", "pessoa real", "falar com gente", "contato", "falar com pessoa"],
    "ebook": ["ebook", "guia", "livro", "pdf", "material", "roteiro pronto"],
    "economic": ["economico", "barato", "pouco dinheiro", "gastar pouco", "viagem barata"],
    "compare": ["comparar", "diferenca entre", "qual melhor", "ou"],
    "help": ["ajuda", "ajude", "menu", "opcoes", "o que voce faz", "como funciona"],
    "thanks": ["obrigado", "obrigada", "valeu", "brigado", "thanks"],
    "instagram": ["instagram", "insta", "rede social", "foto"],
    "yes": ["sim", "quero", "pode ser", "bora", "vamos", "ok", "claro", "com certeza", "aceito", "manda"],
    "no": ["nao", "agora nao", "depois", "talvez", "to so olhando"],
  };

  for (const [intent, keywords] of Object.entries(intentMap)) {
    if (keywords.some(kw => norm.includes(kw))) {
      intents.push(intent);
    }
  }
  return intents;
}

// ── Warm lead detection ────────────────────────────────────────
function isWarmLead(lead: LeadData): boolean {
  let score = 0;
  if (lead.destino) score += 2;
  if (lead.periodo) score += 2;
  if (lead.orcamento) score += 2;
  if (lead.tipoGrupo) score += 1;
  if (lead.pessoas) score += 1;
  if (lead.nome) score += 1;
  return score >= 4;
}

// ── Main Component ────────────────────────────────────────────
export default function MayaChat() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [stage, setStage] = useState<ConversationStage>("greeting");
  const [leadData, setLeadData] = useState<LeadData>({});
  const [started, setStarted] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [continuousMode, setContinuousMode] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [pulseButton, setPulseButton] = useState(true);
  const [showProactiveHint, setShowProactiveHint] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<any>(null);
  const synthesisRef = useRef<SpeechSynthesis | null>(null);

  // ── Proactive greeting after 8s ─────────────────────────────
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!open && !started) {
        setShowProactiveHint(true);
      }
    }, 8000);
    return () => clearTimeout(timer);
  }, [open, started]);

  // Auto-hide proactive hint after 12s
  useEffect(() => {
    if (showProactiveHint) {
      const timer = setTimeout(() => setShowProactiveHint(false), 12000);
      return () => clearTimeout(timer);
    }
  }, [showProactiveHint]);

  // ── Voice Setup ─────────────────────────────────────────────
  useEffect(() => {
    if (typeof window !== "undefined") {
      synthesisRef.current = window.speechSynthesis;
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.lang = "pt-BR";
        recognitionRef.current.continuous = false;
        recognitionRef.current.interimResults = false;

        recognitionRef.current.onstart = () => setIsListening(true);
        recognitionRef.current.onend = () => {
          setIsListening(false);
          if (continuousMode && !isSpeaking && open) {
            setTimeout(() => { if (continuousMode && !isSpeaking) recognitionRef.current?.start(); }, 500);
          }
        };

        recognitionRef.current.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          handleUserMessage(transcript);
        };

        recognitionRef.current.onerror = (event: any) => {
          console.error("[MayaVoice] Error:", event.error);
          setIsListening(false);
        };
      }
    }
  }, [continuousMode, isSpeaking, open]);

  const mayaSpeak = useCallback((text: string) => {
    if (!voiceEnabled || !synthesisRef.current) return;
    synthesisRef.current.cancel();
    // Clean markdown for speech
    const clean = text.replace(/\*\*/g, "").replace(/\n/g, ". ");
    const utterance = new SpeechSynthesisUtterance(clean);
    utterance.lang = "pt-BR";
    utterance.rate = 1.05;

    utterance.onstart = () => {
      setIsSpeaking(true);
      if (isListening) recognitionRef.current?.stop();
    };

    utterance.onend = () => {
      setIsSpeaking(false);
      if (continuousMode && open) {
        setTimeout(() => { if (continuousMode) recognitionRef.current?.start(); }, 500);
      }
    };

    synthesisRef.current.speak(utterance);
  }, [voiceEnabled, continuousMode, isListening, open]);

  const toggleVoice = () => {
    if (isListening) {
      setContinuousMode(false);
      recognitionRef.current?.stop();
    } else {
      setContinuousMode(true);
      recognitionRef.current?.start();
    }
  };

  const toggleVoiceEnabled = () => {
    const newState = !voiceEnabled;
    setVoiceEnabled(newState);
    if (!newState) {
      synthesisRef.current?.cancel();
      setIsSpeaking(false);
      setContinuousMode(false);
      recognitionRef.current?.stop();
      setIsListening(false);
    }
  };

  // ── Scroll ──────────────────────────────────────────────────
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ── Personalized greeting with name ─────────────────────────
  function getGreetingPrefix(): string {
    if (leadData.nome) return `${leadData.nome}, `;
    return "";
  }

  // ── Add Maya Message ─────────────────────────────────────────
  function addMayaMessage(text: string, quickReplies?: QuickReply[]) {
    setIsTyping(true);
    const delay = Math.min(600 + text.length * 6, 1800);
    setTimeout(() => {
      setIsTyping(false);
      setMessages(prev => [...prev, {
        from: "maya",
        text,
        timestamp: new Date(),
        quickReplies,
      }]);
      mayaSpeak(text);
    }, delay);
  }

  // ── Open Chat ────────────────────────────────────────────────
  function openChat() {
    setOpen(true);
    setPulseButton(false);
    setShowProactiveHint(false);
    if (!started) {
      setStarted(true);
      setTimeout(() => {
        addMayaMessage(
          "Olá! 👋 Sou a **Maya**, sua guia de turismo virtual do **Descubra o Brasil**!\n\nEstou aqui para te ajudar a encontrar os melhores destinos, montar roteiros, descobrir **lugares gratuitos**, hotéis, restaurantes e muito mais.\n\nComo posso te ajudar hoje?",
          [
            { label: "🌎 Encontrar um destino", value: "destino" },
            { label: "🗺️ Montar um roteiro", value: "roteiro" },
            { label: "🆓 Lugares grátis", value: "gratis" },
            { label: "🏨 Hotéis e restaurantes", value: "hotel_restaurante" },
            { label: "💬 Falar com especialista", value: "whatsapp" },
          ]
        );
        setStage("menu");
      }, 300);
    }
  }

  // ── Core Conversation Engine ─────────────────────────────────
  function handleUserMessage(text: string) {
    const trimmed = text.trim();
    if (!trimmed) return;

    setMessages(prev => [...prev, {
      from: "user",
      text: trimmed,
      timestamp: new Date(),
    }]);
    setInputText("");

    processMessage(trimmed);
  }

  function processMessage(text: string) {
    const intents = detectIntent(text);
    const norm = normalize(text);
    const destMatches = findDestinations(text);
    const regionMatch = detectRegion(text);
    const stateMatch = detectState(text);
    const typeMatch = findByType(text);

    // ── Priority: WhatsApp / Human Contact ─────────────────
    if (intents.includes("whatsapp")) {
      return handleWhatsAppRequest();
    }

    // ── Priority: Specific destination found ───────────────
    if (destMatches.length > 0) {
      const dest = DESTINATIONS[destMatches[0]];
      setLeadData(prev => ({ ...prev, destino: dest.name, estado: dest.state }));
      return handleDestinationDetail(destMatches[0]);
    }

    // ── Region detection ──────────────────────────────────
    if (regionMatch) {
      return handleRegionExploration(regionMatch);
    }

    // ── State detection ───────────────────────────────────
    if (stateMatch) {
      return handleStateExploration(stateMatch);
    }

    // ── Trip type detection ───────────────────────────────
    if (typeMatch && typeMatch.destinations.length > 0) {
      return handleTypeExploration(typeMatch.type, typeMatch.destinations);
    }

    // ── Handle qualifying stages ──────────────────────────
    if (stage.startsWith("qualifying")) {
      return handleQualifyingResponse(text);
    }

    // ── Intent-based routing ──────────────────────────────
    if (intents.includes("greeting")) {
      return addMayaMessage(
        `Olá! 😊 Que bom te ver por aqui!\n\nPosso te ajudar de 3 formas:\n1️⃣ Encontrar um destino ideal\n2️⃣ Montar um roteiro personalizado\n3️⃣ Ver hotéis, restaurantes e lugares grátis\n\nQual você quer agora?`,
        [
          { label: "1️⃣ Encontrar destino", value: "destino" },
          { label: "2️⃣ Roteiro personalizado", value: "roteiro" },
          { label: "3️⃣ Hotéis e grátis", value: "hotel_restaurante" },
        ]
      );
    }

    if (intents.includes("destination")) {
      setStage("exploring_destinations");
      return addMayaMessage(
        "Ótimo! Vamos encontrar o destino perfeito pra você! 🗺️\n\nVocê pode me dizer:\n• O **nome do destino** que já tem em mente\n• A **região** (Nordeste, Sul, Sudeste...)\n• O **tipo de viagem** (praia, ecoturismo, cultura...)\n\nQual você prefere?",
        [
          { label: "🏖️ Praias", value: "praia" },
          { label: "🌿 Ecoturismo", value: "ecoturismo" },
          { label: "🏛️ Cultura e História", value: "cultura" },
          { label: "🍽️ Gastronomia", value: "gastronomia" },
          { label: "❄️ Frio e Serra", value: "frio" },
        ]
      );
    }

    if (intents.includes("itinerary")) {
      setStage("qualifying_name");
      return addMayaMessage(
        "Perfeito! Vou te ajudar a montar um roteiro incrível! 🗺️✨\n\nPara começar, como posso te chamar?"
      );
    }

    if (intents.includes("free")) {
      return handleFreeAttractions();
    }

    if (intents.includes("hotel")) {
      return handleHotelRequest();
    }

    if (intents.includes("restaurant")) {
      return handleRestaurantRequest();
    }

    if (intents.includes("best_time")) {
      return handleBestTimeRequest();
    }

    if (intents.includes("economic")) {
      return handleEconomicTravel();
    }

    if (intents.includes("ebook")) {
      return handleEbookOffer();
    }

    if (intents.includes("compare")) {
      return handleCompareRequest();
    }

    if (intents.includes("instagram")) {
      return handleInstagram();
    }

    if (intents.includes("thanks")) {
      const namePrefix = leadData.nome ? `${leadData.nome}, eu` : "Eu";
      return addMayaMessage(
        `${namePrefix} que agradeço! 😊 Foi um prazer te ajudar!\n\nSe precisar de mais alguma coisa, é só chamar. Boa viagem! ✈️🇧🇷\n\nQuer continuar explorando?`,
        [
          { label: "🌎 Ver mais destinos", value: "destino" },
          { label: "💬 Falar com especialista", value: "whatsapp" },
          { label: "📸 Seguir no Instagram", value: "instagram" },
        ]
      );
    }

    if (intents.includes("yes") && stage === "whatsapp_offer") {
      return openWhatsApp();
    }

    if (intents.includes("yes") && stage === "conversion") {
      return openWhatsApp();
    }

    if (intents.includes("no")) {
      return addMayaMessage(
        `Sem problemas! 😊 Estou aqui quando precisar.\n\nEnquanto isso, posso te ajudar com:\n1️⃣ Destinos e roteiros\n2️⃣ Lugares gratuitos\n3️⃣ Dicas de economia\n\nO que acha?`,
        [
          { label: "1️⃣ Destinos", value: "destino" },
          { label: "2️⃣ Grátis", value: "gratis" },
          { label: "3️⃣ Economia", value: "economico" },
        ]
      );
    }

    if (intents.includes("help")) {
      return handleHelpMenu();
    }

    // ── Quick reply value matching ────────────────────────
    const quickActions: Record<string, () => void> = {
      "destino": () => processMessage("encontrar destino"),
      "roteiro": () => processMessage("montar roteiro"),
      "gratis": () => processMessage("lugares grátis"),
      "hotel_restaurante": () => {
        addMayaMessage(
          "Posso te ajudar com hospedagem e gastronomia! 🏨🍽️\n\nQual destino te interessa? Me fala o nome da cidade ou região!",
          [
            { label: "🏨 Hotéis", value: "hotel" },
            { label: "🍽️ Restaurantes", value: "restaurante" },
          ]
        );
      },
      "hotel": () => processMessage("hotel"),
      "restaurante": () => processMessage("restaurante"),
      "whatsapp": () => handleWhatsAppRequest(),
      "instagram": () => handleInstagram(),
      "indeciso": () => handleIndecisive(),
      "economico": () => processMessage("viagem econômica"),
      "nordeste": () => handleRegionExploration("Nordeste"),
      "sul": () => handleRegionExploration("Sul"),
      "sudeste": () => handleRegionExploration("Sudeste"),
      "centro-oeste": () => handleRegionExploration("Centro-Oeste"),
      "norte": () => handleRegionExploration("Norte"),
      "praia": () => processMessage("praia"),
      "ecoturismo": () => processMessage("ecoturismo"),
      "cultura": () => processMessage("cultura e história"),
      "gastronomia": () => processMessage("gastronomia"),
      "frio": () => processMessage("frio serra"),
    };

    if (quickActions[norm]) {
      return quickActions[norm]();
    }

    // ── Fallback: Smart default — NEVER say just "não sei" ──
    return handleSmartFallback(text);
  }

  // ── Handler Functions ─────────────────────────────────────────

  function handleDestinationDetail(key: string) {
    const dest = DESTINATIONS[key];
    if (!dest) return handleSmartFallback("");
    
    setStage("destination_detail");
    const nameGreet = leadData.nome ? `${leadData.nome}, olha ` : "Olha ";
    addMayaMessage(
      `${nameGreet}que destino incrível! 🌟\n\n**${dest.name} (${dest.state})** — ${dest.description}\n\n` +
      `📌 **Destaques:**\n${dest.highlights.map(h => `• ${h}`).join("\n")}\n\n` +
      `🆓 **Lugares grátis:**\n${dest.freeAttractions.map(f => `• ${f}`).join("\n")}\n\n` +
      `📅 **Melhor época:** ${dest.bestTime}\n💰 **Orçamento médio:** ${dest.avgBudget}\n\n` +
      `Quer que eu te ajude a planejar essa viagem?`,
      [
        { label: "🗺️ Montar roteiro", value: "roteiro" },
        { label: "🏨 Ver hotéis", value: "hotel" },
        { label: "🍽️ Restaurantes", value: "restaurante" },
        { label: "💬 Falar com especialista", value: "whatsapp" },
        { label: "🔄 Ver outros destinos", value: "destino" },
      ]
    );
  }

  function handleRegionExploration(region: string) {
    setStage("exploring_by_region");
    const destKeys = findByRegion(region);
    
    if (destKeys.length === 0) {
      return addMayaMessage(
        `A região **${region}** tem destinos maravilhosos! 🌎\n\nAinda estou ampliando meu acervo sobre essa região. Que tipo de viagem te interessa? Posso sugerir algo!`,
        [
          { label: "🏖️ Praias", value: "praia" },
          { label: "🌿 Natureza", value: "ecoturismo" },
          { label: "🏛️ Cultura", value: "cultura" },
          { label: "💬 Falar com especialista", value: "whatsapp" },
        ]
      );
    }

    const destList = destKeys.slice(0, 6).map(k => {
      const d = DESTINATIONS[k];
      return `• **${d.name} (${d.state})** — ${d.type.slice(0, 2).join(", ")}`;
    }).join("\n");

    const quickReplies = destKeys.slice(0, 4).map(k => ({
      label: `📍 ${DESTINATIONS[k].name}`,
      value: normalize(DESTINATIONS[k].name),
    }));
    quickReplies.push({ label: "🔄 Outra região", value: "destino" });

    addMayaMessage(
      `🗺️ Ótima escolha! O **${region}** tem destinos incríveis:\n\n${destList}\n\nQual desses te chama mais atenção?`,
      quickReplies
    );
  }

  function handleStateExploration(state: string) {
    setStage("exploring_by_state");
    const stateName = STATE_NAMES[state] || state;
    const destKeys = Object.entries(DESTINATIONS)
      .filter(([, d]) => d.state === state || d.state.includes(state))
      .map(([key]) => key);

    if (destKeys.length === 0) {
      return addMayaMessage(
        `**${stateName}** é um estado incrível! 🌟\n\nAinda estou ampliando meu acervo de destinos nesse estado. Quer que eu te conecte com nosso especialista para te indicar o melhor roteiro?\n\nOu posso te mostrar destinos por tipo de viagem!`,
        [
          { label: "💬 Falar com especialista", value: "whatsapp" },
          { label: "🏖️ Praias", value: "praia" },
          { label: "🌿 Natureza", value: "ecoturismo" },
          { label: "🏛️ Cultura", value: "cultura" },
        ]
      );
    }

    const destList = destKeys.map(k => {
      const d = DESTINATIONS[k];
      return `• **${d.name}** — ${d.description.substring(0, 60)}...`;
    }).join("\n");

    const quickReplies = destKeys.map(k => ({
      label: `📍 ${DESTINATIONS[k].name}`,
      value: normalize(DESTINATIONS[k].name),
    }));
    quickReplies.push({ label: "🔄 Ver outro estado", value: "destino" });

    addMayaMessage(
      `🌟 **${stateName}** tem destinos maravilhosos:\n\n${destList}\n\nQual te interessa mais?`,
      quickReplies
    );
  }

  function handleTypeExploration(type: string, destKeys: string[]) {
    setStage("exploring_by_type");
    const typeLabels: Record<string, string> = {
      "praia": "🏖️ Praias",
      "ecoturismo": "🌿 Ecoturismo",
      "cultura": "🏛️ Cultura e História",
      "aventura": "🧗 Aventura",
      "gastronomia": "🍽️ Gastronomia",
      "romântico": "💕 Viagem Romântica",
      "família": "👨‍👩‍👧‍👦 Família",
      "econômico": "💰 Viagem Econômica",
      "frio": "❄️ Frio e Serra",
    };

    const label = typeLabels[type] || type;
    const destList = destKeys.slice(0, 6).map(k => {
      const d = DESTINATIONS[k];
      return `• **${d.name} (${d.state})** — ${d.description.substring(0, 50)}...`;
    }).join("\n");

    const quickReplies = destKeys.slice(0, 4).map(k => ({
      label: `📍 ${DESTINATIONS[k].name}`,
      value: normalize(DESTINATIONS[k].name),
    }));
    quickReplies.push({ label: "🔄 Outro tipo", value: "destino" });

    addMayaMessage(
      `${label} — Ótima escolha! Separei os melhores destinos:\n\n${destList}\n\nQual destino te chamou mais atenção?`,
      quickReplies
    );
  }

  function handleFreeAttractions() {
    setStage("free_attractions");
    const freeList = Object.entries(DESTINATIONS)
      .slice(0, 6)
      .map(([, d]) => `• **${d.name}**: ${d.freeAttractions[0]}`)
      .join("\n");

    addMayaMessage(
      `🆓 Amo essa! O Brasil tem **muitos** lugares incríveis pra visitar de graça:\n\n${freeList}\n\nQuer ver os detalhes de algum destino? Ou posso filtrar por região!`,
      [
        { label: "🏖️ Nordeste grátis", value: "nordeste" },
        { label: "🏔️ Sul grátis", value: "sul" },
        { label: "🌆 Sudeste grátis", value: "sudeste" },
        { label: "🌿 Centro-Oeste grátis", value: "centro-oeste" },
        { label: "💬 Quero ajuda personalizada", value: "whatsapp" },
      ]
    );
  }

  function handleHotelRequest() {
    setStage("hotels");
    const nameGreet = leadData.nome ? `${leadData.nome}, para` : "Para";
    addMayaMessage(
      `🏨 ${nameGreet} te indicar as melhores hospedagens, preciso saber:\n\nQual **destino** você está pensando em visitar?`,
      [
        { label: "📍 Rio de Janeiro", value: "rio de janeiro" },
        { label: "📍 Salvador", value: "salvador" },
        { label: "📍 Gramado", value: "gramado" },
        { label: "📍 Florianópolis", value: "florianopolis" },
        { label: "📍 Natal", value: "natal" },
        { label: "💬 Quero indicação personalizada", value: "whatsapp" },
      ]
    );
  }

  function handleRestaurantRequest() {
    setStage("restaurants");
    addMayaMessage(
      "🍽️ Que delícia! O Brasil tem uma gastronomia incrível!\n\nQual destino te interessa para dicas gastronômicas?",
      [
        { label: "🦐 Salvador (BA)", value: "salvador" },
        { label: "🧀 Minas Gerais", value: "minas gerais" },
        { label: "🥩 Gramado (RS)", value: "gramado" },
        { label: "🐟 Floripa (SC)", value: "florianopolis" },
        { label: "💬 Indicação personalizada", value: "whatsapp" },
      ]
    );
  }

  function handleBestTimeRequest() {
    setStage("best_time");
    const timeList = Object.entries(DESTINATIONS)
      .slice(0, 8)
      .map(([, d]) => `• **${d.name}**: ${d.bestTime}`)
      .join("\n");

    addMayaMessage(
      `📅 Saber a melhor época é essencial! Aqui vão as dicas:\n\n${timeList}\n\nQuer saber sobre algum destino específico?`,
      [
        { label: "🌎 Escolher destino", value: "destino" },
        { label: "🗺️ Montar roteiro", value: "roteiro" },
        { label: "💬 Falar com especialista", value: "whatsapp" },
      ]
    );
  }

  function handleEconomicTravel() {
    setStage("economic_travel");
    const cheapDests = Object.entries(DESTINATIONS)
      .sort(([, a], [, b]) => {
        const getMin = (s: string) => parseInt(s.replace(/[^\d]/g, "")) || 0;
        return getMin(a.avgBudget) - getMin(b.avgBudget);
      })
      .slice(0, 6);

    const list = cheapDests.map(([, d]) => `• **${d.name} (${d.state})** — a partir de ${d.avgBudget.split("-")[0]}/dia`).join("\n");

    addMayaMessage(
      `💰 Viagem econômica? Tenho ótimas opções!\n\nDestinos mais acessíveis:\n${list}\n\nAlém disso, cada destino tem **lugares gratuitos** incríveis! Quer saber mais?`,
      [
        { label: "🆓 Ver lugares grátis", value: "gratis" },
        { label: "🗺️ Roteiro econômico", value: "roteiro" },
        { label: "💬 Montar viagem no WhatsApp", value: "whatsapp" },
      ]
    );
  }

  function handleEbookOffer() {
    setStage("ebook_offer");
    addMayaMessage(
      "📚 Temos roteiros prontos e guias completos para você!\n\nCom nossos eBooks, você tem:\n• Roteiro dia a dia\n• Dicas de economia\n• Mapa dos melhores pontos\n• Lista de restaurantes testados\n\nQuer receber mais informações sobre nossos guias?",
      [
        { label: "📲 Receber no WhatsApp", value: "whatsapp" },
        { label: "🌎 Ver destinos antes", value: "destino" },
        { label: "🔄 Menu principal", value: "menu" },
      ]
    );
  }

  function handleCompareRequest() {
    setStage("compare_destinations");
    addMayaMessage(
      "🔍 Comparar destinos é uma ótima ideia!\n\nMe diz quais destinos você quer comparar, ou escolha dois da lista:\n\n• Fernando de Noronha vs Jeri\n• Gramado vs Campos do Jordão\n• Bonito vs Chapada dos Veadeiros\n• Natal vs Porto de Galinhas\n\nOu me fala os destinos que te interessam!",
      [
        { label: "📍 Fernando de Noronha", value: "fernando de noronha" },
        { label: "📍 Jericoacoara", value: "jericoacoara" },
        { label: "📍 Gramado", value: "gramado" },
        { label: "📍 Bonito", value: "bonito" },
      ]
    );
  }

  function handleInstagram() {
    addMayaMessage(
      "📸 Siga **@descubraobrasiloficial** no Instagram!\n\nLá você encontra:\n🌎 Fotos incríveis dos destinos\n✈️ Dicas exclusivas\n🏨 Promoções de hospedagem\n📣 Novidades em primeira mão\n\nVou abrir pra você! 😉"
    );
    setTimeout(() => {
      window.open(INSTAGRAM_URL, "_blank");
    }, 1500);
  }

  function handleWhatsAppRequest() {
    setStage("whatsapp_offer");

    // If we don't have the user's name yet, ask first
    if (!leadData.nome) {
      setStage("qualifying_name");
      return addMayaMessage(
        "Perfeito! 💬 Antes de te conectar com nosso especialista, como posso te chamar?"
      );
    }
    
    addMayaMessage(
      `${leadData.nome}, perfeito! 💬 Vou te conectar com nosso especialista em turismo no WhatsApp.\n\nEle vai te ajudar com:\n• Roteiros personalizados\n• Indicações exclusivas\n• Planejamento completo da viagem\n\nQuer seguir para o WhatsApp agora?`,
      [
        { label: "💬 Abrir WhatsApp agora", value: "abrir_whatsapp" },
        { label: "🌎 Explorar mais antes", value: "destino" },
        { label: "🔄 Menu principal", value: "menu" },
      ]
    );
  }

  function openWhatsApp() {
    let msg = "Olá! Vim pelo site Descubra o Brasil e gostaria de ajuda para planejar minha viagem. 🇧🇷\n";
    if (leadData.nome) msg += `\n👤 Nome: ${leadData.nome}`;
    if (leadData.destino) msg += `\n📍 Destino: ${leadData.destino}`;
    if (leadData.periodo) msg += `\n📅 Período: ${leadData.periodo}`;
    if (leadData.duracao) msg += `\n⏱️ Duração: ${leadData.duracao}`;
    if (leadData.orcamento) msg += `\n💰 Orçamento: ${leadData.orcamento}`;
    if (leadData.tipoGrupo) msg += `\n👥 Grupo: ${leadData.tipoGrupo}`;
    if (leadData.pessoas) msg += `\n🔢 Pessoas: ${leadData.pessoas}`;
    if (leadData.estilo) msg += `\n✨ Estilo: ${leadData.estilo}`;

    window.open(WHATSAPP_URL + encodeURIComponent(msg), "_blank");
    
    const nameRef = leadData.nome ? `${leadData.nome}, pronto` : "Pronto";
    addMayaMessage(
      `${nameRef}! 🚀 Abrimos o WhatsApp com nosso especialista.\n\nSe precisar de mais alguma coisa, é só me chamar aqui! 😊`,
      [
        { label: "🌎 Continuar explorando", value: "destino" },
        { label: "📸 Instagram", value: "instagram" },
      ]
    );
  }

  function handleIndecisive() {
    addMayaMessage(
      "Sem problemas! Vou te ajudar a decidir! 😊\n\nMe conta, qual é o seu **perfil de viagem**?",
      [
        { label: "🏖️ Quero relaxar na praia", value: "praia" },
        { label: "🌿 Quero aventura e natureza", value: "ecoturismo" },
        { label: "🏛️ Quero cultura e história", value: "cultura" },
        { label: "❄️ Quero frio e aconchego", value: "frio" },
        { label: "💰 Quero gastar pouco", value: "economico" },
      ]
    );
  }

  function handleHelpMenu() {
    setStage("menu");
    addMayaMessage(
      "Claro! Aqui está o que posso fazer por você: 📋\n\n🌎 **Destinos** — encontrar o lugar perfeito\n🗺️ **Roteiros** — planejar sua viagem\n🆓 **Grátis** — lugares sem custo\n🏨 **Hotéis** — onde ficar\n🍽️ **Restaurantes** — onde comer\n📅 **Melhor época** — quando ir\n💰 **Economia** — viajar barato\n📚 **eBooks** — roteiros prontos\n💬 **WhatsApp** — falar com especialista\n\nO que te interessa?",
      [
        { label: "🌎 Destinos", value: "destino" },
        { label: "🗺️ Roteiro", value: "roteiro" },
        { label: "🆓 Grátis", value: "gratis" },
        { label: "🏨 Hotéis", value: "hotel" },
        { label: "💬 WhatsApp", value: "whatsapp" },
      ]
    );
  }

  // ── Enhanced Qualifying Flow ────────────────────────────────
  function handleQualifyingResponse(text: string) {
    const norm = normalize(text);

    switch (stage) {
      case "qualifying_name": {
        // Extract name — take the first word that looks like a name (capitalize)
        const cleanName = text.replace(/[^a-zA-ZÀ-ÿ\s]/g, "").trim();
        const firstName = cleanName.split(" ")[0];
        const capitalizedName = firstName.charAt(0).toUpperCase() + firstName.slice(1).toLowerCase();
        
        setLeadData(prev => ({ ...prev, nome: capitalizedName }));
        setStage("qualifying_destination");
        return addMayaMessage(
          `Prazer, **${capitalizedName}**! 🤩\n\nAgora me conta, qual **destino ou região** do Brasil te interessa?`,
          [
            { label: "🏖️ Nordeste", value: "nordeste" },
            { label: "🏔️ Sul", value: "sul" },
            { label: "🌆 Sudeste", value: "sudeste" },
            { label: "🌿 Centro-Oeste", value: "centro-oeste" },
            { label: "🌳 Norte", value: "norte" },
            { label: "🤔 Ainda não sei", value: "indeciso" },
          ]
        );
      }
      case "qualifying_destination": {
        setLeadData(prev => ({ ...prev, destino: text }));
        setStage("qualifying_dates");
        const nameRef = leadData.nome ? `${leadData.nome}, ` : "";
        return addMayaMessage(
          `${nameRef}ótima escolha com **${text}**! 🌟\n\nQuando você pretende viajar?`,
          [
            { label: "📅 Próximos 30 dias", value: "proximo mes" },
            { label: "📅 2-3 meses", value: "2 a 3 meses" },
            { label: "📅 Final do ano", value: "final do ano" },
            { label: "🤔 Ainda não sei", value: "nao sei quando" },
          ]
        );
      }
      case "qualifying_dates": {
        setLeadData(prev => ({ ...prev, periodo: text }));
        setStage("qualifying_duration");
        return addMayaMessage(
          "Anotado! 📝 E quantos **dias** de viagem você está planejando?",
          [
            { label: "🕐 3-4 dias", value: "3 a 4 dias" },
            { label: "🕐 5-7 dias", value: "5 a 7 dias" },
            { label: "🕐 Mais de 7 dias", value: "mais de 7 dias" },
            { label: "🤔 Ainda não defini", value: "ainda nao defini" },
          ]
        );
      }
      case "qualifying_duration": {
        setLeadData(prev => ({ ...prev, duracao: text }));
        setStage("qualifying_budget");
        return addMayaMessage(
          "Perfeito! E qual a faixa de **orçamento** por pessoa?",
          [
            { label: "💰 Até R$ 2.000", value: "ate 2000" },
            { label: "💰 R$ 2.000 a R$ 5.000", value: "2000 a 5000" },
            { label: "💰 R$ 5.000+", value: "acima de 5000" },
            { label: "💰 Quero o mais econômico", value: "o mais economico possivel" },
          ]
        );
      }
      case "qualifying_budget": {
        setLeadData(prev => ({ ...prev, orcamento: text }));
        setStage("qualifying_group");
        return addMayaMessage(
          "Boa! E quem vai nessa viagem? 👥",
          [
            { label: "🧑 Solo", value: "viajando sozinho" },
            { label: "💑 Casal", value: "casal" },
            { label: "👨‍👩‍👧‍👦 Família", value: "familia" },
            { label: "👫 Amigos", value: "grupo de amigos" },
          ]
        );
      }
      case "qualifying_group": {
        setLeadData(prev => ({ ...prev, tipoGrupo: text }));
        setStage("qualifying_people");
        return addMayaMessage(
          "Ótimo! Quantas **pessoas** vão viajar ao todo?"
        );
      }
      case "qualifying_people": {
        setLeadData(prev => ({ ...prev, pessoas: text }));
        setStage("qualifying_style");
        return addMayaMessage(
          "Quase lá! Qual o **estilo** de viagem que vocês curtem mais?",
          [
            { label: "🏖️ Relaxar", value: "relaxar e descansar" },
            { label: "🧗 Aventura", value: "aventura e adrenalina" },
            { label: "🏛️ Cultural", value: "cultural e gastronômico" },
            { label: "💰 Econômico", value: "o mais economico possivel" },
            { label: "✨ Luxo", value: "premium e luxo" },
          ]
        );
      }
      case "qualifying_style": {
        setLeadData(prev => ({ ...prev, estilo: text }));
        setStage("conversion");
        
        // Build complete summary
        const name = leadData.nome || "Viajante";
        const summary = [];
        if (leadData.destino) summary.push(`📍 Destino: ${leadData.destino}`);
        if (leadData.periodo) summary.push(`📅 Quando: ${leadData.periodo}`);
        if (leadData.duracao) summary.push(`⏱️ Duração: ${leadData.duracao}`);
        if (leadData.orcamento) summary.push(`💰 Orçamento: ${leadData.orcamento}`);
        if (leadData.tipoGrupo) summary.push(`👥 Grupo: ${leadData.tipoGrupo}`);
        if (leadData.pessoas) summary.push(`🔢 Pessoas: ${leadData.pessoas}`);
        summary.push(`✨ Estilo: ${text}`);

        return addMayaMessage(
          `**${name}**, ficou perfeito! 🎯\n\nResumo da sua viagem:\n${summary.join("\n")}\n\nCom essas informações, nosso especialista pode montar um **roteiro personalizado completo** pra você!\n\nQuer receber no WhatsApp?`,
          [
            { label: "💬 Sim, abrir WhatsApp!", value: "abrir_whatsapp" },
            { label: "📚 Prefiro roteiro pronto/eBook", value: "ebook" },
            { label: "🌎 Explorar mais antes", value: "destino" },
          ]
        );
      }
      default: {
        // Check if warm lead in any qualifying stage
        if (isWarmLead(leadData)) {
          return handleConversionPush();
        }
        return handleSmartFallback(text);
      }
    }
  }

  function handleConversionPush() {
    setStage("conversion");
    const name = leadData.nome || "";
    const nameGreet = name ? `**${name}**, com` : "Com";
    
    addMayaMessage(
      `${nameGreet} esse perfil, posso te mostrar opções incríveis! 🚀\n\nMas para garantir o **melhor roteiro**, nosso especialista pode te ajudar via WhatsApp com:\n\n• Roteiro dia a dia personalizado\n• Dicas exclusivas de quem conhece\n• Melhor custo-benefício\n\nQuer receber no WhatsApp?`,
      [
        { label: "💬 Sim, WhatsApp!", value: "abrir_whatsapp" },
        { label: "🌎 Explorar mais", value: "destino" },
        { label: "📚 Ver eBook/roteiro pronto", value: "ebook" },
      ]
    );
  }

  function handleSmartFallback(text: string) {
    /* REGRA: Nunca dizer apenas "não sei" — sempre oferecer continuação útil */
    const namePrefix = leadData.nome ? `${leadData.nome}, entendi` : "Entendi";
    addMayaMessage(
      `${namePrefix}! 😊 Com esse perfil, posso te ajudar de algumas formas:\n\n1️⃣ Mostrar **destinos populares** do Brasil\n2️⃣ Encontrar **lugares grátis** para visitar\n3️⃣ Montar um **roteiro personalizado**\n\nQual caminho você prefere?`,
      [
        { label: "1️⃣ Destinos populares", value: "destino" },
        { label: "2️⃣ Lugares grátis", value: "gratis" },
        { label: "3️⃣ Roteiro personalizado", value: "roteiro" },
        { label: "💬 Falar com especialista", value: "whatsapp" },
      ]
    );
  }

  // ── Quick Reply Handler ─────────────────────────────────────
  function handleQuickReply(reply: QuickReply) {
    // Special actions
    if (reply.value === "abrir_whatsapp") {
      setMessages(prev => [...prev, { from: "user", text: reply.label, timestamp: new Date() }]);
      return openWhatsApp();
    }
    if (reply.value === "menu") {
      setMessages(prev => [...prev, { from: "user", text: reply.label, timestamp: new Date() }]);
      return handleHelpMenu();
    }
    if (reply.value === "ebook") {
      setMessages(prev => [...prev, { from: "user", text: reply.label, timestamp: new Date() }]);
      return handleEbookOffer();
    }

    handleUserMessage(reply.value);
  }

  // ── Form Submit ──────────────────────────────────────────────
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    handleUserMessage(inputText);
  }

  // ── Last quick replies ──────────────────────────────────────
  const lastMayaMessage = [...messages].reverse().find(m => m.from === "maya");
  const activeQuickReplies = lastMayaMessage?.quickReplies;

  return (
    <>
      {/* Proactive Greeting Bubble */}
      <AnimatePresence>
        {showProactiveHint && !open && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="fixed bottom-24 right-6 z-50 max-w-[260px] cursor-pointer"
            onClick={openChat}
          >
            <div
              className="px-4 py-3 rounded-2xl rounded-br-md shadow-xl text-[13px] text-slate-700 font-medium leading-relaxed"
              style={{
                background: "white",
                border: "1px solid rgba(16, 185, 129, 0.25)",
                boxShadow: "0 8px 30px rgba(0,0,0,0.12), 0 0 0 1px rgba(16,185,129,0.1)",
              }}
            >
              <span className="text-emerald-600 font-bold">Maya</span> aqui! 👋 Posso te ajudar a encontrar o destino perfeito no Brasil. Quer conversar?
            </div>
            {/* Arrow */}
            <div
              className="w-3 h-3 rotate-45 absolute -bottom-1.5 right-8"
              style={{ background: "white", borderRight: "1px solid rgba(16,185,129,0.25)", borderBottom: "1px solid rgba(16,185,129,0.25)" }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* FAB Button */}
      <AnimatePresence>
        {!open && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ delay: 1, type: "spring", stiffness: 200, damping: 20 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={openChat}
            className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 text-white px-5 py-3.5 rounded-full shadow-2xl isolate group"
            style={{
              background: "linear-gradient(135deg, #059669, #10b981, #34d399)",
              boxShadow: "0 8px 32px rgba(16, 185, 129, 0.45), 0 0 0 1px rgba(255,255,255,0.1) inset",
            }}
            aria-label="Falar com Maya"
            id="maya-chat-fab"
          >
            <div className={`absolute inset-0 rounded-full bg-emerald-400 ${pulseButton ? 'animate-ping' : ''} opacity-20 -z-10`} />
            <div className="relative">
              <Sparkles className="w-5 h-5 text-emerald-100 group-hover:rotate-12 transition-transform" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-yellow-400 rounded-full border-2 border-emerald-600 animate-pulse" />
            </div>
            <span className="font-bold text-sm hidden sm:block tracking-wide">Fale com a Maya</span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed bottom-4 right-4 z-50 w-[390px] max-w-[calc(100vw-1.5rem)] flex flex-col rounded-3xl shadow-2xl overflow-hidden"
            style={{
              height: "620px",
              maxHeight: "calc(100vh - 2rem)",
              border: "1px solid rgba(16, 185, 129, 0.2)",
              background: "linear-gradient(180deg, #f8fffe 0%, #f0fdf4 100%)",
              boxShadow: "0 25px 65px rgba(0,0,0,0.15), 0 0 0 1px rgba(16,185,129,0.15)",
            }}
            id="maya-chat-window"
          >
            {/* Header */}
            <div
              className="px-4 py-3.5 flex items-center gap-3 flex-shrink-0"
              style={{
                background: "linear-gradient(135deg, #059669 0%, #10b981 50%, #34d399 100%)",
              }}
            >
              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg flex-shrink-0 ${isSpeaking ? 'animate-pulse ring-2 ring-white/50' : ''}`}
                style={{ 
                  background: "linear-gradient(135deg, rgba(255,255,255,0.25), rgba(255,255,255,0.1))", 
                  backdropFilter: "blur(8px)",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.2)"
                }}
              >
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-white text-sm tracking-wide">Maya — Guia de Turismo</p>
                <div className="flex items-center gap-1.5">
                  <span className={`w-2 h-2 rounded-full ${isListening ? 'bg-red-400 animate-pulse' : isSpeaking ? 'bg-yellow-300 animate-pulse' : 'bg-emerald-200'}`} />
                  <p className="text-emerald-50 text-[10px] uppercase font-bold tracking-wider">
                    {isListening ? "Ouvindo..." : isSpeaking ? "Falando..." : isTyping ? "Digitando..." : "Online agora"}
                  </p>
                </div>
              </div>
              {/* Voice Toggle */}
              <button
                onClick={toggleVoiceEnabled}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider transition-all ${
                  voiceEnabled ? 'bg-white text-emerald-600 shadow-sm' : 'bg-white/20 text-white/80 hover:bg-white/30'
                }`}
                title={voiceEnabled ? "Desativar voz da Maya" : "Ativar voz da Maya"}
                id="maya-voice-toggle"
              >
                {voiceEnabled ? <Volume2 className="w-3 h-3" /> : <VolumeX className="w-3 h-3" />}
                Voz
              </button>
              <button
                onClick={() => setOpen(false)}
                className="text-white/80 hover:text-white transition-colors p-1.5 rounded-xl hover:bg-white/10"
                aria-label="Fechar"
                id="maya-close-btn"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3" style={{ scrollbarWidth: "thin" }}>
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25 }}
                  className={`flex ${msg.from === "user" ? "justify-end" : "justify-start"}`}
                >
                  {msg.from === "maya" && (
                    <div 
                      className="w-7 h-7 rounded-full flex items-center justify-center text-xs mr-2 flex-shrink-0 mt-0.5"
                      style={{
                        background: "linear-gradient(135deg, #d1fae5, #a7f3d0)",
                        boxShadow: "0 1px 3px rgba(16,185,129,0.2)"
                      }}
                    >
                      <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                    </div>
                  )}
                  <div
                    className={`max-w-[82%] px-3.5 py-2.5 text-[13px] leading-relaxed ${
                      msg.from === "user"
                        ? "rounded-2xl rounded-br-md text-white"
                        : "rounded-2xl rounded-bl-md text-slate-700 shadow-sm"
                    }`}
                    style={msg.from === "user" ? {
                      background: "linear-gradient(135deg, #059669, #10b981)",
                    } : {
                      background: "white",
                      border: "1px solid #e2e8f0",
                    }}
                    dangerouslySetInnerHTML={{ __html: parseMarkdown(msg.text) }}
                  />
                </motion.div>
              ))}

              {/* Typing Indicator */}
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-start"
                >
                  <div 
                    className="w-7 h-7 rounded-full flex items-center justify-center text-xs mr-2 flex-shrink-0"
                    style={{
                      background: "linear-gradient(135deg, #d1fae5, #a7f3d0)",
                    }}
                  >
                    <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                  </div>
                  <div className="bg-white border border-slate-200 rounded-2xl rounded-bl-md px-4 py-3 shadow-sm">
                    <div className="flex items-center gap-1.5">
                      {[0, 1, 2].map(i => (
                        <motion.div
                          key={i}
                          animate={{ y: [0, -5, 0] }}
                          transition={{ repeat: Infinity, duration: 0.6, delay: i * 0.15 }}
                          className="w-2 h-2 rounded-full bg-emerald-400"
                        />
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick Replies */}
            {activeQuickReplies && activeQuickReplies.length > 0 && !isTyping && !isListening && (
              <div className="border-t border-slate-100 px-3 py-2.5 flex flex-wrap gap-1.5 max-h-[140px] overflow-y-auto flex-shrink-0 bg-white/80" style={{ backdropFilter: "blur(8px)" }}>
                {activeQuickReplies.map((reply, i) => (
                  <motion.button
                    key={i}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.04 }}
                    onClick={() => handleQuickReply(reply)}
                    className="px-3 py-1.5 rounded-full text-[12px] font-semibold transition-all hover:scale-[1.03] active:scale-[0.97]"
                    style={{
                      background: "linear-gradient(135deg, #ecfdf5, #d1fae5)",
                      border: "1px solid #a7f3d0",
                      color: "#047857",
                    }}
                    id={`maya-quick-${i}`}
                  >
                    {reply.label}
                  </motion.button>
                ))}
              </div>
            )}

            {/* Voice Visualizer */}
            {(isListening) && (
              <div className="bg-white/90 border-t border-slate-100 px-4 py-6 flex flex-col items-center justify-center flex-shrink-0" style={{ backdropFilter: "blur(8px)" }}>
                <div className="flex items-center gap-1 h-10">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <motion.div
                      key={i}
                      animate={{ height: [8, 32, 8] }}
                      transition={{ repeat: Infinity, duration: 0.8, delay: i * 0.1 }}
                      className="w-1.5 bg-emerald-500 rounded-full"
                    />
                  ))}
                </div>
                <p className="mt-3 text-[11px] font-bold text-slate-400 animate-pulse uppercase tracking-widest">
                  Maya está ouvindo...
                </p>
              </div>
            )}

            {/* Input Area */}
            <form
              onSubmit={handleSubmit}
              className="flex items-center gap-2 px-3 py-3 flex-shrink-0 border-t border-slate-100"
              style={{ background: "white" }}
            >
              {voiceEnabled && (
                <button
                  type="button"
                  onClick={toggleVoice}
                  className={`p-2 rounded-full transition-all flex-shrink-0 ${
                    continuousMode
                      ? 'bg-red-500 text-white shadow-lg shadow-red-500/30 animate-pulse'
                      : 'bg-emerald-100 text-emerald-600 hover:bg-emerald-200'
                  }`}
                  title={continuousMode ? "Parar microfone" : "Falar com Maya"}
                  id="maya-mic-btn"
                >
                  {continuousMode ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
                </button>
              )}
              <input
                ref={inputRef}
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Digite sua mensagem..."
                className="flex-1 px-3.5 py-2.5 rounded-xl text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none transition-all"
                style={{
                  background: "#f1f5f9",
                  border: "1px solid transparent",
                }}
                onFocus={(e) => {
                  e.currentTarget.style.border = "1px solid #a7f3d0";
                  e.currentTarget.style.background = "white";
                }}
                onBlur={(e) => {
                  e.currentTarget.style.border = "1px solid transparent";
                  e.currentTarget.style.background = "#f1f5f9";
                }}
                id="maya-input"
              />
              <button
                type="submit"
                disabled={!inputText.trim()}
                className="p-2.5 rounded-xl text-white transition-all flex-shrink-0 disabled:opacity-40"
                style={{
                  background: inputText.trim() ? "linear-gradient(135deg, #059669, #10b981)" : "#94a3b8",
                }}
                id="maya-send-btn"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>

            {/* Footer Links */}
            <div className="flex items-center justify-between px-4 py-2 flex-shrink-0 border-t border-slate-50" style={{ background: "#fafffe" }}>
              <a
                href={WHATSAPP_URL + encodeURIComponent("Olá! Vim pelo Descubra o Brasil e gostaria de ajuda.")}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-[11px] text-green-600 font-semibold hover:text-green-700 transition-colors"
                id="maya-whatsapp-link"
              >
                <MessageCircle className="w-3 h-3" />
                WhatsApp
              </a>
              <span className="text-[10px] text-slate-300 font-medium">Descubra o Brasil</span>
              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-[11px] text-pink-600 font-semibold hover:text-pink-700 transition-colors"
                id="maya-instagram-link"
              >
                📸 Instagram
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
