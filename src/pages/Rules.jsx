import React, { useState } from 'react';
import { BookOpen, Shield, Sword, ChevronRight, Activity, Search } from 'lucide-react';
import { rulesDictionary } from '../data/rules';
import { useTranslation } from 'react-i18next';
import Modal from '../components/Modal';

export default function Rules() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('player');
  const [searchTerm, setSearchTerm] = useState('');
  const [pdfUrl, setPdfUrl] = useState(null);
  const [pdfTitle, setPdfTitle] = useState('');

  const filteredRules = rulesDictionary.filter(rule => 
    rule.term.toLowerCase().includes(searchTerm.toLowerCase()) || 
    rule.desc.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container animate-fade-in" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      
      {/* Header */}
      <div className="rules-header">
        <div className="rules-icon-wrapper">
          <BookOpen size={48} />
        </div>
        <h2 className="rules-title text-primary">{t("rules.title")}</h2>
        <p className="rules-subtitle">
          Consulte rapidamente as regras oficiais e guias de turno de Marvel Champions.
        </p>
      </div>

      {/* Spotlight Search Bar */}
      <div style={{ padding: '0 24px', marginBottom: '24px', position: 'relative' }}>
        <div style={{ position: 'relative', width: '100%', maxWidth: '800px', margin: '0 auto' }}>
          <Search size={24} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--primary-color)' }} />
          <input 
            type="text" 
            placeholder={t("rules.search_placeholder")} 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ 
              width: '100%', 
              background: 'rgba(0,0,0,0.5)', 
              color: 'white', 
              border: '2px solid rgba(230, 36, 41, 0.3)', 
              padding: '16px 16px 16px 56px', 
              borderRadius: '16px', 
              fontSize: '1.2rem', 
              outline: 'none',
              boxShadow: searchTerm ? '0 0 20px rgba(230, 36, 41, 0.2)' : 'none',
              transition: 'all 0.3s'
            }}
          />
        </div>
      </div>

      {searchTerm.length > 0 ? (
        /* BUSCA ATIVA: Mostra Resultados */
        <div className="glass-panel tab-content" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px', borderTop: '4px solid var(--primary-color)' }}>
          {filteredRules.length === 0 ? (
            <p style={{ color: 'var(--text-secondary)', padding: '24px', textAlign: 'center', gridColumn: '1 / -1' }}>{t("rules.no_search")} "{searchTerm}".</p>
          ) : (
            filteredRules.map((rule, idx) => (
              <div key={idx} className="dict-item" style={{ background: 'rgba(255,255,255,0.05)', padding: '16px', borderRadius: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                  <strong style={{ fontSize: '1.2rem', color: 'white' }}>{rule.term}</strong>
                  <span style={{ fontSize: '0.75rem', background: 'var(--primary-color)', color: 'white', padding: '2px 8px', borderRadius: '12px', fontWeight: 'bold' }}>{rule.category}</span>
                </div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: '1.5' }}>{rule.desc}</p>
              </div>
            ))
          )}
        </div>
      ) : (
        /* BUSCA VAZIA: Mostra Tabs Originais */
        <>
          {/* Tabs Navigation */}
      <div className="tabs-container">
        <div className="tabs-wrapper hide-scrollbar">
          <button 
            onClick={() => setActiveTab('player')}
            className={`tab-btn ${activeTab === 'player' ? 'active' : ''}`}
          >
            <Shield size={18} className="tab-icon-player" />
            <span className="desktop-text">{t("rules.tab_player")}</span>
            <span className="mobile-text">{t("rules.tab_player_mob")}</span>
          </button>
          
          <button 
            onClick={() => setActiveTab('villain')}
            className={`tab-btn ${activeTab === 'villain' ? 'active' : ''}`}
          >
            <Sword size={18} className="tab-icon-villain" />
            <span className="desktop-text">{t("rules.tab_villain")}</span>
            <span className="mobile-text">{t("rules.tab_villain_mob")}</span>
          </button>
          
          <button 
            onClick={() => setActiveTab('dictionary')}
            className={`tab-btn ${activeTab === 'dictionary' ? 'active' : ''}`}
          >
            <Activity size={18} className="tab-icon-dictionary" />
            <span className="desktop-text">{t("rules.tab_dict")}</span>
            <span className="mobile-text">{t("rules.tab_dict_mob")}</span>
          </button>

          <button 
            onClick={() => setActiveTab('official')}
            className={`tab-btn ${activeTab === 'official' ? 'active' : ''}`}
            style={{ marginLeft: 'auto', background: 'rgba(230, 36, 41, 0.1)' }}
          >
            <BookOpen size={18} style={{ color: 'var(--primary-color)' }} />
            <span className="desktop-text" style={{ color: 'var(--primary-color)' }}>{t("rules.tab_manuals")}</span>
            <span className="mobile-text" style={{ color: 'var(--primary-color)' }}>{t("rules.tab_manuals_mob")}</span>
          </button>
        </div>
      </div>

      {/* Tab Content */}
      <div className="glass-panel tab-content">
        
        {/* PLAYER PHASE */}
        {activeTab === 'player' && (
          <div className="animate-fade-in">
            <h3 className="section-title text-primary">
              Opções de Ação do Jogador
            </h3>
            <p className="mb-8" style={{ color: 'var(--text-secondary)' }}>
              Durante o seu turno, você pode executar qualquer número das ações abaixo, na ordem que preferir. Você também pode pedir para outros jogadores ativarem habilidades na sua vez.
            </p>
            
            <div className="action-grid">
              <div className="action-card">
                <strong className="action-title block">{t("rules.form_title")}</strong>
                <p className="action-desc">{t("rules.form_desc")}</p>
              </div>
              <div className="action-card">
                <strong className="action-title block">{t("rules.play_title")}</strong>
                <p className="action-desc">{t("rules.play_desc")}</p>
              </div>
              <div className="action-card">
                <strong className="action-title block">{t("rules.basic_title")}</strong>
                <p className="action-desc">{t("rules.basic_desc")}</p>
              </div>
              <div className="action-card">
                <strong className="action-title block">{t("rules.ability_title")}</strong>
                <p className="action-desc">{t("rules.ability_desc")}</p>
              </div>
            </div>

            <div className="turn-end-box">
              <h4 style={{ color: 'white', fontWeight: '700' }}>{t("rules.turn_end")}</h4>
              <ul>
                <li><ChevronRight size={16} /> Descarte as cartas que não quiser da mão.</li>
                <li><ChevronRight size={16} /> Compre cartas até o limite máximo da sua forma atual.</li>
                <li><ChevronRight size={16} /> Prepare (desvire) todas as suas cartas exaustas.</li>
              </ul>
            </div>
          </div>
        )}

        {/* VILLAIN PHASE */}
        {activeTab === 'villain' && (
          <div className="animate-fade-in">
            <h3 className="section-title text-primary">
              Sequência de Turno do Vilão
            </h3>
            
            <div>
              <div className="villain-step">
                <div className="step-number">1</div>
                <div>
                  <strong className="step-title block">{t("rules.threat_title")}</strong>
                  <p className="step-desc">{t("rules.threat_desc")}</p>
                </div>
              </div>

              <div className="villain-step">
                <div className="step-number">2</div>
                <div style={{ flex: 1 }}>
                  <strong className="step-title block">{t("rules.attack_title")}</strong>
                  <p className="step-desc">{t("rules.attack_desc")}</p>
                  <div className="villain-split">
                    <div className="villain-card-hero">
                      <strong className="villain-card-title hero-color block">{t("rules.attack_hero")}</strong>
                      <p className="action-desc">{t("rules.attack_hero_desc")}</p>
                    </div>
                    <div className="villain-card-ae">
                      <strong className="villain-card-title ae-color block">{t("rules.attack_ae")}</strong>
                      <p className="action-desc">{t("rules.attack_ae_desc")}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="villain-step">
                <div className="step-number">3</div>
                <div>
                  <strong className="step-title block">{t("rules.encounter_title")}</strong>
                  <p className="step-desc">{t("rules.encounter_desc")}</p>
                </div>
              </div>

              <div className="villain-step">
                <div className="step-number">4</div>
                <div>
                  <strong className="step-title block">{t("rules.resolve_title")}</strong>
                  <p className="step-desc">{t("rules.resolve_desc")}</p>
                </div>
              </div>
            </div>
            
            <div style={{ textAlign: 'center', marginTop: '32px', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '24px' }}>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{t("rules.next_player")}</p>
            </div>
          </div>
        )}

        {/* DICTIONARY */}
        {activeTab === 'dictionary' && (
          <div className="animate-fade-in dict-grid">
            <div>
              <h3 className="section-title text-primary">{t("rules.dict_status")}</h3>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '16px' }}>{t("rules.dict_desc")}</p>
              <div>
                <div className="dict-item tough">
                  <strong className="dict-title block">{t("rules.tough_title")}</strong>
                  <p className="dict-desc">{t("rules.tough_desc")}</p>
                </div>
                <div className="dict-item stunned">
                  <strong className="dict-title block">{t("rules.stunned_title")}</strong>
                  <p className="dict-desc">{t("rules.stunned_desc")}</p>
                </div>
                <div className="dict-item confused">
                  <strong className="dict-title block">{t("rules.confused_title")}</strong>
                  <p className="dict-desc">{t("rules.confused_desc")}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* OFFICIAL PDF MANUALS */}
        {activeTab === 'official' && (
          <div className="animate-fade-in" style={{ padding: '16px' }}>
            <h3 className="section-title text-primary" style={{ marginBottom: '16px' }}>{t("rules.manuals_title")}</h3>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>{t("rules.manuals_desc")}</p>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px' }}>
              <button 
                onClick={() => { setPdfUrl(`${import.meta.env.BASE_URL}docs/marvel_champions_th_learn_to_play_142802.pdf`); setPdfTitle('Aprenda a Jogar'); }} 
                className="glass-panel" 
                style={{ display: 'flex', flexDirection: 'column', padding: '24px', border: 'none', background: 'rgba(255,255,255,0.05)', textAlign: 'left', cursor: 'pointer', transition: 'all 0.3s' }}
              >
                <BookOpen size={32} style={{ color: 'var(--aspect-leadership)', marginBottom: '16px' }} />
                <strong style={{ color: 'white', fontSize: '1.2rem', marginBottom: '8px' }}>{t("rules.learn_to_play")}</strong>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{t("rules.learn_desc")}</p>
              </button>

              <button 
                onClick={() => { setPdfUrl(`${import.meta.env.BASE_URL}docs/marvel_champions_th_referencia_de_regras_142911.pdf`); setPdfTitle('Referência de Regras'); }} 
                className="glass-panel" 
                style={{ display: 'flex', flexDirection: 'column', padding: '24px', border: 'none', background: 'rgba(255,255,255,0.05)', textAlign: 'left', cursor: 'pointer', transition: 'all 0.3s' }}
              >
                <Shield size={32} style={{ color: 'var(--aspect-protection)', marginBottom: '16px' }} />
                <strong style={{ color: 'white', fontSize: '1.2rem', marginBottom: '8px' }}>{t("rules.reference")}</strong>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{t("rules.ref_desc")}</p>
              </button>

              <button 
                onClick={() => { setPdfUrl(`${import.meta.env.BASE_URL}docs/marvel_champions_th_guia_de_referencia_pt_br_268594.pdf`); setPdfTitle('Guia de Referência PT-BR'); }} 
                className="glass-panel" 

                style={{ display: 'flex', flexDirection: 'column', padding: '24px', border: 'none', background: 'rgba(255,255,255,0.05)', textAlign: 'left', cursor: 'pointer', transition: 'all 0.3s' }}
              >
                <Sword size={32} style={{ color: 'var(--aspect-aggression)', marginBottom: '16px' }} />
                <strong style={{ color: 'white', fontSize: '1.2rem', marginBottom: '8px' }}>{t("rules.ref_pt")}</strong>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{t("rules.ref_pt_desc")}</p>
              </button>
            </div>
          </div>
        )}
      </div>
      </>
      )}

      {/* PDF VIEWER MODAL */}
      <Modal isOpen={!!pdfUrl} onClose={() => setPdfUrl(null)} title={pdfTitle} maxWidth="1200px">
        {pdfUrl && (
          <div style={{ height: '75vh', width: '100%', background: '#333', borderRadius: '8px', overflow: 'hidden' }}>
            <iframe 
              src={`${pdfUrl}#toolbar=0&navpanes=0`} 
              width="100%" 
              height="100%" 
              style={{ border: 'none' }} 
              title={pdfTitle}
            />
          </div>
        )}
      </Modal>

      <div style={{ textAlign: 'center', marginTop: '32px', paddingBottom: '32px' }}>
        <a 
          href="https://hallofheroeslcg.com/latest-ffg-rulings-post-rrg-1-7/" 
          target="_blank" 
          rel="noreferrer" 
          style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}
        >
          Para Rulings complexos de torneio (RRG 1.7+), consulte o Hall of Heroes.
        </a>
      </div>
    </div>
  );
}
