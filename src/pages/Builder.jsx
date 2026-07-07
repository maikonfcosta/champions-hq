import React, { useState, useEffect } from 'react';
import { getCards } from '../services/api';
import { Loader2, Plus, Minus, Copy, Check } from 'lucide-react';
import Modal from '../components/Modal';

export default function Builder() {
  const [showCopyAlert, setShowCopyAlert] = useState(false);
  const [cards, setCards] = useState([]);
  const [ownedPacks, setOwnedPacks] = useState({});
  const [loading, setLoading] = useState(true);

  const [selectedHero, setSelectedHero] = useState(null);
  const [selectedAspect, setSelectedAspect] = useState('justice');
  const [deck, setDeck] = useState({});

  useEffect(() => {
    const saved = localStorage.getItem('mc_owned_packs');
    setOwnedPacks(saved ? JSON.parse(saved) : {});

    getCards().then(data => {
      setCards(data);
      setLoading(false);
    });
  }, []);

  const heroes = cards.filter(c => c.type_code === 'hero' && (ownedPacks[c.pack_code] || c.pack_code === 'core'));
  const aspectCards = cards.filter(c => 
    (c.faction_code === selectedAspect || c.faction_code === 'basic') &&
    ['ally', 'event', 'resource', 'support', 'upgrade'].includes(c.type_code) &&
    (ownedPacks[c.pack_code] || c.pack_code === 'core')
  );

  const handleHeroChange = (e) => {
    const heroCode = e.target.value;
    const hero = heroes.find(h => h.code === heroCode);
    setSelectedHero(hero);
    if (hero) {
      const signatures = cards.filter(c => c.card_set_code === hero.card_set_code && c.type_code !== 'hero' && c.type_code !== 'alter_ego');
      const newDeck = {};
      signatures.forEach(s => {
        newDeck[s.code] = s.quantity || 1;
      });
      setDeck(newDeck);
    } else {
      setDeck({});
    }
  };

  const addCard = (card) => {
    const current = deck[card.code] || 0;
    const limit = card.deck_limit || 3;
    if (current < limit) {
      setDeck({ ...deck, [card.code]: current + 1 });
    }
  };

  const removeCard = (cardCode) => {
    const current = deck[cardCode] || 0;
    if (current > 0) {
      const newDeck = { ...deck };
      newDeck[cardCode] -= 1;
      if (newDeck[cardCode] === 0) delete newDeck[cardCode];
      setDeck(newDeck);
    }
  };

  const deckSize = Object.values(deck).reduce((a, b) => a + b, 0);

  const exportDeck = () => {
    let text = `Herói: ${selectedHero?.name}\nAspecto: ${selectedAspect.toUpperCase()}\nCartas: ${deckSize}\n\n`;
    Object.entries(deck).forEach(([code, qty]) => {
      const c = cards.find(x => x.code === code);
      if (c) text += `${qty}x ${c.name}\n`;
    });
    navigator.clipboard.writeText(text);
    setShowCopyAlert(true);
    setTimeout(() => setShowCopyAlert(false), 2000);
  };

  if (loading) {
    return <div style={{ display: 'flex', justifyContent: 'center', marginTop: '100px' }}><Loader2 className="text-primary" size={48} style={{ animation: 'spin 1s linear infinite' }} /></div>;
  }

  return (
    <div className="animate-fade-in container">
      <div className="page-header" style={{ marginBottom: '24px' }}>
        <div>
          <h2 className="page-title">Rascunho de Deck</h2>
          <p className="page-subtitle">Monte seu deck usando as cartas da sua coleção física.</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '24px' }}>
        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: '200px' }}>
              <label style={{ display: 'block', color: 'var(--text-secondary)', marginBottom: '8px' }}>Selecione o Herói:</label>
              <select onChange={handleHeroChange} style={{ width: '100%', background: 'rgba(0,0,0,0.5)', color: 'white', border: '1px solid rgba(255,255,255,0.2)', padding: '12px', borderRadius: '8px' }}>
                <option value="">-- Escolher Herói --</option>
                {heroes.map(h => <option key={h.code} value={h.code}>{h.name}</option>)}
              </select>
            </div>
            
            <div style={{ flex: 1, minWidth: '200px' }}>
              <label style={{ display: 'block', color: 'var(--text-secondary)', marginBottom: '8px' }}>Aspecto:</label>
              <select value={selectedAspect} onChange={e => setSelectedAspect(e.target.value)} style={{ width: '100%', background: 'rgba(0,0,0,0.5)', color: 'white', border: '1px solid rgba(255,255,255,0.2)', padding: '12px', borderRadius: '8px' }}>
                <option value="aggression">Agressividade</option>
                <option value="justice">Justiça</option>
                <option value="leadership">Liderança</option>
                <option value="protection">Proteção</option>
                <option value="pool">Pool</option>
              </select>
            </div>
          </div>
        </div>

        {selectedHero && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '24px' }}>
            <div className="glass-panel" style={{ padding: '24px', maxHeight: '600px', overflowY: 'auto' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h3 style={{ color: 'var(--secondary-color)' }}>Cartas Disponíveis</h3>
                <span style={{ background: 'rgba(255,255,255,0.1)', padding: '4px 12px', borderRadius: '24px', color: deckSize >= 40 && deckSize <= 50 ? 'var(--aspect-protection)' : 'var(--text-primary)' }}>Total no Deck: {deckSize} / 50</span>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '12px' }}>
                {aspectCards.map(card => {
                  const currentQty = deck[card.code] || 0;
                  const limit = card.deck_limit || 3;
                  return (
                    <div key={card.code} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.05)', padding: '12px', borderRadius: '8px' }}>
                      <div style={{ flex: 1, paddingRight: '8px' }}>
                        <span style={{ display: 'block', fontWeight: 'bold', fontSize: '0.9rem' }}>{card.name}</span>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{card.type_name} • {card.faction_name}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <button onClick={() => removeCard(card.code)} disabled={currentQty === 0} style={{ padding: '6px', background: 'rgba(255,255,255,0.1)', color: 'white', borderRadius: '6px', opacity: currentQty === 0 ? 0.3 : 1 }}>
                          <Minus size={16} />
                        </button>
                        <span style={{ width: '16px', textAlign: 'center', fontWeight: 'bold' }}>{currentQty}</span>
                        <button onClick={() => addCard(card)} disabled={currentQty >= limit} style={{ padding: '6px', background: 'rgba(255,255,255,0.1)', color: 'white', borderRadius: '6px', opacity: currentQty >= limit ? 0.3 : 1 }}>
                          <Plus size={16} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <button onClick={exportDeck} className="btn-primary" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '16px' }}>
              <Copy size={20} /> Copiar Lista para Área de Transferência
            </button>
          </div>
        )}
      </div>

      <Modal isOpen={showCopyAlert} onClose={() => setShowCopyAlert(false)} maxWidth="300px" noPadding={true}>
        <div style={{ padding: '24px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'rgba(67, 160, 71, 0.2)', color: 'var(--aspect-protection)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid var(--aspect-protection)', boxShadow: '0 0 15px rgba(67, 160, 71, 0.4)' }}>
            <Check size={28} />
          </div>
          <h4 style={{ margin: 0, fontSize: '1.2rem', color: 'white' }}>Copiado!</h4>
        </div>
      </Modal>
    </div>
  );
}
