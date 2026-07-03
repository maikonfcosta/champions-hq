import React, { useState, useEffect } from 'react';
import { Shield, ShieldAlert, Skull, Plus, Minus, RotateCcw, FastForward, Clock, Trash2 } from 'lucide-react';

const defaultState = {
  heroes: [
    { id: 1, name: 'Herói 1', hp: 10, status: { stunned: false, confused: false, tough: false } }
  ],
  villainHp: 15,
  villainStage: 1,
  villainStatus: { stunned: false, confused: false, tough: false },
  threat: 0,
  acceleration: 0,
  round: 1,
  extras: []
};

export default function Tracker() {
  const [gameState, setGameState] = useState(() => {
    const saved = localStorage.getItem('mc_tracker_state');
    if (saved) {
      try {
        const s = JSON.parse(saved);
        if (s.heroes) {
          return { ...defaultState, ...s };
        } else if (s.heroHp !== undefined) {
          // Migration from old state
          return {
            ...defaultState,
            heroes: [{ id: 1, name: 'Herói 1', hp: s.heroHp, status: s.heroStatus || { stunned: false, confused: false, tough: false } }],
            villainHp: s.villainHp,
            villainStage: s.villainStage,
            villainStatus: s.villainStatus || { stunned: false, confused: false, tough: false },
            threat: s.threat
          };
        }
      } catch {}
    }
    return defaultState;
  });

  const [activeHeroIdx, setActiveHeroIdx] = useState(0);

  // Attempt to lock screen orientation to landscape for mobile
  useEffect(() => {
    try {
      if (screen.orientation && screen.orientation.lock) {
        screen.orientation.lock('landscape').catch(e => console.log('Orientation lock failed:', e));
      }
    } catch (e) {}

    return () => {
      try {
        if (screen.orientation && screen.orientation.unlock) {
          screen.orientation.unlock();
        }
      } catch (e) {}
    };
  }, []);

  useEffect(() => {
    localStorage.setItem('mc_tracker_state', JSON.stringify(gameState));
  }, [gameState]);

  const updateState = (updates) => {
    setGameState(prev => ({ ...prev, ...updates }));
  };

  // --- HERO METHODS ---
  const addHero = () => {
    if (gameState.heroes.length < 4) {
      updateState({
        heroes: [...gameState.heroes, { 
          id: Date.now(), 
          name: `Herói ${gameState.heroes.length + 1}`, 
          hp: 10, 
          status: { stunned: false, confused: false, tough: false } 
        }]
      });
      setActiveHeroIdx(gameState.heroes.length);
    }
  };

  const removeHero = (idx) => {
    if (gameState.heroes.length > 1 && window.confirm('Remover este herói do tracker?')) {
      const newHeroes = [...gameState.heroes];
      newHeroes.splice(idx, 1);
      updateState({ heroes: newHeroes });
      setActiveHeroIdx(Math.max(0, idx - 1));
    }
  };

  const updateHeroHp = (amount) => {
    const newHeroes = [...gameState.heroes];
    newHeroes[activeHeroIdx].hp = Math.max(0, newHeroes[activeHeroIdx].hp + amount);
    updateState({ heroes: newHeroes });
  };

  const updateHeroStatus = (status) => {
    const newHeroes = [...gameState.heroes];
    newHeroes[activeHeroIdx].status[status] = !newHeroes[activeHeroIdx].status[status];
    updateState({ heroes: newHeroes });
  };

  const renameHero = (newName) => {
    const newHeroes = [...gameState.heroes];
    newHeroes[activeHeroIdx].name = newName;
    updateState({ heroes: newHeroes });
  };

  // --- VILLAIN METHODS ---
  const updateVillainStatus = (status) => {
    setGameState(prev => ({
      ...prev,
      villainStatus: { ...prev.villainStatus, [status]: !prev.villainStatus[status] }
    }));
  };

  // --- EXTRAS METHODS ---
  const addExtra = (type) => {
    const name = window.prompt(`Nome do ${type === 'minion' ? 'Lacaio' : 'Esquema'}:`);
    if (name) {
      updateState({
        extras: [...gameState.extras, { id: Date.now(), name, value: type === 'minion' ? 5 : 3, type }]
      });
    }
  };

  const updateExtra = (id, amount) => {
    updateState({
      extras: gameState.extras.map(ex => ex.id === id ? { ...ex, value: Math.max(0, ex.value + amount) } : ex)
    });
  };

  const removeExtra = (id) => {
    updateState({
      extras: gameState.extras.filter(ex => ex.id !== id)
    });
  };

  const resetGame = () => {
    if (window.confirm('Tem certeza que deseja resetar todo o tracker?')) {
      updateState({
        ...defaultState,
        heroes: gameState.heroes.map((h) => ({ ...h, hp: 10, status: { stunned: false, confused: false, tough: false } }))
      });
    }
  };

  const activeHero = gameState.heroes[activeHeroIdx];

  // Helper function for rendering +/- buttons
  const renderAdjustButtons = (onAdd) => (
    <div style={{ display: 'flex', gap: '8px' }}>
      <button onClick={() => onAdd(-5)} className="btn-secondary" style={{ padding: '8px 12px', fontSize: '0.85rem' }}>-5</button>
      <button onClick={() => onAdd(-1)} className="btn-secondary" style={{ padding: '12px', borderRadius: '50%' }}><Minus size={20} /></button>
    </div>
  );
  
  const renderAddButtons = (onAdd) => (
    <div style={{ display: 'flex', gap: '8px' }}>
      <button onClick={() => onAdd(1)} className="btn-primary" style={{ padding: '12px', borderRadius: '50%' }}><Plus size={20} /></button>
      <button onClick={() => onAdd(5)} className="btn-primary" style={{ padding: '8px 12px', fontSize: '0.85rem' }}>+5</button>
    </div>
  );

  return (
    <div className="animate-fade-in tracker-layout">
      {/* Aviso de Modo Retrato (apenas celular) */}
      <div className="landscape-warning">
        <div style={{ textAlign: 'center' }}>
          <RotateCcw size={48} style={{ marginBottom: '16px', margin: '0 auto' }} />
          <h2>Por favor, vire o celular</h2>
          <p>O Tracker foi otimizado para o modo horizontal.</p>
        </div>
      </div>

      <div className="page-header tracker-header">
        <div>
          <h2 className="page-title">Tracker de Partida</h2>
          <p className="page-subtitle">Modo Completo: Status, ameaça, turnos e extras.</p>
        </div>
        
        {/* Global Counters (inline in header on big screens) */}
        <div className="tracker-globals">
          <div className="tracker-global-item" style={{ borderLeft: '4px solid #a855f7' }}>
            <Clock size={18} color="var(--text-secondary)" />
            <span style={{ fontWeight: 'bold' }}>Rodada:</span>
            <button onClick={() => updateState({ round: Math.max(1, gameState.round - 1) })} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}><Minus size={16} /></button>
            <span style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'white' }}>{gameState.round}</span>
            <button onClick={() => updateState({ round: gameState.round + 1 })} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}><Plus size={16} /></button>
          </div>

          <div className="tracker-global-item" style={{ borderLeft: '4px solid #f97316' }}>
            <FastForward size={18} color="var(--text-secondary)" />
            <span style={{ fontWeight: 'bold' }}>Aceleração:</span>
            <button onClick={() => updateState({ acceleration: Math.max(0, gameState.acceleration - 1) })} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}><Minus size={16} /></button>
            <span style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'white' }}>{gameState.acceleration}</span>
            <button onClick={() => updateState({ acceleration: gameState.acceleration + 1 })} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}><Plus size={16} /></button>
          </div>
        </div>

        <button onClick={resetGame} className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <RotateCcw size={16} /> Nova Partida
        </button>
      </div>

      {/* Main Grid: Heroes, Villain, Threat */}
      <div className="tracker-main-grid">
        
        {/* HERO SECTION */}
        <div className="glass-panel tracker-hero-panel">
          {/* Tabs */}
          <div style={{ display: 'flex', borderBottom: '1px solid rgba(255,255,255,0.1)', overflowX: 'auto' }} className="hide-scrollbar">
            {gameState.heroes.map((hero, idx) => (
              <button 
                key={hero.id}
                onClick={() => setActiveHeroIdx(idx)}
                style={{ 
                  flex: 1, padding: '12px', background: activeHeroIdx === idx ? 'rgba(43, 130, 217, 0.2)' : 'transparent',
                  border: 'none', borderBottom: activeHeroIdx === idx ? '2px solid #2b82d9' : '2px solid transparent',
                  color: activeHeroIdx === idx ? 'white' : 'var(--text-secondary)', cursor: 'pointer', whiteSpace: 'nowrap'
                }}
              >
                {hero.name}
              </button>
            ))}
            {gameState.heroes.length < 4 && (
              <button onClick={addHero} style={{ padding: '12px', background: 'transparent', border: 'none', color: '#2b82d9', cursor: 'pointer' }}>
                <Plus size={20} />
              </button>
            )}
          </div>
          
          <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', width: '100%', marginBottom: '24px' }}>
              <Shield size={32} color="#2b82d9" />
              <input 
                type="text" 
                value={activeHero.name}
                onChange={e => renameHero(e.target.value)}
                style={{ flex: 1, background: 'transparent', border: 'none', borderBottom: '1px solid rgba(255,255,255,0.2)', color: 'white', fontSize: '1.25rem', fontWeight: 'bold', outline: 'none' }}
              />
              {gameState.heroes.length > 1 && (
                <button onClick={() => removeHero(activeHeroIdx)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}><Trash2 size={20}/></button>
              )}
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
              {renderAdjustButtons(updateHeroHp)}
              <span style={{ fontSize: '4rem', fontWeight: '900', color: 'white', width: '90px', textAlign: 'center', lineHeight: 1 }}>{activeHero.hp}</span>
              {renderAddButtons(updateHeroHp)}
            </div>

            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
              <button onClick={() => updateHeroStatus('tough')} className="btn-secondary" style={{ padding: '8px 16px', borderColor: activeHero.status.tough ? '#94a3b8' : '', background: activeHero.status.tough ? 'rgba(148, 163, 184, 0.3)' : '' }}>Tough</button>
              <button onClick={() => updateHeroStatus('stunned')} className="btn-secondary" style={{ padding: '8px 16px', borderColor: activeHero.status.stunned ? '#ef4444' : '', background: activeHero.status.stunned ? 'rgba(239, 68, 68, 0.3)' : '' }}>Stunned</button>
              <button onClick={() => updateHeroStatus('confused')} className="btn-secondary" style={{ padding: '8px 16px', borderColor: activeHero.status.confused ? '#eab308' : '', background: activeHero.status.confused ? 'rgba(234, 179, 8, 0.3)' : '' }}>Confused</button>
            </div>
          </div>
        </div>

        {/* VILLAIN SECTION */}
        <div className="glass-panel tracker-villain-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center', borderTop: '4px solid #e62429' }}>
          <Skull size={40} color="#e62429" style={{ marginBottom: '16px' }} />
          <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '8px' }}>Vilão</h3>
          <div style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ color: 'var(--text-secondary)' }}>Estágio:</span>
            <select 
              value={gameState.villainStage} 
              onChange={(e) => updateState({ villainStage: parseInt(e.target.value) })}
              style={{ background: 'rgba(0,0,0,0.5)', color: 'white', border: '1px solid rgba(255,255,255,0.2)', padding: '4px 8px', borderRadius: '4px', outline: 'none' }}
            >
              <option value={1}>I</option>
              <option value={2}>II</option>
              <option value={3}>III</option>
            </select>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
            {renderAdjustButtons((amt) => updateState({ villainHp: Math.max(0, gameState.villainHp + amt) }))}
            <span style={{ fontSize: '4rem', fontWeight: '900', color: 'white', width: '90px', textAlign: 'center', lineHeight: 1 }}>{gameState.villainHp}</span>
            {renderAddButtons((amt) => updateState({ villainHp: gameState.villainHp + amt }))}
          </div>

          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
            <button onClick={() => updateVillainStatus('tough')} className="btn-secondary" style={{ padding: '8px 16px', borderColor: gameState.villainStatus.tough ? '#94a3b8' : '', background: gameState.villainStatus.tough ? 'rgba(148, 163, 184, 0.3)' : '' }}>Tough</button>
            <button onClick={() => updateVillainStatus('stunned')} className="btn-secondary" style={{ padding: '8px 16px', borderColor: gameState.villainStatus.stunned ? '#ef4444' : '', background: gameState.villainStatus.stunned ? 'rgba(239, 68, 68, 0.3)' : '' }}>Stunned</button>
            <button onClick={() => updateVillainStatus('confused')} className="btn-secondary" style={{ padding: '8px 16px', borderColor: gameState.villainStatus.confused ? '#eab308' : '', background: gameState.villainStatus.confused ? 'rgba(234, 179, 8, 0.3)' : '' }}>Confused</button>
          </div>
        </div>

        {/* THREAT SECTION */}
        <div className="glass-panel tracker-threat-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center', borderTop: '4px solid #fbc02d' }}>
          <ShieldAlert size={40} color="#fbc02d" style={{ marginBottom: '16px' }} />
          <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '24px' }}>Ameaça Principal (Threat)</h3>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            {renderAdjustButtons((amt) => updateState({ threat: Math.max(0, gameState.threat + amt) }))}
            <span style={{ fontSize: '4rem', fontWeight: '900', color: '#fbc02d', width: '90px', textAlign: 'center', lineHeight: 1 }}>{gameState.threat}</span>
            {renderAddButtons((amt) => updateState({ threat: Math.max(0, gameState.threat + amt) }))}
          </div>
        </div>
      </div>

      {/* EXTRAS: Minions & Side Schemes */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '8px', marginBottom: '16px' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>Contadores Extras</h3>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button onClick={() => addExtra('minion')} className="btn-secondary" style={{ padding: '6px 12px', fontSize: '0.85rem' }}>+ Lacaio</button>
            <button onClick={() => addExtra('scheme')} className="btn-secondary" style={{ padding: '6px 12px', fontSize: '0.85rem' }}>+ Esquema</button>
          </div>
        </div>
        
        {gameState.extras.length === 0 ? (
          <p style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '20px' }}>Nenhum contador extra na mesa.</p>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '16px' }}>
            {gameState.extras.map(ex => (
              <div key={ex.id} className="glass-panel" style={{ padding: '16px', display: 'flex', flexDirection: 'column', borderLeft: `4px solid ${ex.type === 'minion' ? '#e62429' : '#fbc02d'}` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                  <div>
                    <h4 style={{ fontWeight: 'bold' }}>{ex.name}</h4>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>{ex.type === 'minion' ? 'Lacaio (HP)' : 'Esquema (Ameaça)'}</span>
                  </div>
                  <button onClick={() => removeExtra(ex.id)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}><Trash2 size={16} /></button>
                </div>
                
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <button onClick={() => updateExtra(ex.id, -1)} className="btn-secondary" style={{ padding: '8px', borderRadius: '50%' }}><Minus size={16} /></button>
                  <span style={{ fontSize: '2rem', fontWeight: 'bold', color: ex.type === 'minion' ? '#e62429' : '#fbc02d' }}>{ex.value}</span>
                  <button onClick={() => updateExtra(ex.id, +1)} className="btn-secondary" style={{ padding: '8px', borderRadius: '50%' }}><Plus size={16} /></button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
