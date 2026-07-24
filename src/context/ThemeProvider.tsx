"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import { useAutoTheme } from "@/hooks/useAutoTheme";

function AutoThemeEffect() {
  useAutoTheme();
  return null;
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider attribute="class" defaultTheme="system" enableSystem>
      <AutoThemeEffect />
      {children}
    </NextThemesProvider>
  );
}
