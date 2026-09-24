# Ativar cadastro, Google e ofertas

O app funciona sem conta e salva progresso no navegador. Para ativar sincronização e propostas de empresas:

1. Crie um projeto em https://supabase.com.
2. Abra o SQL Editor e execute `supabase/schema.sql`.
3. Em Authentication > URL Configuration, use `https://gabrielmenezesc.github.io/DESCUBRAOBRASIL/app/index.html` como Site URL e redirect URL.
4. Copie `public/app/config.example.json` para `public/app/config.json` e preencha apenas a Project URL e a chave `anon` pública.
5. Para Google, configure o provedor no Supabase, adicione o callback indicado pelo painel ao Google Cloud e altere `googleEnabled` para `true`.
6. Analise propostas na tabela `tourism_offers`. Somente mude `status` para `approved` depois de verificar empresa, preços, validade, fonte e canal de contato.

Chaves secretas, especialmente `service_role`, não podem entrar no repositório. O fluxo por e-mail pode ser ativado sem Google.
