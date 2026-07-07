import React, { useState } from 'react';
import { BookOpen, Shield, Sword, ChevronRight, Activity, Search } from 'lucide-react';
import { rulesDictionary } from '../data/rules';

export default function Rules() {
  const [activeTab, setActiveTab] = useState('player');
  const [searchTerm, setSearchTerm] = useState('');

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
        <h2 className="rules-title text-primary">Manual do Jogo</h2>
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
            placeholder="Spotlight: Busque por Overkill, Tough, Setup, Stunned..." 
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
            <p style={{ color: 'var(--text-secondary)', padding: '24px', textAlign: 'center', gridColumn: '1 / -1' }}>Nenhum termo encontrado para "{searchTerm}".</p>
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
            <span className="desktop-text">Fase dos Jogadores</span>
            <span className="mobile-text">Jogadores</span>
          </button>
          
          <button 
            onClick={() => setActiveTab('villain')}
            className={`tab-btn ${activeTab === 'villain' ? 'active' : ''}`}
          >
            <Sword size={18} className="tab-icon-villain" />
            <span className="desktop-text">Fase do Vilão</span>
            <span className="mobile-text">Vilão</span>
          </button>
          
          <button 
            onClick={() => setActiveTab('dictionary')}
            className={`tab-btn ${activeTab === 'dictionary' ? 'active' : ''}`}
          >
            <Activity size={18} className="tab-icon-dictionary" />
            <span className="desktop-text">Dicionário de Combate</span>
            <span className="mobile-text">Dicionário</span>
          </button>

          <button 
            onClick={() => setActiveTab('official')}
            className={`tab-btn ${activeTab === 'official' ? 'active' : ''}`}
            style={{ marginLeft: 'auto', background: 'rgba(230, 36, 41, 0.1)' }}
          >
            <BookOpen size={18} style={{ color: 'var(--primary-color)' }} />
            <span className="desktop-text" style={{ color: 'var(--primary-color)' }}>Manuais Oficiais (PDF)</span>
            <span className="mobile-text" style={{ color: 'var(--primary-color)' }}>Manuais</span>
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
                <strong className="action-title block">Mudar de Forma</strong>
                <p className="action-desc">Vire sua carta de Identidade (Apenas 1x por turno).</p>
              </div>
              <div className="action-card">
                <strong className="action-title block">Jogar uma Carta</strong>
                <p className="action-desc">Pague o custo gerando recursos da mão ou mesa.</p>
              </div>
              <div className="action-card">
                <strong className="action-title block">Poder Básico</strong>
                <p className="action-desc">Exaure a Identidade para Atacar, Intervir, Defender ou Recuperar.</p>
              </div>
              <div className="action-card">
                <strong className="action-title block">Habilidades</strong>
                <p className="action-desc">Acione textos em cartas já baixadas na mesa.</p>
              </div>
            </div>

            <div className="turn-end-box">
              <h4 style={{ color: 'white', fontWeight: '700' }}>Fim do Turno:</h4>
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
                  <strong className="step-title block">Ameaça (Threat)</strong>
                  <p className="step-desc">Adicione ameaça ao Esquema Principal baseada no valor impresso × nº de jogadores.</p>
                </div>
              </div>

              <div className="villain-step">
                <div className="step-number">2</div>
                <div style={{ flex: 1 }}>
                  <strong className="step-title block">Ativação do Vilão</strong>
                  <p className="step-desc">O vilão é ativado uma vez por jogador, seguindo a ordem da mesa:</p>
                  <div className="villain-split">
                    <div className="villain-card-hero">
                      <strong className="villain-card-title hero-color block">Contra Herói (Ataque)</strong>
                      <p className="action-desc">Dê 1 Boost oculto. Declare defensores. Revele o Boost e aplique o dano.</p>
                    </div>
                    <div className="villain-card-ae">
                      <strong className="villain-card-title ae-color block">Contra Alter-Ego (Esquema)</strong>
                      <p className="action-desc">Dê 1 Boost oculto. Revele o Boost e adicione o total em ameaça ao esquema.</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="villain-step">
                <div className="step-number">3</div>
                <div>
                  <strong className="step-title block">Distribuição de Encontros</strong>
                  <p className="step-desc">Entregue 1 carta de encontro fechada por jogador (+1 por cada ícone de Hazard na mesa).</p>
                </div>
              </div>

              <div className="villain-step">
                <div className="step-number">4</div>
                <div>
                  <strong className="step-title block">Resolução de Encontros</strong>
                  <p className="step-desc">Revele as cartas distribuídas uma a uma (na ordem dos jogadores) e resolva os efeitos.</p>
                </div>
              </div>
            </div>
            
            <div style={{ textAlign: 'center', marginTop: '32px', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '24px' }}>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Passe o marcador de Primeiro Jogador para a esquerda e recomece o turno.</p>
            </div>
          </div>
        )}

        {/* DICTIONARY */}
        {activeTab === 'dictionary' && (
          <div className="animate-fade-in dict-grid">
            <div>
              <h3 className="section-title text-primary">Status Principais</h3>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '16px' }}>Use a barra de pesquisa no topo para procurar qualquer outra Keyword do jogo.</p>
              <div>
                <div className="dict-item tough">
                  <strong className="dict-title block">Tough (Robusto)</strong>
                  <p className="dict-desc">Previne a próxima instância de dano. Descarte o status logo após prevenir.</p>
                </div>
                <div className="dict-item stunned">
                  <strong className="dict-title block">Stunned (Atordoado)</strong>
                  <p className="dict-desc">Substitui o próximo ataque do personagem por descartar esta carta.</p>
                </div>
                <div className="dict-item confused">
                  <strong className="dict-title block">Confused (Confuso)</strong>
                  <p className="dict-desc">Substitui a próxima intervenção do personagem por descartar esta carta.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* OFFICIAL PDF MANUALS */}
        {activeTab === 'official' && (
          <div className="animate-fade-in" style={{ padding: '16px' }}>
            <h3 className="section-title text-primary" style={{ marginBottom: '16px' }}>Manuais Oficiais de Regras</h3>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>Acesse os guias oficiais em formato PDF originais (Requer leitor de PDF). Eles estão salvos offline no app.</p>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px' }}>
              <a href="/docs/marvel_champions_th_learn_to_play_142802.pdf" target="_blank" rel="noreferrer" className="glass-panel" style={{ display: 'flex', flexDirection: 'column', padding: '24px', textDecoration: 'none', transition: 'all 0.3s' }}>
                <BookOpen size={32} style={{ color: 'var(--aspect-leadership)', marginBottom: '16px' }} />
                <strong style={{ color: 'white', fontSize: '1.2rem', marginBottom: '8px' }}>Aprenda a Jogar (Learn to Play)</strong>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>O guia básico para sua primeira partida. Explica passo a passo como o jogo funciona.</p>
              </a>

              <a href="/docs/marvel_champions_th_referencia_de_regras_142911.pdf" target="_blank" rel="noreferrer" className="glass-panel" style={{ display: 'flex', flexDirection: 'column', padding: '24px', textDecoration: 'none', transition: 'all 0.3s' }}>
                <Shield size={32} style={{ color: 'var(--aspect-protection)', marginBottom: '16px' }} />
                <strong style={{ color: 'white', fontSize: '1.2rem', marginBottom: '8px' }}>Referência de Regras (RRG)</strong>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>O dicionário completo oficial da FFG (Fantasy Flight Games) com todas as minúcias.</p>
              </a>

              <a href="/docs/marvel_champions_th_guia_de_referencia_pt_br_268594.pdf" target="_blank" rel="noreferrer" className="glass-panel" style={{ display: 'flex', flexDirection: 'column', padding: '24px', textDecoration: 'none', transition: 'all 0.3s' }}>
                <Sword size={32} style={{ color: 'var(--aspect-aggression)', marginBottom: '16px' }} />
                <strong style={{ color: 'white', fontSize: '1.2rem', marginBottom: '8px' }}>Guia de Referência PT-BR</strong>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Versão traduzida para o português com detalhes avançados e esclarecimento de termos.</p>
              </a>
            </div>
          </div>
        )}
      </div>
      </>
      )}

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
