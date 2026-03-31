"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, MessageCircle, Mic, MicOff, Loader2 } from "lucide-react";

const WHATSAPP_URL = "https://wa.me/5538991621135?text=";
const INSTAGRAM_URL = "https://instagram.com/descubraobrasiloficial";

// ── Conversation Flow Engine ─────────────────────────────────
type Choice = { label: string; next: string };
type FlowNode = {
  message: string;
  choices?: Choice[];
  action?: "whatsapp" | "instagram" | "close";
  actionText?: string;
};

const FLOW: Record<string, FlowNode> = {
  start: {
    message: "Olá! 👋 Sou a Maya, sua assistente virtual de turismo do **Descubra o Brasil**! Como posso te ajudar a planejar sua próxima viagem?",
    choices: [
      { label: "🌎 Explorar Destinos", next: "destinos" },
      { label: "📱 Como usar o App", next: "app_redirect" },
      { label: "📲 Seguir no Instagram", next: "instagram" },
      { label: "💬 Falar com Especialista", next: "whatsapp_inicio" },
    ],
  },

  // ── DESTINOS ──────────────────────────────────────────────
  destinos: {
    message: "Ótimo! 🗺️ Temos destinos incríveis no Brasil. O que você prefere explorar?",
    choices: [
      { label: "🏖️ Praias", next: "praias" },
      { label: "🏙️ Cidades Históricas", next: "cidades" },
      { label: "🌿 Ecoturismo", next: "ecoturismo" },
      { label: "⬅️ Voltar ao Início", next: "start" },
    ],
  },
  praias: {
    message: "🏖️ O Brasil tem praias paradisíacas! Destaque para:\n\n• **Fernando de Noronha (PE)** — Águas cristalinas únicas no mundo\n• **Jericoacoara (CE)** — Dunas e lagoas de tirar o fôlego\n• **Arraial do Cabo (RJ)** — O Caribe Brasileiro\n\nQuer explorar esses destinos com o nosso App?",
    choices: [
      { label: "📲 Abrir no App", next: "app_redirect" },
      { label: "💬 Tirar Dúvidas no WhatsApp", next: "whatsapp_destino" },
      { label: "⬅️ Ver Outros Destinos", next: "destinos" },
    ],
  },
  cidades: {
    message: "🏛️ Nossas cidades históricas são verdadeiros tesouros culturais!\n\n• **Salvador (BA)** — Pelourinho, axé e gastronomia única\n• **Ouro Preto (MG)** — Barrroco e história do Brasil Colônia\n• **São Luís (MA)** — Azulejos portugueses e bumba-meu-boi\n\nDeseja planejar sua visita?",
    choices: [
      { label: "📲 Planejar no App", next: "app_redirect" },
      { label: "💬 Falar com Especialista", next: "whatsapp_destino" },
      { label: "⬅️ Ver Outros", next: "destinos" },
    ],
  },
  ecoturismo: {
    message: "🌿 O Brasil é o paraíso do ecoturismo!\n\n• **Pantanal (MS/MT)** — Maior planície alagada do mundo\n• **Chapada dos Veadeiros (GO)** — Cachoeiras e trilhas incríveis\n• **Amazônia (AM)** — A maior floresta tropical do planeta\n\nVeja esses destinos no nosso App!",
    choices: [
      { label: "📲 Explorar no App", next: "app_redirect" },
      { label: "💬 Pacotes Especiais WhatsApp", next: "whatsapp_destino" },
      { label: "⬅️ Voltar", next: "destinos" },
    ],
  },
  app_redirect: {
    message: "Incrível! 🚀 No nosso App você encontra mapas interativos, hotéis, restaurantes e roteiros personalizados!\n\nAcesse agora:",
    choices: [
      { label: "📲 Abrir o App Agora", next: "open_app" },
      { label: "📸 Siga-nos no Instagram", next: "instagram" },
      { label: "🏠 Voltar ao Início", next: "start" },
    ],
  },
  open_app: {
    message: "Que ótimo! Clique no botão abaixo para abrir o App completo com mapa, destinos e muito mais! 🗺️",
    choices: [
      { label: "📲 Abrir App Completo", next: "go_app" },
      { label: "🏠 Voltar", next: "start" },
    ],
  },

  // ── WHATSAPP FLOWS ────────────────────────────────────────
  whatsapp_inicio: {
    message: "Perfeito! 💬 Vou te conectar com nosso especialista em turismo. Clique abaixo para iniciar o chat no WhatsApp!",
    choices: [
      { label: "💬 Abrir WhatsApp", next: "wa_geral" },
      { label: "🏠 Voltar", next: "start" },
    ],
  },
  whatsapp_destino: {
    message: "Ótimo! Nossa equipe de turismo vai te ajudar a montar o roteiro perfeito! 🗺️",
    choices: [
      { label: "💬 Falar sobre Destinos", next: "wa_turismo" },
      { label: "⬅️ Voltar", next: "destinos" },
    ],
  },

  // ── INSTAGRAM ────────────────────────────────────────────
  instagram: {
    message: "📸 Siga @descubraobrasiloficial no Instagram e fique por dentro de:\n\n🌎 Destinos impressionantes\n✈️ Dicas de economia\n🏨 Melhores hotéis\n📣 Promoções exclusivas\n\nClique para seguir agora!",
    choices: [
      { label: "📸 Seguir @descubraobrasiloficial", next: "go_instagram" },
      { label: "💬 Falar no WhatsApp", next: "whatsapp_inicio" },
      { label: "🏠 Voltar", next: "start" },
    ],
  },

  // ── TERMINAL NODES (these trigger actions) ────────────────
  wa_geral: {
    message: "Conectando com nosso especialista... 💬",
    action: "whatsapp",
    actionText: "Olá! Tenho dúvidas sobre o aplicativo Descubra o Brasil.",
  },
  wa_turismo: {
    message: "Conectando com nossa equipe... 🗺️",
    action: "whatsapp",
    actionText: "Olá! Gostaria de informações sobre destinos turísticos e dicas de viagem.",
  },
  go_instagram: {
    message: "Redirecionando para o Instagram... 📸",
    action: "instagram",
  },
  go_app: {
    message: "Abrindo o App... 🚀",
    action: "close",
  },
};

// ── Helpers ────────────────────────────────────────────────
function parseMarkdown(text: string): string {
  return text
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/\n/g, "<br/>");
}

// ── Component ──────────────────────────────────────────────
interface Message {
  from: "maya" | "user";
  text: string;
}

export default function MayaChat() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentNode, setCurrentNode] = useState<string>("start");
  const [started, setStarted] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [continuousMode, setContinuousMode] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  const synthesisRef = useRef<SpeechSynthesis | null>(null);

  // ── Voice Logic ──────────────────────────────────────────

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
          // Auto-restart if in continuous mode and not speaking
          if (continuousMode && !isSpeaking && !isThinking && open) {
             // Delay to prevent accidental triggers
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
  }, [continuousMode, isSpeaking, isThinking, open]);

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
      // Turning off — stop everything
      synthesisRef.current?.cancel();
      setIsSpeaking(false);
      setContinuousMode(false);
      recognitionRef.current?.stop();
      setIsListening(false);
    }
  };

  const mayaSpeak = useCallback((text: string) => {
    // Only speak if voice is enabled by the user
    if (!voiceEnabled || !synthesisRef.current) return;
    
    synthesisRef.current.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
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

  // ── Handling ──────────────────────────────────────────────

  function handleUserMessage(text: string) {
    setMessages((prev) => [...prev, { from: "user", text }]);
    setIsThinking(true);

    // Lógica de palavras-chave para simular IA
    setTimeout(() => {
        setIsThinking(false);
        const lower = text.toLowerCase();
        if (lower.includes("praia") || lower.includes("mar") || lower.includes("nordeste")) {
            addMayaMessage("praias");
        } else if (lower.includes("história") || lower.includes("cultura") || lower.includes("cidade")) {
            addMayaMessage("cidades");
        } else if (lower.includes("natureza") || lower.includes("ecoturismo") || lower.includes("trilha")) {
            addMayaMessage("ecoturismo");
        } else if (lower.includes("app") || lower.includes("aplicativo") || lower.includes("instalar")) {
            addMayaMessage("app_redirect");
        } else if (lower.includes("instagram")) {
            addMayaMessage("instagram");
        } else {
            const msg = "Que legal! O Brasil é cheio de surpresas. Posso te falar sobre destinos (praias, história, ecoturismo), sobre como usar nosso App ou você pode nos seguir no Instagram para ver fotos incríveis!";
            setMessages((prev) => [...prev, { from: "maya", text: msg }]);
            mayaSpeak(msg);
        }
    }, 1000);
  }

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  function openChat() {
    setOpen(true);
    if (!started) {
      setStarted(true);
      setTimeout(() => {
        addMayaMessage("start");
      }, 300);
    }
  }

  function addMayaMessage(nodeKey: string) {
    const node = FLOW[nodeKey];
    if (!node) return;

    setMessages((prev) => [...prev, { from: "maya", text: node.message }]);
    setCurrentNode(nodeKey);
    mayaSpeak(node.message);

    // Handle action nodes
    if (node.action) {
      setTimeout(() => {
        if (node.action === "whatsapp" && node.actionText) {
          window.open(WHATSAPP_URL + encodeURIComponent(node.actionText), "_blank");
          // Return to start after action
          setTimeout(() => addMayaMessage("start"), 2000);
        } else if (node.action === "instagram") {
          window.open(INSTAGRAM_URL, "_blank");
          setTimeout(() => addMayaMessage("start"), 2000);
        } else if (node.action === "close") {
          window.open("/DESCUBRAOBRASIL/app/index.html", "_blank");
          setTimeout(() => addMayaMessage("start"), 2000);
        }
      }, 600);
    }
  }

  function handleChoice(choice: Choice) {
    // Show user clicked choice
    setMessages((prev) => [...prev, { from: "user", text: choice.label }]);

    // Delay Maya response
    setTimeout(() => {
      addMayaMessage(choice.next);
    }, 400);
  }

  const currentFlowNode = FLOW[currentNode];
  const canShowChoices = currentFlowNode && !currentFlowNode.action;

  return (
    <>
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
            className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-emerald-400 text-white px-5 py-3 rounded-full shadow-xl shadow-emerald-500/40 isolate"
            aria-label="Falar com Maya"
          >
            <div className="absolute inset-0 rounded-full bg-emerald-400 animate-ping opacity-20 -z-10" />
            <span className="text-xl">🤖</span>
            <span className="font-bold text-sm hidden sm:block">Fale com Maya</span>
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
            className="fixed bottom-6 right-6 z-50 w-[360px] max-w-[calc(100vw-2rem)] flex flex-col rounded-2xl shadow-2xl overflow-hidden border border-emerald-100"
            style={{ height: "520px" }}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-emerald-500 to-emerald-400 px-4 py-3 flex items-center gap-3">
              <div className={`w-9 h-9 rounded-full bg-white/20 flex items-center justify-center text-lg flex-shrink-0 ${isSpeaking ? 'animate-pulse ring-2 ring-white/50' : ''}`}>
                🤖
              </div>
              <div className="flex-1">
                <p className="font-bold text-white text-sm">Maya AI</p>
                <div className="flex items-center gap-1.5">
                  <span className={`w-2 h-2 rounded-full ${isListening ? 'bg-red-400 animate-pulse' : 'bg-emerald-200'}`} />
                  <p className="text-emerald-50 text-[10px] uppercase font-bold tracking-wider">
                    {isListening ? "Ouvindo..." : isSpeaking ? "Falando..." : isThinking ? "Pensando..." : "Online"}
                  </p>
                </div>
              </div>
              {/* Voice ON/OFF Toggle */}
              <button
                onClick={toggleVoiceEnabled}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider transition-all ${
                  voiceEnabled ? 'bg-white text-emerald-600 shadow-sm' : 'bg-white/20 text-white/80 hover:bg-white/30'
                }`}
                title={voiceEnabled ? "Desativar voz da Maya" : "Ativar voz da Maya"}
              >
                {voiceEnabled ? <Mic className="w-3 h-3" /> : <MicOff className="w-3 h-3" />}
                {voiceEnabled ? "Voz ON" : "Voz OFF"}
              </button>
              <button
                onClick={() => setOpen(false)}
                className="text-white/80 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/10"
                aria-label="Fechar"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 bg-slate-50">
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.from === "user" ? "justify-end" : "justify-start"}`}>
                  {msg.from === "maya" && (
                    <div className="w-7 h-7 rounded-full bg-emerald-100 flex items-center justify-center text-sm mr-2 flex-shrink-0 mt-0.5">🤖</div>
                  )}
                  <div
                    className={`max-w-[80%] px-3 py-2 rounded-2xl text-sm leading-relaxed ${
                      msg.from === "user"
                        ? "bg-emerald-500 text-white rounded-br-sm"
                        : "bg-white text-slate-700 rounded-bl-sm shadow-sm border border-slate-100"
                    }`}
                    dangerouslySetInnerHTML={{ __html: parseMarkdown(msg.text) }}
                  />
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Choices */}
            {canShowChoices && currentFlowNode.choices && !isListening && !isThinking && (
              <div className="bg-white border-t border-slate-100 px-3 py-3 space-y-2 max-h-[200px] overflow-y-auto">
                {currentFlowNode.choices.map((choice, i) => (
                  <motion.button
                    key={i}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    onClick={() => handleChoice(choice)}
                    className="w-full text-left px-3 py-2 rounded-xl border border-emerald-100 hover:bg-emerald-50 hover:border-emerald-300 text-sm text-slate-700 font-medium transition-all"
                  >
                    {choice.label}
                  </motion.button>
                ))}
              </div>
            )}

            {/* Voice Visualizer Section */}
            {(isListening || isThinking) && (
              <div className="bg-white border-t border-slate-100 px-4 py-8 flex flex-col items-center justify-center">
                {isListening ? (
                  <div className="flex items-center gap-1 h-12">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                      <motion.div
                        key={i}
                        animate={{ height: [10, 40, 10] }}
                        transition={{ repeat: Infinity, duration: 0.8, delay: i * 0.1 }}
                        className="w-1.5 bg-emerald-500 rounded-full"
                      />
                    ))}
                  </div>
                ) : (
                  <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
                )}
                <p className="mt-4 text-xs font-bold text-slate-400 animate-pulse uppercase tracking-widest">
                  {isListening ? "Maya está ouvindo..." : "Maya está processando..."}
                </p>
              </div>
            )}

            {/* Social Footer */}
            <div className="bg-white border-t border-slate-100 px-4 py-3 flex items-center justify-between">
              {voiceEnabled ? (
                <button 
                  onClick={toggleVoice}
                  className={`p-2 rounded-full transition-all ${continuousMode ? 'bg-red-500 text-white shadow-lg shadow-red-500/30 animate-pulse' : 'bg-emerald-100 text-emerald-600 hover:bg-emerald-200'}`}
                  title={continuousMode ? "Parar microfone" : "Falar com Maya"}
                >
                  {continuousMode ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
                </button>
              ) : (
                <span className="text-[10px] text-slate-400 font-medium">Voz desativada</span>
              )}
              <a
                href={WHATSAPP_URL + encodeURIComponent("Olá! Quero saber mais sobre o Descubra o Brasil.")}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-xs text-green-600 font-semibold hover:text-green-700 transition-colors"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                WhatsApp
              </a>
              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-xs text-pink-600 font-semibold hover:text-pink-700 transition-colors"
              >
                📸 @descubraobrasiloficial
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
