import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { BookOpen, Layers, Zap, Shuffle, Activity, Archive, Wrench, Map, Menu, X, Home as HomeIcon, BarChart2 } from 'lucide-react';

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
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstall, setShowInstall] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
          <div className="nav-content" style={{ padding: '0 32px', width: '100%', maxWidth: '1920px', margin: '0 auto' }}>
            
            {/* Lado Esquerdo - Logo */}
            <div className="nav-left">
              <Link to="/" className="brand" onClick={() => setIsMobileMenuOpen(false)}>
                <img src="/logo.jpg" alt="Logo" style={{ width: '32px', height: '32px', borderRadius: '8px' }} />
                <span>Champions HQ</span>
              </Link>
            </div>
            
            {/* Lado Direito - Menu */}
            <div className="nav-right" style={{ display: 'flex', alignItems: 'center' }}>
              <div className="nav-links desktop-only">
                <NavItem to="/collection" icon={Layers}>Coleção</NavItem>
                <NavItem to="/decks" icon={Zap}>Decks</NavItem>
                <NavItem to="/randomizer" icon={Shuffle}>Gerador</NavItem>
                <NavItem to="/tracker" icon={Activity}>Tracker</NavItem>
                <NavItem to="/history" icon={Archive}>Histórico</NavItem>
                <NavItem to="/dashboard" icon={BarChart2}>Estatísticas</NavItem>
                <NavItem to="/builder" icon={Wrench}>Builder</NavItem>
                <NavItem to="/campaign" icon={Map}>Campanha</NavItem>
                <NavItem to="/rules" icon={BookOpen}>Regras</NavItem>
              </div>

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
              <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="mobile-link"><HomeIcon size={20} /> Início</Link>
              <Link to="/tracker" onClick={() => setIsMobileMenuOpen(false)} className="mobile-link"><Activity size={20} /> Tracker de Partida</Link>
              <Link to="/builder" onClick={() => setIsMobileMenuOpen(false)} className="mobile-link"><Wrench size={20} /> Deck Builder</Link>
              <Link to="/campaign" onClick={() => setIsMobileMenuOpen(false)} className="mobile-link"><Map size={20} /> Campanhas</Link>
              <Link to="/randomizer" onClick={() => setIsMobileMenuOpen(false)} className="mobile-link"><Shuffle size={20} /> Gerador de Caos</Link>
              <Link to="/history" onClick={() => setIsMobileMenuOpen(false)} className="mobile-link"><Archive size={20} /> Histórico</Link>
              <Link to="/dashboard" onClick={() => setIsMobileMenuOpen(false)} className="mobile-link"><BarChart2 size={20} /> Estatísticas</Link>
              <Link to="/decks" onClick={() => setIsMobileMenuOpen(false)} className="mobile-link"><Zap size={20} /> Banco de Decks</Link>
              <Link to="/collection" onClick={() => setIsMobileMenuOpen(false)} className="mobile-link"><Layers size={20} /> Coleção</Link>
              <Link to="/rules" onClick={() => setIsMobileMenuOpen(false)} className="mobile-link"><BookOpen size={20} /> Guia de Regras</Link>
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
          </Routes>
        </main>

        <footer className="app-footer">
          <div className="container" style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem', padding: '32px 0', borderTop: '1px solid var(--surface-border)', marginTop: 'auto' }}>
            <p><strong>Champions HQ</strong> &copy; {new Date().getFullYear()}. Desenvolvido por Fãs, para Fãs.</p>
            <p style={{ fontSize: '0.75rem', marginTop: '12px', opacity: 0.6, maxWidth: '600px', margin: '12px auto 0' }}>
              Marvel Champions e todos os personagens, textos de cartas e imagens são de propriedade intelectual da Marvel e Fantasy Flight Games.<br/>
              Este aplicativo não possui fins lucrativos e não é afiliado de forma alguma à Marvel ou FFG.
            </p>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;
