import React, { useState, useEffect } from 'react';
import { Save } from 'lucide-react';

export default function Campaign() {
  const [campaignData, setCampaignData] = useState(() => {
    const saved = localStorage.getItem('mc_campaign');
    return saved ? JSON.parse(saved) : { name: '', log: '' };
  });

  useEffect(() => {
    localStorage.setItem('mc_campaign', JSON.stringify(campaignData));
  }, [campaignData]);

  return (
    <div className="animate-fade-in container">
      <div className="page-header" style={{ marginBottom: '24px' }}>
        <div>
          <h2 className="page-title">Gestão de Campanha</h2>
          <p className="page-subtitle">Mantenha o registro e as notas da sua campanha ativa.</p>
        </div>
      </div>
      
      <div className="glass-panel" style={{ padding: '24px' }}>
        <label style={{ display: 'block', color: 'var(--text-secondary)', marginBottom: '8px' }}>Nome da Campanha:</label>
        <input 
          type="text" 
          value={campaignData.name}
          onChange={e => setCampaignData({...campaignData, name: e.target.value})}
          placeholder="Ex: Ascensão do Caveira Vermelha"
          style={{ width: '100%', background: 'rgba(0,0,0,0.5)', color: 'white', border: '1px solid rgba(255,255,255,0.2)', padding: '12px', borderRadius: '8px', marginBottom: '24px' }}
        />

        <label style={{ display: 'block', color: 'var(--text-secondary)', marginBottom: '8px' }}>Log e Anotações (Danos, Upgrades, Estado):</label>
        <textarea 
          value={campaignData.log}
          onChange={e => setCampaignData({...campaignData, log: e.target.value})}
          placeholder="Anotações da campanha... Ex: Capitão América sofreu 2 de dano no mercado. Ganhou a tecnologia de laser."
          style={{ width: '100%', height: '200px', background: 'rgba(0,0,0,0.5)', color: 'white', border: '1px solid rgba(255,255,255,0.2)', padding: '12px', borderRadius: '8px', resize: 'vertical' }}
        />
        
        <div style={{ marginTop: '16px', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--aspect-protection)' }}>
          <Save size={16} /> Salvo localmente de forma automática.
        </div>
      </div>
    </div>
  );
}
