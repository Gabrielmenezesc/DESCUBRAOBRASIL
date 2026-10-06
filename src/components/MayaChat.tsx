"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Send,
  Mic,
  MicOff,
  Loader2,
  Sparkles,
  Volume2,
  VolumeX,
  Bot,
  Phone,
  User,
  MapPin,
  Sun,
  Compass,
  Calendar,
  DollarSign,
  Camera,
  FileDown,
  ExternalLink,
  Navigation,
  Share2,
  Info,
  CheckCircle,
  Smartphone,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import { assetPath } from "@/lib/assetPath";
import { processMayaRequest, MayaAIResponse, UserContext, addToChatHistory } from "@/lib/gemini";
import { fetchRealWeather, getWeatherByCityName, WeatherInfo } from "@/services/weatherService";
import { searchPlacesNearby, PlaceItem } from "@/services/placesService";
import { generateMayaTravelPDF, PDFItineraryData } from "@/services/pdfService";

const WHATSAPP_NUMBER = "5561995659907";
const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=`;

interface Message {
  from: "maya" | "user";
  text: string;
  timestamp: Date;
  isAI?: boolean;
  component?: "weather" | "places" | "itinerary" | "budget" | "sources" | "app_promo";
  weatherData?: WeatherInfo;
  placesData?: PlaceItem[];
  itineraryData?: PDFItineraryData;
  budgetData?: any;
  sourcesData?: any[];
  imagePreview?: string;
}

export default function MayaChat() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [statusText, setStatusText] = useState<string | null>(null);
  const [started, setStarted] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [continuousMode, setContinuousMode] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [pulseButton, setPulseButton] = useState(true);
  const [showProactiveHint, setShowProactiveHint] = useState(false);
  const [messageCount, setMessageCount] = useState(0);

  // User location & weather state
  const [userContext, setUserContext] = useState<UserContext>({
    city: "Brasília",
    state: "DF",
    latitude: -15.7975,
    longitude: -47.8919,
    permissionGranted: false,
  });
  const [currentWeather, setCurrentWeather] = useState<WeatherInfo | null>(null);
  const [loadingWeather, setLoadingWeather] = useState(true);
  const [locationError, setLocationError] = useState(false);

  // Weather Card tab
  const [activeWeatherTab, setActiveWeatherTab] = useState<"hoje" | "amanha" | "7dias" | "destino">("hoje");

  // Camera upload modal
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<any>(null);
  const synthesisRef = useRef<SpeechSynthesis | null>(null);

  // ── Proactive Greeting ─────────────────────────────────────
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!open && !started) {
        setShowProactiveHint(true);
      }
    }, 8000);
    return () => clearTimeout(timer);
  }, [open, started]);

  useEffect(() => {
    if (showProactiveHint) {
      const timer = setTimeout(() => setShowProactiveHint(false), 12000);
      return () => clearTimeout(timer);
    }
  }, [showProactiveHint]);

  // ── Location & Weather Initialization ──────────────────────
  const requestLocation = useCallback(async () => {
    setLoadingWeather(true);
    setLocationError(false);

    if (typeof window !== "undefined" && "geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;

          try {
            const weather = await fetchRealWeather(lat, lon);
            setUserContext({
              city: weather.city,
              state: weather.state,
              latitude: lat,
              longitude: lon,
              permissionGranted: true,
            });
            setCurrentWeather(weather);
          } catch (err) {
            console.error("[MayaLocation] Weather fetch error:", err);
          } finally {
            setLoadingWeather(false);
          }
        },
        async (error) => {
          console.warn("[MayaLocation] Geolocation denied/failed:", error.message);
          setLocationError(true);
          // Fallback Brasília weather
          const weather = await fetchRealWeather(-15.7975, -47.8919, "Brasília", "DF");
          setCurrentWeather(weather);
          setLoadingWeather(false);
        },
        { timeout: 8000 }
      );
    } else {
      setLocationError(true);
      const weather = await fetchRealWeather(-15.7975, -47.8919, "Brasília", "DF");
      setCurrentWeather(weather);
      setLoadingWeather(false);
    }
  }, []);

  useEffect(() => {
    requestLocation();
  }, [requestLocation]);

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
    const clean = text.replace(/\*\*/g, "").replace(/\[.*?\]\(.*?\)/g, "").replace(/\n/g, ". ");
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

  const stopSpeaking = () => {
    if (synthesisRef.current) {
      synthesisRef.current.cancel();
      setIsSpeaking(false);
    }
  };

  const toggleVoiceEnabled = () => {
    const newState = !voiceEnabled;
    setVoiceEnabled(newState);
    if (!newState) {
      stopSpeaking();
      setContinuousMode(false);
      recognitionRef.current?.stop();
      setIsListening(false);
    }
  };

  const toggleVoice = () => {
    if (isListening) {
      setContinuousMode(false);
      recognitionRef.current?.stop();
    } else {
      setContinuousMode(true);
      recognitionRef.current?.start();
    }
  };

  // ── Scroll ──────────────────────────────────────────────────
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping, statusText]);

  // ── Handlers ────────────────────────────────────────────────
  function addMayaMessage(response: MayaAIResponse | string) {
    let text = typeof response === "string" ? response : response.message;
    let component = typeof response === "string" ? undefined : response.component;
    let weatherData = typeof response === "string" ? undefined : response.weatherData;
    let placesData = typeof response === "string" ? undefined : response.placesData;
    let itineraryData = typeof response === "string" ? undefined : response.itineraryData;
    let budgetData = typeof response === "string" ? undefined : response.budgetData;
    let sourcesData = typeof response === "string" ? undefined : response.sources;

    setMessages(prev => [...prev, {
      from: "maya",
      text,
      timestamp: new Date(),
      isAI: true,
      component,
      weatherData,
      placesData,
      itineraryData,
      budgetData,
      sourcesData,
    }]);

    addToChatHistory("model", text);
    mayaSpeak(text);
  }

  function openChat() {
    setOpen(true);
    setPulseButton(false);
    setShowProactiveHint(false);
    if (!started) {
      setStarted(true);
      const greeting = `Olá! Eu sou a Maya, sua assistente virtual com IA real do **Descubra o Brasil**.\n\nComo posso ajudar na sua viagem hoje?`;
      
      setMessages([{
        from: "maya",
        text: greeting,
        timestamp: new Date(),
        isAI: false
      }]);
      addToChatHistory("model", greeting);
      mayaSpeak(greeting);
    }
  }

  function buildWhatsAppContext() {
    const userMessages = messages.filter(m => m.from === "user").map(m => m.text);
    const lastMayaMsg = messages.filter(m => m.from === "maya").slice(-1)[0]?.text || "";
    
    let contextParts = [
      " *Conversei com a Maya AI no Descubra o Brasil*",
      "",
    ];
    
    if (userMessages.length > 0) {
      contextParts.push(" *O que eu falei:*");
      userMessages.slice(-5).forEach(msg => {
        contextParts.push(`• ${msg}`);
      });
      contextParts.push("");
    }
    
    if (lastMayaMsg) {
      const clean = lastMayaMsg.replace(/\*\*/g, "").replace(/\[.*?\]\(.*?\)/g, "").substring(0, 200);
      contextParts.push(` *Última resposta da Maya:* ${clean}...`);
      contextParts.push("");
    }
    
    contextParts.push(" Gostaria de continuar com um atendente humano!");
    return encodeURIComponent(contextParts.join("\n"));
  }

  function openWhatsAppHuman() {
    const context = buildWhatsAppContext();
    window.open(`${WHATSAPP_URL}${context}`, "_blank");
  }

  async function handleUserMessage(text: string, imageUri?: string) {
    if (!text.trim() && !imageUri) return;

    const userText = text.trim() || "Analise esta imagem para mim.";
    
    // Add user message
    const um: Message = { from: "user", text: userText, timestamp: new Date(), imagePreview: imageUri };
    setMessages(prev => [...prev, um]);
    addToChatHistory("user", userText);
    setInputText("");
    setSelectedImage(null);
    setIsTyping(true);
    setStatusText("Maya está interpretando sua pergunta...");
    setMessageCount(prev => prev + 1);

    // Call Maya AI Agent with Tool Calling & Status Updates
    const response = await processMayaRequest(userText, userContext, (status) => setStatusText(status));

    setIsTyping(false);
    setStatusText(null);

    if (response) {
      addMayaMessage(response);
    } else {
      addMayaMessage("Eita, tive um probleminha de conexão temporário. Você pode tentar novamente ou [falar com nossos atendentes humanos no WhatsApp](https://wa.me/5561995659907).");
    }
  }

  // Handle image upload from device
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUri = event.target?.result as string;
        setSelectedImage(dataUri);
        handleUserMessage("Por favor, analise a foto deste lugar ou atração e me dê dicas sobre ele.", dataUri);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <>
      {/* Botão Flutuante (Fechado) */}
      <AnimatePresence>
        {!open && (
          <div className="fixed right-4 bottom-4 z-50 flex flex-col items-end gap-3" id="maya-chat-button">
            {showProactiveHint && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl p-3.5 pr-8 relative cursor-pointer group hover:scale-105 transition-transform max-w-[270px] border border-emerald-100 dark:border-slate-800"
                onClick={openChat}
              >
                <button
                  onClick={(e) => { e.stopPropagation(); setShowProactiveHint(false); }}
                  className="absolute top-2 right-2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
                <div className="flex gap-3">
                  <div className="w-11 h-11 min-w-[44px] rounded-full bg-emerald-500/10 flex items-center justify-center border-2 border-emerald-500 overflow-hidden shadow-sm">
                    <img src={assetPath('/maya-avatar.png')} alt="Avatar da Maya" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-slate-800 dark:text-slate-100 flex items-center gap-1">
                      Maya <span className="text-[10px] text-emerald-600 font-semibold">• IA Online</span>
                    </h4>
                    <p className="text-xs text-slate-600 dark:text-slate-300 font-medium leading-snug">Bora planejar sua viagem ou ver o clima agora? ☀️✨</p>
                  </div>
                </div>
              </motion.div>
            )}

            <motion.button
              onClick={openChat}
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.94 }}
              className={`w-15 h-15 bg-gradient-to-tr from-emerald-600 to-teal-500 rounded-full flex items-center justify-center text-white shadow-2xl relative group ${pulseButton ? 'animate-[pulse-glow_2.5s_infinite]' : ''}`}
              aria-label="Fale com a Maya AI"
            >
              <div className="absolute inset-0 bg-emerald-400 rounded-full opacity-0 group-hover:opacity-30 blur-md transition-opacity"></div>
              <img src={assetPath('/maya-avatar.png')} alt="Maya Official Avatar" className="w-12 h-12 object-cover rounded-full border-2 border-white/80 shadow-inner" />
              <span className="absolute -top-1 -right-1 flex h-4 w-4">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500 border-2 border-white"></span>
              </span>
            </motion.button>
            <style jsx>{`
              @keyframes pulse-glow {
                0%, 100% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.4); }
                50% { box-shadow: 0 0 0 16px rgba(16, 185, 129, 0); }
              }
            `}</style>
          </div>
        )}
      </AnimatePresence>

      {/* Janela Principal de Chat da Maya */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 320, damping: 26 }}
            className="fixed bottom-3 right-3 sm:bottom-5 sm:right-5 z-[9999] w-full max-w-[calc(100vw-1.5rem)] sm:max-w-[430px] bg-white dark:bg-slate-900 rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-slate-200/80 dark:border-slate-800"
            style={{ maxHeight: 'min(720px, calc(100vh - 1.5rem))', height: '640px' }}
            id="maya-chat-window"
          >
            {/* ── 1. AVATAR OFICIAL & CABEÇALHO INTELIGENTE ──────── */}
            <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 p-4 text-white shadow-md relative z-10">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  {/* Avatar Oficial da Maya (Parte Superior Esquerda) */}
                  <div className="relative">
                    <div className={`w-13 h-13 rounded-full bg-white/10 p-0.5 shadow-md flex items-center justify-center overflow-hidden border-2 border-white/90 ${isSpeaking ? 'animate-pulse ring-4 ring-white/40' : ''}`}>
                      <img src={assetPath('/maya-avatar.png')} alt="Maya Avatar Oficial" className="w-full h-full object-cover rounded-full" />
                    </div>
                    {/* Indicador Verde de Online */}
                    <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-400 rounded-full border-2 border-emerald-700 shadow-sm"></span>
                  </div>

                  <div>
                    <h3 className="font-extrabold text-base leading-tight tracking-tight flex items-center gap-1.5 text-white">
                      Maya
                    </h3>
                    <p className="text-emerald-100 text-[11px] font-semibold">Assistente IA de Viagem</p>
                    <span className="text-emerald-200 text-[10px] font-medium flex items-center gap-1 mt-0.5">
                      <span className="w-1.5 h-1.5 bg-green-300 rounded-full animate-pulse"></span>
                      Online
                    </span>
                  </div>
                </div>

                {/* Controles do Header (Voz, Redirecionamento e Fechar) */}
                <div className="flex items-center gap-1.5">
                  {isSpeaking && (
                    <button
                      onClick={stopSpeaking}
                      className="px-2 py-1 rounded-lg bg-red-500/80 hover:bg-red-600 text-white text-[11px] font-bold transition-all animate-bounce"
                      title="Parar de falar"
                    >
                      Parar Voz
                    </button>
                  )}

                  <button
                    onClick={toggleVoiceEnabled}
                    className={`p-1.5 rounded-xl transition-colors ${voiceEnabled ? 'bg-white/20 text-white' : 'hover:bg-white/10 text-emerald-200'}`}
                    title={voiceEnabled ? "Voz ativada" : "Ativar voz"}
                  >
                    {voiceEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                  </button>

                  <a
                    href={assetPath('/app/index.html')}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 transition-colors text-white flex items-center gap-1 text-[11px] font-semibold"
                    title="Abrir no Aplicativo"
                  >
                    <Smartphone className="w-4 h-4" />
                    <span className="hidden sm:inline">Abrir App</span>
                  </a>

                  <button onClick={() => setOpen(false)} className="p-1.5 hover:bg-white/20 rounded-xl transition-colors text-white">
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* ── Widget de Localização Real e Clima Atual ──────── */}
              <div className="mt-3 pt-2.5 border-t border-white/15 flex items-center justify-between text-xs text-emerald-50">
                <div className="flex items-center gap-1.5 font-medium">
                  <MapPin className="w-3.5 h-3.5 text-emerald-200 flex-shrink-0" />
                  <span>
                    {userContext.permissionGranted
                      ? `${userContext.city}, ${userContext.state}`
                      : "Localização Padrão: Brasília, DF"}
                  </span>
                </div>

                <div className="flex items-center gap-2 font-bold text-white">
                  {loadingWeather ? (
                    <span className="text-[11px] text-emerald-200 animate-pulse">Atualizando clima...</span>
                  ) : currentWeather ? (
                    <div className="flex items-center gap-1.5 bg-black/15 px-2.5 py-0.5 rounded-full border border-white/10">
                      <span>{currentWeather.icon}</span>
                      <span>{currentWeather.temperature}°C</span>
                      <span className="text-[10px] font-normal text-emerald-150 border-l border-white/20 pl-1.5">
                        {currentWeather.condition}
                      </span>
                    </div>
                  ) : (
                    <span>27°C • Ensolarado</span>
                  )}
                </div>
              </div>

              {/* Solicitação de Permissão de Localização (se não autorizada) */}
              {!userContext.permissionGranted && !locationError && (
                <div className="mt-2.5 p-2 bg-emerald-800/60 rounded-xl border border-emerald-400/30 flex items-center justify-between gap-2 text-[11px]">
                  <span>Ative sua localização para ver atrações da sua região:</span>
                  <button
                    onClick={requestLocation}
                    className="px-2.5 py-1 bg-white text-emerald-800 rounded-lg font-bold text-[10px] hover:bg-emerald-50 transition-colors shadow-sm"
                  >
                    Permitir localização
                  </button>
                </div>
              )}
            </div>

            {/* ── 2. TELA / ÁREA DE MENSAGENS E CARDS ──────────────── */}
            <div className="flex-1 overflow-y-auto p-3.5 bg-slate-50/70 dark:bg-slate-900/50 space-y-4">
              
              {/* Botões de Ações Rápidas (Atalhos Iniciais) */}
              {messages.length <= 1 && (
                <div className="bg-white dark:bg-slate-800 rounded-2xl p-3.5 border border-slate-200/80 dark:border-slate-700 shadow-sm space-y-2.5">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-200">
                    <Compass className="w-4 h-4 text-emerald-600" />
                    O que vamos descobrir hoje?
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => handleUserMessage("Maya, monte um roteiro de viagem incrível para mim!")}
                      className="p-2.5 bg-slate-50 dark:bg-slate-700/60 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 hover:border-emerald-300 border border-slate-200 dark:border-slate-700 rounded-xl text-left text-xs transition-all group"
                    >
                      <div className="font-bold text-slate-800 dark:text-slate-100 group-hover:text-emerald-700 flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-emerald-600" /> Planejar viagem
                      </div>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400 block mt-0.5">Roteiro inteligente dia a dia</span>
                    </button>

                    <button
                      onClick={() => handleUserMessage("Maya, faça uma estimativa de orçamento para minha próxima viagem.")}
                      className="p-2.5 bg-slate-50 dark:bg-slate-700/60 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 hover:border-emerald-300 border border-slate-200 dark:border-slate-700 rounded-xl text-left text-xs transition-all group"
                    >
                      <div className="font-bold text-slate-800 dark:text-slate-100 group-hover:text-emerald-700 flex items-center gap-1.5">
                        <DollarSign className="w-3.5 h-3.5 text-emerald-600" /> Fazer orçamento
                      </div>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400 block mt-0.5">Calcule custos estimados</span>
                    </button>

                    <button
                      onClick={() => handleUserMessage(`Maya, o que posso fazer hoje em ${userContext.city}? Mostre lugares próximos.`)}
                      className="p-2.5 bg-slate-50 dark:bg-slate-700/60 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 hover:border-emerald-300 border border-slate-200 dark:border-slate-700 rounded-xl text-left text-xs transition-all group"
                    >
                      <div className="font-bold text-slate-800 dark:text-slate-100 group-hover:text-emerald-700 flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-emerald-600" /> Explorar perto de mim
                      </div>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400 block mt-0.5">Restaurantes, atração & hotéis</span>
                    </button>

                    <button
                      onClick={() => handleUserMessage(`Maya, como está o clima em ${userContext.city} agora e para a semana?`)}
                      className="p-2.5 bg-slate-50 dark:bg-slate-700/60 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 hover:border-emerald-300 border border-slate-200 dark:border-slate-700 rounded-xl text-left text-xs transition-all group"
                    >
                      <div className="font-bold text-slate-800 dark:text-slate-100 group-hover:text-emerald-700 flex items-center gap-1.5">
                        <Sun className="w-3.5 h-3.5 text-emerald-600" /> Ver clima real
                      </div>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400 block mt-0.5">Temperatura e previsão</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Mensagens do Chat */}
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.from === "user" ? "justify-end" : "justify-start"}`}>
                  <div className="flex items-start gap-2 max-w-[88%]">
                    {msg.from === "maya" && (
                      <div className="w-7 h-7 min-w-[28px] rounded-full bg-emerald-500/10 border border-emerald-300 flex-shrink-0 flex items-center justify-center overflow-hidden shadow-sm mt-0.5">
                        <img src={assetPath('/maya-avatar.png')} alt="Maya Avatar Pequeno" className="w-full h-full object-cover" />
                      </div>
                    )}

                    <div className="flex flex-col space-y-2">
                      <div
                        className={`px-4 py-3 rounded-2xl text-xs sm:text-sm leading-relaxed shadow-sm ${
                          msg.from === "user"
                            ? "bg-slate-800 text-white rounded-tr-none"
                            : "bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 border border-slate-200/70 dark:border-slate-700 rounded-tl-none"
                        }`}
                      >
                        {msg.imagePreview && (
                          <div className="mb-2 rounded-xl overflow-hidden border border-white/20">
                            <img src={msg.imagePreview} alt="Imagem enviada" className="max-h-40 w-full object-cover" />
                          </div>
                        )}

                        {msg.from === "maya" ? (
                          <ReactMarkdown
                            components={{
                              a: ({ node, ...props }) => <a {...props} className="text-emerald-600 font-bold hover:underline" target="_blank" rel="noopener noreferrer" />,
                              p: ({ node, ...props }) => <p {...props} className="mb-2 last:mb-0" />,
                              strong: ({ node, ...props }) => <strong {...props} className="font-bold text-emerald-800 dark:text-emerald-400" />,
                              ul: ({ node, ...props }) => <ul {...props} className="list-disc pl-4 my-2 space-y-1" />
                            }}
                          >
                            {msg.text}
                          </ReactMarkdown>
                        ) : (
                          msg.text
                        )}
                      </div>

                      {/* ── CARD 1: CARD DE CLIMA INTERATIVO ───────────────── */}
                      {msg.component === "weather" && (msg.weatherData || currentWeather) && (
                        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-slate-800 dark:to-slate-900 border border-blue-200 dark:border-slate-700 rounded-2xl p-4 shadow-md text-slate-800 dark:text-slate-100">
                          <div className="flex items-center justify-between border-b border-blue-200/60 pb-2 mb-3">
                            <div>
                              <h4 className="font-bold text-sm text-blue-900 dark:text-blue-200 flex items-center gap-1.5">
                                <MapPin className="w-4 h-4 text-blue-600" />
                                {(msg.weatherData || currentWeather)?.city}, {(msg.weatherData || currentWeather)?.state}
                              </h4>
                              <span className="text-[11px] text-blue-700/80 dark:text-blue-300 font-medium">Previsão Oficial</span>
                            </div>
                            <span className="text-3xl">{(msg.weatherData || currentWeather)?.icon}</span>
                          </div>

                          <div className="flex items-baseline justify-between my-2">
                            <div>
                              <span className="text-3xl font-black text-slate-900 dark:text-white">
                                {(msg.weatherData || currentWeather)?.temperature}°C
                              </span>
                              <p className="text-xs font-semibold text-blue-800 dark:text-blue-300">
                                {(msg.weatherData || currentWeather)?.condition}
                              </p>
                            </div>

                            <div className="text-right text-[11px] space-y-0.5 text-slate-600 dark:text-slate-400">
                              <p>Sensação: <strong className="text-slate-800 dark:text-slate-200">{(msg.weatherData || currentWeather)?.feelsLike}°C</strong></p>
                              <p>Umidade: <strong className="text-slate-800 dark:text-slate-200">{(msg.weatherData || currentWeather)?.humidity}%</strong></p>
                              <p>Vento: <strong className="text-slate-800 dark:text-slate-200">{(msg.weatherData || currentWeather)?.windSpeed} km/h</strong></p>
                            </div>
                          </div>

                          <div className="bg-white/80 dark:bg-slate-800/80 p-2 rounded-xl text-xs flex justify-between items-center my-3 border border-blue-100 dark:border-slate-700">
                            <span className="text-slate-600 dark:text-slate-400">Hoje</span>
                            <span className="font-bold text-slate-800 dark:text-slate-100">
                              {(msg.weatherData || currentWeather)?.todayMin}°C — {(msg.weatherData || currentWeather)?.todayMax}°C
                            </span>
                          </div>

                          {/* Tabs de Previsão */}
                          <div className="grid grid-cols-3 gap-1.5 text-[10px] font-bold">
                            <button
                              onClick={() => setActiveWeatherTab("hoje")}
                              className={`py-1.5 rounded-lg border transition-colors ${activeWeatherTab === "hoje" ? "bg-blue-600 text-white border-blue-600" : "bg-white dark:bg-slate-800 border-blue-200 text-blue-700"}`}
                            >
                              Hoje
                            </button>
                            <button
                              onClick={() => setActiveWeatherTab("amanha")}
                              className={`py-1.5 rounded-lg border transition-colors ${activeWeatherTab === "amanha" ? "bg-blue-600 text-white border-blue-600" : "bg-white dark:bg-slate-800 border-blue-200 text-blue-700"}`}
                            >
                              Amanhã
                            </button>
                            <button
                              onClick={() => setActiveWeatherTab("7dias")}
                              className={`py-1.5 rounded-lg border transition-colors ${activeWeatherTab === "7dias" ? "bg-blue-600 text-white border-blue-600" : "bg-white dark:bg-slate-800 border-blue-200 text-blue-700"}`}
                            >
                              7 Dias
                            </button>
                          </div>
                        </div>
                      )}

                      {/* ── CARD 2: CARD DE LUGARES ENCONTRADOS ───────────── */}
                      {msg.component === "places" && msg.placesData && (
                        <div className="space-y-2.5">
                          {msg.placesData.map((place) => (
                            <div key={place.id} className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden shadow-sm flex flex-col sm:flex-row">
                              <div className="sm:w-32 h-28 sm:h-auto relative overflow-hidden bg-slate-100">
                                <img src={place.imageUrl} alt={place.name} className="w-full h-full object-cover" />
                                <span className="absolute top-2 left-2 bg-black/60 text-white text-[9px] font-bold px-2 py-0.5 rounded-full backdrop-blur-sm">
                                  {place.categoryLabel}
                                </span>
                              </div>
                              <div className="p-3 flex-1 flex flex-col justify-between">
                                <div>
                                  <div className="flex justify-between items-start gap-1">
                                    <h5 className="font-bold text-xs text-slate-800 dark:text-slate-100 leading-snug">{place.name}</h5>
                                    <span className="text-amber-500 font-bold text-xs flex items-center">
                                      ★ {place.rating}
                                    </span>
                                  </div>
                                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">{place.description}</p>
                                  <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-2">
                                    <span>📍 {place.distanceKm || 1.2} km</span>
                                    <span>•</span>
                                    <span className="font-bold text-emerald-600">{place.priceRange}</span>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2 mt-3 pt-2 border-t border-slate-100 dark:border-slate-700/60">
                                  <a
                                    href={place.mapsUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex-1 text-center py-1.5 px-2 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 rounded-lg text-[10px] font-bold flex items-center justify-center gap-1"
                                  >
                                    <Navigation className="w-3 h-3" /> Abrir no Mapa
                                  </a>
                                  <button
                                    onClick={() => handleUserMessage(`Maya, adicione ${place.name} ao meu roteiro!`)}
                                    className="px-2.5 py-1.5 bg-slate-800 dark:bg-slate-700 text-white hover:bg-slate-900 rounded-lg text-[10px] font-bold"
                                  >
                                    + Roteiro
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* ── CARD 3: CARD DE ROTEIRO & GERAR PDF ───────────── */}
                      {msg.component === "itinerary" && msg.itineraryData && (
                        <div className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-slate-800 dark:to-slate-900 border border-emerald-200 dark:border-slate-700 rounded-2xl p-4 shadow-md space-y-3">
                          <div className="flex items-center justify-between border-b border-emerald-200/60 pb-2">
                            <div>
                              <h4 className="font-bold text-xs text-emerald-900 dark:text-emerald-300 uppercase tracking-wider">
                                Roteiro Maya AI — {msg.itineraryData.destination}
                              </h4>
                              <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-semibold">
                                {msg.itineraryData.daysCount} Dias Programados
                              </span>
                            </div>
                            <span className="text-xl">🗺️</span>
                          </div>

                          <div className="space-y-2">
                            {msg.itineraryData.days.map((day: any, dIdx: number) => (
                              <div key={dIdx} className="bg-white dark:bg-slate-800 p-2.5 rounded-xl border border-emerald-100 dark:border-slate-700 text-xs">
                                <div className="flex items-center justify-between font-bold text-slate-800 dark:text-slate-100 mb-1">
                                  <span className="text-emerald-700 font-black">Dia {day.dayNumber}: {day.title}</span>
                                </div>
                                <ul className="space-y-1 text-[11px] text-slate-600 dark:text-slate-300">
                                  {day.activities.map((act: string, aIdx: number) => (
                                    <li key={aIdx} className="flex items-start gap-1.5">
                                      <CheckCircle className="w-3 h-3 text-emerald-500 mt-0.5 flex-shrink-0" />
                                      <span>{act}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            ))}
                          </div>

                          <button
                            onClick={() => generateMayaTravelPDF(msg.itineraryData!)}
                            className="w-full py-2.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-md transition-transform hover:scale-[1.01]"
                          >
                            <FileDown className="w-4 h-4" />
                            Criar meu guia em PDF
                          </button>
                        </div>
                      )}

                      {/* ── CARD 4: CARD DE ORÇAMENTO ─────────────────────── */}
                      {msg.component === "budget" && msg.budgetData && (
                        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-4 shadow-md space-y-3">
                          <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-700 pb-2">
                            <h4 className="font-bold text-xs text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
                              <DollarSign className="w-4 h-4 text-emerald-600" />
                              Estimativa de Orçamento
                            </h4>
                            <span className="text-xs font-black text-emerald-600">{msg.budgetData.total}</span>
                          </div>

                          <div className="space-y-1.5">
                            {msg.budgetData.categories?.map((cat: any, idx: number) => (
                              <div key={idx} className="flex justify-between items-center text-xs p-2 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                                <span className="text-slate-600 dark:text-slate-300">{cat.name}</span>
                                <span className="font-bold text-slate-800 dark:text-slate-100">{cat.amount}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* ── CARD 5: CARDS DE FONTES DE PESQUISA ────────────── */}
                      {msg.component === "sources" && msg.sourcesData && msg.sourcesData.length > 0 && (
                        <div className="bg-slate-100 dark:bg-slate-800/80 p-3 rounded-xl border border-slate-200 dark:border-slate-700 space-y-1.5">
                          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                            Informações consultadas na Web agora:
                          </span>
                          <div className="space-y-1">
                            {msg.sourcesData.map((src: any, idx: number) => (
                              <a
                                key={idx}
                                href={src.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-between text-xs text-emerald-700 dark:text-emerald-400 font-semibold hover:underline"
                              >
                                <span className="truncate max-w-[240px]">🌐 {src.title}</span>
                                <ExternalLink className="w-3 h-3 flex-shrink-0 ml-1" />
                              </a>
                            ))}
                          </div>
                        </div>
                      )}

                      <span className={`text-[10px] text-slate-400 ${msg.from === "user" ? "text-right" : "text-left"}`}>
                        {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                </div>
              ))}

              {/* Indicador de Status/Thinking/Searching */}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="flex items-center gap-2 max-w-[85%]">
                    <div className="w-7 h-7 rounded-full bg-emerald-100 border border-emerald-300 flex items-center justify-center overflow-hidden">
                      <img src={assetPath('/maya-avatar.png')} alt="Maya Avatar" className="w-full h-full object-cover" />
                    </div>
                    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-4 py-2.5 rounded-2xl shadow-sm flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300">
                      <Bot className="w-4 h-4 text-emerald-600 animate-spin" />
                      <span>{statusText || "Maya está pesquisando e calculando..."}</span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* ── BARRA DE ATENDIMENTO HUMANO / WHATSAPP ─────────────────── */}
            {messageCount >= 1 && (
              <div className="px-3 py-1.5 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-slate-800 dark:to-slate-900 border-t border-emerald-200/50">
                <button
                  onClick={openWhatsAppHuman}
                  className="w-full flex items-center justify-center gap-2 py-1.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-all shadow-md"
                >
                  <Phone className="w-3.5 h-3.5" />
                  Falar com especialista humano no WhatsApp
                </button>
              </div>
            )}

            {/* ── 3. INPUT AREA & CONTROLES DE VOZ E CÂMERA ──────────────── */}
            <div className="p-3 bg-white dark:bg-slate-900 border-t border-slate-200/80 dark:border-slate-800">
              <div className="relative flex items-center gap-2">
                {/* Upload de Câmera/Imagem */}
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageSelect}
                  accept="image/*"
                  className="hidden"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="p-2.5 rounded-xl text-slate-500 hover:text-emerald-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  title="Usar Câmera / Enviar Foto"
                >
                  <Camera className="w-4 h-4" />
                </button>

                <input
                  ref={inputRef}
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleUserMessage(inputText)}
                  placeholder={isSpeaking ? "Maya está falando..." : "Pergunte algo à Maya..."}
                  disabled={isSpeaking || isTyping}
                  className="w-full pl-3 pr-20 py-2.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-emerald-500 text-xs sm:text-sm transition-all text-slate-800 dark:text-slate-100 placeholder:text-slate-400"
                />
                
                {/* Botão de Microfone / Modo Conversa por Voz */}
                {voiceEnabled && (
                  <button
                    onClick={toggleVoice}
                    className={`absolute right-10 p-1.5 rounded-lg transition-colors ${isListening ? 'text-red-500 bg-red-50 animate-pulse' : 'text-slate-400 hover:text-emerald-600'}`}
                    disabled={isSpeaking}
                    title={isListening ? "Parar de ouvir" : "Falar com Maya por voz"}
                  >
                    {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                  </button>
                )}

                <button
                  onClick={() => handleUserMessage(inputText)}
                  disabled={!inputText.trim() || isTyping || isSpeaking}
                  className="absolute right-1.5 p-1.5 rounded-lg bg-emerald-600 text-white disabled:bg-slate-200 disabled:text-slate-400 hover:bg-emerald-700 transition-colors"
                >
                  {isTyping ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                </button>
              </div>

              <div className="mt-2 flex items-center justify-between px-1">
                <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-emerald-500" /> Maya Agentic AI
                </span>
                <span className="text-[9px] text-slate-400 font-medium">Descubra o Brasil</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
