import React from 'react';
import WalletConnect from '../components/WalletConnect';
import FrameRunes from '../components/runes/FrameRunes';
import { EmberParticles } from '../components/ui';

const WalletPage: React.FC = () => {
  return (
    <div className="relative min-h-screen">
      {/* Security-focused atmospheric effects */}
      <EmberParticles
        count={18}
        variant="ambient"
        isActive={true}
        containerSize={{ width: window.innerWidth, height: window.innerHeight }}
        className="fixed inset-0 z-0"
      />
      
      <div className="relative z-10">
        <FrameRunes
          tier="master"
          isActive={true}
          size="lg"
          runeSet="shadow"
          animationType="glow"
          className="max-w-4xl mx-auto mt-20"
        >
          <WalletConnect />
        </FrameRunes>
      </div>
    </div>
  );
};

export default WalletPage;
