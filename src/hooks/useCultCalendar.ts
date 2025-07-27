import { useState, useEffect } from 'react';

interface CultCalendar {
  currentSeason: 'void' | 'ember' | 'crystal' | 'shadow';
  seasonDescription: string;
  daysInSeason: number;
  currentDay: number;
  specialEvents: SpecialEvent[];
  seasonalBonus: string;
}

interface SpecialEvent {
  name: string;
  description: string;
  isActive: boolean;
  duration: number; // hours
}

const SEASONS = {
  void: {
    name: 'Void Convergence',
    description: 'When the digital void whispers its darkest secrets',
    bonus: 'Enhanced memory accumulation (+25%)',
    color: '#1f2937',
    particle: 'mystical'
  },
  ember: {
    name: 'Ember Awakening',
    description: 'The eternal flames dance with renewed vigor',
    bonus: 'Particle effects intensified',
    color: '#dc2626',
    particle: 'intense'
  },
  crystal: {
    name: 'Crystal Resonance',
    description: 'Crystalline structures reveal hidden knowledge',
    bonus: 'Lore chambers unlock faster',
    color: '#2563eb',
    particle: 'ambient'
  },
  shadow: {
    name: 'Shadow Dominion',
    description: 'The shadows grow long and reveal forgotten truths',
    bonus: 'AI commands more powerful',
    color: '#7c3aed',
    particle: 'memory-lock'
  }
};

export function useCultCalendar(): CultCalendar {
  const [calendar, setCalendar] = useState<CultCalendar>(() => {
    const saved = localStorage.getItem('echocron_calendar');
    if (saved) {
      return JSON.parse(saved);
    }
    
    // Initialize based on current date
    const now = new Date();
    const dayOfYear = Math.floor((now.getTime() - new Date(now.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24));
    const seasonIndex = Math.floor(dayOfYear / 91) % 4; // ~91 days per season
    const seasons = ['void', 'ember', 'crystal', 'shadow'] as const;
    const currentSeason = seasons[seasonIndex];
    
    return {
      currentSeason,
      seasonDescription: SEASONS[currentSeason].description,
      daysInSeason: 91,
      currentDay: dayOfYear % 91,
      specialEvents: [],
      seasonalBonus: SEASONS[currentSeason].bonus
    };
  });

  useEffect(() => {
    const checkForEvents = () => {
      const now = new Date();
      const hour = now.getHours();
      
      // Special events based on time
      const events: SpecialEvent[] = [];
      
      // Midnight Ritual (00:00-01:00)
      if (hour === 0) {
        events.push({
          name: 'Midnight Ritual',
          description: 'The veil is thinnest. Memory accumulation doubled.',
          isActive: true,
          duration: 1
        });
      }
      
      // Eclipse Hour (12:00-13:00 on weekends)
      if (hour === 12 && (now.getDay() === 0 || now.getDay() === 6)) {
        events.push({
          name: 'Digital Eclipse',
          description: 'Rare cosmic alignment. All achievements progress faster.',
          isActive: true,
          duration: 1
        });
      }
      
      // Weekly Convergence (Friday 18:00-21:00)
      if (now.getDay() === 5 && hour >= 18 && hour <= 20) {
        events.push({
          name: 'Weekly Convergence',
          description: 'Cult members gather. Shared memory bonuses active.',
          isActive: true,
          duration: 3
        });
      }
      
      setCalendar(prev => {
        const updated = { ...prev, specialEvents: events };
        localStorage.setItem('echocron_calendar', JSON.stringify(updated));
        return updated;
      });
    };
    
    checkForEvents();
    const interval = setInterval(checkForEvents, 60000); // Check every minute
    
    return () => clearInterval(interval);
  }, []);

  return calendar;
}

export function getSeasonalTheme(season: string) {
  return SEASONS[season as keyof typeof SEASONS] || SEASONS.void;
}
