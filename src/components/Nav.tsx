import React from 'react';
import { motion } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';

const Nav: React.FC = () => {
  const location = useLocation();
  
  const navItems = [
    { name: 'Echocronverse', path: '/' },
    { name: 'CronoXai', path: '/cronoxai' },
    { name: 'EchoDEX', path: '/echodex' },
    { name: 'Wallet', path: '/wallet' }
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
            {navItems.map((item, index) => {
              const isActive = location.pathname === item.path;
              return (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ 
                    duration: 0.6, 
                    delay: index * 0.1,
                    ease: "easeOut" 
                  }}
                >
                  <Link
                    to={item.path}
                    className={`px-3 py-2 text-sm font-medium tracking-wider transition-all duration-300 relative group ${
                      isActive 
                        ? 'text-blue-400' 
                        : 'text-zinc-100 hover:text-blue-400'
                    }`}
                    style={{ fontFamily: 'Unbounded, cursive' }}
                  >
                    {item.name}
                    <span 
                      className={`absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-blue-400 to-blue-600 transform transition-transform duration-300 origin-left ${
                        isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                      }`}
                    ></span>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </motion.nav>
  );
};

export default Nav;
