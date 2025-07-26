import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp, Scroll } from 'lucide-react';

const LoreBlock: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [displayText, setDisplayText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const loreText = `In the depths of the digital void, where ancient algorithms whisper forgotten protocols, lies the Echocronverse—a realm where time bends to the will of those who understand its cryptic nature.

Here, the CronoXai terminal serves as your gateway, interpreting the echoes of past and future transactions. The EchoDEX stands as a monolithic exchange, where tokens flow like temporal currents through the fabric of decentralized reality.

Every transaction leaves an echo, every decision ripples through the chronostream. The question remains: Will you master the echoes, or become lost in their infinite reverberations?

The ancients spoke of a prophecy—when the final echo aligns with the first, the true nature of the Echocronverse shall be revealed to those who dare to listen.`;

  useEffect(() => {
    if (isExpanded && !isTyping) {
      setIsTyping(true);
      setDisplayText('');
      let currentIndex = 0;
      
      const typeInterval = setInterval(() => {
        if (currentIndex < loreText.length) {
          setDisplayText(loreText.slice(0, currentIndex + 1));
          currentIndex++;
        } else {
          clearInterval(typeInterval);
          setIsTyping(false);
        }
      }, 30);

      return () => clearInterval(typeInterval);
    } else if (!isExpanded) {
      setDisplayText('');
      setIsTyping(false);
    }
  }, [isExpanded, loreText]);

  return (
    <section className="py-20 px-4 bg-gradient-to-b from-black to-zinc-900">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <motion.div
            className="inline-flex items-center gap-3 mb-6"
            whileHover={{ scale: 1.02 }}
          >
            <Scroll className="w-8 h-8 text-blue-400" />
            <h2 className="text-3xl sm:text-4xl font-bold text-zinc-100" style={{ fontFamily: 'Unbounded, cursive' }}>
              Ancient Lore
            </h2>
            <Scroll className="w-8 h-8 text-blue-400 scale-x-[-1]" />
          </motion.div>
          
          <p className="text-zinc-400 text-lg mb-8" style={{ fontFamily: 'Orbitron, monospace' }}>
            Uncover the mysteries that bind the Echocronverse together
          </p>

          <motion.button
            onClick={() => setIsExpanded(!isExpanded)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="rune-border px-6 py-3 text-zinc-100 font-medium rounded-lg transition-all duration-300 hover:bg-blue-900/20 inline-flex items-center gap-2"
            style={{ fontFamily: 'Unbounded, cursive' }}
          >
            {isExpanded ? 'Conceal the Lore' : 'Reveal the Lore'}
            {isExpanded ? (
              <ChevronUp className="w-5 h-5" />
            ) : (
              <ChevronDown className="w-5 h-5" />
            )}
          </motion.button>
        </motion.div>

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0, scale: 0.95 }}
              animate={{ opacity: 1, height: 'auto', scale: 1 }}
              exit={{ opacity: 0, height: 0, scale: 0.95 }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
              className="rune-border rounded-lg p-8 bg-gradient-to-br from-zinc-900/50 to-black/50 backdrop-blur-sm"
            >
              <div className="relative">
                {/* Decorative runes in corners */}
                <div className="absolute -top-2 -left-2 w-6 h-6 border-l-2 border-t-2 border-blue-400/60"></div>
                <div className="absolute -top-2 -right-2 w-6 h-6 border-r-2 border-t-2 border-blue-400/60"></div>
                <div className="absolute -bottom-2 -left-2 w-6 h-6 border-l-2 border-b-2 border-blue-400/60"></div>
                <div className="absolute -bottom-2 -right-2 w-6 h-6 border-r-2 border-b-2 border-blue-400/60"></div>

                <motion.div
                  className="text-zinc-300 leading-relaxed text-base sm:text-lg"
                  style={{ fontFamily: 'Orbitron, monospace', minHeight: '200px' }}
                >
                  {displayText.split('\n\n').map((paragraph, index) => (
                    <motion.p
                      key={index}
                      className="mb-6 last:mb-0"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: paragraph.length > 0 ? 1 : 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      {paragraph}
                      {isTyping && index === displayText.split('\n\n').length - 1 && (
                        <motion.span
                          className="inline-block w-2 h-5 bg-blue-400 ml-1"
                          animate={{ opacity: [1, 0, 1] }}
                          transition={{ duration: 0.8, repeat: Infinity }}
                        />
                      )}
                    </motion.p>
                  ))}
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default LoreBlock;
