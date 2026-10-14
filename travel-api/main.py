"""API segura de pesquisa de viagens do Descubra o Brasil.

Credenciais de parceiros ficam somente nas variáveis de ambiente do Render.
Não retorne tokens, segredos ou mensagens internas ao navegador.
"""
from __future__ import annotations

import asyncio
import os
from datetime import date
from typing import Any
from urllib.parse import quote_plus

import httpx
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field, field_validator

APP_ORIGINS = [
    value.strip()
    for value in os.getenv(
        "ALLOWED_ORIGINS",
        "https://www.descubraobrasil.com,https://descubraobrasil.com,http://localhost:3000",
    ).split(",")
    if value.strip()
]
HTTP_TIMEOUT = httpx.Timeout(12.0, connect=7.0)
USER_AGENT = "DescubraOBrasil/1.0 (travel search; contato@descubraobrasil.com)"
TRAVELPAYOUTS_TOKEN = os.getenv("TRAVELPAYOUTS_TOKEN", "").strip()

app = FastAPI(title="Descubra o Brasil Travel API", version="1.0.0")
app.add_middleware(
    CORSMiddleware,
    allow_origins=APP_ORIGINS,
    allow_methods=["GET", "POST"],
    allow_headers=["Content-Type"],
)


class TravelSearch(BaseModel):
    origem: str = Field(min_length=3, max_length=120)
    destino: str = Field(min_length=3, max_length=120)
    ida: date
    volta: date | None = None
    viajantes: int = Field(default=1, ge=1, le=9)
    modalidades: list[str] = Field(default_factory=lambda: ["bus", "flight", "ride"])
    id_jovem: bool = False
    idoso: bool = False
    horarios_alternativos: bool = False

    @field_validator("origem", "destino")
    @classmethod
    def clean_city(cls, value: str) -> str:
        return " ".join(value.split())

    @field_validator("modalidades")
    @classmethod
    def valid_modes(cls, values: list[str]) -> list[str]:
        allowed = {"bus", "flight", "ride"}
        selected = [value for value in values if value in allowed]
        return selected or ["bus", "flight", "ride"]


async def geocode(client: httpx.AsyncClient, city: str) -> dict[str, Any] | None:
    response = await client.get(
        "https://nominatim.openstreetmap.org/search",
        params={"format": "jsonv2", "limit": 1, "countrycodes": "br", "q": city},
        headers={"User-Agent": USER_AGENT, "Accept-Language": "pt-BR"},
    )
    response.raise_for_status()
    places = response.json()
    if not places:
        return None
    item = places[0]
    return {"lat": float(item["lat"]), "lon": float(item["lon"]), "nome": item["display_name"]}


async def road_route(
    client: httpx.AsyncClient, origin: dict[str, Any], destination: dict[str, Any]
) -> dict[str, int] | None:
    url = (
        "https://router.project-osrm.org/route/v1/driving/"
        f"{origin['lon']},{origin['lat']};{destination['lon']},{destination['lat']}"
    )
    response = await client.get(url, params={"overview": "false"})
    response.raise_for_status()
    routes = response.json().get("routes", [])
    if not routes:
        return None
    route = routes[0]
    return {
        "distancia_km": round(route["distance"] / 1000),
        "duracao_minutos": round(route["duration"] / 60),
    }


async def travelpayouts_offers(
    client: httpx.AsyncClient, request: TravelSearch
) -> list[dict[str, Any]]:
    """Adapter intentionally returns no offer until airport-code mapping is configured.

    Travelpayouts price APIs use IATA routes. A city-to-IATA mapping provider must
    be configured before this adapter can safely query real fares.
    """
    if not TRAVELPAYOUTS_TOKEN:
        return []
    # Kept explicit to avoid treating a city name as an IATA code or inventing a fare.
    return []


def partner_links(request: TravelSearch) -> list[dict[str, str]]:
    route = f"{request.origem} para {request.destino}"
    flight_query = quote_plus(
        f"voos de {request.origem} para {request.destino} em {request.ida.isoformat()}"
    )
    return [
        {
            "tipo": "bus",
            "titulo": "Passagens rodoviárias",
            "parceiro": "ClickBus",
            "url": "https://www.clickbus.com.br/",
            "aviso": "Consulte preço, horário e disponibilidade no parceiro.",
        },
        {
            "tipo": "ride",
            "titulo": "Carona compartilhada",
            "parceiro": "BlaBlaCar",
            "url": "https://www.blablacar.com.br/",
            "aviso": "Consulte trajeto, perfil e valor no parceiro.",
        },
        {
            "tipo": "flight",
            "titulo": "Voos",
            "parceiro": "Google Flights",
            "url": f"https://www.google.com/travel/flights?q={flight_query}",
            "aviso": "Consulte tarifa e regras de bagagem no parceiro.",
        },
        {
            "tipo": "map",
            "titulo": "Rota terrestre",
            "parceiro": "Google Maps",
            "url": "https://www.google.com/maps/dir/?api=1&origin="
            + quote_plus(request.origem)
            + "&destination="
            + quote_plus(request.destino)
            + "&travelmode=transit",
            "aviso": f"Veja opções de transporte para {route}.",
        },
    ]


@app.get("/health")
async def health() -> dict[str, bool]:
    return {"ok": True, "travelpayouts_configured": bool(TRAVELPAYOUTS_TOKEN)}


@app.post("/travel/search")
async def search_travel(request: TravelSearch) -> dict[str, Any]:
    if request.volta and request.volta < request.ida:
        raise HTTPException(status_code=422, detail="A volta deve ser igual ou posterior à ida.")

    async with httpx.AsyncClient(timeout=HTTP_TIMEOUT, follow_redirects=True) as client:
        origin, destination = await asyncio.gather(
            geocode(client, request.origem), geocode(client, request.destino)
        )
        route = None
        if origin and destination:
            try:
                route = await road_route(client, origin, destination)
            except httpx.HTTPError:
                route = None
        offers = await travelpayouts_offers(client, request)

    notices: list[str] = [
        "Tarifas e vagas só são confirmadas no parceiro de venda.",
        "Benefícios de transporte dependem de requisitos, vagas e regras vigentes.",
    ]
    if not TRAVELPAYOUTS_TOKEN:
        notices.append(
            "Busca aérea com tarifa em tempo real será habilitada após configurar um provedor afiliado."
        )
    if (request.id_jovem or request.idoso) and route:
        notices.append(
            "Para transporte interestadual, confira o benefício aplicável diretamente no canal oficial da ANTT."
        )

    return {
        "rota": route,
        "origem_encontrada": bool(origin),
        "destino_encontrado": bool(destination),
        "ofertas_reais": offers,
        "links_consulta": [
            item for item in partner_links(request) if item["tipo"] in request.modalidades or item["tipo"] == "map"
        ],
        "avisos": notices,
    }
