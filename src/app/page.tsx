'use client';

import { useEffect } from 'react';

export default function Home() {
  useEffect(() => {
    window.location.replace('./app/');
  }, []);

  return <main><p>Abrindo o aplicativo Descubra o Brasil…</p><a href="./app/">Abrir o app</a></main>;
}
