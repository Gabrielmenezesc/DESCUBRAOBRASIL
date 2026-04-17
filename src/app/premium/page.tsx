"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function PremiumRedirect() {
  const router = useRouter();

  useEffect(() => {
    // Redireciona para a home, já que o premium agora é apenas no App
    router.replace("/");
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">
      <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
}
