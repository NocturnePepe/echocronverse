import React from 'react';
import Hero from '../components/Hero';
import LoreBlock from '../components/LoreBlock';
import Footer from '../components/Footer';
import { EmberParticles } from '../components/ui';

const HomePage: React.FC = () => {
  return (
    <div className="relative">
      {/* Subtle atmospheric particles */}
      <EmberParticles
        count={15}
        variant="ambient"
        isActive={true}
        containerSize={{ width: window.innerWidth, height: window.innerHeight }}
        className="fixed inset-0 z-0"
      />
      
      <div className="relative z-10">
        <Hero />
        <LoreBlock />
        <Footer />
      </div>
    </div>
  );
};

export default HomePage;
