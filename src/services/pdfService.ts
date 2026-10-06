"use client";

export interface PDFItineraryData {
  title: string;
  destination: string;
  userCity?: string;
  daysCount: number;
  totalBudget?: string;
  weatherInfo?: string;
  days: {
    dayNumber: number;
    title: string;
    description: string;
    activities: string[];
  }[];
  places?: {
    name: string;
    type: string;
    address?: string;
  }[];
  tips?: string[];
}

export async function generateMayaTravelPDF(data: PDFItineraryData) {
  if (typeof window === "undefined") return;

  const printWindow = window.open("", "_blank");
  if (!printWindow) {
    alert("Por favor, permita janelas pop-up para baixar seu Guia em PDF.");
    return;
  }

  const htmlContent = `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <title>Guia de Viagem Maya AI — ${data.destination}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&display=swap');
    
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif;
      color: #1e293b;
      background: #ffffff;
      padding: 40px;
      line-height: 1.6;
    }
    
    .header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 3px solid #10b981;
      padding-bottom: 24px;
      margin-bottom: 32px;
    }
    .brand {
      display: flex;
      align-items: center;
      gap: 16px;
    }
    .avatar-img {
      width: 64px;
      height: 64px;
      border-radius: 50%;
      border: 3px solid #10b981;
      object-fit: cover;
    }
    .title-box h1 {
      font-size: 24px;
      color: #065f46;
      font-weight: 800;
    }
    .title-box p {
      font-size: 13px;
      color: #059669;
      font-weight: 600;
    }
    
    .meta-card {
      background: #f0fdf4;
      border: 1px solid #bbf7d0;
      border-radius: 16px;
      padding: 20px;
      margin-bottom: 32px;
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
      gap: 16px;
    }
    .meta-item label {
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      color: #166534;
      font-weight: 700;
      display: block;
    }
    .meta-item span {
      font-size: 16px;
      font-weight: 700;
      color: #0f172a;
    }

    .section-title {
      font-size: 18px;
      color: #0f172a;
      font-weight: 800;
      margin-bottom: 16px;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .section-title::before {
      content: '';
      width: 6px;
      height: 20px;
      background: #10b981;
      border-radius: 3px;
    }

    .day-card {
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      padding: 20px;
      margin-bottom: 20px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.02);
    }
    .day-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 12px;
    }
    .day-badge {
      background: #10b981;
      color: white;
      font-size: 12px;
      font-weight: 800;
      padding: 4px 12px;
      border-radius: 20px;
    }
    .day-title {
      font-size: 16px;
      font-weight: 700;
      color: #1e293b;
    }
    .activity-list {
      list-style-type: none;
      margin-top: 12px;
    }
    .activity-item {
      position: relative;
      padding-left: 24px;
      margin-bottom: 8px;
      font-size: 14px;
      color: #334155;
    }
    .activity-item::before {
      content: '✓';
      position: absolute;
      left: 0;
      color: #10b981;
      font-weight: bold;
    }

    .footer {
      margin-top: 48px;
      border-top: 1px solid #e2e8f0;
      padding-top: 24px;
      text-align: center;
      font-size: 12px;
      color: #64748b;
    }
    .qr-badge {
      display: inline-block;
      margin-top: 12px;
      background: #0f172a;
      color: #ffffff;
      padding: 8px 16px;
      border-radius: 8px;
      font-weight: 700;
      font-size: 11px;
    }

    @media print {
      body { padding: 20px; }
      .no-print { display: none; }
    }
  </style>
</head>
<body>
  <div class="no-print" style="margin-bottom: 20px; text-align: right;">
    <button onclick="window.print()" style="background:#10b981; color:white; border:none; padding:12px 24px; border-radius:8px; font-size:14px; font-weight:700; cursor:pointer;">🖨️ Imprimir ou Salvar PDF</button>
  </div>

  <div class="header">
    <div class="brand">
      <img src="${window.location.origin}/maya-avatar.png" class="avatar-img" alt="Maya Avatar" onerror="this.src='/maya-avatar.png'" />
      <div class="title-box">
        <h1>Roteiro Personalizado — Maya AI</h1>
        <p>Assistente Oficial de Viagem • Descubra o Brasil</p>
      </div>
    </div>
    <div style="text-align: right;">
      <span style="font-size:12px; font-weight:700; color:#64748b;">GERADO EM</span>
      <p style="font-size:14px; font-weight:800; color:#0f172a;">${new Date().toLocaleDateString('pt-BR')}</p>
    </div>
  </div>

  <div class="meta-card">
    <div class="meta-item">
      <label>Destino</label>
      <span>📍 ${data.destination}</span>
    </div>
    <div class="meta-item">
      <label>Duração</label>
      <span>🗓️ ${data.daysCount} Dias</span>
    </div>
    ${data.totalBudget ? `
    <div class="meta-item">
      <label>Orçamento Estimado</label>
      <span>💰 ${data.totalBudget}</span>
    </div>` : ''}
    ${data.weatherInfo ? `
    <div class="meta-item">
      <label>Previsão do Tempo</label>
      <span>☀️ ${data.weatherInfo}</span>
    </div>` : ''}
  </div>

  <div class="section-title">Programação Dia a Dia</div>

  ${data.days.map(d => `
    <div class="day-card">
      <div class="day-header">
        <span class="day-badge">DIA ${d.dayNumber}</span>
        <span class="day-title">${d.title}</span>
      </div>
      <p style="font-size: 13px; color: #475569; margin-bottom: 10px;">${d.description}</p>
      <ul class="activity-list">
        ${d.activities.map(act => `<li class="activity-item">${act}</li>`).join('')}
      </ul>
    </div>
  `).join('')}

  ${data.tips && data.tips.length > 0 ? `
    <div class="section-title" style="margin-top: 32px;">Dicas Especiais da Maya</div>
    <div class="day-card" style="background:#f8fafc;">
      <ul class="activity-list">
        ${data.tips.map(t => `<li class="activity-item" style="margin-bottom:8px;">${t}</li>`).join('')}
      </ul>
    </div>
  ` : ''}

  <div class="footer">
    <p>Este roteiro foi criado com Inteligência Artificial pela <strong>Maya</strong> para o app <strong>Descubra o Brasil</strong>.</p>
    <div class="qr-badge">INSTALE O APP E NAVEGUE EM 3D: descubraobrasil.com.br</div>
  </div>

  <script>
    window.onload = function() {
      setTimeout(function() {
        window.print();
      }, 500);
    };
  </script>
</body>
</html>
  `;

  printWindow.document.write(htmlContent);
  printWindow.document.close();
}
