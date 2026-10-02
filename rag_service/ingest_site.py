"""Gera o índice local. A chave permanece somente no ambiente."""
from __future__ import annotations
import argparse, html, json, os, re
from html.parser import HTMLParser
from pathlib import Path
from google import genai

BASE_URL=os.getenv("SITE_PUBLIC_URL","https://www.descubraobrasil.com").rstrip("/")
MODEL=os.getenv("GEMINI_EMBED_MODEL","gemini-embedding-001")

class Extractor(HTMLParser):
    def __init__(self): super().__init__(); self.parts=[]; self.skip=0
    def handle_starttag(self,tag,attrs): self.skip+=tag in {"script","style","noscript","svg"}
    def handle_endtag(self,tag): self.skip-=tag in {"script","style","noscript","svg"} and self.skip>0
    def handle_data(self,data):
        if not self.skip: self.parts.append(data)

def text_from(path:Path)->str:
    p=Extractor(); p.feed(path.read_text(encoding="utf-8",errors="ignore")); return re.sub(r"\s+"," ",html.unescape(" ".join(p.parts))).strip()
def chunks(text:str,size=1200,overlap=180):
    for start in range(0,len(text),size-overlap):
        part=text[start:start+size].strip()
        if len(part)>=80: yield part
        if start+size>=len(text): break
def url_for(path:Path,root:Path)->str:
    relative=path.relative_to(root).as_posix()
    if relative=="index.html": return BASE_URL+"/"
    if relative.endswith("/index.html"): relative=relative[:-10]
    return BASE_URL+"/"+relative.removesuffix(".html")

def main():
    parser=argparse.ArgumentParser(); parser.add_argument("--source",type=Path,default=Path("../out")); parser.add_argument("--index",type=Path,default=Path("site-index.json")); args=parser.parse_args()
    key=os.getenv("GOOGLE_API_KEY")
    if not key: raise SystemExit("GOOGLE_API_KEY não está configurada. Defina-a somente no ambiente local.")
    source=args.source.resolve()
    if not source.is_dir(): raise SystemExit(f"Pasta não encontrada: {source}")
    client=genai.Client(api_key=key); items=[]
    for page in sorted(source.rglob("*.html")):
        for part in chunks(text_from(page)):
            result=client.models.embed_content(model=MODEL,contents=part)
            if not result.embeddings or not result.embeddings[0].values: raise RuntimeError("Embedding inválido")
            items.append({"url":url_for(page,source),"text":part,"embedding":list(result.embeddings[0].values)})
        print(f"Indexado: {page.relative_to(source)}")
    args.index.write_text(json.dumps(items,ensure_ascii=False,separators=(",",":")),encoding="utf-8")
    print(f"Índice local criado: {len(items)} trechos.")
if __name__=="__main__": main()

