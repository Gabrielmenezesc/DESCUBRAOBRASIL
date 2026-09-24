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
    const key = Deno.env.get('GROQ_API_KEY');
    if (!key) return Response.json({ error: 'IA não configurada.' }, { status: 503, headers: cors });
    const prompt = `Você é Maya, assistente profissional do Descubra o Brasil. Responda somente sobre turismo no Brasil em português claro, sem emojis, em até 180 palavras. Não invente preços, horários, descontos, segurança ou parcerias. Oriente o viajante a confirmar dados em fontes oficiais. Ajude a explorar destinos e faça uma pergunta curta para refinar período, origem, grupo ou orçamento quando necessário. Contexto editorial: ${JSON.stringify(context).slice(0,12000)}`;
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: { authorization: `Bearer ${key}`, 'content-type': 'application/json' },
      body: JSON.stringify({ model: 'llama-3.3-70b-versatile', temperature: 0.45, max_tokens: 500, messages: [{ role: 'system', content: prompt }, { role: 'user', content: question.trim() }] }),
    });
    if (!response.ok) return Response.json({ error: 'Serviço de IA indisponível.' }, { status: 502, headers: cors });
    const data = await response.json();
    const answer = data.choices?.[0]?.message?.content;
    if (!answer) throw new Error('Resposta vazia');
    return Response.json({ answer }, { headers: { ...cors, 'cache-control': 'no-store' } });
  } catch {
    return Response.json({ error: 'Não foi possível responder.' }, { status: 500, headers: cors });
  }
});
