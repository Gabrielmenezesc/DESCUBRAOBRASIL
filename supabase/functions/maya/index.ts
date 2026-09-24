const cors = {
  'access-control-allow-origin': 'https://gabrielmenezesc.github.io',
  'access-control-allow-headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async request => {
  if (request.method === 'OPTIONS') return new Response('ok', { headers: cors });
  try {
    const { question, context } = await request.json();
    if (typeof question !== 'string' || question.trim().length < 3 || question.length > 500) {
      return Response.json({ error: 'Pergunta inválida.' }, { status: 400, headers: cors });
    }
    const key = Deno.env.get('GEMINI_API_KEY');
    if (!key) return Response.json({ error: 'IA não configurada.' }, { status: 503, headers: cors });
    const prompt = `Você é Maya, assistente profissional do Descubra o Brasil. Responda somente sobre turismo no Brasil em português claro, sem emojis, em até 180 palavras. Não invente preços, horários, descontos, segurança ou parcerias. Oriente o viajante a confirmar dados em fontes oficiais. Ajude a explorar destinos e faça uma pergunta curta para refinar período, origem, grupo ou orçamento quando necessário. Contexto editorial: ${JSON.stringify(context).slice(0,12000)}`;
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=${encodeURIComponent(key)}`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ systemInstruction: { parts: [{ text: prompt }] }, contents: [{ role: 'user', parts: [{ text: question.trim() }] }], generationConfig: { temperature: 0.45, maxOutputTokens: 700 } }),
    });
    if (!response.ok) return Response.json({ error: 'Serviço de IA indisponível.' }, { status: 502, headers: cors });
    const data = await response.json();
    const answer = data.candidates?.[0]?.content?.parts?.map((part: { text?: string }) => part.text || '').join('').trim();
    if (!answer) throw new Error('Resposta vazia');
    return Response.json({ answer }, { headers: { ...cors, 'cache-control': 'no-store' } });
  } catch {
    return Response.json({ error: 'Não foi possível responder.' }, { status: 500, headers: cors });
  }
});
