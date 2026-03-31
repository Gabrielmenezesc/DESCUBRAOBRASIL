"use client";

import { useEffect, useState } from "react";

export default function ThemeScrollSpy() {
  const [theme, setTheme] = useState<"turismo">("turismo");

  useEffect(() => {
    const handleScroll = () => {
      // Simplificado: Todas as seções agora seguem o tema Turismo
      setTheme("turismo");
      document.body.style.backgroundColor = "#ffffff";
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.body.style.backgroundColor = "";
    };
  }, []);

  return null; // Componente lógico apenas
}
