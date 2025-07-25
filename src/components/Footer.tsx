import React from 'react';
import { motion } from 'framer-motion';
import { Github, Twitter, MessageCircle } from 'lucide-react';

const Footer: React.FC = () => {
  // Rune symbols for decoration
  const runeSymbols = ['ᚱ', 'ᚢ', 'ᚾ', 'ᛖ', 'ᛊ', 'ᛏ', 'ᚦ', 'ᚨ'];

  return (
    <footer className="relative bg-gradient-to-t from-black via-zinc-900 to-black py-16 overflow-hidden">
      {/* Ember particles */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-orange-400 rounded-full ember-particle opacity-60"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0.2, 0.8, 0.2],
              scale: [0.5, 1.2, 0.5],
              y: [0, -20, 0],
            }}
            transition={{
              duration: 4 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 3,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4">
        {/* Rune sigils row */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="flex justify-center items-center mb-12"
        >
          {runeSymbols.map((rune, index) => (
            <motion.div
              key={index}
              className="mx-4 text-2xl text-blue-400/70 font-bold"
              animate={{
                textShadow: [
                  "0 0 5px rgb(59 130 246 / 0.5)",
                  "0 0 15px rgb(59 130 246 / 0.8)",
                  "0 0 5px rgb(59 130 246 / 0.5)"
                ]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                delay: index * 0.2,
                ease: "easeInOut"
              }}
              whileHover={{
                scale: 1.3,
                textShadow: "0 0 20px rgb(59 130 246 / 1)"
              }}
            >
              {rune}
            </motion.div>
          ))}
        </motion.div>

        {/* Main footer content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {/* Brand section */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center md:text-left"
          >
            <h3 className="text-2xl font-bold text-zinc-100 mb-4" style={{ fontFamily: 'Unbounded, cursive' }}>
              Echocronverse
            </h3>
            <p className="text-zinc-400 text-sm leading-relaxed" style={{ fontFamily: 'Orbitron, monospace' }}>
              Where time echoes through the digital void, and every transaction 
              ripples across the chronostream of decentralized reality.
            </p>
          </motion.div>

          {/* Links section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h4 className="text-lg font-semibold text-zinc-100 mb-4" style={{ fontFamily: 'Unbounded, cursive' }}>
              Explore
            </h4>
            <div className="space-y-2">
              {['CronoXai Terminal', 'EchoDEX Exchange', 'Lore Archives', 'Community'].map((link) => (
                <motion.a
                  key={link}
                  href="#"
                  className="block text-zinc-400 hover:text-blue-400 text-sm transition-colors duration-300"
                  style={{ fontFamily: 'Orbitron, monospace' }}
                  whileHover={{ x: 5 }}
                  transition={{ duration: 0.2 }}
                >
                  {link}
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Social section */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
            className="text-center md:text-right"
          >
            <h4 className="text-lg font-semibold text-zinc-100 mb-4" style={{ fontFamily: 'Unbounded, cursive' }}>
              Join the Echo
            </h4>
            <div className="flex justify-center md:justify-end space-x-4">
              {[
                { icon: Twitter, href: '#' },
                { icon: Github, href: '#' },
                { icon: MessageCircle, href: '#' }
              ].map((social, index) => (
                <motion.a
                  key={index}
                  href={social.href}
                  className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-400 hover:text-blue-400 hover:bg-zinc-700 transition-all duration-300"
                  whileHover={{ 
                    scale: 1.1,
                    boxShadow: "0 0 15px rgb(59 130 246 / 0.5)"
                  }}
                  whileTap={{ scale: 0.95 }}
                >
                  <social.icon className="w-5 h-5" />
                </motion.a>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Bottom border and copyright */}
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          whileInView={{ opacity: 1, scaleX: 1 }}
          transition={{ duration: 1, delay: 0.6 }}
          viewport={{ once: true }}
          className="border-t border-zinc-800 pt-8"
        >
          <div className="flex flex-col md:flex-row justify-between items-center">
            <motion.p
              className="text-zinc-500 text-sm mb-4 md:mb-0"
              style={{ fontFamily: 'Orbitron, monospace' }}
              animate={{
                opacity: [0.5, 1, 0.5]
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              © 2025 Echocronverse. All echoes reserved.
            </motion.p>
            
            <motion.div
              className="text-zinc-500 text-sm"
              style={{ fontFamily: 'Orbitron, monospace' }}
              whileHover={{ textShadow: "0 0 10px rgb(59 130 246 / 0.6)" }}
            >
              Powered by the Chronostream
            </motion.div>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
