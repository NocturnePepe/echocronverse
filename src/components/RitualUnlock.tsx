import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Unlock, Sparkles } from 'lucide-react';
import { useNavigationStore } from '../stores/navigationStore';
import RuneLoader from './RuneLoader';

interface RitualUnlockProps {
  path: string;
  ritual: {
    name: string;
    description: string;
    requirement: string;
    steps: number;
  };
  onUnlock: () => void;
}

const RitualUnlock: React.FC<RitualUnlockProps> = ({ path, ritual, onUnlock }) => {
  const { getRitualProgress, updateRitualProgress, unlockPath } = useNavigationStore();
  const [isPerformingRitual, setIsPerformingRitual] = useState(false);
  const [clickCount, setClickCount] = useState(0);
  
  const progress = getRitualProgress(path);
  const isCompleted = progress >= ritual.steps;

  const performRitual = () => {
    if (isCompleted) {
      unlockPath(path);
      onUnlock();
      return;
    }

    if (path === '/echodex') {
      // Echo sigil clicking ritual
      const newCount = clickCount + 1;
      setClickCount(newCount);
      updateRitualProgress(path, newCount);
      
      if (newCount >= ritual.steps) {
        setIsPerformingRitual(true);
        setTimeout(() => {
          unlockPath(path);
          setIsPerformingRitual(false);
          onUnlock();
        }, 2000);
      }
    } else if (path === '/cronoxai') {
      // Meditation ritual - hold for 10 seconds
      setIsPerformingRitual(true);
      let count = 0;
      const interval = setInterval(() => {
        count++;
        updateRitualProgress(path, count);
        
        if (count >= ritual.steps) {
          clearInterval(interval);
          unlockPath(path);
          setIsPerformingRitual(false);
          onUnlock();
        }
      }, 1000);
    } else if (path === '/wallet') {
      // Sigil tracing - click pattern
      const newProgress = progress + 1;
      updateRitualProgress(path, newProgress);
      
      if (newProgress >= ritual.steps) {
        setIsPerformingRitual(true);
        setTimeout(() => {
          unlockPath(path);
          setIsPerformingRitual(false);
          onUnlock();
        }, 1500);
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black/95 backdrop-blur-md z-40 flex items-center justify-center">
      <AnimatePresence>
        {isPerformingRitual && (
          <RuneLoader 
            isLoading={true} 
            text="Ritual energy awakening..." 
            size="lg" 
          />
        )}
      </AnimatePresence>

      {!isPerformingRitual && (
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-gradient-to-br from-zinc-900 to-black border border-purple-500/30 rounded-lg p-8 max-w-md mx-4 text-center"
        >
          <motion.div
            className="text-6xl mb-6"
            animate={isCompleted ? { 
              rotate: [0, 360],
              scale: [1, 1.2, 1],
              textShadow: ['0 0 20px rgba(168, 85, 247, 0.8)', '0 0 40px rgba(168, 85, 247, 1)', '0 0 20px rgba(168, 85, 247, 0.8)']
            } : {}}
            transition={{ duration: 2, repeat: isCompleted ? Infinity : 0 }}
          >
            {isCompleted ? <Unlock className="w-16 h-16 text-green-400 mx-auto" /> : <Lock className="w-16 h-16 text-purple-400 mx-auto" />}
          </motion.div>

          <h2 className="text-2xl font-bold text-purple-300 mb-2">{ritual.name}</h2>
          <p className="text-zinc-400 mb-4">{ritual.description}</p>
          
          <div className="bg-black/50 rounded-lg p-4 mb-6">
            <p className="text-sm text-zinc-300 mb-2">{ritual.requirement}</p>
            
            {/* Progress Bar */}
            <div className="w-full bg-zinc-800 rounded-full h-2 mb-2">
              <motion.div
                className="bg-gradient-to-r from-purple-500 to-cyan-400 h-2 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${(progress / ritual.steps) * 100}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
            
            <p className="text-xs text-zinc-500">
              Progress: {progress}/{ritual.steps}
            </p>
          </div>

          <motion.button
            onClick={performRitual}
            className={`px-8 py-3 rounded-lg font-medium transition-all ${
              isCompleted 
                ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white' 
                : 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            disabled={isPerformingRitual}
          >
            {isCompleted ? (
              <>
                <Sparkles className="w-4 h-4 inline mr-2" />
                Enter Realm
              </>
            ) : (
              <>
                <Lock className="w-4 h-4 inline mr-2" />
                Perform Ritual
              </>
            )}
          </motion.button>

          {path === '/echodex' && !isCompleted && (
            <p className="text-xs text-zinc-500 mt-4">
              Click to channel trading energies ({clickCount}/7)
            </p>
          )}
        </motion.div>
      )}
    </div>
  );
};

export default RitualUnlock;
