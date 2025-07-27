import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CultMember {
  id: string;
  address: string;
  displayName: string;
  avatar?: string;
  joinedAt: Date;
  lastActive: Date;
  stats: {
    totalMemories: number;
    achievement_count: number;
    ritual_completions: number;
    sigils_created: number;
    memories_shared: number;
    reputation_score: number;
  };
  badges: string[];
  currentTier: 'initiate' | 'adept' | 'master' | 'oracle';
  favorite_rune_set: 'ancient' | 'temporal' | 'cosmic' | 'shadow';
}

export interface SharedMemory {
  id: string;
  content: string;
  author: string;
  authorAddress: string;
  timestamp: Date;
  likes: number;
  replies: SharedMemoryReply[];
  tags: string[];
  visibility: 'public' | 'cult_only' | 'tier_restricted';
  mystical_power: number;
}

export interface SharedMemoryReply {
  id: string;
  content: string;
  author: string;
  authorAddress: string;
  timestamp: Date;
  likes: number;
}

export interface CollaborativeRitual {
  id: string;
  name: string;
  description: string;
  creator: string;
  participants: string[];
  required_tier: 'initiate' | 'adept' | 'master' | 'oracle';
  max_participants: number;
  start_time: Date;
  duration_minutes: number;
  status: 'pending' | 'active' | 'completed' | 'cancelled';
  mystical_requirements: {
    min_memories: number;
    required_achievements: string[];
    sigil_required: boolean;
  };
  rewards: {
    reputation_points: number;
    exclusive_badge?: string;
    mystical_artifact?: string;
  };
}

export interface LeaderboardEntry {
  rank: number;
  member: CultMember;
  score: number;
  category: 'overall' | 'memories' | 'achievements' | 'rituals' | 'social';
}

interface CommunityState {
  // Member Management
  currentMember: CultMember | null;
  members: CultMember[];
  
  // Memory Pool
  sharedMemories: SharedMemory[];
  memoryPool: {
    trending: SharedMemory[];
    recent: SharedMemory[];
    mystical: SharedMemory[];
  };
  
  // Rituals
  activeRituals: CollaborativeRitual[];
  upcomingRituals: CollaborativeRitual[];
  completedRituals: CollaborativeRitual[];
  
  // Leaderboards
  leaderboards: {
    overall: LeaderboardEntry[];
    weekly: LeaderboardEntry[];
    monthly: LeaderboardEntry[];
    achievements: LeaderboardEntry[];
    rituals: LeaderboardEntry[];
  };
  
  // Social Features
  following: string[];
  followers: string[];
  notifications: CommunityNotification[];
  
  // Actions
  initializeMember: (address: string, displayName: string) => void;
  updateMemberStats: (memberId: string, stats: Partial<CultMember['stats']>) => void;
  addSharedMemory: (memory: Omit<SharedMemory, 'id' | 'timestamp' | 'likes' | 'replies'>) => void;
  likeMemory: (memoryId: string) => void;
  replyToMemory: (memoryId: string, content: string, author: string, authorAddress: string) => void;
  createRitual: (ritual: Omit<CollaborativeRitual, 'id' | 'participants' | 'status'>) => void;
  joinRitual: (ritualId: string, memberId: string) => void;
  completeRitual: (ritualId: string) => void;
  followMember: (memberId: string) => void;
  unfollowMember: (memberId: string) => void;
  updateLeaderboards: () => void;
  addNotification: (notification: Omit<CommunityNotification, 'id' | 'timestamp'>) => void;
  markNotificationRead: (notificationId: string) => void;
}

export interface CommunityNotification {
  id: string;
  type: 'ritual_invite' | 'memory_like' | 'new_follower' | 'achievement_earned' | 'ritual_completed';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  actionUrl?: string;
  metadata?: Record<string, any>;
}

const generateId = () => Math.random().toString(36).substr(2, 9);

const calculateMemberScore = (member: CultMember): number => {
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

const getTierMultiplier = (tier: CultMember['currentTier']): number => {
  switch (tier) {
    case 'oracle': return 2.0;
    case 'master': return 1.5;
    case 'adept': return 1.2;
    case 'initiate': return 1.0;
    default: return 1.0;
  }
};

export const useCommunityStore = create<CommunityState>()(
  persist(
    (set, get) => ({
      // Initial State
      currentMember: null,
      members: [],
      sharedMemories: [],
      memoryPool: {
        trending: [],
        recent: [],
        mystical: [],
      },
      activeRituals: [],
      upcomingRituals: [],
      completedRituals: [],
      leaderboards: {
        overall: [],
        weekly: [],
        monthly: [],
        achievements: [],
        rituals: [],
      },
      following: [],
      followers: [],
      notifications: [],

      // Actions
      initializeMember: (address: string, displayName: string) => {
        set((state) => {
          const existingMember = state.members.find(m => m.address === address);
          if (existingMember) {
            return { currentMember: existingMember };
          }

          const newMember: CultMember = {
            id: generateId(),
            address,
            displayName,
            joinedAt: new Date(),
            lastActive: new Date(),
            stats: {
              totalMemories: 0,
              achievement_count: 0,
              ritual_completions: 0,
              sigils_created: 0,
              memories_shared: 0,
              reputation_score: 100, // Starting reputation
            },
            badges: ['newcomer'],
            currentTier: 'initiate',
            favorite_rune_set: 'ancient',
          };

          return {
            currentMember: newMember,
            members: [...state.members, newMember],
          };
        });
      },

      updateMemberStats: (memberId: string, newStats: Partial<CultMember['stats']>) => {
        set((state) => ({
          members: state.members.map(member =>
            member.id === memberId
              ? {
                  ...member,
                  stats: { ...member.stats, ...newStats },
                  lastActive: new Date(),
                }
              : member
          ),
          currentMember: state.currentMember?.id === memberId
            ? {
                ...state.currentMember,
                stats: { ...state.currentMember.stats, ...newStats },
                lastActive: new Date(),
              }
            : state.currentMember,
        }));
        get().updateLeaderboards();
      },

      addSharedMemory: (memoryData) => {
        const memory: SharedMemory = {
          ...memoryData,
          id: generateId(),
          timestamp: new Date(),
          likes: 0,
          replies: [],
        };

        set((state) => {
          const newMemories = [memory, ...state.sharedMemories];
          return {
            sharedMemories: newMemories,
            memoryPool: {
              trending: newMemories.slice(0, 10),
              recent: newMemories.slice(0, 20),
              mystical: newMemories.filter(m => m.mystical_power > 7).slice(0, 15),
            },
          };
        });

        // Update author's stats
        const { currentMember } = get();
        if (currentMember && currentMember.address === memoryData.authorAddress) {
          get().updateMemberStats(currentMember.id, {
            memories_shared: currentMember.stats.memories_shared + 1,
            reputation_score: currentMember.stats.reputation_score + 5,
          });
        }
      },

      likeMemory: (memoryId: string) => {
        set((state) => ({
          sharedMemories: state.sharedMemories.map(memory =>
            memory.id === memoryId
              ? { ...memory, likes: memory.likes + 1 }
              : memory
          ),
        }));
      },

      replyToMemory: (memoryId: string, content: string, author: string, authorAddress: string) => {
        const reply: SharedMemoryReply = {
          id: generateId(),
          content,
          author,
          authorAddress,
          timestamp: new Date(),
          likes: 0,
        };

        set((state) => ({
          sharedMemories: state.sharedMemories.map(memory =>
            memory.id === memoryId
              ? { ...memory, replies: [...memory.replies, reply] }
              : memory
          ),
        }));
      },

      createRitual: (ritualData) => {
        const ritual: CollaborativeRitual = {
          ...ritualData,
          id: generateId(),
          participants: [],
          status: 'pending',
        };

        set((state) => ({
          upcomingRituals: [...state.upcomingRituals, ritual],
        }));
      },

      joinRitual: (ritualId: string, memberId: string) => {
        set((state) => ({
          upcomingRituals: state.upcomingRituals.map(ritual =>
            ritual.id === ritualId && ritual.participants.length < ritual.max_participants
              ? { ...ritual, participants: [...ritual.participants, memberId] }
              : ritual
          ),
        }));
      },

      completeRitual: (ritualId: string) => {
        set((state) => {
          const ritual = state.upcomingRituals.find(r => r.id === ritualId) ||
                          state.activeRituals.find(r => r.id === ritualId);
          
          if (!ritual) return state;

          const completedRitual = { ...ritual, status: 'completed' as const };

          // Award rewards to participants
          ritual.participants.forEach(participantId => {
            const member = state.members.find(m => m.id === participantId);
            if (member) {
              get().updateMemberStats(participantId, {
                ritual_completions: member.stats.ritual_completions + 1,
                reputation_score: member.stats.reputation_score + ritual.rewards.reputation_points,
              });
            }
          });

          return {
            upcomingRituals: state.upcomingRituals.filter(r => r.id !== ritualId),
            activeRituals: state.activeRituals.filter(r => r.id !== ritualId),
            completedRituals: [...state.completedRituals, completedRitual],
          };
        });
      },

      followMember: (memberId: string) => {
        set((state) => ({
          following: [...state.following, memberId],
        }));
      },

      unfollowMember: (memberId: string) => {
        set((state) => ({
          following: state.following.filter(id => id !== memberId),
        }));
      },

      updateLeaderboards: () => {
        set((state) => {
          const membersWithScores = state.members.map(member => ({
            member,
            score: calculateMemberScore(member) * getTierMultiplier(member.currentTier),
          }));

          const sortedByScore = membersWithScores
            .sort((a, b) => b.score - a.score)
            .map((entry, index) => ({
              rank: index + 1,
              member: entry.member,
              score: entry.score,
              category: 'overall' as const,
            }));

          const achievementLeaders = membersWithScores
            .sort((a, b) => b.member.stats.achievement_count - a.member.stats.achievement_count)
            .map((entry, index) => ({
              rank: index + 1,
              member: entry.member,
              score: entry.member.stats.achievement_count,
              category: 'achievements' as const,
            }));

          const ritualLeaders = membersWithScores
            .sort((a, b) => b.member.stats.ritual_completions - a.member.stats.ritual_completions)
            .map((entry, index) => ({
              rank: index + 1,
              member: entry.member,
              score: entry.member.stats.ritual_completions,
              category: 'rituals' as const,
            }));

          return {
            leaderboards: {
              overall: sortedByScore.slice(0, 50),
              weekly: sortedByScore.slice(0, 20), // TODO: Implement time-based filtering
              monthly: sortedByScore.slice(0, 30),
              achievements: achievementLeaders.slice(0, 25),
              rituals: ritualLeaders.slice(0, 25),
            },
          };
        });
      },

      addNotification: (notificationData) => {
        const notification: CommunityNotification = {
          ...notificationData,
          id: generateId(),
          timestamp: new Date(),
          read: false,
        };

        set((state) => ({
          notifications: [notification, ...state.notifications].slice(0, 50), // Keep last 50
        }));
      },

      markNotificationRead: (notificationId: string) => {
        set((state) => ({
          notifications: state.notifications.map(notification =>
            notification.id === notificationId
              ? { ...notification, read: true }
              : notification
          ),
        }));
      },
    }),
    {
      name: 'echocronverse-community',
      version: 1,
    }
  )
);
