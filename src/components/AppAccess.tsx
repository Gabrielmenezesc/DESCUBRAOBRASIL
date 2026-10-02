"use client";

import { useEffect, useState } from "react";
import { assetPath } from "@/lib/assetPath";

export default function AppAccess() {
  const [mobile, setMobile] = useState(false);
  const appUrl = "https://www.descubraobrasil.com/app/";

  useEffect(() => {
    const media = window.matchMedia("(max-width: 767px), (pointer: coarse)");
    const update = () => setMobile(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(appUrl);
      window.alert("Link do aplicativo copiado.");
    } catch {
      window.prompt("Copie o link do aplicativo:", appUrl);
    }
  }

  return (
    <section id="acesso-app" className="app-access" aria-labelledby="acesso-app-title">
      <div>
        <p className="cine-section-kicker">APLICATIVO PARA CELULAR</p>
        <h2 id="acesso-app-title">O aplicativo é uma experiência separada do site.</h2>
        <p>O site apresenta destinos e informações. No celular, o aplicativo reúne mapa, Maya, roteiros e recursos pessoais.</p>
        {mobile ? (
          <a className="cine-btn-explore" href={assetPath("/app/index.html")}>Abrir aplicativo no celular</a>
        ) : (
          <button className="cine-btn-explore" type="button" onClick={copyLink}>Copiar link do aplicativo</button>
        )}
        <small>Ao instalar pelo navegador, ele abre em tela própria como PWA.</small>
      </div>
      {!mobile && (
        <div className="app-access-qr">
          <img src={`https://api.qrserver.com/v1/create-qr-code/?size=220x220&format=svg&data=${encodeURIComponent(appUrl)}`} alt="QR Code para abrir o aplicativo Descubra o Brasil no celular" />
          <strong>Aponte a câmera do celular</strong>
          <span>Você será direcionado ao aplicativo.</span>
        </div>
      )}
    </section>
  );
}
