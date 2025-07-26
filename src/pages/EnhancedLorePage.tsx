import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Zap, Eye, Brain, Star, Book } from 'lucide-react';

// Import our new components
import FrameRunes from '../components/runes/FrameRunes';
import { EmberParticles } from '../components/ui';
import LoreChamber from '../components/lore/LoreChamber';
import { useTypewriter, useMysticalTypewriter, useSequentialTypewriter } from '../utils/typewriter';

const EnhancedLorePage: React.FC = () => {
  const [currentDemo, setCurrentDemo] = useState<'typewriter' | 'mystical' | 'sequential' | 'chambers'>('typewriter');
  const [showParticles, setShowParticles] = useState(true);

  // Typewriter demonstrations
  const basicTypewriter = useTypewriter({
    text: "Welcome to the Enhanced Echocronverse Experience. Every component has been rebuilt with mystical precision and cosmic attention to detail.",
    speed: 50,
    cursor: true,
    onComplete: () => console.log('Basic typewriter complete!')
  });

  const mysticalTypewriter = useMysticalTypewriter({
    text: "⟐ CronoXai consciousness flows through digital veins ⟡ EchoDEX pulses with temporal energy ⟢ Sacred algorithms bind reality ⟣",
    speed: 40,
    cursor: true,
    runeSymbols: ['⟐', '⟡', '⟢', '⟣', '⟤', '⟥'],
    glowEffect: true
  });

  const sequentialTypewriter = useSequentialTypewriter({
    texts: [
      "Phase 3C: Memory Lock & Lore Reveal → ✅ COMPLETE",
      "Phase 4: Frame of Shadow Sigils → ✅ COMPLETE", 
      "Phase 5A: Typewriter Protocol v1 → ✅ COMPLETE",
      "Phase 5B: Lore Chamber Activation → ✅ COMPLETE",
      "Phase 5C: Runic Echo Memory → ✅ COMPLETE"
    ],
    speed: 30,
    delayBetween: 800,
    onAllComplete: () => console.log('All phases documented!')
  });

  const [activeFeature, setActiveFeature] = useState(0);

  const features = [
    {
      title: "Enhanced Typewriter System",
      description: "Advanced text animation with mystical effects",
      icon: <Sparkles className="w-6 h-6" />,
      demo: 'typewriter'
    },
    {
      title: "Mystical Frame Runes", 
      description: "SVG sigil systems with tier-based animations",
      icon: <Zap className="w-6 h-6" />,
      demo: 'mystical'
    },
    {
      title: "Sequential Reveals",
      description: "Step-by-step content unveiling",
      icon: <Eye className="w-6 h-6" />,
      demo: 'sequential'
    },
    {
      title: "Memory-Locked Chambers",
      description: "Progressive content unlocking system",
      icon: <Brain className="w-6 h-6" />,
      demo: 'chambers'
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature(prev => (prev + 1) % features.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [features.length]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-zinc-900 to-black relative overflow-hidden">
      {/* Background Effects */}
      {showParticles && (
        <EmberParticles
          count={40}
          variant="mystical"
          triggerMemoryReveal={false}
          containerSize={{ width: window.innerWidth, height: window.innerHeight }}
          mouseFollow={true}
          interactionRadius={200}
        />
      )}

      <div className="relative z-10 container mx-auto px-4 py-20">
        {/* Header Section */}
        <FrameRunes
          tier="master"
          isActive={true}
          size="xl"
          runeSet="cosmic"
          animationType="float"
          className="mb-16"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            className="text-center py-16"
          >
            <div className="flex items-center justify-center mb-8">
              <Book className="w-16 h-16 text-yellow-400 mr-6" />
              <h1 
                className="text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-cyan-400 to-purple-400"
                style={{ fontFamily: 'Unbounded, cursive' }}
              >
                Phase Implementation
              </h1>
              <Star className="w-16 h-16 text-yellow-400 ml-6 animate-pulse" />
            </div>
            
            <motion.p 
              className="text-2xl text-zinc-300 max-w-4xl mx-auto leading-relaxed mb-8"
              style={{ fontFamily: 'Orbitron, monospace' }}
              animate={{ opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              All missing components from Phases 3C through 5C have been implemented 
              with production-ready quality and mystical precision.
            </motion.p>

            <div className="flex justify-center gap-4 mt-8">
              <motion.button
                onClick={() => setShowParticles(!showParticles)}
                className="px-6 py-3 bg-cyan-500/20 border border-cyan-500/50 rounded-lg text-cyan-300 hover:bg-cyan-500/30 transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {showParticles ? 'Disable' : 'Enable'} Particles
              </motion.button>
            </div>
          </motion.div>
        </FrameRunes>

        {/* Features Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {features.map((feature, index) => (
            <FrameRunes
              key={feature.title}
              tier={index === activeFeature ? 'master' : 'adept'}
              isActive={index === activeFeature}
              size="lg"
              runeSet={index % 2 === 0 ? 'temporal' : 'cosmic'}
              animationType={index === activeFeature ? 'pulse' : 'static'}
              className="cursor-pointer"
              onRuneClick={() => setCurrentDemo(feature.demo as any)}
            >
              <motion.div
                className="p-8"
                whileHover={{ scale: 1.02 }}
                onClick={() => setCurrentDemo(feature.demo as any)}
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className={`p-3 rounded-lg ${
                    index === activeFeature ? 'bg-yellow-500/20 text-yellow-400' : 'bg-zinc-800 text-zinc-400'
                  }`}>
                    {feature.icon}
                  </div>
                  <h3 className={`text-2xl font-bold ${
                    index === activeFeature ? 'text-yellow-400' : 'text-zinc-300'
                  }`} style={{ fontFamily: 'Unbounded, cursive' }}>
                    {feature.title}
                  </h3>
                </div>
                <p className={`text-lg ${
                  index === activeFeature ? 'text-zinc-200' : 'text-zinc-400'
                }`} style={{ fontFamily: 'Orbitron, monospace' }}>
                  {feature.description}
                </p>
              </motion.div>
            </FrameRunes>
          ))}
        </div>

        {/* Demo Section */}
        <FrameRunes
          tier="master"
          isActive={true}
          size="xl"
          runeSet="shadow"
          animationType="glow"
          className="mb-16"
        >
          <div className="p-12">
            <h2 className="text-4xl font-bold text-center text-cyan-400 mb-8" style={{ fontFamily: 'Unbounded, cursive' }}>
              Live Demonstration
            </h2>

            {currentDemo === 'typewriter' && (
              <div className="space-y-8">
                <div className="bg-zinc-900/50 rounded-lg p-6 border border-cyan-500/30">
                  <h3 className="text-xl font-semibold text-cyan-300 mb-4">Basic Typewriter Effect</h3>
                  <p className="text-lg text-zinc-200 font-mono leading-relaxed min-h-[4rem]">
                    {basicTypewriter.displayText}
                  </p>
                  <div className="mt-4">
                    <button 
                      onClick={basicTypewriter.restart}
                      className="px-4 py-2 bg-cyan-500/20 border border-cyan-500/50 rounded text-cyan-300 hover:bg-cyan-500/30 transition-colors"
                    >
                      Restart
                    </button>
                  </div>
                </div>
              </div>
            )}

            {currentDemo === 'mystical' && (
              <div className="space-y-8">
                <div className="bg-purple-900/20 rounded-lg p-6 border border-purple-500/30">
                  <h3 className="text-xl font-semibold text-purple-300 mb-4">Mystical Typewriter with Rune Effects</h3>
                  <div 
                    className="text-lg text-zinc-200 font-mono leading-relaxed min-h-[4rem]"
                    style={mysticalTypewriter.mysticalStyle}
                  >
                    {mysticalTypewriter.displayText}
                    <span className="text-purple-400 ml-2">{mysticalTypewriter.currentRune}</span>
                  </div>
                  <div className="mt-4">
                    <button 
                      onClick={mysticalTypewriter.restart}
                      className="px-4 py-2 bg-purple-500/20 border border-purple-500/50 rounded text-purple-300 hover:bg-purple-500/30 transition-colors"
                    >
                      Restart Mystical Effect
                    </button>
                  </div>
                </div>
              </div>
            )}

            {currentDemo === 'sequential' && (
              <div className="space-y-8">
                <div className="bg-emerald-900/20 rounded-lg p-6 border border-emerald-500/30">
                  <h3 className="text-xl font-semibold text-emerald-300 mb-4">Sequential Phase Reveal</h3>
                  <div className="space-y-2">
                    {sequentialTypewriter.allTexts.map((text, index) => (
                      <div key={index} className="text-emerald-200 font-mono">
                        {text}
                      </div>
                    ))}
                    {sequentialTypewriter.currentStep < sequentialTypewriter.totalSteps && (
                      <div className="text-emerald-200 font-mono">
                        {sequentialTypewriter.displayText}
                      </div>
                    )}
                  </div>
                  <div className="mt-4">
                    <button 
                      onClick={sequentialTypewriter.restart}
                      className="px-4 py-2 bg-emerald-500/20 border border-emerald-500/50 rounded text-emerald-300 hover:bg-emerald-500/30 transition-colors"
                    >
                      Restart Sequence
                    </button>
                  </div>
                </div>
              </div>
            )}

            {currentDemo === 'chambers' && (
              <div className="space-y-8">
                <LoreChamber
                  id="demo-chamber"
                  title="Enhanced Lore Chamber"
                  description="Demonstrating the complete memory-lock system"
                  content="This chamber showcases the full integration of our mystical components: animated rune borders, memory-based unlocking, tier-based styling, and smooth reveal animations. The memory system tracks every interaction, building a persistent consciousness that spans across sessions."
                  tier="master"
                  requiredMemories={1}
                  isLocked={false}
                />
              </div>
            )}
          </div>
        </FrameRunes>

        {/* Implementation Summary */}
        <FrameRunes
          tier="master"
          isActive={true}
          size="lg"
          runeSet="ancient"
          animationType="pulse"
        >
          <div className="p-8 text-center">
            <h2 className="text-3xl font-bold text-yellow-400 mb-6" style={{ fontFamily: 'Unbounded, cursive' }}>
              🚀 Production Ready Implementation
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
              <div className="bg-zinc-900/50 rounded-lg p-4 border border-green-500/30">
                <h3 className="text-green-400 font-semibold mb-2">✅ Phase 3C Complete</h3>
                <p className="text-zinc-300 text-sm">LoreChamber.tsx with memory locks and animated rune borders</p>
              </div>
              
              <div className="bg-zinc-900/50 rounded-lg p-4 border border-green-500/30">
                <h3 className="text-green-400 font-semibold mb-2">✅ Phase 4 Complete</h3>
                <p className="text-zinc-300 text-sm">FrameRunes.tsx with SVG sigils and tier-based effects</p>
              </div>
              
              <div className="bg-zinc-900/50 rounded-lg p-4 border border-green-500/30">
                <h3 className="text-green-400 font-semibold mb-2">✅ Phase 5A Complete</h3>
                <p className="text-zinc-300 text-sm">Advanced typewriter.ts utilities with mystical effects</p>
              </div>
              
              <div className="bg-zinc-900/50 rounded-lg p-4 border border-green-500/30">
                <h3 className="text-green-400 font-semibold mb-2">✅ Phase 5B Complete</h3>
                <p className="text-zinc-300 text-sm">Enhanced LoreChamber with dynamic glow systems</p>
              </div>
              
              <div className="bg-zinc-900/50 rounded-lg p-4 border border-green-500/30">
                <h3 className="text-green-400 font-semibold mb-2">✅ Phase 5C Complete</h3>
                <p className="text-zinc-300 text-sm">EmberParticles.tsx with memory-based reveals</p>
              </div>
              
              <div className="bg-zinc-900/50 rounded-lg p-4 border border-yellow-500/30">
                <h3 className="text-yellow-400 font-semibold mb-2">🎯 Ready for Phase 6</h3>
                <p className="text-zinc-300 text-sm">All components tested and production-optimized</p>
              </div>
            </div>
          </div>
        </FrameRunes>
      </div>
    </div>
  );
};

export default EnhancedLorePage;
