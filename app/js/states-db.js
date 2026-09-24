/**
 * Descubra o Brasil - Banco de Dados Nacional (27 Estados)
 * Foco: "Brasil com S" - Lugares autênticos, culturais e acessíveis.
 */

const BRAZIL_STATES = [
    {
        name: "Acre", sigla: "AC", capitals: "Rio Branco",
        pois: "Parque Ambiental Chico Mendes, Memorial dos Autônomos",
        img: "https://images.unsplash.com/photo-1590001158193-79017ae7a3fd?w=500&q=80",
        lat: -9.974, lng: -67.807
    },
    {
        name: "Alagoas", sigla: "AL", capitals: "Maceió",
        pois: "Praia de Ponta Verde, Piscinas Naturais de Pajuçara",
        img: "https://images.unsplash.com/photo-1591280325350-f8674de46949?w=500&q=80",
        lat: -9.665, lng: -35.735
    },
    {
        name: "Amapá", sigla: "AP", capitals: "Macapá",
        pois: "Marco Zero (Equador), Fortaleza de São José de Macapá",
        img: "https://images.unsplash.com/photo-1605364102927-4638a74e5488?w=500&q=80",
        lat: 0.034, lng: -51.066
    },
    {
        name: "Amazonas", sigla: "AM", capitals: "Manaus",
        pois: "Teatro Amazonas, Encontro das Águas",
        img: "https://images.unsplash.com/photo-1549918831-772274945484?w=500&q=80",
        lat: -3.119, lng: -60.021
    },
    {
        name: "Bahia", sigla: "BA", capitals: "Salvador",
        pois: "Pelourinho, Elevador Lacerda, Farol da Barra",
        img: "https://images.unsplash.com/photo-1582234053258-0051187d7b12?w=500&q=80",
        lat: -12.971, lng: -38.501
    },
    {
        name: "Ceará", sigla: "CE", capitals: "Fortaleza",
        pois: "Praia de Iracema, Dragão do Mar, Jericoacoara",
        img: "https://images.unsplash.com/photo-1591280332824-343207b5ca8a?w=500&q=80",
        lat: -3.717, lng: -38.543
    },
    {
        name: "Distrito Federal", sigla: "DF", capitals: "Brasília",
        pois: "Praça dos Três Poderes, Catedral de Brasília, Eixão de Lazer",
        img: "https://images.unsplash.com/photo-1632766343003-882269a84ba7?w=500&q=80",
        lat: -15.794, lng: -47.882
    },
    {
        name: "Espírito Santo", sigla: "ES", capitals: "Vitória",
        pois: "Convento da Penha, Praia de Camburi",
        img: "https://images.unsplash.com/photo-1629239855513-424a138382d6?w=500&q=80",
        lat: -20.315, lng: -40.312
    },
    {
        name: "Goiás", sigla: "GO", capitals: "Goiânia",
        pois: "Centro Histórico de Pirenópolis, Chapada dos Veadeiros",
        img: "https://images.unsplash.com/photo-1586940003004-9721098670dc?w=500&q=80",
        lat: -16.686, lng: -49.264
    },
    {
        name: "Maranhão", sigla: "MA", capitals: "São Luís",
        pois: "Lençóis Maranhenses, Centro Histórico de São Luís",
        img: "https://images.unsplash.com/photo-1620245041285-b1a9e7011933?w=500&q=80",
        lat: -2.530, lng: -44.302
    },
    {
        name: "Mato Grosso", sigla: "MT", capitals: "Cuiabá",
        pois: "Chapada dos Guimarães, Pantanal Norte",
        img: "https://images.unsplash.com/photo-1590001007205-09c06950275c?w=500&q=80",
        lat: -15.601, lng: -56.094
    },
    {
        name: "Mato Grosso do Sul", sigla: "MS", capitals: "Campo Grande",
        pois: "Gruta do Lago Azul (Bonito), Pantanal Sul",
        img: "https://images.unsplash.com/photo-1628155930542-3c7a64e2c833?w=500&q=80",
        lat: -20.443, lng: -54.646
    },
    {
        name: "Minas Gerais", sigla: "MG", capitals: "Belo Horizonte",
        pois: "Ouro Preto, Inhotim, Mercado Central",
        img: "https://images.unsplash.com/photo-1626244101212-39d78a242f2c?w=500&q=80",
        lat: -19.916, lng: -43.934
    },
    {
        name: "Pará", sigla: "PA", capitals: "Belém",
        pois: "Mercado Ver-o-Peso, Ilha de Marajó, Alter do Chão",
        img: "https://images.unsplash.com/photo-1590001150393-596472406d9d?w=500&q=80",
        lat: -1.455, lng: -48.490
    },
    {
        name: "Paraíba", sigla: "PB", capitals: "João Pessoa",
        pois: "Farol do Cabo Branco, Pôr do Sol no Jacaré",
        img: "https://images.unsplash.com/photo-1591543620767-582626866160?w=500&q=80",
        lat: -7.119, lng: -34.845
    },
    {
        name: "Paraná", sigla: "PR", capitals: "Curitiba",
        pois: "Cataratas do Iguaçu, Jardim Botânico de Curitiba",
        img: "https://images.unsplash.com/photo-1493246507139-91e8bef99c02?w=500&q=80",
        lat: -25.428, lng: -49.273
    },
    {
        name: "Pernambuco", sigla: "PE", capitals: "Recife",
        pois: "Olinda, Porto de Galinhas, Marco Zero",
        img: "https://images.unsplash.com/photo-1586523164101-92be0f585574?w=500&q=80",
        lat: -8.057, lng: -34.882
    },
    {
        name: "Piauí", sigla: "PI", capitals: "Teresina",
        pois: "Serra da Capivara, Delta do Parnaíba",
        img: "https://images.unsplash.com/photo-1605364102927-4638a74e5488?w=500&q=80",
        lat: -5.092, lng: -42.803
    },
    {
        name: "Rio de Janeiro", sigla: "RJ", capitals: "Rio de Janeiro",
        pois: "Cristo Redentor, Pão de Açúcar, Escadaria Selarón",
        img: "https://images.unsplash.com/photo-1483729558449-99ef09a8c325?w=500&q=80",
        lat: -22.906, lng: -43.172
    },
    {
        name: "Rio Grande do Norte", sigla: "RN", capitals: "Natal",
        pois: "Morro do Careca, Praia de Pipa",
        img: "https://images.unsplash.com/photo-1591280332824-343207b5ca8a?w=500&q=80",
        lat: -5.794, lng: -35.211
    },
    {
        name: "Rio Grande do Sul", sigla: "RS", capitals: "Porto Alegre",
        pois: "Gramado, Cânion do Itaimbezinho",
        img: "https://images.unsplash.com/photo-1589307772320-d73118206f36?w=500&q=80",
        lat: -30.034, lng: -51.217
    },
    {
        name: "Rondônia", sigla: "RO", capitals: "Porto Velho",
        pois: "Estrada de Ferro Madeira-Mamoré",
        img: "https://images.unsplash.com/photo-1590001217036-79017ae7a3fd?w=500&q=80",
        lat: -8.761, lng: -63.903
    },
    {
        name: "Roraima", sigla: "RR", capitals: "Boa Vista",
        pois: "Monte Roraima, Orla Taumanan",
        img: "https://images.unsplash.com/photo-1549918831-772274945484?w=500&q=80",
        lat: 2.823, lng: -60.675
    },
    {
        name: "Santa Catarina", sigla: "SC", capitals: "Florianópolis",
        pois: "Praia da Joaquina, Beto Carrero World",
        img: "https://images.unsplash.com/photo-1590001150393-596472406d9d?w=500&q=80",
        lat: -27.595, lng: -48.548
    },
    {
        name: "São Paulo", sigla: "SP", capitals: "São Paulo",
        pois: "Avenida Paulista, Parque Ibirapuera, Vila Madalena",
        img: "https://images.unsplash.com/photo-1543059152-42b40ec5378b?w=500&q=80",
        lat: -23.550, lng: -46.633
    },
    {
        name: "Sergipe", sigla: "SE", capitals: "Aracaju",
        pois: "Cânion do Xingó, Orla de Atalaia",
        img: "https://images.unsplash.com/photo-1591280325350-f8674de46949?w=500&q=80",
        lat: -10.911, lng: -37.071
    },
    {
        name: "Tocantins", sigla: "TO", capitals: "Palmas",
        pois: "Jalapão (Fervedouros), Praça dos Girassóis",
        img: "https://images.unsplash.com/photo-1586940003004-9721098670dc?w=500&q=80",
        lat: -10.175, lng: -48.333
    }
];
