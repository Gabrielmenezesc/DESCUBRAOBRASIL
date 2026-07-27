const fs = require('fs');
const path = require('path');

const states = [
  { code: 'AC', name: 'Acre' }, { code: 'AL', name: 'Alagoas' }, { code: 'AP', name: 'Amapá' },
  { code: 'AM', name: 'Amazonas' }, { code: 'BA', name: 'Bahia' }, { code: 'CE', name: 'Ceará' },
  { code: 'DF', name: 'Distrito Federal' }, { code: 'ES', name: 'Espírito Santo' }, { code: 'GO', name: 'Goiás' },
  { code: 'MA', name: 'Maranhão' }, { code: 'MT', name: 'Mato Grosso' }, { code: 'MS', name: 'Mato Grosso do Sul' },
  { code: 'MG', name: 'Minas Gerais' }, { code: 'PA', name: 'Pará' }, { code: 'PB', name: 'Paraíba' },
  { code: 'PR', name: 'Paraná' }, { code: 'PE', name: 'Pernambuco' }, { code: 'PI', name: 'Piauí' },
  { code: 'RJ', name: 'Rio de Janeiro' }, { code: 'RN', name: 'Rio Grande do Norte' }, { code: 'RS', name: 'Rio Grande do Sul' },
  { code: 'RO', name: 'Rondônia' }, { code: 'RR', name: 'Roraima' }, { code: 'SC', name: 'Santa Catarina' },
  { code: 'SP', name: 'São Paulo' }, { code: 'SE', name: 'Sergipe' }, { code: 'TO', name: 'Tocantins' }
];

const categories = ["Turismo", "Cidades", "Eventos", "Clima", "Tecnologia", "Destinos", "Gastronomia", "Hospedagem"];

const baseImages = [
  "https://images.unsplash.com/photo-1483729558449-99ef09a8c325?q=80&w=800",
  "https://images.unsplash.com/photo-1629813583279-d581297d02dc?q=80&w=800",
  "https://images.unsplash.com/photo-1559128010-7c1ad6e1b6a5?q=80&w=800",
  "https://images.unsplash.com/photo-1433086966358-54859d0ed716?q=80&w=800",
  "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=800",
  "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=800",
  "https://images.unsplash.com/photo-1597487124413-82a4c4e8de1e?q=80&w=800",
  "https://images.unsplash.com/photo-1518638150340-f706e86654de?q=80&w=800"
];

function generateSlug(text) {
  return text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
}

const templates = [
  { cat: "Turismo", title: "Novas rotas de ecoturismo são inauguradas no interior de {STATE}" },
  { cat: "Destinos", title: "Os 5 destinos mais visitados em {STATE} nesta temporada" },
  { cat: "Gastronomia", title: "Festival gastronômico de {STATE} atrai milhares de turistas" },
  { cat: "Eventos", title: "Maior evento cultural de {STATE} confirma datas para este ano" },
  { cat: "Hospedagem", title: "Rede hoteleira em {STATE} bate recorde de ocupação" },
  { cat: "Clima", title: "Previsão do tempo favorece turismo no litoral e serras de {STATE}" },
  { cat: "Tecnologia", title: "Aplicativo revoluciona a forma de visitar parques em {STATE}" },
  { cat: "Cidades", title: "Capital de {STATE} é eleita uma das melhores cidades para visitar" },
  { cat: "Turismo", title: "Governo de {STATE} anuncia novos investimentos em infraestrutura turística" },
  { cat: "Destinos", title: "Descubra o paraíso escondido que está bombando em {STATE}" }
];

const lorem = "A região tem se destacado não apenas pela sua beleza natural, mas pela forte infraestrutura que foi desenvolvida recentemente para receber os visitantes. Restaurantes, hotéis e guias locais se prepararam para a alta temporada, oferecendo pacotes exclusivos. Segundo as autoridades locais de turismo, a expectativa é de um crescimento de 30% em relação ao ano anterior. Além disso, as iniciativas de sustentabilidade têm garantido que as belezas da região permaneçam preservadas. Os turistas que visitam relatam uma experiência inesquecível, unindo conforto, cultura e aventura em um só lugar. Se você planeja visitar, a dica é reservar com antecedência para garantir as melhores hospedagens.";

let allNews = [];
let idCounter = 1;

states.forEach(state => {
  templates.forEach((template, idx) => {
    const title = template.title.replace("{STATE}", state.name);
    const slug = generateSlug(title + `-${state.code}`);
    
    // Distribuir datas para não ser tudo agora
    const date = new Date();
    date.setDate(date.getDate() - Math.floor(Math.random() * 30));
    
    allNews.push({
      id: idCounter++,
      slug: slug,
      title: title,
      description: `Tudo o que você precisa saber sobre as novidades em ${state.name}. O setor está crescendo e trazendo oportunidades para os viajantes.`,
      content: `O cenário em ${state.name} está cada vez mais atrativo. \n\n${lorem}\n\nEm uma recente pesquisa, ${state.name} foi colocado como um dos focos principais de investimento. Não perca a chance de conferir de perto as novidades e viver essa experiência com a família e amigos.`,
      image: baseImages[Math.floor(Math.random() * baseImages.length)],
      source: "Redação Descubra o Brasil",
      publishedAt: date.toISOString(),
      state: state.code,
      category: template.cat
    });
  });
});

const outputPath = path.join(__dirname, 'noticias.json');
fs.writeFileSync(outputPath, JSON.stringify(allNews, null, 2));
console.log(`Generated ${allNews.length} news articles successfully at ${outputPath}`);
