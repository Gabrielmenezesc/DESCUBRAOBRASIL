"use client";

import { useState, useEffect } from "react";

export interface GeoLocation {
  state: string;
  stateCode: string;
  city: string;
  region: string;
  lat: number;
  lon: number;
}

// Mapeamento UF → Nome do estado e região
const STATE_MAP: Record<string, { name: string; region: string }> = {
  AC: { name: "Acre", region: "Norte" },
  AL: { name: "Alagoas", region: "Nordeste" },
  AP: { name: "Amapá", region: "Norte" },
  AM: { name: "Amazonas", region: "Norte" },
  BA: { name: "Bahia", region: "Nordeste" },
  CE: { name: "Ceará", region: "Nordeste" },
  DF: { name: "Distrito Federal", region: "Centro-Oeste" },
  ES: { name: "Espírito Santo", region: "Sudeste" },
  GO: { name: "Goiás", region: "Centro-Oeste" },
  MA: { name: "Maranhão", region: "Nordeste" },
  MT: { name: "Mato Grosso", region: "Centro-Oeste" },
  MS: { name: "Mato Grosso do Sul", region: "Centro-Oeste" },
  MG: { name: "Minas Gerais", region: "Sudeste" },
  PA: { name: "Pará", region: "Norte" },
  PB: { name: "Paraíba", region: "Nordeste" },
  PR: { name: "Paraná", region: "Sul" },
  PE: { name: "Pernambuco", region: "Nordeste" },
  PI: { name: "Piauí", region: "Nordeste" },
  RJ: { name: "Rio de Janeiro", region: "Sudeste" },
  RN: { name: "Rio Grande do Norte", region: "Nordeste" },
  RS: { name: "Rio Grande do Sul", region: "Sul" },
  RO: { name: "Rondônia", region: "Norte" },
  RR: { name: "Roraima", region: "Norte" },
  SC: { name: "Santa Catarina", region: "Sul" },
  SP: { name: "São Paulo", region: "Sudeste" },
  SE: { name: "Sergipe", region: "Nordeste" },
  TO: { name: "Tocantins", region: "Norte" },
};

export const STATES_LIST = Object.entries(STATE_MAP).map(([code, info]) => ({
  code,
  name: info.name,
  region: info.region,
})).sort((a, b) => a.name.localeCompare(b.name));

export const REGIONS = ["Norte", "Nordeste", "Centro-Oeste", "Sudeste", "Sul"];

export function useGeolocation() {
  const [location, setLocation] = useState<GeoLocation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function detectLocation() {
      try {
        // Tentar geolocalização via IP (não precisa de permissão)
        const res = await fetch("https://ipapi.co/json/");
        if (res.ok) {
          const data = await res.json();
          const regionCode = data.region_code || "";
          const stateInfo = STATE_MAP[regionCode];
          
          if (stateInfo) {
            setLocation({
              state: stateInfo.name,
              stateCode: regionCode,
              city: data.city || "",
              region: stateInfo.region,
              lat: data.latitude || 0,
              lon: data.longitude || 0,
            });
          } else {
            // Fallback para Brasília
            setLocation({
              state: "Distrito Federal",
              stateCode: "DF",
              city: "Brasília",
              region: "Centro-Oeste",
              lat: -15.7801,
              lon: -47.9292,
            });
          }
        }
      } catch {
        // Fallback
        setLocation({
          state: "Distrito Federal",
          stateCode: "DF",
          city: "Brasília",
          region: "Centro-Oeste",
          lat: -15.7801,
          lon: -47.9292,
        });
        setError("Não foi possível detectar a localização");
      } finally {
        setLoading(false);
      }
    }

    detectLocation();
  }, []);

  return { location, loading, error };
}
