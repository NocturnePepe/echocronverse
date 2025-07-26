import React from 'react';
import { motion } from 'framer-motion';

interface RuneLoaderProps {
  isLoading: boolean;
  text?: string;
  size?: 'sm' | 'md' | 'lg';
}

const RuneLoader: React.FC<RuneLoaderProps> = ({ 
  isLoading, 
  text = "Channeling temporal energies...", 
  size = 'md' 
}) => {
  const runeSymbols = ['⟐', '⟡', '⟢', '⟣', '⟤', '⟥', '⟦', '⟧'];
  
  const sizeClasses = {
    sm: 'text-2xl',
    md: 'text-4xl', 
    lg: 'text-6xl'
  };

  const containerSizes = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24',
    lg: 'w-32 h-32'
  };

  if (!isLoading) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center"
    >
      <div className="text-center">
        {/* Outer Ring */}
        <motion.div
          className={`${containerSizes[size]} mx-auto mb-6 relative`}
          animate={{ rotate: 360 }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
        >
          {runeSymbols.map((rune, index) => (
            <motion.div
              key={index}
              className={`absolute ${sizeClasses[size]} text-purple-400`}
              style={{
                top: '50%',
                left: '50%',
                transformOrigin: '0 0',
                transform: `translate(-50%, -50%) rotate(${index * 45}deg) translateY(-${size === 'lg' ? '4rem' : size === 'md' ? '3rem' : '2rem'})`
              }}
              animate={{
                opacity: [0.3, 1, 0.3],
                scale: [0.8, 1.2, 0.8],
                textShadow: [
                  '0 0 5px rgba(168, 85, 247, 0.5)',
                  '0 0 20px rgba(168, 85, 247, 0.8)',
                  '0 0 5px rgba(168, 85, 247, 0.5)'
                ]
              }}
              transition={{ 
                duration: 2, 
                repeat: Infinity, 
                delay: index * 0.2,
                ease: "easeInOut"
              }}
            >
              {rune}
            </motion.div>
          ))}
        </motion.div>

        {/* Center Sigil */}
        <motion.div
          className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 ${sizeClasses[size]} text-cyan-400`}
          animate={{
            rotate: [-360, 0],
            scale: [0.5, 1, 0.5],
            textShadow: [
              '0 0 10px rgba(6, 182, 212, 0.8)',
              '0 0 30px rgba(6, 182, 212, 1)',
              '0 0 10px rgba(6, 182, 212, 0.8)'
            ]
          }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        >
          ◉
        </motion.div>

        {/* Loading Text */}
        <motion.p
          className="text-zinc-300 text-lg font-mono mt-8"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          {text}
        </motion.p>

        {/* Ritual Dots */}
        <div className="flex justify-center space-x-2 mt-4">
          {[0, 1, 2].map((dot) => (
            <motion.div
              key={dot}
              className="w-2 h-2 bg-purple-400 rounded-full"
              animate={{
                scale: [0.5, 1, 0.5],
                opacity: [0.3, 1, 0.3]
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                delay: dot * 0.3
              }}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default RuneLoader;
