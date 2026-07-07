import React from 'react';
import { Tag, CheckCircle2, Star, Sparkles, Rocket } from 'lucide-react';

const releases = [
  {
    version: "1.0.0",
    date: "07 de Julho de 2026",
    title: "O Lançamento Oficial (Full Release) 🚀",
    description: "Após muitos testes e feedbacks incríveis da comunidade desde a nossa primeira versão básica, o Champions HQ atinge sua versão 1.0.0 oficial! Compilamos todo o histórico de atualizações para entregar a verdadeira central de operações definitiva para as suas partidas.",
    highlights: [
      {
        icon: <Sparkles size={18} className="text-primary" />,
        text: "PWA (Progressive Web App): O app agora pode ser instalado no seu celular ou PC e funciona 100% offline."
      },
      {
        icon: <Star size={18} className="text-justice" />,
        text: "Tracker Multiplayer P2P: Conecte múltiplos celulares na mesma partida lendo um simples QR Code. A sincronização de dano e ameaça ocorre em tempo real via WebRTC (sem atrasos e sem servidor central)."
      },
      {
        icon: <CheckCircle2 size={18} className="text-protection" />,
        text: "Modo Campanha & Histórico: Agora você pode registrar campanhas em andamento (acompanhando XP e status) e adicionar partidas antigas retroativamente de forma manual no seu Histórico."
      },
      {
        icon: <Tag size={18} className="text-secondary" />,
        text: "Dashboard de Estatísticas: Analise sua taxa de vitórias, acompanhe seus heróis mais jogados e descubra contra quais vilões você tem mais dificuldade."
      },
      {
        icon: <Rocket size={18} className="text-primary" />,
        text: "Importação e Exportação de Decks: Importe decks diretamente usando links do MarvelCDB e exporte suas listas gerando um QR Code para compartilhar com a mesa."
      }
    ],
    features: [
      "Layout totalmente refatorado com arquitetura Glassmorphism e novos Modais Premium.",
      "Redesign completo do Tracker de Partida, agora com painéis dedicados para Vilão, Ameaça Principal e Contadores Extras.",
      "Melhoria drástica na responsividade do Tracker no celular deitado (modo Paisagem) utilizando CSS Flexbox.",
      "Central de Regras expandida: Pesquisa rápida (Spotlight) e visualizador de Manuais Oficiais em PDF integrados no app.",
      "Temas e SFX: Trilha de efeitos sonoros imersivos e temas baseados nos Aspectos (Agressividade, Justiça, Liderança, Proteção).",
      "Novo sistema automático (GitHub Actions) que varre o MarvelCDB diariamente buscando os últimos decks adicionados pela comunidade.",
      "Filtro inteligente no Banco de Decks para exibir apenas as listas que utilizam cartas que você possui na sua Coleção."
    ]
  }
];

const ReleaseNotes = () => {
  return (
    <div className="animate-fade-in" style={{ paddingBottom: '40px' }}>
      <div className="tracker-header">
        <h1 className="page-title">Notas de Atualização</h1>
        <p className="page-subtitle">Histórico de versões e novidades do Champions HQ</p>
      </div>

      <div style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '32px' }}>
        {releases.map((release, idx) => (
          <div key={idx} className="glass-panel" style={{ padding: '32px', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, width: '4px', height: '100%', background: 'var(--primary-color)' }}></div>
            
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ background: 'rgba(230,36,41,0.2)', color: 'var(--primary-color)', padding: '6px 16px', borderRadius: '24px', fontWeight: 'bold', fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Tag size={18} />
                  v{release.version}
                </span>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>{release.date}</span>
              </div>
            </div>

            <h2 style={{ fontSize: '1.5rem', marginBottom: '12px', color: 'white' }}>{release.title}</h2>
            <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6', marginBottom: '24px', fontSize: '1.05rem' }}>
              {release.description}
            </p>

            <div style={{ background: 'rgba(0,0,0,0.2)', padding: '24px', borderRadius: '12px', marginBottom: '24px' }}>
              <h3 style={{ color: 'white', fontSize: '1.1rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Star size={20} className="text-primary" /> Destaques
              </h3>
              <ul style={{ display: 'flex', flexDirection: 'column', gap: '16px', listStyle: 'none', padding: 0, margin: 0 }}>
                {release.highlights.map((h, i) => (
                  <li key={i} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                    <div style={{ marginTop: '2px' }}>{h.icon}</div>
                    <span style={{ color: 'var(--text-secondary)', lineHeight: '1.5' }}>{h.text}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 style={{ color: 'white', fontSize: '1.1rem', marginBottom: '12px' }}>Outras Melhorias</h3>
              <ul style={{ paddingLeft: '20px', color: 'var(--text-secondary)', lineHeight: '1.6', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {release.features.map((f, i) => (
                  <li key={i}>{f}</li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReleaseNotes;
