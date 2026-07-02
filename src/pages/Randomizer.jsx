import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { getCards } from '../services/api';
import { Shuffle, Loader2 } from 'lucide-react';
import { villains, modularSets } from '../data/villains';

export default function Randomizer() {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [randomHero, setRandomHero] = useState(null);
  const [randomAspect, setRandomAspect] = useState(null);
  const [generatedDeck, setGeneratedDeck] = useState([]);
  const [previewCard, setPreviewCard] = useState(null);
  
  const [randomVillain, setRandomVillain] = useState(null);
  const [randomModular, setRandomModular] = useState(null);

  const aspects = [
    { code: 'aggression', name: 'Agressividade', color: 'var(--aspect-aggression)' },
    { code: 'justice', name: 'Justiça', color: 'var(--aspect-justice)' },
    { code: 'leadership', name: 'Liderança', color: 'var(--aspect-leadership)' },
    { code: 'protection', name: 'Proteção', color: 'var(--aspect-protection)' },
  ];

  useEffect(() => {
    getCards().then(data => {
      setCards(data);
      setLoading(false);
    }).catch(err => {
      console.error(err);
      setLoading(false);
    });
  }, []);

  const getOwnedPacks = () => {
    const saved = localStorage.getItem('mc_owned_packs');
    return saved ? JSON.parse(saved) : {};
  };

  const generateRandom = () => {
    const ownedPacks = getOwnedPacks();
    const ownedPacksCount = Object.keys(ownedPacks).filter(k => ownedPacks[k]).length;
    
    // Filter cards by owned packs, unless no packs are selected (then use all)
    const availableCards = ownedPacksCount > 0 
      ? cards.filter(c => ownedPacks[c.pack_code] || c.pack_code === 'core') 
      : cards;

    // Pick Hero
    const heroes = availableCards.filter(c => c.type_code === 'hero');
    let hero = null;
    let aspect = null;
    let deck = [];

    if (heroes.length > 0) {
      hero = heroes[Math.floor(Math.random() * heroes.length)];
      aspect = aspects[Math.floor(Math.random() * aspects.length)];
      setRandomHero(hero);
      setRandomAspect(aspect);

      // 1. Get 15 signature cards
      const signatureCards = availableCards.filter(c => 
        c.card_set_code === hero.card_set_code && 
        c.type_code !== 'hero' && 
        c.type_code !== 'alter_ego'
      );

      // 2. Get random aspect/basic cards to fill up to 40
      const validPool = availableCards.filter(c => 
        (c.faction_code === aspect.code || c.faction_code === 'basic') &&
        ['ally', 'event', 'resource', 'support', 'upgrade'].includes(c.type_code)
      );

      // Shuffle pool
      const shuffledPool = validPool.sort(() => 0.5 - Math.random());
      
      const aspectBasicCards = [];
      let count = 0;
      for (const card of shuffledPool) {
        if (count >= 25) break;
        const qty = card.deck_limit || 1; 
        const addQty = Math.min(qty, 25 - count); // add up to deck limit, or max 25
        if (addQty > 0) {
          aspectBasicCards.push({ ...card, quantity: addQty });
          count += addQty;
        }
      }

      deck = [...signatureCards.map(c => ({...c, quantity: c.quantity || 1})), ...aspectBasicCards];
      setGeneratedDeck(deck);
    } else {
      setRandomHero(null);
      setGeneratedDeck([]);
    }

    // Pick Villain & Modular Set
    const availableVillains = ownedPacksCount > 0 
      ? villains.filter(v => ownedPacks[v.pack_code] || v.pack_code === 'core')
      : villains;

    const availableModulars = ownedPacksCount > 0 
      ? modularSets.filter(m => ownedPacks[m.pack_code] || m.pack_code === 'core')
      : modularSets;

    if (availableVillains.length > 0) {
      setRandomVillain(availableVillains[Math.floor(Math.random() * availableVillains.length)]);
    } else {
      setRandomVillain(null);
    }

    if (availableModulars.length > 0) {
      setRandomModular(availableModulars[Math.floor(Math.random() * availableModulars.length)]);
    } else {
      setRandomModular(null);
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '300px' }}>
        <Loader2 className="text-primary" size={48} style={{ animation: 'spin 1s linear infinite' }} />
      </div>
    );
  }

  return (
    <div className="animate-fade-in container">
      <div className="page-header" style={{ alignItems: 'center', textAlign: 'center', display: 'flex', flexDirection: 'column' }}>
        <div>
          <h2 className="page-title">Gerador de Partida</h2>
          <p className="page-subtitle">Gere um encontro e um deck aleatório baseado na sua coleção.</p>
        </div>
        <button onClick={generateRandom} className="btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
          <Shuffle size={20} /> Gerar Partida
        </button>
      </div>

      {(randomHero || randomVillain) && (
        <div className="generator-layout">
          
          <div className="generator-results">
            {/* HERO SECTION */}
            <div className="result-section">
              <h3 className="result-header text-primary">Seu Herói & Deck</h3>
              {randomHero ? (
                <div className="glass-panel result-card">
                  <div className="result-image-wrapper">
                    <img 
                      src={randomHero.imagesrc ? `https://marvelcdb.com${randomHero.imagesrc}` : `https://marvelcdb.com/bundles/cards/${randomHero.code}.png`}
                      alt={randomHero.name}
                      className="result-image"
                      onError={(e) => { e.target.style.display = 'none'; }}
                    />
                  </div>
                  <div className="result-info">
                    <h4 className="result-name">{randomHero.name}</h4>
                    {randomAspect && (
                      <span className={`deck-aspect aspect-${randomAspect.code}`}>
                        {randomAspect.name}
                      </span>
                    )}
                    
                    <div style={{ marginTop: '24px' }}>
                      <p style={{ fontSize: '0.85rem', fontWeight: 'bold', color: 'var(--text-secondary)', marginBottom: '12px', textTransform: 'uppercase' }}>Deck Sugerido (40 Cartas)</p>
                      
                      {/* Visual grid of cards */}
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(90px, 1fr))', gap: '12px', maxHeight: '400px', overflowY: 'auto', padding: '10px 4px' }} className="hide-scrollbar">
                        {generatedDeck.map((card, idx) => (
                          <div 
                            key={card.code + idx} 
                            onClick={() => setPreviewCard(card)}
                            style={{ position: 'relative', cursor: 'pointer', transition: 'transform 0.2s', zIndex: 1 }}
                            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-5px) scale(1.05)'; e.currentTarget.style.zIndex = 10; }}
                            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0) scale(1)'; e.currentTarget.style.zIndex = 1; }}
                          >
                            <img 
                              src={`https://marvelcdb.com/bundles/cards/${card.code}.png`} 
                              alt={card.name} 
                              loading="lazy"
                              decoding="async"
                              style={{ 
                                width: '100%', 
                                aspectRatio: '1 / 1.39',
                                backgroundColor: 'rgba(255,255,255,0.05)',
                                borderRadius: '6px', 
                                boxShadow: '0 4px 8px rgba(0,0,0,0.4)', 
                                border: '1px solid rgba(255,255,255,0.1)',
                                objectFit: 'cover'
                              }} 
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = 'https://marvelcdb.com/bundles/cards/default.png'; 
                              }}
                            />
                            <div style={{ position: 'absolute', top: '-6px', right: '-6px', background: 'var(--primary-color)', color: 'white', fontWeight: 'bold', width: '22px', height: '22px', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '0.75rem', boxShadow: '0 2px 4px rgba(0,0,0,0.5)', border: '2px solid #1a1a1a' }}>
                              {card.quantity}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ) : <p>Nenhum herói encontrado na sua coleção.</p>}
            </div>

            {/* VILLAIN SECTION */}
            <div className="result-section">
              <h3 className="result-header text-secondary">O Vilão</h3>
              {randomVillain ? (
                <div className="glass-panel result-card">
                  <div className="result-image-wrapper">
                    {randomVillain.code ? (
                      <img 
                        src={`https://marvelcdb.com/bundles/cards/${randomVillain.code}.png`} 
                        alt={randomVillain.name}
                        className="result-image"
                        onError={(e) => { 
                          e.target.style.display = 'none'; 
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                    ) : null}
                    <div className="result-image-placeholder" style={{ display: randomVillain.code ? 'none' : 'flex' }}>
                      {randomVillain.name.charAt(0)}
                    </div>
                  </div>
                  <div className="result-info">
                    <h4 className="result-name">{randomVillain.name}</h4>
                    <p className="result-detail" style={{ marginBottom: '16px' }}>{randomVillain.traits}</p>
                    
                    <div>
                      <p style={{ fontSize: '0.85rem', fontWeight: 'bold', color: 'var(--text-secondary)', marginBottom: '8px', textTransform: 'uppercase' }}>Conjunto Modular (Encontros)</p>
                      {randomModular ? (
                        <div className="modular-list">
                          <div className="modular-item">
                            {randomModular.code ? (
                              <img 
                                src={`https://marvelcdb.com/bundles/cards/${randomModular.code}.png`} 
                                alt={randomModular.name}
                                className="modular-img"
                                onError={(e) => { e.target.style.display = 'none'; }}
                              />
                            ) : (
                              <div className="modular-placeholder">?</div>
                            )}
                            <span className="modular-name">{randomModular.name}</span>
                          </div>
                        </div>
                      ) : <p>Nenhum conjunto modular encontrado.</p>}
                    </div>
                  </div>
                </div>
              ) : <p>Nenhum vilão encontrado na sua coleção.</p>}
            </div>

          </div>
        </div>
      )}
      {/* Card Image Preview Modal */}
      {previewCard && createPortal(
        <div 
          className="modal-overlay animate-fade-in" 
          onClick={() => setPreviewCard(null)}
          style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.85)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1100, padding: '20px' }}
        >
          <div 
            onClick={e => e.stopPropagation()} 
            style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
          >
            <button 
              onClick={() => setPreviewCard(null)}
              style={{ position: 'absolute', top: '-40px', right: '-10px', background: 'none', border: 'none', color: 'white', fontSize: '2rem', cursor: 'pointer' }}
            >
              &times;
            </button>
            <img 
              src={`https://marvelcdb.com/bundles/cards/${previewCard.code}.png`} 
              alt={previewCard.name} 
              style={{ maxWidth: '100%', maxHeight: '80vh', objectFit: 'contain', borderRadius: '12px', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }} 
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'https://marvelcdb.com/bundles/cards/default.png'; // Fallback if missing
              }}
            />
            <p style={{ marginTop: '16px', color: 'white', fontSize: '1.2rem', fontWeight: 'bold' }}>{previewCard.name}</p>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
