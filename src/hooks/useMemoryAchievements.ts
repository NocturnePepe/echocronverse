import { useState, useEffect } from 'react';

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  tier: 'initiate' | 'adept' | 'master' | 'oracle';
  unlocked: boolean;
  unlockedAt?: Date;
}

interface MemoryAchievements {
  achievements: Achievement[];
  totalUnlocked: number;
  currentTier: string;
}

const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first_memory',
    title: 'First Echo',
    description: 'Store your first temporal memory',
    icon: '🧠',
    tier: 'initiate',
    unlocked: false
  },
  {
    id: 'lore_reader',
    title: 'Lore Seeker',
    description: 'Read your first lore chamber',
    icon: '📚',
    tier: 'initiate',
    unlocked: false
  },
  {
    id: 'memory_hoarder',
    title: 'Memory Hoarder',
    description: 'Accumulate 10 temporal memories',
    icon: '💎',
    tier: 'adept',
    unlocked: false
  },
  {
    id: 'lore_master',
    title: 'Lore Master',
    description: 'Complete all 5 lore chambers',
    icon: '👑',
    tier: 'master',
    unlocked: false
  },
  {
    id: 'ai_whisperer',
    title: 'AI Whisperer',
    description: 'Use all 4 CronoXai commands',
    icon: '🤖',
    tier: 'adept',
    unlocked: false
  },
  {
    id: 'temporal_oracle',
    title: 'Temporal Oracle',
    description: 'Achieve 50+ memories and master all systems',
    icon: '🔮',
    tier: 'oracle',
    unlocked: false
  }
];

export function useMemoryAchievements(): MemoryAchievements {
  const [achievements, setAchievements] = useState<Achievement[]>(() => {
    const saved = localStorage.getItem('echocron_achievements');
    return saved ? JSON.parse(saved) : ACHIEVEMENTS;
  });

  const checkAchievements = () => {
    const memories = JSON.parse(localStorage.getItem('cronoxai_memories') || '[]');
    const loreProgress = JSON.parse(localStorage.getItem('echocron_lore_progress') || '{}');
    
    setAchievements(prev => {
      const updated = prev.map(achievement => {
        if (achievement.unlocked) return achievement;

        let shouldUnlock = false;
        
        switch (achievement.id) {
          case 'first_memory':
            shouldUnlock = memories.length > 0;
            break;
          case 'lore_reader':
            shouldUnlock = Object.keys(loreProgress).length > 0;
            break;
          case 'memory_hoarder':
            shouldUnlock = memories.length >= 10;
            break;
          case 'lore_master':
            shouldUnlock = Object.keys(loreProgress).length >= 5;
            break;
          case 'ai_whisperer':
            shouldUnlock = memories.some((m: any) => 
              m.content.includes('/prophecy') || 
              m.content.includes('/memory') || 
              m.content.includes('/sigil') || 
              m.content.includes('/help')
            );
            break;
          case 'temporal_oracle':
            shouldUnlock = memories.length >= 50 && Object.keys(loreProgress).length >= 5;
            break;
        }

        if (shouldUnlock) {
          return { ...achievement, unlocked: true, unlockedAt: new Date() };
        }
        return achievement;
      });

      localStorage.setItem('echocron_achievements', JSON.stringify(updated));
      return updated;
    });
  };

  useEffect(() => {
    checkAchievements();
    const interval = setInterval(checkAchievements, 5000); // Check every 5 seconds
    return () => clearInterval(interval);
  }, []);

  const totalUnlocked = achievements.filter(a => a.unlocked).length;
  const currentTier = achievements
    .filter(a => a.unlocked)
    .reduce((highest, a) => {
      const tiers = ['initiate', 'adept', 'master', 'oracle'];
      return tiers.indexOf(a.tier) > tiers.indexOf(highest) ? a.tier : highest;
    }, 'initiate');

  return {
    achievements,
    totalUnlocked,
    currentTier
  };
}
