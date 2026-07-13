import React, { useEffect, useState } from 'react';
import { getCards } from '../services/api';
import { Shuffle, Loader2, Save, Copy, QrCode, Check } from 'lucide-react';
import { villains, modularSets } from '../data/villains';
import Modal from '../components/Modal';
import { QRCodeSVG } from 'qrcode.react';

export default function Randomizer() {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [randomHero, setRandomHero] = useState(null);
  const [randomAspect, setRandomAspect] = useState(null);
  const [generatedDeck, setGeneratedDeck] = useState([]);
  const [previewCard, setPreviewCard] = useState(null);
  
  const [randomVillain, setRandomVillain] = useState(null);
  const [randomModulars, setRandomModulars] = useState([]);
  const [difficulty, setDifficulty] = useState('Standard');
  const [showLogModal, setShowLogModal] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  
  const [showCopyAlert, setShowCopyAlert] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [shareUrl, setShareUrl] = useState('');

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
      // Pick 2 modulars to be safe for advanced villains, or just 1
      const shuffledMods = availableModulars.sort(() => 0.5 - Math.random());
      setRandomModulars(shuffledMods.slice(0, 2));
    } else {
      setRandomModulars([]);
    }
  };

  const handleSaveLog = (result) => {
    const saved = localStorage.getItem('mc_match_history');
    const history = saved ? JSON.parse(saved) : [];
    history.push({
      hero: randomHero.name,
      aspect: randomAspect.name,
      villain: randomVillain.name,
      modular: randomModulars.map(m => m.name).join(' & '),
      difficulty: difficulty,
      result: result,
      date: new Date().toISOString()
    });
    localStorage.setItem('mc_match_history', JSON.stringify(history));
    setShowLogModal(false);
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 2000);
  };

  const exportDeckText = () => {
    if (!randomHero || generatedDeck.length === 0) return;
    let text = `Herói: ${randomHero.name}\nAspecto: ${randomAspect?.name || 'Básico'}\n\n`;
    generatedDeck.forEach(c => {
      text += `${c.quantity}x ${c.name}\n`;
    });
    navigator.clipboard.writeText(text);
    setShowCopyAlert(true);
    setTimeout(() => setShowCopyAlert(false), 2000);
  };

  const generateShareLink = () => {
    if (!randomHero || generatedDeck.length === 0) return;
    const cardsString = generatedDeck.map(c => `${c.code}:${c.quantity}`).join(',');
    const payload = `${randomHero.code}|${randomAspect?.code || 'basic'}|${cardsString}`;
    const url = `${window.location.origin}/builder?deck=${payload}`;
    setShareUrl(url);
    setShowShareModal(true);
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
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <select 
            value={difficulty} 
            onChange={(e) => setDifficulty(e.target.value)}
            style={{ background: 'rgba(0,0,0,0.5)', color: 'white', border: '1px solid rgba(255,255,255,0.2)', padding: '10px 16px', borderRadius: '8px', outline: 'none' }}
          >
            <option value="Standard">Standard</option>
            <option value="Expert">Expert</option>
            <option value="Heroic">Heroic</option>
          </select>
          <button onClick={generateRandom} className="btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
            <Shuffle size={20} /> Gerar Partida
          </button>
        </div>
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
                      
                      <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginTop: '16px' }}>
                        <button onClick={exportDeckText} className="btn-secondary" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '12px', fontSize: '0.9rem' }}>
                          <Copy size={16} /> Copiar
                        </button>
                        <button onClick={generateShareLink} className="btn-primary" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '12px', fontSize: '0.9rem' }}>
                          <QrCode size={16} /> Compartilhar
                        </button>
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
                      <p style={{ fontSize: '0.85rem', fontWeight: 'bold', color: 'var(--text-secondary)', marginBottom: '8px', textTransform: 'uppercase' }}>Conjuntos Modulares</p>
                      {randomModulars.length > 0 ? (
                        <div className="modular-list" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                          {randomModulars.map((mod, i) => (
                            <div key={i} className="modular-item">
                              {mod.code ? (
                                <img 
                                  src={`https://marvelcdb.com/bundles/cards/${mod.code}.png`} 
                                  alt={mod.name}
                                  className="modular-img"
                                  onError={(e) => { e.target.style.display = 'none'; }}
                                />
                              ) : (
                                <div className="modular-placeholder">?</div>
                              )}
                              <span className="modular-name">{mod.name}</span>
                            </div>
                          ))}
                        </div>
                      ) : <p>Nenhum conjunto modular encontrado.</p>}
                    </div>
                    
                    <button 
                      onClick={() => setShowLogModal(true)} 
                      className="btn-primary" 
                      style={{ marginTop: '24px', display: 'flex', alignItems: 'center', gap: '8px', width: '100%', justifyContent: 'center' }}
                    >
                      <Save size={18} /> Registrar no Histórico
                    </button>
                  </div>
                </div>
              ) : <p>Nenhum vilão encontrado na sua coleção.</p>}
            </div>

          </div>
        </div>
      )}
      {/* Card Image Preview Modal */}
      <Modal
        isOpen={!!previewCard}
        onClose={() => setPreviewCard(null)}
        maxWidth="400px"
        noPadding={true}
      >
        {previewCard && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '16px' }}>
            <img 
              src={`https://marvelcdb.com/bundles/cards/${previewCard.code}.png`} 
              alt={previewCard.name} 
              style={{ maxWidth: '100%', maxHeight: '80vh', objectFit: 'contain', borderRadius: '12px', boxShadow: '0 10px 40px rgba(0,0,0,0.6)' }} 
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'https://marvelcdb.com/bundles/cards/default.png'; // Fallback if missing
              }}
            />
            <p style={{ marginTop: '16px', color: 'white', fontSize: '1.2rem', fontWeight: 'bold', textAlign: 'center' }}>{previewCard.name}</p>
          </div>
        )}
      </Modal>

      <Modal
        isOpen={showLogModal}
        onClose={() => setShowLogModal(false)}
        title="Resultado da Partida"
        maxWidth="400px"
      >
        <div style={{ textAlign: 'center' }}>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>Como foi o confronto contra <strong style={{ color: 'white' }}>{randomVillain?.name}</strong>?</p>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
            <button onClick={() => handleSaveLog('Vitória')} className="btn-primary" style={{ background: 'var(--aspect-protection)', padding: '12px 24px', flex: 1 }}>Vitória</button>
            <button onClick={() => handleSaveLog('Derrota')} className="btn-primary" style={{ padding: '12px 24px', flex: 1 }}>Derrota</button>
          </div>
          <button onClick={() => setShowLogModal(false)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', marginTop: '24px', textDecoration: 'underline' }}>Cancelar</button>
        </div>
      </Modal>

      <Modal isOpen={showAlert} onClose={() => setShowAlert(false)} maxWidth="300px" noPadding={true}>
        <div style={{ padding: '24px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'rgba(67, 160, 71, 0.2)', color: 'var(--aspect-protection)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid var(--aspect-protection)', boxShadow: '0 0 15px rgba(67, 160, 71, 0.4)' }}>
            <Save size={28} />
          </div>
          <h4 style={{ margin: 0, fontSize: '1.2rem', color: 'white' }}>Salvo no Histórico!</h4>
        </div>
      </Modal>

      <Modal isOpen={showCopyAlert} onClose={() => setShowCopyAlert(false)} maxWidth="300px" noPadding={true}>
        <div style={{ padding: '24px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'rgba(67, 160, 71, 0.2)', color: 'var(--aspect-protection)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid var(--aspect-protection)', boxShadow: '0 0 15px rgba(67, 160, 71, 0.4)' }}>
            <Check size={28} />
          </div>
          <h4 style={{ margin: 0, fontSize: '1.2rem', color: 'white' }}>Copiado!</h4>
        </div>
      </Modal>

      {/* Share Modal */}
      <Modal isOpen={showShareModal} onClose={() => setShowShareModal(false)} title="Compartilhar Deck Gerado" maxWidth="400px">
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '24px' }}>
          <p style={{ color: 'var(--text-secondary)', textAlign: 'center', fontSize: '0.9rem' }}>
            Escaneie este QR Code ou copie o link direto para carregar esse deck aleatório no Deck Builder e editá-lo!
          </p>
          
          <div style={{ background: 'white', padding: '16px', borderRadius: '16px' }}>
            <QRCodeSVG value={shareUrl} size={200} level="M" includeMargin={false} />
          </div>
          
          <button 
            onClick={() => {
              navigator.clipboard.writeText(shareUrl);
              setShowCopyAlert(true);
              setTimeout(() => setShowCopyAlert(false), 2000);
            }} 
            className="btn-secondary" 
            style={{ width: '100%', display: 'flex', justifyContent: 'center', gap: '8px' }}
          >
            <Copy size={18} /> Copiar Link Direto
          </button>
        </div>
      </Modal>
    </div>
  );
}
