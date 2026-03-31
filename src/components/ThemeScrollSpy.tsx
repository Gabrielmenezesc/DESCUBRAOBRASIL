"use client";

import { useEffect, useState } from "react";

export default function ThemeScrollSpy() {
  const [theme, setTheme] = useState<"turismo" | "b2b">("turismo");

  useEffect(() => {
    const handleScroll = () => {
      const b2bSection = document.getElementById("servicos-b2b");
      if (!b2bSection) return;

      const rect = b2bSection.getBoundingClientRect();
      // Se a seção B2B estiver visível em mais de 30% da tela, muda o tema
      if (rect.top < window.innerHeight * 0.7) {
        setTheme("b2b");
        document.body.style.backgroundColor = "#0f172a"; // slate-900
      } else {
        setTheme("turismo");
        document.body.style.backgroundColor = "#ffffff";
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.body.style.backgroundColor = "";
    };
  }, []);

  return null; // Componente lógico apenas
}
