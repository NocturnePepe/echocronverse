import React from 'react';
import { motion } from 'framer-motion';

const Nav: React.FC = () => {
  const navItems = [
    { name: 'Echocronverse', href: '#home' },
    { name: 'CronoXai', href: '#cronoxai' },
    { name: 'EchoDEX', href: '#echodex' }
  ];

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-md border-b border-zinc-800"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-center items-center h-16">
          <div className="flex space-x-8">
            {navItems.map((item, index) => (
              <motion.a
                key={item.name}
                href={item.href}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ 
                  duration: 0.6, 
                  delay: index * 0.1,
                  ease: "easeOut" 
                }}
                whileHover={{ 
                  scale: 1.05,
                  textShadow: "0 0 8px rgb(59 130 246 / 0.8)"
                }}
                className="text-zinc-100 hover:text-blue-400 px-3 py-2 text-sm font-medium tracking-wider transition-all duration-300 relative group"
                style={{ fontFamily: 'Unbounded, cursive' }}
              >
                {item.name}
                <span className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-blue-400 to-blue-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
              </motion.a>
            ))}
          </div>
        </div>
      </div>
    </motion.nav>
  );
};

export default Nav;
