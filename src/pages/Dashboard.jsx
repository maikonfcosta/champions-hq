import React, { useState, useEffect } from 'react';
import { BarChart2, TrendingUp, TrendingDown, Swords, ShieldAlert, Award, Clock, Hash, Zap, Shield, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { calculateMatchXP, getRankInfo } from '../utils/ranking';

export default function Dashboard() {
  const [history, setHistory] = useState([]);
  const [stats, setStats] = useState({
    totalGames: 0,
    wins: 0,
    losses: 0,
    winRate: 0,
    aspectStats: {},
    topHeroes: [],
    topVillains: [],
    deadliestVillain: null,
    avgDuration: 0,
    avgRounds: 0,
    avgDamagePerRound: 0,
    totalXP: 0,
    rankInfo: null
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
    let totalDuration = 0;
    let durationCount = 0;
    let totalRounds = 0;
    let roundsCount = 0;
    let totalDamage = 0;
    let damageRounds = 0;
    let totalXP = 0;

    data.forEach(match => {
      // XP Calculation
      totalXP += calculateMatchXP(match.result, match.difficulty || 'Standard');

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

      // Advanced metrics
      if (match.duration) {
        totalDuration += Number(match.duration);
        durationCount += 1;
      }
      if (match.rounds) {
        totalRounds += Number(match.rounds);
        roundsCount += 1;
      }
      if (match.totalDamage && match.rounds) {
        totalDamage += Number(match.totalDamage);
        damageRounds += Number(match.rounds);
      }
    });

    const avgDuration = durationCount > 0 ? Math.round(totalDuration / durationCount) : 0;
    const avgRounds = roundsCount > 0 ? Math.round(totalRounds / roundsCount) : 0;
    const avgDamagePerRound = damageRounds > 0 ? (totalDamage / damageRounds).toFixed(1) : 0;

    // Top Heroes (top 3)
    const topHeroes = Object.entries(heroStats)
      .map(([name, s]) => ({ name, ...s }))
      .sort((a, b) => b.plays - a.plays || b.wins - a.wins)
      .slice(0, 3);

    // Top Villains (top 3)
    const topVillains = Object.entries(villainStats)
      .map(([name, s]) => ({ name, ...s }))
      .sort((a, b) => b.plays - a.plays)
      .slice(0, 3);

    // Deadliest Villain
    let deadliestVillain = null;
    let maxVillainLosses = 0;
    for (const [name, s] of Object.entries(villainStats)) {
      if (s.losses > maxVillainLosses) {
        maxVillainLosses = s.losses;
        deadliestVillain = { name, ...s };
      }
    }

    const rankInfo = getRankInfo(totalXP);

    setStats({
      totalGames,
      wins,
      losses,
      winRate,
      aspectStats: aspectMap,
      topHeroes,
      topVillains,
      deadliestVillain,
      avgDuration,
      avgRounds,
      avgDamagePerRound,
      totalXP,
      rankInfo
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

      {stats.rankInfo && (
        <div className="glass-panel" style={{ 
          marginBottom: '32px', 
          padding: '32px', 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          justifyContent: 'center',
          borderTop: `4px solid ${stats.rankInfo.color}`,
          background: `radial-gradient(circle at center, ${stats.rankInfo.color}15 0%, transparent 70%)`
        }}>
          {stats.rankInfo.icon === 'Shield' && <Shield size={64} color={stats.rankInfo.color} style={{ marginBottom: '16px' }} />}
          {stats.rankInfo.icon === 'Star' && <Star size={64} color={stats.rankInfo.color} style={{ marginBottom: '16px' }} />}
          {stats.rankInfo.icon === 'Award' && <Award size={64} color={stats.rankInfo.color} style={{ marginBottom: '16px' }} />}
          {stats.rankInfo.icon === 'Zap' && <Zap size={64} color={stats.rankInfo.color} style={{ marginBottom: '16px' }} />}
          
          <h2 style={{ fontSize: '2.5rem', color: stats.rankInfo.color, marginBottom: '8px', textAlign: 'center', textShadow: `0 0 20px ${stats.rankInfo.color}40` }}>{stats.rankInfo.title}</h2>
          <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', marginBottom: '24px' }}>{stats.totalXP} Pontos de Prestígio (XP)</p>
          
          {stats.rankInfo.nextXP && (
            <div style={{ width: '100%', maxWidth: '500px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.9rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Progresso para o próximo rank</span>
                <span style={{ fontWeight: 'bold', color: stats.rankInfo.color }}>{stats.totalXP} / {stats.rankInfo.nextXP} XP</span>
              </div>
              <div style={{ width: '100%', height: '12px', background: 'rgba(0,0,0,0.5)', borderRadius: '6px', overflow: 'hidden', boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.2)' }}>
                <div style={{ 
                  height: '100%', 
                  background: `linear-gradient(90deg, ${stats.rankInfo.color}80, ${stats.rankInfo.color})`, 
                  width: `${Math.min(100, Math.max(0, ((stats.totalXP - stats.rankInfo.minXP) / (stats.rankInfo.nextXP - stats.rankInfo.minXP)) * 100))}%`,
                  transition: 'width 1.5s cubic-bezier(0.4, 0, 0.2, 1)',
                  boxShadow: `0 0 10px ${stats.rankInfo.color}80`
                }} />
              </div>
            </div>
          )}
        </div>
      )}

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

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px', marginBottom: '32px' }}>
        
        <div className="glass-panel" style={{ padding: '24px', textAlign: 'center', borderTop: '4px solid #a855f7' }}>
          <Clock size={32} color="#a855f7" style={{ margin: '0 auto 12px' }} />
          <p style={{ color: 'var(--text-secondary)', textTransform: 'uppercase', fontSize: '0.85rem', fontWeight: 'bold' }}>Tempo Médio</p>
          <h3 style={{ fontSize: '2.5rem', margin: '8px 0 0' }}>{stats.avgDuration > 0 ? `${stats.avgDuration}m` : '-'}</h3>
        </div>
        
        <div className="glass-panel" style={{ padding: '24px', textAlign: 'center', borderTop: '4px solid #f97316' }}>
          <Hash size={32} color="#f97316" style={{ margin: '0 auto 12px' }} />
          <p style={{ color: 'var(--text-secondary)', textTransform: 'uppercase', fontSize: '0.85rem', fontWeight: 'bold' }}>Rodadas Médias</p>
          <h3 style={{ fontSize: '2.5rem', margin: '8px 0 0' }}>{stats.avgRounds > 0 ? stats.avgRounds : '-'}</h3>
        </div>

        <div className="glass-panel" style={{ padding: '24px', textAlign: 'center', borderTop: '4px solid #eab308' }}>
          <Zap size={32} color="#eab308" style={{ margin: '0 auto 12px' }} />
          <p style={{ color: 'var(--text-secondary)', textTransform: 'uppercase', fontSize: '0.85rem', fontWeight: 'bold' }}>Dano / Rodada</p>
          <h3 style={{ fontSize: '2.5rem', margin: '8px 0 0' }}>{stats.avgDamagePerRound > 0 ? stats.avgDamagePerRound : '-'}</h3>
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
          
          {stats.topHeroes && stats.topHeroes.length > 0 && (
            <div style={{ background: 'rgba(255,255,255,0.05)', padding: '16px', borderRadius: '12px', borderLeft: '4px solid #2b82d9' }}>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', textTransform: 'uppercase', marginBottom: '12px' }}>Heróis Mais Jogados (Top 3)</p>
              {stats.topHeroes.map((hero, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: i < stats.topHeroes.length - 1 ? '12px' : 0 }}>
                  <span>{i+1}. <strong>{hero.name}</strong></span>
                  <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>{hero.plays}x ({Math.round((hero.wins/hero.plays)*100)}% V)</span>
                </div>
              ))}
            </div>
          )}

          {stats.topVillains && stats.topVillains.length > 0 && (
            <div style={{ background: 'rgba(255,255,255,0.05)', padding: '16px', borderRadius: '12px', borderLeft: '4px solid #ef4444' }}>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', textTransform: 'uppercase', marginBottom: '12px' }}>Vilões Mais Enfrentados (Top 3)</p>
              {stats.topVillains.map((villain, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: i < stats.topVillains.length - 1 ? '12px' : 0 }}>
                  <span>{i+1}. <strong>{villain.name}</strong></span>
                  <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>{villain.plays}x ({Math.round((villain.losses/villain.plays)*100)}% D)</span>
                </div>
              ))}
            </div>
          )}

          {stats.deadliestVillain && stats.deadliestVillain.losses > 0 && (
            <div style={{ background: 'rgba(255,255,255,0.05)', padding: '16px', borderRadius: '12px', borderLeft: '4px solid #c084fc' }}>
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
