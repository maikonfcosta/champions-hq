import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', padding: '20px', textAlign: 'center' }}>
          <h1 style={{ color: '#ef4444' }}>Ocorreu um erro inesperado</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Nossa equipe de heróis já foi notificada.</p>
          <button 
            className="btn-primary" 
            style={{ marginTop: '20px' }}
            onClick={() => {
              this.setState({ hasError: false });
              window.location.reload();
            }}
          >
            Tentar Novamente
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
