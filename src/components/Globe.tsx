"use client";

import { useRef, useMemo, useState, useEffect } from "react";
import dynamic from "next/dynamic";

// Lazy load Three.js Canvas only when WebGL is confirmed available
const ThreeCanvas = dynamic(() => import("./GlobeCanvas"), { 
  ssr: false,
  loading: () => <GlobeFallback />
});

function GlobeFallback() {
  return (
    <div className="absolute inset-0 z-0">
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 via-blue-50 to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900" />
      <div className="absolute inset-0 opacity-30" style={{
        backgroundImage: "radial-gradient(circle at 30% 50%, rgba(16,185,129,0.2) 0%, transparent 50%), radial-gradient(circle at 70% 30%, rgba(59,130,246,0.15) 0%, transparent 50%)"
      }} />
    </div>
  );
}

export default function Globe() {
  const [webglSupported, setWebglSupported] = useState(false); // Default false to prevent Canvas rendering before check
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    try {
      const canvas = document.createElement("canvas");
      const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
      setWebglSupported(!!gl);
    } catch {
      setWebglSupported(false);
    }
    setChecked(true);
  }, []);

  // Show fallback while checking or if WebGL is not supported
  if (!checked || !webglSupported) {
    return <GlobeFallback />;
  }

  return (
    <div className="absolute inset-0 z-0">
      <ThreeCanvas />
      {/* Gradient overlay to blend with background seamlessly */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/40 to-background pointer-events-none" />
    </div>
  );
}
