import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, 
  Trophy, 
  Star, 
  Calendar, 
  Award, 
  Zap, 
  Users, 
  Eye,
  Edit3,
  Save,
  X
} from 'lucide-react';
import { FrameRunes } from '../runes';
import { EmberParticles } from '../ui';
import { useCommunityStore, CultMember } from '../../stores/communityStore';
import { useAccount } from 'wagmi';

interface CultMemberProfileProps {
  member?: CultMember;
  isOwnProfile?: boolean;
  onClose?: () => void;
}

export const CultMemberProfile: React.FC<CultMemberProfileProps> = ({
  member: propMember,
  isOwnProfile = false,
  onClose
}) => {
  const { address } = useAccount();
  const { currentMember, updateMemberStats, followMember, unfollowMember, following } = useCommunityStore();
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    displayName: '',
    favorite_rune_set: 'ancient' as const,
  });

  const member = propMember || currentMember;
  if (!member) return null;

  const isFollowing = following.includes(member.id);
  const canEdit = isOwnProfile && member.address === address;

  const handleStartEdit = () => {
    setEditForm({
      displayName: member.displayName,
      favorite_rune_set: member.favorite_rune_set,
    });
    setIsEditing(true);
  };

  const handleSaveEdit = () => {
    // TODO: Implement profile update
    setIsEditing(false);
  };

  const handleFollow = () => {
    if (isFollowing) {
      unfollowMember(member.id);
    } else {
      followMember(member.id);
    }
  };

  const getTierColor = (tier: CultMember['currentTier']) => {
    switch (tier) {
      case 'oracle': return 'from-purple-500 to-pink-500';
      case 'master': return 'from-blue-500 to-purple-500';
      case 'adept': return 'from-green-500 to-blue-500';
      case 'initiate': return 'from-gray-500 to-green-500';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const getTierIcon = (tier: CultMember['currentTier']) => {
    switch (tier) {
      case 'oracle': return '👁️';
      case 'master': return '🔮';
      case 'adept': return '⚡';
      case 'initiate': return '🌟';
      default: return '❓';
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const calculateTotalScore = () => {
    const { stats } = member;
    return (
      stats.totalMemories * 10 +
      stats.achievement_count * 25 +
      stats.ritual_completions * 50 +
      stats.sigils_created * 15 +
      stats.memories_shared * 8 +
      stats.reputation_score
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 p-4 overflow-y-auto"
    >
      <EmberParticles variant="mystical" />
      
      <div className="max-w-4xl mx-auto relative z-10">
        <FrameRunes tier={member.currentTier} runeSet={member.favorite_rune_set} className="mb-6">
          <div className="p-8">
            {/* Header */}
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center gap-4">
                <div className={`w-20 h-20 rounded-full bg-gradient-to-br ${getTierColor(member.currentTier)} flex items-center justify-center text-3xl`}>
                  {member.avatar || getTierIcon(member.currentTier)}
                </div>
                <div>
                  {isEditing ? (
                    <div className="space-y-2">
                      <input
                        type="text"
                        value={editForm.displayName}
                        onChange={(e) => setEditForm({ ...editForm, displayName: e.target.value })}
                        className="bg-gray-800 border border-purple-400/30 rounded px-3 py-1 text-white"
                        placeholder="Display Name"
                      />
                      <select
                        value={editForm.favorite_rune_set}
                        onChange={(e) => setEditForm({ ...editForm, favorite_rune_set: e.target.value as any })}
                        className="bg-gray-800 border border-purple-400/30 rounded px-3 py-1 text-white"
                      >
                        <option value="ancient">Ancient Runes</option>
                        <option value="temporal">Temporal Runes</option>
                        <option value="cosmic">Cosmic Runes</option>
                        <option value="shadow">Shadow Runes</option>
                      </select>
                    </div>
                  ) : (
                    <>
                      <h1 className="text-3xl font-bold text-purple-400 mb-1" style={{ fontFamily: 'Unbounded, cursive' }}>
                        {member.displayName}
                      </h1>
                      <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r ${getTierColor(member.currentTier)} text-white text-sm font-semibold`}>
                        <span>{getTierIcon(member.currentTier)}</span>
                        {member.currentTier.charAt(0).toUpperCase() + member.currentTier.slice(1)}
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                {canEdit && (
                  <>
                    {isEditing ? (
                      <>
                        <motion.button
                          onClick={handleSaveEdit}
                          className="p-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Save className="w-5 h-5" />
                        </motion.button>
                        <motion.button
                          onClick={() => setIsEditing(false)}
                          className="p-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <X className="w-5 h-5" />
                        </motion.button>
                      </>
                    ) : (
                      <motion.button
                        onClick={handleStartEdit}
                        className="p-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Edit3 className="w-5 h-5" />
                      </motion.button>
                    )}
                  </>
                )}

                {!canEdit && (
                  <motion.button
                    onClick={handleFollow}
                    className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                      isFollowing 
                        ? 'bg-gray-600 hover:bg-gray-700 text-white' 
                        : 'bg-purple-600 hover:bg-purple-700 text-white'
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Users className="w-4 h-4 inline mr-2" />
                    {isFollowing ? 'Unfollow' : 'Follow'}
                  </motion.button>
                )}

                {onClose && (
                  <motion.button
                    onClick={onClose}
                    className="p-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <X className="w-5 h-5" />
                  </motion.button>
                )}
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-gray-900/50 border border-purple-400/20 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-purple-400">{calculateTotalScore()}</div>
                <div className="text-gray-400 text-sm">Total Score</div>
              </div>
              <div className="bg-gray-900/50 border border-blue-400/20 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-blue-400">{member.stats.achievement_count}</div>
                <div className="text-gray-400 text-sm">Achievements</div>
              </div>
              <div className="bg-gray-900/50 border border-green-400/20 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-green-400">{member.stats.ritual_completions}</div>
                <div className="text-gray-400 text-sm">Rituals</div>
              </div>
              <div className="bg-gray-900/50 border border-yellow-400/20 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-yellow-400">{member.stats.memories_shared}</div>
                <div className="text-gray-400 text-sm">Memories</div>
              </div>
            </div>

            {/* Detailed Stats */}
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                  <Trophy className="w-6 h-6 text-yellow-400" />
                  Mystical Progress
                </h3>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Total Memories</span>
                    <span className="text-purple-400 font-semibold">{member.stats.totalMemories}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Sigils Created</span>
                    <span className="text-blue-400 font-semibold">{member.stats.sigils_created}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Reputation Score</span>
                    <span className="text-green-400 font-semibold">{member.stats.reputation_score}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Favorite Runes</span>
                    <span className="text-yellow-400 font-semibold capitalize">{member.favorite_rune_set}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                  <Star className="w-6 h-6 text-purple-400" />
                  Cult Information
                </h3>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Joined</span>
                    <span className="text-purple-400 font-semibold">{formatDate(member.joinedAt)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Last Active</span>
                    <span className="text-blue-400 font-semibold">{formatDate(member.lastActive)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Wallet</span>
                    <span className="text-green-400 font-mono text-sm">
                      {member.address.slice(0, 6)}...{member.address.slice(-4)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Badges */}
            {member.badges && member.badges.length > 0 && (
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                  <Award className="w-6 h-6 text-yellow-400" />
                  Earned Badges
                </h3>
                <div className="flex flex-wrap gap-2">
                  {member.badges.map((badge, index) => (
                    <motion.div
                      key={badge}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                      className="px-3 py-1 bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-sm font-semibold rounded-full"
                    >
                      {badge.replace('_', ' ')}
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </FrameRunes>
      </div>
    </motion.div>
  );
};
