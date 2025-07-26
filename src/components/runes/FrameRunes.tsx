import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export interface FrameRunesProps {
  tier?: 'initiate' | 'adept' | 'master' | 'oracle';
  isActive?: boolean;
  glowIntensity?: number;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  runeSet?: 'ancient' | 'temporal' | 'cosmic' | 'shadow';
  children?: React.ReactNode;
  className?: string;
  onRuneClick?: (runeIndex: number, rune: string) => void;
  animationType?: 'pulse' | 'rotate' | 'float' | 'glow' | 'static';
}

const FrameRunes: React.FC<FrameRunesProps> = ({
  tier = 'initiate',
  isActive = true,
  glowIntensity = 0.6,
  size = 'md',
  runeSet = 'ancient',
  children,
  className = '',
  onRuneClick,
  animationType = 'pulse'
}) => {
  const [activeRunes, setActiveRunes] = useState<number[]>([]);
  const [, setCurrentAnimation] = useState(0);

  // Rune symbol sets for different mystical themes
  const runeSets = {
    ancient: {
      corners: ['⟐', '⟡', '⟢', '⟣'],
      sides: ['⟤', '⟥', '⟦', '⟧'],
      center: '◉',
      extras: ['⟨', '⟩', '⟪', '⟫']
    },
    temporal: {
      corners: ['⧖', '⧗', '⧘', '⧙'],
      sides: ['⧚', '⧛', '⧜', '⧝'],
      center: '⧞',
      extras: ['⧟', '⧠', '⧡', '⧢']
    },
    cosmic: {
      corners: ['✦', '✧', '✩', '✪'],
      sides: ['✫', '✬', '✭', '✮'],
      center: '✯',
      extras: ['✰', '✱', '✲', '✳']
    },
    shadow: {
      corners: ['◆', '◇', '◈', '◉'],
      sides: ['◊', '○', '◌', '◍'],
      center: '●',
      extras: ['◎', '◐', '◑', '◒']
    }
  };

  // Tier-based color schemes
  const tierColors = {
    initiate: {
      primary: 'text-blue-400',
      secondary: 'text-blue-300',
      glow: 'rgba(59, 130, 246, ',
      border: 'border-blue-500/30',
      bg: 'bg-blue-500/10'
    },
    adept: {
      primary: 'text-purple-400',
      secondary: 'text-purple-300',
      glow: 'rgba(168, 85, 247, ',
      border: 'border-purple-500/30',
      bg: 'bg-purple-500/10'
    },
    master: {
      primary: 'text-cyan-400',
      secondary: 'text-cyan-300',
      glow: 'rgba(6, 182, 212, ',
      border: 'border-cyan-500/30',
      bg: 'bg-cyan-500/10'
    },
    oracle: {
      primary: 'text-yellow-400',
      secondary: 'text-yellow-300',
      glow: 'rgba(251, 191, 36, ',
      border: 'border-yellow-500/30',
      bg: 'bg-yellow-500/10'
    }
  };

  // Size configurations
  const sizeConfig = {
    sm: {
      container: 'p-4',
      rune: 'text-lg w-6 h-6',
      corner: 'w-3 h-3',
      side: 'w-2 h-2',
      center: 'text-xl'
    },
    md: {
      container: 'p-6',
      rune: 'text-xl w-8 h-8',
      corner: 'w-4 h-4',
      side: 'w-3 h-3',
      center: 'text-2xl'
    },
    lg: {
      container: 'p-8',
      rune: 'text-2xl w-10 h-10',
      corner: 'w-5 h-5',
      side: 'w-4 h-4',
      center: 'text-3xl'
    },
    xl: {
      container: 'p-12',
      rune: 'text-3xl w-12 h-12',
      corner: 'w-6 h-6',
      side: 'w-5 h-5',
      center: 'text-4xl'
    }
  };

  const currentTier = tierColors[tier];
  const currentSize = sizeConfig[size];
  const currentRunes = runeSets[runeSet];

  // Activate runes in sequence on mount
  useEffect(() => {
    if (!isActive) return;

    const activateSequence = () => {
      const totalRunes = 8; // 4 corners + 4 sides
      let currentRune = 0;

      const activateInterval = setInterval(() => {
        setActiveRunes(prev => [...prev, currentRune]);
        currentRune++;

        if (currentRune >= totalRunes) {
          clearInterval(activateInterval);
        }
      }, 200);

      return () => clearInterval(activateInterval);
    };

    const delay = setTimeout(activateSequence, 300);
    return () => clearTimeout(delay);
  }, [isActive]);

  // Animation cycling
  useEffect(() => {
    if (animationType === 'static') return;

    const animationInterval = setInterval(() => {
      setCurrentAnimation(prev => (prev + 1) % 4);
    }, 2000);

    return () => clearInterval(animationInterval);
  }, [animationType]);

  const getRuneAnimation = (index: number) => {
    const isActive = activeRunes.includes(index);
    if (!isActive) return {};

    const baseAnimation = {
      opacity: [0.4, 1, 0.4],
      scale: [0.8, 1.2, 0.8]
    };

    switch (animationType) {
      case 'pulse':
        return {
          ...baseAnimation,
          textShadow: [
            `0 0 5px ${currentTier.glow}${glowIntensity})`,
            `0 0 20px ${currentTier.glow}${glowIntensity * 1.5})`,
            `0 0 5px ${currentTier.glow}${glowIntensity})`
          ]
        };
      case 'rotate':
        return {
          ...baseAnimation,
          rotate: [0, 360, 720]
        };
      case 'float':
        return {
          ...baseAnimation,
          y: [0, -5, 0],
          x: [0, Math.sin(index) * 3, 0]
        };
      case 'glow':
        return {
          ...baseAnimation,
          filter: [
            'brightness(1)',
            'brightness(1.5)',
            'brightness(1)'
          ]
        };
      default:
        return baseAnimation;
    }
  };

  const handleRuneClick = (index: number, rune: string) => {
    if (onRuneClick) {
      onRuneClick(index, rune);
    }
  };

  return (
    <div className={`relative ${currentSize.container} ${className}`}>
      {/* Frame Container */}
      <div className={`relative border rounded-lg backdrop-blur-sm transition-all duration-500 ${
        isActive ? `${currentTier.border} ${currentTier.bg}` : 'border-zinc-700 bg-zinc-900/20'
      }`}>
        
        {/* Corner Runes */}
        <AnimatePresence>
          {currentRunes.corners.map((rune, index) => (
            <motion.div
              key={`corner-${index}`}
              className={`absolute ${currentSize.corner} flex items-center justify-center cursor-pointer select-none ${
                activeRunes.includes(index) ? currentTier.primary : 'text-zinc-600'
              }`}
              style={{
                top: index < 2 ? '-0.5rem' : 'calc(100% - 0.5rem)',
                left: index % 2 === 0 ? '-0.5rem' : 'calc(100% - 0.5rem)',
                fontFamily: 'monospace'
              }}
              initial={{ opacity: 0, scale: 0 }}
              animate={getRuneAnimation(index)}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: index * 0.2,
                ease: "easeInOut"
              }}
              onClick={() => handleRuneClick(index, rune)}
              whileHover={{ scale: 1.3 }}
              whileTap={{ scale: 0.9 }}
            >
              {rune}
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Side Runes */}
        <AnimatePresence>
          {currentRunes.sides.map((rune, index) => (
            <motion.div
              key={`side-${index}`}
              className={`absolute ${currentSize.side} flex items-center justify-center cursor-pointer select-none ${
                activeRunes.includes(index + 4) ? currentTier.secondary : 'text-zinc-600'
              }`}
              style={{
                top: index < 2 ? '25%' : '75%',
                [index % 2 === 0 ? 'left' : 'right']: '-0.25rem',
                transform: 'translateY(-50%)',
                fontFamily: 'monospace'
              }}
              initial={{ opacity: 0, scale: 0 }}
              animate={getRuneAnimation(index + 4)}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                delay: (index + 4) * 0.2,
                ease: "easeInOut"
              }}
              onClick={() => handleRuneClick(index + 4, rune)}
              whileHover={{ scale: 1.3 }}
              whileTap={{ scale: 0.9 }}
            >
              {rune}
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Center Sigil */}
        {isActive && (
          <motion.div
            className={`absolute top-2 right-2 ${currentSize.center} ${currentTier.primary} opacity-20 select-none`}
            style={{ fontFamily: 'monospace' }}
            animate={{
              opacity: [0.1, 0.3, 0.1],
              rotate: [0, 180, 360],
              scale: [0.8, 1, 0.8]
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "linear"
            }}
          >
            {currentRunes.center}
          </motion.div>
        )}

        {/* Content */}
        <div className="relative z-10">
          {children}
        </div>

        {/* Active Glow Effect */}
        {isActive && (
          <motion.div
            className="absolute inset-0 rounded-lg pointer-events-none"
            animate={{
              boxShadow: [
                `0 0 10px ${currentTier.glow}${glowIntensity * 0.3})`,
                `0 0 30px ${currentTier.glow}${glowIntensity * 0.6})`,
                `0 0 10px ${currentTier.glow}${glowIntensity * 0.3})`
              ]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        )}
      </div>

      {/* Mystical Particle Effects */}
      {isActive && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className={`absolute w-1 h-1 ${currentTier.primary} rounded-full opacity-40`}
              style={{
                left: `${20 + (i * 15)}%`,
                top: `${30 + (i * 10)}%`
              }}
              animate={{
                y: [-10, -30, -10],
                opacity: [0, 0.6, 0],
                scale: [0.5, 1, 0.5]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                delay: i * 0.5,
                ease: "easeInOut"
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default FrameRunes;