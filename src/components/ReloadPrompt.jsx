import React from 'react';
import { useRegisterSW } from 'virtual:pwa-register/react';
import { RefreshCw, X } from 'lucide-react';

const ReloadPrompt = () => {
  const {
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegistered(r) {
      // Opcional: verificar periodicamente se há atualização (a cada hora)
      if (r) {
        setInterval(() => {
          r.update();
        }, 60 * 60 * 1000);
      }
    },
    onRegisterError(error) {
      console.error('SW registration error', error);
    },
  });

  if (!needRefresh) return null;

  return (
    <div className="animate-fade-in" style={{
      position: 'fixed',
      bottom: '24px',
      right: '24px',
      background: 'linear-gradient(135deg, var(--justice-color), #f57f17)',
      color: '#000',
      padding: '16px 24px',
      borderRadius: '16px',
      boxShadow: '0 8px 30px rgba(251, 192, 45, 0.4)',
      zIndex: 9999,
      display: 'flex',
      flexDirection: 'column',
      gap: '12px',
      maxWidth: '350px'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h4 style={{ margin: 0, fontWeight: 'bold', fontSize: '1.05rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <RefreshCw size={18} /> Nova Versão Disponível!
        </h4>
        <button onClick={() => setNeedRefresh(false)} style={{ background: 'transparent', border: 'none', color: '#000', cursor: 'pointer', opacity: 0.7 }}>
          <X size={20} />
        </button>
      </div>
      
      <p style={{ margin: 0, fontSize: '0.9rem', lineHeight: '1.4', opacity: 0.9 }}>
        Uma nova atualização do Champions HQ está pronta. Atualize para ver os novos recursos (seus dados locais estão salvos).
      </p>
      
      <button 
        onClick={() => updateServiceWorker(true)}
        style={{
          background: '#000',
          color: 'white',
          border: 'none',
          padding: '10px',
          borderRadius: '8px',
          fontWeight: 'bold',
          cursor: 'pointer',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '8px',
          marginTop: '4px'
        }}
      >
        <RefreshCw size={16} /> Atualizar Agora
      </button>
    </div>
  );
};

export default ReloadPrompt;
