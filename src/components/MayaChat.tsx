"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X, Send, Mic, MicOff, Loader2, Sparkles, Volume2, VolumeX,
  Bot, Phone, User, MapPin, Sun, DollarSign, Calendar, Navigation,
  FileDown, ExternalLink, CheckCircle,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import { assetPath } from "@/lib/assetPath";
import {
  processMayaRequest, MayaAIResponse, UserContext,
  addToChatHistory, resetChatHistory, isGeminiAvailable,
} from "@/lib/gemini";
import { WeatherInfo } from "@/services/weatherService";
import { PlaceItem } from "@/services/placesService";
import { generateMayaTravelPDF, PDFItineraryData } from "@/services/pdfService";

const WHATSAPP_NUMBER = "5561995659907";
const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=`;

interface Message {
  from: "maya" | "user";
  text: string;
  timestamp: Date;
  isAI?: boolean;
  component?: "weather" | "places" | "itinerary" | "budget" | "sources";
  weatherData?: WeatherInfo;
  placesData?: PlaceItem[];
  itineraryData?: PDFItineraryData;
  budgetData?: any;
  sourcesData?: any[];
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
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [pulseButton, setPulseButton] = useState(true);
  const [showProactiveHint, setShowProactiveHint] = useState(false);
  const [messageCount, setMessageCount] = useState(0);

  // User context for location / weather
  const [userContext] = useState<UserContext>({
    city: "Brasília",
    state: "DF",
    latitude: -15.7975,
    longitude: -47.8919,
    permissionGranted: false,
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<any>(null);
  const synthesisRef = useRef<SpeechSynthesis | null>(null);

  // ── Proactive Greeting ─────────────────────────────────────────
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!open && !started) setShowProactiveHint(true);
    }, 8000);
    return () => clearTimeout(timer);
  }, [open, started]);

  useEffect(() => {
    if (showProactiveHint) {
      const timer = setTimeout(() => setShowProactiveHint(false), 12000);
      return () => clearTimeout(timer);
    }
  }, [showProactiveHint]);

  // ── Voice Setup ──────────────────────────────────────────────────
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

  const toggleVoice = () => {
    if (isListening) {
      setContinuousMode(false);
      recognitionRef.current?.stop();
    } else {
      setContinuousMode(true);
      recognitionRef.current?.start();
    }
  };

  // ── Scroll ─────────────────────────────────────────────────────
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // ── Handlers ────────────────────────────────────────────────────
  function addMayaMessage(response: MayaAIResponse | string) {
    const text = typeof response === "string" ? response : response.message;
    const component = typeof response === "string" ? undefined : response.component;
    const weatherData = typeof response === "string" ? undefined : response.weatherData;
    const placesData = typeof response === "string" ? undefined : response.placesData;
    const itineraryData = typeof response === "string" ? undefined : response.itineraryData;
    const budgetData = typeof response === "string" ? undefined : response.budgetData;
    const sourcesData = typeof response === "string" ? undefined : response.sources;

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
      const greeting = "Olá! Sou a **Maya**, assistente de viagem com IA do Descubra o Brasil.\n\nPosso consultar o clima, pesquisar lugares, montar roteiros e calcular orçamentos. Para onde vamos hoje?";
      setMessages([{ from: "maya", text: greeting, timestamp: new Date(), isAI: false }]);
      addToChatHistory("model", greeting);
      mayaSpeak(greeting);
    }
  }

  function buildWhatsAppContext() {
    const userMessages = messages.filter(m => m.from === "user").map(m => m.text);
    const lastMayaMsg = messages.filter(m => m.from === "maya").slice(-1)[0]?.text || "";
    const contextParts = [
      " *Conversei com a Maya AI no Descubra o Brasil*", "",
    ];
    if (userMessages.length > 0) {
      contextParts.push(" *O que eu falei:*");
      userMessages.slice(-5).forEach(msg => contextParts.push(`• ${msg}`));
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

  async function handleUserMessage(text: string) {
    if (!text.trim()) return;
    const um: Message = { from: "user", text, timestamp: new Date() };
    setMessages(prev => [...prev, um]);
    addToChatHistory("user", text);
    setInputText("");
    setIsTyping(true);
    setStatusText("Maya está interpretando sua pergunta...");
    setMessageCount(prev => prev + 1);

    const response = await processMayaRequest(text, userContext, (status) => setStatusText(status));

    setIsTyping(false);
    setStatusText(null);

    if (response) {
      addMayaMessage(response);
    } else {
      addMayaMessage("Eita, tive um probleminha de conexão temporário. Você pode tentar de novo ou [falar com nossos atendentes no WhatsApp](https://wa.me/5561995659907).");
    }
  }

  return (
    <>
      {/* ── Botão Flutuante ──────────────────────────────────────── */}
      <AnimatePresence>
        {!open && (
          <div className="fixed right-4 bottom-4 z-50 flex flex-col items-end gap-3" id="maya-chat-button">
            {showProactiveHint && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl p-3 pr-8 relative cursor-pointer group hover:scale-105 transition-transform max-w-[250px]"
                onClick={openChat}
              >
                <button
                  onClick={(e) => { e.stopPropagation(); setShowProactiveHint(false); }}
                  className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
                <div className="flex gap-3">
                  <div className="w-10 h-10 min-w-[40px] rounded-full bg-emerald-100 flex items-center justify-center border-2 border-emerald-500 overflow-hidden">
                    <img src={assetPath('/maya-avatar.png')} alt="Maya" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-slate-800 dark:text-slate-100">Maya IA</h4>
                    <p className="text-xs text-slate-600 dark:text-slate-300 font-medium">Bora planejar sua viagem? ✈️</p>
                  </div>
                </div>
              </motion.div>
            )}

            <motion.button
              onClick={openChat}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`w-14 h-14 bg-emerald-600 rounded-full flex items-center justify-center text-white shadow-lg relative group ${pulseButton ? 'animate-[pulse-glow_2s_infinite]' : ''}`}
              aria-label="Fale com a Maya AI"
            >
              <div className="absolute inset-0 bg-emerald-400 rounded-full opacity-0 group-hover:opacity-20 blur-md transition-opacity" />
              <Sparkles className="w-6 h-6 absolute text-emerald-200/50 -top-1 -right-1 opacity-0 group-hover:opacity-100 transition-all group-hover:rotate-12 group-hover:scale-110" />
              <img src={assetPath('/maya-avatar.png')} alt="Maya" className="w-10 h-10 object-cover rounded-full" />
              <span className="absolute -top-1 -right-1 flex h-4 w-4">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500 border-2 border-white" />
              </span>
            </motion.button>
            <style jsx>{`
              @keyframes pulse-glow {
                0%, 100% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.4); }
                50% { box-shadow: 0 0 0 15px rgba(16, 185, 129, 0); }
              }
            `}</style>
          </div>
        )}
      </AnimatePresence>

      {/* ── Janela de Chat ───────────────────────────────────────── */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="fixed bottom-4 right-4 z-[9999] w-full max-w-[calc(100vw-2rem)] sm:max-w-[400px] bg-white dark:bg-slate-900 rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-slate-100"
            style={{ maxHeight: 'min(700px, calc(100vh - 2rem))', height: '620px' }}
            id="maya-chat-window"
          >
            {/* ── CABEÇALHO com Avatar Oficial ─────────────────────── */}
            <div className="bg-emerald-600 p-4 flex items-center justify-between shadow-md relative z-10">
              <div className="flex items-center gap-3">
                {/* Avatar Oficial no canto superior esquerdo */}
                <div className="relative">
                  <div className={`w-11 h-11 rounded-full bg-white/10 flex items-center justify-center p-0.5 shadow-inner border-2 border-white/80 overflow-hidden ${isSpeaking ? 'animate-pulse' : ''}`}>
                    <img src={assetPath('/maya-avatar.png')} alt="Avatar Oficial da Maya" className="w-full h-full object-cover rounded-full" />
                  </div>
                  {/* Indicador verde Online */}
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-emerald-600" />
                </div>
                <div>
                  <h3 className="font-bold text-white leading-tight flex items-center gap-1.5">
                    Maya <span className="text-emerald-200 text-[10px] font-semibold">Assistente IA de Viagem</span>
                  </h3>
                  <span className="text-emerald-100 text-[10px] sm:text-xs font-semibold tracking-wider uppercase flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                    Online
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={toggleVoiceEnabled}
                  className={`p-1.5 rounded-lg transition-colors ${voiceEnabled ? 'bg-emerald-500/50 text-white' : 'hover:bg-emerald-500/30 text-emerald-100'}`}
                  title={voiceEnabled ? "Desativar voz" : "Ativar voz"}
                >
                  {voiceEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4 text-emerald-200" />}
                </button>
                <button onClick={() => setOpen(false)} className="p-1.5 hover:bg-emerald-500/50 rounded-lg transition-colors text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* ── ÁREA DE MENSAGENS ─────────────────────────────────── */}
            <div className="flex-1 overflow-y-auto p-4 bg-slate-50/50 dark:bg-slate-900/50">
              {/* Ações rápidas — só aparecem antes da primeira mensagem do usuário */}
              {messageCount === 0 && messages.length <= 1 && (
                <div className="grid grid-cols-2 gap-2 mb-4">
                  {[
                    { label: "Ver clima real", icon: <Sun className="w-3 h-3" />, q: `Como está o clima agora?` },
                    { label: "Planejar viagem", icon: <Calendar className="w-3 h-3" />, q: "Monte um roteiro de viagem para mim!" },
                    { label: "Explorar lugares", icon: <MapPin className="w-3 h-3" />, q: "Quais lugares posso visitar perto de mim?" },
                    { label: "Fazer orçamento", icon: <DollarSign className="w-3 h-3" />, q: "Quanto custaria uma viagem de 3 dias?" },
                  ].map(({ label, icon, q }) => (
                    <button
                      key={label}
                      onClick={() => handleUserMessage(q)}
                      className="p-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-left text-[11px] font-semibold text-slate-700 dark:text-slate-200 hover:border-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 transition-all flex items-center gap-1.5 shadow-sm"
                    >
                      <span className="text-emerald-600">{icon}</span> {label}
                    </button>
                  ))}
                </div>
              )}

              <div className="flex flex-col gap-4">
                {messages.map((msg, i) => (
                  <div key={i} className={`flex ${msg.from === "user" ? "justify-end" : "justify-start"}`}>
                    <div className="flex items-end gap-2 max-w-[85%]">
                      {msg.from === "maya" && (
                        <div className="w-6 h-6 min-w-[24px] rounded-full bg-emerald-100 border border-emerald-200 flex-shrink-0 flex items-center justify-center overflow-hidden shadow-sm">
                          <img src={assetPath('/maya-avatar.png')} alt="Maya" className="w-full h-full object-cover" />
                        </div>
                      )}
                      <div className="flex flex-col gap-1.5">
                        {msg.from === "maya" && msg.isAI && (
                          <div className="flex items-center gap-1 text-[10px] text-blue-600 font-medium ml-1 bg-blue-50 px-1.5 py-0.5 rounded-full w-fit border border-blue-100">
                            <Bot className="w-3 h-3" /> IA Ativa
                          </div>
                        )}
                        <div className={`px-4 py-2.5 rounded-2xl text-[14px] sm:text-[15px] leading-relaxed shadow-sm ${
                          msg.from === "user"
                            ? "bg-slate-800 text-white rounded-br-sm"
                            : msg.isAI
                              ? "bg-blue-50 text-slate-800 dark:text-slate-100 border-l-4 border-l-blue-400 rounded-bl-sm"
                              : "bg-white dark:bg-slate-900 border border-slate-100 text-slate-700 dark:text-slate-200 rounded-bl-sm"
                        }`}>
                          {msg.from === "maya" ? (
                            <ReactMarkdown components={{
                              a: ({ node, ...props }) => <a {...props} className="text-emerald-600 font-semibold hover:underline" target="_blank" rel="noopener noreferrer" />,
                              p: ({ node, ...props }) => <p {...props} className="mb-2 last:mb-0" />,
                              strong: ({ node, ...props }) => <strong {...props} className="font-bold text-emerald-800 dark:text-emerald-400" />,
                              ul: ({ node, ...props }) => <ul {...props} className="list-disc pl-4 my-2 space-y-1" />,
                            }}>
                              {msg.text}
                            </ReactMarkdown>
                          ) : msg.text}
                        </div>

                        {/* Card de Clima */}
                        {msg.component === "weather" && msg.weatherData && (
                          <div className="bg-gradient-to-br from-blue-50 to-sky-50 dark:from-slate-800 dark:to-slate-900 border border-blue-200 dark:border-slate-700 rounded-xl p-3 shadow-sm text-xs">
                            <div className="flex items-center justify-between mb-2">
                              <div>
                                <p className="font-bold text-blue-900 dark:text-blue-200 flex items-center gap-1">
                                  <MapPin className="w-3 h-3" /> {msg.weatherData.city}, {msg.weatherData.state}
                                </p>
                                <p className="text-[10px] text-blue-600 font-semibold">{msg.weatherData.condition}</p>
                              </div>
                              <span className="text-2xl">{msg.weatherData.icon}</span>
                            </div>
                            <div className="grid grid-cols-2 gap-1 text-[11px]">
                              <p className="text-slate-600 dark:text-slate-400">Temperatura: <strong className="text-slate-800 dark:text-slate-100">{msg.weatherData.temperature}°C</strong></p>
                              <p className="text-slate-600 dark:text-slate-400">Sensação: <strong className="text-slate-800 dark:text-slate-100">{msg.weatherData.feelsLike}°C</strong></p>
                              <p className="text-slate-600 dark:text-slate-400">Umidade: <strong className="text-slate-800 dark:text-slate-100">{msg.weatherData.humidity}%</strong></p>
                              <p className="text-slate-600 dark:text-slate-400">Vento: <strong className="text-slate-800 dark:text-slate-100">{msg.weatherData.windSpeed} km/h</strong></p>
                            </div>
                            <div className="mt-2 bg-white/80 dark:bg-slate-800/80 p-1.5 rounded-lg text-[11px] flex justify-between border border-blue-100 dark:border-slate-700">
                              <span className="text-slate-500">Hoje:</span>
                              <span className="font-bold">{msg.weatherData.todayMin}°C — {msg.weatherData.todayMax}°C</span>
                            </div>
                          </div>
                        )}

                        {/* Cards de Lugares */}
                        {msg.component === "places" && msg.placesData && (
                          <div className="space-y-2">
                            {msg.placesData.map((place) => (
                              <div key={place.id} className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden shadow-sm flex">
                                <div className="w-20 h-20 flex-shrink-0 overflow-hidden bg-slate-100">
                                  <img src={place.imageUrl} alt={place.name} className="w-full h-full object-cover" />
                                </div>
                                <div className="p-2 flex-1">
                                  <div className="flex justify-between items-start">
                                    <p className="font-bold text-[11px] text-slate-800 dark:text-slate-100 leading-tight">{place.name}</p>
                                    <span className="text-amber-500 font-bold text-[10px]">★ {place.rating}</span>
                                  </div>
                                  <p className="text-[10px] text-slate-500 mt-0.5">{place.categoryLabel} • {place.priceRange}</p>
                                  <p className="text-[10px] text-slate-500">📍 {place.distanceKm || 1.2} km</p>
                                  <a href={place.mapsUrl} target="_blank" rel="noopener noreferrer" className="mt-1 inline-flex items-center gap-1 text-[10px] text-emerald-600 font-bold hover:underline">
                                    <Navigation className="w-3 h-3" /> Ver no mapa
                                  </a>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Card de Roteiro + PDF */}
                        {msg.component === "itinerary" && msg.itineraryData && (
                          <div className="bg-emerald-50 dark:bg-slate-800 border border-emerald-200 dark:border-slate-700 rounded-xl p-3 shadow-sm space-y-2">
                            <p className="font-bold text-[11px] text-emerald-800 dark:text-emerald-300 uppercase tracking-wider">
                              🗺️ Roteiro Maya AI — {msg.itineraryData.destination}
                            </p>
                            {msg.itineraryData.days.map((day: any, dIdx: number) => (
                              <div key={dIdx} className="bg-white dark:bg-slate-900 p-2 rounded-lg border border-emerald-100 dark:border-slate-700 text-[11px]">
                                <p className="font-bold text-emerald-700 mb-1">Dia {day.dayNumber}: {day.title}</p>
                                <ul className="space-y-0.5 text-slate-600 dark:text-slate-300">
                                  {day.activities.map((act: string, aIdx: number) => (
                                    <li key={aIdx} className="flex items-start gap-1">
                                      <CheckCircle className="w-3 h-3 text-emerald-500 mt-0.5 flex-shrink-0" />
                                      {act}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            ))}
                            <button
                              onClick={() => generateMayaTravelPDF(msg.itineraryData!)}
                              className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] rounded-lg flex items-center justify-center gap-1.5 transition-colors"
                            >
                              <FileDown className="w-3.5 h-3.5" /> Criar Guia em PDF
                            </button>
                          </div>
                        )}

                        {/* Card de Orçamento */}
                        {msg.component === "budget" && msg.budgetData && (
                          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-3 shadow-sm">
                            <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-700 pb-1.5 mb-2">
                              <p className="font-bold text-[11px] text-slate-800 dark:text-slate-100">💰 Estimativa de Orçamento</p>
                              <span className="text-emerald-600 font-black text-xs">{msg.budgetData.total}</span>
                            </div>
                            <div className="space-y-1">
                              {msg.budgetData.categories?.map((cat: any, idx: number) => (
                                <div key={idx} className="flex justify-between text-[11px] p-1.5 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                                  <span className="text-slate-600 dark:text-slate-300">{cat.name}</span>
                                  <span className="font-bold text-slate-800 dark:text-slate-100">{cat.amount}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Card de Fontes */}
                        {msg.component === "sources" && msg.sourcesData && msg.sourcesData.length > 0 && (
                          <div className="bg-slate-100 dark:bg-slate-800/80 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700">
                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Fontes consultadas agora:</p>
                            <div className="space-y-1">
                              {msg.sourcesData.map((src: any, idx: number) => (
                                <a key={idx} href={src.url} target="_blank" rel="noopener noreferrer"
                                  className="flex items-center gap-1 text-[11px] text-emerald-700 dark:text-emerald-400 font-semibold hover:underline">
                                  <ExternalLink className="w-3 h-3 flex-shrink-0" />
                                  <span className="truncate">{src.title}</span>
                                </a>
                              ))}
                            </div>
                          </div>
                        )}

                        <span className={`text-[10px] text-slate-400 mt-1 ${msg.from === "user" ? "text-right mr-1" : "ml-1"}`}>
                          {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Loading / Status */}
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="flex items-end gap-2 max-w-[85%]">
                      <div className="w-6 h-6 min-w-[24px] rounded-full bg-emerald-100 flex items-center justify-center overflow-hidden">
                        <img src={assetPath('/maya-avatar.png')} alt="Maya" className="w-full h-full object-cover" />
                      </div>
                      <div className="bg-white dark:bg-slate-900 border border-slate-100 px-4 py-3 rounded-2xl rounded-bl-sm shadow-sm flex items-center gap-1.5 min-w-[120px]">
                        <Bot className="w-4 h-4 text-emerald-500 animate-spin" />
                        <span className="text-[12px] text-slate-500">{statusText || "Pesquisando..."}</span>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </div>

            {/* ── BARRA WHATSAPP ───────────────────────────────────── */}
            {messageCount >= 1 && (
              <div className="px-3 py-2 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-t border-green-200/50 dark:border-green-800/30">
                <button
                  onClick={openWhatsAppHuman}
                  className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-xl bg-green-600 hover:bg-green-700 text-white font-bold text-sm transition-all hover:scale-[1.02] active:scale-[0.98] shadow-md shadow-green-600/20"
                >
                  <Phone className="w-4 h-4" />
                  Falar com Humano via WhatsApp
                  <User className="w-4 h-4" />
                </button>
                <p className="text-[10px] text-center text-green-700/60 dark:text-green-400/40 mt-1 font-medium">
                  A conversa com a Maya será enviada ao atendente
                </p>
              </div>
            )}

            {/* ── INPUT AREA ───────────────────────────────────────── */}
            <div className="p-3 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100">
              <div className="relative flex items-center gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleUserMessage(inputText)}
                  placeholder={isSpeaking ? "Maya está falando..." : "Digite sua mensagem..."}
                  disabled={isSpeaking || isTyping}
                  className="w-full pl-4 pr-20 py-3 bg-white dark:bg-slate-900 border border-slate-200 rounded-xl outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 shadow-sm text-[15px] transition-all disabled:opacity-50 disabled:bg-slate-100 dark:disabled:bg-slate-800"
                />
                {voiceEnabled && (
                  <button
                    onClick={toggleVoice}
                    className={`absolute right-12 p-2 rounded-lg transition-colors ${isListening ? 'text-red-500 bg-red-50 animate-pulse' : 'text-slate-400 hover:text-emerald-500 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
                    disabled={isSpeaking}
                  >
                    {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                  </button>
                )}
                <button
                  onClick={() => handleUserMessage(inputText)}
                  disabled={!inputText.trim() || isTyping || isSpeaking}
                  className="absolute right-2 p-2 rounded-lg bg-emerald-600 text-white disabled:bg-slate-200 disabled:text-slate-400 hover:bg-emerald-700 transition-colors"
                >
                  {isTyping ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                </button>
              </div>
              <div className="mt-2 flex items-center justify-between px-1">
                <span className="text-[9px] text-slate-300 font-bold tracking-widest uppercase flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-emerald-400" /> Maya IA · Clima Real · Pesquisa Web
                </span>
                <span className="text-[9px] text-slate-300 font-bold tracking-widest uppercase">Descubra o Brasil</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
