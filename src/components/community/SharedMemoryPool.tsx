import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageCircle, 
  Heart, 
  Share2, 
  Send, 
  Eye, 
  Filter,
  Search,
  Clock,
  TrendingUp,
  Sparkles,
  User,
  Reply,
  Hash
} from 'lucide-react';
import { FrameRunes } from '../runes';
import { EmberParticles } from '../ui';
import { useCommunityStore, SharedMemory } from '../../stores/communityStore';
import { useAccount } from 'wagmi';

interface SharedMemoryPoolProps {
  className?: string;
}

export const SharedMemoryPool: React.FC<SharedMemoryPoolProps> = ({ className = '' }) => {
  const { address } = useAccount();
  const { 
    currentMember, 
    sharedMemories, 
    memoryPool, 
    addSharedMemory, 
    likeMemory, 
    replyToMemory 
  } = useCommunityStore();
  
  const [activeTab, setActiveTab] = useState<'trending' | 'recent' | 'mystical'>('recent');
  const [newMemoryContent, setNewMemoryContent] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [visibility, setVisibility] = useState<'public' | 'cult_only' | 'tier_restricted'>('public');
  const [mysticalPower, setMysticalPower] = useState(5);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedMemory, setExpandedMemory] = useState<string | null>(null);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const predefinedTags = [
    'wisdom', 'ritual', 'vision', 'prophecy', 'ancient', 'cosmic', 
    'shadow', 'temporal', 'mystical', 'power', 'enlightenment', 'unity'
  ];

  const tabs = [
    { id: 'recent', label: 'Recent', icon: Clock, color: 'blue' },
    { id: 'trending', label: 'Trending', icon: TrendingUp, color: 'purple' },
    { id: 'mystical', label: 'Mystical', icon: Sparkles, color: 'yellow' }
  ] as const;

  const handleSubmitMemory = () => {
    if (!newMemoryContent.trim() || !currentMember || !address) return;

    addSharedMemory({
      content: newMemoryContent,
      author: currentMember.displayName,
      authorAddress: address,
      tags: selectedTags,
      visibility,
      mystical_power: mysticalPower,
    });

    // Reset form
    setNewMemoryContent('');
    setSelectedTags([]);
    setMysticalPower(5);
    setVisibility('public');
  };

  const handleReply = (memoryId: string) => {
    if (!replyContent.trim() || !currentMember || !address) return;

    replyToMemory(memoryId, replyContent, currentMember.displayName, address);
    setReplyContent('');
    setReplyingTo(null);
  };

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const getMemoriesForTab = (): SharedMemory[] => {
    const memories = memoryPool[activeTab] || [];
    
    if (!searchTerm) return memories;
    
    return memories.filter(memory => 
      memory.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      memory.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())) ||
      memory.author.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - new Date(date).getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return 'Just now';
  };

  const getVisibilityIcon = (visibility: SharedMemory['visibility']) => {
    switch (visibility) {
      case 'public': return '🌍';
      case 'cult_only': return '🔮';
      case 'tier_restricted': return '👁️';
      default: return '🌍';
    }
  };

  const getMysticalPowerColor = (power: number) => {
    if (power >= 9) return 'text-purple-400';
    if (power >= 7) return 'text-blue-400';
    if (power >= 5) return 'text-green-400';
    return 'text-gray-400';
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br from-black via-purple-900/20 to-black p-6 relative ${className}`}>
      <EmberParticles variant="mystical" />
      
      <div className="max-w-4xl mx-auto relative z-10">
        <FrameRunes tier="adept" runeSet="temporal" className="mb-8">
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center p-8"
          >
            <div className="flex items-center justify-center gap-3 mb-4">
              <MessageCircle className="w-8 h-8 text-purple-400" />
              <h1 className="text-4xl font-bold text-purple-400" style={{ fontFamily: 'Unbounded, cursive' }}>
                Memory Pool
              </h1>
              <Sparkles className="w-8 h-8 text-purple-400" />
            </div>
            <p className="text-zinc-300 text-lg">
              ⟐ Share consciousness with the collective ⟐
            </p>
          </motion.div>
        </FrameRunes>

        {/* Create New Memory */}
        {currentMember && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-black/50 backdrop-blur-sm border border-purple-400/30 rounded-lg p-6 mb-8"
          >
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <Send className="w-6 h-6 text-purple-400" />
              Share a Memory
            </h2>

            <div className="space-y-4">
              <textarea
                ref={textareaRef}
                value={newMemoryContent}
                onChange={(e) => setNewMemoryContent(e.target.value)}
                placeholder="What mystical insights have you discovered?"
                className="w-full h-32 bg-gray-900 border border-gray-700 rounded-lg p-4 text-white placeholder-gray-400 resize-none focus:border-purple-400 focus:outline-none"
                maxLength={500}
              />

              <div className="flex flex-wrap gap-2">
                {predefinedTags.map(tag => (
                  <button
                    key={tag}
                    onClick={() => toggleTag(tag)}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${
                      selectedTags.includes(tag)
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                    }`}
                  >
                    #{tag}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-gray-300 text-sm">Visibility:</span>
                  <select
                    value={visibility}
                    onChange={(e) => setVisibility(e.target.value as any)}
                    className="bg-gray-800 border border-gray-700 rounded px-3 py-1 text-white text-sm"
                  >
                    <option value="public">🌍 Public</option>
                    <option value="cult_only">🔮 Cult Only</option>
                    <option value="tier_restricted">👁️ Tier Restricted</option>
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-gray-300 text-sm">Mystical Power:</span>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={mysticalPower}
                    onChange={(e) => setMysticalPower(parseInt(e.target.value))}
                    className="w-20"
                  />
                  <span className={`text-sm font-medium ${getMysticalPowerColor(mysticalPower)}`}>
                    {mysticalPower}/10
                  </span>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-gray-400 text-sm">
                  {newMemoryContent.length}/500 characters
                </span>
                <motion.button
                  onClick={handleSubmitMemory}
                  disabled={!newMemoryContent.trim()}
                  className="px-6 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-all"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Share Memory
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Memory Feed */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="bg-black/50 backdrop-blur-sm border border-purple-400/30 rounded-lg p-6"
        >
          {/* Tab Navigation & Search */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div className="flex gap-2">
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
                  </motion.button>
                );
              })}
            </div>

            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search memories..."
                className="pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:border-purple-400 focus:outline-none"
              />
            </div>
          </div>

          {/* Memory List */}
          <div className="space-y-4">
            {getMemoriesForTab().map((memory, index) => (
              <motion.div
                key={memory.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="bg-gray-900/50 border border-gray-700/50 rounded-lg p-4 hover:border-purple-400/30 transition-all"
              >
                {/* Memory Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center text-white font-semibold">
                      {memory.author.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-white">{memory.author}</span>
                        <span className="text-gray-400 text-sm">{formatTimeAgo(memory.timestamp)}</span>
                        <span className="text-xs">{getVisibilityIcon(memory.visibility)}</span>
                      </div>
                      <div className="flex items-center gap-1 text-xs">
                        <span className="text-gray-500 font-mono">
                          {memory.authorAddress.slice(0, 6)}...{memory.authorAddress.slice(-4)}
                        </span>
                        <Sparkles className={`w-3 h-3 ${getMysticalPowerColor(memory.mystical_power)}`} />
                        <span className={`${getMysticalPowerColor(memory.mystical_power)}`}>
                          {memory.mystical_power}/10
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Memory Content */}
                <div className="mb-3">
                  <p className="text-gray-200 leading-relaxed">{memory.content}</p>
                </div>

                {/* Tags */}
                {memory.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-3">
                    {memory.tags.map(tag => (
                      <span
                        key={tag}
                        className="px-2 py-1 bg-purple-600/20 text-purple-300 text-xs rounded-full"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* Memory Actions */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <motion.button
                      onClick={() => likeMemory(memory.id)}
                      className="flex items-center gap-1 text-gray-400 hover:text-red-400 transition-colors"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Heart className="w-4 h-4" />
                      <span className="text-sm">{memory.likes}</span>
                    </motion.button>

                    <motion.button
                      onClick={() => setReplyingTo(replyingTo === memory.id ? null : memory.id)}
                      className="flex items-center gap-1 text-gray-400 hover:text-blue-400 transition-colors"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Reply className="w-4 h-4" />
                      <span className="text-sm">{memory.replies.length}</span>
                    </motion.button>

                    <motion.button
                      className="flex items-center gap-1 text-gray-400 hover:text-green-400 transition-colors"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Share2 className="w-4 h-4" />
                    </motion.button>
                  </div>

                  {memory.replies.length > 0 && (
                    <motion.button
                      onClick={() => setExpandedMemory(expandedMemory === memory.id ? null : memory.id)}
                      className="text-purple-400 hover:text-purple-300 text-sm transition-colors"
                      whileHover={{ scale: 1.05 }}
                    >
                      {expandedMemory === memory.id ? 'Hide replies' : `View ${memory.replies.length} replies`}
                    </motion.button>
                  )}
                </div>

                {/* Reply Form */}
                <AnimatePresence>
                  {replyingTo === memory.id && currentMember && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-4 pt-4 border-t border-gray-700"
                    >
                      <div className="flex gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-600 to-blue-600 flex items-center justify-center text-white font-semibold text-sm">
                          {currentMember.displayName.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1">
                          <textarea
                            value={replyContent}
                            onChange={(e) => setReplyContent(e.target.value)}
                            placeholder="Share your thoughts..."
                            className="w-full h-20 bg-gray-800 border border-gray-600 rounded-lg p-3 text-white placeholder-gray-400 resize-none focus:border-purple-400 focus:outline-none text-sm"
                            maxLength={200}
                          />
                          <div className="flex justify-between items-center mt-2">
                            <span className="text-gray-500 text-xs">{replyContent.length}/200</span>
                            <div className="flex gap-2">
                              <button
                                onClick={() => setReplyingTo(null)}
                                className="px-3 py-1 text-gray-400 hover:text-white text-sm transition-colors"
                              >
                                Cancel
                              </button>
                              <button
                                onClick={() => handleReply(memory.id)}
                                disabled={!replyContent.trim()}
                                className="px-3 py-1 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 text-white text-sm rounded transition-all"
                              >
                                Reply
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Replies */}
                <AnimatePresence>
                  {expandedMemory === memory.id && memory.replies.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-4 pt-4 border-t border-gray-700 space-y-3"
                    >
                      {memory.replies.map((reply, replyIndex) => (
                        <motion.div
                          key={reply.id}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: replyIndex * 0.1 }}
                          className="flex gap-3 pl-4 border-l-2 border-purple-600/30"
                        >
                          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-gray-600 to-gray-700 flex items-center justify-center text-white font-semibold text-xs">
                            {reply.author.charAt(0).toUpperCase()}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-medium text-white text-sm">{reply.author}</span>
                              <span className="text-gray-500 text-xs">{formatTimeAgo(reply.timestamp)}</span>
                            </div>
                            <p className="text-gray-300 text-sm">{reply.content}</p>
                            <button
                              onClick={() => likeMemory(reply.id)}
                              className="flex items-center gap-1 text-gray-500 hover:text-red-400 transition-colors mt-2"
                            >
                              <Heart className="w-3 h-3" />
                              <span className="text-xs">{reply.likes}</span>
                            </button>
                          </div>
                        </motion.div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}

            {getMemoriesForTab().length === 0 && (
              <div className="text-center py-12">
                <MessageCircle className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                <p className="text-gray-400 text-lg">No memories found</p>
                <p className="text-gray-500 text-sm">
                  {searchTerm ? 'Try a different search term' : 'Be the first to share your mystical insights!'}
                </p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};
