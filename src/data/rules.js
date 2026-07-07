export const rulesDictionary = [
  // Status
  { term: "Tough (Robusto)", category: "Status", desc: "Previne a próxima instância de qualquer quantidade de dano. Descarte o status logo após prevenir o dano." },
  { term: "Stunned (Atordoado)", category: "Status", desc: "Substitui o próximo ataque do personagem por descartar esta carta de status. O personagem não pode atacar." },
  { term: "Confused (Confuso)", category: "Status", desc: "Substitui a próxima intervenção (thwart) do personagem por descartar esta carta de status. O personagem não pode intervir." },
  
  // Keywords
  { term: "Overkill (Sobrecarga)", category: "Keyword", desc: "Dano excedente causado ao derrotar um lacaio é transferido para o vilão (e vice-versa se um ataque de vilão derrotar um aliado)." },
  { term: "Retaliate X (Retaliação X)", category: "Keyword", desc: "Após este personagem sofrer um ataque (e sobreviver ao dano), ele causa X de dano passivo ao atacante." },
  { term: "Surge (Surto)", category: "Keyword", desc: "Após revelar esta carta do deck de encontros, revele imediatamente a carta do topo do deck de encontros." },
  { term: "Incite X (Incitamento X)", category: "Keyword", desc: "Quando esta carta é revelada, coloque X ameaças imediatamente no esquema principal." },
  { term: "Hindering X (Obstrução X)", category: "Keyword", desc: "Quando este card entrar em jogo, coloque X ameaças adicionais sobre ele." },
  { term: "Quick Strike (Ataque Rápido)", category: "Keyword", desc: "Após este inimigo engajar com o seu herói, ele o ataca imediatamente (se você estiver em forma de Herói)." },
  { term: "Toughness (Robustez)", category: "Keyword", desc: "Quando este personagem entra em jogo, coloque automaticamente uma carta de status Tough nele." },
  { term: "Villainous (Vilanesco)", category: "Keyword", desc: "Quando este lacaio ativar (atacando ou esquematizando), ele recebe um boost como o vilão (compre a carta do topo e some os ícones)." },
  { term: "Patrol (Patrulha)", category: "Keyword", desc: "Enquanto este lacaio estiver em jogo e engajado com você, você não pode remover ameaça do Esquema Principal." },
  { term: "Guard (Guarda)", category: "Keyword", desc: "Enquanto este lacaio estiver em jogo e engajado com você, você não pode atacar o vilão." },
  { term: "Piercing (Perfurante)", category: "Keyword", desc: "Um ataque com Piercing descarta passivamente o status Tough do alvo antes de causar o dano." },
  { term: "Ranged (À Distância)", category: "Keyword", desc: "Ataques Ranged ignoram a palavra-chave Retaliate (Retaliação) do defensor." },
  { term: "Team-Up (Equipe)", category: "Keyword", desc: "Você só pode jogar esta carta se os dois personagens indicados (Heróis ou Aliados) estiverem em jogo." },
  { term: "Stalwart (Resistente)", category: "Keyword", desc: "Este personagem não pode ser Atordoado (Stunned) nem Confuso (Confused)." },
  { term: "Permanent (Permanente)", category: "Keyword", desc: "Esta carta não pode sair de jogo de nenhuma maneira." },
  { term: "Setup (Preparação)", category: "Keyword", desc: "Esta carta começa o jogo já em campo." },
  
  // Icons & Mechanics
  { term: "Hazard (Perigo)", category: "Ícone", desc: "Distribua 1 carta de encontro extra na Fase do Vilão (Passo 3) por cada ícone de Hazard ativo em jogo." },
  { term: "Acceleration (Aceleração)", category: "Ícone", desc: "Adicione 1 ameaça extra no esquema principal no primeiro passo da fase do vilão, por cada ícone de Acceleration em jogo." },
  { term: "Crisis (Crise)", category: "Ícone", desc: "Enquanto houver um ícone de crise em jogo, os jogadores não podem remover ameaça do Esquema Principal." },
  { term: "Amplify (Amplificar)", category: "Ícone", desc: "Aumenta o número de ícones de boost revelados em cartas de encontro em 1 para cada ícone Amplify em jogo." },
  { term: "Peril (Perigo Iminente)", category: "Mecânica", desc: "Quando revelado, o jogador não pode pedir ajuda, nem receber interrupções/ações de outros jogadores para resolver a carta." }
];
