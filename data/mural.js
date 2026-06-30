// Arquivo de dados do Mural de Contratos - Nippon Era
const initialMissions = [
  {
    id: "missao-bandidos",
    title: "Ameaça na Estrada",
    description: "Bandidos do Clã sem Brasão rondam o Mercado de Okami, extorquindo mercadores locais. Mostre que o mercado ainda tem dentes.",
    difficulty: "Perigosa",
    timeEstimate: "Uma noite de vigília",
    requirementText: "Exige ter 1 arma no inventário (Espada, Machado ou Arco)",
    reward: 120,
    reputationReward: -0.02,
    requiredType: "category",
    requiredValue: "Armas",
    consumeItem: false
  },
  {
    id: "missao-pao",
    title: "Provisões para o Monge",
    description: "O monge que habita as ruínas do sul está sem provisões há dias. Entregue rações de campanha para ele em segredo.",
    difficulty: "Fácil",
    timeEstimate: "Meio dia de marcha",
    requirementText: "Exige 1 'Pão Escuro de Campanha' (será consumido)",
    reward: 80,
    reputationReward: -0.01,
    requiredType: "item",
    requiredValue: "pao-campanha",
    consumeItem: true
  },
  {
    id: "missao-selo",
    title: "O Selo Violado de Sasa",
    description: "O antigo selo do Santuário de Sasa foi violado por saqueadores. Precisamos de um catalisador espiritual para restaurar a barreira.",
    difficulty: "Mortal",
    timeEstimate: "Três sóis de rito",
    requirementText: "Exige 'Anel da Brasa Fria' ou 'Selo do Monge Cego' (será consumido)",
    reward: 260,
    reputationReward: -0.04,
    requiredType: "item",
    requiredValue: "anel-brasa,selo-monge",
    consumeItem: true
  },
  {
    id: "missao-fuga",
    title: "A Fuga do Mensageiro Oda",
    description: "Um aliado do Clã Oda está encurralado na muralha leste pelas sentinelas. Forneça uma corda para que ele escape sob a névoa.",
    difficulty: "Moderada",
    timeEstimate: "Uma lua de fuga",
    requirementText: "Exige 1 'Corda de Carrasco' (será consumida)",
    reward: 110,
    reputationReward: -0.02,
    requiredType: "item",
    requiredValue: "corda-carrasco",
    consumeItem: true
  },
  {
    id: "missao-chave",
    title: "O Cofre do Xogunato",
    description: "Um cofre reforçado foi abandonado nas ruínas de Eldrath. Seus selos indicam pertencer ao Xogunato. Encontre uma forma de abri-lo.",
    difficulty: "Perigosa",
    timeEstimate: "Um dia de trabalho",
    requirementText: "Exige 1 'Chave Sem Fechadura' (será consumida)",
    reward: 150,
    reputationReward: -0.03,
    requiredType: "item",
    requiredValue: "chave-sem-fechadura",
    consumeItem: true
  }
];

// Modelos narrativos para geração de avisos
const muralTemplates = {
  intro: [
    "Atenção, contratantes do Mercado de Okami.",
    "Um chamado nas sombras de Tensho:",
    "Selado sob o sangue do Clã sem Brasão:",
    "Avisos de Okami. Contratos sob a lei das ruas:"
  ],
  difficulties: {
    "Fácil": "Assunto menor, mas exige discrição.",
    "Moderada": "Olhos abertos. O perigo espreita nas esquinas.",
    "Perigosa": "Aço afiado e passos firmes são obrigatórios.",
    "Mortal": "Apenas para aqueles que já fizeram as pazes com seus ancestrais."
  }
};

function generateMissionNarrative(mission) {
  if (mission.description && mission.description.trim() !== "") {
    return mission.description;
  }
  
  // Combinação dinâmica
  const intros = muralTemplates.intro;
  let hash = 0;
  const titleStr = mission.title || "";
  for (let i = 0; i < titleStr.length; i++) {
    hash += titleStr.charCodeAt(i);
  }
  const intro = intros[hash % intros.length];
  const diffNote = muralTemplates.difficulties[mission.difficulty] || "";
  
  return `${intro} Para o contrato de "${mission.title}", buscamos um viajante disposto. ${diffNote} O pagamento de ${mission.reward} moedas está garantido por Soiren Kisuke no Mercado.`;
}

// Estado dinâmico das missões (carregado do localStorage se existir)
let muralMissions = [];
