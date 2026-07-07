import React, { useState, useEffect, useRef } from 'react';
import { Shield, ShieldAlert, Skull, Plus, Minus, RotateCcw, FastForward, Clock, Trash2, Users, Wifi, Copy, Check, Camera, X } from 'lucide-react';
import Modal from '../components/Modal';
import { useMultiplayer } from '../hooks/useMultiplayer';
import { QRCodeSVG } from 'qrcode.react';
import { Html5QrcodeScanner } from 'html5-qrcode';

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
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [removeHeroIdx, setRemoveHeroIdx] = useState(null);
  const [promptModal, setPromptModal] = useState({ isOpen: false, type: null, value: '' });

  const getInitialState = () => {
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
  };

  const { 
    gameState, 
    dispatchAction, 
    isConnected, 
    isHost, 
    roomId, 
    createRoom, 
    joinRoom, 
    disconnect,
    error,
    setGameStateDirect 
  } = useMultiplayer(getInitialState());

  const [showMultiplayer, setShowMultiplayer] = useState(false);
  const [joinId, setJoinId] = useState('');
  const [copied, setCopied] = useState(false);
  const [showScanner, setShowScanner] = useState(false);

  // Scanner Logic
  useEffect(() => {
    let scanner = null;
    if (showScanner) {
      scanner = new Html5QrcodeScanner("reader", { fps: 10, qrbox: { width: 250, height: 250 } }, false);
      scanner.render((decodedText) => {
        setJoinId(decodedText);
        setShowScanner(false);
        joinRoom(decodedText);
        scanner.clear();
      }, (error) => {
        // Ignore read errors
      });
    }
    return () => {
      if (scanner) {
        scanner.clear().catch(e => console.error(e));
      }
    };
  }, [showScanner]);

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
    dispatchAction(prev => ({ ...prev, ...updates }));
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(roomId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch(err) { }
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
    if (gameState.heroes.length > 1) {
      setRemoveHeroIdx(idx);
    }
  };

  const confirmRemoveHero = () => {
    if (removeHeroIdx !== null) {
      const newHeroes = [...gameState.heroes];
      newHeroes.splice(removeHeroIdx, 1);
      updateState({ heroes: newHeroes });
      setActiveHeroIdx(Math.max(0, removeHeroIdx - 1));
      setRemoveHeroIdx(null);
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
    dispatchAction(prev => ({
      ...prev,
      villainStatus: { ...prev.villainStatus, [status]: !prev.villainStatus[status] }
    }));
  };

  // --- EXTRAS METHODS ---
  const addExtra = (type) => {
    setPromptModal({ isOpen: true, type, value: '' });
  };

  const confirmAddExtra = (e) => {
    e.preventDefault();
    if (promptModal.value.trim()) {
      updateState({
        extras: [...gameState.extras, { id: Date.now(), name: promptModal.value.trim(), value: promptModal.type === 'minion' ? 5 : 3, type: promptModal.type }]
      });
      setPromptModal({ isOpen: false, type: null, value: '' });
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
    setShowResetConfirm(true);
  };
  
  const confirmResetGame = () => {
    updateState({
      ...defaultState,
      heroes: gameState.heroes.map((h) => ({ ...h, hp: 10, status: { stunned: false, confused: false, tough: false } }))
    });
    setShowResetConfirm(false);
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

        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <button onClick={() => setShowMultiplayer(true)} className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '8px', borderColor: isConnected ? '#4ade80' : '' }}>
            {isConnected ? <Wifi size={16} color="#4ade80" /> : <Users size={16} />}
            {isConnected ? 'Conectado' : 'Multiplayer'}
          </button>
          
          <button onClick={resetGame} className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <RotateCcw size={16} /> Nova Partida
          </button>
        </div>
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

      <Modal
        isOpen={removeHeroIdx !== null}
        onClose={() => setRemoveHeroIdx(null)}
        title="Remover Herói"
        maxWidth="400px"
      >
        <div style={{ textAlign: 'center' }}>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>Tem certeza que deseja remover este herói do tracker?</p>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
            <button onClick={() => setRemoveHeroIdx(null)} className="btn-secondary" style={{ flex: 1 }}>Cancelar</button>
            <button onClick={confirmRemoveHero} className="btn-primary" style={{ flex: 1, background: 'var(--primary-color)' }}>Remover</button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={showResetConfirm}
        onClose={() => setShowResetConfirm(false)}
        title="Resetar Tracker"
        maxWidth="400px"
      >
        <div style={{ textAlign: 'center' }}>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>Tem certeza que deseja resetar todo o tracker?</p>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
            <button onClick={() => setShowResetConfirm(false)} className="btn-secondary" style={{ flex: 1 }}>Cancelar</button>
            <button onClick={confirmResetGame} className="btn-primary" style={{ flex: 1, background: 'var(--primary-color)' }}>Resetar</button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={promptModal.isOpen}
        onClose={() => setPromptModal({ isOpen: false, type: null, value: '' })}
        title={`Adicionar ${promptModal.type === 'minion' ? 'Lacaio' : 'Esquema'}`}
        maxWidth="400px"
      >
        <form onSubmit={confirmAddExtra} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', color: 'var(--text-secondary)', marginBottom: '8px' }}>Nome:</label>
            <input 
              type="text"
              autoFocus
              value={promptModal.value}
              onChange={(e) => setPromptModal({ ...promptModal, value: e.target.value })}
              style={{ width: '100%', background: 'rgba(0,0,0,0.5)', color: 'white', border: '1px solid rgba(255,255,255,0.2)', padding: '12px', borderRadius: '8px' }}
              placeholder={`Digite o nome do ${promptModal.type === 'minion' ? 'Lacaio' : 'Esquema'}...`}
            />
          </div>
          <div style={{ display: 'flex', gap: '16px', marginTop: '8px' }}>
            <button type="button" onClick={() => setPromptModal({ isOpen: false, type: null, value: '' })} className="btn-secondary" style={{ flex: 1 }}>Cancelar</button>
            <button type="submit" className="btn-primary" style={{ flex: 1 }}>Adicionar</button>
          </div>
        </form>
      </Modal>

      {/* MULTIPLAYER MODAL */}
      <Modal
        isOpen={showMultiplayer}
        onClose={() => setShowMultiplayer(false)}
        title="Sincronização Multiplayer"
        maxWidth="450px"
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Mantenha a vida do Vilão e a Ameaça sincronizadas em tempo real entre os celulares da mesa via WebRTC.
          </p>
          
          {error && (
            <div style={{ padding: '12px', background: 'rgba(239,68,68,0.2)', border: '1px solid #ef4444', borderRadius: '8px', color: '#fca5a5', fontSize: '0.9rem' }}>
              Erro: {error}
            </div>
          )}

          {isConnected ? (
            <div style={{ padding: '20px', background: 'rgba(0,0,0,0.4)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', textAlign: 'center' }}>
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
                <div style={{ padding: '16px', background: 'rgba(74, 222, 128, 0.1)', borderRadius: '50%', color: '#4ade80' }}>
                  <Wifi size={32} />
                </div>
              </div>
              <h4 style={{ color: '#4ade80', marginBottom: '8px', fontSize: '1.2rem' }}>Conectado</h4>
              
              {isHost ? (
                <>
                  <p style={{ color: 'var(--text-secondary)', marginBottom: '12px' }}>Você é o Host da sala. Compartilhe o ID ou mostre o QR Code abaixo para os jogadores.</p>
                  <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
                    <input type="text" readOnly value={roomId} style={{ flex: 1, background: 'rgba(0,0,0,0.5)', color: 'white', border: '1px solid var(--primary-color)', padding: '12px', borderRadius: '8px', textAlign: 'center', fontSize: '1.1rem', letterSpacing: '2px', fontWeight: 'bold' }} />
                    <button onClick={copyToClipboard} className="btn-primary" style={{ padding: '12px' }}>
                      {copied ? <Check size={20} /> : <Copy size={20} />}
                    </button>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px', background: 'white', padding: '16px', borderRadius: '12px', display: 'inline-block', margin: '0 auto 24px auto' }}>
                    <QRCodeSVG value={roomId} size={150} level={"H"} />
                  </div>
                </>
              ) : (
                <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>Você é um Guest. O tracker está espelhando a mesa do Host (ID: {roomId}).</p>
              )}

              <button onClick={disconnect} className="btn-secondary" style={{ width: '100%', borderColor: '#ef4444', color: '#ef4444' }}>Desconectar</button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              
              <div style={{ padding: '20px', background: 'rgba(0,0,0,0.3)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                <h4 style={{ color: 'white', marginBottom: '8px' }}>1. Sou o Dono da Mesa</h4>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '16px' }}>Crie uma sala e seja a central (Host).</p>
                <button onClick={createRoom} className="btn-primary" style={{ width: '100%', display: 'flex', justifyContent: 'center', gap: '8px' }}>
                  Criar Sala (Host)
                </button>
              </div>

              <div style={{ position: 'relative', textAlign: 'center' }}>
                <hr style={{ borderTop: '1px solid rgba(255,255,255,0.1)' }} />
                <span style={{ position: 'absolute', top: '-10px', left: '50%', transform: 'translateX(-50%)', background: 'var(--bg-main)', padding: '0 12px', color: 'var(--text-muted)', fontSize: '0.8rem' }}>OU</span>
              </div>

              <div style={{ padding: '20px', background: 'rgba(0,0,0,0.3)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                <h4 style={{ color: 'white', marginBottom: '8px' }}>2. Entrar em uma Sala</h4>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '16px' }}>Digite o ID da sala gerado pelo Host ou escaneie o QR Code.</p>
                
                {showScanner ? (
                  <div style={{ marginBottom: '16px' }}>
                    <div id="reader" style={{ width: '100%', borderRadius: '8px', overflow: 'hidden' }}></div>
                    <button onClick={() => setShowScanner(false)} className="btn-secondary" style={{ width: '100%', marginTop: '12px', display: 'flex', justifyContent: 'center', gap: '8px' }}>
                      <X size={16} /> Fechar Câmera
                    </button>
                  </div>
                ) : (
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <input 
                      type="text" 
                      placeholder="ID da Sala..." 
                      value={joinId}
                      onChange={e => setJoinId(e.target.value)}
                      style={{ flex: 1, background: 'rgba(0,0,0,0.5)', color: 'white', border: '1px solid rgba(255,255,255,0.2)', padding: '12px', borderRadius: '8px' }}
                    />
                    <button onClick={() => setShowScanner(true)} className="btn-secondary" style={{ padding: '12px' }} title="Ler QR Code">
                      <Camera size={20} />
                    </button>
                    <button onClick={() => { if(joinId.trim()) joinRoom(joinId.trim()); }} className="btn-primary">Entrar</button>
                  </div>
                )}
              </div>

            </div>
          )}
        </div>
      </Modal>
    </div>
  );
}
