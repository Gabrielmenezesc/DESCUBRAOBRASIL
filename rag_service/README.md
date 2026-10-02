# Serviço RAG local

Este serviço mantém `GOOGLE_API_KEY` apenas no ambiente local ou no servidor.

1. Instale `pip install -r requirements.txt`.
2. Defina a chave no ambiente, sem colocá-la em arquivo versionado.
3. Gere o site estático em `../out` e execute `python ingest_site.py --source ../out`.
4. Inicie com `uvicorn app:app --host 127.0.0.1 --port 8000`.

Em produção defina `ALLOWED_ORIGINS=https://www.descubraobrasil.com` e use um caminho privado em `RAG_INDEX_PATH`. GitHub Pages não executa FastAPI: será necessário um servidor Python separado.

