# Planejamento: Menu Lateral (Desktop) estilo Legendary HQ

A requisição é transformar o menu de navegação do `marvel-champions-helper` em um menu lateral (Sidebar) no Desktop, similar ao `marvel-legendary-randomizer`, mantendo o menu responsivo/inferior no Mobile.

## 1. Mudança na Estrutura (App.jsx)
Atualmente o `<nav className="navbar">` fica no topo e engloba o logo, links e botões. A estrutura principal do `app-layout` será alterada para:

```jsx
<div className="app-layout">
  <ReloadPrompt />
  {showInstall && ( /* banner */ )}
  
  {/* NAVBAR MOBILE (Topo) */}
  <nav className="navbar mobile-only">
    <div className="nav-content">
      <Link to="/" className="brand" onClick={() => setIsMobileMenuOpen(false)}>
        <img src="/logo.jpg" alt="Logo" style={{ width: '32px', height: '32px', borderRadius: '8px' }} />
        <span>Champions HQ</span>
      </Link>
      <button className="mobile-menu-btn" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
        {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
      </button>
    </div>
  </nav>

  <div className="layout-container">
    {/* SIDEBAR DESKTOP (Esquerda) */}
    <aside className="sidebar desktop-only">
      <div className="sidebar-logo">
        <img src="/logo.jpg" alt="Champions HQ Logo" className="logo-img" />
        <h2>Champions HQ</h2>
      </div>
      
      <nav className="sidebar-nav">
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

      <div className="sidebar-footer">
        {/* Selector de idioma, configurações (engrenagem) e Botão de Login/Logout */}
      </div>
    </aside>

    {/* CONTEÚDO PRINCIPAL (Direita) */}
    <div className="main-wrapper">
      <main className="main-content container">
        <Routes>...</Routes>
      </main>
      
      <footer className="app-footer">...</footer>
    </div>
  </div>

  {/* MENU MOBILE EXPANDIDO (Botton/Overlay) - Mantém o atual */}
</div>
```

## 2. Ajustes CSS (index.css)
Os estilos refletirão o visual hi-tech/glass do Legendary HQ.

```css
/* Container de Layout */
.layout-container {
  display: flex;
  min-height: 100vh;
  width: 100%;
}

/* Sidebar (Desktop) */
.sidebar {
  width: 280px;
  background: rgba(15, 23, 42, 0.98);
  border-right: 1px solid var(--surface-border);
  padding: 2rem 1.5rem;
  display: flex;
  flex-direction: column;
  position: sticky;
  top: 0;
  height: 100vh;
  overflow-y: auto;
}

.sidebar-logo {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  padding-bottom: 2rem;
  border-bottom: 1px solid var(--surface-border);
  text-align: center;
  margin-bottom: 2rem;
}

.sidebar-logo .logo-img {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid var(--primary-color);
  box-shadow: 0 0 15px var(--primary-glow);
}

.sidebar-logo h2 {
  font-size: 1.4rem;
  color: white;
  text-transform: uppercase;
  letter-spacing: 1.5px;
}

.sidebar-nav {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  flex: 1;
}

.sidebar-nav .nav-link {
  background: transparent;
  color: var(--text-secondary);
  border: none;
  padding: 1rem 1.2rem;
  text-align: left;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.sidebar-nav .nav-link:hover {
  background: var(--surface-glass-hover);
  color: white;
}

.sidebar-nav .nav-link.active {
  background: var(--primary-color);
  color: white;
  box-shadow: 0 4px 12px var(--primary-glow);
}

.main-wrapper {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
}

/* Esconder Navbar atual no Desktop */
@media (min-width: 769px) {
  .navbar.mobile-only { display: none !important; }
}

/* Esconder Sidebar no Mobile */
@media (max-width: 768px) {
  .sidebar.desktop-only { display: none !important; }
  .layout-container { flex-direction: column; }
}
```

## Passo a Passo da Execução:
1. Atualizar o `App.jsx` com a nova hierarquia (Sidebar à esquerda, conteúdo à direita), além de manter o Navbar simplificado exclusivo para mobile.
2. Adicionar as regras de CSS referentes à `.sidebar`, `.layout-container` e `.sidebar-logo` no `index.css`.
3. Ajustar as media queries existentes para garantir que o menu superior continue existindo em celulares.
4. Fazer QA e refinar alinhamento (especialmente botão de settings e idioma no final do sidebar).

Aguardando sua aprovação para iniciar a implementação!
