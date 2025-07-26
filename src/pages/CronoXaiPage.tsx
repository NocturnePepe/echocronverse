import React from 'react';
import CronoXaiTerminal from '../components/ai/CronoXaiTerminal';
import { EmberParticles } from '../components/ui';

const CronoXaiPage: React.FC = () => {
  return (
    <div className="relative min-h-screen">
      {/* Mystical atmosphere for AI interactions */}
      <EmberParticles
        count={20}
        variant="mystical"
        isActive={true}
        containerSize={{ width: window.innerWidth, height: window.innerHeight }}
        className="fixed inset-0 z-0"
      />
      
      <div className="relative z-10">
        <CronoXaiTerminal />
      </div>
    </div>
  );
};

export default CronoXaiPage;
