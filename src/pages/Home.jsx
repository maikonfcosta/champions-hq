import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Layers, Zap, Shuffle, Activity, Archive, Wrench, Map, BarChart2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const Home = () => {
  const { t } = useTranslation();

  return (
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
          {t('home.desc')}
        </p>
      </div>
      
      <div className="home-grid">
        <Link to="/collection" className="glass-panel home-card">
          <Layers size={40} className="card-icon text-primary" />
          <h3 className="home-card-title">{t('home.collection_title')}</h3>
          <p className="home-card-text">{t('home.collection_desc')}</p>
        </Link>
        
        <Link to="/decks" className="glass-panel home-card">
          <Zap size={40} className="card-icon text-justice" />
          <h3 className="home-card-title">{t('home.decks_title')}</h3>
          <p className="home-card-text">{t('home.decks_desc')}</p>
        </Link>
        
        <Link to="/tracker" className="glass-panel home-card">
          <Activity size={40} className="card-icon" style={{ color: '#fbc02d' }} />
          <h3 className="home-card-title">{t('home.tracker_title')}</h3>
          <p className="home-card-text">{t('home.tracker_desc')}</p>
        </Link>
        
        <Link to="/randomizer" className="glass-panel home-card">
          <Shuffle size={40} className="card-icon text-secondary" />
          <h3 className="home-card-title">{t('home.randomizer_title')}</h3>
          <p className="home-card-text">{t('home.randomizer_desc')}</p>
        </Link>
        
        <Link to="/history" className="glass-panel home-card">
          <Archive size={40} className="card-icon text-protection" />
          <h3 className="home-card-title">{t('home.history_title')}</h3>
          <p className="home-card-text">{t('home.history_desc')}</p>
        </Link>

        <Link to="/dashboard" className="glass-panel home-card">
          <BarChart2 size={40} className="card-icon text-primary" />
          <h3 className="home-card-title">{t('home.dashboard_title')}</h3>
          <p className="home-card-text">{t('home.dashboard_desc')}</p>
        </Link>

        <Link to="/builder" className="glass-panel home-card">
          <Wrench size={40} className="card-icon text-justice" />
          <h3 className="home-card-title">{t('home.builder_title')}</h3>
          <p className="home-card-text">{t('home.builder_desc')}</p>
        </Link>
        
        <Link to="/campaign" className="glass-panel home-card">
          <Map size={40} className="card-icon" style={{ color: '#c084fc' }} />
          <h3 className="home-card-title">{t('home.campaign_title')}</h3>
          <p className="home-card-text">{t('home.campaign_desc')}</p>
        </Link>
        
        <Link to="/rules" className="glass-panel home-card">
          <BookOpen size={40} className="card-icon text-protection" />
          <h3 className="home-card-title">{t('home.rules_title')}</h3>
          <p className="home-card-text">{t('home.rules_desc')}</p>
        </Link>
      </div>
    </div>
  );
};

export default Home;
