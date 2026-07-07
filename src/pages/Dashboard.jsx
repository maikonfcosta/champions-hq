import React, { useState, useEffect } from 'react';
import { BarChart2, TrendingUp, TrendingDown, Swords, ShieldAlert, Award } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const [history, setHistory] = useState([]);
  const [stats, setStats] = useState({
    totalGames: 0,
    wins: 0,
    losses: 0,
    winRate: 0,
    aspectStats: {},
    topHero: null,
    topVillain: null,
    deadliestVillain: null,
  });

  useEffect(() => {
    const saved = localStorage.getItem('mc_match_history');
    if (saved) {
      const parsedHistory = JSON.parse(saved);
      setHistory(parsedHistory);
      calculateStats(parsedHistory);
    }
  }, []);

  const calculateStats = (data) => {
    if (data.length === 0) return;

    const totalGames = data.length;
    const wins = data.filter(h => h.result === 'Vitória').length;
    const losses = totalGames - wins;
    const winRate = Math.round((wins / totalGames) * 100);

    const aspectMap = {
      'Agressividade': { color: 'var(--aspect-aggression)', plays: 0, wins: 0 },
      'Justiça': { color: 'var(--aspect-justice)', plays: 0, wins: 0 },
      'Liderança': { color: 'var(--aspect-leadership)', plays: 0, wins: 0 },
      'Proteção': { color: 'var(--aspect-protection)', plays: 0, wins: 0 },
      'Pool': { color: '#e2439a', plays: 0, wins: 0 },
      'Básico': { color: '#64748b', plays: 0, wins: 0 },
    };

    const heroStats = {};
    const villainStats = {};

    data.forEach(match => {
      // Aspect
      if (aspectMap[match.aspect]) {
        aspectMap[match.aspect].plays += 1;
        if (match.result === 'Vitória') aspectMap[match.aspect].wins += 1;
      }

      // Hero
      if (!heroStats[match.hero]) {
        heroStats[match.hero] = { plays: 0, wins: 0 };
      }
      heroStats[match.hero].plays += 1;
      if (match.result === 'Vitória') heroStats[match.hero].wins += 1;

      // Villain
      if (!villainStats[match.villain]) {
        villainStats[match.villain] = { plays: 0, losses: 0 };
      }
      villainStats[match.villain].plays += 1;
      if (match.result === 'Derrota') villainStats[match.villain].losses += 1;
    });

    // Top Hero (most played, tie-breaker wins)
    let topHero = null;
    let maxHeroPlays = 0;
    for (const [name, s] of Object.entries(heroStats)) {
      if (s.plays > maxHeroPlays || (s.plays === maxHeroPlays && topHero && s.wins > topHero.wins)) {
        maxHeroPlays = s.plays;
        topHero = { name, ...s };
      }
    }

    // Top Villain (most played)
    let topVillain = null;
    let maxVillainPlays = 0;
    for (const [name, s] of Object.entries(villainStats)) {
      if (s.plays > maxVillainPlays) {
        maxVillainPlays = s.plays;
        topVillain = { name, ...s };
      }
    }

    // Deadliest Villain (highest loss rate, min 2 plays ideally, but we'll take highest losses)
    let deadliestVillain = null;
    let maxVillainLosses = 0;
    for (const [name, s] of Object.entries(villainStats)) {
      if (s.losses > maxVillainLosses) {
        maxVillainLosses = s.losses;
        deadliestVillain = { name, ...s };
      }
    }

    setStats({
      totalGames,
      wins,
      losses,
      winRate,
      aspectStats: aspectMap,
      topHero,
      topVillain,
      deadliestVillain
    });
  };

  if (history.length === 0) {
    return (
      <div className="animate-fade-in container" style={{ textAlign: 'center', marginTop: '60px' }}>
        <BarChart2 size={64} style={{ color: 'var(--text-muted)', marginBottom: '24px' }} />
        <h2 className="page-title">Sem Estatísticas Ainda</h2>
        <p className="page-subtitle" style={{ maxWidth: '600px', margin: '0 auto 32px' }}>
          Jogue algumas partidas e registre-as no histórico ou no Randomizer para ver seu desempenho aqui!
        </p>
        <Link to="/randomizer" className="btn-primary" style={{ display: 'inline-block' }}>Gerar Primeira Partida</Link>
      </div>
    );
  }

  return (
    <div className="animate-fade-in container">
      <div className="page-header" style={{ marginBottom: '32px' }}>
        <div>
          <h2 className="page-title">Dashboard</h2>
          <p className="page-subtitle">Analise seu desempenho e estatísticas gerais de combate.</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px', marginBottom: '32px' }}>
        
        <div className="glass-panel" style={{ padding: '24px', textAlign: 'center', borderTop: '4px solid #2b82d9' }}>
          <Swords size={32} color="#2b82d9" style={{ margin: '0 auto 12px' }} />
          <p style={{ color: 'var(--text-secondary)', textTransform: 'uppercase', fontSize: '0.85rem', fontWeight: 'bold' }}>Partidas Jogadas</p>
          <h3 style={{ fontSize: '2.5rem', margin: '8px 0 0' }}>{stats.totalGames}</h3>
        </div>
        
        <div className="glass-panel" style={{ padding: '24px', textAlign: 'center', borderTop: '4px solid var(--aspect-protection)' }}>
          <TrendingUp size={32} color="var(--aspect-protection)" style={{ margin: '0 auto 12px' }} />
          <p style={{ color: 'var(--text-secondary)', textTransform: 'uppercase', fontSize: '0.85rem', fontWeight: 'bold' }}>Vitórias</p>
          <h3 style={{ fontSize: '2.5rem', margin: '8px 0 0', color: 'var(--aspect-protection)' }}>{stats.wins}</h3>
        </div>

        <div className="glass-panel" style={{ padding: '24px', textAlign: 'center', borderTop: '4px solid #ef4444' }}>
          <TrendingDown size={32} color="#ef4444" style={{ margin: '0 auto 12px' }} />
          <p style={{ color: 'var(--text-secondary)', textTransform: 'uppercase', fontSize: '0.85rem', fontWeight: 'bold' }}>Derrotas</p>
          <h3 style={{ fontSize: '2.5rem', margin: '8px 0 0', color: '#ef4444' }}>{stats.losses}</h3>
        </div>

        <div className="glass-panel" style={{ padding: '24px', textAlign: 'center', borderTop: '4px solid var(--primary-color)' }}>
          <Award size={32} color="var(--primary-color)" style={{ margin: '0 auto 12px' }} />
          <p style={{ color: 'var(--text-secondary)', textTransform: 'uppercase', fontSize: '0.85rem', fontWeight: 'bold' }}>Win Rate</p>
          <h3 style={{ fontSize: '2.5rem', margin: '8px 0 0' }}>{stats.winRate}%</h3>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px', marginBottom: '32px' }}>
        <div className="glass-panel" style={{ padding: '24px' }}>
          <h3 style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <BarChart2 size={20} className="text-primary" /> Desempenho por Aspecto
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {Object.entries(stats.aspectStats).map(([aspect, data]) => {
              if (data.plays === 0) return null;
              const rate = Math.round((data.wins / data.plays) * 100);
              return (
                <div key={aspect}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.9rem' }}>
                    <span style={{ fontWeight: 'bold', color: data.color }}>{aspect}</span>
                    <span style={{ color: 'var(--text-secondary)' }}>{data.wins}V / {data.plays} ({rate}%)</span>
                  </div>
                  <div style={{ width: '100%', background: 'rgba(255,255,255,0.1)', height: '8px', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ width: `${rate}%`, background: data.color, height: '100%', transition: 'width 1s ease-out' }}></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ShieldAlert size={20} className="text-secondary" /> Destaques
          </h3>
          
          {stats.topHero && (
            <div style={{ background: 'rgba(255,255,255,0.05)', padding: '16px', borderRadius: '12px', borderLeft: '4px solid #2b82d9' }}>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', textTransform: 'uppercase', marginBottom: '4px' }}>Herói Favorito</p>
              <h4 style={{ fontSize: '1.2rem', margin: '0 0 8px 0' }}>{stats.topHero.name}</h4>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Jogado {stats.topHero.plays} vezes ({Math.round((stats.topHero.wins / stats.topHero.plays) * 100)}% Win Rate)</p>
            </div>
          )}

          {stats.deadliestVillain && (
            <div style={{ background: 'rgba(255,255,255,0.05)', padding: '16px', borderRadius: '12px', borderLeft: '4px solid #ef4444' }}>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', textTransform: 'uppercase', marginBottom: '4px' }}>Nêmesis (Vilão Mais Letal)</p>
              <h4 style={{ fontSize: '1.2rem', margin: '0 0 8px 0' }}>{stats.deadliestVillain.name}</h4>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Causou {stats.deadliestVillain.losses} derrotas pra você.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
