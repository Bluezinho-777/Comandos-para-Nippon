# Nippon Era / Era Tensho (Comandos-para-Nippon)

Este projeto é um protótipo jogável e interativo de uma interface web para RPG/jogo de fantasia medieval com temática japonesa sombria (Era Tensho). O foco principal é a interação narrativa e de comércio em um ponto de passagem perigoso no **Mercado de Okami**.

---

## 🛠️ Tecnologia Utilizada

- **HTML5**: Estrutura semântica e acessível (com marcações `aria`).
- **Vanilla CSS**: Estilo visual denso, inspirado em jogos retrô de fantasia sombria, pixel art e tons de cinzas, madeira envelhecida, ouro e sangue.
- **Vanilla JavaScript**: Lógica estruturada para navegação de telas, compra e venda de itens, chat interativo de escolhas (estilo RPG/Undertale), emissão de partículas e persistência local de dados.
- **Firebase**: Estruturação base para autenticação de jogadores, criadores e criação de campanhas de RPG (requer configuração em `firebase-config.js`).

---

## 📂 Organização do Projeto

Os arquivos JavaScript foram separados para melhor organização de código e manutenção futura:

- **`index.html`**: Contém a marcação de todas as telas (Menu Inicial, Loja, Inventário, Mural de Contratos e Lore).
- **`style.css`**: Define a direção visual completa, animações, adaptabilidade mobile e cursor customizado.
- **`data/items.js`**: Banco de dados estático e dinâmico dos itens da loja (Armas, Artefatos, Armaduras, Comestíveis e Tralhas).
- **`data/dialogs.js`**: Árvore completa de diálogos de Soiren Kisuke e as respostas narrativas do jogador.
- **`data/mural.js`**: Definições das missões e contratos dinâmicos que o jogador pode realizar.
- **`script.js`**: Lógica central da aplicação, renderização de listas, gerenciamento de moedas, cursor customizado e persistência com `localStorage`.
- **`assets/`**: Assets gráficos do jogo.
  - `assets/cursor_hammer.png`: Cursor customizado em forma de martelo (ativo em computadores).
  - `assets/ui/`: Logos, texturas e imagens de interface.
  - `assets/img/`: NPC retratos (Soiren Kisuke em diferentes humores) e fundos rotativos do Mercado de Okami.

---

## 🎮 Funcionalidades e Mecânicas Jogáveis

1. **Sistema de Moedas (Currency)**: O jogador começa com **150 moedas** para gastar. O saldo é atualizado dinamicamente em um HUD em tempo real no cabeçalho das telas.
2. **Loja Dinâmica**: É possível comprar itens da prateleira de Soiren Kisuke. O preço de cada item reage diretamente às suas interações no diálogo narrativo (escolhas provocativas aumentam preços, respostas sensatas garantem descontos).
3. **Inventário Interativo**: Comporta até **12 itens**. Permite visualizar estatísticas detalhadas de cada item, sua lore individual, descartá-los ("Tirar") ou vendê-los de volta à loja por **70% do valor atual** ajustado.
4. **Mural de Contratos (Missões)**: Permite aceitar contratos locais do vilarejo de Okami. Cada contrato exige requisitos específicos de itens no inventário para conclusão. Concluir missões dá recompensas generosas de moedas, consome os itens exigidos (se for ração ou tralha) e concede reputação que diminui sutilmente os preços na loja.
5. **Persistência de Jogo**: O progresso (moedas, inventário, modificador de preços e missões aceitas ou concluídas) é salvo automaticamente no `localStorage` do navegador. É possível reiniciar o progresso e recomeçar a jornada clicando em "Recomeçar Jornada" no menu principal.
6. **Cursor de Martelo Adaptativo**: Cursor interativo que simula impactos de martelo ao clicar, ativo apenas em dispositivos que possuem mouse (`pointer: fine`), mantendo o comportamento de toque nativo e acessível em dispositivos móveis.
7. **Revisão Ortográfica**: Todos os textos, diálogos, itens e notificações foram revisados para português brasileiro com acentuação e gramática perfeitas.
