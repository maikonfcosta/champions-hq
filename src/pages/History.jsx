import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Trash2, Plus, Clock, RotateCcw, Zap } from 'lucide-react';
import { getCards } from '../services/api';
import { villains, modularSets } from '../data/villains';
import Modal from '../components/Modal';
import { calculateMatchXP } from '../utils/ranking';
import { useCloudSync } from '../hooks/useCloudSync';

export default function History() {
  const { t } = useTranslation();
  const [history, setHistory] = useState([]);
  const [heroes, setHeroes] = useState([]);
  const [ownedVillains, setOwnedVillains] = useState([]);
  const [ownedModulars, setOwnedModulars] = useState([]);

  const { syncDataToCloud, getCloudData } = useCloudSync();

  useEffect(() => {
    const loadData = async () => {
      // 1. Load History
      const saved = await getCloudData('mc_match_history');
      if (saved) {
        setHistory([...saved].reverse());
      }

      // 2. Load Collection context
      const owned = await getCloudData('mc_owned_packs') || {};

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
    };
    loadData();
  }, [getCloudData]);

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
    syncDataToCloud('mc_match_history', toSave);
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
          <h2 className="page-title">{t("history.title")}</h2>
          <p className="page-subtitle">{t("history.subtitle")}</p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Plus size={18} /> Adicionar Partida
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '32px' }}>
        <div className="glass-panel" style={{ padding: '24px', textAlign: 'center' }}>
          <h4 style={{ color: 'var(--text-secondary)', marginBottom: '8px' }}>{t("history.total_matches")}</h4>
          <span style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>{totalMatches}</span>
        </div>
        <div className="glass-panel" style={{ padding: '24px', textAlign: 'center' }}>
          <h4 style={{ color: 'var(--text-secondary)', marginBottom: '8px' }}>{t("history.wins")}</h4>
          <span style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--aspect-protection)' }}>{wins}</span>
        </div>
        <div className="glass-panel" style={{ padding: '24px', textAlign: 'center' }}>
          <h4 style={{ color: 'var(--text-secondary)', marginBottom: '8px' }}>{t("history.win_rate")}</h4>
          <span style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#60a5fa' }}>{winRate}%</span>
        </div>
      </div>

      <h3 style={{ marginBottom: '16px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '8px' }}>{t("history.battle_log")}</h3>
      <div className="history-list" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {history.length === 0 ? (
          <p style={{ color: 'var(--text-secondary)' }}>{t("history.empty_log")}</p>
        ) : (
          history.map((match, idx) => {
            const xp = calculateMatchXP(match.result, match.difficulty || 'Standard');
            return (
            <div key={idx} className="glass-panel" style={{ padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderLeft: `4px solid ${match.result === 'Vitória' ? 'var(--aspect-protection)' : 'var(--primary-color)'}` }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '4px' }}>
                  <h4 style={{ color: match.result === 'Vitória' ? 'var(--aspect-protection)' : 'var(--primary-color)', margin: 0 }}>{match.result === 'Vitória' ? t('history.victory') : match.result === 'Derrota' ? t('history.defeat') : match.result}</h4>
                  <span style={{ fontSize: '0.85rem', fontWeight: 'bold', padding: '2px 8px', borderRadius: '12px', background: xp > 0 ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)', color: xp > 0 ? '#4ade80' : '#f87171' }}>
                    {xp > 0 ? '+' : ''}{xp} XP
                  </span>
                </div>
                <p style={{ fontSize: '1.1rem' }}><strong>{match.hero}</strong> <span style={{ color: 'var(--text-secondary)' }}>({match.aspect})</span> vs <strong>{match.villain}</strong></p>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{t("history.module")} {match.modular || 'Nenhum'} | {t("history.diff")} {match.difficulty || 'Normal'} | {new Date(match.date).toLocaleDateString()}</p>
                {(match.duration || match.rounds || match.totalDamage) && (
                  <div style={{ display: 'flex', gap: '12px', marginTop: '6px', fontSize: '0.85rem', color: '#a8a8a8' }}>
                    {match.duration && <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Clock size={14} /> {match.duration} {t("history.min")}</span>}
                    {match.rounds && <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><RotateCcw size={14} /> {match.rounds} {t("history.rounds")}</span>}
                    {match.totalDamage && <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Zap size={14} /> {match.totalDamage} {t("history.damage")}</span>}
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
        title={t("history.manual_add")}
        maxWidth="500px"
      >
        <form onSubmit={handleAddManual} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label className="premium-label">{t("history.hero")}</label>
            <select required value={form.hero} onChange={e => setForm({...form, hero: e.target.value})} className="premium-select">
              <option value="" disabled>{t("history.select_hero")}</option>
              {heroes.map(h => (
                <option key={h.code} value={h.name}>{h.name}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="premium-label">{t("history.aspect")}</label>
            <select value={form.aspect} onChange={e => setForm({...form, aspect: e.target.value})} className="premium-select">
              <option value="Agressividade">{t("history.aspect_aggression")}</option>
              <option value="Justiça">{t("history.aspect_justice")}</option>
              <option value="Liderança">{t("history.aspect_leadership")}</option>
              <option value="Proteção">{t("history.aspect_protection")}</option>
              <option value="Pool">{t("history.aspect_pool")}</option>
              <option value="Básico">{t("history.aspect_basic")}</option>
            </select>
          </div>

          <div>
            <label className="premium-label">{t("history.villain")}</label>
            <select required value={form.villain} onChange={e => setForm({...form, villain: e.target.value})} className="premium-select">
              <option value="" disabled>{t("history.select_villain")}</option>
              {ownedVillains.map(v => (
                <option key={v.code} value={v.name}>{v.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="premium-label">{t("history.modular")}</label>
            <select value={form.modular} onChange={e => setForm({...form, modular: e.target.value})} className="premium-select">
              <option value="">{t("history.none")}</option>
              {ownedModulars.map(m => (
                <option key={m.code} value={m.name}>{m.name}</option>
              ))}
            </select>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label className="premium-label">{t("history.difficulty")}</label>
              <select value={form.difficulty} onChange={e => setForm({...form, difficulty: e.target.value})} className="premium-select">
                <option value="Standard">Standard</option>
                <option value="Expert">Expert</option>
                <option value="Heroic">Heroic</option>
              </select>
            </div>
            <div>
              <label className="premium-label">{t("history.result")}</label>
              <select value={form.result} onChange={e => setForm({...form, result: e.target.value})} className="premium-select">
                <option value="Vitória">{t("history.victory")}</option>
                <option value="Derrota">{t("history.defeat")}</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
            <div>
              <label className="premium-label">{t("history.duration")}</label>
              <input type="number" min="1" value={form.duration} onChange={e => setForm({...form, duration: e.target.value})} className="premium-input" placeholder="Ex: 45" />
            </div>
            <div>
              <label className="premium-label">{t("history.rounds_input")}</label>
              <input type="number" min="1" value={form.rounds} onChange={e => setForm({...form, rounds: e.target.value})} className="premium-input" placeholder="Ex: 8" />
            </div>
            <div>
              <label className="premium-label">{t("history.damage_caused")}</label>
              <input type="number" min="1" value={form.totalDamage} onChange={e => setForm({...form, totalDamage: e.target.value})} className="premium-input" placeholder="Ex: 25" />
            </div>
          </div>

          <div style={{ display: 'flex', gap: '16px', marginTop: '16px' }}>
            <button type="button" onClick={() => setShowModal(false)} className="btn-secondary" style={{ flex: 1 }}>{t("history.cancel")}</button>
            <button type="submit" className="btn-primary" style={{ flex: 1 }}>{t("history.save")}</button>
          </div>
        </form>
      </Modal>

      <Modal
        isOpen={deleteIndex !== null}
        onClose={() => setDeleteIndex(null)}
        title={t("history.delete_title")}
        maxWidth="400px"
      >
        <div style={{ textAlign: 'center' }}>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>{t("history.delete_desc")}</p>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
            <button onClick={() => setDeleteIndex(null)} className="btn-secondary" style={{ flex: 1 }}>{t("history.cancel")}</button>
            <button onClick={confirmDelete} className="btn-primary" style={{ flex: 1, background: 'var(--primary-color)' }}>{t("history.delete")}</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
