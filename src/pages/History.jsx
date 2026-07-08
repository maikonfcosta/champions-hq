import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Trash2, Plus, Clock, RotateCcw, Zap } from 'lucide-react';
import { getCards } from '../services/api';
import { villains, modularSets } from '../data/villains';
import Modal from '../components/Modal';
import { calculateMatchXP } from '../utils/ranking';

export default function History() {
  const [history, setHistory] = useState([]);
  const [heroes, setHeroes] = useState([]);
  const [ownedVillains, setOwnedVillains] = useState([]);
  const [ownedModulars, setOwnedModulars] = useState([]);

  useEffect(() => {
    // 1. Load History
    const saved = localStorage.getItem('mc_match_history');
    if (saved) {
      try {
        setHistory(JSON.parse(saved).reverse());
      } catch {}
    }

    // 2. Load Collection context
    const savedPacks = localStorage.getItem('mc_owned_packs');
    const owned = savedPacks ? JSON.parse(savedPacks) : {};

    // 3. Load Heroes
    getCards().then(cards => {
      const availableHeroes = cards
        .filter(c => c.type_code === 'hero' && (c.pack_code === 'core' || owned[c.pack_code]))
        .sort((a, b) => a.name.localeCompare(b.name));
      setHeroes(availableHeroes);
    });

    // 4. Load Villains & Modulars
    const availableVillains = villains
      .filter(v => v.pack_code === 'core' || owned[v.pack_code])
      .sort((a, b) => a.name.localeCompare(b.name));
    setOwnedVillains(availableVillains);

    const availableMods = modularSets
      .filter(m => m.pack_code === 'core' || owned[m.pack_code])
      .sort((a, b) => a.name.localeCompare(b.name));
    setOwnedModulars(availableMods);

  }, []);

  const [showModal, setShowModal] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState(null);
  const [form, setForm] = useState({
    hero: '',
    aspect: 'Agressividade',
    villain: '',
    modular: '',
    difficulty: 'Standard',
    result: 'Vitória',
    duration: '',
    rounds: '',
    totalDamage: ''
  });

  const handleAddManual = (e) => {
    e.preventDefault();
    const newMatch = {
      ...form,
      date: new Date().toISOString()
    };
    const newHistory = [newMatch, ...history];
    saveHistory(newHistory);
    setShowModal(false);
    setForm({
      hero: '',
      aspect: 'Agressividade',
      villain: '',
      modular: '',
      difficulty: 'Standard',
      result: 'Vitória',
      duration: '',
      rounds: '',
      totalDamage: ''
    });
  };

  const saveHistory = (newHistory) => {
    // Save in original chronological order (reverse the reversed array)
    const toSave = [...newHistory].reverse();
    setHistory(newHistory);
    localStorage.setItem('mc_match_history', JSON.stringify(toSave));
  };

  const deleteEntry = (index) => {
    setDeleteIndex(index);
  };

  const confirmDelete = () => {
    if (deleteIndex !== null) {
      const newHistory = [...history];
      newHistory.splice(deleteIndex, 1);
      saveHistory(newHistory);
      setDeleteIndex(null);
    }
  };

  // Simple stats
  const totalMatches = history.length;
  const wins = history.filter(m => m.result === 'Vitória').length;
  const winRate = totalMatches > 0 ? Math.round((wins / totalMatches) * 100) : 0;

  return (
    <div className="animate-fade-in container">
      <div className="page-header" style={{ marginBottom: '24px' }}>
        <div>
          <h2 className="page-title">Histórico de Partidas</h2>
          <p className="page-subtitle">Registro de combates e estatísticas.</p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Plus size={18} /> Adicionar Partida
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '32px' }}>
        <div className="glass-panel" style={{ padding: '24px', textAlign: 'center' }}>
          <h4 style={{ color: 'var(--text-secondary)', marginBottom: '8px' }}>Total de Partidas</h4>
          <span style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>{totalMatches}</span>
        </div>
        <div className="glass-panel" style={{ padding: '24px', textAlign: 'center' }}>
          <h4 style={{ color: 'var(--text-secondary)', marginBottom: '8px' }}>Vitórias</h4>
          <span style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--aspect-protection)' }}>{wins}</span>
        </div>
        <div className="glass-panel" style={{ padding: '24px', textAlign: 'center' }}>
          <h4 style={{ color: 'var(--text-secondary)', marginBottom: '8px' }}>Taxa de Vitória</h4>
          <span style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#60a5fa' }}>{winRate}%</span>
        </div>
      </div>

      <h3 style={{ marginBottom: '16px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '8px' }}>Diário de Batalha</h3>
      <div className="history-list" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {history.length === 0 ? (
          <p style={{ color: 'var(--text-secondary)' }}>Nenhuma partida registrada ainda. Vá ao Gerador para registrar!</p>
        ) : (
          history.map((match, idx) => {
            const xp = calculateMatchXP(match.result, match.difficulty || 'Standard');
            return (
            <div key={idx} className="glass-panel" style={{ padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderLeft: `4px solid ${match.result === 'Vitória' ? 'var(--aspect-protection)' : 'var(--primary-color)'}` }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '4px' }}>
                  <h4 style={{ color: match.result === 'Vitória' ? 'var(--aspect-protection)' : 'var(--primary-color)', margin: 0 }}>{match.result}</h4>
                  <span style={{ fontSize: '0.85rem', fontWeight: 'bold', padding: '2px 8px', borderRadius: '12px', background: xp > 0 ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)', color: xp > 0 ? '#4ade80' : '#f87171' }}>
                    {xp > 0 ? '+' : ''}{xp} XP
                  </span>
                </div>
                <p style={{ fontSize: '1.1rem' }}><strong>{match.hero}</strong> <span style={{ color: 'var(--text-secondary)' }}>({match.aspect})</span> vs <strong>{match.villain}</strong></p>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Módulo: {match.modular || 'Nenhum'} | Diff: {match.difficulty || 'Normal'} | {new Date(match.date).toLocaleDateString()}</p>
                {(match.duration || match.rounds || match.totalDamage) && (
                  <div style={{ display: 'flex', gap: '12px', marginTop: '6px', fontSize: '0.85rem', color: '#a8a8a8' }}>
                    {match.duration && <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Clock size={14} /> {match.duration} min</span>}
                    {match.rounds && <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><RotateCcw size={14} /> {match.rounds} rodadas</span>}
                    {match.totalDamage && <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Zap size={14} /> {match.totalDamage} dano</span>}
                  </div>
                )}
              </div>
              <button onClick={() => deleteEntry(idx)} className="btn-secondary" style={{ padding: '8px', color: '#ef4444', borderColor: 'transparent' }}>
                <Trash2 size={20} />
              </button>
            </div>
            );
          })
        )}
      </div>

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Registrar Manualmente"
        maxWidth="500px"
      >
        <form onSubmit={handleAddManual} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label className="premium-label">Herói</label>
            <select required value={form.hero} onChange={e => setForm({...form, hero: e.target.value})} className="premium-select">
              <option value="" disabled>Selecione um Herói...</option>
              {heroes.map(h => (
                <option key={h.code} value={h.name}>{h.name}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="premium-label">Aspecto</label>
            <select value={form.aspect} onChange={e => setForm({...form, aspect: e.target.value})} className="premium-select">
              <option value="Agressividade">Agressividade</option>
              <option value="Justiça">Justiça</option>
              <option value="Liderança">Liderança</option>
              <option value="Proteção">Proteção</option>
              <option value="Pool">Pool</option>
              <option value="Básico">Básico</option>
            </select>
          </div>

          <div>
            <label className="premium-label">Vilão</label>
            <select required value={form.villain} onChange={e => setForm({...form, villain: e.target.value})} className="premium-select">
              <option value="" disabled>Selecione um Vilão...</option>
              {ownedVillains.map(v => (
                <option key={v.code} value={v.name}>{v.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="premium-label">Módulos (opcional)</label>
            <select value={form.modular} onChange={e => setForm({...form, modular: e.target.value})} className="premium-select">
              <option value="">Nenhum / Selecione...</option>
              {ownedModulars.map(m => (
                <option key={m.code} value={m.name}>{m.name}</option>
              ))}
            </select>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label className="premium-label">Dificuldade</label>
              <select value={form.difficulty} onChange={e => setForm({...form, difficulty: e.target.value})} className="premium-select">
                <option value="Standard">Standard</option>
                <option value="Expert">Expert</option>
                <option value="Heroic">Heroic</option>
              </select>
            </div>
            <div>
              <label className="premium-label">Resultado</label>
              <select value={form.result} onChange={e => setForm({...form, result: e.target.value})} className="premium-select">
                <option value="Vitória">Vitória</option>
                <option value="Derrota">Derrota</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
            <div>
              <label className="premium-label">Duração (min)</label>
              <input type="number" min="1" value={form.duration} onChange={e => setForm({...form, duration: e.target.value})} className="premium-input" placeholder="Ex: 45" />
            </div>
            <div>
              <label className="premium-label">Rodadas</label>
              <input type="number" min="1" value={form.rounds} onChange={e => setForm({...form, rounds: e.target.value})} className="premium-input" placeholder="Ex: 8" />
            </div>
            <div>
              <label className="premium-label">Dano Causado</label>
              <input type="number" min="1" value={form.totalDamage} onChange={e => setForm({...form, totalDamage: e.target.value})} className="premium-input" placeholder="Ex: 25" />
            </div>
          </div>

          <div style={{ display: 'flex', gap: '16px', marginTop: '16px' }}>
            <button type="button" onClick={() => setShowModal(false)} className="btn-secondary" style={{ flex: 1 }}>Cancelar</button>
            <button type="submit" className="btn-primary" style={{ flex: 1 }}>Salvar Partida</button>
          </div>
        </form>
      </Modal>

      <Modal
        isOpen={deleteIndex !== null}
        onClose={() => setDeleteIndex(null)}
        title="Apagar Registro"
        maxWidth="400px"
      >
        <div style={{ textAlign: 'center' }}>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>Tem certeza que deseja apagar o registro desta partida?</p>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
            <button onClick={() => setDeleteIndex(null)} className="btn-secondary" style={{ flex: 1 }}>Cancelar</button>
            <button onClick={confirmDelete} className="btn-primary" style={{ flex: 1, background: 'var(--primary-color)' }}>Apagar</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
