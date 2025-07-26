import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Unlock, Eye, Brain, Scroll, ChevronDown, ChevronUp } from 'lucide-react';
import { useCronoXaiMemory } from '../../hooks/useCronoXaiMemory';

interface LoreChamberProps {
  id: string;
  title: string;
  description: string;
  content: string;
  requiredMemories?: number;
  isLocked?: boolean;
  tier?: 'initiate' | 'adept' | 'master';
}

const LoreChamber: React.FC<LoreChamberProps> = ({
  id,
  title,
  description,
  content,
  requiredMemories = 3,
  isLocked = true,
  tier = 'initiate'
}) => {
  const { getMemories, addMemory } = useCronoXaiMemory();
  const [isUnlocked, setIsUnlocked] = useState(!isLocked);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isReading, setIsReading] = useState(false);
  const [hasBeenRead, setHasBeenRead] = useState(false);

  // Check if chamber should be unlocked based on memories
  useEffect(() => {
    const memories = getMemories();
    if (memories.length >= requiredMemories && isLocked) {
      setIsUnlocked(true);
    }
  }, [getMemories, requiredMemories, isLocked]);

  // Tier-based styling
  const tierColors = {
    initiate: {
      border: 'border-blue-500/30',
      glow: 'shadow-[0_0_20px_rgba(59,130,246,0.3)]',
      text: 'text-blue-400',
      bg: 'bg-blue-500/10'
    },
    adept: {
      border: 'border-purple-500/30', 
      glow: 'shadow-[0_0_20px_rgba(168,85,247,0.3)]',
      text: 'text-purple-400',
      bg: 'bg-purple-500/10'
    },
    master: {
      border: 'border-cyan-500/30',
      glow: 'shadow-[0_0_20px_rgba(6,182,212,0.3)]',
      text: 'text-cyan-400', 
      bg: 'bg-cyan-500/10'
    }
  };

  const currentTier = tierColors[tier];

  const handleUnlock = () => {
    if (!isUnlocked) return;
    
    setIsExpanded(!isExpanded);
    
    if (!isExpanded && !hasBeenRead) {
      // Record that this lore chamber has been accessed
      addMemory({
        type: 'lore_access',
        content: `Accessed Lore Chamber: ${title}`,
        context: { 
          chamberId: id,
          tier: tier,
          timestamp: new Date().toISOString()
        }
      });
    }
  };

  const handleReadComplete = () => {
    if (!hasBeenRead) {
      setHasBeenRead(true);
      // Record lore completion for memory system
      addMemory({
        type: 'lore_completion',
        content: `Completed reading: ${title} - ${description}`,
        context: {
          chamberId: id,
          tier: tier,
          content: content.substring(0, 100) + '...',
          timestamp: new Date().toISOString()
        }
      });
    }
    setIsReading(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className={`relative p-6 rounded-lg backdrop-blur-sm border transition-all duration-500 ${
        isUnlocked ? 
          `${currentTier.border} ${currentTier.glow} ${currentTier.bg}` :
          'border-zinc-700 bg-zinc-900/50'
      }`}
    >
      {/* Animated Rune Borders */}
      {isUnlocked && (
        <motion.div
          className="absolute inset-0 rounded-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.3, 0.7, 0.3] }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          {/* Corner Runes */}
          <div className={`absolute -top-1 -left-1 w-3 h-3 ${currentTier.text}`}>⟐</div>
          <div className={`absolute -top-1 -right-1 w-3 h-3 ${currentTier.text}`}>⟡</div>
          <div className={`absolute -bottom-1 -left-1 w-3 h-3 ${currentTier.text}`}>⟢</div>
          <div className={`absolute -bottom-1 -right-1 w-3 h-3 ${currentTier.text}`}>⟣</div>
        </motion.div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <motion.div
            animate={isUnlocked ? { 
              rotate: [0, 5, -5, 0],
              scale: [1, 1.1, 1] 
            } : {}}
            transition={{ duration: 2, repeat: Infinity }}
          >
            {isUnlocked ? (
              <Unlock className={`w-6 h-6 ${currentTier.text}`} />
            ) : (
              <Lock className="w-6 h-6 text-zinc-500" />
            )}
          </motion.div>
          
          <div>
            <h3 className={`text-xl font-bold ${isUnlocked ? currentTier.text : 'text-zinc-500'}`}
                style={{ fontFamily: 'Unbounded, cursive' }}>
              {title}
            </h3>
            <p className={`text-sm ${isUnlocked ? 'text-zinc-300' : 'text-zinc-600'}`}
               style={{ fontFamily: 'Orbitron, monospace' }}>
              {description}
            </p>
          </div>
        </div>

        {/* Status Indicators */}
        <div className="flex items-center gap-2">
          {hasBeenRead && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className={`p-1 rounded-full ${currentTier.bg}`}
            >
              <Eye className={`w-4 h-4 ${currentTier.text}`} />
            </motion.div>
          )}
          
          <div className={`text-xs px-2 py-1 rounded ${
            isUnlocked ? currentTier.bg : 'bg-zinc-800'
          }`}>
            {tier.toUpperCase()}
          </div>
        </div>
      </div>

      {/* Lock Status */}
      {!isUnlocked && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-8"
        >
          <Brain className="w-12 h-12 text-zinc-600 mx-auto mb-3" />
          <p className="text-zinc-500 text-sm" style={{ fontFamily: 'Orbitron, monospace' }}>
            Requires {requiredMemories} memories to unlock
          </p>
          <p className="text-zinc-600 text-xs mt-1">
            Current: {getMemories().length} memories stored
          </p>
        </motion.div>
      )}

      {/* Unlocked Content */}
      {isUnlocked && (
        <motion.div
          initial={{ opacity: 0.5 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <motion.button
            onClick={handleUnlock}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`w-full flex items-center justify-between p-4 rounded-lg border transition-all duration-300 ${
              currentTier.border
            } ${isExpanded ? currentTier.bg : 'hover:' + currentTier.bg}`}
          >
            <div className="flex items-center gap-2">
              <Scroll className={`w-5 h-5 ${currentTier.text}`} />
              <span className={`font-medium ${currentTier.text}`}>
                {isExpanded ? 'Conceal Lore' : 'Reveal Lore'}
              </span>
            </div>
            {isExpanded ? (
              <ChevronUp className={`w-5 h-5 ${currentTier.text}`} />
            ) : (
              <ChevronDown className={`w-5 h-5 ${currentTier.text}`} />
            )}
          </motion.button>

          {/* Expandable Content */}
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                className="overflow-hidden"
              >
                <div className="pt-6">
                  <motion.div
                    className={`p-6 rounded-lg border ${currentTier.border} ${currentTier.bg}`}
                    onAnimationComplete={() => {
                      if (isExpanded && !isReading) {
                        setIsReading(true);
                        // Auto-complete reading after a delay
                        setTimeout(() => {
                          handleReadComplete();
                        }, 3000);
                      }
                    }}
                  >
                    <div className="prose prose-invert max-w-none">
                      <p className="text-zinc-300 leading-relaxed text-base"
                         style={{ fontFamily: 'Orbitron, monospace' }}>
                        {content}
                      </p>
                    </div>
                    
                    {/* Reading Progress */}
                    {isReading && (
                      <motion.div
                        className="mt-4 text-center"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                      >
                        <div className={`inline-flex items-center gap-2 text-xs ${currentTier.text}`}>
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                          >
                            ⟐
                          </motion.div>
                          <span>Absorbing temporal knowledge...</span>
                        </div>
                      </motion.div>
                    )}
                    
                    {/* Completion Marker */}
                    {hasBeenRead && (
                      <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="mt-4 text-center"
                      >
                        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full ${currentTier.bg} border ${currentTier.border}`}>
                          <Eye className={`w-4 h-4 ${currentTier.text}`} />
                          <span className={`text-xs ${currentTier.text}`}>
                            Knowledge absorbed into memory matrix
                          </span>
                        </div>
                      </motion.div>
                    )}
                  </motion.div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </motion.div>
  );
};

export default LoreChamber;
