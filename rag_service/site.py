"""Servidor único: site estático exportado + API RAG em /api.

Não contém nem lê arquivos de chave. GOOGLE_API_KEY é obtida somente do ambiente.
"""
from pathlib import Path

from fastapi import FastAPI, HTTPException
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles

from app import app as rag_api

ROOT = Path(__file__).resolve().parent.parent
STATIC_DIR = Path(__import__("os").environ.get("STATIC_SITE_DIR", ROOT / "out"))

app = FastAPI(title="Descubra o Brasil")
app.mount("/api", rag_api)


@app.get("/health")
def health():
    return {"ok": True, "site_ready": STATIC_DIR.is_dir()}


if STATIC_DIR.is_dir():
    app.mount("/", StaticFiles(directory=STATIC_DIR, html=True), name="site")
else:
    @app.get("/")
    def missing_export():
        raise HTTPException(503, "A exportação estática do site ainda não foi gerada.")

