import {escapeHTML as escape, safeURL} from './core.mjs';

export async function requestMaya(config, question, history, context, fetcher=fetch) {
  // Primeiro tenta a função avançada do Supabase. Se ela estiver indisponível
  // ou com CORS pendente, usa o serviço já publicado, sem expor chaves no app.
  if (config.mayaProxyUrl && config.supabaseKey) {
    try {
      const response = await fetcher(config.mayaProxyUrl, {
        method:'POST', signal:AbortSignal.timeout(55000),
        headers:{'content-type':'application/json',apikey:config.supabaseKey,authorization:`Bearer ${config.supabaseKey}`},
        body:JSON.stringify({question,history:history.slice(-8),context,search:true}),
      });
      const data=await response.json();
      if (response.ok && typeof data.answer==='string' && data.answer.trim()) return data;
      if (response.status===429) throw new Error('A Maya recebeu muitas perguntas. Aguarde um minuto e tente novamente.');
    } catch (error) {
      if (error?.message?.includes('muitas perguntas')) throw error;
    }
  }
  const endpoint=config.mayaChatApiUrl||'https://descubraobrasil-api.onrender.com/api/chat';
  const response=await fetcher(endpoint,{
    method:'POST',signal:AbortSignal.timeout(55000),
    headers:{'content-type':'application/json'},
    body:JSON.stringify({pergunta:question}),
  });
  const data=await response.json();
  const answer=typeof data.answer==='string'?data.answer:data.resposta;
  if(!response.ok||typeof answer!=='string'||!answer.trim()){
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
  root.innerHTML=`<section class="panel maya-box"><div class="maya-heading"><span class="maya-avatar"><img src="maya-avatar.png" alt="Retrato da Maya, assistente virtual de viagens" onerror="this.src='maya-avatar.webp'"></span><div><span class="eyebrow">Inteligência para sua viagem</span><h2>Olá, eu sou a Maya.</h2></div><span class="tag maya-online">Disponível</span></div><p>Da primeira ideia ao roteiro. Conte para onde quer ir, quantos dias tem e o que gosta de fazer. Eu respondo por texto e também posso falar a resposta.</p><div class="maya-suggestions"><button data-question="Monte um roteiro de dois dias em Brasília com crianças">Viajar em família</button><button data-question="Quais destinos de praia no Brasil combinam com uma viagem econômica?">Encontrar um destino</button><button data-question="Pesquise notícias recentes sobre turismo no Brasil e indique as fontes">Pesquisar notícias</button></div><div class="maya-messages" role="log" aria-live="polite" aria-label="Conversa com a Maya"></div><form class="maya-form"><label class="sr-only" for="maya-question">Sua pergunta para Maya</label><textarea id="maya-question" name="question" required minlength="3" maxlength="1500" rows="2" placeholder="Ex.: quero viajar em outubro, saindo de Brasília. O que você sugere?"></textarea><button class="primary" type="submit">Enviar pergunta</button></form><label class="maya-voice-choice"><input type="checkbox" id="maya-auto-voice" checked> Ouvir automaticamente a resposta da Maya</label><p class="maya-status" role="status"></p><p class="source">Respostas geradas por IA. Quando houver pesquisa online, as fontes aparecem abaixo da resposta. Confirme valores e disponibilidade antes de reservar.</p></section>`;
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
      history.push({role:'user',text:question},{role:'model',text:data.answer});
      const sources=Array.isArray(data.sources)?data.sources.filter(s=>safeURL(s.url)).slice(0,8):[];
      messages.insertAdjacentHTML('beforeend',`<div class="maya-message"><span class="eyebrow">Maya</span><div>${renderMayaText(data.answer)}</div><button type="button" class="maya-speak">Ouvir resposta</button>${sources.length?`<div class="maya-sources"><strong>Fontes da pesquisa</strong>${sources.map(s=>`<a href="${escape(safeURL(s.url))}" target="_blank" rel="noopener noreferrer">${escape(s.title||'Consultar fonte')}</a>`).join('')}</div>`:''}</div>`);
      const speakButton=messages.lastElementChild.querySelector('.maya-speak');speakButton.onclick=()=>speak(data.answer,speakButton);if(root.querySelector('#maya-auto-voice').checked)speak(data.answer,speakButton);
      if(data.searchSuggestions){const frame=document.createElement('iframe');frame.title='Sugestões da pesquisa Google';frame.setAttribute('sandbox','allow-popups allow-popups-to-escape-sandbox');frame.srcdoc=data.searchSuggestions;frame.className='maya-search-suggestions';messages.append(frame);}
      status.textContent=sources.length?'Resposta com pesquisa online. Consulte as fontes acima.':'Resposta gerada por IA, sem fontes online nesta consulta.';
      input.value='';
    }catch(error){if(root.isConnected)status.textContent=error.name==='TimeoutError'?'A resposta demorou mais que o esperado. Sua pergunta foi mantida para tentar novamente.':error.message;}
    finally{busy=false;if(root.isConnected){input.disabled=false;root.querySelectorAll('button').forEach(b=>b.disabled=false);messages.scrollTop=messages.scrollHeight;input.focus();}}
  };
  form.onsubmit=event=>{event.preventDefault();send(input.value);};
  root.querySelectorAll('[data-question]').forEach(button=>button.onclick=()=>{input.value=button.dataset.question;send(input.value);});
}
