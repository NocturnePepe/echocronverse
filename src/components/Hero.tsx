import React from 'react';
import { motion } from 'framer-motion';

const Hero: React.FC = () => {
  return (
    <section className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-b from-black via-zinc-900 to-black">
      {/* Background particles/stars */}
      <div className="absolute inset-0">
        {[...Array(50)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-blue-400 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0.2, 1, 0.2],
              scale: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 2 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Central echo pulse */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 0.1 }}
        transition={{ duration: 2, delay: 1 }}
      >
        <motion.div
          className="w-96 h-96 rounded-full border-2 border-blue-500/30"
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.3, 0.1, 0.3],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </motion.div>

      {/* Hero content */}
      <div className="relative z-10 text-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="mb-8"
        >
          <motion.h1
            className="text-4xl sm:text-6xl lg:text-7xl font-bold text-zinc-100 mb-6"
            style={{ fontFamily: 'Unbounded, cursive' }}
            animate={{
              textShadow: [
                "0 0 10px rgb(59 130 246 / 0.5)",
                "0 0 20px rgb(59 130 246 / 0.8), 0 0 30px rgb(59 130 246 / 0.6)",
                "0 0 10px rgb(59 130 246 / 0.5)"
              ]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            Welcome to the
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 animate-echo-pulse">
              Echocronverse
            </span>
          </motion.h1>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1 }}
          className="text-lg sm:text-xl text-zinc-400 max-w-2xl mx-auto leading-relaxed"
          style={{ fontFamily: 'Orbitron, monospace' }}
        >
          Enter a dark universe where Web3 meets arcane technology.
          <br />
          Trade, explore, and command through the echoes of time.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 1.5 }}
          className="mt-12"
        >
          <motion.button
            whileHover={{ 
              scale: 1.05,
              boxShadow: "0 0 25px rgb(59 130 246 / 0.6)"
            }}
            whileTap={{ scale: 0.95 }}
            className="rune-border px-8 py-4 text-lg font-medium text-zinc-100 rounded-lg transition-all duration-300 hover:bg-blue-900/20"
            style={{ fontFamily: 'Unbounded, cursive' }}
          >
            Enter the Verse
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
