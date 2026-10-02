"use client";

import { useEffect, useMemo, useState } from "react";
import { CircleMarker, MapContainer, Popup, TileLayer, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { assetPath } from "@/lib/assetPath";

type StatePoint = { code: string; name: string; capital: string; lat: number; lng: number; slug: string };
type Municipality = { id: number; nome: string; microrregiao?: { mesorregiao?: { UF?: { sigla?: string } } } };
type Target = { lat: number; lng: number; label: string };

const states: StatePoint[] = [
  ["AC","Acre","Rio Branco",-9.975,-67.824,"ac"],["AL","Alagoas","Maceió",-9.649,-35.709,"al"],
  ["AP","Amapá","Macapá",0.035,-51.07,"ap"],["AM","Amazonas","Manaus",-3.119,-60.021,"am"],
  ["BA","Bahia","Salvador",-12.971,-38.501,"ba"],["CE","Ceará","Fortaleza",-3.732,-38.527,"ce"],
  ["DF","Distrito Federal","Brasília",-15.794,-47.882,"df"],["ES","Espírito Santo","Vitória",-20.315,-40.312,"es"],
  ["GO","Goiás","Goiânia",-16.686,-49.264,"go"],["MA","Maranhão","São Luís",-2.53,-44.302,"ma"],
  ["MT","Mato Grosso","Cuiabá",-15.601,-56.097,"mt"],["MS","Mato Grosso do Sul","Campo Grande",-20.469,-54.62,"ms"],
  ["MG","Minas Gerais","Belo Horizonte",-19.916,-43.934,"mg"],["PA","Pará","Belém",-1.456,-48.49,"pa"],
  ["PB","Paraíba","João Pessoa",-7.119,-34.845,"pb"],["PR","Paraná","Curitiba",-25.429,-49.271,"pr"],
  ["PE","Pernambuco","Recife",-8.047,-34.877,"pe"],["PI","Piauí","Teresina",-5.092,-42.803,"pi"],
  ["RJ","Rio de Janeiro","Rio de Janeiro",-22.906,-43.172,"rj"],["RN","Rio Grande do Norte","Natal",-5.795,-35.209,"rn"],
  ["RS","Rio Grande do Sul","Porto Alegre",-30.034,-51.23,"rs"],["RO","Rondônia","Porto Velho",-8.761,-63.9,"ro"],
  ["RR","Roraima","Boa Vista",2.823,-60.675,"rr"],["SC","Santa Catarina","Florianópolis",-27.595,-48.548,"sc"],
  ["SP","São Paulo","São Paulo",-23.55,-46.633,"sp"],["SE","Sergipe","Aracaju",-10.947,-37.073,"se"],
  ["TO","Tocantins","Palmas",-10.184,-48.333,"to"],
].map(([code,name,capital,lat,lng,slug]) => ({ code:String(code), name:String(name), capital:String(capital), lat:Number(lat), lng:Number(lng), slug:String(slug) }));

function FlyTo({ target }: { target: Target | null }) {
  const map = useMap();
  useEffect(() => {
    if (target) map.flyTo([target.lat, target.lng], 10, { duration: 1.2 });
  }, [map, target]);
  return null;
}

export default function BrazilMapHero() {
  const [municipalities, setMunicipalities] = useState<Municipality[]>([]);
  const [query, setQuery] = useState("");
  const [target, setTarget] = useState<Target | null>(null);
  const [status, setStatus] = useState("26 estados e Distrito Federal sinalizados");
  const matches = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase("pt-BR");
    if (normalized.length < 3) return [];
    return municipalities.filter((city) => city.nome.toLocaleLowerCase("pt-BR").includes(normalized)).slice(0, 8);
  }, [municipalities, query]);

  useEffect(() => {
    const controller = new AbortController();
    fetch("https://servicodados.ibge.gov.br/api/v1/localidades/municipios", { signal: controller.signal })
      .then((response) => response.ok ? response.json() : Promise.reject())
      .then((data: Municipality[]) => {
        setMunicipalities(data);
        setStatus(`${data.length.toLocaleString("pt-BR")} municípios disponíveis para pesquisa`);
      })
      .catch(() => setStatus("Mapa disponível. A lista de municípios será carregada quando houver conexão."));
    return () => controller.abort();
  }, []);

  async function selectMunicipality(city: Municipality) {
    setQuery(city.nome);
    setStatus(`Localizando ${city.nome} no mapa…`);
    const uf = city.microrregiao?.mesorregiao?.UF?.sigla || "Brasil";
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=jsonv2&limit=1&countrycodes=br&q=${encodeURIComponent(`${city.nome}, ${uf}, Brasil`)}`, { headers: { Accept: "application/json" } });
      const data = await response.json();
      if (data[0]?.lat && data[0]?.lon) {
        setTarget({ lat: Number(data[0].lat), lng: Number(data[0].lon), label: `${city.nome}, ${uf}` });
        setStatus(`${city.nome} localizado. Use + e − para explorar a região.`);
      } else setStatus(`Não encontrei coordenadas para ${city.nome}. Tente pesquisar pelo estado ou capital.`);
    } catch {
      setStatus("Não foi possível localizar essa cidade agora. Verifique sua conexão e tente novamente.");
    }
  }

  return (
    <section className="br-map-hero" aria-label="Mapa interativo do Brasil">
      <div className="br-map-toolbar">
        <p><span aria-hidden="true">●</span> MAPA VIVO DO BRASIL</p>
        <label>
          <span className="sr-only">Pesquisar cidade brasileira</span>
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Pesquisar qualquer cidade do Brasil" autoComplete="off" />
        </label>
        {matches.length > 0 && (
          <ul className="br-map-results" role="listbox" aria-label="Cidades encontradas">
            {matches.map((city) => <li key={city.id}><button onClick={() => selectMunicipality(city)}>{city.nome}<small>{city.microrregiao?.mesorregiao?.UF?.sigla || "BR"}</small></button></li>)}
          </ul>
        )}
      </div>
      <MapContainer center={[-14.235, -51.925]} zoom={4} minZoom={3} maxZoom={16} scrollWheelZoom className="br-map-canvas">
        <TileLayer attribution='&copy; OpenStreetMap contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <FlyTo target={target} />
        {states.map((state) => (
          <CircleMarker key={state.code} center={[state.lat, state.lng]} radius={7} pathOptions={{ color: "#f4c542", fillColor: "#08783c", fillOpacity: .95, weight: 3 }}>
            <Popup>
              <strong>{state.name}</strong><br />Capital: {state.capital}<br />
              <a href={assetPath(`/turismo/${state.slug}`)}>Ver conteúdo do estado</a>
            </Popup>
          </CircleMarker>
        ))}
        {target && <CircleMarker center={[target.lat, target.lng]} radius={9} pathOptions={{ color: "#fff", fillColor: "#d70f37", fillOpacity: 1, weight: 3 }}><Popup>{target.label}</Popup></CircleMarker>}
      </MapContainer>
      <div className="br-map-footer">
        <span>{status}</span>
        <span>Dados municipais: IBGE · Mapa: OpenStreetMap</span>
      </div>
    </section>
  );
}
