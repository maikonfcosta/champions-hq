export const calculateMatchXP = (result, difficulty) => {
  let xp = 0;
  
  if (result === 'Vitória') {
    switch(difficulty) {
      case 'Heroic': xp = 200; break;
      case 'Expert': xp = 150; break;
      default: xp = 100; // Standard
    }
  } else {
    // Derrota
    switch(difficulty) {
      case 'Heroic': xp = 0; break;
      case 'Expert': xp = -15; break;
      default: xp = -25; // Standard
    }
  }
  
  return xp;
};

export const getRankInfo = (totalXP) => {
  if (totalXP < 500) {
    return {
      title: 'Recruta da S.H.I.E.L.D.',
      color: '#94a3b8', // Bronze/Gray
      minXP: 0,
      nextXP: 500,
      icon: 'Shield'
    };
  } else if (totalXP < 1500) {
    return {
      title: 'Defensor de Nova York',
      color: '#cbd5e1', // Silver
      minXP: 500,
      nextXP: 1500,
      icon: 'Star'
    };
  } else if (totalXP < 3000) {
    return {
      title: 'Vingador',
      color: '#fbbf24', // Gold
      minXP: 1500,
      nextXP: 3000,
      icon: 'Award'
    };
  } else {
    return {
      title: 'Lenda Marvel',
      color: '#a855f7', // Vibranium (Purple/Neon)
      minXP: 3000,
      nextXP: null,
      icon: 'Zap'
    };
  }
};
