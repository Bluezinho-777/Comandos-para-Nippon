# Documento de Migracao para Outra IA - Projeto Nippon Era / Era Tensho

## 1. Resumo geral

Este projeto e uma interface web de jogo/RPG feita com HTML, CSS e JavaScript puro. O foco atual e uma experiencia de menu inicial, loja, inventario, lore e dialogo com NPC, com estetica feudal japonesa sombria, pixel art, fantasia medieval e atmosfera de mercado perigoso.

O jogo ainda esta em fase de prototipo visual/interativo, mas ja tem bastante identidade propria. A tela mais desenvolvida e a Loja, onde o jogador conversa com um vendedor chamado Soiren Kisuke, compra itens, filtra categorias, pesquisa produtos e ve o inventario crescer.

Nomes e conceitos usados ate agora:

- Nome do projeto/repositorio: `Comandos-para-Nippon` / `COMANDOS (ESCRAVOS)`.
- Nome visual do jogo: `Nippon Era`.
- Periodo/tema no menu: `ERA TENSHO`.
- Local do menu: `Mercado de Okami`.
- Frase do menu: `terra de pactos, aço e memoria`.
- Rodape do menu: `CLA SEM BRASAO · MERCADO DE OKAMI`.
- NPC principal: `Soiren Kisuke`, tambem chamado de `Kisuke-san`.

## 2. Estado atual dos arquivos

Arquivos principais:

- `index.html`: estrutura da interface, telas, menu, loja, chat, lore e inventario.
- `style.css`: toda a direcao visual, layout, animacoes, responsividade, cursor customizado, botoes, paineis e chat.
- `script.js`: logica de navegacao, loja, inventario, compra, dialogo do NPC, modificador de precos, particulas, cursor e rotacao de fundos.
- `README.md`: atualmente tem apenas os titulos `Comandos-para-Nippon` e `COMANDOS (ESCRAVOS)`.
- `scripts/colorize_manga_page.py`: script auxiliar em Python para colorir uma imagem usando Pillow. Nao faz parte direta da interface do jogo.

Quantidade aproximada de linhas:

- `index.html`: 211 linhas.
- `style.css`: 2155 linhas.
- `script.js`: 1258 linhas.
- `README.md`: 2 linhas.
- `scripts/colorize_manga_page.py`: 167 linhas.

Pastas de assets:

- `assets/`
- `assets/ui/`
- `assents.img/`
- `ideias do chat/`
- `scripts/`

Observacao importante: existe uma pasta chamada `assents.img`. Provavelmente era para ser `assets.img`, mas o codigo atual usa `assents.img` em varios caminhos. Se renomear, precisa atualizar todos os `src` e URLs.

## 3. Telas existentes

### 3.1 Menu principal

O menu principal tem:

- Logo usando `assets/ui/LOGO NOVA.png`.
- Kicker `ERA TENSHO`.
- Subtitulo `terra de pactos, aço e memoria`.
- Botoes principais:
  - Loja.
  - Itens.
  - Lore.
  - Mural, bloqueado com badge `em breve`.
- Elementos visuais decorativos:
  - Lua em meia fase.
  - Silhueta de montanhas.
  - Moldura estilo torii.
  - Botoes com rebites e caracteres japoneses/chineses decorativos.

### 3.2 Loja

A Loja e a tela principal do prototipo. Ela contem:

- Topbar com botao `Voltar` e titulo `Loja`.
- Campo de busca.
- Filtros de categoria:
  - Todos.
  - Armas.
  - Artefatos.
  - Armaduras.
  - Comestiveis.
  - Tralhas.
- Area do NPC vendedor.
- Lista de itens em cards.
- Chat inferior estilo Undertale/RPG.

Interacoes da loja:

- Clicar em um item abre/fecha detalhes.
- Passar o mouse em um item muda a fala do NPC e a imagem dele.
- Comprar item adiciona ao inventario.
- Inventario tem limite de 12 slots.
- Se o inventario estiver cheio, o NPC avisa.
- Precos podem subir ou cair conforme escolhas no dialogo.

### 3.3 Chat com NPC

O chat tem:

- Cabecalho com nome `Soiren Kisuke`.
- Status: humor, precos e estado da conversa.
- Retrato do NPC.
- Log de mensagens.
- Historico da ultima fala/escolha.
- Campo de texto livre.
- Opcoes de dialogo clicaveis.
- Acoes rapidas:
  - `Comprar item`.
  - `Fechar`.

O chat usa uma estetica parecida com Undertale: fundo preto, borda clara, texto com asterisco e falas digitadas aos poucos.

### 3.4 Lore

Tela simples com titulo `Lore` e texto:

- `A Cinza do Reino`.
- Fala sobre a queda das muralhas de Eldrath.
- Menciona pactos, mercadores, cavaleiros sem brasao, moeda, memoria, abrigo e sobrevivencia.

### 3.5 Itens / Inventario

Tela com grade de inventario:

- 12 slots.
- Comeca com 3 itens:
  - Espada do Brasao Partido.
  - Pao Escuro de Campanha.
  - Anel da Brasa Fria.
- Cada item pode abrir detalhes.
- Cada item no inventario tem acoes:
  - `Vender`.
  - `Tirar`.

Atualmente vender e tirar removem o item do inventario, mas nao existe sistema de dinheiro do jogador ainda.

## 4. Identidade visual

Direcao visual atual:

- Fantasia sombria.
- Japao feudal / era de xogunato.
- Pixel art misturado com medieval dark fantasy.
- Cores dominantes:
  - preto;
  - carvao;
  - vermelho sangue;
  - dourado envelhecido;
  - metal;
  - bege envelhecido;
  - cinzas.
- Texturas de metal e grao.
- Botoes com peso fisico, sombra e impacto.
- Interface com molduras duras, pouco arredondamento, bordas fortes.
- Atmosfera de mercado de armas, pactos, ruinas e segredos.

Fontes carregadas do Google Fonts:

- `Cinzel`
- `Inter`
- `MedievalSharp`
- `Press Start 2P`
- `Shippori Mincho`
- `VT323`
- `Pixelify Sans`

Fontes mais usadas:

- `VT323` para fala e interface de RPG.
- `Pixelify Sans` para UI.
- `Press Start 2P` para titulos/botoes com cara retrô.
- `Shippori Mincho` para toque japones/serifado.

## 5. Assets existentes

Arquivos em `assets/` e `assets/ui/`:

- `assets/cursor_hammer.png`: cursor customizado em forma de martelo.
- `assets/ui/FUNDO DOS BOTÃO.jpg`: textura/imagem usada nos botoes.
- `assets/ui/IMAGEM A SER PINTADA.png`: imagem base para colorizacao.
- `assets/ui/IMAGEM A SER PINTADA - COLORIDA.png`: imagem colorida gerada.
- `assets/ui/LOGO NOVA.png`: logo principal usada no menu.
- `assets/ui/fundo do NPC.png`: fundo do quadro do NPC.
- `assets/ui/metal-grain.png`: textura de grao/metal.
- `assets/ui/24212734-pixel-arte-martelo...png`: imagem de martelo pixel art.

Arquivos em `assents.img/`:

- `NPC1.png`: imagem normal do NPC.
- `NPC2.png`: imagem do NPC em modo mercadorias/itens.
- `NPC3.png`: imagem do NPC em modo conversa.
- `LOGO.png`: logo antigo ou alternativo.
- `Imagem colada.png`
- `Imagem colada (2).png`
- `Imagem colada (3).png`
- `Imagem colada (4).png`
- `Imagem colada (5).png`

As cinco imagens `Imagem colada...` sao usadas como fundos rotativos.

Arquivos em `ideias do chat/`:

- `chat-ux-mockup-v2.png`
- `chat-ux-mockup-v3.png`
- `chat-ux-mockup-v4.png`

Essas imagens parecem referencias/mockups para evolucao visual do chat.

## 6. Sistemas implementados em JavaScript

### 6.1 Navegacao entre telas

O HTML usa `data-screen` para identificar telas e `data-open-screen` nos botoes. A funcao `openScreen(screenName)` ativa a tela correta usando a classe `is-active`.

Telas:

- `menu`
- `shop`
- `lore`
- `items`

### 6.2 Fundos rotativos

Existe um sistema com duas camadas `.background-layer`, alternando imagens a cada 8 segundos.

Imagens usadas:

- `assents.img/Imagem colada.png`
- `assents.img/Imagem colada (2).png`
- `assents.img/Imagem colada (3).png`
- `assents.img/Imagem colada (4).png`
- `assents.img/Imagem colada (5).png`

### 6.3 Particulas

O jogo cria 42 particulas pixeladas subindo na tela. Elas usam cores de fogo/brasas e animacao CSS.

Tambem existem particulas de clique, chamadas `spark-particle`, emitidas quando o jogador clica.

### 6.4 Cursor customizado

O cursor padrao e escondido com `cursor: none`. O JS cria um elemento `span.hammer-cursor-actor`, que segue o mouse e anima um golpe de martelo ao clicar.

Ponto de atencao: se a imagem do cursor falhar ou em dispositivos touch, isso pode prejudicar usabilidade.

### 6.5 Loja

A loja usa um array `shopItems` com os itens. Cada item pode ter:

- `id`
- `name`
- `category`
- `rarity`
- `price`
- `damage`
- `defense`
- `healing`
- `durability`
- `extra`
- `description`
- `story`
- `npcLine`

Filtros:

- categoria ativa em `activeCategory`;
- busca por nome usando `shopSearch`.

Compra:

- verifica se inventario tem 12 itens;
- cria copia do item com preco ajustado;
- adiciona `inventoryId` unico;
- adiciona ao `inventoryItems`;
- renderiza inventario;
- NPC comenta a compra.

### 6.6 Inventario

O inventario tem 12 slots fixos. Comeca com 3 itens.

Ao clicar em item:

- abre detalhes.
- mostra raridade, categoria, valor, dano/defesa/cura, dureza e extra.
- mostra historia do item.
- exibe botoes `Vender` e `Tirar`.

Atualmente:

- `Vender` remove o item.
- `Tirar` remove o item.
- Nao ha moeda do jogador.
- Nao ha persistencia.

### 6.7 Dialogo do NPC

O NPC tem:

- falas padrao;
- falas de inatividade;
- falas de hover;
- falas de introducao;
- arvore de dialogo com escolhas;
- respostas rotativas;
- efeito de preco por escolha.

Estados:

- `normal`: `NPC1.png`
- `goods`: `NPC2.png`
- `talk`: `NPC3.png`

O sistema de dialogo tem nos:

- `main`
- `identity`
- `artifacts`
- `secrets`
- `identity_knowledge`
- `identity_power`
- `identity_home`
- `artifact_sword`
- `artifact_tenpitsu`
- `artifact_safe`
- `secret_sasa`
- `secret_oda`
- `secret_books`

O modificador de preco fica em `shopPriceModifier`, limitado entre `-0.25` e `0.3`.

Textos de status dos precos:

- `preços: generosos`
- `preços: reduzidos`
- `preços: estáveis`
- `preços: altos`
- `preços: severos`

## 7. NPC principal: Soiren Kisuke

Identidade atual:

- Nome: Soiren Kisuke.
- Apelido: Kisuke-san.
- Ocupacao aparente: vendedor ambulante / lojista.
- Idade mencionada em fala: 44 anos.
- Personalidade: sarcastico, misterioso, observador, inteligente, cansado, perigoso sem parecer vilao.
- Ele vende itens, mas tambem vende informacao, conselhos e talvez problemas.
- Tem relacao com segredos, cadernos, profecias, mapas, formulas e o Cla Oda.
- Ele pode saber demais sobre o mundo e evita liderar.
- Ele parece ligado ao Santuario Sasa, mas nega oficialmente.

Tons de fala:

- Humor seco.
- Ameaca sutil.
- Sabedoria de sobrevivente.
- Mercado como lugar de negociacao, segredos e destino.

Exemplos de falas:

- `Escolha bem, viajante. Nem todo brilho vem do ouro.`
- `Tenho ferro, historias e uma paciencia que esta em promocao hoje.`
- `Se algo sussurrar seu nome, me avise. Eu cobro extra por mercadoria dramatica.`
- `Segredos sao como facas: quem pede para ver a lamina raramente gosta do brilho.`
- `Poder na mao certa faz o que, viajante?`

## 8. Lore e mundo

Elementos de lore ja citados:

- Nippon.
- Era Tensho.
- Mercado de Okami.
- Cla sem brasao.
- Cla Oda.
- Santuario Sasa.
- Xogunato.
- Eldrath.
- Reino em cinzas.
- Cavaleiros sem brasao.
- Pactos.
- Profecias.
- Artefatos espirituais.
- Meito chamada Suibokuga.
- Tecnica chamada Tenpitsu, o Pincel Celestial.

Conceitos importantes:

- A realidade pode ser "pintada" ou "reescrita".
- Artefatos tem vontade, memoria ou perigo espiritual.
- Segredos alteram precos e relacoes.
- Moeda compra mais que itens: compra abrigo, memoria, chance de sobreviver.
- A loja deve parecer um ponto de passagem entre comercio, profecia e ameaca.

## 9. Itens existentes na loja

### Armas

1. Espada do Brasao Partido

- Categoria: Armas.
- Raridade: Rara.
- Preco: 140.
- Dano: 26 corte.
- Dureza: 72/100.
- Extra: Peso medio.
- Descricao: lamina pesada para duelos em corredores estreitos.
- Historia: pertenceu a um capitao que quebrou o proprio brasao antes de abandonar o senhorio.
- Fala do NPC: carrega vergonha e coragem na mesma bainha.

2. Machado de Vigia

- Categoria: Armas.
- Raridade: Comum.
- Preco: 95.
- Dano: 22 impacto.
- Dureza: 81/100.
- Extra: quebra escudos leves.
- Historia: forjado para sentinelas de muralha, virou arma quando os portoes arderam por dentro.

3. Arco de Teixo Negro

- Categoria: Armas.
- Raridade: Incomum.
- Preco: 120.
- Dano: 18 perfuracao.
- Dureza: 64/100.
- Extra: alcance longo.
- Historia: arqueiros do norte diziam que a madeira ouvia passos antes dos homens.

### Artefatos

4. Anel da Brasa Fria

- Categoria: Artefatos.
- Raridade: Epica.
- Preco: 220.
- Dano: nenhum.
- Dureza: indefinida.
- Extra: resiste ao frio.
- Historia: retirado das cinzas de um templo onde fogo azul queimava sob chuva.

5. Selo do Monge Cego

- Categoria: Artefatos.
- Raridade: Lendaria.
- Preco: 310.
- Dano: nenhum.
- Dureza: 90/100.
- Extra: abre passagens seladas.
- Historia: o monge nao enxergava portas, apenas promessas esperando uma chave.

### Armaduras

6. Elmo do Portao Leste

- Categoria: Armaduras.
- Raridade: Incomum.
- Preco: 175.
- Defesa: 15 defesa.
- Dureza: 76/100.
- Extra: protege contra atordoamento.
- Historia: sobreviveu ao primeiro ariete, ao segundo incendio e a tres donos teimosos.

7. Cota de Escamas Rubras

- Categoria: Armaduras.
- Raridade: Rara.
- Preco: 260.
- Defesa: 24 defesa.
- Dureza: 88/100.
- Extra: reduz dano de fogo.
- Historia: cada escama veio de armaduras derretidas depois da queda de uma casa nobre.

### Comestiveis

8. Pao Escuro de Campanha

- Categoria: Comestiveis.
- Raridade: Comum.
- Preco: 18.
- Cura: 12 vigor.
- Dureza: 3 dias.
- Extra: sacia fome.
- Historia: receita de soldados com farinha, sal e paciencia de quem ainda esta vivo.

9. Ensopado de Cebola Real

- Categoria: Comestiveis.
- Raridade: Incomum.
- Preco: 34.
- Cura: 28 vigor.
- Dureza: 1 dia.
- Extra: aquece no frio.
- Historia: chamado de real porque um rei faminto chorou ao comer.

### Tralhas

10. Corda de Carrasco

- Categoria: Tralhas.
- Raridade: Comum.
- Preco: 22.
- Dureza: 58/100.
- Extra: 30 passos de comprimento.
- Historia: foi cortada antes da sentenca final; desde entao so ajuda gente a escapar.

11. Chave Sem Fechadura

- Categoria: Tralhas.
- Raridade: Misteriosa.
- Preco: 47.
- Dureza: 100/100.
- Extra: uso desconhecido.
- Historia: apareceu no bolso de um mensageiro sem nome e sem memoria.

## 10. Arvore de dialogo resumida

No principal `main`, o NPC pergunta:

- `Quem e voce?`
- `Mostre os artefatos`
- `Algum segredo?`
- `Adeus`

Ramo identidade:

- Voce sabe demais.
- Por que nao lidera?
- Onde voce mora?

Ramo artefatos:

- Fale da Suibokuga.
- O que e Tenpitsu?
- Quero algo seguro.

Ramo segredos:

- Santuario Sasa?
- E o Cla Oda?
- Mostre os cadernos.

Cada escolha tem respostas rotativas e altera levemente o preco:

- Respostas prudentes, discretas ou sensatas tendem a reduzir preco.
- Respostas violentas, perigosas, ambiciosas ou curiosas demais tendem a aumentar preco.

## 11. Pontos fortes do projeto

- Identidade visual muito forte e consistente.
- O NPC ja tem personalidade clara e memoravel.
- O sistema de loja nao e generico: ele mistura compra, lore, humor e consequencia.
- O uso de imagens do NPC por estado deixa a loja mais viva.
- A arvore de dialogo ja tem bastante conteudo para um prototipo.
- O sistema de preco dinamico e uma boa ideia: transforma conversa em mecanica.
- O menu tem uma composicao propria, com logo, torii, lua, montanhas e botoes fisicos.
- A UI tem detalhes de jogo real: busca, categoria, inventario, cards expansivos, limite de slots.

## 12. Problemas e riscos atuais

### 12.1 Ortografia e acentos

Muitos textos estao sem acento:

- voce -> você
- memoria -> memória
- cronicas -> crônicas
- proxima -> próxima
- brasao -> brasão
- saloes -> salões
- lamina -> lâmina
- santuario -> santuário
- informacao -> informação

Alguns textos ja tem acento, entao ha inconsistencia. A proxima IA deve padronizar tudo para portugues brasileiro com acentos corretos.

### 12.2 Nome de pasta possivelmente errado

`assents.img` provavelmente deveria ser `assets.img` ou apenas `assets/img`. Mas como funciona hoje, renomear sem atualizar caminhos quebra imagens.

### 12.3 Usabilidade do cursor

`cursor: none` pode ser ruim:

- em mobile;
- se o asset do martelo nao carregar;
- para acessibilidade;
- para usuarios que preferem cursor normal.

Sugestao: manter cursor customizado apenas em telas com ponteiro fino usando media query `@media (pointer: fine)`.

### 12.4 Responsividade

Ja existem media queries, mas a Loja e o Chat sao densos. Em telas pequenas pode ficar apertado.

Riscos:

- chat ocupar espaco demais;
- texto cortar;
- botoes pequenos;
- inventario com scroll estranho;
- cursor customizado em mobile.

### 12.5 Falta persistencia

O inventario reseta ao recarregar a pagina.

Sugestao:

- salvar inventario, modificador de preco e talvez historico em `localStorage`.

### 12.6 Sem economia do jogador

O jogador compra sem gastar moeda.

Falta:

- saldo de moedas;
- bloqueio por falta de dinheiro;
- venda devolver parte do valor;
- indicador de riqueza no HUD.

### 12.7 Vender e tirar fazem quase a mesma coisa

Atualmente ambos removem o item. `Vender` deveria dar moedas. `Tirar` deveria descartar ou mover para outro estado.

### 12.8 Codigo grande em um unico `script.js`

O `script.js` mistura:

- dados de itens;
- dados de dialogo;
- estado global;
- renderizacao;
- eventos;
- efeitos visuais.

Para continuar crescendo, seria melhor separar:

- `data/items.js`
- `data/dialogs.js`
- `ui/shop.js`
- `ui/inventory.js`
- `ui/npc.js`
- `effects/cursor.js`
- `effects/particles.js`

Como o projeto e HTML simples, isso exigiria usar `type="module"` no script.

### 12.9 CSS muito grande e com sobrescritas

O CSS tem uma primeira camada de estilo e depois uma secao `Nippon hold visual refresh` que sobrescreve muitos elementos. Isso funciona, mas pode confundir manutencao.

Sugestao:

- reorganizar por secoes;
- remover regras antigas que foram substituidas;
- separar comentarios por tela;
- manter variaveis de tema no topo.

### 12.10 Acessibilidade parcial

Pontos bons:

- varios `aria-label`;
- `aria-live` na lista e chat;
- suporte a Enter/Espaco em cards.

Pontos a melhorar:

- cursor invisivel;
- botoes com caracteres decorativos podem precisar melhor descricao;
- cards clicaveis como `article` com `tabIndex` funcionam, mas poderiam ter `role="button"`;
- foco visual precisa ser testado;
- texto animado pode ser cansativo para alguns usuarios.

## 13. Sugestoes de proximos passos

Prioridade alta:

1. Corrigir todos os acentos e revisar texto em portugues.
2. Testar visual em celular e ajustar Loja/Chat.
3. Implementar moeda do jogador.
4. Fazer venda devolver moedas.
5. Salvar inventario e moedas em `localStorage`.
6. Corrigir ou padronizar pasta `assents.img`, se quiser organizar.

Prioridade media:

1. Separar dados de itens e dialogos do codigo principal.
2. Criar HUD com moedas, talvez reputacao/humor do NPC.
3. Melhorar tela de Inventario com icones/imagens dos itens.
4. Fazer o Mural funcionar com contratos/missoes.
5. Expandir Lore com abas: Reino, Clas, Artefatos, Personagens.
6. Criar sistema de raridade visual mais claro.

Prioridade criativa:

1. Dar mais peso ao Mercado de Okami como lugar.
2. Definir quem e Soiren Kisuke de verdade.
3. Definir o que e o Santuario Sasa.
4. Definir relacao do Cla Oda com o jogador.
5. Transformar Suibokuga e Tenpitsu em sistemas ou quests.
6. Criar itens que desbloqueiam dialogos.

## 14. Recomendacao de direcao para a proxima IA

Manter o projeto como um RPG de loja narrativa, nao transformar em landing page. A primeira tela deve continuar sendo a experiencia jogavel, com menu e acesso direto aos sistemas.

A melhor direcao e evoluir a loja como centro do jogo:

- jogador compra/vende;
- conversa com Kisuke;
- desbloqueia lore;
- pega contratos no Mural;
- encontra pistas sobre Suibokuga, Tenpitsu, Sasa e Cla Oda;
- melhora reputacao e consegue precos diferentes.

O estilo deve continuar:

- escuro;
- feudal japones;
- pixel/RPG;
- metal, madeira, papel velho, sangue e ouro envelhecido;
- humor seco;
- fantasia sombria.

Evitar:

- interface moderna demais;
- estilo limpo/SaaS;
- hero page de marketing;
- excesso de cards decorativos;
- cores muito fofas ou neon;
- transformar o NPC em assistente generico.

## 15. Prompt pronto para colar em outra IA

Estou migrando um projeto web de jogo/RPG para voce continuar. O projeto usa HTML, CSS e JavaScript puro. Ele esta no tema feudal japones sombrio, fantasia medieval/pixel art, com nome visual `Nippon Era` e contexto `Era Tensho`.

A interface atual tem:

- menu principal com logo, lua, montanhas, moldura torii e botoes;
- tela de Loja;
- tela de Itens/Inventario;
- tela de Lore;
- Mural bloqueado como futuro sistema;
- NPC vendedor chamado Soiren Kisuke;
- chat estilo Undertale/RPG;
- arvore de dialogo com escolhas;
- modificador de precos baseado nas escolhas;
- loja com busca, categorias e compra;
- inventario com 12 slots, vender/tirar e detalhes dos itens;
- cursor customizado de martelo;
- particulas de brasa e faíscas ao clicar;
- fundos rotativos.

Arquivos principais:

- `index.html`: estrutura das telas.
- `style.css`: visual completo e responsividade.
- `script.js`: logica da loja, inventario, NPC, dialogos e efeitos.
- `assets/`, `assets/ui/`, `assents.img/`: imagens, NPCs, logo, fundos e texturas.

O personagem mais importante e Soiren Kisuke, um vendedor misterioso, sarcastico, perigoso e inteligente. Ele vende itens e informacao. Ele sabe demais sobre o mundo, o Cla Oda, o Santuario Sasa, artefatos espirituais, Suibokuga e Tenpitsu.

O jogo deve continuar como RPG de loja narrativa. A Loja deve ser o centro da experiencia: comprar, vender, conversar, descobrir lore, desbloquear missoes e mudar precos conforme atitudes do jogador.

Preciso que voce mantenha a estetica atual: escura, feudal japonesa, pixel/RPG, metal, madeira, vermelho sangue, ouro envelhecido, texto com humor seco e fantasia sombria. Nao transforme isso em landing page moderna.

Principais melhorias desejadas:

1. Corrigir acentos e revisar todos os textos em portugues brasileiro.
2. Melhorar responsividade, principalmente Loja e Chat no celular.
3. Criar sistema de moedas do jogador.
4. Fazer venda devolver moedas.
5. Persistir inventario/moedas com localStorage.
6. Organizar melhor o JavaScript separando dados de itens/dialogos.
7. Expandir o Mural como contratos/missoes.
8. Expandir Lore sobre Mercado de Okami, Cla Oda, Santuario Sasa, Suibokuga e Tenpitsu.

Nao apague a personalidade do projeto. O objetivo e evoluir um prototipo de RPG narrativo com loja e NPC forte.

