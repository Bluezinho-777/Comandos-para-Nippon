// Arquivo de dados dos Dossiês de Personagens - Nippon Era
const initialDossiers = [
  {
    id: "dossier-kisuke",
    name: "Soiren Kisuke",
    title: "Vendedor de Segredos",
    faction: "Clã sem Brasão",
    status: "Ativo",
    biography: "O enigmático guardião do Mercado de Okami. Poucos conhecem seu passado, mas seus olhos revelam que ele já viu o início e o fim de muitas dinastias. Sobreviver ao lado dele exige não fazer perguntas sobre as marcas em seu pescoço.",
    traits: "Astuto, Cauteloso, Observador",
    secrets: "Possui ligações ocultas com desertores do Clã Oda nas florestas orientais.",
    relationship: "Amigável",
    avatarUrl: "assets/img/NPC1.png",
    approval: "aprovada"
  },
  {
    id: "dossier-samurai-oda",
    name: "General Oda Nobuyuki",
    title: "Comandante da Guarnição Leste",
    faction: "Clã Oda",
    status: "Ativo",
    biography: "Guerreiro impiedoso encarregado de pacificar as rotas comerciais próximas ao Mercado de Okami. Seu nome é sinônimo de tributos pesados e punições exemplares para quem desrespeita as leis do Xogunato.",
    traits: "Cruel, Disciplinado, Orgulhoso",
    secrets: "Desconfia da lealdade de seus subalternos e teme uma rebelião interna no forte leste.",
    relationship: "Hostil",
    avatarUrl: "assets/img/NPC1.png",
    approval: "aprovada"
  }
];

// Estado dinâmico dos dossiês
let characterDossiers = [];
