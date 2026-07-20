# Planejamento: Feature de Desafios (Challenges)

A funcionalidade de **Desafios da Semana** já teve uma base excelente implementada na `main`! O roteamento foi criado, a página base com a verificação de Coleção (Expansões Faltantes) e o Randomizer foram interligados. 

Para concluirmos essa feature com a qualidade exigida no **Champions HQ**, precisamos dos seguintes refinamentos:

## 1. Internacionalização (i18n)
Atualmente a página `Challenges.jsx` possui muitos textos chumbados (ex: *"Desafio da Semana"*, *"Nenhum Desafio Ativo"*, *"Ranking Global"*). 
- Vamos extrair esses textos para os arquivos de tradução (`pt.json`, `en.json`, `es.json`) para respeitar a arquitetura global do aplicativo lançada na v1.1.0.

## 2. Destaque Visual no Histórico (`History.jsx`)
- As partidas jogadas através do modo Desafio concedem um bônus de XP (ex: +20 XP).
- Vamos modificar o `History.jsx` para exibir um ícone especial de **Troféu** (<Trophy />) nessas entradas de histórico específicas.
- Vamos garantir que a exibição do bônus de XP de desafio esteja clara na interface do histórico.

## 3. Revisão de UX e Responsividade
- O `Challenges.jsx` utiliza um `gridTemplateColumns: 'minmax(300px, 1fr) minmax(300px, 350px)'`. Em celulares, isso pode gerar rolagem horizontal ou quebra de layout caso a media query não esteja forçando `1fr` no mobile. 
- Ajustaremos a responsividade para garantir que o Banner e o Leaderboard fiquem empilhados (coluna única) em dispositivos menores, alinhados com o conceito *Mobile First*.

## 4. Validação & Qualidade (CI Local)
- Acionaremos a skill `qa-ci-local` para rodar o Linter e a esteira de validação em cima de todos os arquivos modificados (`App.jsx`, `Randomizer.jsx`, `Challenges.jsx`, `challenges.js`, etc.).

## 5. Release Notes e Deploy
- Após as validações, faremos a atualização do `package.json` para a nova versão (ex: `1.4.0`).
- Adicionaremos o log detalhado em `ReleaseNotes.jsx`.
- Faremos o commit formal e o push, encerrando a task.

---
**Status:** Aguardando sua aprovação para iniciarmos a execução!
