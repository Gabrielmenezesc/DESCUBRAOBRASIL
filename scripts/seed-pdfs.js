const fs = require('fs');
const path = require('path');

const dir = path.join(process.cwd(), 'public', 'pdfs');
if (!fs.existsSync(dir)){
    fs.mkdirSync(dir, { recursive: true });
}

const titles = [
    'rio-de-janeiro-em-4-dias', 
    'brasilia-alem-do-basico', 
    'gramado-romantico', 
    'salvador-cultural', 
    'bonito-sem-erro', 
    'foz-em-familia', 
    'fernando-de-noronha-premium', 
    'lencois-na-melhor-epoca', 
    'chapada-aventura-leve', 
    'brasil-economico'
];

titles.forEach(t => {
    const filePath = path.join(dir, `${t}.pdf`);
    const content = `Descubra o Brasil - Guia Premium: ${t}\n\nEste é um guia exclusivo da Maya IA para assinantes Premium.\nRoteiro completo, mapas e dicas offline!\n\n(Este é um arquivo de demonstração da plataforma Premium)`;
    fs.writeFileSync(filePath, content);
    console.log(`Created: ${filePath}`);
});
