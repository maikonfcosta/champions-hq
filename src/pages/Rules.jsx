import React, { useState } from 'react';
import { BookOpen, Shield, Sword, ChevronRight, Activity } from 'lucide-react';

export default function Rules() {
  const [activeTab, setActiveTab] = useState('player');

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
              <h3 className="section-title text-primary">Cartas de Status</h3>
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

            <div>
              <h3 className="section-title text-primary">Palavras-chave</h3>
              <div>
                <div className="dict-item keyword">
                  <strong className="dict-title block">Overkill (Sobrecarga)</strong>
                  <p className="dict-desc">Dano excedente ao derrotar um lacaio passa para o vilão (e vice-versa).</p>
                </div>
                <div className="dict-item keyword">
                  <strong className="dict-title block">Retaliate X (Retaliação)</strong>
                  <p className="dict-desc">Se atacado e sobreviver, causa X de dano ao atacante passivamente.</p>
                </div>
                <div className="dict-item keyword">
                  <strong className="dict-title block">Surge (Surto)</strong>
                  <p className="dict-desc">Obriga a revelar uma carta extra do deck de encontros logo após a atual.</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

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
