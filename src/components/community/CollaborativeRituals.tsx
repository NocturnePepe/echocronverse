import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Zap, 
  Users, 
  Calendar, 
  Clock, 
  Plus,
  UserPlus,
  Eye,
  Play,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { FrameRunes } from '../runes';
import { EmberParticles } from '../ui';
import { useCommunityStore, CollaborativeRitual } from '../../stores/communityStore';

interface CollaborativeRitualsProps {
  className?: string;
}

export const CollaborativeRituals: React.FC<CollaborativeRitualsProps> = ({ className = '' }) => {
  const { 
    currentMember, 
    activeRituals, 
    upcomingRituals, 
    completedRituals,
    createRitual, 
    joinRitual
  } = useCommunityStore();
  
  const [activeTab, setActiveTab] = useState<'upcoming' | 'active' | 'completed'>('upcoming');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedRitual, setSelectedRitual] = useState<CollaborativeRitual | null>(null);
  const [createForm, setCreateForm] = useState({
    name: '',
    description: '',
    required_tier: 'initiate' as const,
    max_participants: 5,
    duration_minutes: 30,
    start_time: '',
    min_memories: 0,
    required_achievements: [] as string[],
    sigil_required: false,
    reputation_points: 50,
    exclusive_badge: '',
    mystical_artifact: '',
  });

  const tabs = [
    { id: 'upcoming', label: 'Upcoming', icon: Calendar, color: 'blue', count: upcomingRituals.length },
    { id: 'active', label: 'Active', icon: Play, color: 'green', count: activeRituals.length },
    { id: 'completed', label: 'Completed', icon: CheckCircle, color: 'purple', count: completedRituals.length }
  ] as const;

  const tierOptions = [
    { value: 'initiate', label: 'Initiate', color: 'gray' },
    { value: 'adept', label: 'Adept', color: 'green' },
    { value: 'master', label: 'Master', color: 'blue' },
    { value: 'oracle', label: 'Oracle', color: 'purple' }
  ];

  const handleCreateRitual = () => {
    if (!createForm.name.trim() || !createForm.description.trim() || !currentMember) return;

    createRitual({
      name: createForm.name,
      description: createForm.description,
      creator: currentMember.id,
      required_tier: createForm.required_tier,
      max_participants: createForm.max_participants,
      start_time: new Date(createForm.start_time),
      duration_minutes: createForm.duration_minutes,
      mystical_requirements: {
        min_memories: createForm.min_memories,
        required_achievements: createForm.required_achievements,
        sigil_required: createForm.sigil_required,
      },
      rewards: {
        reputation_points: createForm.reputation_points,
        exclusive_badge: createForm.exclusive_badge || undefined,
        mystical_artifact: createForm.mystical_artifact || undefined,
      },
    });

    // Reset form
    setCreateForm({
      name: '',
      description: '',
      required_tier: 'initiate',
      max_participants: 5,
      duration_minutes: 30,
      start_time: '',
      min_memories: 0,
      required_achievements: [],
      sigil_required: false,
      reputation_points: 50,
      exclusive_badge: '',
      mystical_artifact: '',
    });
    setShowCreateForm(false);
  };

  const handleJoinRitual = (ritualId: string) => {
    if (!currentMember) return;
    joinRitual(ritualId, currentMember.id);
  };

  const canJoinRitual = (ritual: CollaborativeRitual): { canJoin: boolean; reason?: string } => {
    if (!currentMember) return { canJoin: false, reason: 'Not logged in' };
    
    if (ritual.participants.includes(currentMember.id)) {
      return { canJoin: false, reason: 'Already joined' };
    }
    
    if (ritual.participants.length >= ritual.max_participants) {
      return { canJoin: false, reason: 'Full' };
    }

    // Check tier requirement
    const tierOrder = { initiate: 0, adept: 1, master: 2, oracle: 3 };
    const memberTier = tierOrder[currentMember.currentTier];
    const requiredTier = tierOrder[ritual.required_tier];
    
    if (memberTier < requiredTier) {
      return { canJoin: false, reason: `Requires ${ritual.required_tier} tier` };
    }

    // Check memory requirement
    if (currentMember.stats.totalMemories < ritual.mystical_requirements.min_memories) {
      return { canJoin: false, reason: `Need ${ritual.mystical_requirements.min_memories} memories` };
    }

    // Check achievement requirements
    const hasRequiredAchievements = ritual.mystical_requirements.required_achievements.every(
      achievement => currentMember.badges.includes(achievement)
    );
    
    if (!hasRequiredAchievements) {
      return { canJoin: false, reason: 'Missing required achievements' };
    }

    // Check sigil requirement
    if (ritual.mystical_requirements.sigil_required && currentMember.stats.sigils_created === 0) {
      return { canJoin: false, reason: 'Sigil required' };
    }

    return { canJoin: true };
  };

  const getRitualStatus = (ritual: CollaborativeRitual) => {
    const now = new Date();
    const startTime = new Date(ritual.start_time);
    const endTime = new Date(startTime.getTime() + ritual.duration_minutes * 60000);

    if (ritual.status === 'completed') return { status: 'completed', color: 'purple', icon: CheckCircle };
    if (ritual.status === 'cancelled') return { status: 'cancelled', color: 'red', icon: XCircle };
    if (now >= startTime && now <= endTime) return { status: 'active', color: 'green', icon: Play };
    if (now < startTime) return { status: 'upcoming', color: 'blue', icon: Calendar };
    return { status: 'expired', color: 'gray', icon: Clock };
  };

  const formatDateTime = (date: Date) => {
    return new Date(date).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'oracle': return 'purple';
      case 'master': return 'blue';
      case 'adept': return 'green';
      case 'initiate': return 'gray';
      default: return 'gray';
    }
  };

  const getCurrentRituals = (): CollaborativeRitual[] => {
    switch (activeTab) {
      case 'upcoming': return upcomingRituals;
      case 'active': return activeRituals;
      case 'completed': return completedRituals;
      default: return [];
    }
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br from-black via-blue-900/20 to-black p-6 relative ${className}`}>
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
              <Zap className="w-8 h-8 text-blue-400" />
              <h1 className="text-4xl font-bold text-blue-400" style={{ fontFamily: 'Unbounded, cursive' }}>
                Collaborative Rituals
              </h1>
              <Users className="w-8 h-8 text-blue-400" />
            </div>
            <p className="text-zinc-300 text-lg">
              ⟐ Unite in mystical communion ⟐
            </p>
          </motion.div>
        </FrameRunes>

        {/* Create Ritual Button */}
        {currentMember && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-8 text-center"
          >
            <motion.button
              onClick={() => setShowCreateForm(true)}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-lg shadow-lg transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Plus className="w-5 h-5 inline mr-2" />
              Create New Ritual
            </motion.button>
          </motion.div>
        )}

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="bg-black/50 backdrop-blur-sm border border-blue-400/30 rounded-lg p-6"
        >
          <div className="flex gap-2 mb-6">
            {tabs.map(tab => {
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
                  <Icon className="w-4 h-4" />
                  {tab.label}
                  {tab.count > 0 && (
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      isActive ? 'bg-white/20' : 'bg-gray-600'
                    }`}>
                      {tab.count}
                    </span>
                  )}
                </motion.button>
              );
            })}
          </div>

          {/* Rituals List */}
          <div className="space-y-4">
            {getCurrentRituals().length === 0 ? (
              <div className="text-center py-12">
                <Zap className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                <p className="text-gray-400 text-lg">No rituals found</p>
                <p className="text-gray-500 text-sm">
                  {activeTab === 'upcoming' ? 'Create the first ritual!' : `No ${activeTab} rituals`}
                </p>
              </div>
            ) : (
              getCurrentRituals().map((ritual, index) => {
                const status = getRitualStatus(ritual);
                const StatusIcon = status.icon;
                const joinCheck = canJoinRitual(ritual);

                return (
                  <motion.div
                    key={ritual.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    className="bg-gray-900/50 border border-gray-700/50 rounded-lg p-6 hover:border-blue-400/30 transition-all"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl font-semibold text-white">{ritual.name}</h3>
                          <div className={`flex items-center gap-1 px-2 py-1 rounded-full bg-${status.color}-600/20 text-${status.color}-400 text-sm`}>
                            <StatusIcon className="w-4 h-4" />
                            {status.status}
                          </div>
                        </div>
                        <p className="text-gray-300 mb-3">{ritual.description}</p>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <span className="text-gray-400">Required Tier:</span>
                            <div className={`text-${getTierColor(ritual.required_tier)}-400 font-semibold capitalize`}>
                              {ritual.required_tier}
                            </div>
                          </div>
                          <div>
                            <span className="text-gray-400">Participants:</span>
                            <div className="text-blue-400 font-semibold">
                              {ritual.participants.length}/{ritual.max_participants}
                            </div>
                          </div>
                          <div>
                            <span className="text-gray-400">Duration:</span>
                            <div className="text-green-400 font-semibold">
                              {ritual.duration_minutes}m
                            </div>
                          </div>
                          <div>
                            <span className="text-gray-400">Start Time:</span>
                            <div className="text-purple-400 font-semibold">
                              {formatDateTime(ritual.start_time)}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 ml-4">
                        {currentMember && activeTab === 'upcoming' && (
                          joinCheck.canJoin ? (
                            <motion.button
                              onClick={() => handleJoinRitual(ritual.id)}
                              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-all"
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              <UserPlus className="w-4 h-4 inline mr-1" />
                              Join
                            </motion.button>
                          ) : (
                            <div className="px-4 py-2 bg-gray-600 text-gray-300 font-semibold rounded-lg cursor-not-allowed">
                              {joinCheck.reason}
                            </div>
                          )
                        )}

                        <motion.button
                          onClick={() => setSelectedRitual(ritual)}
                          className="p-2 bg-blue-600/20 hover:bg-blue-600/40 text-blue-400 rounded-lg transition-colors"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <Eye className="w-5 h-5" />
                        </motion.button>
                      </div>
                    </div>

                    {/* Requirements */}
                    {(ritual.mystical_requirements.min_memories > 0 || 
                      ritual.mystical_requirements.required_achievements.length > 0 || 
                      ritual.mystical_requirements.sigil_required) && (
                      <div className="border-t border-gray-700 pt-4">
                        <h4 className="text-sm font-semibold text-gray-300 mb-2">Requirements:</h4>
                        <div className="flex flex-wrap gap-2 text-xs">
                          {ritual.mystical_requirements.min_memories > 0 && (
                            <span className="px-2 py-1 bg-purple-600/20 text-purple-300 rounded">
                              {ritual.mystical_requirements.min_memories}+ memories
                            </span>
                          )}
                          {ritual.mystical_requirements.sigil_required && (
                            <span className="px-2 py-1 bg-blue-600/20 text-blue-300 rounded">
                              Sigil required
                            </span>
                          )}
                          {ritual.mystical_requirements.required_achievements.map(achievement => (
                            <span key={achievement} className="px-2 py-1 bg-yellow-600/20 text-yellow-300 rounded">
                              {achievement.replace('_', ' ')}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Rewards */}
                    <div className="border-t border-gray-700 pt-4 mt-4">
                      <h4 className="text-sm font-semibold text-gray-300 mb-2">Rewards:</h4>
                      <div className="flex flex-wrap gap-2 text-xs">
                        <span className="px-2 py-1 bg-green-600/20 text-green-300 rounded">
                          {ritual.rewards.reputation_points} reputation
                        </span>
                        {ritual.rewards.exclusive_badge && (
                          <span className="px-2 py-1 bg-yellow-600/20 text-yellow-300 rounded">
                            Badge: {ritual.rewards.exclusive_badge}
                          </span>
                        )}
                        {ritual.rewards.mystical_artifact && (
                          <span className="px-2 py-1 bg-purple-600/20 text-purple-300 rounded">
                            Artifact: {ritual.rewards.mystical_artifact}
                          </span>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })
            )}
          </div>
        </motion.div>
      </div>

      {/* Create Ritual Modal */}
      <AnimatePresence>
        {showCreateForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 p-4 overflow-y-auto"
          >
            <div className="max-w-2xl mx-auto bg-gray-900 border border-blue-400/30 rounded-lg p-6">
              <h2 className="text-2xl font-bold text-blue-400 mb-6">Create New Ritual</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">Ritual Name</label>
                  <input
                    type="text"
                    value={createForm.name}
                    onChange={(e) => setCreateForm({ ...createForm, name: e.target.value })}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 text-white focus:border-blue-400 focus:outline-none"
                    placeholder="Enter ritual name..."
                  />
                </div>

                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">Description</label>
                  <textarea
                    value={createForm.description}
                    onChange={(e) => setCreateForm({ ...createForm, description: e.target.value })}
                    className="w-full h-24 bg-gray-800 border border-gray-700 rounded-lg p-3 text-white focus:border-blue-400 focus:outline-none resize-none"
                    placeholder="Describe the ritual purpose and activities..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-300 text-sm font-medium mb-2">Required Tier</label>
                    <select
                      value={createForm.required_tier}
                      onChange={(e) => setCreateForm({ ...createForm, required_tier: e.target.value as any })}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 text-white focus:border-blue-400 focus:outline-none"
                    >
                      {tierOptions.map(tier => (
                        <option key={tier.value} value={tier.value}>{tier.label}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-gray-300 text-sm font-medium mb-2">Max Participants</label>
                    <input
                      type="number"
                      min="2"
                      max="20"
                      value={createForm.max_participants}
                      onChange={(e) => setCreateForm({ ...createForm, max_participants: parseInt(e.target.value) })}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 text-white focus:border-blue-400 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-300 text-sm font-medium mb-2">Start Time</label>
                    <input
                      type="datetime-local"
                      value={createForm.start_time}
                      onChange={(e) => setCreateForm({ ...createForm, start_time: e.target.value })}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 text-white focus:border-blue-400 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-300 text-sm font-medium mb-2">Duration (minutes)</label>
                    <input
                      type="number"
                      min="15"
                      max="180"
                      value={createForm.duration_minutes}
                      onChange={(e) => setCreateForm({ ...createForm, duration_minutes: parseInt(e.target.value) })}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 text-white focus:border-blue-400 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <motion.button
                    onClick={() => setShowCreateForm(false)}
                    className="px-6 py-2 bg-gray-600 hover:bg-gray-700 text-white font-semibold rounded-lg transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    onClick={handleCreateRitual}
                    disabled={!createForm.name.trim() || !createForm.description.trim()}
                    className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-all"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Create Ritual
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Ritual Details Modal */}
      <AnimatePresence>
        {selectedRitual && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 p-4 overflow-y-auto"
          >
            <div className="max-w-3xl mx-auto bg-gray-900 border border-blue-400/30 rounded-lg p-6">
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-2xl font-bold text-blue-400">{selectedRitual.name}</h2>
                <motion.button
                  onClick={() => setSelectedRitual(null)}
                  className="p-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  ×
                </motion.button>
              </div>
              
              <div className="space-y-6">
                <p className="text-gray-300 text-lg">{selectedRitual.description}</p>
                
                {/* Detailed info here */}
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-white">Details</h3>
                    {/* Add detailed ritual information */}
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-white">Participants</h3>
                    {/* List participants */}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
