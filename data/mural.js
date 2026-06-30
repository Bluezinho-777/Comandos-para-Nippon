// Arquivo de dados do Mural de Contratos - Nippon Era
const initialMissions = [
  {
    id: "missao-bandidos",
    title: "Ameaça na Estrada",
    description: "Bandidos do Clã sem Brasão rondam o Mercado de Okami, extorquindo mercadores locais. Mostre que o mercado ainda tem dentes.",
    requirementText: "Exige ter 1 arma no inventário (Espada, Machado ou Arco)",
    reward: 120,
    checkRequirement: (inventory) => {
      return inventory.some(item => item.category === "Armas");
    },
    consumeItem: false // A arma não é perdida no combate
  },
  {
    id: "missao-pao",
    title: "Provisões para o Monge",
    description: "O monge que habita as ruínas do sul está sem provisões há dias. Entregue rações de campanha para ele em segredo.",
    requirementText: "Exige 1 'Pão Escuro de Campanha' (será consumido)",
    reward: 80,
    checkRequirement: (inventory) => {
      return inventory.some(item => item.id === "pao-campanha");
    },
    consumeItem: "pao-campanha"
  },
  {
    id: "missao-selo",
    title: "O Selo Violado de Sasa",
    description: "O antigo selo do Santuário de Sasa foi violado por saqueadores. Precisamos de um catalisador espiritual para restaurar a barreira.",
    requirementText: "Exige 'Anel da Brasa Fria' ou 'Selo do Monge Cego' (será consumido)",
    reward: 260,
    checkRequirement: (inventory) => {
      return inventory.some(item => item.id === "anel-brasa" || item.id === "selo-monge");
    },
    consumeItem: ["anel-brasa", "selo-monge"] // Consome um deles
  },
  {
    id: "missao-fuga",
    title: "A Fuga do Mensageiro Oda",
    description: "Um aliado do Clã Oda está encurralado na muralha leste pelas sentinelas. Forneça uma corda para que ele escape sob a névoa.",
    requirementText: "Exige 1 'Corda de Carrasco' (será consumida)",
    reward: 110,
    checkRequirement: (inventory) => {
      return inventory.some(item => item.id === "corda-carrasco");
    },
    consumeItem: "corda-carrasco"
  },
  {
    id: "missao-chave",
    title: "O Cofre do Xogunato",
    description: "Um cofre reforçado foi abandonado nas ruínas de Eldrath. Seus selos indicam pertencer ao Xogunato. Encontre uma forma de abri-lo.",
    requirementText: "Exige 1 'Chave Sem Fechadura' (será consumida)",
    reward: 150,
    checkRequirement: (inventory) => {
      return inventory.some(item => item.id === "chave-sem-fechadura");
    },
    consumeItem: "chave-sem-fechadura"
  }
];

// Estado dinâmico das missões (carregado do localStorage se existir)
let muralMissions = [];
