import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Layers, Zap, Shuffle, Activity, Archive, Wrench, Map, BarChart2 } from 'lucide-react';

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

export default Home;
