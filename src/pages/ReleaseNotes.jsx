import React from 'react';
import { Tag, CheckCircle2, Star, Sparkles, Rocket } from 'lucide-react';

const releases = [
  {
    version: "1.3.0",
    date: "13 de Julho de 2026",
    title: "Performance & Robustez (The Quality Update) ⚡",
    description: "Nesta grande atualização invisível aos olhos mas sentida no uso, reescrevemos o coração do aplicativo. O app agora carrega muito mais rápido, consome menos memória e blinda seus dados com regras estritas.",
    highlights: [
      {
        icon: <Rocket size={18} className="text-primary" />,
        text: "Code-Splitting e Lazy Loading: O aplicativo foi quebrado em dezenas de pequenos pedaços (Chunks). Você só baixa o código da tela em que está navegando, e não mais o app inteiro de uma só vez, garantindo loadings instantâneos."
      },
      {
        icon: <CheckCircle2 size={18} className="text-protection" />,
        text: "Zero Memory Leaks no Multiplayer: O código de conexão em tempo real (P2P/WebRTC) foi reescrito, fechando as pontas que ficavam abertas caso você mudasse de tela, melhorando a estabilidade da partida conjunta."
      },
      {
        icon: <Tag size={18} className="text-secondary" />,
        text: "Proteção de Dados na Nuvem (Security Rules): O servidor do banco de dados agora proíbe criptograficamente qualquer tentativa de leitura ou edição dos seus saves por outras pessoas. Seus dados estão 100% blindados pela sua conta Google."
      }
    ],
    features: [
      "Substituição de alertas brancos de erro antigos por belas Notificações em Toast animadas.",
      "Otimização do PWA e Cache das centenas de decks offline.",
      "Redução no peso da aplicação com remoção de lixo estático e importações atrasadas (Lazy load de idiomas)."
    ]
  },
  {
    version: "1.2.1",
    date: "10 de Julho de 2026",
    title: "Hotfix: Menu Mobile Flutuante 🩹",
    description: "Correção rápida para restaurar o botão flutuante de navegação no celular.",
    highlights: [],
    features: [
      "Restauração do botão flutuante no canto inferior esquerdo para abrir o menu no celular, que havia sido ocultado na alteração de layout."
    ]
  },
  {
    version: "1.2.0",
    date: "10 de Julho de 2026",
    title: "Nova Sidebar Desktop & Navegação 🖥️",
    description: "Renovação completa da estrutura de navegação para a versão desktop, otimizando o uso do espaço e melhorando a usabilidade.",
    highlights: [
      {
        icon: <Sparkles size={18} className="text-primary" />,
        text: "Sidebar Premium: O antigo menu superior no PC foi transformado em uma Sidebar lateral estilo Glassmorphism, mantendo os links sempre acessíveis sem roubar espaço vertical."
      },
      {
        icon: <Tag size={18} className="text-secondary" />,
        text: "Menu Superior Limpo: Os controles de idioma, temas e acesso à nuvem (Login) foram movidos de forma flutuante para o canto superior direito da tela."
      }
    ],
    features: [
      "Integração de CSS puro avançado garantindo que a barra mobile e desktop nunca entrem em conflito.",
      "Melhorias de alinhamento visual e responsividade total."
    ]
  },
  {
    version: "1.1.1",
    date: "10 de Julho de 2026",
    title: "Melhorias de Usabilidade Mobile 📱",
    description: "Foco no refinamento de UI e UX para telas menores, aprimorando a navegação e a exibição do Tracker.",
    highlights: [
      {
        icon: <Sparkles size={18} className="text-primary" />,
        text: "Menu Mobile Flutuante: O menu no celular agora funciona através de um belo botão flutuante no canto esquerdo da tela, economizando espaço no cabeçalho e facilitando o acesso com apenas uma mão."
      },
      {
        icon: <CheckCircle2 size={18} className="text-protection" />,
        text: "Tracker Adaptativo: Resolvido o problema de quebra de layout e invasão de blocos no card de Heróis do Tracker no celular. No desktop o input agora tem tamanho máximo para não ficar colado nas bordas."
      }
    ],
    features: [
      "Ajuste pixel-perfect (alinhamento Flexbox) no botão de configurações do cabeçalho.",
      "Correção de Login no PC: Adicionado fallback automático via redirecionamento caso o navegador bloqueie o popup do Google.",
      "Ajuste visual (Respiro): Restaurado o espaçamento lateral no conteúdo principal e no rodapé em telas de celular."
    ]
  },
  {
    version: "1.1.0",
    date: "08 de Julho de 2026",
    title: "A Grande Atualização Global & Competitiva 🏆",
    description: "Nesta atualização massiva, o Champions HQ rompe as fronteiras e traz competitividade real para as suas partidas.",
    highlights: [
      {
        icon: <Star size={18} className="text-justice" />,
        text: "Modo Ranqueado & XP: Suas partidas agora geram Pontos de Prestígio (XP) baseados no resultado e dificuldade, subindo o seu Rank de Novato até Herói!"
      },
      {
        icon: <Sparkles size={18} className="text-primary" />,
        text: "Internacionalização (i18n): O aplicativo agora fala múltiplos idiomas (PT, EN, ES) com detecção automática e seletor na barra superior."
      },
      {
        icon: <CheckCircle2 size={18} className="text-protection" />,
        text: "PWA Nativo Aperfeiçoado: Transformamos a experiência offline. Instale o app nativamente no celular ou desktop via prompt automático com novo manifesto."
      }
    ],
    features: [
      "Dashboard Avançado: Novas métricas de duração, rodadas, dano médio e rankings de Top Heróis/Vilões.",
      "Histórico Aprimorado: Novo layout no histórico exibindo o XP ganho/perdido por partida.",
      "Correções internas de linting e segurança na stack (Vite + React)."
    ]
  },
  {
    version: "1.0.1",
    date: "07 de Julho de 2026",
    title: "Hotfix: Atualização de Cache do App 🩹",
    description: "Pequena atualização para corrigir um problema de usabilidade na forma como o aplicativo lidava com o cache offline do navegador.",
    highlights: [
      {
        icon: <CheckCircle2 size={18} className="text-protection" />,
        text: "PWA Reload Prompt: Adicionado um aviso na tela permitindo atualizar a versão do aplicativo de forma segura, sem que o usuário precise deletar o cache do navegador (e arriscar perder seus dados locais)."
      }
    ],
    features: []
  },
  {
    version: "1.0.0",
    date: "07 de Julho de 2026",
    title: "O Lançamento Oficial (Full Release) 🚀",
    description: "Após os testes nas versões beta, o Champions HQ atinge sua versão 1.0.0 com as features mais robustas e definitivas para suas partidas de mesa.",
    highlights: [
      {
        icon: <Star size={18} className="text-justice" />,
        text: "Tracker Multiplayer P2P: Conecte múltiplos celulares na mesma partida lendo um simples QR Code. Sincronização de dano e ameaça em tempo real via WebRTC."
      },
      {
        icon: <CheckCircle2 size={18} className="text-protection" />,
        text: "Modo Campanha: Agora você pode criar e registrar campanhas em andamento, acompanhando experiência (XP) e status dos heróis."
      },
      {
        icon: <Tag size={18} className="text-secondary" />,
        text: "Dashboard de Estatísticas: Analise sua taxa de vitórias, acompanhe seus heróis mais jogados e descubra contra quais vilões você tem mais dificuldade."
      },
      {
        icon: <Rocket size={18} className="text-primary" />,
        text: "Importação e Exportação de Decks: Importe decks diretamente usando links do MarvelCDB e exporte suas listas gerando um QR Code para os amigos."
      }
    ],
    features: [
      "Central de Regras expandida: Pesquisa rápida (Spotlight) e visualizador de Manuais Oficiais em PDF integrados no app.",
      "Temas e SFX: Trilha de efeitos sonoros imersivos e temas baseados nos Aspectos (Agressividade, Justiça, Liderança, Proteção).",
      "Melhoria drástica na responsividade do Tracker no celular deitado (modo Paisagem) utilizando CSS Flexbox.",
      "Padronização de Layout utilizando novos Modais Premium com arquitetura Glassmorphism."
    ]
  },
  {
    version: "0.3.0",
    date: "03 de Julho de 2026",
    title: "Tracker Redesign e Automação de Decks ⚙️",
    description: "Foco na melhoria da usabilidade durante a partida e integração com os criadores de decks.",
    highlights: [
      {
        icon: <Sparkles size={18} className="text-primary" />,
        text: "Redesign do Tracker: Nova interface com painéis dedicados e bem divididos para o Vilão, Ameaça Principal e Contadores Extras."
      },
      {
        icon: <Star size={18} className="text-justice" />,
        text: "Automação de Raspagem Diária: Novo bot no GitHub Actions que atualiza o banco de dados do app diariamente com os novos decks do MarvelCDB."
      }
    ],
    features: [
      "Lançamento Manual no Histórico: Adicionada a opção de inserir partidas antigas retroativamente no histórico.",
      "Filtros de Coleção: O Banco de Decks agora permite filtrar para exibir apenas listas onde você possui todas as cartas físicas."
    ]
  },
  {
    version: "0.2.0",
    date: "02 de Julho de 2026",
    title: "Modo Offline (PWA) 📱",
    description: "Transformando o site web em um aplicativo nativo no celular.",
    highlights: [
      {
        icon: <CheckCircle2 size={18} className="text-protection" />,
        text: "Progressive Web App (PWA): O sistema agora pode ser instalado no iOS ou Android e funciona 100% offline."
      }
    ],
    features: [
      "Otimização extrema de Cache (Service Workers) para permitir carregamento rápido do arquivo de banco de decks (JSONL).",
      "Adicionado o arquivo de contexto GEMINI.md para padronização de prompts dos robôs."
    ]
  },
  {
    version: "0.1.0",
    date: "Lançamento Inicial",
    title: "O Início da Jornada 🦸‍♂️",
    description: "O primeiro deploy do Champions HQ no Vercel com as funcionalidades básicas.",
    highlights: [
      {
        icon: <Rocket size={18} className="text-primary" />,
        text: "Base Completa: Minha Coleção, Banco de Decks, Gerador de Caos, Histórico Básico e Guia de Regras inicial."
      }
    ],
    features: [
      "Construção inicial do Layout Mobile-First.",
      "Importação manual estática da base do MarvelCDB."
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
