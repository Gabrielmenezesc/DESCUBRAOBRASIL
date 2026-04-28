"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, Mic, MicOff, Loader2, Sparkles, Volume2, VolumeX, Bot } from "lucide-react";
import { askGemini, addToChatHistory, resetChatHistory, isGeminiAvailable } from "@/lib/gemini";
import ReactMarkdown from "react-markdown";

const WHATSAPP_NUMBER = "5538991621135";
const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=`;

interface Message {
  from: "maya" | "user";
  text: string;
  timestamp: Date;
  isAI?: boolean;
}

export default function MayaChat() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
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

  // ── Proactive greeting ─────────────────────────────
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

  // ── Scroll ──────────────────────────────────────────────────
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ── Handlers ────────────────────────────────────────────────
  function addMayaMessage(text: string) {
    setMessages(prev => [...prev, {
      from: "maya",
      text,
      timestamp: new Date(),
      isAI: true,
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
      const greeting = "Olá ✨ Sou Maya.\n\nSua especialista em turismo no Brasil.\nPara onde vamos hoje?";
      
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

  async function handleUserMessage(text: string) {
    if (!text.trim()) return;

    // Add user message
    const um: Message = { from: "user", text, timestamp: new Date() };
    setMessages(prev => [...prev, um]);
    addToChatHistory("user", text);
    setInputText("");
    setIsTyping(true);

    // Call Groq / AI API directly for everything
    const aiResponse = await askGemini(text);

    if (aiResponse) {
      setIsTyping(false);
      addMayaMessage(aiResponse);
    } else {
      setIsTyping(false);
      addMayaMessage("Eita, minhas engrenagens deram uma travadinha aqui no servidor. 😅 Você pode tentar de novo ou [falar com nossos especialistas no WhatsApp](https://wa.me/5538991621135?text=Ol%C3%A1%2C%20falei%20com%20a%20Maya%20e%20deu%20erro).");
    }
  }

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
                    <img src="/logo-descubra.png" alt="Maya Avatar" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-slate-800 dark:text-slate-100">Maya</h4>
                    <p className="text-xs text-slate-600 dark:text-slate-300 font-medium">Bora planejar sua viagem das férias? ✈️</p>
                  </div>
                </div>
              </motion.div>
            )}

            <motion.button
              onClick={openChat}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`w-14 h-14 bg-emerald-600 rounded-full flex items-center justify-center text-white shadow-lg relative group ${pulseButton ? 'animate-[pulse-glow_2s_infinite]' : ''}`}
              aria-label="Fale com a Maya"
            >
              <div className="absolute inset-0 bg-emerald-400 rounded-full opacity-0 group-hover:opacity-20 blur-md transition-opacity"></div>
              <Sparkles className="w-6 h-6 absolute text-emerald-200/50 -top-1 -right-1 opacity-0 group-hover:opacity-100 transition-all group-hover:rotate-12 group-hover:scale-110" />
              <img src="/logo-descubra.png" alt="Maya" className="w-10 h-10 object-cover rounded-full" />
              <span className="absolute -top-1 -right-1 flex h-4 w-4">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500 border-2 border-white"></span>
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

      {/* Janela de Chat */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="fixed bottom-4 right-4 z-[9999] w-full max-w-[calc(100vw-2rem)] sm:max-w-[400px] bg-white dark:bg-slate-900 rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-slate-100"
            style={{ maxHeight: 'min(700px, calc(100vh - 2rem))', height: '600px' }}
            id="maya-chat-window"
          >
            {/* Header */}
            <div className="bg-emerald-600 p-4 flex items-center justify-between shadow-md relative z-10">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-white dark:bg-slate-900 flex items-center justify-center p-0.5 shadow-inner">
                    <img src="/logo-descubra.png" alt="Maya" className="w-full h-full object-cover rounded-full" />
                  </div>
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-emerald-600"></div>
                </div>
                <div>
                  <h3 className="font-bold text-white leading-tight flex items-center gap-1.5">
                    Maya — Guia IA
                  </h3>
                  <span className="text-emerald-100 text-[10px] sm:text-xs font-semibold tracking-wider uppercase flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span>
                    Online Agora
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={toggleVoiceEnabled}
                  className={`p-1.5 rounded-lg transition-colors ${voiceEnabled ? 'bg-emerald-500/50 text-white' : 'hover:bg-emerald-500/30 text-emerald-100'}`}
                  title={voiceEnabled ? "Mudo" : "Ativar Voz"}
                >
                  {voiceEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4 text-emerald-200" />}
                </button>
                <button onClick={() => setOpen(false)} className="p-1.5 hover:bg-emerald-500/50 rounded-lg transition-colors text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 bg-slate-50/50">
              <div className="flex flex-col gap-4">
                {messages.map((msg, i) => (
                  <div key={i} className={`flex ${msg.from === "user" ? "justify-end" : "justify-start"}`}>
                    <div className="flex items-end gap-2 max-w-[85%]">
                      {msg.from === "maya" && (
                        <div className="w-6 h-6 min-w-[24px] rounded-full bg-emerald-100 border border-emerald-200 flex-shrink-0 flex items-center justify-center overflow-hidden shadow-sm">
                          <img src="/logo-descubra.png" alt="Maya" className="w-full h-full object-cover" />
                        </div>
                      )}
                      <div className="flex flex-col">
                        {msg.from === "maya" && msg.isAI && (
                          <div className="flex items-center gap-1 text-[10px] text-blue-600 font-medium ml-1 mb-1 bg-blue-50 px-1.5 py-0.5 rounded-full w-fit border border-blue-100 self-start">
                            <Bot className="w-3 h-3" /> IA da Maya
                          </div>
                        )}
                        <div
                          className={`px-4 py-2.5 rounded-2xl text-[14px] sm:text-[15px] leading-relaxed shadow-sm ${
                            msg.from === "user"
                              ? "bg-slate-800 text-white rounded-br-sm"
                              : msg.isAI
                                ? "bg-blue-50 text-slate-800 dark:text-slate-100 border-l-4 border-l-blue-400 rounded-bl-sm"
                                : "bg-white dark:bg-slate-900 border border-slate-100 text-slate-700 dark:text-slate-200 rounded-bl-sm"
                          }`}
                        >
                          {msg.from === "maya" ? (
                            <ReactMarkdown
                              components={{
                                a: ({ node, ...props }) => <a {...props} className="text-emerald-600 font-semibold hover:underline" target="_blank" rel="noopener noreferrer" />,
                                p: ({ node, ...props }) => <p {...props} className="mb-2 last:mb-0" />,
                                strong: ({ node, ...props }) => <strong {...props} className="font-bold text-emerald-800" />,
                                ul: ({ node, ...props }) => <ul {...props} className="list-disc pl-4 my-2 space-y-1" />
                              }}
                            >
                              {msg.text}
                            </ReactMarkdown>
                          ) : (
                            msg.text
                          )}
                        </div>
                        <span className={`text-[10px] text-slate-400 mt-1 ${msg.from === "user" ? "text-right mr-1" : "ml-1"}`}>
                          {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Loading indicator */}
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="flex items-end gap-2 max-w-[85%]">
                      <div className="w-6 h-6 min-w-[24px] rounded-full bg-emerald-100 flex items-center justify-center overflow-hidden">
                        <img src="/logo-descubra.png" alt="Maya" className="w-full h-full object-cover" />
                      </div>
                      <div className="bg-white dark:bg-slate-900 border text-center border-slate-100 px-4 py-3 rounded-2xl rounded-bl-sm shadow-sm flex items-center gap-1.5 min-w-[100px]">
                        <Bot className="w-4 h-4 text-emerald-500 animate-pulse" />
                        <span className="flex gap-0.5">
                          <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                          <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                          <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce"></span>
                        </span>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </div>

            {/* Input Area */}
            <div className="p-3 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100">
              <div className="relative flex items-center gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleUserMessage(inputText)}
                  placeholder={isSpeaking ? "Maya testá falando..." : "Digite sua mensagem..."}
                  disabled={isSpeaking || isTyping}
                  className="w-full pl-4 pr-12 py-3 bg-white dark:bg-slate-900 border border-slate-200 rounded-xl outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 shadow-sm text-[15px] transition-all disabled:opacity-50 disabled:bg-slate-100 dark:bg-slate-800"
                />
                
                {voiceEnabled && (
                  <button
                    onClick={toggleVoice}
                    className={`absolute right-12 p-2 rounded-lg transition-colors ${isListening ? 'text-red-500 bg-red-50 animate-pulse' : 'text-slate-400 hover:text-emerald-500 hover:bg-slate-100 dark:bg-slate-800'}`}
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
              <div className="mt-2 flex items-center justify-end px-1">
                <span className="text-[9px] text-slate-300 font-bold tracking-widest uppercase">Inteligência Artificial Llama 3</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
