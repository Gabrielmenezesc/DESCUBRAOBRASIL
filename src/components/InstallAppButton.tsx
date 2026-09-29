"use client";

import { usePWA } from '@/context/PWAProvider';

export default function InstallAppButton({ className, children, onClick }: { className?: string; children: React.ReactNode; onClick?: () => void }) {
  const { showInstallPrompt } = usePWA();
  return <button type="button" className={className} onClick={() => { onClick?.(); showInstallPrompt(); }} aria-label="Instalar ou abrir aplicativo">
    {children}
  </button>;
}

