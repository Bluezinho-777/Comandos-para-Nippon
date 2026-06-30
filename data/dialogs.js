// Arquivo de dados de diálogos do NPC Soiren Kisuke - Nippon Era
const defaultNpcLines = [
  "Escolha bem, viajante. Nem todo brilho vem do ouro.",
  "Tenho ferro, histórias e uma paciência que está em promoção hoje.",
  "Olhe à vontade. Só não encare a chave por muito tempo, ela encara de volta.",
  "Se algo sussurrar seu nome, me avise. Eu cobro extra por mercadoria dramática."
];

const idleNpcLines = [
  "Vai ficar parado aí? A loja não se vigia sozinha, apesar dos meus pedidos aos deuses.",
  "Se estiver pensando em roubar, pense mais alto. Eu gosto de rir também.",
  "Eu podia estar tomando chá, mas estou aqui olhando você olhar minhas prateleiras.",
  "Mercadoria parada junta pó. Cliente parado junta suspeita.",
  "Tosse de vendedor: cof cof... compre algo... cof cof."
];

const npcHoverLines = [
  "Chegue mais perto. Algumas mercadorias só falam quando alguém escuta.",
  "Não mordo, viajante. Os preços talvez.",
  "Quer conselho? Pergunte rápido antes que eu lembre que sou ocupado.",
  "Se veio por rumor, sente. Se veio por desconto, continue em pé."
];

const npcImages = {
  normal: "assets/img/NPC1.png",
  goods: "assets/img/NPC2.png",
  talk: "assets/img/NPC3.png"
};

const dialogIntroLines = [
  "Bem-vindo. Procura takoyaki, artefatos espirituais ou uma resposta que vai te dar dor de cabeça?",
  "Ah. Você chegou exatamente quando eu esperava. Isso é conveniente, não acha?",
  "Soiren Kisuke, vendedor ambulante. O resto dos títulos costuma atrapalhar os preços."
];

const dialogTree = {
  main: {
    npcQuestion: "O que vai querer saber de Kisuke-san?",
    options: [
      {
        label: "Quem é você?",
        next: "identity",
        priceEffect: -0.02,
        answers: [
          "Sou Soiren Kisuke. Alguns dizem Kisuke-san; os irritantes dizem 'o homem que sabe demais'.",
          "Hoje sou lojista. Ontem talvez fosse conselheiro. Amanhã, se me pagarem bem, vendo takoyaki.",
          "Humano, quarenta e quatro anos, costas de cinquenta e paciência de monge endividado."
        ]
      },
      {
        label: "Mostre os artefatos",
        next: "artifacts",
        priceEffect: 0.01,
        answers: [
          "Artefatos espirituais não gostam de compradores apressados. Felizmente, eu gosto de moedas.",
          "Tenho coisas que cortam carne, coisas que cortam destino e uma tigela que só corta fome.",
          "Se algo na prateleira sussurrar seu nome, finja que não ouviu. Eu cobro mais quando há intimidade."
        ]
      },
      {
        label: "Algum segredo?",
        next: "secrets",
        priceEffect: 0.03,
        answers: [
          "Segredos são como facas: quem pede para ver a lâmina raramente gosta do brilho.",
          "Tenho mapas, profecias e fórmulas. Também tenho contas para pagar, que são mais assustadoras.",
          "Quer saber demais? Excelente. Pessoas assim compram corda antes de cair no buraco."
        ]
      },
      {
        label: "Adeus",
        close: true,
        priceEffect: 0,
        answers: [
          "Vá com cuidado. E volte com moedas, se ainda tiver mãos.",
          "Que seus passos sejam leves e suas dívidas mais leves ainda.",
          "Até a próxima. Se eu desaparecer por meses, não leve para o pessoal."
        ]
      }
    ]
  },
  identity: {
    npcQuestion: "Então, qual parte de mim te incomoda mais?",
    options: [
      {
        label: "Você sabe demais.",
        next: "identity_knowledge",
        priceEffect: 0.04,
        answers: [
          "Saber demais é apenas lembrar do que os outros fizeram questão de esquecer.",
          "Eu coleciono informação como outros colecionam espadas. A diferença é que a minha corta antes.",
          "Há séculos que não aparecem nos registros oficiais. Mas aparecem nos meus cadernos."
        ]
      },
      {
        label: "Por que não lidera?",
        next: "identity_power",
        priceEffect: -0.03,
        answers: [
          "Porque liderança é uma coleira dourada. Muito bonita, muito apertada.",
          "O Xogunato já insistiu. Eu já recusei. Repetimos isso até todos ficarem constrangidos.",
          "Quem lidera precisa ficar parado. Eu prefiro aparecer exatamente onde não deveria."
        ]
      },
      {
        label: "Onde você mora?",
        next: "identity_home",
        priceEffect: 0.02,
        answers: [
          "Ninguém sabe. Eu incluso, dependendo da semana.",
          "Em qualquer lugar onde a chuva não molhe meus cadernos e o chá ainda esteja quente.",
          "Casa é um conceito perigoso. Gente com casa recebe visitas indesejadas."
        ]
      }
    ]
  },
  artifacts: {
    npcQuestion: "Artefatos exigem respeito. Ou pelo menos mãos limpas.",
    options: [
      {
        label: "Fale da Suibokuga.",
        next: "artifact_sword",
        priceEffect: 0.05,
        answers: [
          "Suibokuga. Pintura em tinta e água. Uma Meito que entende melhor o mundo quando ele borra.",
          "O comando? 'Pinte o mundo, Suibokuga.' Eu não recomendo dizer isso dentro de loja pequena.",
          "Ela não corta só matéria. Em vez disso, convence a forma das coisas a aceitar outro desenho."
        ]
      },
      {
        label: "O que é Tenpitsu?",
        next: "artifact_tenpitsu",
        priceEffect: 0.04,
        answers: [
          "Tenpitsu, o Pincel Celestial. Uma técnica para quem acha que a realidade tem margem para correção.",
          "Com tinta suficiente, vontade suficiente e péssimo senso de autopreservação, quase tudo vira rascunho.",
          "Se você desenha uma porta no destino, cuidado. Algo pode desenhar você de volta."
        ]
      },
      {
        label: "Quero algo seguro.",
        next: "artifact_safe",
        priceEffect: -0.04,
        answers: [
          "Seguro? Tenho pão. Talvez. Ele já venceu uma guerra contra três dentes.",
          "Segurança é uma mercadoria rara. Mas clientes sensatos recebem desconto de sobrevivência.",
          "Posso vender uma corda. Quando tudo dá errado, corda vira plano, desculpa ou fuga."
        ]
      }
    ]
  },
  secrets: {
    npcQuestion: "Segredos pequenos são baratos. Os grandes cobram de volta.",
    options: [
      {
        label: "Santuário Sasa?",
        next: "secret_sasa",
        priceEffect: 0.04,
        answers: [
          "Sasa é um santuário para quem sabe ajoelhar sem obedecer.",
          "Eu não sou afiliado. Oficialmente. Secretamente, essa frase já disse demais.",
          "Se alguém perguntar, você ouviu o nome Sasa de um peixeiro bêbado. Não de mim."
        ]
      },
      {
        label: "E o Clã Oda?",
        next: "secret_oda",
        priceEffect: 0.06,
        answers: [
          "Oda é um nome que abre portas e fecha gargantas. Cuidado ao pronunciar.",
          "Algumas alianças são correntes. Outras são linhas de pipa. Eu prefiro as que posso cortar.",
          "Eu entrego pacotes, conselhos e problemas. Para Oda, a ordem costuma variar."
        ]
      },
      {
        label: "Mostre os cadernos.",
        next: "secret_books",
        priceEffect: 0.08,
        answers: [
          "Meus cadernos contêm mapas, profecias, fórmulas e recibos. Os recibos são os mais perigosos.",
          "Uma página errada muda uma vila. Duas mudam uma guerra. Três fazem um vendedor subir preço.",
          "Você não quer ver meus cadernos. Quer sobreviver ao que eles confirmariam."
        ]
      }
    ]
  },
  identity_knowledge: {
    npcQuestion: "Se eu te desse uma verdade antiga, o que faria com ela?",
    options: [
      {
        label: "Guardaria em silêncio.",
        next: "main",
        priceEffect: -0.06,
        answers: [
          "Sábio. Silêncio é a fechadura mais barata.",
          "Gosto de clientes que não vendem segredo por aplauso.",
          "Então leve um desconto. Discrição também é moeda."
        ]
      },
      {
        label: "Usaria contra inimigos.",
        next: "main",
        priceEffect: 0.05,
        answers: [
          "Prático. Também previsível. Previsibilidade encarece mercadoria.",
          "Você transforma verdade em arma. Natural, triste e lucrativo.",
          "Então compre bainha para a língua. Vai precisar."
        ]
      },
      {
        label: "Perguntaria a fonte.",
        next: "main",
        priceEffect: 0.02,
        answers: [
          "A fonte ainda respira. Isso é tudo que você precisa saber.",
          "Curioso demais. Ainda assim, melhor que arrogante.",
          "Fontes secam quando nomes são ditos alto."
        ]
      }
    ]
  },
  identity_power: {
    npcQuestion: "Poder na mão certa faz o que, viajante?",
    options: [
      {
        label: "Protege os fracos.",
        next: "main",
        priceEffect: -0.05,
        answers: [
          "Bonito. Ingênuo, talvez. Mas bonito merece desconto.",
          "Se acredita nisso, compre armadura antes que a fé cobre juros.",
          "Há bondade em você. Terrível defeito para longas viagens."
        ]
      },
      {
        label: "Compra obediência.",
        next: "main",
        priceEffect: 0.07,
        answers: [
          "Falou como alguém que já contou moedas no escuro.",
          "Obediência comprada sempre pede troco com faca.",
          "Nesse caso, meus preços acabaram de reconhecer seu método."
        ]
      },
      {
        label: "Corrompe qualquer um.",
        next: "main",
        priceEffect: 0.01,
        answers: [
          "Qualquer um? Não. Alguns já chegam prontos.",
          "Cínico, mas não errado o bastante para ser divertido.",
          "Uma resposta honesta. Não barata, mas honesta."
        ]
      }
    ]
  },
  identity_home: {
    npcQuestion: "Por que você quer saber onde um velho lojista dorme?",
    options: [
      {
        label: "Quero confiar em você.",
        next: "main",
        priceEffect: -0.04,
        answers: [
          "Confiança comprada em loja costuma vir rachada.",
          "Ainda assim, aprecio a tentativa. Um pequeno desconto.",
          "Confie no meu estoque. Em mim, apenas o suficiente."
        ]
      },
      {
        label: "Quero te encontrar depois.",
        next: "main",
        priceEffect: 0.03,
        answers: [
          "Eu apareço quando necessário. Isso irrita todo mundo, inclusive eu.",
          "Se precisar me achar, compre algo estranho e espere o problema chegar.",
          "Encontrar-me demais costuma ser sinal de desastre."
        ]
      },
      {
        label: "Só curiosidade.",
        next: "main",
        priceEffect: 0.01,
        answers: [
          "Curiosidade é um rato elegante roendo a porta do destino.",
          "Então alimente-a pouco. Ela cresce rápido.",
          "Curiosidade não é crime. Ainda."
        ]
      }
    ]
  },
  artifact_sword: {
    npcQuestion: "Se Suibokuga pintasse seu caminho, que cor dominaria?",
    options: [
      {
        label: "Azul de calma.",
        next: "main",
        priceEffect: -0.03,
        answers: [
          "Calma é rara. Clientes raros recebem respeito.",
          "Azul combina com quem pensa antes de sangrar.",
          "Que assim seja. Preços um pouco mais mansos."
        ]
      },
      {
        label: "Vermelho de batalha.",
        next: "main",
        priceEffect: 0.06,
        answers: [
          "Batalha sempre suja a mercadoria e minha paciência.",
          "Vermelho vende bem. Especialmente curativos.",
          "Nesse tom, tudo fica mais caro. Inclusive erros."
        ]
      },
      {
        label: "Preto de segredo.",
        next: "main",
        priceEffect: 0.02,
        answers: [
          "Preto cobre manchas e nomes. Útil.",
          "Segredos gostam de você. Lamento.",
          "Uma cor excelente para contratos que ninguém admite."
        ]
      }
    ]
  },
  artifact_tenpitsu: {
    npcQuestion: "O que você reescreveria se pudesse tocar o rascunho do mundo?",
    options: [
      {
        label: "Meu próprio destino.",
        next: "main",
        priceEffect: -0.02,
        answers: [
          "Ambicioso, mas pessoal. A loja respeita metas pequenas.",
          "Cuidado. Destino reescrito costuma cobrar revisão.",
          "Tenho tinta para isso. Não tenho garantia."
        ]
      },
      {
        label: "A história de Nippon.",
        next: "main",
        priceEffect: 0.08,
        answers: [
          "Frase cara. Muito cara.",
          "Quem fala em reescrever países geralmente compra no atacado.",
          "Nippon já sangrou por menos. Meus preços também."
        ]
      },
      {
        label: "Nada. É perigoso.",
        next: "main",
        priceEffect: -0.05,
        answers: [
          "Finalmente alguém com instinto de preservação.",
          "Essa resposta salvou mais gente que Bankai mal usado.",
          "Sensatez. Vou fingir que não gostei e baixar um pouco."
        ]
      }
    ]
  },
  artifact_safe: {
    npcQuestion: "Segurança para você significa fugir, resistir ou negociar?",
    options: [
      {
        label: "Fugir vivo.",
        next: "main",
        priceEffect: -0.03,
        answers: [
          "Vivo é a palavra importante. Gosto dela.",
          "Corda, comida e orgulho pequeno. Kit perfeito.",
          "Sobreviventes voltam para comprar de novo. Desconto aprovado."
        ]
      },
      {
        label: "Resistir firme.",
        next: "main",
        priceEffect: 0.01,
        answers: [
          "Então armadura. E talvez uma prece que não desafine.",
          "Firmeza é boa até virar teimosia com capacete.",
          "Tenho cota de escamas rubras olhando para você."
        ]
      },
      {
        label: "Negociar sempre.",
        next: "main",
        priceEffect: -0.04,
        answers: [
          "Ah, um colega de ofício. Quase emocionante.",
          "Negociadores vivem mais quando sabem quando calar.",
          "Por respeito profissional, desconto pequeno. Pequeno."
        ]
      }
    ]
  },
  secret_sasa: {
    npcQuestion: "Se Sasa chamasse, você obedeceria, investigaria ou fugiria?",
    options: [
      {
        label: "Obedeceria.",
        next: "main",
        priceEffect: 0.04,
        answers: [
          "Obediência assusta em gente viva.",
          "Sasa não precisa de joelhos rápidos. Precisa de olhos abertos.",
          "Com essa resposta, recomendo comprar proteção."
        ]
      },
      {
        label: "Investigaria.",
        next: "main",
        priceEffect: -0.02,
        answers: [
          "Bom. Curiosidade com botas é melhor que fé cega.",
          "Investigue pelas laterais. O centro costuma morder.",
          "Um desconto para quem faz perguntas antes de promessas."
        ]
      },
      {
        label: "Fugiria.",
        next: "main",
        priceEffect: -0.01,
        answers: [
          "Honesto. Sasa também respeita pernas funcionais.",
          "Fuga é estratégia quando o mapa ainda não foi desenhado.",
          "Leve comida. Fuga com fome vira arrependimento."
        ]
      }
    ]
  },
  secret_oda: {
    npcQuestion: "Oda oferece uma bolsa pesada. O que você entrega?",
    options: [
      {
        label: "Informação falsa.",
        next: "main",
        priceEffect: 0.07,
        answers: [
          "Corajoso. Ou alérgico a viver.",
          "Mentir para Oda é vender fogo em caixa de papel.",
          "Vou aumentar os preços antes que sua sorte respingue."
        ]
      },
      {
        label: "Meu serviço.",
        next: "main",
        priceEffect: 0.03,
        answers: [
          "Profissional. Perigoso, mas profissional.",
          "Serviço vendido precisa de limite. Sem limite vira coleira.",
          "Nesse caso, compre ferramenta confiável."
        ]
      },
      {
        label: "Nada. Recuso.",
        next: "main",
        priceEffect: -0.05,
        answers: [
          "Recusar poder exige coluna. Ou completa falta de imaginação.",
          "Gosto de quem sabe dizer não para moeda grande.",
          "Um desconto. Não conte a Oda."
        ]
      }
    ]
  }
};

// --- DIÁLOGOS DA LOJA MÁGICA (NPC EREMITA GENZO) ---

const defaultMagicNpcLines = [
  "A bruma sussurra segredos antigos. O que você procura no santuário?",
  "Tenho essências, pergaminhos e mistérios que desafiam o Xogunato.",
  "Estrelas caídas e pó de sonhos. Tudo tem um preço na névoa.",
  "As runas nas paredes nos observam. Compre algo antes que elas se cansem."
];

const idleMagicNpcLines = [
  "O fluxo astral está agitado hoje... ou é só você me encarando?",
  "A paciência do eremita é longa, mas as poções não se vendem sozinhas.",
  "Se veio para meditar, a floresta é logo ali. Se veio comprar, sinta-se em casa.",
  "Você está parado como uma estátua rúnica. Falta-lhe energia?"
];

const magicNpcHoverLines = [
  "Aproxime-se. As estrelas revelam boas escolhas para você.",
  "Não tema o poder do vazio. Tema apenas o saldo da sua essência.",
  "Procura poder ou proteção? Eu tenho ambos, pelo preço certo.",
  "A bruma se dissipa para revelar o que o seu destino necessita."
];

const magicDialogIntroLines = [
  "Saudações, viajante das brumas. Procura essências divinas, runas antigas ou uma revelação astral?",
  "O vento me disse que você viria. Ou talvez tenham sido os espíritos. Tanto faz, as mercadorias são reais.",
  "Genzo, o eremita rúnico, a seu dispor. Moedas de ouro não têm poder por aqui, apenas essências."
];

const dialogTreeMagic = {
  main: {
    npcQuestion: "O que deseja indagar a Genzo-sama nesta noite?",
    options: [
      {
        label: "Quem é você?",
        next: "identity",
        priceEffect: -0.02,
        answers: [
          "Sou Genzo, o Monge das Brumas. Alguns me chamam de guardião das runas, outros apenas de louco.",
          "Um viajante do plano espiritual que resolveu ancorar as cinzas neste templo abandonado.",
          "Apenas um eremita com dores nas articulações e muito conhecimento sobre o Vazio."
        ]
      },
      {
        label: "Fale sobre a Névoa",
        next: "secrets",
        priceEffect: 0.03,
        answers: [
          "A névoa não é inimiga. Ela apenas esconde o que a mente não está pronta para aceitar.",
          "Há um véu entre nosso mundo e o plano dos Yokai. Eu sou a costura desse véu.",
          "Quer ver através da bruma? Compre um amuleto. Ver de graça custa o juízo."
        ]
      },
      {
        label: "Encantamentos?",
        next: "artifacts",
        priceEffect: 0.01,
        answers: [
          "O fluxo de essência responde bem aos que buscam com respeito. Escolha com sabedoria.",
          "Cada runa carrega o eco de uma constelação. O preço é pago com a energia da sua alma.",
          "O vazio tem olhos e ouvidos. Mas estas prateleiras têm soluções."
        ]
      },
      {
        label: "Partir",
        close: true,
        priceEffect: 0,
        answers: [
          "Que a luz das runas guie seus passos na escuridão.",
          "Cuidado com os Yokai no caminho de volta. Eles farejam essência fresca.",
          "Até que as estrelas se alinhem novamente."
        ]
      }
    ]
  },
  identity: {
    npcQuestion: "Deseja mesmo conhecer os segredos do eremita?",
    options: [
      {
        label: "Conversa com espíritos?",
        next: "identity_spirits",
        priceEffect: 0.04,
        answers: [
          "Eles falam bastante. A maioria só reclama do frio e de como a eternidade é monótona.",
          "Eles não usam palavras. Eles usam arrepios na espinha. E hoje eles estão sussurrando sobre você.",
          "Os Yokai são apenas vizinhos barulhentos. Se você não os incomodar, eles apenas te observam."
        ]
      },
      {
        label: "Como veio parar aqui?",
        next: "identity_history",
        priceEffect: -0.03,
        answers: [
          "Segui uma fênix de fogo azul há vinte invernos. A ave sumiu, as brumas ficaram, e eu montei acampamento.",
          "O templo me escolheu. Quando os antigos monges fugiram da guerra, alguém precisava manter as chamas rúnicas acesas."
        ]
      },
      {
        label: "Voltar",
        next: "main",
        priceEffect: 0,
        answers: ["Voltemos ao que realmente importa."]
      }
    ]
  },
  identity_spirits: {
    npcQuestion: "Eles estão nos observando agora. Isso te assusta?",
    options: [
      {
        label: "Sim, um pouco.",
        next: "main",
        priceEffect: -0.02,
        answers: [
          "O medo é natural. Ele mantém o sangue correndo. Apenas não demonstre hesitação.",
          "Um amuleto de olho de gato resolverá seu desconforto. Está na minha prateleira."
        ]
      },
      {
        label: "Não temo o invisível.",
        next: "main",
        priceEffect: 0.03,
        answers: [
          "A coragem dos mortais é fascinante. Ou é coragem, ou é pura tolice. O tempo dirá."
        ]
      }
    ]
  },
  identity_history: {
    npcQuestion: "Muitos buscam o templo pela paz, mas encontram apenas ecos.",
    options: [
      {
        label: "O Xogunato te conhece?",
        next: "main",
        priceEffect: 0.05,
        answers: [
          "Eles tentaram cobrar impostos sobre o templo uma vez. Enviei três espectros de raposa para o forte deles. Nunca mais voltaram.",
          "Os cobradores do Xogunato não gostam de bruma fria. É ruim para as armaduras e para a coragem."
        ]
      },
      {
        label: "Voltar",
        next: "main",
        priceEffect: 0,
        answers: ["Deixemos o passado com os mortos."]
      }
    ]
  },
  artifacts: {
    npcQuestion: "Encantamentos e relíquias exigem grande responsabilidade.",
    options: [
      {
        label: "A espada rúnica é segura?",
        next: "main",
        priceEffect: 0.02,
        answers: [
          "Para quem a empunha, sim. Para quem está do outro lado, é um pesadelo de prata e luz violeta.",
          "Nenhuma arma mágica é totalmente segura. Ela consome um pouco de quem a usa. Mas corta que é uma beleza."
        ]
      },
      {
        label: "E a runa da névoa?",
        next: "main",
        priceEffect: -0.01,
        answers: [
          "Ela distorce a percepção ao seu redor. Os guardas olharão diretamente para você e verão apenas fumaça e vento.",
          "Use-a com sutileza. Se correr fazendo barulho, a runa não vai abafar seus passos pesados."
        ]
      },
      {
        label: "Voltar",
        next: "main",
        priceEffect: 0,
        answers: ["Procure nas prateleiras com seus próprios olhos."]
      }
    ]
  },
  secrets: {
    npcQuestion: "As brumas escondem verdades que muitos preferem enterrar.",
    options: [
      {
        label: "E o Clã sem Brasão?",
        next: "main",
        priceEffect: 0.03,
        answers: [
          "Eles andam pelas sombras do Mercado de Okami. Soiren Kisuke sabe como contatá-los. Eu prefiro a companhia dos espíritos.",
          "Eles são homens perdidos buscando um propósito. Aqui nas brumas, só há propósitos perdidos buscando homens."
        ]
      },
      {
        label: "Qual o segredo da fênix?",
        next: "main",
        priceEffect: 0.04,
        answers: [
          "Ela renasce das cinzas, sim. Mas a dor do fogo é real a cada ciclo. A imortalidade é uma maldição disfarçada de dádiva.",
          "O pó de fênix que vendo é coletado com respeito. Não peça para ver a criatura, ela não gosta de visitas."
        ]
      },
      {
        label: "Voltar",
        next: "main",
        priceEffect: 0,
        answers: ["Algumas cortinas de fumaça devem permanecer fechadas."]
      }
    ]
  }
};
