import React, { useState, useEffect } from 'react';
import { Book, Plus, Trash2, CheckCircle2, ChevronRight, X, User, Heart, Shield, Award, Loader2 } from 'lucide-react';
import Modal from '../components/Modal';
import { campaigns } from '../data/campaigns';
import { getCards } from '../services/api';
import { useCloudSync } from '../hooks/useCloudSync';

export default function Campaign() {
  const [saves, setSaves] = useState([]);
  const [activeSaveId, setActiveSaveId] = useState(null);
  
  const [showNewModal, setShowNewModal] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(null); // player index
  


  const [heroes, setHeroes] = useState([]);
  const [loading, setLoading] = useState(true);
  const { syncDataToCloud, getCloudData } = useCloudSync();

  // New Campaign Form State
  const [newCampId, setNewCampId] = useState(campaigns[0].id);
  const [newCampDiff, setNewCampDiff] = useState('Standard');
  const [players, setPlayers] = useState([
    { name: 'Jogador 1', heroCode: '', aspect: 'justice', hp: 10, upgrades: [] }
  ]);

  useEffect(() => {
    const loadSaves = async () => {
      const saved = await getCloudData('mc_campaign_saves');
      if (saved) setSaves(saved);
    };
    loadSaves();

    getCards().then(data => {
      const h = data.filter(c => c.type_code === 'hero');
      // sort heroes alphabetically
      h.sort((a, b) => a.name.localeCompare(b.name));
      setHeroes(h);
      if (h.length > 0) {
        setPlayers([{ name: 'Jogador 1', heroCode: h[0].code, aspect: 'justice', hp: parseInt(h[0].health) || 10, upgrades: [] }]);
      }
      setLoading(false);
    });
  }, [getCloudData]);

  const saveToLocal = (newSaves) => {
    setSaves(newSaves);
    syncDataToCloud('mc_campaign_saves', newSaves);
  };

  const handleAddPlayer = () => {
    if (players.length >= 4) return;
    setPlayers([...players, { name: `Jogador ${players.length + 1}`, heroCode: heroes[0]?.code || '', aspect: 'justice', hp: parseInt(heroes[0]?.health) || 10, upgrades: [] }]);
  };

  const handleRemovePlayer = (idx) => {
    if (players.length <= 1) return;
    const p = [...players];
    p.splice(idx, 1);
    setPlayers(p);
  };

  const handlePlayerChange = (idx, field, value) => {
    const p = [...players];
    if (field === 'heroCode') {
      const hero = heroes.find(h => h.code === value);
      if (hero) {
        p[idx].hp = parseInt(hero.health) || 10;
      }
    }
    p[idx][field] = value;
    setPlayers(p);
  };

  const startNewCampaign = () => {
    const campDef = campaigns.find(c => c.id === newCampId);
    const newSave = {
      id: Date.now().toString(),
      campaignId: newCampId,
      campaignName: campDef.name,
      status: 'in_progress', // or 'completed'
      currentScenarioIndex: 0,
      difficulty: newCampDiff,
      players: players,
      history: []
    };
    saveToLocal([newSave, ...saves]);
    setShowNewModal(false);
    setActiveSaveId(newSave.id);
  };

  const deleteSave = (id) => {
    if (confirm('Tem certeza que deseja apagar esta campanha?')) {
      const newSaves = saves.filter(s => s.id !== id);
      saveToLocal(newSaves);
      if (activeSaveId === id) setActiveSaveId(null);
    }
  };

  const activeSave = saves.find(s => s.id === activeSaveId);
  const activeDef = activeSave ? campaigns.find(c => c.id === activeSave.campaignId) : null;

  const handleUpdatePlayerHP = (playerIdx, delta) => {
    const newSaves = [...saves];
    const saveIdx = newSaves.findIndex(s => s.id === activeSaveId);
    if (saveIdx === -1) return;
    
    let currentHp = newSaves[saveIdx].players[playerIdx].hp;
    let newHp = Math.max(0, currentHp + delta);
    newSaves[saveIdx].players[playerIdx].hp = newHp;
    saveToLocal(newSaves);
  };

  const toggleUpgrade = (playerIdx, upgrade) => {
    const newSaves = [...saves];
    const saveIdx = newSaves.findIndex(s => s.id === activeSaveId);
    if (saveIdx === -1) return;

    const p = newSaves[saveIdx].players[playerIdx];
    if (p.upgrades.includes(upgrade)) {
      p.upgrades = p.upgrades.filter(u => u !== upgrade);
    } else {
      p.upgrades.push(upgrade);
    }
    saveToLocal(newSaves);
  };

  const logResult = (result) => {
    const newSaves = [...saves];
    const saveIdx = newSaves.findIndex(s => s.id === activeSaveId);
    if (saveIdx === -1) return;

    const s = newSaves[saveIdx];
    const scenario = activeDef.scenarios[s.currentScenarioIndex];

    s.history.push({
      scenarioId: scenario.id,
      scenarioName: scenario.name,
      result: result,
      date: new Date().toISOString()
    });

    if (result === 'Victory') {
      if (s.currentScenarioIndex < activeDef.scenarios.length - 1) {
        s.currentScenarioIndex += 1;
      } else {
        s.status = 'completed';
      }
    }
    
    saveToLocal(newSaves);
  };

  if (loading) {
    return <div style={{ display: 'flex', justifyContent: 'center', marginTop: '100px' }}><Loader2 className="text-primary" size={48} style={{ animation: 'spin 1s linear infinite' }} /></div>;
  }

  return (
    <div className="animate-fade-in container">
      <div className="page-header" style={{ marginBottom: '24px' }}>
        <div>
          <h2 className="page-title">Campaign Log</h2>
          <p className="page-subtitle">Acompanhe seu progresso, vida e upgrades nas grandes campanhas.</p>
        </div>
        {!activeSaveId && (
          <button className="btn-primary" onClick={() => setShowNewModal(true)} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Plus size={18} /> Nova Campanha
          </button>
        )}
      </div>

      {!activeSaveId ? (
        /* LISTA DE CAMPANHAS */
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {saves.length === 0 ? (
            <div className="glass-panel" style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>
              <Book size={48} style={{ margin: '0 auto 16px', opacity: 0.5 }} />
              <p>Nenhuma campanha iniciada.</p>
              <button className="btn-primary" onClick={() => setShowNewModal(true)} style={{ marginTop: '16px' }}>Criar Primeira Campanha</button>
            </div>
          ) : (
            saves.map(save => {
              const def = campaigns.find(c => c.id === save.campaignId);
              const isCompleted = save.status === 'completed';
              return (
                <div key={save.id} className="glass-panel" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '24px', borderLeft: isCompleted ? '4px solid var(--aspect-protection)' : '4px solid var(--primary-color)' }}>
                  <div>
                    <h3 style={{ fontSize: '1.2rem', color: 'white', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      {save.campaignName}
                      {isCompleted && <span style={{ fontSize: '0.75rem', background: 'var(--aspect-protection)', padding: '2px 8px', borderRadius: '12px' }}>Concluído</span>}
                    </h3>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '8px' }}>
                      Cenário Atual: {isCompleted ? 'Todos' : def?.scenarios[save.currentScenarioIndex]?.name} | Dificuldade: {save.difficulty}
                    </p>
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                      {save.players.map((p, i) => {
                        const h = heroes.find(hero => hero.code === p.heroCode);
                        return (
                          <span key={i} className={`deck-aspect aspect-${p.aspect}`} style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem', padding: '2px 8px' }}>
                            <User size={12} /> {h?.name || p.heroCode}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                  
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <button onClick={() => setActiveSaveId(save.id)} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      Retomar <ChevronRight size={18} />
                    </button>
                    <button onClick={() => deleteSave(save.id)} className="btn-danger" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '12px', background: 'rgba(239, 68, 68, 0.2)', color: '#fca5a5', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '8px', cursor: 'pointer' }}>
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      ) : (
        /* DETALHE DA CAMPANHA (ACTIVE SAVE) */
        <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          <button onClick={() => setActiveSaveId(null)} style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'none', border: 'none', color: 'var(--primary-color)', cursor: 'pointer', padding: 0, fontWeight: 'bold' }}>
            ← Voltar para Lista
          </button>
          
          <div className="glass-panel" style={{ padding: '24px', borderTop: '4px solid var(--primary-color)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
              <div>
                <h2 style={{ fontSize: '1.8rem', color: 'white', marginBottom: '8px' }}>{activeSave.campaignName}</h2>
                <span style={{ display: 'inline-block', background: 'rgba(255,255,255,0.1)', padding: '4px 12px', borderRadius: '16px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  Dificuldade: {activeSave.difficulty}
                </span>
              </div>
              <div style={{ textAlign: 'right' }}>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '4px' }}>Progresso</p>
                <h3 style={{ color: 'var(--primary-color)', fontSize: '1.5rem' }}>
                  {activeSave.status === 'completed' ? 'Completa' : `${activeSave.currentScenarioIndex + 1} / ${activeDef.scenarios.length}`}
                </h3>
              </div>
            </div>
          </div>

          <div className="generator-layout">
            <div className="generator-results">
              {/* PLAYERS SECTION */}
              <div className="result-section">
                <h3 className="result-header text-primary">Jogadores (HP & Upgrades)</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {activeSave.players.map((p, idx) => {
                    const hero = heroes.find(h => h.code === p.heroCode);
                    return (
                      <div key={idx} className="glass-panel" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <img src={`https://marvelcdb.com/bundles/cards/${p.heroCode}.png`} alt={hero?.name} style={{ width: '48px', height: '48px', objectFit: 'cover', borderRadius: '50%', border: '2px solid rgba(255,255,255,0.1)' }} onError={(e) => e.target.style.display='none'} />
                            <div>
                              <h4 style={{ color: 'white', fontSize: '1.1rem' }}>{p.name}</h4>
                              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{hero?.name} <span className={`deck-aspect aspect-${p.aspect}`} style={{ display: 'inline-block', padding: '2px 6px', borderRadius: '4px', marginLeft: '4px' }}>{p.aspect}</span></p>
                            </div>
                          </div>
                          
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'rgba(0,0,0,0.4)', padding: '8px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)' }}>
                            <button onClick={() => handleUpdatePlayerHP(idx, -1)} style={{ background: 'rgba(239, 68, 68, 0.2)', color: '#fca5a5', border: 'none', borderRadius: '8px', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: '1.2rem' }}>-</button>
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: '40px' }}>
                              <Heart size={16} color="#fca5a5" style={{ marginBottom: '4px' }} />
                              <span style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'white', lineHeight: '1' }}>{p.hp}</span>
                            </div>
                            <button onClick={() => handleUpdatePlayerHP(idx, 1)} style={{ background: 'rgba(67, 160, 71, 0.2)', color: '#86efac', border: 'none', borderRadius: '8px', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: '1.2rem' }}>+</button>
                          </div>
                        </div>

                        <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '12px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 'bold' }}>Upgrades da Campanha</span>
                            <button onClick={() => setShowUpgradeModal(idx)} style={{ background: 'none', border: 'none', color: 'var(--primary-color)', fontSize: '0.85rem', cursor: 'pointer', textDecoration: 'underline' }}>Gerenciar</button>
                          </div>
                          {p.upgrades.length === 0 ? (
                            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Nenhum upgrade selecionado.</p>
                          ) : (
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                              {p.upgrades.map((u, i) => (
                                <span key={i} style={{ background: 'rgba(255,255,255,0.1)', color: 'white', padding: '4px 10px', borderRadius: '12px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                  <Award size={12} color="var(--primary-color)" /> {u}
                               </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* SCENARIO SECTION */}
              <div className="result-section">
                <h3 className="result-header text-secondary">Cenário Atual</h3>
                {activeSave.status === 'completed' ? (
                  <div className="glass-panel" style={{ padding: '40px 24px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', background: 'rgba(67, 160, 71, 0.1)', border: '1px solid rgba(67, 160, 71, 0.3)' }}>
                    <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(67, 160, 71, 0.2)', color: '#86efac', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <CheckCircle2 size={32} />
                    </div>
                    <h3 style={{ color: '#86efac', fontSize: '1.5rem' }}>Campanha Concluída!</h3>
                    <p style={{ color: 'var(--text-secondary)' }}>Vocês salvaram o dia. Verifique o histórico abaixo para os detalhes.</p>
                  </div>
                ) : (
                  <div className="glass-panel" style={{ padding: '24px', borderTop: '4px solid var(--secondary-color)' }}>
                    <h2 style={{ fontSize: '1.5rem', color: 'white', marginBottom: '8px' }}>
                      {activeSave.currentScenarioIndex + 1}. {activeDef.scenarios[activeSave.currentScenarioIndex].name}
                    </h2>
                    
                    <div style={{ background: 'rgba(0,0,0,0.3)', padding: '16px', borderRadius: '8px', marginBottom: '24px', borderLeft: '4px solid var(--text-secondary)' }}>
                      <h4 style={{ color: 'var(--text-secondary)', marginBottom: '8px', fontSize: '0.9rem', textTransform: 'uppercase' }}>Setup Especial</h4>
                      <p style={{ color: 'white', lineHeight: '1.5' }}>
                        {activeDef.scenarios[activeSave.currentScenarioIndex].setup}
                      </p>
                    </div>

                    <div style={{ display: 'flex', gap: '12px' }}>
                      <button onClick={() => logResult('Victory')} className="btn-primary" style={{ flex: 1, background: 'var(--aspect-protection)', padding: '16px', fontSize: '1.1rem', display: 'flex', justifyContent: 'center', gap: '8px' }}>
                        <Shield size={20} /> Registrar Vitória
                      </button>
                      <button onClick={() => logResult('Defeat')} className="btn-secondary" style={{ flex: 1, background: 'rgba(239, 68, 68, 0.1)', color: '#fca5a5', border: '1px solid rgba(239, 68, 68, 0.3)', padding: '16px', fontSize: '1.1rem' }}>
                        Registrar Derrota
                      </button>
                    </div>
                  </div>
                )}

                {/* TIMELINE / HISTORY */}
                <h3 className="result-header text-primary" style={{ marginTop: '32px' }}>Histórico da Campanha</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {activeSave.history.length === 0 ? (
                    <p style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>Nenhuma partida registrada ainda.</p>
                  ) : (
                    activeSave.history.map((log, i) => (
                      <div key={i} style={{ display: 'flex', gap: '16px', background: 'rgba(255,255,255,0.03)', padding: '12px 16px', borderRadius: '8px', borderLeft: log.result === 'Victory' ? '4px solid var(--aspect-protection)' : '4px solid #ef4444' }}>
                        <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', width: '40px' }}>
                          #{i+1}
                        </div>
                        <div style={{ flex: 1 }}>
                          <p style={{ color: 'white', fontWeight: 'bold' }}>{log.scenarioName}</p>
                          <p style={{ color: log.result === 'Victory' ? '#86efac' : '#fca5a5', fontSize: '0.9rem' }}>
                            {log.result === 'Victory' ? 'Vitória' : 'Derrota'}
                          </p>
                        </div>
                        <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                          {new Date(log.date).toLocaleDateString()}
                        </div>
                      </div>
                    ))
                  )}
                </div>

              </div>
            </div>
          </div>
          
        </div>
      )}

      {/* MODAL: NOVA CAMPANHA */}
      <Modal isOpen={showNewModal} onClose={() => setShowNewModal(false)} title="Nova Campanha" maxWidth="500px">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          <div>
            <label style={{ display: 'block', color: 'var(--text-secondary)', marginBottom: '8px', fontSize: '0.9rem' }}>Campanha</label>
            <select value={newCampId} onChange={e => setNewCampId(e.target.value)} style={{ width: '100%', background: 'rgba(0,0,0,0.5)', color: 'white', border: '1px solid rgba(255,255,255,0.2)', padding: '12px', borderRadius: '8px', outline: 'none' }}>
              {campaigns.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>

          <div>
            <label style={{ display: 'block', color: 'var(--text-secondary)', marginBottom: '8px', fontSize: '0.9rem' }}>Dificuldade</label>
            <select value={newCampDiff} onChange={e => setNewCampDiff(e.target.value)} style={{ width: '100%', background: 'rgba(0,0,0,0.5)', color: 'white', border: '1px solid rgba(255,255,255,0.2)', padding: '12px', borderRadius: '8px', outline: 'none' }}>
              <option value="Standard">Standard</option>
              <option value="Expert">Expert</option>
            </select>
          </div>

          <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <label style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Jogadores ({players.length}/4)</label>
              {players.length < 4 && (
                <button onClick={handleAddPlayer} style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white', padding: '6px 12px', borderRadius: '16px', fontSize: '0.85rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Plus size={14} /> Adicionar
                </button>
              )}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {players.map((p, i) => (
                <div key={i} style={{ background: 'rgba(0,0,0,0.3)', padding: '16px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                    <input 
                      type="text" 
                      value={p.name} 
                      onChange={e => handlePlayerChange(i, 'name', e.target.value)}
                      style={{ background: 'transparent', border: 'none', color: 'white', fontSize: '1rem', fontWeight: 'bold', outline: 'none', width: '150px' }}
                    />
                    {players.length > 1 && (
                      <button onClick={() => handleRemovePlayer(i)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}><X size={16} /></button>
                    )}
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <select value={p.heroCode} onChange={e => handlePlayerChange(i, 'heroCode', e.target.value)} style={{ flex: 2, background: 'rgba(255,255,255,0.1)', color: 'white', border: 'none', padding: '8px', borderRadius: '4px', outline: 'none' }}>
                      {heroes.map(h => <option key={h.code} value={h.code}>{h.name}</option>)}
                    </select>
                    <select value={p.aspect} onChange={e => handlePlayerChange(i, 'aspect', e.target.value)} style={{ flex: 1, background: 'rgba(255,255,255,0.1)', color: 'white', border: 'none', padding: '8px', borderRadius: '4px', outline: 'none' }}>
                      <option value="aggression">Agressividade</option>
                      <option value="justice">Justiça</option>
                      <option value="leadership">Liderança</option>
                      <option value="protection">Proteção</option>
                      <option value="pool">Pool</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button onClick={startNewCampaign} className="btn-primary" style={{ padding: '16px', fontSize: '1.1rem', marginTop: '8px' }}>
            Iniciar Campanha
          </button>
        </div>
      </Modal>

      {/* MODAL: UPGRADES */}
      <Modal isOpen={showUpgradeModal !== null} onClose={() => setShowUpgradeModal(null)} title="Upgrades e Obrigações" maxWidth="400px">
        {showUpgradeModal !== null && activeSave && activeDef && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '8px' }}>
              Selecione as melhorias conquistadas por {activeSave.players[showUpgradeModal].name}.
            </p>
            
            {activeDef.upgrades.length > 0 && (
              <div>
                <h4 style={{ color: 'var(--primary-color)', marginBottom: '12px' }}>Upgrades</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {activeDef.upgrades.map(u => {
                    const has = activeSave.players[showUpgradeModal].upgrades.includes(u);
                    return (
                      <label key={u} style={{ display: 'flex', alignItems: 'center', gap: '12px', background: has ? 'rgba(67, 160, 71, 0.1)' : 'rgba(255,255,255,0.05)', padding: '12px', borderRadius: '8px', cursor: 'pointer', border: has ? '1px solid rgba(67, 160, 71, 0.3)' : '1px solid transparent' }}>
                        <input type="checkbox" checked={has} onChange={() => toggleUpgrade(showUpgradeModal, u)} style={{ accentColor: 'var(--aspect-protection)', width: '18px', height: '18px' }} />
                        <span style={{ color: 'white' }}>{u}</span>
                      </label>
                    );
                  })}
                </div>
              </div>
            )}

            {activeDef.obligations && activeDef.obligations.length > 0 && (
              <div style={{ marginTop: '16px' }}>
                <h4 style={{ color: '#fca5a5', marginBottom: '12px' }}>Obrigações / Penalidades</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {activeDef.obligations.map(u => {
                    const has = activeSave.players[showUpgradeModal].upgrades.includes(u);
                    return (
                      <label key={u} style={{ display: 'flex', alignItems: 'center', gap: '12px', background: has ? 'rgba(239, 68, 68, 0.1)' : 'rgba(255,255,255,0.05)', padding: '12px', borderRadius: '8px', cursor: 'pointer', border: has ? '1px solid rgba(239, 68, 68, 0.3)' : '1px solid transparent' }}>
                        <input type="checkbox" checked={has} onChange={() => toggleUpgrade(showUpgradeModal, u)} style={{ accentColor: '#ef4444', width: '18px', height: '18px' }} />
                        <span style={{ color: 'white' }}>{u}</span>
                      </label>
                    );
                  })}
                </div>
              </div>
            )}
            
            <button onClick={() => setShowUpgradeModal(null)} className="btn-primary" style={{ marginTop: '16px', padding: '12px' }}>Concluído</button>
          </div>
        )}
      </Modal>

    </div>
  );
}
