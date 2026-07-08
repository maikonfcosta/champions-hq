# Dashboard Avançado Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transformar a tela de Estatísticas (Dashboard) em um "Dashboard Avançado", adicionando métricas mais granulares como tempo de partida, dano por rodada, média de duração e expandir o painel de Heróis e Vilões.

**Architecture:**
Para calcular "tempo de partida" e "dano por turno/rodada", precisamos que o registro de Histórico suporte essas métricas.
1. Expandir o formulário em `History.jsx` para receber campos opcionais de "Duração (minutos)", "Rodadas (Total)" e "Dano Causado ao Vilão".
2. Melhorar o `Dashboard.jsx` adicionando os cards dessas novas métricas calculadas.

**Tech Stack:** React, Lucide React, CSS.

---

### Task 1: Expandir os Dados do Histórico (`History.jsx`)

**Files:**
- Modify: `src/pages/History.jsx`

- [ ] **Step 1: Atualizar o estado do formulário e interface**
Adicionar os campos no estado `form`:
```javascript
duration: '',
rounds: '',
totalDamage: ''
```
E adicionar três novos `inputs` numéricos no modal de "Adicionar Partida":
- Duração (Minutos)
- Total de Rodadas
- Dano Total Causado

- [ ] **Step 2: Exibir os novos dados na listagem**
No card de cada histórico (`<div className="glass-panel" key={index}>`), caso tenha essas métricas cadastradas, exibi-las em uma linha de pequenos ícones na parte inferior do card (ex: `<Clock size={14} /> 45 min`, `<RotateCcw size={14} /> 6 Rodadas`, etc.).

---

### Task 2: Implementar as Novas Métricas no `Dashboard.jsx`

**Files:**
- Modify: `src/pages/Dashboard.jsx`

- [ ] **Step 1: Cálculos de Médias**
Na função `calculateStats(data)`, calcular:
- Média de tempo (`averageDuration`)
- Média de rodadas (`averageRounds`)
- Dano por rodada médio (`averageDamagePerRound`) - calculando o total de dano somado dividido pelo total de rodadas somadas das partidas que possuem esses dados preenchidos.
- Top 3 Vilões Mais Enfrentados (não apenas o 1º)
- Top 3 Heróis Mais Jogados (não apenas o 1º)

- [ ] **Step 2: Novos Cards Visuais (Avançados)**
Criar uma nova seção visual chamada "Métricas de Partida" no Dashboard contendo três cards com estilo neon/glass-panel:
- Tempo Médio (Ícone: Clock)
- Rodadas Médias (Ícone: Hash)
- Dano por Rodada (Ícone: Zap ou Swords)

- [ ] **Step 3: Melhoria nos Rankings**
Substituir o card atual de "Herói Favorito" e "Nêmesis" por listas de Top 3:
- "Heróis Mais Jogados"
- "Vilões Mais Enfrentados"
Isso enriquecerá drasticamente a tela de Dashboard e fará jus à Prioridade "Dashboard Avançado".

---

### Task 3: Commit e Review

```bash
git checkout -b feature/advanced-dashboard preview
git add src/pages/History.jsx src/pages/Dashboard.jsx
git commit -m "feat: implement advanced dashboard and match metrics"
```
