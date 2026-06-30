// Arquivo de dados dos itens - Nippon Era
const archivedShopItems = [
  {
    id: "espada-brasao",
    name: "Espada do Brasão Partido",
    category: "Armas",
    rarity: "Rara",
    price: 140,
    damage: "26 corte",
    durability: "72/100",
    extra: "Peso médio",
    description: "Lâmina pesada, boa para duelos em corredores estreitos.",
    story: "Pertenceu a um capitão que quebrou o próprio brasão antes de abandonar o senhorio.",
    npcLine: "Essa espada carrega vergonha e coragem na mesma bainha. Corta melhor quando o dono não foge."
  },
  {
    id: "machado-vigia",
    name: "Machado de Vigia",
    category: "Armas",
    rarity: "Comum",
    price: 95,
    damage: "22 impacto",
    durability: "81/100",
    extra: "Quebra escudos leves",
    description: "Ferramenta de guarda, marcada por fuligem e juramentos.",
    story: "Forjado para sentinelas de muralha, virou arma quando os portões arderam por dentro.",
    npcLine: "Pouco elegante, mas muito honesto. O machado não discute com armadura."
  },
  {
    id: "arco-teixo",
    name: "Arco de Teixo Negro",
    category: "Armas",
    rarity: "Incomum",
    price: 120,
    damage: "18 perfuração",
    durability: "64/100",
    extra: "Alcance longo",
    description: "Silencioso, flexível e temido nos bosques do norte.",
    story: "Os arqueiros do norte juravam que a madeira ouvia os passos antes dos homens.",
    npcLine: "Se você ouvir a corda cantar, já é tarde para pedir desculpas."
  },
  {
    id: "anel-brasa",
    name: "Anel da Brasa Fria",
    category: "Artefatos",
    rarity: "Épica",
    price: 220,
    damage: "Nenhum",
    durability: "Indefinida",
    extra: "Resiste ao frio",
    description: "Guarda calor sem chama e pulsa perto de ruínas antigas.",
    story: "Foi retirado das cinzas de um templo onde o fogo queimava azul mesmo sob chuva.",
    npcLine: "Não esquenta a mão. Esquenta lembranças. Algumas pessoas pagam para esquecer isso."
  },
  {
    id: "selo-monge",
    name: "Selo do Monge Cego",
    category: "Artefatos",
    rarity: "Lendária",
    price: 310,
    damage: "Nenhum",
    durability: "90/100",
    extra: "Abre passagens seladas",
    description: "Um talismã de bronze usado para abrir pactos esquecidos.",
    story: "Dizem que o monge nunca enxergou portas, apenas promessas esperando uma chave.",
    npcLine: "Esse selo não abre qualquer fechadura. Ele abre aquilo que devia continuar fechado."
  },
  {
    id: "elmo-portao",
    name: "Elmo do Portão Leste",
    category: "Armaduras",
    rarity: "Incomum",
    price: 175,
    defense: "15 defesa",
    durability: "76/100",
    extra: "Protege contra atordoamento",
    description: "Amassado, confiável e quase confortável em dias frios.",
    story: "Sobreviveu ao primeiro ariete, ao segundo incêndio e a três donos teimosos.",
    npcLine: "Feio, sim. Mas se beleza parasse flecha, bardo usava coroa em batalha."
  },
  {
    id: "cota-rubra",
    name: "Cota de Escamas Rubras",
    category: "Armaduras",
    rarity: "Rara",
    price: 260,
    defense: "24 defesa",
    durability: "88/100",
    extra: "Reduz dano de fogo",
    description: "Placas sobrepostas que brilham como cinzas ao entardecer.",
    story: "Cada escama veio de armaduras derretidas depois da queda de uma casa nobre.",
    npcLine: "Boa escolha para quem pretende caminhar perto demais das chamas."
  },
  {
    id: "pao-campanha",
    name: "Pão Escuro de Campanha",
    category: "Comestíveis",
    rarity: "Comum",
    price: 18,
    healing: "12 vigor",
    durability: "3 dias",
    extra: "Sacia fome",
    description: "Duro como pedra, mas sustenta um viajante por horas.",
    story: "Receita simples de soldados: farinha, sal e a paciência de quem ainda está vivo.",
    npcLine: "Não é saboroso, mas já salvou mais heróis que muita espada polida."
  },
  {
    id: "ensopado-cebola",
    name: "Ensopado de Cebola Real",
    category: "Comestíveis",
    rarity: "Incomum",
    price: 34,
    healing: "28 vigor",
    durability: "1 dia",
    extra: "Aquece no frio",
    description: "Quente, salgado e vendido em tigelas lascadas.",
    story: "Chamam de real porque um rei faminto chorou ao comer. Talvez fosse só a cebola.",
    npcLine: "Leve dois. Um para comer, outro para lembrar que o mundo ainda tem caldo."
  },
  {
    id: "corda-carrasco",
    name: "Corda de Carrasco",
    category: "Tralhas",
    rarity: "Comum",
    price: 22,
    durability: "58/100",
    extra: "30 passos de comprimento",
    description: "Trinta passos de fibra antiga, útil para subir ou fugir.",
    story: "Foi cortada antes da sentença final. Desde então, só ajuda gente a escapar.",
    npcLine: "Corda não julga destino. Ela só pergunta se você sabe dar nó."
  },
  {
    id: "chave-sem-fechadura",
    name: "Chave Sem Fechadura",
    category: "Tralhas",
    rarity: "Misteriosa",
    price: 47,
    durability: "100/100",
    extra: "Uso desconhecido",
    description: "Ninguém sabe o que abre, por isso ainda tem valor.",
    story: "Apareceu no bolso de um mensageiro sem nome e sem memória.",
    npcLine: "Toda chave espera sua porta. Esta aqui parece esperar uma pessoa."
  }
];

// A loja ativa deve vir do banco de dados do RPG.
// Os itens arquivados ficam apenas como referência para criadores.
let shopItems = [];
