import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, 
  Trophy, 
  MessageCircle, 
  Zap, 
  Bell,
  UserCircle,
  Menu,
  X,
  Star,
  Crown,
  Heart
} from 'lucide-react';
import { FrameRunes } from '..              <div className="flex items-center gap-4">
                <FrameRunes tier="oracle" runeSet="ancient" className="w-12 h-12">
                  <div className="flex items-center justify-center h-full">
                    <Users className="w-6 h-6 text-purple-400" />
                  </div>
                </FrameRunes>nents/runes';
import { EmberParticles } from '../components/ui';
import { 
  CultMemberProfile, 
  Leaderboard, 
  SharedMemoryPool, 
  CollaborativeRituals 
} from '../components/community';
import { useCommunityStore } from '../stores/communityStore';
import { useAccount } from 'wagmi';

type CommunityTab = 'overview' | 'leaderboard' | 'memory-pool' | 'rituals' | 'profile';

const CommunityPage: React.FC = () => {
  const { address, isConnected } = useAccount();
  const { 
    currentMember, 
    initializeMember, 
    leaderboards, 
    sharedMemories, 
    activeRituals, 
    upcomingRituals,
    notifications,
    updateLeaderboards 
  } = useCommunityStore();
  
  const [activeTab, setActiveTab] = useState<CommunityTab>('overview');
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    if (isConnected && address && !currentMember) {
      // Initialize member with a default display name
      const defaultName = `Cultist_${address.slice(-6)}`;
      initializeMember(address, defaultName);
    }
  }, [isConnected, address, currentMember, initializeMember]);

  useEffect(() => {
    updateLeaderboards();
  }, [updateLeaderboards]);

  const navigationItems = [
    { id: 'overview', label: 'Overview', icon: Users, color: 'purple' },
    { id: 'leaderboard', label: 'Leaderboards', icon: Trophy, color: 'yellow' },
    { id: 'memory-pool', label: 'Memory Pool', icon: MessageCircle, color: 'blue' },
    { id: 'rituals', label: 'Rituals', icon: Zap, color: 'green' },
    { id: 'profile', label: 'Profile', icon: UserCircle, color: 'red' }
  ] as const;

  const unreadNotifications = notifications.filter(n => !n.read).length;

  const renderTabContent = () => {
    if (!isConnected) {
      return (
        <div className="text-center py-20">
          <UserCircle className="w-16 h-16 text-gray-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Connect Your Wallet</h2>
          <p className="text-gray-400 mb-6">Join the cult community by connecting your wallet</p>
        </div>
      );
    }

    switch (activeTab) {
      case 'overview':
        return <CommunityOverview />;
      case 'leaderboard':
        return <Leaderboard />;
      case 'memory-pool':
        return <SharedMemoryPool />;
      case 'rituals':
        return <CollaborativeRituals />;
      case 'profile':
        return currentMember ? (
          <CultMemberProfile member={currentMember} isOwnProfile={true} />
        ) : null;
      default:
        return <CommunityOverview />;
    }
  };

  const CommunityOverview = () => {
    const topMembers = leaderboards.overall.slice(0, 3);
    const recentMemories = sharedMemories.slice(0, 5);
    const nextRituals = upcomingRituals.slice(0, 3);

    return (
      <div className="space-y-8">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-purple-600/20 to-blue-600/20 border border-purple-400/30 rounded-lg p-6"
        >
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center text-2xl">
              {currentMember?.avatar || '🔮'}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">
                Welcome back, {currentMember?.displayName || 'Cultist'}!
              </h2>
              <p className="text-purple-300">
                Your mystical journey continues in the EchoCronVerse
              </p>
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gray-900/50 border border-purple-400/20 rounded-lg p-4 text-center"
          >
            <Trophy className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-yellow-400">
              {currentMember ? 
                leaderboards.overall.findIndex(entry => entry.member.id === currentMember.id) + 1 || 'Unranked'
                : 0
              }
            </div>
            <div className="text-gray-400 text-sm">Rank</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="bg-gray-900/50 border border-blue-400/20 rounded-lg p-4 text-center"
          >
            <Star className="w-8 h-8 text-blue-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-blue-400">
              {currentMember?.stats.achievement_count || 0}
            </div>
            <div className="text-gray-400 text-sm">Achievements</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-gray-900/50 border border-green-400/20 rounded-lg p-4 text-center"
          >
            <Zap className="w-8 h-8 text-green-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-green-400">
              {currentMember?.stats.ritual_completions || 0}
            </div>
            <div className="text-gray-400 text-sm">Rituals</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="bg-gray-900/50 border border-purple-400/20 rounded-lg p-4 text-center"
          >
            <MessageCircle className="w-8 h-8 text-purple-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-purple-400">
              {currentMember?.stats.memories_shared || 0}
            </div>
            <div className="text-gray-400 text-sm">Memories</div>
          </motion.div>
        </div>

        {/* Quick Access Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          {/* Top Cultists */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-gray-900/50 border border-yellow-400/20 rounded-lg p-6"
          >
            <div className="flex items-center gap-2 mb-4">
              <Crown className="w-6 h-6 text-yellow-400" />
              <h3 className="text-lg font-semibold text-white">Top Cultists</h3>
            </div>
            <div className="space-y-3">
              {topMembers.map((entry, index) => (
                <div key={entry.member.id} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center text-white font-bold text-sm">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <div className="text-white font-medium">{entry.member.displayName}</div>
                    <div className="text-gray-400 text-sm">{entry.score.toLocaleString()} points</div>
                  </div>
                </div>
              ))}
            </div>
            <button
              onClick={() => setActiveTab('leaderboard')}
              className="w-full mt-4 px-4 py-2 bg-yellow-600/20 hover:bg-yellow-600/30 text-yellow-400 rounded-lg transition-colors"
            >
              View Full Leaderboard
            </button>
          </motion.div>

          {/* Recent Memories */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-gray-900/50 border border-blue-400/20 rounded-lg p-6"
          >
            <div className="flex items-center gap-2 mb-4">
              <MessageCircle className="w-6 h-6 text-blue-400" />
              <h3 className="text-lg font-semibold text-white">Recent Memories</h3>
            </div>
            <div className="space-y-3">
              {recentMemories.map((memory) => (
                <div key={memory.id} className="border-l-2 border-blue-400/30 pl-3">
                  <div className="text-white text-sm">{memory.content.slice(0, 100)}...</div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-gray-400 text-xs">{memory.author}</span>
                    <Heart className="w-3 h-3 text-red-400" />
                    <span className="text-gray-400 text-xs">{memory.likes}</span>
                  </div>
                </div>
              ))}
            </div>
            <button
              onClick={() => setActiveTab('memory-pool')}
              className="w-full mt-4 px-4 py-2 bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 rounded-lg transition-colors"
            >
              Explore Memory Pool
            </button>
          </motion.div>

          {/* Upcoming Rituals */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-gray-900/50 border border-green-400/20 rounded-lg p-6"
          >
            <div className="flex items-center gap-2 mb-4">
              <Zap className="w-6 h-6 text-green-400" />
              <h3 className="text-lg font-semibold text-white">Upcoming Rituals</h3>
            </div>
            <div className="space-y-3">
              {nextRituals.length === 0 ? (
                <p className="text-gray-400 text-sm">No upcoming rituals</p>
              ) : (
                nextRituals.map((ritual) => (
                  <div key={ritual.id} className="border-l-2 border-green-400/30 pl-3">
                    <div className="text-white font-medium">{ritual.name}</div>
                    <div className="text-gray-400 text-sm">
                      {new Date(ritual.start_time).toLocaleDateString()}
                    </div>
                  </div>
                ))
              )}
            </div>
            <button
              onClick={() => setActiveTab('rituals')}
              className="w-full mt-4 px-4 py-2 bg-green-600/20 hover:bg-green-600/30 text-green-400 rounded-lg transition-colors"
            >
              View All Rituals
            </button>
          </motion.div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-indigo-900/20 to-black">
      <EmberParticles variant="mystical" />
      
      <div className="relative z-10">
        {/* Header */}
        <div className="sticky top-0 bg-black/50 backdrop-blur-sm border-b border-purple-400/30 z-40">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <FrameRunes tier="oracle" runeSet="ancient" className="w-12 h-12">
                  <div className="flex items-center justify-center h-full">
                    <Users className="w-6 h-6 text-purple-400" />
                  </div>
                </FrameRunes>
                <div>
                  <h1 className="text-2xl font-bold text-purple-400" style={{ fontFamily: 'Unbounded, cursive' }}>
                    Community Hub
                  </h1>
                  <p className="text-gray-400 text-sm">Connect • Compete • Collaborate</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                {/* Notifications */}
                {isConnected && (
                  <motion.button
                    onClick={() => setShowNotifications(!showNotifications)}
                    className="relative p-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Bell className="w-5 h-5" />
                    {unreadNotifications > 0 && (
                      <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                        {unreadNotifications > 9 ? '9+' : unreadNotifications}
                      </span>
                    )}
                  </motion.button>
                )}

                {/* Mobile Menu Toggle */}
                <motion.button
                  onClick={() => setShowMobileMenu(!showMobileMenu)}
                  className="md:hidden p-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {showMobileMenu ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </motion.button>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex mt-4 space-x-2">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                
                return (
                  <motion.button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all ${
                      isActive
                        ? `bg-${item.color}-600 text-white shadow-lg`
                        : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Icon className="w-5 h-5" />
                    {item.label}
                  </motion.button>
                );
              })}
            </nav>

            {/* Mobile Navigation */}
            <AnimatePresence>
              {showMobileMenu && (
                <motion.nav
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="md:hidden mt-4 space-y-2"
                >
                  {navigationItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeTab === item.id;
                    
                    return (
                      <motion.button
                        key={item.id}
                        onClick={() => {
                          setActiveTab(item.id);
                          setShowMobileMenu(false);
                        }}
                        className={`w-full flex items-center gap-2 px-4 py-3 rounded-lg font-semibold transition-all ${
                          isActive
                            ? `bg-${item.color}-600 text-white`
                            : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50'
                        }`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Icon className="w-5 h-5" />
                        {item.label}
                      </motion.button>
                    );
                  })}
                </motion.nav>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-6 py-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {renderTabContent()}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default CommunityPage;
