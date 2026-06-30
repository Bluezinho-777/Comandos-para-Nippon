# 🌸 Nippon Era & Era Tensho — RPG de Loja Narrativa

Este projeto é uma experiência interativa web de **RPG de Loja Narrativa**, ambientada em uma atmosfera feudal japonesa sombria, fantasia medieval com toques de pixel art e mistérios espirituais (Era Tensho). 

O coração do jogo está no **Mercado de Okami**, onde o jogador interage com o vendedor sarcástico e misterioso **Soiren Kisuke (Kisuke-san)**, gerencia suas moedas, compra e vende itens, realiza contratos no mural e investiga relíquias espirituais proibidas.

---

## 🛠️ Tecnologias Utilizadas

- **HTML5**: Estrutura semântica e tags `aria` para garantir acessibilidade e suporte de leitura.
- **Vanilla CSS**: Estilos visuais profundos, layouts responsivos, paleta sombria baseada em carvão, vermelho sangue, bege envelhecido e ouro, com animações e tipografia retrô.
- **Vanilla JavaScript**: Lógica do jogo dividida em módulos de dados, controlando diálogos, inventário, cálculo de preços dinâmicos, missões e animações visuais.
- **Firebase (Compat)**: Integração para autenticação de jogadores, criação de campanhas de RPG e logs de auditoria na nuvem (configurável via `firebase-config.js`).
- **LocalStorage Fallback**: Um sistema que salva o progresso localmente caso o Firebase não esteja configurado ou esteja offline, permitindo o funcionamento completo da loja e das lores.

---

## 📂 Estrutura de Arquivos e Dados

O projeto separa dados estáticos de comportamentos e lógica para facilitar a manutenção e o crescimento:

- **`index.html`**: Contém a marcação e estrutura de todas as telas (Menu, Loja, Inventário, Mural de Contratos, Enciclopédia de Lore e Painéis do Criador).
- **`style.css`**: Centraliza a identidade visual, animações de brasas, efeitos de cursor e responsividade mobile.
- **`data/items.js`**: Cadastro dos itens disponíveis para compra e venda (divididos em Armas, Artefatos, Armaduras, Comestíveis e Tralhas), com histórias individuais e falas do NPC.
- **`data/dialogs.js`**: Árvore estruturada de diálogos com nós (`main`, `identity`, `artifacts`, `secrets`, etc.), opções de escolha do jogador, impacto em preço e respostas randômicas do NPC.
- **`data/mural.js`**: Lista de contratos disponíveis no Mural, contendo os requisitos de inventário, recompensas de ouro e regras de consumo de itens.
- **`data/lore.js`**: Crônicas iniciais do Reino da Era Tensho, que alimentam a enciclopédia de forma editável e excluível.
- **`script.js`**: Motor principal do jogo. Controla a renderização das telas, transição entre menus, processamento de transações, partículas de clique, cursor de martelo e sincronização (Local vs Firebase).

---

## 🎮 Mecânicas e Sistemas do Jogo

### 1. Sistema de Moedas e Economia Dinâmica
- O jogador inicia com **150 moedas** no seu HUD (atualizado em tempo real nas telas).
- **Preços Reativos**: As respostas que você escolhe ao conversar com Kisuke-san afetam diretamente seu humor e a tabela de preços! Respostas prudentes ou discretas reduzem os preços (até `-25%`), enquanto perguntas abusivas, ambição ou ameaças os sobem (até `+30%`).
- O cabeçalho do chat atualiza o humor do NPC em tempo real (`humor: satisfeito | amigável | cauteloso | irritado | hostil`).

### 2. Inventário Interativo
- Suporta até **12 itens**. Permite inspecionar cada item para ler seus atributos de RPG (dano, defesa, cura, dureza, efeitos extras) e sua lore secreta.
- **Opções de Descarte e Reembolso**: É possível "Tirar" (descartar permanentemente) ou "Vender" um item. A venda devolve **70% do preço reajustado atual** do item à carteira do jogador.

### 3. Mural de Contratos (Missões)
- O mural lista contratos locais que o jogador pode aceitar e concluir se preencher as condições do seu inventário.
- **Resolução de Missões**: Ao concluir um contrato, os itens exigidos (como pão, corda ou artefatos) são consumidos, o jogador recebe moedas de recompensa e ganha reputação que reajusta a tabela da loja.

### 4. Enciclopédia de Lore com Abas (Categorias)
- A tela de Lore possui abas de categorias inspiradas na UI de categorias da loja: **Todos**, **Reino**, **Clãs**, **Artefatos**, **Personagens** e **Outros**.
- Permite filtrar as histórias rapidamente. Se o jogador estiver logado como **Criador/Mestre**, a Oficina de Lore permite criar novas histórias, editar as existentes ou apagá-las.

### 5. Modo de Testes / Criação (Mestre)
- Há um seletor de papel de teste no menu principal (**Jogador / Criador**).
- Entrar como **Criador** ativa as ferramentas avançadas no rodapé da loja, no inventário dos jogadores e na oficina de lores, permitindo criar itens customizados, gerenciar estoques, auditar logs e alterar lores salvando localmente ou no Firebase.

---

## ✨ Efeitos Visuais e Imersão
- **Partículas de Brasa**: Efeito visual de fogo/cinzas flutuando no menu e nas telas para passar a atmosfera de um mercado nas ruínas de Eldrath.
- **Faíscas ao Clicar**: Partículas dinâmicas e sonoras de faísca surgem a cada clique do jogador.
- **Fundos Rotativos**: O cenário do Mercado de Okami alterna sutilmente a cada 8 segundos entre cinco ilustrações atmosféricas.
- **Cursor de Impacto**: Um martelo de ferreiro pixelizado que gira e golpeia as janelas simulando peso físico a cada clique (desativado automaticamente em telas touch para não atrapalhar a usabilidade mobile).
