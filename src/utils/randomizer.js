export function generateSetup(cards, villains, modularSets, ownedPacks, forcedSeed = null) {
  const ownedPacksCount = Object.keys(ownedPacks).filter(k => ownedPacks[k]).length;
  
  // Filtrar cartas
  const availableCards = ownedPacksCount > 0 
    ? cards.filter(c => ownedPacks[c.pack_code] || c.pack_code === 'core') 
    : cards;

  // Seleção de Herói e Aspecto
  const aspects = [
    { code: 'aggression', name: 'Agressividade', color: 'var(--aspect-aggression)' },
    { code: 'justice', name: 'Justiça', color: 'var(--aspect-justice)' },
    { code: 'leadership', name: 'Liderança', color: 'var(--aspect-leadership)' },
    { code: 'protection', name: 'Proteção', color: 'var(--aspect-protection)' },
  ];

  const heroes = availableCards.filter(c => c.type_code === 'hero');
  let randomHero = null;
  let randomAspect = null;
  let generatedDeck = [];

  if (heroes.length > 0) {
    if (forcedSeed && forcedSeed.hero) {
      randomHero = heroes.find(h => h.name === forcedSeed.hero) || heroes[Math.floor(Math.random() * heroes.length)];
    } else {
      randomHero = heroes[Math.floor(Math.random() * heroes.length)];
    }

    if (forcedSeed && forcedSeed.aspect) {
      randomAspect = aspects.find(a => a.name === forcedSeed.aspect) || aspects[Math.floor(Math.random() * aspects.length)];
    } else {
      randomAspect = aspects[Math.floor(Math.random() * aspects.length)];
    }

    const signatureCards = availableCards.filter(c => 
      c.card_set_code === randomHero.card_set_code && 
      c.type_code !== 'hero' && 
      c.type_code !== 'alter_ego'
    );

    const validPool = availableCards.filter(c => 
      (c.faction_code === randomAspect.code || c.faction_code === 'basic') &&
      ['ally', 'event', 'resource', 'support', 'upgrade'].includes(c.type_code)
    );

    const shuffledPool = validPool.sort(() => 0.5 - Math.random());
    
    const aspectBasicCards = [];
    let count = 0;
    for (const card of shuffledPool) {
      if (count >= 25) break;
      const qty = card.deck_limit || 1; 
      const addQty = Math.min(qty, 25 - count);
      if (addQty > 0) {
        aspectBasicCards.push({ ...card, quantity: addQty });
        count += addQty;
      }
    }

    generatedDeck = [...signatureCards.map(c => ({...c, quantity: c.quantity || 1})), ...aspectBasicCards];
  }

  // Seleção de Vilão
  const availableVillains = ownedPacksCount > 0 
    ? villains.filter(v => ownedPacks[v.pack_code] || v.pack_code === 'core')
    : villains;

  let randomVillain = null;
  if (forcedSeed && forcedSeed.villain) {
    randomVillain = villains.find(v => v.name === forcedSeed.villain) || null;
  } else if (availableVillains.length > 0) {
    randomVillain = availableVillains[Math.floor(Math.random() * availableVillains.length)];
  }

  // Seleção de Modulares
  const availableModulars = ownedPacksCount > 0 
    ? modularSets.filter(m => ownedPacks[m.pack_code] || m.pack_code === 'core')
    : modularSets;

  let randomModulars = [];
  if (forcedSeed && forcedSeed.modulars && forcedSeed.modulars.length > 0) {
    randomModulars = modularSets.filter(m => forcedSeed.modulars.includes(m.name));
  } else if (availableModulars.length > 0) {
    // Pegar 2 modulares aleatórios, mas pode-se inserir lógica alwaysLeads se houver mapping no futuro
    const shuffledMods = availableModulars.sort(() => 0.5 - Math.random());
    randomModulars = shuffledMods.slice(0, 2);
  }

  return {
    hero: randomHero,
    aspect: randomAspect,
    deck: generatedDeck,
    villain: randomVillain,
    modulars: randomModulars
  };
}
