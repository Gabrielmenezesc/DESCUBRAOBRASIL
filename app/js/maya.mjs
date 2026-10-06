import {escapeHTML as escape, safeURL} from './core.mjs';

// Contrato da Maya para respostas que podem controlar o Guia Brasil 3D.
const MAYA_MAP_SYSTEM=`Você é Maya, guia turística virtual do Descubra o Brasil. Responda em no máximo 3 frases curtas, em pt-BR, guiando o usuário para o mapa. Quando o pedido envolver lugar, cidade, clima ou filtro, responda somente JSON válido com voz_texto, avatar_animacao (idle|pointing|happy|thinking|greeting), mapa_comando (acao, coordenadas, zoom_level, aplicar_filtro), ui_painel_clima e ui_card_sugestao. Nunca invente preço, clima ou coordenada; quando faltar dado, mantenha o mapa.`;
function parseMapAnswer(answer){const text=String(answer||'');const start=text.indexOf('{');const end=text.indexOf('\n\nNão consegui',start);const candidate=start<0?'':text.slice(start,end<0?text.lastIndexOf('}')+1:end);try{const v=JSON.parse(candidate);if(v&&typeof v.voz_texto==='string')return v;}catch{}return null;}

export async function requestMaya(config, question, history, context, fetcher=fetch) {
  // A chave do provedor fica no servidor: o app chama somente a API pública segura.
  const endpoint=config.mayaChatApiUrl||'https://descubraobrasil-api.onrender.com/api/chat';
  const response = await fetcher(endpoint, {
    method:'POST', signal:AbortSignal.timeout(55000),
    headers:{'content-type':'application/json'},
    body:JSON.stringify({pergunta:question}),
  });
  const data=await response.json();
  const answer=typeof data.answer==='string'?data.answer:data.resposta;
  if (!response.ok || typeof answer!=='string' || !answer.trim()) {
    throw new Error(response.status===429?'A Maya recebeu muitas perguntas. Aguarde um minuto e tente novamente.':'A Maya está temporariamente indisponível. Tente novamente em alguns instantes.');
  }
  const rawSources=Array.isArray(data.sources)?data.sources:(Array.isArray(data.fontes)?data.fontes:[]);
  return {answer:answer.trim(),sources:rawSources.map(source=>typeof source==='string'?{url:source,title:'Consultar fonte'}:source)};
}

export async function requestMayaSpeech(config, text, fetcher=fetch) {
  if (!config.mayaProxyUrl || !config.supabaseKey) throw new Error('A voz da Maya ainda não está configurada.');
  const response = await fetcher(config.mayaProxyUrl, {
    method:'POST', signal:AbortSignal.timeout(55000),
    headers:{'content-type':'application/json',apikey:config.supabaseKey,authorization:`Bearer ${config.supabaseKey}`},
    body:JSON.stringify({action:'speech',text:String(text).slice(0,3000)}),
  });
  if (!response.ok) throw new Error('Não foi possível reproduzir a voz da Maya agora.');
  return response.blob();
}

export function renderMayaText(text) {
  return escape(text).replace(/\*\*([^*]+)\*\*/g,'<strong>$1</strong>').replace(/\n/g,'<br>');
}

export function mountMaya(root,{config,getContext}) {
  const history=[];
  let busy=false, audio=null, audioUrl='';
  root.innerHTML=`<section class="panel maya-box maya-experience"><div class="maya-heading"><span class="maya-avatar"><img src="../maya-avatar.webp" alt="Maya, assistente virtual de viagens"></span><div><span class="eyebrow">Maya · sua assistente de viagem</span><h2>Planeje sua próxima viagem pelo Brasil</h2></div><span class="tag maya-online"><i aria-hidden="true"></i> Online</span></div><p class="maya-lead">Conte para onde quer ir, quantos dias tem e o que gosta de fazer. Eu preparo ideias de roteiro e dicas para você.</p><div class="maya-suggestions" aria-label="Sugestões rápidas"><button data-question="Monte um roteiro de dois dias em Brasília com crianças"><span aria-hidden="true">✈</span> Montar um roteiro</button><button data-question="Quais destinos de praia no Brasil combinam com uma viagem econômica?"><span aria-hidden="true">⌖</span> Encontrar um destino</button><button data-question="Quais são as principais novidades do turismo no Brasil?"><span aria-hidden="true">▤</span> Notícias e dicas</button></div><div class="maya-contact-actions" aria-label="Canais de atendimento"><a class="maya-whatsapp" href="https://wa.me/5561985630128?text=Ol%C3%A1%21%20Quero%20montar%20um%20roteiro%20e%20pedir%20um%20or%C3%A7amento." target="_blank" rel="noopener noreferrer">WhatsApp · orçamento</a><a class="maya-instagram" href="https://www.instagram.com/descubrabrasiloficial/" target="_blank" rel="noopener noreferrer">Instagram</a></div><div class="maya-messages" role="log" aria-live="polite" aria-label="Conversa com a Maya"></div><form class="maya-form"><label class="sr-only" for="maya-question">Sua pergunta para Maya</label><textarea id="maya-question" name="question" required minlength="3" maxlength="1500" rows="2" placeholder="Digite sua mensagem para a Maya…"></textarea><button class="primary maya-send" type="submit" aria-label="Enviar pergunta para Maya">➤</button></form><label class="maya-voice-choice"><input type="checkbox" id="maya-auto-voice" checked> Ouvir a resposta</label><p class="maya-status" role="status"></p><p class="source">A Maya pode cometer erros. Confirme detalhes importantes diretamente com o local antes de viajar.</p></section>`;
  const form=root.querySelector('form'),input=root.querySelector('textarea'),messages=root.querySelector('.maya-messages'),status=root.querySelector('.maya-status');
  const speak=async(text,button)=>{try{button.disabled=true;button.textContent='Preparando voz...';if(audio){audio.pause();audio=null;}if(audioUrl)URL.revokeObjectURL(audioUrl);const blob=await requestMayaSpeech(config,text);audioUrl=URL.createObjectURL(blob);audio=new Audio(audioUrl);audio.onended=()=>{button.textContent='Ouvir resposta';button.disabled=false;};audio.onerror=()=>{button.textContent='Ouvir resposta';button.disabled=false;status.textContent='Não foi possível reproduzir o áudio.';};await audio.play();button.textContent='Pausar voz';button.disabled=false;button.onclick=()=>{if(!audio)return;if(audio.paused){audio.play();button.textContent='Pausar voz';}else{audio.pause();button.textContent='Continuar voz';}};}catch{button.disabled=false;if('speechSynthesis' in window){speechSynthesis.cancel();const utterance=new SpeechSynthesisUtterance(text);utterance.lang='pt-BR';utterance.rate=.96;utterance.pitch=1.02;const voices=speechSynthesis.getVoices();utterance.voice=voices.find(v=>v.lang.toLowerCase()==='pt-br'&&/female|francisca|maria|luciana/i.test(v.name))||voices.find(v=>v.lang.toLowerCase().startsWith('pt'))||null;utterance.onend=()=>{button.textContent='Ouvir resposta';};speechSynthesis.speak(utterance);button.textContent='Parar voz';button.onclick=()=>{speechSynthesis.cancel();button.textContent='Ouvir resposta';};status.textContent='Resposta por voz ativada.';}else{button.textContent='Ouvir resposta';status.textContent='A voz não está disponível neste navegador.';}}};
  const send=async question=>{
    question=String(question).trim();if(busy||question.length<3||question.length>1500)return;
    busy=true;
    const previous=history.slice();
    messages.insertAdjacentHTML('beforeend',`<div class="maya-message user">${escape(question)}</div>`);
    root.querySelectorAll('button').forEach(b=>b.disabled=true);input.disabled=true;
    status.textContent='Maya está preparando sua resposta. Isso pode levar alguns segundos.';
    try{
      const data=await requestMaya(config,question,previous,getContext());
      if(!root.isConnected)return;
      const mapAnswer=parseMapAnswer(data.answer);
      const spoken=mapAnswer?.voz_texto||data.answer;
      if(mapAnswer)window.dispatchEvent(new CustomEvent('maya-map-command',{detail:mapAnswer}));
      history.push({role:'user',text:question},{role:'model',text:spoken});
      const quoteText=`Olá! Quero um orçamento para a viagem: ${question}`;
      const quoteLink=`https://wa.me/5561985630128?text=${encodeURIComponent(quoteText)}`;
      messages.insertAdjacentHTML('beforeend',`<div class="maya-message"><span class="eyebrow">Maya</span><div>${renderMayaText(spoken)}</div><div class="maya-answer-actions"><button type="button" class="maya-speak">Ouvir resposta</button><a href="${escape(quoteLink)}" target="_blank" rel="noopener noreferrer">Pedir orçamento</a></div></div>`);
      const speakButton=messages.lastElementChild.querySelector('.maya-speak');speakButton.onclick=()=>speak(spoken,speakButton);if(root.querySelector('#maya-auto-voice').checked)speak(spoken,speakButton);
      if(data.searchSuggestions){const frame=document.createElement('iframe');frame.title='Sugestões da pesquisa Google';frame.setAttribute('sandbox','allow-popups allow-popups-to-escape-sandbox');frame.srcdoc=data.searchSuggestions;frame.className='maya-search-suggestions';messages.append(frame);}
      status.textContent='Resposta da Maya pronta.';
      input.value='';
    }catch(error){if(root.isConnected)status.textContent=error.name==='TimeoutError'?'A resposta demorou mais que o esperado. Sua pergunta foi mantida para tentar novamente.':error.message;}
    finally{busy=false;if(root.isConnected){input.disabled=false;root.querySelectorAll('button').forEach(b=>b.disabled=false);messages.scrollTop=messages.scrollHeight;input.focus();}}
  };
  form.onsubmit=event=>{event.preventDefault();send(input.value);};
  root.querySelectorAll('[data-question]').forEach(button=>button.onclick=()=>{input.value=button.dataset.question;send(input.value);});
  const prefill=sessionStorage.getItem('maya-prefill');
  if(prefill){sessionStorage.removeItem('maya-prefill');input.value=prefill;setTimeout(()=>send(prefill),250);}
}


