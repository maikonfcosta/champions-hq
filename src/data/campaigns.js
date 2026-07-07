export const campaigns = [
  {
    id: "rors",
    name: "The Rise of Red Skull",
    scenarios: [
      { id: "crossbones", name: "Crossbones", setup: "Coloque o Conjunto Modular 'Experimental Weapons' de lado. Cada jogador pode gastar pontos da campanha anterior (se houver)." },
      { id: "absorbing_man", name: "Absorbing Man", setup: "Atraso na montanha: se tiver o atraso no registro, adicione as ameaças." },
      { id: "taskmaster", name: "Taskmaster", setup: "Reféns da Hydra: separe os aliados capturados conforme as regras da campanha." },
      { id: "zola", name: "Arnim Zola", setup: "Adicione os lacaios baseados nos testes científicos." },
      { id: "red_skull", name: "Red Skull", setup: "Separe os side schemes do deck especial de side schemes do Red Skull." }
    ],
    upgrades: [
      "Tech Shirt (Resistência)",
      "Laser Rifle (Dano)",
      "Adrenal Stims (Prontidão)",
      "Tactical Scanner (Compra)",
      "Basic Defense (1 ponto de vida extra)"
    ],
    obligations: [
      "Delay the Inevitable",
      "Grounded",
      "Evacuation"
    ]
  },
  {
    id: "gmw",
    name: "The Galaxy's Most Wanted",
    scenarios: [
      { id: "badoon", name: "Brotherhood of Badoon", setup: "Coloque a nave Milano em jogo." },
      { id: "collector_1", name: "Infiltrate the Museum", setup: "A coleção começa vazia. Prepare-se para perder cartas." },
      { id: "collector_2", name: "Escape the Museum", setup: "Fugindo com a Milano." },
      { id: "nebula", name: "Nebula", setup: "Contadores de Evasão da Nebula." },
      { id: "ronan", name: "Ronan the Accuser", setup: "Ele já começa com a Joia do Poder. Boa sorte." }
    ],
    upgrades: ["Milano Upgrades (Units)"],
    obligations: ["Bounty"]
  },
  {
    id: "mts",
    name: "Mad Titan's Shadow",
    scenarios: [
      { id: "ebony_maw", name: "Ebony Maw", setup: "Contadores de feitiço ativados." },
      { id: "tower_defense", name: "Tower Defense", setup: "Defenda a Torre dos Vingadores." },
      { id: "thanos", name: "Thanos", setup: "Deck de Joias do Infinito preparado." },
      { id: "hela", name: "Hela", setup: "Resgate o Odin." },
      { id: "loki", name: "Loki", setup: "Múltiplas versões de Loki em jogo." }
    ],
    upgrades: ["Norn Stones", "Asgardian Allies"],
    obligations: ["Thanos's Gaze"]
  },
  {
    id: "sm",
    name: "Sinister Motives",
    scenarios: [
      { id: "sandman", name: "Sandman", setup: "Balcão de areia (City Streets)." },
      { id: "venom", name: "Venom", setup: "Sinos tocando." },
      { id: "mysterio", name: "Mysterio", setup: "Cartas de ilusão no seu deck." },
      { id: "sinister_six", name: "The Sinister Six", setup: "Vilões que entram e saem de jogo." },
      { id: "venom_goblin", name: "Venom Goblin", setup: "Múltiplos Main Schemes ativos simultaneamente." }
    ],
    upgrades: ["Reputação da S.H.I.E.L.D.", "OSCORP Tech"],
    obligations: ["Public Outcry"]
  },
  {
    id: "mg",
    name: "Mutant Genesis",
    scenarios: [
      { id: "sabertooth", name: "Sabretooth", setup: "Proteja o Robert Kelly." },
      { id: "sentinels", name: "Project Wideawake", setup: "Rapto de Mutantes." },
      { id: "master_mold", name: "Master Mold", setup: "Fábrica de Sentinelas." },
      { id: "mansion_attack", name: "Mansion Attack", setup: "Defenda a Mansão X (Múltiplos vilões Brotherhood)." },
      { id: "magneto", name: "Magneto", setup: "Contadores Magnéticos." }
    ],
    upgrades: ["Ally Mutants (Role)"],
    obligations: ["Anti-Mutant Protest"]
  },
  {
    id: "ne",
    name: "NeXt Evolution",
    scenarios: [
      { id: "morlock", name: "Morlock Siege", setup: "Defenda os túneis." },
      { id: "stryfe", name: "On the Run", setup: "Fugindo da perseguição." },
      { id: "juggernaut", name: "Juggernaut", setup: "O Capacete Inevitável." },
      { id: "mister_sinister", name: "Mister Sinister", setup: "Poder mutante genético." },
      { id: "stryfe_final", name: "Stryfe", setup: "A batalha no espaço temporal." }
    ],
    upgrades: ["Hope Summers (Ally)"],
    obligations: ["Captured Morlocks"]
  },
  {
    id: "aoa",
    name: "Age of Apocalypse",
    scenarios: [
      { id: "unuscione", name: "Unuscione", setup: "Ataque inicial." },
      { id: "en_saba_nur", name: "En Sabah Nur", setup: "O Início do Apocalipse." },
      { id: "dark_beast", name: "Dark Beast", setup: "Experimentos genéticos." },
      { id: "apocalypse", name: "Apocalypse", setup: "Os 4 Cavaleiros." },
      { id: "apocalypse_final", name: "Apocalypse (Final)", setup: "O domínio final." }
    ],
    upgrades: ["Resistência Mutante"],
    obligations: ["Era Sombria"]
  }
];
