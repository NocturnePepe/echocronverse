import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { Lock } from 'lucide-react';
import { useNavigationStore } from '../stores/navigationStore';
import RitualUnlock from './RitualUnlock';

const Nav: React.FC = () => {
  const location = useLocation();
  const { isPathUnlocked } = useNavigationStore();
  const [showRitual, setShowRitual] = useState<string | null>(null);
  
  const navItems = [
    { name: 'Echocronverse', path: '/' },
    { 
      name: 'CronoXai', 
      path: '/cronoxai',
      ritual: {
        name: 'Oracle\'s Communion',
        description: 'Establish connection with the temporal AI',
        requirement: 'Meditate on the cosmic void for 10 seconds',
        steps: 10
      }
    },
    { 
      name: 'EchoDEX', 
      path: '/echodex',
      ritual: {
        name: 'Merchant\'s Covenant',
        description: 'Complete the ancient trading ritual',
        requirement: 'Click the Echo sigil 7 times',
        steps: 7
      }
    },
    { 
      name: 'Wallet', 
      path: '/wallet',
      ritual: {
        name: 'Guardian\'s Trust',
        description: 'Prove worthy of cosmic vault access',
        requirement: 'Trace the mystical sigils',
        steps: 5
      }
    },
    { 
      name: 'Lore', 
      path: '/lore',
      ritual: {
        name: 'Scholar\'s Initiation',
        description: 'Unlock the sacred archives',
        requirement: 'Accumulate temporal memories through interaction',
        steps: 3
      }
    }
  ];

  const handleNavClick = (item: typeof navItems[0], e: React.MouseEvent) => {
    if (item.path !== '/' && !isPathUnlocked(item.path)) {
      e.preventDefault();
      setShowRitual(item.path);
    }
  };

  return (
    <>
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
                const isUnlocked = isPathUnlocked(item.path);
                const canAccess = item.path === '/' || isUnlocked;
                
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
                      to={canAccess ? item.path : '#'}
                      onClick={(e) => handleNavClick(item, e)}
                      className={`px-3 py-2 text-sm font-medium tracking-wider transition-all duration-300 relative group flex items-center ${
                        isActive 
                          ? 'text-blue-400' 
                          : canAccess
                            ? 'text-zinc-100 hover:text-blue-400'
                            : 'text-zinc-500 cursor-pointer hover:text-purple-400'
                      }`}
                      style={{ fontFamily: 'Unbounded, cursive' }}
                    >
                      {!canAccess && <Lock className="w-3 h-3 mr-1" />}
                      {item.name}
                      <span 
                        className={`absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r ${
                          canAccess 
                            ? 'from-blue-400 to-blue-600' 
                            : 'from-purple-400 to-purple-600'
                        } transform transition-transform duration-300 origin-left ${
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

      <AnimatePresence>
        {showRitual && (
          <RitualUnlock
            path={showRitual}
            ritual={navItems.find(item => item.path === showRitual)?.ritual!}
            onUnlock={() => setShowRitual(null)}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default Nav;
