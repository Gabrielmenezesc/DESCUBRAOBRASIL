"use client";

import { useState, useEffect } from "react";

interface WeatherData {
  city: string;
  temperature: number;
  description: string;
  icon: string;
}

const weatherCodeMap: Record<number, { description: string; icon: string }> = {
  0: { description: "Céu Limpo", icon: "☀️" },
  1: { description: "Parcialmente Limpo", icon: "🌤️" },
  2: { description: "Parcialmente Nublado", icon: "⛅" },
  3: { description: "Nublado", icon: "☁️" },
  45: { description: "Nevoeiro", icon: "🌫️" },
  48: { description: "Nevoeiro Gelado", icon: "🌫️" },
  51: { description: "Garoa Leve", icon: "🌦️" },
  53: { description: "Garoa Moderada", icon: "🌦️" },
  55: { description: "Garoa Intensa", icon: "🌧️" },
  61: { description: "Chuva Leve", icon: "🌧️" },
  63: { description: "Chuva Moderada", icon: "🌧️" },
  65: { description: "Chuva Forte", icon: "🌧️" },
  71: { description: "Neve Leve", icon: "🌨️" },
  73: { description: "Neve Moderada", icon: "🌨️" },
  75: { description: "Neve Forte", icon: "❄️" },
  80: { description: "Pancadas Leves", icon: "🌦️" },
  81: { description: "Pancadas Moderadas", icon: "🌧️" },
  82: { description: "Pancadas Fortes", icon: "⛈️" },
  95: { description: "Tempestade", icon: "⛈️" },
  96: { description: "Tempestade com Granizo", icon: "⛈️" },
  99: { description: "Tempestade Severa", icon: "⛈️" },
};

export function useWeather() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchWeather() {
      try {
        // 1. Try browser geolocation first
        let lat: number | null = null;
        let lon: number | null = null;
        let city = "Brasil";

        try {
          const pos = await new Promise<GeolocationPosition>((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 5000 });
          });
          lat = pos.coords.latitude;
          lon = pos.coords.longitude;
        } catch {
          // Fallback: IP-based geolocation
          try {
            const ipRes = await fetch("https://ipapi.co/json/");
            const ipData = await ipRes.json();
            lat = ipData.latitude;
            lon = ipData.longitude;
            city = ipData.city || "Brasil";
          } catch {
            // Default: Brasília
            lat = -15.7975;
            lon = -47.8919;
            city = "Brasília";
          }
        }

        // 2. Reverse geocode if we got browser geolocation
        if (city === "Brasil" && lat && lon) {
          try {
            const geoRes = await fetch(
              `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json&accept-language=pt`
            );
            const geoData = await geoRes.json();
            city = geoData.address?.city || geoData.address?.town || geoData.address?.municipality || "Brasil";
          } catch {
            city = "Brasil";
          }
        }

        // 3. Get weather from Open-Meteo
        const weatherRes = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`
        );
        const weatherData = await weatherRes.json();
        const current = weatherData.current_weather;
        const code = current?.weathercode ?? 0;
        const mapped = weatherCodeMap[code] || { description: "Céu Limpo", icon: "☀️" };

        setWeather({
          city,
          temperature: Math.round(current?.temperature ?? 25),
          description: mapped.description,
          icon: mapped.icon,
        });
      } catch {
        setWeather({
          city: "Brasil",
          temperature: 25,
          description: "Céu Limpo",
          icon: "☀️",
        });
      } finally {
        setLoading(false);
      }
    }

    fetchWeather();
  }, []);

  return { weather, loading };
}
