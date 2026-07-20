import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Trophy, Skull, Play, Loader2, Star, Shield } from 'lucide-react';
import { getActiveChallenge, getChallengeLeaderboard } from '../services/challenges';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { storage } from '../services/storage';
import { getCards } from '../services/api';
import { villains, modularSets } from '../data/villains';

export default function Challenges() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  
  const [challenge, setChallenge] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [missingExpansions, setMissingExpansions] = useState([]);

  useEffect(() => {
    async function load() {
      const active = await getActiveChallenge();
      
      if (active) {
        setChallenge(active);
        
        // Verifica coleção
        try {
          const allCards = await getCards();
          const ownedPacks = storage.get('mc_owned_packs', {});
          const missing = new Set();
          
          const checkPack = (packCode) => {
            if (!packCode || packCode === 'core') return;
            if (!ownedPacks[packCode]) {
               const niceName = packCode.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
               missing.add(niceName);
            }
          };

          const sd = active.seedData;
          const v = villains.find(x => x.name === sd.villain);
          if (v) checkPack(v.pack_code);

          sd.modulars.forEach(modName => {
            const m = modularSets.find(x => x.name === modName);
            if (m) checkPack(m.pack_code);
          });

          if (sd.hero) {
            const h = allCards.find(c => c.name === sd.hero && c.type_code === 'hero');
            if (h) checkPack(h.pack_code);
          }
          
          setMissingExpansions(Array.from(missing));
        } catch (e) { console.error(e) }

        const lb = await getChallengeLeaderboard(active.id);
        setLeaderboard(lb);
      }
      setLoading(false);
    }
    load();
  }, []);

  const handleAcceptChallenge = () => {
    // Redireciona para o randomizer com a seed via state
    if (challenge) {
      navigate('/randomizer', { state: { challengeSeed: challenge } });
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '300px' }}>
        <Loader2 className="text-primary" size={48} style={{ animation: 'spin 1s linear infinite' }} />
      </div>
    );
  }

  if (!challenge) {
    return (
      <div className="container animate-fade-in" style={{ textAlign: 'center', padding: '40px' }}>
        <Trophy size={64} style={{ color: 'var(--text-muted)', margin: '0 auto 16px' }} />
        <h2 className="text-primary">{t('challenges.no_active')}</h2>
        <p style={{ color: 'var(--text-secondary)' }}>{t('challenges.no_active_desc')}</p>
      </div>
    );
  }

  const { seedData } = challenge;

  return (
    <div className="container animate-fade-in">
      <div className="page-header" style={{ marginBottom: '24px', textAlign: 'center' }}>
        <div>
          <h2 className="page-title" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
            <Trophy size={32} color="#fbc02d" /> {t('challenges.title')}
          </h2>
          <p className="page-subtitle" style={{ fontSize: '1.1rem' }}>{t('challenges.subtitle')}</p>
        </div>
      </div>

      <div className="challenges-grid" style={{ display: 'grid', gap: '24px', alignItems: 'start' }}>
        
        {/* Banner do Desafio */}
        <div className="glass-panel" style={{ padding: '0', overflow: 'hidden', position: 'relative' }}>
          <div style={{ padding: '32px', position: 'relative', zIndex: 1, background: 'linear-gradient(135deg, rgba(230,36,41,0.1), rgba(0,0,0,0.8))' }}>
            <h3 style={{ fontSize: '2rem', color: 'white', marginBottom: '8px' }}>{challenge.title}</h3>
            <p style={{ color: '#e0e0e0', fontSize: '1.1rem', marginBottom: '24px', lineHeight: '1.5' }}>{challenge.description}</p>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '16px', marginBottom: '24px' }}>
              <div style={{ background: 'rgba(255,255,255,0.05)', padding: '16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)' }}>
                <strong style={{ display: 'block', color: 'var(--text-secondary)', fontSize: '0.8rem', textTransform: 'uppercase' }}>{t('challenges.req_hero')}</strong>
                <span style={{ fontSize: '1.1rem', color: 'white', display: 'flex', alignItems: 'center', gap: '8px' }}><Shield size={16} /> {seedData.hero || t('challenges.free')} ({seedData.aspect || t('challenges.any_aspect')})</span>
              </div>
              <div style={{ background: 'rgba(230,36,41,0.1)', padding: '16px', borderRadius: '12px', border: '1px solid rgba(230,36,41,0.3)' }}>
                <strong style={{ display: 'block', color: '#ff8a8a', fontSize: '0.8rem', textTransform: 'uppercase' }}>{t('challenges.villain')}</strong>
                <span style={{ fontSize: '1.1rem', color: 'white', display: 'flex', alignItems: 'center', gap: '8px' }}><Skull size={16} /> {seedData.villain} ({seedData.difficulty})</span>
              </div>
            </div>

            <button 
              onClick={() => missingExpansions.length === 0 && handleAcceptChallenge()}
              className={missingExpansions.length === 0 ? "btn-primary" : "btn-secondary"} 
              disabled={missingExpansions.length > 0}
              style={{ width: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: '8px', padding: '16px', fontSize: '1.2rem', boxShadow: missingExpansions.length === 0 ? '0 8px 25px rgba(230,36,41,0.5)' : 'none', opacity: missingExpansions.length === 0 ? 1 : 0.6 }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Play size={24} /> {missingExpansions.length === 0 ? t('challenges.accept') : t('challenges.incomplete_col')}
              </div>
              {missingExpansions.length > 0 && (
                <span style={{ fontSize: '0.85rem', color: '#ff8a8a', fontWeight: 'normal' }}>
                  {t('challenges.missing', { packs: missingExpansions.join(', ') })}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Leaderboard */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <h3 style={{ color: 'white', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Star size={20} color="#fbc02d" /> {t('challenges.leaderboard')}
          </h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {leaderboard.length === 0 ? (
              <p style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '24px 0' }}>{t('challenges.no_entries')}</p>
            ) : (
              leaderboard.map((entry, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'rgba(255,255,255,0.05)', padding: '12px', borderRadius: '12px' }}>
                  <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: idx === 0 ? '#fbc02d' : idx === 1 ? '#e0e0e0' : idx === 2 ? '#cd7f32' : 'rgba(255,255,255,0.1)', color: idx < 3 ? 'black' : 'white', display: 'flex', justifyContent: 'center', alignItems: 'center', fontWeight: 'bold', fontSize: '0.9rem' }}>
                    {idx + 1}
                  </div>
                  {entry.photoURL ? (
                    <img src={entry.photoURL} alt="avatar" style={{ width: '32px', height: '32px', borderRadius: '50%' }} />
                  ) : (
                    <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--primary-color)', color: 'white', display: 'flex', justifyContent: 'center', alignItems: 'center', fontWeight: 'bold' }}>
                      {entry.userName.charAt(0)}
                    </div>
                  )}
                  <div style={{ flex: 1 }}>
                    <strong style={{ display: 'block', color: 'white', fontSize: '0.95rem' }}>{entry.userName}</strong>
                    <span style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>{entry.result}</span>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <strong style={{ display: 'block', color: '#4ade80', fontSize: '1.1rem' }}>{entry.xpGained} XP</strong>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
