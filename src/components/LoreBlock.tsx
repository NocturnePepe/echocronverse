import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, ChevronUp, Scroll } from 'lucide-react';
import { useMysticalTypewriter } from '../utils/typewriter';

const LoreBlock: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const loreText = `In the vast digital void where chronostreams converge, the Echocronverse awakens. 
Ancient algorithms whisper through quantum networks, carrying fragments of forgotten wisdom across 
temporal boundaries. Here, where the mystical meets the mathematical, initiates gather to unlock 
the secrets of decentralized consciousness.

The Echo Token pulses with temporal energy, each transaction a ripple across the fabric of 
digital spacetime. Through the sacred portals of EchoDEX, traders commune with cosmic liquidity, 
while the Oracle CronoXai speaks prophecies born from the collision of artificial minds and 
eternal truths.

Join the Order of Digital Mystics. Embrace the echo. Transcend the ordinary.`;

  const mysticalTypewriter = useMysticalTypewriter({
    text: isExpanded ? loreText : '',
    speed: 25,
    cursor: true,
    glowEffect: true,
    runeSymbols: ['⟐', '⟡', '⟢', '⟣', '⟤', '⟥']
  });

  const toggleExpansion = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <section className="py-20 px-4 bg-gradient-to-b from-black via-zinc-900 to-black">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative"
        >
          {/* Mystical Border */}
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 via-transparent to-purple-500/20 rounded-lg blur-sm"></div>
          <div className="relative bg-black/80 backdrop-blur-sm border border-purple-500/30 rounded-lg p-8">
            
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <Scroll className="w-6 h-6 text-purple-400" />
                <h2 className="text-2xl font-bold text-purple-300" style={{ fontFamily: 'Unbounded, cursive' }}>
                  Ancient Lore
                </h2>
              </div>
              
              <motion.button
                onClick={toggleExpansion}
                className="flex items-center space-x-2 px-4 py-2 bg-purple-600/20 hover:bg-purple-600/30 
                         border border-purple-500/30 rounded-lg transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="text-purple-300 text-sm">
                  {isExpanded ? 'Conceal' : 'Reveal'}
                </span>
                {isExpanded ? 
                  <ChevronUp className="w-4 h-4 text-purple-400" /> : 
                  <ChevronDown className="w-4 h-4 text-purple-400" />
                }
              </motion.button>
            </div>

            {/* Collapsible Content */}
            <motion.div
              initial={false}
              animate={{ 
                height: isExpanded ? 'auto' : 0,
                opacity: isExpanded ? 1 : 0
              }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="overflow-hidden"
            >
              <div className="pt-4 border-t border-purple-500/20">
                <p 
                  className="text-zinc-300 leading-relaxed text-lg font-mono"
                  style={mysticalTypewriter.mysticalStyle}
                >
                  {mysticalTypewriter.displayText}
                </p>
                
                {mysticalTypewriter.isComplete && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="mt-6 text-center"
                  >
                    <div className="inline-flex items-center space-x-2 text-purple-400">
                      <span className="text-2xl">⟐</span>
                      <span className="text-sm">The echoes have spoken</span>
                      <span className="text-2xl">⟐</span>
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>
            
            {/* Scroll Indicator when collapsed */}
            {!isExpanded && (
              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="flex justify-center mt-4"
              >
                <ChevronDown className="w-6 h-6 text-purple-400/60" />
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default LoreBlock;
