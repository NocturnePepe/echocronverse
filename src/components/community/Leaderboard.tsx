import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Trophy, 
  Crown, 
  Star, 
  Zap, 
  Users, 
  Award,
  TrendingUp,
  Calendar,
  Eye
} from 'lucide-react';
import { FrameRunes } from '../runes';
import { EmberParticles } from '../ui';
import { useCommunityStore } from '../../stores/communityStore';
import { CultMemberProfile } from './CultMemberProfile';

interface LeaderboardProps {
  className?: string;
}

export const Leaderboard: React.FC<LeaderboardProps> = ({ className = '' }) => {
  const { leaderboards, updateLeaderboards } = useCommunityStore();
  const [activeTab, setActiveTab] = useState<'overall' | 'weekly' | 'monthly' | 'achievements' | 'rituals'>('overall');
  const [selectedMember, setSelectedMember] = useState<any>(null);
  const [hoveredRank, setHoveredRank] = useState<number | null>(null);

  useEffect(() => {
    updateLeaderboards();
  }, [updateLeaderboards]);

  const tabs = [
    { id: 'overall', label: 'Overall', icon: Trophy, color: 'purple' },
    { id: 'weekly', label: 'Weekly', icon: Calendar, color: 'blue' },
    { id: 'monthly', label: 'Monthly', icon: TrendingUp, color: 'green' },
    { id: 'achievements', label: 'Achievements', icon: Award, color: 'yellow' },
    { id: 'rituals', label: 'Rituals', icon: Zap, color: 'red' }
  ] as const;

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return { icon: '👑', color: 'text-yellow-400', glow: 'shadow-yellow-400/50' };
      case 2: return { icon: '🥈', color: 'text-gray-300', glow: 'shadow-gray-400/50' };
      case 3: return { icon: '🥉', color: 'text-orange-400', glow: 'shadow-orange-400/50' };
      default: return { icon: rank.toString(), color: 'text-purple-400', glow: 'shadow-purple-400/30' };
    }
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'oracle': return 'from-purple-500 to-pink-500';
      case 'master': return 'from-blue-500 to-purple-500';
      case 'adept': return 'from-green-500 to-blue-500';
      case 'initiate': return 'from-gray-500 to-green-500';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const currentLeaderboard = leaderboards[activeTab] || [];

  const formatScore = (score: number, category: string) => {
    if (category === 'achievements' || category === 'rituals') {
      return score.toString();
    }
    return score.toLocaleString();
  };

  const getScoreLabel = (category: string) => {
    switch (category) {
      case 'achievements': return 'Achievements';
      case 'rituals': return 'Rituals Completed';
      default: return 'Total Score';
    }
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br from-black via-indigo-900/20 to-black p-6 relative ${className}`}>
      <EmberParticles variant="mystical" />
      
      <div className="max-w-6xl mx-auto relative z-10">
        <FrameRunes tier="master" runeSet="cosmic" className="mb-8">
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center p-8"
          >
            <div className="flex items-center justify-center gap-3 mb-4">
              <Trophy className="w-8 h-8 text-yellow-400" />
              <h1 className="text-4xl font-bold text-yellow-400" style={{ fontFamily: 'Unbounded, cursive' }}>
                Cult Leaderboards
              </h1>
              <Crown className="w-8 h-8 text-yellow-400" />
            </div>
            <p className="text-zinc-300 text-lg">
              ⟐ Honor the most devoted cultists ⟐
            </p>
          </motion.div>
        </FrameRunes>

        {/* Tab Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-black/50 backdrop-blur-sm border border-purple-400/30 rounded-lg p-6 mb-8"
        >
          <div className="flex flex-wrap gap-2 mb-6">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              
              return (
                <motion.button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all ${
                    isActive
                      ? `bg-${tab.color}-600 text-white shadow-lg`
                      : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Icon className="w-5 h-5" />
                  {tab.label}
                </motion.button>
              );
            })}
          </div>

          {/* Leaderboard Content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-3"
            >
              {currentLeaderboard.length === 0 ? (
                <div className="text-center py-12">
                  <Users className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                  <p className="text-gray-400 text-lg">No cultists found in this category yet</p>
                  <p className="text-gray-500 text-sm">Be the first to claim your place!</p>
                </div>
              ) : (
                currentLeaderboard.map((entry, index) => {
                  const rankData = getRankIcon(entry.rank);
                  const isTop3 = entry.rank <= 3;
                  const isHovered = hoveredRank === entry.rank;

                  return (
                    <motion.div
                      key={`${entry.member.id}-${activeTab}`}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.05 }}
                      className={`relative group ${
                        isTop3 ? 'bg-gradient-to-r from-gray-900/80 to-gray-800/80' : 'bg-gray-900/50'
                      } border ${
                        isTop3 ? 'border-yellow-400/30' : 'border-gray-700/50'
                      } rounded-lg p-4 hover:border-purple-400/50 transition-all cursor-pointer ${
                        isHovered ? 'scale-105 shadow-lg' : ''
                      }`}
                      onMouseEnter={() => setHoveredRank(entry.rank)}
                      onMouseLeave={() => setHoveredRank(null)}
                      onClick={() => setSelectedMember(entry.member)}
                    >
                      <div className="flex items-center gap-4">
                        {/* Rank */}
                        <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${
                          isTop3 ? 'from-yellow-500 to-orange-500' : 'from-purple-600 to-purple-700'
                        } flex items-center justify-center text-white font-bold shadow-lg ${rankData.glow}`}>
                          {typeof rankData.icon === 'string' && rankData.icon.length === 1 ? 
                            rankData.icon : 
                            <span className="text-sm">{entry.rank}</span>
                          }
                        </div>

                        {/* Member Avatar & Info */}
                        <div className="flex items-center gap-3 flex-1">
                          <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${getTierColor(entry.member.currentTier)} flex items-center justify-center text-white font-semibold`}>
                            {entry.member.avatar || entry.member.displayName.charAt(0).toUpperCase()}
                          </div>
                          
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <h3 className="font-semibold text-white">{entry.member.displayName}</h3>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${getTierColor(entry.member.currentTier)} text-white`}>
                                {entry.member.currentTier}
                              </span>
                            </div>
                            <p className="text-gray-400 text-sm font-mono">
                              {entry.member.address.slice(0, 8)}...{entry.member.address.slice(-6)}
                            </p>
                          </div>
                        </div>

                        {/* Score */}
                        <div className="text-right">
                          <div className="text-2xl font-bold text-purple-400">
                            {formatScore(entry.score, activeTab)}
                          </div>
                          <div className="text-gray-400 text-sm">
                            {getScoreLabel(activeTab)}
                          </div>
                        </div>

                        {/* View Profile Button */}
                        <motion.button
                          className="p-2 bg-purple-600/20 hover:bg-purple-600/40 text-purple-400 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedMember(entry.member);
                          }}
                        >
                          <Eye className="w-5 h-5" />
                        </motion.button>
                      </div>

                      {/* Top 3 Special Effects */}
                      {isTop3 && (
                        <div className="absolute -top-1 -right-1">
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                            className="w-6 h-6 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full flex items-center justify-center"
                          >
                            <Star className="w-4 h-4 text-white" />
                          </motion.div>
                        </div>
                      )}
                    </motion.div>
                  );
                })
              )}
            </motion.div>
          </AnimatePresence>

          {/* Summary Stats */}
          {currentLeaderboard.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4"
            >
              <div className="bg-gradient-to-r from-yellow-600/20 to-orange-600/20 border border-yellow-400/30 rounded-lg p-4 text-center">
                <Crown className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
                <div className="text-xl font-bold text-yellow-400">
                  {currentLeaderboard[0]?.member.displayName || 'None'}
                </div>
                <div className="text-yellow-300 text-sm">Current Champion</div>
              </div>
              
              <div className="bg-gradient-to-r from-purple-600/20 to-blue-600/20 border border-purple-400/30 rounded-lg p-4 text-center">
                <Users className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                <div className="text-xl font-bold text-purple-400">
                  {currentLeaderboard.length}
                </div>
                <div className="text-purple-300 text-sm">Total Competitors</div>
              </div>
              
              <div className="bg-gradient-to-r from-green-600/20 to-blue-600/20 border border-green-400/30 rounded-lg p-4 text-center">
                <TrendingUp className="w-8 h-8 text-green-400 mx-auto mb-2" />
                <div className="text-xl font-bold text-green-400">
                  {currentLeaderboard.reduce((sum, entry) => sum + entry.score, 0).toLocaleString()}
                </div>
                <div className="text-green-300 text-sm">Combined Score</div>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>

      {/* Member Profile Modal */}
      <AnimatePresence>
        {selectedMember && (
          <CultMemberProfile
            member={selectedMember}
            onClose={() => setSelectedMember(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};
