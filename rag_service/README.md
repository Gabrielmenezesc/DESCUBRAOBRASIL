# Serviço RAG local

Este serviço mantém `GOOGLE_API_KEY` apenas no ambiente local ou no servidor.

1. Instale `pip install -r requirements.txt`.
2. Defina a chave no ambiente, sem colocá-la em arquivo versionado.
3. Gere o site estático em `../out` e execute `python ingest_site.py --source ../out`.
4. Para testar só a API, inicie com `uvicorn app:app --host 127.0.0.1 --port 8000`.
5. Para servir site e API juntos, após gerar `../out`, use `uvicorn site:app --host 0.0.0.0 --port 8000`.

Em produção defina `ALLOWED_ORIGINS=https://www.descubraobrasil.com` e use um caminho privado em `RAG_INDEX_PATH`. GitHub Pages não executa FastAPI: será necessário um servidor Python separado. O `Dockerfile` prepara esse servidor e nunca inclui `GOOGLE_API_KEY` nem o índice no repositório.

