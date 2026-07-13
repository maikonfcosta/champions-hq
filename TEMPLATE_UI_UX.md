# 🎨 Marvel Champions HQ - UI/UX & Layout Specs

> **Objetivo:** Este documento define as diretrizes visuais e estruturais oficiais do aplicativo **Marvel Champions HQ**, servindo como fonte de verdade para a interface do usuário (UI) e experiência (UX).

---

## 1. Identidade Visual e Design System

### 1.1 Cores (Color Palette)
O aplicativo possui uma estética sombria (Dark Theme) voltada para imersão e visual hi-tech, com as seguintes cores principais:

- **Fundo Principal (Background):** `#060913` com um `--bg-gradient` radial sutil para dar profundidade (`#111a33` para `#060913`).
- **Superfícies (Glassmorphism):** Fundo `rgba(255, 255, 255, 0.04)` com `backdrop-filter: blur(12px)`.
- **Bordas de Superfície:** `rgba(255, 255, 255, 0.1)`.
- **Textos:**
  - Primário: `#ffffff`
  - Secundário: `#94a3b8`
  - Muted: `#64748b`
- **Cores de Destaque (Aspectos / Heroicos):**
  - 🔴 **Agressividade / Marvel Red (Primária Padrão):** `#e62429` (Hover: `#f03a3e`, Glow: `rgba(230, 36, 41, 0.4)`)
  - 🟡 **Justiça:** `#fbc02d`
  - 🔵 **Liderança / Cap Blue (Secundária Padrão):** `#2b82d9` / `#1e88e5`
  - 🟢 **Proteção:** `#43a047`
  - ⚪ **Básico / Dark Knight:** `#9e9e9e` / `#71717a`

### 1.2 Tipografia (Typography)
O projeto usa fontes hospedadas pelo Google Fonts para contrastar modernidade e legibilidade:
- **Display / Títulos (h1-h6, botões):** `Outfit` (Pesos: 300, 400, 600, 700, 800) - Traz um tom forte, arredondado e heroico. Letras frequentemente em uppercase para forte impacto visual.
- **Corpo do Texto (Body, Listas):** `Inter` (Pesos: 400, 500, 600) - Limpa, perfeita para interfaces densas de dados estruturados (listas de cartas e regras longas).

### 1.3 Elementos Visuais e Efeitos
- **Botões (Pill / Arredondados):** Bordas de `8px`, texto em `uppercase` (Outfit), e um brilho Neon (`box-shadow: 0 0 15px var(--primary-glow)`) ao interagir/hover.
- **Cards e Modais (.glass-panel):** `16px` de border-radius, acompanhados de blur de fundo simulando vidro fosco (`Glassmorphism`).
- **Sombras:** `--shadow-lg` agressiva para flutuação de modais e componentes elevados (`0 10px 15px rgba(0,0,0,0.6)`).

---

## 2. Responsividade e Breakpoints (Mobile-First)

A fundação é 100% Mobile-First. O público alvo usa o app principalmente no celular, com o dispositivo deitado ao lado da mesa física do card game.

- **📱 Mobile (Padrão inicial):** `0px` até `767px`
- **💻 Desktop / Tablet:** `768px` e superior (A interface de navegação expande lateralmente).

### Regras de Ouro de UX Mobile (Aplicadas)
- Áreas interativas projetadas para toques rápidos e certeiros.
- Sem efeitos visuais essenciais que exijam apenas mouse-hover.
- Uso pesado de modais via `createPortal` super rápidos para visualizar Decks sem recarregar a página e perder o escopo.
- O Menu Principal no mobile fica comprimido num botão flutuante amigável no canto inferior esquerdo (Zona do polegar/Thumb-zone).

---

## 3. Disposição de Informações por Página

### 3.1 Navegação Principal (App Layout)
- **Mobile:** Barra superior de vidro (Navbar) contendo o título/marca e um layout focado em tela cheia. O botão de navegação principal `.mobile-menu-btn` flutua no canto inferior esquerdo, revelando um bottom-sheet ou overlay.
- **Desktop:** Uma forte barra lateral esquerda (`.sidebar` de `280px`), fixada verticalmente e contendo o logotipo e os links num formato tradicional de dashboard. O restante da área direita comporta o conteúdo de forma fluida.

### 3.2 Home Page (Dashboard / Hero)
- **Hero Section:** Título principal gigantesco (até `3.5rem` em desktop) utilizando um `linear-gradient` clipado ao texto, misturando Marvel Red com Cap Blue.
- **Grade de Navegação:** Cards ou links que chamam para funções vitais ("Randomizer / Partida Aleatória", "Coleção", "Decks"). Design prioriza impacto e imersão instantânea.

### 3.3 Decks e Coleção (Listagens Densas)
- **Desempenho (Performance):** A renderização de listas extensas baseadas num arquivo JSONL pesado deve usar rolagem virtual ou paginação agressiva, sem congelar a UI.
- **Identificação Visual:** Os itens e decks recebem coloração/bordas dinâmicas baseadas no seu aspecto dominante (Justice em amarelo, Leadership em azul, etc).

### 3.4 Modal de Detalhes (Leitura Rápida)
- Layout pensado para abrir instantaneamente.
- Separa claramente o herói e seus recursos necessários no topo, dividindo o resto por categorias de cartas (Eventos, Aliados, Melhorias) via listas claras e ícones ao invés de muito texto.

---

## 4. Biblioteca de Componentes Chave (UI Kit Vanilla)

O app não usa Bootstrap ou Tailwind, tudo é feito com utilitários flex e variáveis limpas.

- `.btn-primary`: Assume automaticamente a cor do Tema do Aspecto atual. No hover, se eleva (`translateY(-2px)`) e acende a aura colorida (Glow effect).
- `.btn-secondary`: Mantém um visual secundário translúcido, perfeito para filtros ou navegação de abas. Fica vítreo no hover.
- `.glass-panel`: Utilitário mestre para cartões, painéis, modais. Injeta background de 4% de opacidade com `blur(12px)`.
- `.tabs-container`: Sistema de abas, usado nas páginas de "Regras" ou "Dicionário", com botões contendo ícones dinâmicos do `lucide-react`.

---

## 5. Dinâmica PWA e Usabilidade
- **Status Offline:** Como um PWA nato, todo elemento UI deve carregar sem dependência de internet.
- **Identidade e Coesão:** Ícones da biblioteca `lucide-react` devem ser preferidos em relação ao texto excessivo nas interfaces para celular (ganho de espaço em tela).
- **Legibilidade em Baixa Luz:** As cores escuras predominam também pensando que jogadores podem estar em ambientes à meia-luz. O contraste de `--text-primary` (`#ffffff`) garante legibilidade sem cansar os olhos.
