"use client";

import { useEffect } from "react";
import { useTheme } from "next-themes";

export function useAutoTheme() {
  const { setTheme } = useTheme();

  useEffect(() => {
    // Only run on client
    if (typeof window === "undefined") return;

    const determineThemeByTime = (sunriseHour = 6, sunsetHour = 18) => {
      const currentHour = new Date().getHours();
      if (currentHour >= sunriseHour && currentHour < sunsetHour) {
        setTheme("light");
      } else {
        setTheme("dark");
      }
    };

    const fetchSunriseSunset = async (lat: number, lng: number) => {
      try {
        const response = await fetch(`https://api.sunrise-sunset.org/json?lat=${lat}&lng=${lng}&formatted=0`);
        const data = await response.json();
        
        if (data.status === "OK") {
          const sunrise = new Date(data.results.sunrise).getHours();
          const sunset = new Date(data.results.sunset).getHours();
          determineThemeByTime(sunrise, sunset);
        } else {
          determineThemeByTime();
        }
      } catch (error) {
        console.error("Failed to fetch sunrise/sunset times", error);
        determineThemeByTime();
      }
    };

    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          fetchSunriseSunset(position.coords.latitude, position.coords.longitude);
        },
        (error) => {
          console.log("Geolocation permission denied or failed, using local time fallback.", error);
          determineThemeByTime();
        },
        { timeout: 5000 }
      );
    } else {
      determineThemeByTime();
    }
  }, [setTheme]);
}
