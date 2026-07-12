# Champions HQ — Análise Completa do Projeto

> Documento de contexto gerado em 2026-07-12 (versão do app: **1.2.1**).
> Feito para ser consumido por outra CLI/agente de IA como fonte única de contexto do projeto:
> contém visão geral, arquitetura, fluxos de dados, avaliação de boas práticas e backlog priorizado.

---

## 1. Visão Geral

**Champions HQ** é um companion app (SPA + PWA, mobile-first) para o card game *Marvel Champions LCG*.
Permite gerenciar coleção de pacotes, explorar ~51.800 decks da comunidade (MarvelCDB) 100% offline,
sortear partidas, acompanhar vida/ameaça na mesa com sincronização P2P em tempo real, registrar
histórico ranqueado, campanhas e consultar regras.

- **Tipo:** Web app React (SPA) empacotada como PWA instalável, sem backend próprio.
- **Persistência:** `localStorage` (fonte primária) + Firebase Firestore (sync opcional na nuvem via login Google).
- **Multiplayer:** WebRTC via PeerJS (servidor público de sinalização), pareamento por QR Code.
- **Dados de decks:** arquivo estático `public/all_decks.jsonl` (~21 MB, 51.848 decks), atualizado
  diariamente por GitHub Actions que raspa a API pública do MarvelCDB.
- **Idiomas:** PT (padrão/fallback), EN, ES via i18next.
- **Licença:** MIT-like (ver `LICENSE`); projeto fan-made, sem fins lucrativos, sem afiliação com Marvel/FFG.

## 2. Stack Tecnológica

| Camada | Tecnologia | Versão |
|---|---|---|
| UI | React | 19.x |
| Roteamento | react-router-dom (BrowserRouter) | 7.x |
| Build | Vite (+ @vitejs/plugin-react) | 8.x |
| PWA | vite-plugin-pwa (Workbox, `registerType: autoUpdate`) | 1.3 |
| Estilo | CSS puro (`src/index.css`, ~1.480 linhas, glassmorphism + temas via `data-theme`) | — |
| Auth/Cloud | Firebase Auth (Google) + Firestore | 12.x |
| P2P | PeerJS (WebRTC DataChannel) | 1.5 |
| QR Code | qrcode.react (gerar) + html5-qrcode (escanear) | — |
| i18n | i18next + react-i18next + browser-languagedetector | — |
| Ícones | lucide-react | — |
| Lint | oxlint (`.oxlintrc.json`, plugins react/oxc) | 1.x |
| Scraper | Node.js puro (`scripts/`), Puppeteer instalado mas não usado nos scripts atuais | — |

Não há: TypeScript, testes, formatador (Prettier), CI de qualidade, framework de estado (Redux etc.).

## 3. Estrutura de Diretórios

```
champions-hq/
├── .github/workflows/update-decks.yml   # Único workflow: scrape diário de decks (03:00 UTC)
├── docs/superpowers/plans/              # Planos de implementação (firebase-sync, pwa)
├── public/
│   ├── all_decks.jsonl                  # 21 MB — banco de decks embutido (versionado no git)
│   ├── last_scraped_date.txt            # Cursor do scraper incremental
│   ├── docs/*.pdf                       # 39 MB — manuais oficiais PT-BR
│   ├── logo.jpg (508 KB), icons.svg
├── scripts/
│   ├── scrape_all_decks.js              # Raspagem histórica completa (one-shot)
│   └── update_decks.js                  # Raspagem incremental diária (usado pelo Actions)
├── src/
│   ├── main.jsx                         # Entry: StrictMode > AuthProvider > App
│   ├── App.jsx                          # Router, layout (sidebar desktop + menu mobile), temas, SFX, install prompt
│   ├── index.css                        # Todo o CSS global (temas por [data-theme])
│   ├── i18n.js                          # Setup i18next (pt/en/es, fallback pt)
│   ├── components/                      # Modal, ReloadPrompt (PWA update), TurnAssistant
│   ├── context/AuthContext.jsx          # Login Google (popup c/ fallback redirect), estado do usuário
│   ├── hooks/
│   │   ├── useCloudSync.js              # get/set genérico em Firestore users/{uid}
│   │   └── useMultiplayer.js            # Host/Guest PeerJS, estado autoritativo no Host
│   ├── pages/                           # Collection, Decks, Randomizer, Tracker, History,
│   │                                    # Dashboard, Builder, Campaign, Rules, ReleaseNotes
│   ├── data/                            # campaigns.js, rules.js, villains.js (dados estáticos)
│   ├── locales/{pt,en,es}/translation.json
│   ├── services/
│   │   ├── api.js                       # Cliente da API pública do MarvelCDB
│   │   └── firebase.js                  # Init via variáveis VITE_FIREBASE_* (.env, fora do git)
│   └── utils/ranking.js                 # Cálculo de XP/rank
├── index.html                           # Shell mínimo
├── vite.config.js                       # react + VitePWA (manifest + workbox)
├── .oxlintrc.json                       # rules-of-hooks: error
└── package.json                         # scripts: dev / build / lint / preview
```

## 4. Como Rodar / Comandos

```bash
npm install          # instalar dependências
npm run dev          # dev server (Vite)
npm run build        # build de produção (dist/) — VERIFICADO: passa em ~1s
npm run lint         # oxlint — VERIFICADO: 0 erros, 22 warnings (ver §7)
npm run preview      # servir a build localmente
node scripts/update_decks.js   # atualização incremental do banco de decks
```

**Variáveis de ambiente** (`.env`, não versionado — necessário para login/sync):
`VITE_FIREBASE_API_KEY`, `VITE_FIREBASE_AUTH_DOMAIN`, `VITE_FIREBASE_PROJECT_ID`,
`VITE_FIREBASE_STORAGE_BUCKET`, `VITE_FIREBASE_MESSAGING_SENDER_ID`, `VITE_FIREBASE_APP_ID`.
Sem elas o app roda, mas login Google e cloud sync falham.

## 5. Arquitetura e Fluxos de Dados

### 5.1 Persistência local (fonte da verdade)
Todo estado do usuário vive no `localStorage`, com chaves acessadas diretamente em cada página
(não há módulo central de storage):

| Chave | Conteúdo | Escrita em | Lida em |
|---|---|---|---|
| `mc_owned_packs` | Pacotes possuídos | Collection | Collection, Decks, Randomizer, Builder, History |
| `mc_match_history` | Partidas + XP/rank | Randomizer, History | History, Dashboard, Randomizer |
| `mc_tracker_state` | Estado da mesa (HP, ameaça…) | Tracker | Tracker |
| `mc_campaign_saves` | Progresso de campanhas | Campaign | Campaign |
| `mc_theme`, `mc_sfx` | Preferências de UI | App | App |

### 5.2 Cloud sync (opcional)
`AuthContext` autentica com Google (popup → fallback redirect). `useCloudSync` grava/lê documentos
`users/{uid}` no Firestore com merge por chave. A sincronização é parcial (nem todas as chaves acima
são sincronizadas) e resolvida por "última escrita vence" — sem tratamento de conflito.

### 5.3 Multiplayer P2P (Tracker)
`useMultiplayer`: o Host cria a sala (seu peer ID = ID da sala, compartilhado por QR Code);
Guests conectam via PeerJS. Modelo autoritativo: Guest envia o estado calculado como `ACTION`,
Host aplica e faz broadcast de `SYNC_STATE` a todos. Offline, o mesmo `dispatchAction` atualiza
apenas o estado local.

### 5.4 Banco de decks
`Decks.jsx` faz fetch de `/all_decks.jsonl` e processa em memória (filtros por herói/aspecto e
"apenas cartas que possuo" cruzando com `mc_owned_packs`). O arquivo é precacheado pelo service
worker (offline-ready) e atualizado diariamente pelo workflow `update-decks.yml`
(commit automático `chore: atualiza banco de decks diário [skip ci]`).

### 5.5 API externa em runtime
`services/api.js` consome `https://marvelcdb.com/api/public` (packs, cards, decklists, FAQ) —
usado para dados que não estão no jsonl.

## 6. Avaliação de Boas Práticas (Checklist)

### Estrutura e organização
- ✅ Separação clara por responsabilidade (`pages/`, `components/`, `hooks/`, `context/`, `services/`, `data/`, `utils/`)
- ✅ README completo (propósito, features, stack, como rodar, disclaimer legal)
- ✅ LICENSE presente; `.gitignore` adequado (inclui `.env`)
- ✅ Planos de implementação documentados em `docs/`
- ⚠️ Componente `Home` definido dentro de `App.jsx` (deveria ser `pages/Home.jsx`); imports de páginas no meio do arquivo (`App.jsx:84`)
- ❌ Sem `CLAUDE.md`/`AGENTS.md`/`CONTRIBUTING.md` para orientar contribuidores e agentes

### Qualidade de código
- ✅ Lint configurado (oxlint) com `react/rules-of-hooks: error`
- ✅ Build de produção passa sem erros
- ⚠️ 22 warnings de lint (imports/variáveis mortas, `exhaustive-deps`, chave duplicada — ver §7)
- ⚠️ Estilos inline extensos misturados com CSS global (App.jsx, páginas) — dificulta tema/consistência
- ❌ Sem TypeScript nem PropTypes (há `@types/react` instalado, mas o código é JSX puro sem checagem)
- ❌ Sem formatador (Prettier) nem padrão de estilo automatizado

### Testes e CI/CD
- ❌ **Zero testes** (nenhum runner instalado, nenhum arquivo de teste, sem script `test`)
- ❌ Sem CI de qualidade: nenhum workflow roda `lint`/`build` em push/PR (o único workflow é o scraper de dados)
- ❌ Sem pipeline de deploy versionado no repo
- ⚠️ Workflow usa Node 18 (EOL) e `actions/checkout@v3` / `setup-node@v3` (desatualizados)

### Segurança
- ✅ Segredos Firebase via `import.meta.env` + `.env` fora do git (correto para chaves públicas de client Firebase)
- ⚠️ Segurança real do Firestore depende das *Security Rules* no console (não versionadas no repo — recomendável versionar `firestore.rules`)
- ⚠️ PeerJS usa servidor público de sinalização; ID da sala é o único "segredo" da mesa (aceitável para o caso de uso)
- ✅ Sem `dangerouslySetInnerHTML` fora de contexto controlado; i18next com escape padrão do React

### Performance
- ⚠️ **Bundle único de 1,49 MB (434 KB gzip)** — sem code-splitting; Firebase inteiro entra no chunk principal mesmo para quem não faz login
- ⚠️ **Precache do PWA de ~22,9 MB** (o `all_decks.jsonl` de 21 MB é baixado por todo usuário na instalação do SW e re-baixado a cada atualização diária do arquivo)
- ⚠️ 39 MB de PDFs + 21 MB de jsonl versionados no git — o histórico cresce a cada commit diário do robô
- ⚠️ Logo JPEG de 508 KB usado como ícone/favicon (sem PNG otimizado/maskable)

### PWA / UX / A11y
- ✅ Manifest completo, `autoUpdate`, `ReloadPrompt` para nova versão, prompt de instalação customizado
- ✅ Mobile-first com layout dedicado (sidebar desktop / menu flutuante mobile)
- ⚠️ Ícones do manifest em JPEG (recomendado PNG 192/512 + `purpose: maskable`)
- ⚠️ `index.html` com `lang="en"` (app é PT), sem `meta description`/Open Graph/`theme-color`
- ⚠️ Sem Error Boundary — um erro em runtime derruba a árvore inteira
- ⚠️ Erros de auth comunicados com `alert()` (`AuthContext.jsx`) em vez de UI própria/toast

### Internacionalização
- ✅ Infra i18next correta com 3 idiomas e detecção de navegador
- ⚠️ Muitos textos hardcoded em PT fora do i18n (Home inteira em `App.jsx`, modal de configurações, `'Herói 1'` no Tracker, labels "Builder"/"Regras" na sidebar) — EN/ES ficam parcialmente traduzidos

## 7. Problemas Específicos Encontrados (com localização)

1. **`src/pages/Tracker.jsx:582`** — chave CSS `display` duplicada no objeto de estilo (uma das duas é ignorada silenciosamente).
2. **`src/hooks/useMultiplayer.js`** — `createRoom`/`joinRoom` registram novos handlers `peer.on('open')` sobre o peer já criado em `initPeer` (acúmulo de listeners se reconectar); em `peer.on('connection')`, o `conn.send({ state: gameState })` captura `gameState` por closure e pode enviar estado obsoleto a um Guest que entra depois de várias ações.
3. **`src/App.jsx:142`** — `new Audio('data:...')` criado e nunca usado a cada clique (objeto morto por clique; o som real usa Web Audio API logo abaixo).
4. **`src/pages/Collection.jsx:19`** e **`src/pages/Tracker.jsx:79`** — `useEffect` com dependências faltando (`getCloudData`, `joinRoom`) — risco de closure obsoleta.
5. **Imports/variáveis mortos** — `createPortal` (Decks, History, Randomizer), `useRef` (Tracker), `useEffect` (useCloudSync), `peerId` (useMultiplayer), `location`/`navigate` (Builder), `allCards` (Campaign), `snd` (App).
6. **`index.html:2`** — `lang="en"` incorreto para app em português.
7. **`.github/workflows/update-decks.yml`** — Node 18 (fim de vida) e actions v3; atualizar para Node 20/22 e actions v4.
8. **`vite.config.js:33`** — `globPatterns` inclui `jsonl`: cada usuário precacheia 21 MB e re-baixa o arquivo inteiro a cada atualização diária (sem revisão incremental).
9. **Estado duplicado entre páginas** — cada página relê/parseia `localStorage` por conta própria; não há hook `useLocalStorage`/módulo `storage.js` central, o que já causa chaves e defaults repetidos em 8 arquivos.
10. **`src/context/AuthContext.jsx:51`** — `{!loading && children}` faz a árvore inteira "piscar" na carga; um splash/skeleton seria mais suave.

## 8. Recomendações Priorizadas

### P0 — Fundamentos (maior retorno imediato)
1. **Adicionar CI de qualidade**: workflow que roda `npm ci && npm run lint && npm run build` em push/PR.
2. **Introduzir testes**: Vitest + @testing-library/react. Começar pelo que é lógica pura e crítica:
   `utils/ranking.js`, parsing/filtragem de decks, reducer do Tracker, `useMultiplayer` (com peer mockado).
3. **Zerar os 22 warnings de lint** e tratar oxlint como gate (falhar CI em warning novo).
4. **Corrigir o bug da chave duplicada** (`Tracker.jsx:582`) e os `exhaustive-deps`.

### P1 — Performance e dados
5. **Code-splitting**: `React.lazy` por rota + `manualChunks` para separar `firebase` (carregar só no login). Meta: chunk inicial < 300 KB gzip.
6. **Repensar a entrega do `all_decks.jsonl`**: tirar do precache do SW (usar cache runtime `stale-while-revalidate`), ou particionar por herói/ano e carregar sob demanda; considerar hospedar fora do git (Release asset/CDN) para conter o crescimento do repositório.
7. **Mover os PDFs (39 MB)** para Release assets ou storage externo.
8. **Centralizar storage**: criar `src/services/storage.js` (ou hook `useLocalStorage`) com as chaves `mc_*` num único lugar, e fazer o cloud sync cobrir todas as chaves.

### P2 — Robustez e polimento
9. **Error Boundary** global + substituir `alert()` por toasts.
10. **Completar o i18n** (extrair textos hardcoded de App/Home/Tracker/Settings).
11. **Extrair `Home` para `pages/Home.jsx`** e mover estilos inline recorrentes para classes CSS.
12. **Corrigir manifest/HTML**: ícones PNG 192/512 + maskable, `lang="pt-BR"`, meta description/OG.
13. **Versionar `firestore.rules`** no repo e documentar o modelo de segurança.
14. **Atualizar o workflow** (Node 20+, actions v4) e considerar migração gradual para TypeScript (o projeto é pequeno o suficiente para valer a pena).
15. **Corrigir `useMultiplayer`**: registrar `peer.on('open')` uma única vez e usar ref para o estado atual ao sincronizar novos Guests.

## 9. Convenções do Projeto (para agentes/CLIs)

- **Idioma**: código e comentários em PT-BR; commits em português no padrão Conventional Commits
  (`feat(ui): ...`, `fix(auth): ...`, `chore: ...`, `docs: ...`).
- **Branch padrão**: `main`. O robô de decks commita direto na `main` com `[skip ci]`.
- **Versionamento**: manual em `package.json` (exibida no footer) + página `ReleaseNotes.jsx` atualizada a cada release.
- **Estilo visual**: glassmorphism, temas por aspecto do jogo (`aggression`/`justice`/`leadership`/`protection`/`dark-knight`) via `data-theme` no `<body>` e CSS vars em `index.css`.
- **Antes de finalizar qualquer mudança**: rodar `npm run lint` e `npm run build` (não há testes ainda).
- **Não commitar**: `.env`, `dist/`, `node_modules/` (ver `.gitignore`).

---

### Resumo executivo

Projeto **bem organizado e funcional** para o porte (≈6.400 linhas de código próprio): build saudável,
arquitetura de pastas clara, PWA e i18n corretos, automação de dados criativa e segredos fora do git.
As lacunas estruturais mais sérias são **ausência total de testes**, **ausência de CI de qualidade**,
**bundle monolítico de 1,5 MB** e **precache de 21 MB de dados** — todas endereçáveis sem refatoração
grande. O backlog da §8 está em ordem de prioridade recomendada.
