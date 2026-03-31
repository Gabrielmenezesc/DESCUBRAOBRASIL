import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { PWAProvider } from "@/context/PWAProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Descubra o Brasil | Turismo & Tecnologia 3D",
  description: "Descubra o Brasil como você nunca viu. Tecnologia, turismo e divulgação em um só ecossistema inovador.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${geistSans.variable} ${geistMono.variable}`}>
      <head>
        <link rel="manifest" href="/DESCUBRAOBRASIL/manifest.json" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Descubra Brasil" />
      </head>
      <body className="min-h-screen antialiased bg-background text-foreground flex flex-col">
        <PWAProvider>
          {children}
        </PWAProvider>
      </body>
    </html>
  );
}
