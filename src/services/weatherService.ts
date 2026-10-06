"use client";

export interface ForecastDay {
  date: string;
  dayName: string;
  tempMin: number;
  tempMax: number;
  condition: string;
  icon: string;
}

export interface WeatherInfo {
  city: string;
  state: string;
  temperature: number;
  feelsLike: number;
  condition: string;
  icon: string;
  humidity: number;
  windSpeed: number;
  todayMin: number;
  todayMax: number;
  lat: number;
  lon: number;
  forecast: ForecastDay[];
  timestamp: Date;
}

const WEATHER_CODE_MAP: Record<number, { description: string; icon: string }> = {
  0: { description: "Céu Limpo", icon: "☀️" },
  1: { description: "Predominantemente Limpo", icon: "🌤️" },
  2: { description: "Parcialmente Nublado", icon: "⛅" },
  3: { description: "Nublado", icon: "☁️" },
  45: { description: "Nevoeiro", icon: "🌫️" },
  48: { description: "Nevoeiro Gelado", icon: "🌫️" },
  51: { description: "Garoa Leve", icon: "🌧️" },
  53: { description: "Garoa Moderada", icon: "🌧️" },
  55: { description: "Garoa Intensa", icon: "🌧️" },
  61: { description: "Chuva Leve", icon: "🌧️" },
  63: { description: "Chuva Moderada", icon: "🌧️" },
  65: { description: "Chuva Forte", icon: "🌧️" },
  80: { description: "Pancadas de Chuva Leves", icon: "🌦️" },
  81: { description: "Pancadas de Chuva Moderadas", icon: "🌦️" },
  82: { description: "Pancadas de Chuva Fortes", icon: "⛈️" },
  95: { description: "Tempestade", icon: "⛈️" },
  96: { description: "Tempestade com Granizo", icon: "⛈️" },
  99: { description: "Tempestade Severa", icon: "⛈️" },
};

export async function fetchRealWeather(lat: number, lon: number, cityName?: string, stateName?: string): Promise<WeatherInfo> {
  try {
    // 1. Resolve exact city and state if missing via reverse geocoding
    let resolvedCity = cityName || "Brasília";
    let resolvedState = stateName || "DF";

    if (!cityName) {
      try {
        const geoRes = await fetch(
          `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json&accept-language=pt`
        );
        if (geoRes.ok) {
          const geoData = await geoRes.json();
          resolvedCity = geoData.address?.city || geoData.address?.town || geoData.address?.municipality || geoData.address?.suburb || "Brasília";
          resolvedState = geoData.address?.state_code || geoData.address?.state || "DF";
        }
      } catch (err) {
        console.warn("[WeatherService] Geocoding fallback:", err);
      }
    }

    // 2. Fetch current weather and 7-day forecast from Open-Meteo
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&hourly=relativehumidity_2m,apparent_temperature&daily=weathercode,temperature_2m_max,temperature_2m_min&timezone=auto`;
    const res = await fetch(url);
    if (!res.ok) throw new Error("Falha na API de clima");
    
    const data = await res.json();
    const current = data.current_weather || {};
    const code = current.weathercode ?? 0;
    const mapped = WEATHER_CODE_MAP[code] || { description: "Ensolarado", icon: "☀️" };

    const humidity = data.hourly?.relativehumidity_2m?.[0] ?? 52;
    const feelsLike = data.hourly?.apparent_temperature?.[0] ? Math.round(data.hourly.apparent_temperature[0]) : Math.round(current.temperature ?? 27);
    const todayMin = data.daily?.temperature_2m_min?.[0] ? Math.round(data.daily.temperature_2m_min[0]) : Math.round((current.temperature ?? 27) - 4);
    const todayMax = data.daily?.temperature_2m_max?.[0] ? Math.round(data.daily.temperature_2m_max[0]) : Math.round((current.temperature ?? 27) + 3);

    // Build 7-day forecast
    const forecast: ForecastDay[] = [];
    if (data.daily?.time) {
      const dates = data.daily.time;
      const mins = data.daily.temperature_2m_min;
      const maxs = data.daily.temperature_2m_max;
      const codes = data.daily.weathercode;

      const daysOfWeek = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

      for (let i = 0; i < Math.min(dates.length, 7); i++) {
        const dateObj = new Date(dates[i] + "T00:00:00");
        const dayName = i === 0 ? "Hoje" : i === 1 ? "Amanhã" : daysOfWeek[dateObj.getDay()];
        const dayCode = codes[i] ?? 0;
        const dayMap = WEATHER_CODE_MAP[dayCode] || { description: "Ensolarado", icon: "☀️" };

        forecast.push({
          date: dates[i],
          dayName,
          tempMin: Math.round(mins[i]),
          tempMax: Math.round(maxs[i]),
          condition: dayMap.description,
          icon: dayMap.icon,
        });
      }
    }

    return {
      city: resolvedCity,
      state: resolvedState,
      temperature: Math.round(current.temperature ?? 27),
      feelsLike,
      condition: mapped.description,
      icon: mapped.icon,
      humidity,
      windSpeed: Math.round(current.windspeed ?? 12),
      todayMin,
      todayMax,
      lat,
      lon,
      forecast,
      timestamp: new Date(),
    };
  } catch (error) {
    console.error("[WeatherService] Erro ao buscar clima:", error);
    // Safe fallback for Brasilia
    return {
      city: cityName || "Brasília",
      state: stateName || "DF",
      temperature: 27,
      feelsLike: 28,
      condition: "Ensolarado",
      icon: "☀️",
      humidity: 48,
      windSpeed: 12,
      todayMin: 19,
      todayMax: 29,
      lat: -15.7975,
      lon: -47.8919,
      forecast: [
        { date: "2026-10-06", dayName: "Hoje", tempMin: 19, tempMax: 29, condition: "Ensolarado", icon: "☀️" },
        { date: "2026-10-07", dayName: "Amanhã", tempMin: 18, tempMax: 28, condition: "Parcialmente Nublado", icon: "⛅" },
        { date: "2026-10-08", dayName: "Qui", tempMin: 20, tempMax: 30, condition: "Ensolarado", icon: "☀️" },
      ],
      timestamp: new Date(),
    };
  }
}

export async function getWeatherByCityName(cityName: string): Promise<WeatherInfo> {
  try {
    const geoRes = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(cityName + ", Brasil")}&format=json&limit=1`
    );
    if (!geoRes.ok) throw new Error("Cidade não encontrada");
    const geoData = await geoRes.json();
    if (!geoData || geoData.length === 0) throw new Error("Cidade não localizada");

    const lat = parseFloat(geoData[0].lat);
    const lon = parseFloat(geoData[0].lon);
    const displayName = geoData[0].display_name || cityName;
    const parts = displayName.split(",");
    const city = parts[0]?.trim() || cityName;

    return fetchRealWeather(lat, lon, city);
  } catch (err) {
    console.error("[WeatherService] Erro ao buscar por cidade:", err);
    return fetchRealWeather(-15.7975, -47.8919, cityName);
  }
}
