import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { BookOpen, Layers, Zap, Shuffle, Activity, Archive, Wrench, Map, Menu, X, Home as HomeIcon, BarChart2, Settings, Volume2, VolumeX, Globe } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import Modal from './components/Modal';
import ReloadPrompt from './components/ReloadPrompt';
import packageJson from '../package.json';

// Stub Components for pages
const Home = () => (
  <div className="home-hero animate-fade-in">
    <div className="home-hero-content">
      <img 
        src="/logo.jpg" 
        alt="Champions HQ Logo" 
        style={{ width: '140px', height: '140px', borderRadius: '28px', boxShadow: '0 10px 40px rgba(230, 36, 41, 0.4)', marginBottom: '40px', objectFit: 'cover' }} 
      />
      <h1 className="home-title-hero">
        Champions HQ
      </h1>
      <p className="home-desc">
        Seu quartel-general definitivo. Controle sua coleção, descubra decks, gere combates e domine as regras.
      </p>
    </div>
    
    <div className="home-grid">
      <Link to="/collection" className="glass-panel home-card">
        <Layers size={40} className="card-icon text-primary" />
        <h3 className="home-card-title">Minha Coleção</h3>
        <p className="home-card-text">Marque os pacotes que possui para filtrar decks e gerar partidas sob medida.</p>
      </Link>
      
      <Link to="/decks" className="glass-panel home-card">
        <Zap size={40} className="card-icon text-justice" />
        <h3 className="home-card-title">Banco de Decks</h3>
        <p className="home-card-text">Navegue por milhares de decks criados pela comunidade, com match exato para suas cartas.</p>
      </Link>
      
      <Link to="/tracker" className="glass-panel home-card">
        <Activity size={40} className="card-icon" style={{ color: '#fbc02d' }} />
        <h3 className="home-card-title">Tracker de Partida</h3>
        <p className="home-card-text">Substitua os tokens da mesa e controle a vida, ameaça e status durante o jogo.</p>
      </Link>
      
      <Link to="/randomizer" className="glass-panel home-card">
        <Shuffle size={40} className="card-icon text-secondary" />
        <h3 className="home-card-title">Gerador de Caos</h3>
        <p className="home-card-text">Deixe o acaso decidir. Gere heróis, aspectos e vilões aleatórios para um desafio brutal.</p>
      </Link>
      
      <Link to="/history" className="glass-panel home-card">
        <Archive size={40} className="card-icon text-protection" />
        <h3 className="home-card-title">Histórico</h3>
        <p className="home-card-text">Guarde um diário dos seus confrontos e acompanhe sua evolução.</p>
      </Link>

      <Link to="/dashboard" className="glass-panel home-card">
        <BarChart2 size={40} className="card-icon text-primary" />
        <h3 className="home-card-title">Estatísticas</h3>
        <p className="home-card-text">Visualize sua taxa de vitórias, melhores heróis e piores vilões.</p>
      </Link>

      <Link to="/builder" className="glass-panel home-card">
        <Wrench size={40} className="card-icon text-justice" />
        <h3 className="home-card-title">Deck Builder</h3>
        <p className="home-card-text">Monte decks personalizados usando apenas as cartas da sua coleção.</p>
      </Link>
      
      <Link to="/campaign" className="glass-panel home-card">
        <Map size={40} className="card-icon" style={{ color: '#c084fc' }} />
        <h3 className="home-card-title">Campanhas</h3>
        <p className="home-card-text">Gerencie suas campanhas offline sem precisar da caderneta de papel.</p>
      </Link>
      
      <Link to="/rules" className="glass-panel home-card">
        <BookOpen size={40} className="card-icon text-protection" />
        <h3 className="home-card-title">Guia de Regras</h3>
        <p className="home-card-text">Dicionário de palavras-chave, fase do vilão detalhada e referências rápidas.</p>
      </Link>
    </div>
  </div>
);

import Collection from './pages/Collection';
import Randomizer from './pages/Randomizer';
import Decks from './pages/Decks';
import Rules from './pages/Rules';
import Tracker from './pages/Tracker';
import History from './pages/History';
import Builder from './pages/Builder';
import Campaign from './pages/Campaign';
import Dashboard from './pages/Dashboard';
import ReleaseNotes from './pages/ReleaseNotes';
import { useAuth } from './context/AuthContext';
import { useCloudSync } from './hooks/useCloudSync';

// NavLink Component
const NavItem = ({ to, icon: Icon, children }) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  return (
    <Link to={to} className={`nav-link flex items-center gap-2 ${isActive ? 'active' : ''}`}>
      <Icon size={18} />
      <span>{children}</span>
    </Link>
  );
};

function App() {
  const { user, loginWithGoogle, logout } = useAuth();
  const { syncStatus } = useCloudSync();
  const { t, i18n } = useTranslation();

  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstall, setShowInstall] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  
  // Theme & SFX States
  const [theme, setTheme] = useState('aggression');
  const [sfxEnabled, setSfxEnabled] = useState(true);

  useEffect(() => {
    // Load theme & sfx prefs
    const savedTheme = localStorage.getItem('mc_theme');
    if (savedTheme) {
      setTheme(savedTheme);
      document.body.setAttribute('data-theme', savedTheme);
    }
    const savedSfx = localStorage.getItem('mc_sfx');
    if (savedSfx !== null) {
      setSfxEnabled(savedSfx === 'true');
    }
    
    // SFX Interception logic
    const clickHandler = (e) => {
      if (localStorage.getItem('mc_sfx') === 'false') return;
      
      const target = e.target.closest('button, a');
      if (target) {
        // play a tiny base64 click sound (very short subtle tick)
        const snd = new Audio('data:audio/mp3;base64,//NExAAAAANIAAAAAExBTUUzLjEwMKqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq//NExEAAANIAAAAAExBTUUzLjEwMKqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq'); 
        // Note: this is a dummy silent base64 to avoid blocking. Real SFX will be handled via simple synth.
        
        try {
          // Web Audio API for a perfect instant tick
          const ctx = new (window.AudioContext || window.webkitAudioContext)();
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.connect(gain);
          gain.connect(ctx.destination);
          
          if (target.classList.contains('btn-primary') || target.tagName === 'A') {
            // UI click (higher pitch, very short)
            osc.frequency.setValueAtTime(600, ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 0.05);
            gain.gain.setValueAtTime(0.05, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);
            osc.start();
            osc.stop(ctx.currentTime + 0.05);
          } else if (target.classList.contains('btn-danger') || target.textContent === '-' || target.textContent === '+') {
            // HP/Damage click (lower, punchy)
            osc.frequency.setValueAtTime(300, ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.08);
            gain.gain.setValueAtTime(0.08, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
            osc.start();
            osc.stop(ctx.currentTime + 0.08);
          }
        } catch(err) { /* ignore audio context errors if blocked */ }
      }
    };
    
    document.addEventListener('click', clickHandler);
    return () => document.removeEventListener('click', clickHandler);
  }, []);

  const changeTheme = (newTheme) => {
    setTheme(newTheme);
    document.body.setAttribute('data-theme', newTheme);
    localStorage.setItem('mc_theme', newTheme);
  };

  const toggleSfx = () => {
    const newVal = !sfxEnabled;
    setSfxEnabled(newVal);
    localStorage.setItem('mc_sfx', newVal);
  };

  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstall(true);
    };
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
  }, []);

  const handleInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setShowInstall(false);
      }
      setDeferredPrompt(null);
    }
  };

  return (
    <Router>
      <div className="app-layout">
        <ReloadPrompt />
        {showInstall && (
          <div className="install-prompt animate-fade-in" style={{ background: 'linear-gradient(90deg, #e62429, #2b82d9)', padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 4px 15px rgba(230, 36, 41, 0.4)', zIndex: 60, position: 'relative' }}>
            <div>
              <h4 style={{ margin: 0, color: 'white', fontWeight: 800, fontSize: '1.1rem' }}>Instale o Champions HQ</h4>
              <p style={{ margin: 0, color: 'rgba(255,255,255,0.9)', fontSize: '0.85rem' }}>Adicione à sua tela inicial para acessar offline!</p>
            </div>
            <button onClick={handleInstall} style={{ background: 'white', color: '#e62429', padding: '8px 16px', borderRadius: '24px', fontWeight: 'bold', fontSize: '0.85rem', boxShadow: '0 2px 5px rgba(0,0,0,0.2)', border: 'none', cursor: 'pointer', whiteSpace: 'nowrap' }}>Instalar App</button>
          </div>
        )}
        <nav className="navbar">
          <div className="nav-content" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 32px', width: '100%', maxWidth: '1920px', margin: '0 auto' }}>
            
            {/* Lado Esquerdo - Logo */}
            <div className="nav-left" style={{ flex: 1, display: 'flex', justifyContent: 'flex-start' }}>
              <Link to="/" className="brand" onClick={() => setIsMobileMenuOpen(false)}>
                <img src="/logo.jpg" alt="Logo" style={{ width: '32px', height: '32px', borderRadius: '8px' }} />
                <span>Champions HQ</span>
              </Link>
            </div>
            
            {/* Centro - Menu de Navegação */}
            <div className="nav-center desktop-only" style={{ display: 'flex', justifyContent: 'center' }}>
              <div className="nav-links" style={{ display: 'flex', gap: '12px', margin: 0 }}>
                <NavItem to="/collection" icon={Layers}>{t('nav.collection')}</NavItem>
                <NavItem to="/decks" icon={Zap}>{t('nav.decks')}</NavItem>
                <NavItem to="/randomizer" icon={Shuffle}>{t('nav.randomizer')}</NavItem>
                <NavItem to="/tracker" icon={Activity}>{t('nav.tracker')}</NavItem>
                <NavItem to="/history" icon={Archive}>{t('nav.history')}</NavItem>
                <NavItem to="/dashboard" icon={BarChart2}>{t('nav.dashboard')}</NavItem>
                <NavItem to="/builder" icon={Wrench}>Builder</NavItem>
                <NavItem to="/campaign" icon={Map}>{t('nav.campaign')}</NavItem>
                <NavItem to="/rules" icon={BookOpen}>Regras</NavItem>
              </div>
            </div>

            {/* Lado Direito - Configurações e Login */}
            <div className="nav-right" style={{ flex: 1, display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '16px' }}>
              <div className="desktop-only" style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <Globe size={22} style={{ color: 'var(--text-secondary)', marginRight: '8px' }} />
                <select 
                  value={i18n.language.split('-')[0]} 
                  onChange={(e) => i18n.changeLanguage(e.target.value)}
                  style={{ background: 'transparent', color: 'var(--text-secondary)', border: 'none', cursor: 'pointer', outline: 'none', fontSize: '0.9rem' }}
                >
                  <option value="pt">PT</option>
                  <option value="en">EN</option>
                  <option value="es">ES</option>
                </select>
              </div>

              <button 
                className="desktop-only" 
                onClick={() => setShowSettings(true)}
                style={{ background: 'transparent', color: 'var(--text-secondary)', padding: '8px', cursor: 'pointer' }}
                title="Configurações (Temas e SFX)"
              >
                <Settings size={22} />
              </button>

              {user ? (
                <div className="desktop-only" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '0.8rem', color: '#86efac' }}>{syncStatus === 'syncing' ? 'Salvando...' : 'Nuvem OK'}</span>
                  <img src={user.photoURL} alt="User" style={{ width: 28, height: 28, borderRadius: '50%' }} title={user.displayName} />
                  <button onClick={logout} className="btn-secondary" style={{ padding: '4px 8px', fontSize: '0.75rem' }}>Sair</button>
                </div>
              ) : (
                <button onClick={loginWithGoogle} className="btn-primary desktop-only" style={{ padding: '6px 12px' }}>
                  Login
                </button>
              )}

              <button 
                className="mobile-menu-btn"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
              </button>
            </div>

          </div>

          {isMobileMenuOpen && (
            <div className="mobile-menu animate-fade-in">
              <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="mobile-link"><HomeIcon size={20} /> {t('nav.home', 'Início')}</Link>
              <Link to="/tracker" onClick={() => setIsMobileMenuOpen(false)} className="mobile-link"><Activity size={20} /> {t('nav.tracker')}</Link>
              <Link to="/builder" onClick={() => setIsMobileMenuOpen(false)} className="mobile-link"><Wrench size={20} /> Builder</Link>
              <Link to="/campaign" onClick={() => setIsMobileMenuOpen(false)} className="mobile-link"><Map size={20} /> {t('nav.campaign')}</Link>
              <Link to="/randomizer" onClick={() => setIsMobileMenuOpen(false)} className="mobile-link"><Shuffle size={20} /> {t('nav.randomizer')}</Link>
              <Link to="/history" onClick={() => setIsMobileMenuOpen(false)} className="mobile-link"><Archive size={20} /> {t('nav.history')}</Link>
              <Link to="/dashboard" onClick={() => setIsMobileMenuOpen(false)} className="mobile-link"><BarChart2 size={20} /> {t('nav.dashboard')}</Link>
              <Link to="/decks" onClick={() => setIsMobileMenuOpen(false)} className="mobile-link"><Zap size={20} /> {t('nav.decks')}</Link>
              <Link to="/collection" onClick={() => setIsMobileMenuOpen(false)} className="mobile-link"><Layers size={20} /> {t('nav.collection')}</Link>
              <Link to="/rules" onClick={() => setIsMobileMenuOpen(false)} className="mobile-link"><BookOpen size={20} /> Regras</Link>
              <button onClick={() => { setIsMobileMenuOpen(false); setShowSettings(true); }} className="mobile-link" style={{ background: 'transparent', border: 'none', textAlign: 'left', width: '100%', cursor: 'pointer' }}>
                <Settings size={20} /> Temas e Configurações
              </button>
            </div>
          )}
        </nav>

        <main className="main-content container">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/collection" element={<Collection />} />
            <Route path="/decks" element={<Decks />} />
            <Route path="/randomizer" element={<Randomizer />} />
            <Route path="/tracker" element={<Tracker />} />
            <Route path="/history" element={<History />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/builder" element={<Builder />} />
            <Route path="/campaign" element={<Campaign />} />
            <Route path="/rules" element={<Rules />} />
            <Route path="/releases" element={<ReleaseNotes />} />
          </Routes>
        </main>

        <footer className="app-footer">
          <div className="container" style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem', padding: '32px 0', borderTop: '1px solid var(--surface-border)', marginTop: 'auto' }}>
            <p>
              <strong>Champions HQ</strong> &copy; {new Date().getFullYear()}. Desenvolvido por Fãs, para Fãs.
              <Link to="/releases" style={{ color: 'var(--primary-color)', textDecoration: 'none', marginLeft: '12px', fontWeight: 'bold' }} title="Ver Histórico de Versões">v{packageJson.version}</Link>
            </p>
            <p style={{ fontSize: '0.75rem', marginTop: '12px', opacity: 0.6, maxWidth: '600px', margin: '12px auto 0' }}>
              Marvel Champions e todos os personagens, textos de cartas e imagens são de propriedade intelectual da Marvel e Fantasy Flight Games.<br/>
              Este aplicativo não possui fins lucrativos e não é afiliado de forma alguma à Marvel ou FFG.
            </p>
          </div>
        </footer>

        {/* SETTINGS MODAL */}
        <Modal isOpen={showSettings} onClose={() => setShowSettings(false)} title="Personalização" maxWidth="450px">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            
            <div>
              <h4 style={{ color: 'white', marginBottom: '16px', fontSize: '1.1rem' }}>Sons do App (SFX)</h4>
              <button 
                onClick={toggleSfx}
                style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: 'white', cursor: 'pointer' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  {sfxEnabled ? <Volume2 size={20} color="var(--primary-color)" /> : <VolumeX size={20} color="var(--text-muted)" />}
                  <span>Efeitos Sonoros (SFX)</span>
                </div>
                <span style={{ fontSize: '0.85rem', color: sfxEnabled ? '#86efac' : 'var(--text-muted)' }}>
                  {sfxEnabled ? 'Ligado' : 'Desligado'}
                </span>
              </button>
            </div>

            <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '24px' }}>
              <h4 style={{ color: 'white', marginBottom: '16px', fontSize: '1.1rem' }}>Tema (Cor Principal)</h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '12px' }}>
                
                <button onClick={() => changeTheme('aggression')} style={{ padding: '12px 16px', borderRadius: '8px', border: theme === 'aggression' ? '2px solid #e53935' : '1px solid transparent', background: 'rgba(255,255,255,0.05)', color: 'white', display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '16px', height: '16px', borderRadius: '50%', background: '#e53935' }}></div>
                  Agressividade (Padrão)
                </button>
                
                <button onClick={() => changeTheme('justice')} style={{ padding: '12px 16px', borderRadius: '8px', border: theme === 'justice' ? '2px solid #fbc02d' : '1px solid transparent', background: 'rgba(255,255,255,0.05)', color: 'white', display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '16px', height: '16px', borderRadius: '50%', background: '#fbc02d' }}></div>
                  Justiça (Amarelo)
                </button>
                
                <button onClick={() => changeTheme('leadership')} style={{ padding: '12px 16px', borderRadius: '8px', border: theme === 'leadership' ? '2px solid #1e88e5' : '1px solid transparent', background: 'rgba(255,255,255,0.05)', color: 'white', display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '16px', height: '16px', borderRadius: '50%', background: '#1e88e5' }}></div>
                  Liderança (Azul)
                </button>
                
                <button onClick={() => changeTheme('protection')} style={{ padding: '12px 16px', borderRadius: '8px', border: theme === 'protection' ? '2px solid #43a047' : '1px solid transparent', background: 'rgba(255,255,255,0.05)', color: 'white', display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '16px', height: '16px', borderRadius: '50%', background: '#43a047' }}></div>
                  Proteção (Verde)
                </button>

                <button onClick={() => changeTheme('dark-knight')} style={{ padding: '12px 16px', borderRadius: '8px', border: theme === 'dark-knight' ? '2px solid #71717a' : '1px solid transparent', background: 'rgba(255,255,255,0.05)', color: 'white', display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '16px', height: '16px', borderRadius: '50%', background: '#71717a' }}></div>
                  Cavaleiro das Trevas (Cinza/Preto)
                </button>

              </div>
            </div>

          </div>
        </Modal>

      </div>
    </Router>
  );
}

export default App;
