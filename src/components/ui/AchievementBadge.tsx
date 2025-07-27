import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMemoryAchievements } from '../../hooks/useMemoryAchievements';

interface AchievementBadgeProps {
  className?: string;
}

const AchievementBadge: React.FC<AchievementBadgeProps> = ({ className = '' }) => {
  const { achievements, totalUnlocked, currentTier } = useMemoryAchievements();
  const [showPanel, setShowPanel] = useState(false);
  const [newAchievement, setNewAchievement] = useState<string | null>(null);

  useEffect(() => {
    const lastCheck = localStorage.getItem('last_achievement_check');
    const currentUnlocked = achievements.filter(a => a.unlocked).map(a => a.id);
    const previousUnlocked = lastCheck ? JSON.parse(lastCheck) : [];
    
    const newUnlocks = currentUnlocked.filter(id => !previousUnlocked.includes(id));
    if (newUnlocks.length > 0) {
      const newest = achievements.find(a => a.id === newUnlocks[newUnlocks.length - 1]);
      if (newest) {
        setNewAchievement(newest.title);
        setTimeout(() => setNewAchievement(null), 4000);
      }
    }
    
    localStorage.setItem('last_achievement_check', JSON.stringify(currentUnlocked));
  }, [achievements]);

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'initiate': return 'text-green-400';
      case 'adept': return 'text-blue-400';
      case 'master': return 'text-purple-400';
      case 'oracle': return 'text-yellow-400';
      default: return 'text-gray-400';
    }
  };

  const getTierBorder = (tier: string) => {
    switch (tier) {
      case 'initiate': return 'border-green-400/30';
      case 'adept': return 'border-blue-400/30';
      case 'master': return 'border-purple-400/30';
      case 'oracle': return 'border-yellow-400/30';
      default: return 'border-gray-400/30';
    }
  };

  return (
    <>
      {/* Achievement Notification */}
      <AnimatePresence>
        {newAchievement && (
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -50, scale: 0.8 }}
            className="fixed top-4 right-4 z-50 bg-gradient-to-r from-purple-600/20 to-indigo-600/20 border border-purple-400/30 rounded-lg p-4 backdrop-blur-sm"
          >
            <div className="text-yellow-400 font-bold text-sm">🏆 Achievement Unlocked!</div>
            <div className="text-white text-xs mt-1">{newAchievement}</div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Achievement Badge Button */}
      <motion.button
        onClick={() => setShowPanel(!showPanel)}
        className={`relative flex items-center gap-2 px-3 py-2 rounded-lg border ${getTierBorder(currentTier)} bg-black/50 backdrop-blur-sm hover:bg-gray-900/50 transition-all ${className}`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <span className="text-xs">🏆</span>
        <span className={`text-xs font-medium ${getTierColor(currentTier)}`}>
          {totalUnlocked}/{achievements.length}
        </span>
        <span className={`text-xs ${getTierColor(currentTier)} capitalize`}>
          {currentTier}
        </span>
      </motion.button>

      {/* Achievement Panel */}
      <AnimatePresence>
        {showPanel && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: -20 }}
            className="absolute top-full right-0 mt-2 w-80 bg-black/90 border border-gray-600/30 rounded-lg p-4 backdrop-blur-sm z-40"
          >
            <h3 className="text-white font-bold text-sm mb-3">🏆 Memory Achievements</h3>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {achievements.map((achievement) => (
                <div
                  key={achievement.id}
                  className={`flex items-center gap-3 p-2 rounded ${
                    achievement.unlocked 
                      ? 'bg-gray-800/50 border border-gray-600/30' 
                      : 'bg-gray-900/30 border border-gray-700/20'
                  }`}
                >
                  <span className={`text-lg ${achievement.unlocked ? '' : 'grayscale opacity-50'}`}>
                    {achievement.icon}
                  </span>
                  <div className="flex-1">
                    <div className={`text-xs font-medium ${
                      achievement.unlocked ? getTierColor(achievement.tier) : 'text-gray-500'
                    }`}>
                      {achievement.title}
                    </div>
                    <div className="text-xs text-gray-400 mt-1">
                      {achievement.description}
                    </div>
                  </div>
                  {achievement.unlocked && (
                    <span className="text-xs text-green-400">✓</span>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AchievementBadge;
