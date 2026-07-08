# Modo Ranqueado (Ranked Mode) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) ou superpowers:executing-plans para implementar este plano passo a passo. Utilize checkboxes (`- [ ]`) para monitorar o progresso.

**Goal:** Implementar a Prioridade 5. Adicionar um sistema de pontuação baseado nas partidas registradas (Vitória/Derrota e Dificuldade), gerando um "Score Global" e uma "Liga/Rank" para o jogador, sendo exibidos em destaque no Dashboard e calculados em tempo real.

**Regras de Pontuação Sugeridas:**
- Base: Vitória = +100 XP | Derrota = -25 XP
- Multiplicadores de Dificuldade:
  - **Standard**: 1.0x (Vitória: +100 | Derrota: -25)
  - **Expert**: 1.5x (Vitória: +150 | Derrota: -15) *Derrotas no expert punem menos*
  - **Heroic**: 2.0x (Vitória: +200 | Derrota: 0) *Sem punição por tentar Heroic*

**Sistema de Ligas/Ranks:**
- 0 a 499 XP: **Recruta da S.H.I.E.L.D.** (Bronze)
- 500 a 1499 XP: **Defensor de Nova York** (Prata)
- 1500 a 2999 XP: **Vingador** (Ouro)
- 3000+ XP: **Lenda Marvel** (Vibranium/Neon)

---

### Task 1: Função de Cálculo de Pontuação

**Files:**
- Modificar: `src/pages/Dashboard.jsx` (ou num utilitário novo, mas no Dashboard já fazemos parse do histórico).

- [ ] **Step 1: Criar a lógica de XP**
  Dentro da iteração do histórico (`data.forEach(match => {...})`) no `Dashboard.jsx`, calcular o XP daquela partida usando a regra baseada no `match.difficulty` e `match.result`.
  Somar os valores num acumulador `totalXP`.

- [ ] **Step 2: Determinar o Rank e Progresso**
  Baseado no `totalXP`, determinar:
  - O Título do Rank atual.
  - A cor/estilo do Rank.
  - Progresso para o próximo rank (porcentagem da barra de XP).

---

### Task 2: Nova Seção Visual no Dashboard

**Files:**
- Modificar: `src/pages/Dashboard.jsx`

- [ ] **Step 1: Adicionar Card Heroico de Rank**
  No topo do Dashboard (antes dos cards de Estatísticas Gerais), adicionar uma seção de "Classificação Global".
  Este card será proeminente (glass-panel), exibindo:
  - Um ícone grandioso (ex: `Shield`, `Trophy` ou `Star`).
  - O título do Rank Atual em destaque com cores neon correspondentes.
  - O Total de Pontos de Prestígio / XP.
  - Uma barra de progresso (ProgressBar) mostrando a % para alcançar a próxima liga.

---

### Task 3: Exibir XP Individual no Histórico

**Files:**
- Modificar: `src/pages/History.jsx`

- [ ] **Step 1: Mostrar pontuação por partida**
  No componente que renderiza o card do histórico em `History.jsx`, calcular visualmente (ou reutilizar função se extraída) o valor de XP ganho/perdido.
  Adicionar no cantinho do card algo como `<span style={{color: 'green'}}>+150 XP</span>`.

---

### Task 4: Commit e Validação

```bash
git checkout -b feature/ranked-mode preview
git add .
git commit -m "feat: implement ranked mode with XP and Leagues"
```
