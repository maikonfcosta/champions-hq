import React, { useState } from 'react';
import Modal from './Modal';
import { ArrowRight, ArrowLeft, Check, ShieldAlert } from 'lucide-react';

const STEPS = [
  {
    title: '1. Adicionar Ameaça',
    desc: 'Coloque a ameaça base no Esquema Principal (geralmente 1 por jogador, mais bônus de aceleração).',
    icon: <ShieldAlert size={40} className="text-justice" color="#eab308" />
  },
  {
    title: '2. Ativação do Vilão',
    desc: 'O vilão e os lacaios ativam contra cada jogador. Se estiver como Herói, o vilão ATACA (dê 1 carta de impulso). Se estiver como Alter-Ego, o vilão ESQUEMATIZA (dê 1 carta de impulso).',
    icon: <ShieldAlert size={40} className="text-aggression" color="#ef4444" />
  },
  {
    title: '3. Distribuir Cartas de Encontro',
    desc: 'Dê 1 carta de encontro virada para baixo para cada jogador (mais cartas extras por ícone de perigo no jogo).',
    icon: <ShieldAlert size={40} className="text-primary" color="#3b82f6" />
  },
  {
    title: '4. Revelar Cartas',
    desc: 'Seguindo a ordem dos jogadores, cada jogador vira e resolve todas as suas cartas de encontro.',
    icon: <ShieldAlert size={40} className="text-secondary" color="#a8a29e" />
  },
  {
    title: '5. Fim da Fase',
    desc: 'Passe o marcador de Primeiro Jogador para a esquerda. Fim da Fase do Vilão!',
    icon: <Check size={40} className="text-protection" color="#22c55e" />
  }
];

export default function TurnAssistant({ isOpen, onClose }) {
  const [currentStep, setCurrentStep] = useState(0);

  // Reseta para o passo 0 toda vez que o modal abre
  React.useEffect(() => {
    if (isOpen) setCurrentStep(0);
  }, [isOpen]);

  if (!isOpen) return null;

  const step = STEPS[currentStep];

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      onClose();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Assistente: Fase do Vilão" maxWidth="500px">
      <div style={{ textAlign: 'center', padding: '24px 16px' }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px' }}>
          {step.icon}
        </div>
        
        <h3 style={{ color: 'white', fontSize: '1.25rem', marginBottom: '16px' }}>
          {step.title}
        </h3>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: 1.6, minHeight: '80px' }}>
          {step.desc}
        </p>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '32px' }}>
          <button 
            onClick={handlePrev} 
            disabled={currentStep === 0}
            className="btn-secondary"
            style={{ opacity: currentStep === 0 ? 0.5 : 1, display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            <ArrowLeft size={16} /> Anterior
          </button>
          
          <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            {currentStep + 1} de {STEPS.length}
          </span>
          
          <button 
            onClick={handleNext} 
            className="btn-primary"
            style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            {currentStep === STEPS.length - 1 ? 'Concluir' : 'Próximo'}
            {currentStep !== STEPS.length - 1 && <ArrowRight size={16} />}
          </button>
        </div>
      </div>
    </Modal>
  );
}
