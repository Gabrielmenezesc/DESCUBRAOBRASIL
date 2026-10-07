"use client";

import { useEffect, useMemo, useState } from "react";
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { STATE_PINS, type StatePin } from "./MapExplorerSection";

const ibgeUrl="https://servicodados.ibge.gov.br/api/v1/localidades/municipios";
const icon=L.icon({iconUrl:"https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",iconRetinaUrl:"https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",shadowUrl:"https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",iconSize:[22,36],iconAnchor:[11,36]});
L.Marker.prototype.options.icon=icon;
type Municipio={id:number;nome:string;microrregiao?:{mesorregiao?:{UF?:{sigla?:string}}}};
function MapMover({target}:{target:StatePin|null}){const map=useMap();useEffect(()=>{if(target)map.flyTo([target.lat,target.lng],8,{duration:.8});},[map,target]);return null;}
export default function MapExplorerComponent({onSelectState}:{onSelectState:(state:StatePin)=>void}){
 const [cities,setCities]=useState<Municipio[]>([]);const [query,setQuery]=useState("");const [selected,setSelected]=useState<StatePin|null>(null);
 useEffect(()=>{let active=true;fetch(ibgeUrl).then(r=>r.ok?r.json():[]).then(data=>{if(active&&Array.isArray(data))setCities(data);}).catch(()=>{});return()=>{active=false;};},[]);
 const matches=useMemo(()=>{const q=query.trim().toLocaleLowerCase("pt-BR");return q?cities.filter(c=>c.nome.toLocaleLowerCase("pt-BR").includes(q)).slice(0,8):[];},[cities,query]);
 const choose=(city:Municipio)=>{const uf=city.microrregiao?.mesorregiao?.UF?.sigla;const state=STATE_PINS.find(s=>s.code===uf)||null;setQuery(city.nome);setSelected(state);if(state)onSelectState(state);};
 return <div className="brazil-live-map"><div className="brazil-map-search"><label htmlFor="ibge-city-search">Pesquise uma cidade do Brasil</label><input id="ibge-city-search" value={query} onChange={e=>setQuery(e.target.value)} placeholder="Ex.: Brasília, Salvador, Manaus" autoComplete="off"/>{query&&<div className="brazil-map-results">{matches.length?matches.map(city=><button type="button" key={city.id} onClick={()=>choose(city)}>{city.nome}<small>{city.microrregiao?.mesorregiao?.UF?.sigla||""}</small></button>):<span>{cities.length?"Nenhum município encontrado.":"Carregando municípios oficiais…"}</span>}</div>}</div><MapContainer center={[-14.235,-51.925]} zoom={4} scrollWheelZoom className="w-full h-full" style={{zIndex:0}}><TileLayer attribution="&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors; municípios: IBGE" url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"/><MapMover target={selected}/>{STATE_PINS.map(state=><Marker key={state.code} position={[state.lat,state.lng]} eventHandlers={{click:()=>{setSelected(state);onSelectState(state);}}}/>)}</MapContainer><div className="brazil-map-credit">{cities.length?cities.length.toLocaleString("pt-BR")+" municípios disponíveis para busca":"Dados municipais oficiais do IBGE"}</div></div>;
}