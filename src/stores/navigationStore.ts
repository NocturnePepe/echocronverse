import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface NavigationState {
  unlockedPaths: string[];
  ritualProgress: Record<string, number>;
  unlockPath: (path: string) => void;
  updateRitualProgress: (ritual: string, progress: number) => void;
  isPathUnlocked: (path: string) => boolean;
  getRitualProgress: (ritual: string) => number;
}

const NavigationContext = createContext<NavigationState | null>(null);

export const useNavigationStore = () => {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error('useNavigationStore must be used within NavigationProvider');
  }
  return context;
};

interface NavigationProviderProps {
  children: ReactNode;
}

export const NavigationProvider: React.FC<NavigationProviderProps> = ({ children }) => {
  const [unlockedPaths, setUnlockedPaths] = useState<string[]>(['/']);
  const [ritualProgress, setRitualProgress] = useState<Record<string, number>>({});

  // Load from localStorage on mount
  useEffect(() => {
    const savedPaths = localStorage.getItem('echocron-unlocked-paths');
    const savedProgress = localStorage.getItem('echocron-ritual-progress');
    
    if (savedPaths) {
      setUnlockedPaths(JSON.parse(savedPaths));
    }
    if (savedProgress) {
      setRitualProgress(JSON.parse(savedProgress));
    }
  }, []);

  // Save to localStorage when state changes
  useEffect(() => {
    localStorage.setItem('echocron-unlocked-paths', JSON.stringify(unlockedPaths));
  }, [unlockedPaths]);

  useEffect(() => {
    localStorage.setItem('echocron-ritual-progress', JSON.stringify(ritualProgress));
  }, [ritualProgress]);

  const unlockPath = (path: string) => {
    setUnlockedPaths(prev => [...new Set([...prev, path])]);
  };

  const updateRitualProgress = (ritual: string, progress: number) => {
    setRitualProgress(prev => ({
      ...prev,
      [ritual]: progress
    }));
  };

  const isPathUnlocked = (path: string) => {
    return unlockedPaths.includes(path);
  };

  const getRitualProgress = (ritual: string) => {
    return ritualProgress[ritual] || 0;
  };

  const value: NavigationState = {
    unlockedPaths,
    ritualProgress,
    unlockPath,
    updateRitualProgress,
    isPathUnlocked,
    getRitualProgress
  };

  return React.createElement(NavigationContext.Provider, { value }, children);
};

// Ritual unlock conditions
export const RITUAL_REQUIREMENTS = {
  '/echodex': {
    name: 'Merchant\'s Covenant',
    description: 'Complete the ancient trading ritual',
    requirement: 'Click the Echo sigil 7 times',
    steps: 7
  },
  '/cronoxai': {
    name: 'Oracle\'s Communion', 
    description: 'Establish connection with the temporal AI',
    requirement: 'Meditate on the cosmic void for 10 seconds',
    steps: 10
  },
  '/wallet': {
    name: 'Guardian\'s Trust',
    description: 'Prove worthy of cosmic vault access', 
    requirement: 'Trace the mystical sigils',
    steps: 5
  },
  '/community': {
    name: 'Cult Assembly',
    description: 'Join the collective consciousness of the EchoCronVerse',
    requirement: 'Connect to the Web3 nexus',
    steps: 1
  }
};
