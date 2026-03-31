/**
 * Descubra o Brasil - Maya Voice Engine v2
 * Fluxo Conversacional Contínuo (Gemini Style)
 */

const MAYA_API_URL = "/api/maya"; // Endpoint do Backend
let recognition = null;
let synthesis = window.speechSynthesis;
let isMayaSpeaking = false;
let isListening = false;
let continuousMode = false;
let voiceEnabled = false; // VOZ DESATIVADA por padrão — só ativa quando o usuário quiser

/* ── Initialization ────────────────────────────────────────── */

function initRecognition() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
        console.warn("[MayaVoice] Web Speech API não suportada.");
        return null;
    }

    const rec = new SpeechRecognition();
    rec.lang = 'pt-BR';
    rec.continuous = false;
    rec.interimResults = false;

    rec.onstart = () => {
        isListening = true;
        updateUIState('listening');
    };

    rec.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        console.log("[MayaVoice] Ouvido:", transcript);
        
        // Exibe no chat
        if (window.appendMayaMsg) appendMayaMsg(transcript, 'user');
        
        // Envia para IA
        sendToMayaIA(transcript);
    };

    rec.onerror = (event) => {
        console.error("[MayaVoice] Erro:", event.error);
        stopListening();
        if (event.error !== 'no-speech' && continuousMode) {
            setTimeout(startListening, 1000); // Tenta retomar se for loop
        }
    };

    rec.onend = () => {
        isListening = false;
        if (!isMayaSpeaking && continuousMode) {
            // Se parou de ouvir e ela não está falando, volta a ouvir
            startListening();
        } else {
            updateUIState('idle');
        }
    };

    return rec;
}

/* ── Actions ────────────────────────────────────────────────── */

function startListening() {
    if (isMayaSpeaking) return; // Não ouve enquanto fala
    if (!recognition) recognition = initRecognition();
    if (!recognition) return;

    try {
        recognition.start();
    } catch (e) {
        // Já iniciado
    }
}

function stopListening() {
    if (recognition) recognition.stop();
    updateUIState('idle');
}

function toggleContinuousVoice() {
    continuousMode = !continuousMode;
    voiceEnabled = continuousMode; // Ativar/desativar voz junto com o microfone
    const btn = document.getElementById('maya-mic-btn');
    
    if (continuousMode) {
        btn.classList.add('active');
        startListening();
        if (window.appendMayaMsg) appendMayaMsg("🎙️ Voz ativada. Pode falar comigo!", "ai");
    } else {
        btn.classList.remove('active');
        stopListening();
        synthesis.cancel(); // Para qualquer fala em andamento
        isMayaSpeaking = false;
        if (window.appendMayaMsg) appendMayaMsg("🔇 Voz desativada.", "ai");
    }
}

async function sendToMayaIA(text) {
    updateUIState('thinking');
    
    try {
        // Simulando chamada para API (Substituir pelo fetch real para seu backend)
        // const res = await fetch(MAYA_API_URL, { method: 'POST', ... });
        // const data = await res.json();
        
        // Mock de resposta para demonstração do fluxo
        setTimeout(() => {
            const mockResponse = {
                fala: "Entendi perfeitamente! O Brasil tem lugares incríveis para você descobrir. O que mais gostaria de saber?",
                acao: "falar",
                destino: ""
            };
            handleMayaResponse(mockResponse);
        }, 1500);

    } catch (err) {
        console.error("[MayaVoice] Erro na IA:", err);
        updateUIState('idle');
    }
}

function handleMayaResponse(data) {
    const { fala, acao, destino } = data;
    
    // 1. Exibe no chat
    if (window.appendMayaMsg) appendMayaMsg(fala, 'ai');

    // 2. Maya Fala
    mayaSpeak(fala);

    // 3. Executa Ação (se houver)
    if (acao && window.executeMayaAction) {
        executeMayaAction(acao, destino);
    }
}

function mayaSpeak(text) {
    // Só fala se o usuário ativou a voz
    if (!voiceEnabled || !synthesis) return;
    
    synthesis.cancel(); // Para qualquer fala anterior
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'pt-BR';
    utterance.rate = 1.1;

    utterance.onstart = () => {
        isMayaSpeaking = true;
        isListening = false;
        if (recognition) recognition.stop();
        updateUIState('speaking');
    };

    utterance.onend = () => {
        isMayaSpeaking = false;
        updateUIState('idle');
        
        if (continuousMode) {
            setTimeout(startListening, 500);
        }
    };

    synthesis.speak(utterance);
}

/* ── UI Logic ──────────────────────────────────────────────── */

function updateUIState(state) {
    const chat = document.getElementById('maya-chat');
    const fab = document.getElementById('maya-fab-btn');
    
    // Remove todos os estados
    [chat, fab].forEach(el => {
        if (!el) return;
        el.classList.remove('maya-listening', 'maya-thinking', 'maya-speaking');
    });

    if (state === 'listening') {
        chat?.classList.add('maya-listening');
        fab?.classList.add('maya-listening');
    } else if (state === 'thinking') {
        chat?.classList.add('maya-thinking');
        fab?.classList.add('maya-thinking');
    } else if (state === 'speaking') {
        chat?.classList.add('maya-speaking');
        fab?.classList.add('maya-speaking');
    }
}

/* ── Event Listeners ───────────────────────────────────────── */

document.addEventListener('DOMContentLoaded', () => {
    const micBtn = document.getElementById('maya-mic-btn');
    if (micBtn) {
        micBtn.onclick = (e) => {
            e.stopPropagation();
            toggleContinuousVoice();
        };
    }
});
