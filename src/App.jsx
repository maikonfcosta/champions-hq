import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { BookOpen, Layers, Zap, Shuffle, Activity, Archive, Wrench, Map, Menu, X, Home as HomeIcon, BarChart2, Settings, Volume2, VolumeX, Globe } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import Modal from './components/Modal';
import ReloadPrompt from './components/ReloadPrompt';
import packageJson from '../package.json';

// Stub Components for pages
const Home = React.lazy(() => import('./pages/Home'));

const Collection = React.lazy(() => import('./pages/Collection'));
const Randomizer = React.lazy(() => import('./pages/Randomizer'));
const Decks = React.lazy(() => import('./pages/Decks'));
const Rules = React.lazy(() => import('./pages/Rules'));
const Tracker = React.lazy(() => import('./pages/Tracker'));
const History = React.lazy(() => import('./pages/History'));
const Builder = React.lazy(() => import('./pages/Builder'));
const Campaign = React.lazy(() => import('./pages/Campaign'));
const Dashboard = React.lazy(() => import('./pages/Dashboard'));
const ReleaseNotes = React.lazy(() => import('./pages/ReleaseNotes'));
import LoadingSpinner from './components/LoadingSpinner';
import { useAuth } from './context/AuthContext';
import { useCloudSync } from './hooks/useCloudSync';
import { storage } from './services/storage';

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
    const savedTheme = storage.get('mc_theme');
    if (savedTheme) {
      setTheme(savedTheme);
      document.body.setAttribute('data-theme', savedTheme);
    }
    const savedSfx = storage.get('mc_sfx');
    if (savedSfx !== null) {
      setSfxEnabled(String(savedSfx) === 'true');
    }
    
    // SFX Interception logic
    const clickHandler = (e) => {
      if (String(storage.get('mc_sfx')) === 'false') return;
      
      const target = e.target.closest('button, a');
      if (target) {
        // play a tiny click sound via Web Audio API below
        
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
        } catch { /* ignore audio context errors if blocked */ }
      }
    };
    
    document.addEventListener('click', clickHandler);
    return () => document.removeEventListener('click', clickHandler);
  }, []);

  const changeTheme = (newTheme) => {
    setTheme(newTheme);
    document.body.setAttribute('data-theme', newTheme);
    storage.set('mc_theme', newTheme);
  };

  const toggleSfx = () => {
    const newVal = !sfxEnabled;
    setSfxEnabled(newVal);
    storage.set('mc_sfx', newVal);
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
        <nav className="navbar mobile-only">
          <div className="nav-content" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', width: '100%' }}>
            <Link to="/" className="brand" onClick={() => setIsMobileMenuOpen(false)}>
              <img src="/logo.jpg" alt="Logo" style={{ width: '32px', height: '32px', borderRadius: '8px' }} />
              <span>Champions HQ</span>
            </Link>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', color: 'var(--text-secondary)' }}>
                <Globe size={18} style={{ marginRight: '4px' }} />
                <select 
                  value={i18n.language.split('-')[0]} 
                  onChange={(e) => i18n.changeLanguage(e.target.value)}
                  style={{ background: 'transparent', color: 'var(--text-secondary)', border: 'none', cursor: 'pointer', outline: 'none', fontSize: '0.85rem', appearance: 'none' }}
                >
                  <option value="pt">PT</option>
                  <option value="en">EN</option>
                  <option value="es">ES</option>
                </select>
              </div>
              <button onClick={() => setShowSettings(true)} style={{ background: 'transparent', color: 'var(--text-secondary)', border: 'none', display: 'flex', padding: 0 }} title="Configurações">
                <Settings size={22} />
              </button>
              {user ? (
                <img src={user.photoURL} alt="User" onClick={logout} style={{ width: 24, height: 24, borderRadius: '50%', cursor: 'pointer' }} title="Sair" />
              ) : (
                <button onClick={loginWithGoogle} className="btn-primary" style={{ padding: '4px 8px', fontSize: '0.75rem' }}>Login</button>
              )}
            </div>
          </div>
        </nav>

        <div className="layout-container">
          <aside className="sidebar desktop-only">
            <div className="sidebar-logo">
              <img src="/logo.jpg" alt="Champions HQ Logo" className="logo-img" />
              <h2>Champions HQ</h2>
            </div>
            
            <nav className="sidebar-nav">
              <NavItem to="/" icon={HomeIcon}>{t('nav.home', 'Início')}</NavItem>
              <NavItem to="/collection" icon={Layers}>{t('nav.collection')}</NavItem>
              <NavItem to="/decks" icon={Zap}>{t('nav.decks')}</NavItem>
              <NavItem to="/randomizer" icon={Shuffle}>{t('nav.randomizer')}</NavItem>
              <NavItem to="/tracker" icon={Activity}>{t('nav.tracker')}</NavItem>
              <NavItem to="/history" icon={Archive}>{t('nav.history')}</NavItem>
              <NavItem to="/dashboard" icon={BarChart2}>{t('nav.dashboard')}</NavItem>
              <NavItem to="/builder" icon={Wrench}>Builder</NavItem>
              <NavItem to="/campaign" icon={Map}>{t('nav.campaign')}</NavItem>
              <NavItem to="/rules" icon={BookOpen}>Regras</NavItem>
            </nav>

          </aside>

          <div className="main-wrapper">
            <header className="topbar desktop-only" style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', padding: '24px 32px 0 32px', gap: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)' }}>
                <Globe size={18} />
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
                onClick={() => setShowSettings(true)}
                style={{ background: 'transparent', color: 'var(--text-secondary)', padding: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                title="Configurações (Temas e SFX)"
              >
                <Settings size={22} />
              </button>

              {user ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ fontSize: '0.8rem', color: '#86efac' }}>{syncStatus === 'syncing' ? '...' : 'OK'}</span>
                  <img src={user.photoURL} alt="User" style={{ width: 32, height: 32, borderRadius: '50%' }} title={user.displayName} />
                  <button onClick={logout} className="btn-secondary" style={{ padding: '6px 12px', fontSize: '0.85rem' }}>Sair</button>
                </div>
              ) : (
                <button onClick={loginWithGoogle} className="btn-primary" style={{ padding: '8px 16px', fontSize: '0.9rem' }}>
                  Login
                </button>
              )}
            </header>

            <main className="main-content container">
              <React.Suspense fallback={<LoadingSpinner />}>
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
              </React.Suspense>
            </main>

            <footer className="app-footer">
              {isMobileMenuOpen && (
                <div className="mobile-menu">
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
                </div>
              )}
              <div className="container" style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem', padding: '32px 24px', borderTop: '1px solid var(--surface-border)', marginTop: 'auto' }}>
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
          </div>
        </div>

        {/* BOTAO FLUTUANTE MOBILE */}
        <button className="mobile-menu-btn mobile-only" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>

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
