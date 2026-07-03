import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { getCards } from '../services/api';
import { Loader2, List } from 'lucide-react';

export default function Decks() {
  const [decks, setDecks] = useState([]);
  const [cardsInfo, setCardsInfo] = useState({});
  const [loading, setLoading] = useState(true);
  const [ownedPacks, setOwnedPacks] = useState({});
  const [filterOwned, setFilterOwned] = useState(false);
  const [filterAspect, setFilterAspect] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDeck, setSelectedDeck] = useState(null);
  const [previewCard, setPreviewCard] = useState(null);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const PAGE_SIZE = 24; // Decks per page

  useEffect(() => {
    // Load owned packs
    const saved = localStorage.getItem('mc_owned_packs');
    const owned = saved ? JSON.parse(saved) : {};
    setOwnedPacks(owned);

    // Fetch Cards API and Local All Decks JSONL
    Promise.all([
      fetch('/all_decks.jsonl').then(r => {
        if (!r.ok) return [];
        return r.text();
      }),
      getCards()
    ])
      .then(([decksText, cardsData]) => {
        const cardMap = {};
        cardsData.forEach(c => {
          cardMap[c.code] = c;
        });
        setCardsInfo(cardMap);
        
        let allDecks = [];
        if (typeof decksText === 'string' && decksText.trim().length > 0) {
          const lines = decksText.split('\n');
          for (let line of lines) {
            if (line.trim()) {
              try {
                allDecks.push(JSON.parse(line));
              } catch {
                // Ignore partial lines
              }
            }
          }
        }
        
        // Reverse to show newest first (since they were scraped sequentially)
        setDecks(allDecks.reverse());
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const canBuildDeck = (deck) => {
    // In our simplified JSONL, the structure is direct
    if (!deck.slots) return true;

    // Primeiro verifica o herói
    if (deck.hero_code) {
      const heroCard = cardsInfo[deck.hero_code];
      if (heroCard) {
        const pack = heroCard.pack_code;
        if (pack !== 'core' && !ownedPacks[pack]) {
          return false;
        }
      }
    }

    // Depois verifica todas as cartas
    for (const cardCode in deck.slots) {
      const card = cardsInfo[cardCode];
      if (card) {
        const pack = card.pack_code;
        if (pack !== 'core' && !ownedPacks[pack]) {
          return false;
        }
      }
    }
    return true;
  };

  const getFilteredDecks = () => {
    return decks.filter(deck => {
      if (filterOwned && !canBuildDeck(deck)) return false;
      if (filterAspect && deck.aspect && deck.aspect.toLowerCase() !== filterAspect.toLowerCase()) return false;
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const heroName = (deck.hero_name || '').toLowerCase();
        const deckName = (deck.name || '').toLowerCase();
        const authorName = (deck.username || '').toLowerCase();
        if (!heroName.includes(query) && !deckName.includes(query) && !authorName.includes(query)) {
          return false;
        }
      }
      return true;
    });
  };

  // Reset to page 1 when filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [filterOwned, filterAspect, searchQuery]);

  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '300px', gap: '16px' }}>
        <Loader2 className="text-primary" size={48} style={{ animation: 'spin 1s linear infinite' }} />
        <p style={{ color: 'var(--text-secondary)' }}>Carregando banco de decks offline...</p>
      </div>
    );
  }

  const filteredDecks = getFilteredDecks();
  const totalPages = Math.ceil(filteredDecks.length / PAGE_SIZE);
  const paginatedDecks = filteredDecks.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  return (
    <div className="animate-fade-in container">
      <div className="page-header" style={{ marginBottom: '16px' }}>
        <div>
          <h2 className="page-title">Banco de Decks</h2>
          <p className="page-subtitle">Descubra os milhares de decks criados pela comunidade.</p>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginBottom: '32px', background: 'rgba(255,255,255,0.03)', padding: '16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)' }}>
        <input 
          type="text" 
          placeholder="Buscar herói, nome ou autor..." 
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          style={{ flex: 1, minWidth: '200px', background: 'rgba(0,0,0,0.5)', color: 'white', border: '1px solid rgba(255,255,255,0.2)', padding: '10px 16px', borderRadius: '8px', outline: 'none' }}
        />
        
        <select 
          value={filterAspect}
          onChange={e => setFilterAspect(e.target.value)}
          style={{ minWidth: '160px', background: 'rgba(0,0,0,0.5)', color: 'white', border: '1px solid rgba(255,255,255,0.2)', padding: '10px 16px', borderRadius: '8px', outline: 'none' }}
        >
          <option value="">Todos Aspectos</option>
          <option value="aggression">Agressividade</option>
          <option value="justice">Justiça</option>
          <option value="leadership">Liderança</option>
          <option value="protection">Proteção</option>
          <option value="pool">Pool</option>
        </select>

        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', background: 'rgba(0,0,0,0.4)', padding: '10px 16px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)' }}>
          <input 
            type="checkbox" 
            checked={filterOwned} 
            onChange={(e) => setFilterOwned(e.target.checked)} 
            style={{ accentColor: 'var(--primary-color)', width: '16px', height: '16px' }}
          />
          <span style={{ fontSize: '0.9rem', fontWeight: 'bold' }}>Apenas minha coleção</span>
        </label>
      </div>

      {filteredDecks.length === 0 ? (
        <p style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '40px' }}>Nenhum deck encontrado com as cartas da sua coleção.</p>
      ) : (
        <div className="decks-grid">
          {paginatedDecks.map((deck, idx) => {
            const list = deck;
            const heroImgSrc = `https://marvelcdb.com/bundles/cards/${list.hero_code}.png`;
            const aspectClass = list.aspect ? `aspect-${list.aspect.toLowerCase()}` : 'aspect-basic';
            
            return (
              <div key={list.id || idx} className="glass-panel deck-card">
                <div className="deck-image-side">
                  <img 
                    src={heroImgSrc} 
                    alt={list.hero_name}
                    className="deck-image"
                    onError={(e) => { e.target.style.display = 'none'; }}
                  />
                </div>

                <div className="deck-info-side">
                  <button 
                    onClick={() => setSelectedDeck(deck)}
                    className="deck-title"
                    style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', textAlign: 'left', font: 'inherit' }}
                  >
                    {list.name}
                  </button>
                  
                  <p className="deck-hero">
                    <strong>{list.hero_name || 'Herói'}</strong> — {list.username || 'Autor'}
                  </p>
                  
                  <span className={`deck-aspect ${aspectClass}`}>
                    {list.aspect || 'Aspecto'}
                  </span>

                  <div style={{ marginTop: '16px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    <button 
                      className="btn-secondary"
                      onClick={() => setSelectedDeck(deck)}
                      style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '8px 16px', fontSize: '0.85rem' }}
                    >
                      <List size={14} /> Ver Lista
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {totalPages > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '2rem', gap: '1rem' }}>
          <button 
            className="btn-secondary" 
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            style={{ padding: '8px 16px', opacity: currentPage === 1 ? 0.5 : 1, cursor: currentPage === 1 ? 'not-allowed' : 'pointer' }}
          >
            Anterior
          </button>
          <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
            Página {currentPage} de {totalPages}
          </span>
          <button 
            className="btn-primary" 
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            style={{ padding: '8px 16px', opacity: currentPage === totalPages ? 0.5 : 1, cursor: currentPage === totalPages ? 'not-allowed' : 'pointer' }}
          >
            Próxima
          </button>
        </div>
      )}

      {selectedDeck && createPortal(
        <div 
          className="modal-overlay animate-fade-in" 
          onClick={() => setSelectedDeck(null)}
          style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, padding: '20px' }}
        >
          <div 
            className="modal-content glass-panel" 
            onClick={e => e.stopPropagation()} 
            style={{ 
              maxWidth: '600px', 
              width: '100%', 
              maxHeight: '85vh', 
              display: 'flex', 
              flexDirection: 'column',
              padding: 0,
              overflow: 'hidden'
            }}
          >
            <div style={{ padding: '20px', borderBottom: '1px solid rgba(255,255,255,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(0,0,0,0.3)' }}>
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'white', marginBottom: '4px' }}>{selectedDeck.name}</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Herói: {selectedDeck.hero_name}</p>
              </div>
              <button 
                onClick={() => setSelectedDeck(null)}
                style={{ background: 'none', border: 'none', color: 'white', fontSize: '1.5rem', cursor: 'pointer', padding: '0 8px' }}
              >
                &times;
              </button>
            </div>

            <div style={{ padding: '20px', overflowY: 'auto', flex: 1 }} className="hide-scrollbar">
              {(() => {
                const slots = selectedDeck.slots || {};
                const cardEntries = Object.entries(slots).map(([code, qty]) => {
                  return { code, qty, card: cardsInfo[code] };
                }).filter(entry => entry.card);

                if (cardEntries.length === 0) {
                  return <p>Nenhuma carta encontrada na lista.</p>;
                }

                const groups = {};
                cardEntries.forEach(entry => {
                  if (!entry.card) return;
                  const type = entry.card.type_code === 'hero' || entry.card.type_code === 'alter_ego' ? 'Identity' :
                               entry.card.type_name || 'Outros';
                  if (!groups[type]) groups[type] = [];
                  groups[type].push(entry);
                });

                return Object.entries(groups).map(([type, cardsInGroup]) => (
                  <div key={type} style={{ marginBottom: '16px' }}>
                    <h4 style={{ fontSize: '1rem', color: 'var(--primary-color)', marginBottom: '8px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '4px' }}>
                      {type} ({cardsInGroup.reduce((acc, c) => acc + c.qty, 0)})
                    </h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      {cardsInGroup.map(c => {
                        const pack = c.card.pack_code;
                        const isMissing = pack !== 'core' && !ownedPacks[pack];
                        return (
                          <div 
                            key={c.code} 
                            onClick={() => setPreviewCard(c.card)}
                            style={{ 
                              display: 'flex', 
                              justifyContent: 'space-between', 
                              alignItems: 'center', 
                              fontSize: '0.9rem', 
                              padding: '6px 12px', 
                              background: isMissing ? 'rgba(239, 68, 68, 0.1)' : 'rgba(255,255,255,0.02)', 
                              border: isMissing ? '1px solid rgba(239, 68, 68, 0.3)' : '1px solid transparent', 
                              borderRadius: '4px',
                              cursor: 'pointer',
                              transition: 'background 0.2s'
                            }}
                            onMouseEnter={(e) => { e.currentTarget.style.background = isMissing ? 'rgba(239, 68, 68, 0.2)' : 'rgba(255,255,255,0.06)' }}
                            onMouseLeave={(e) => { e.currentTarget.style.background = isMissing ? 'rgba(239, 68, 68, 0.1)' : 'rgba(255,255,255,0.02)' }}
                          >
                            <span style={{ color: isMissing ? '#fca5a5' : 'inherit' }}>
                              {c.card.name} {isMissing && <span style={{ fontSize: '0.75rem', opacity: 0.8 }}>(Falta expansão)</span>}
                            </span>
                            <span style={{ color: isMissing ? '#fca5a5' : 'var(--text-secondary)', fontWeight: 'bold' }}>{c.qty}x</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ));
              })()}
            </div>
          </div>
        </div>,
        document.body
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
