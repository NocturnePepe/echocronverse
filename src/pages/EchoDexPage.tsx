import React from 'react';
import EchoDex from '../components/EchoDex';
import { EmberParticles } from '../components/ui';

const EchoDexPage: React.FC = () => {
  return (
    <div className="relative min-h-screen">
      {/* Trading energy atmosphere */}
      <EmberParticles
        count={25}
        variant="intense"
        isActive={true}
        containerSize={{ width: window.innerWidth, height: window.innerHeight }}
        className="fixed inset-0 z-0"
      />
      
      <div className="relative z-10">
        <EchoDex />
      </div>
    </div>
  );
};

export default EchoDexPage;
