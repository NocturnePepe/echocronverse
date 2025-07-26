import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export interface EmberParticle {
  id: string;
  x: number;
  y: number;
  size: number;
  color: 'ember' | 'cosmic' | 'mystical' | 'shadow';
  lifetime: number;
  speed: number;
  direction: number;
  opacity: number;
}

export interface EmberParticlesProps {
  count?: number;
  isActive?: boolean;
  variant?: 'ambient' | 'intense' | 'mystical' | 'memory-lock';
  triggerMemoryReveal?: boolean;
  onMemoryTrigger?: () => void;
  containerSize?: { width: number; height: number };
  className?: string;
  interactionRadius?: number;
  mouseFollow?: boolean;
}

const EmberParticles: React.FC<EmberParticlesProps> = ({
  count = 20,
  isActive = true,
  variant = 'ambient',
  triggerMemoryReveal = false,
  onMemoryTrigger,
  containerSize = { width: 100, height: 100 },
  className = '',
  interactionRadius = 100,
  mouseFollow = false
}) => {
  const [particles, setParticles] = useState<EmberParticle[]>([]);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [memoryPulse, setMemoryPulse] = useState(false);

  // Color schemes for different particle variants
  const colorSchemes = {
    ember: {
      colors: ['#f97316', '#ea580c', '#dc2626', '#b91c1c'],
      glow: 'rgba(249, 115, 22, 0.6)',
      shadow: '0 0 10px rgba(249, 115, 22, 0.4)'
    },
    cosmic: {
      colors: ['#8b5cf6', '#7c3aed', '#6366f1', '#4f46e5'],
      glow: 'rgba(139, 92, 246, 0.6)',
      shadow: '0 0 15px rgba(139, 92, 246, 0.5)'
    },
    mystical: {
      colors: ['#06b6d4', '#0891b2', '#0e7490', '#155e75'],
      glow: 'rgba(6, 182, 212, 0.6)',
      shadow: '0 0 12px rgba(6, 182, 212, 0.4)'
    },
    shadow: {
      colors: ['#4b5563', '#374151', '#1f2937', '#111827'],
      glow: 'rgba(75, 85, 99, 0.4)',
      shadow: '0 0 8px rgba(75, 85, 99, 0.3)'
    }
  };

  // Variant configurations
  const variantConfig = {
    ambient: {
      particleCount: 15,
      speed: { min: 0.5, max: 2 },
      size: { min: 2, max: 6 },
      lifetime: { min: 3000, max: 8000 },
      spawnRate: 200
    },
    intense: {
      particleCount: 40,
      speed: { min: 1, max: 4 },
      size: { min: 3, max: 8 },
      lifetime: { min: 2000, max: 5000 },
      spawnRate: 100
    },
    mystical: {
      particleCount: 25,
      speed: { min: 0.3, max: 1.5 },
      size: { min: 4, max: 10 },
      lifetime: { min: 4000, max: 10000 },
      spawnRate: 300
    },
    'memory-lock': {
      particleCount: 30,
      speed: { min: 0.8, max: 3 },
      size: { min: 5, max: 12 },
      lifetime: { min: 3000, max: 7000 },
      spawnRate: 150
    }
  };

  const config = variantConfig[variant];

  // Generate unique particle ID
  const generateId = () => `particle-${Date.now()}-${Math.random()}`;

  // Create new particle
  const createParticle = (mouseX?: number, mouseY?: number): EmberParticle => {
    const colorTypes: Array<EmberParticle['color']> = ['ember', 'cosmic', 'mystical', 'shadow'];
    const baseX = mouseX !== undefined ? mouseX : Math.random() * containerSize.width;
    const baseY = mouseY !== undefined ? mouseY : Math.random() * containerSize.height;
    
    return {
      id: generateId(),
      x: baseX + (Math.random() - 0.5) * 50,
      y: baseY + (Math.random() - 0.5) * 50,
      size: config.size.min + Math.random() * (config.size.max - config.size.min),
      color: variant === 'mystical' ? 'mystical' : 
             variant === 'memory-lock' ? 'cosmic' :
             colorTypes[Math.floor(Math.random() * colorTypes.length)],
      lifetime: config.lifetime.min + Math.random() * (config.lifetime.max - config.lifetime.min),
      speed: config.speed.min + Math.random() * (config.speed.max - config.speed.min),
      direction: Math.random() * Math.PI * 2,
      opacity: 0.7 + Math.random() * 0.3
    };
  };

  // Initialize particles
  useEffect(() => {
    if (!isActive) {
      setParticles([]);
      return;
    }

    const initialParticles = Array.from({ length: Math.min(count, config.particleCount) }, () => 
      createParticle()
    );
    setParticles(initialParticles);
  }, [isActive, count, variant, containerSize.width, containerSize.height]);

  // Particle lifecycle management
  useEffect(() => {
    if (!isActive) return;

    const interval = setInterval(() => {
      setParticles(prevParticles => {
        const now = Date.now();
        let newParticles = prevParticles
          .map(particle => ({
            ...particle,
            x: particle.x + Math.cos(particle.direction) * particle.speed,
            y: particle.y + Math.sin(particle.direction) * particle.speed,
            opacity: Math.max(0, particle.opacity - 0.01)
          }))
          .filter(particle => {
            const age = now - parseInt(particle.id.split('-')[1]);
            return age < particle.lifetime && 
                   particle.x > -50 && particle.x < containerSize.width + 50 &&
                   particle.y > -50 && particle.y < containerSize.height + 50 &&
                   particle.opacity > 0.1;
          });

        // Spawn new particles to maintain count
        while (newParticles.length < Math.min(count, config.particleCount)) {
          newParticles.push(createParticle());
        }

        return newParticles;
      });
    }, 50);

    return () => clearInterval(interval);
  }, [isActive, count, config, containerSize.width, containerSize.height]);

  // Mouse interaction
  useEffect(() => {
    if (!mouseFollow) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = (e.currentTarget as HTMLElement)?.getBoundingClientRect();
      if (rect) {
        setMousePos({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top
        });
      }
    };

    document.addEventListener('mousemove', handleMouseMove);
    return () => document.removeEventListener('mousemove', handleMouseMove);
  }, [mouseFollow]);

  // Memory reveal trigger
  useEffect(() => {
    if (triggerMemoryReveal) {
      setMemoryPulse(true);
      
      // Create burst of particles
      const burstParticles = Array.from({ length: 20 }, () => createParticle(
        containerSize.width / 2,
        containerSize.height / 2
      ));
      
      setParticles(prev => [...prev, ...burstParticles]);
      
      if (onMemoryTrigger) {
        setTimeout(onMemoryTrigger, 1000);
      }
      
      setTimeout(() => setMemoryPulse(false), 2000);
    }
  }, [triggerMemoryReveal, onMemoryTrigger, containerSize.width, containerSize.height]);

  // Mouse-influenced particles
  const influencedParticles = useMemo(() => {
    if (!mouseFollow) return particles;

    return particles.map(particle => {
      const dx = mousePos.x - particle.x;
      const dy = mousePos.y - particle.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance < interactionRadius) {
        const force = (interactionRadius - distance) / interactionRadius;
        return {
          ...particle,
          x: particle.x + dx * force * 0.1,
          y: particle.y + dy * force * 0.1,
          size: particle.size * (1 + force * 0.5),
          opacity: Math.min(1, particle.opacity + force * 0.3)
        };
      }
      
      return particle;
    });
  }, [particles, mousePos, mouseFollow, interactionRadius]);

  if (!isActive) return null;

  return (
    <div className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`}>
      <AnimatePresence>
        {influencedParticles.map(particle => {
          const scheme = colorSchemes[particle.color];
          return (
            <motion.div
              key={particle.id}
              className="absolute rounded-full"
              style={{
                left: particle.x,
                top: particle.y,
                width: particle.size,
                height: particle.size,
                background: `radial-gradient(circle, ${scheme.colors[0]}, ${scheme.colors[1]})`,
                boxShadow: memoryPulse ? `${scheme.shadow}, 0 0 20px ${scheme.glow}` : scheme.shadow,
                opacity: particle.opacity
              }}
              initial={{ 
                scale: 0, 
                opacity: 0,
                filter: 'brightness(2)'
              }}
              animate={{ 
                scale: memoryPulse ? [1, 2, 1] : 1,
                opacity: particle.opacity,
                filter: memoryPulse ? 'brightness(3)' : 'brightness(1)',
                rotate: variant === 'mystical' ? [0, 360] : 0
              }}
              exit={{ 
                scale: 0, 
                opacity: 0,
                transition: { duration: 0.5 }
              }}
              transition={{
                scale: { duration: memoryPulse ? 1 : 0.3 },
                rotate: { duration: 10, repeat: Infinity, ease: "linear" },
                filter: { duration: 0.5 }
              }}
            />
          );
        })}
      </AnimatePresence>

      {/* Memory Lock Overlay Effect */}
      {variant === 'memory-lock' && memoryPulse && (
        <motion.div
          className="absolute inset-0 bg-gradient-radial from-purple-500/20 via-transparent to-transparent"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ 
            opacity: [0, 0.8, 0],
            scale: [0, 2, 0]
          }}
          transition={{ duration: 2, ease: "easeOut" }}
        />
      )}

      {/* Mystical Rune Overlay */}
      {variant === 'mystical' && memoryPulse && (
        <motion.div
          className="absolute inset-0 flex items-center justify-center text-6xl text-cyan-400 opacity-30 select-none"
          style={{ fontFamily: 'monospace' }}
          initial={{ opacity: 0, rotate: 0, scale: 0 }}
          animate={{ 
            opacity: [0, 0.6, 0],
            rotate: [0, 180, 360],
            scale: [0, 1.5, 0]
          }}
          transition={{ duration: 3, ease: "easeInOut" }}
        >
          ⟐
        </motion.div>
      )}
    </div>
  );
};

export default EmberParticles;
