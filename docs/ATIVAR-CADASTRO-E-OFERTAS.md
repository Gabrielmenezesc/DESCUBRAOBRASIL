# Ativar cadastro, Google e ofertas

O app funciona sem conta e salva progresso no navegador. Para ativar sincronização e propostas de empresas:

1. Crie um projeto em https://supabase.com.
2. Abra o SQL Editor e execute `supabase/schema.sql`.
3. Em Authentication > URL Configuration, use `https://gabrielmenezesc.github.io/DESCUBRAOBRASIL/app/index.html` como Site URL e redirect URL.
4. Copie `public/app/config.example.json` para `public/app/config.json` e preencha apenas a Project URL e a chave `anon` pública.
5. Para Google, configure o provedor no Supabase, adicione o callback indicado pelo painel ao Google Cloud e altere `googleEnabled` para `true`.
6. Analise propostas na tabela `tourism_offers`. Somente mude `status` para `approved` depois de verificar empresa, preços, validade, fonte e canal de contato.

Chaves secretas, especialmente `service_role`, não podem entrar no repositório. O fluxo por e-mail pode ser ativado sem Google.

## Ativar a Maya com IA

1. Confirme que a chave pertence à Groq e começa com `gsk_`.
2. No Supabase CLI, execute `supabase secrets set GROQ_API_KEY=SUA_CHAVE`.
3. Publique a função com `supabase functions deploy maya --no-verify-jwt`.
4. Informe a URL da função no campo `mayaProxyUrl` de `public/app/config.json`.

A chave fica no servidor. Nunca use uma chave de IA em variável `NEXT_PUBLIC_` ou diretamente no JavaScript do navegador.
