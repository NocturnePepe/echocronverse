/**
 * 🔄 AI EVENT BUS - Mystical Intelligence Communication System
 * Phase 6.6 Early Testbed Implementation
 * 
 * Purpose: Central nervous system for AI module communication and coordination
 * Architecture: Simple pub/sub pattern with mystical event categorization
 * 
 * COPILOT DAEMON STRATEGIC ENHANCEMENT:
 * - Unified communication layer for all AI modules
 * - Event categorization maintaining mystical narrative
 * - Performance-optimized message routing
 * - Admin dashboard integration ready
 */

export interface AiLogEntry {
  id: string;
  timestamp: number;
  module: 'optimizer' | 'sentinel' | 'uxAgent' | 'feedback' | 'memory' | 'system';
  level: 'info' | 'warn' | 'error' | 'success' | 'debug';
  message: string;
  data?: any;
  mysticalContext?: {
    cultSignificance: 'low' | 'medium' | 'high';
    ritualPhase?: string;
    userTier?: string;
    emergencyLevel?: 'none' | 'minor' | 'major' | 'critical';
  };
}

export interface AiEventSubscription {
  id: string;
  callback: (entry: AiLogEntry) => void;
  filters?: {
    modules?: AiLogEntry['module'][];
    levels?: AiLogEntry['level'][];
    keywords?: string[];
  };
}

export interface AiSystemMetrics {
  totalEvents: number;
  eventsByModule: Record<string, number>;
  eventsByLevel: Record<string, number>;
  lastActivity: number;
  activeSubscriptions: number;
  systemHealth: 'optimal' | 'degraded' | 'critical';
}

class AiLogBus {
  private events: AiLogEntry[] = [];
  private subscriptions: Map<string, AiEventSubscription> = new Map();
  private isInitialized = false;
  private maxEvents = 1000; // Prevent memory bloat
  private readonly STORAGE_KEY = 'ai_log_bus_events';

  /**
   * STRATEGIC ENHANCEMENT: Mystical Communication Initialization
   * - Sets up AI module communication infrastructure
   * - Establishes event persistence for admin dashboard
   * - Initializes system health monitoring
   */
  public initialize(): void {
    if (!this.checkRuneActivation()) {
      console.log('🔄 AI Event Bus remains dormant - rune not activated');
      return;
    }

    this.isInitialized = true;
    this.loadPersistedEvents();
    this.setupSystemMonitoring();
    
    // Make globally available for AI modules
    if (typeof window !== 'undefined') {
      (window as any).AiLogBus = this;
    }

    this.publish({
      module: 'system',
      level: 'success',
      message: 'AI Event Bus awakened - mystical communication channels open',
      data: {
        maxEvents: this.maxEvents,
        persistenceEnabled: true,
        globallyAvailable: true
      },
      mysticalContext: {
        cultSignificance: 'high',
        ritualPhase: 'initialization',
        emergencyLevel: 'none'
      }
    });
  }

  /**
   * COPILOT DAEMON ENHANCEMENT: Event Publishing with Mystical Context
   * - Publishes events to all subscribed listeners
   * - Adds mystical context and unique identification
   * - Persists events for admin dashboard consumption
   */
  public publish(eventData: Omit<AiLogEntry, 'id' | 'timestamp'>): void {
    if (!this.isInitialized) {
      console.warn('🔄 AI Event Bus not initialized - event dropped');
      return;
    }

    const event: AiLogEntry = {
      id: `ai_event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now(),
      ...eventData
    };

    // Add to events array
    this.events.push(event);
    
    // Trim events if exceeding max
    if (this.events.length > this.maxEvents) {
      this.events = this.events.slice(-this.maxEvents);
    }

    // Persist events for admin dashboard
    this.persistEvents();

    // Notify all subscribers
    this.notifySubscribers(event);

    // Console logging for development
    this.logToConsole(event);
  }

  /**
   * STRATEGIC ARCHITECTURE: Intelligent Event Subscription
   * - Allows components to subscribe to specific event types
   * - Supports filtering by module, level, and keywords
   * - Returns subscription ID for later unsubscription
   */
  public subscribe(
    callback: (entry: AiLogEntry) => void,
    filters?: AiEventSubscription['filters']
  ): string {
    const subscription: AiEventSubscription = {
      id: `sub_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      callback,
      filters
    };

    this.subscriptions.set(subscription.id, subscription);

    this.publish({
      module: 'system',
      level: 'info',
      message: `New subscription registered: ${subscription.id}`,
      data: { filters, subscriptionCount: this.subscriptions.size }
    });

    return subscription.id;
  }

  /**
   * COPILOT DAEMON ENHANCEMENT: Event Subscription Management
   * - Removes event subscriptions to prevent memory leaks
   * - Validates subscription existence before removal
   * - Logs subscription lifecycle for debugging
   */
  public unsubscribe(subscriptionId: string): boolean {
    const success = this.subscriptions.delete(subscriptionId);
    
    if (success) {
      this.publish({
        module: 'system',
        level: 'info',
        message: `Subscription removed: ${subscriptionId}`,
        data: { remainingSubscriptions: this.subscriptions.size }
      });
    }

    return success;
  }

  /**
   * STRATEGIC ENHANCEMENT: Event Filtering and Querying
   * - Retrieves events based on time range and filters
   * - Supports mystical context querying
   * - Optimized for admin dashboard consumption
   */
  public getEvents(options?: {
    since?: number;
    modules?: AiLogEntry['module'][];
    levels?: AiLogEntry['level'][];
    limit?: number;
    keywords?: string[];
  }): AiLogEntry[] {
    let filteredEvents = [...this.events];

    if (options?.since) {
      filteredEvents = filteredEvents.filter(event => event.timestamp >= options.since!);
    }

    if (options?.modules) {
      filteredEvents = filteredEvents.filter(event => options.modules!.includes(event.module));
    }

    if (options?.levels) {
      filteredEvents = filteredEvents.filter(event => options.levels!.includes(event.level));
    }

    if (options?.keywords) {
      filteredEvents = filteredEvents.filter(event =>
        options.keywords!.some(keyword =>
          event.message.toLowerCase().includes(keyword.toLowerCase()) ||
          JSON.stringify(event.data || {}).toLowerCase().includes(keyword.toLowerCase())
        )
      );
    }

    if (options?.limit) {
      filteredEvents = filteredEvents.slice(-options.limit);
    }

    return filteredEvents;
  }

  /**
   * COPILOT DAEMON ENHANCEMENT: System Health Monitoring
   * - Provides comprehensive AI system metrics
   * - Calculates system health based on event patterns
   * - Surfaces metrics for admin dashboard consumption
   */
  public getSystemMetrics(): AiSystemMetrics {
    const now = Date.now();
    const last5Minutes = now - 300000;
    const recentEvents = this.events.filter(event => event.timestamp >= last5Minutes);

    const eventsByModule: Record<string, number> = {};
    const eventsByLevel: Record<string, number> = {};

    this.events.forEach(event => {
      eventsByModule[event.module] = (eventsByModule[event.module] || 0) + 1;
      eventsByLevel[event.level] = (eventsByLevel[event.level] || 0) + 1;
    });

    // Calculate system health
    const criticalEvents = recentEvents.filter(e => e.level === 'error' || e.level === 'warn').length;
    const systemHealth: AiSystemMetrics['systemHealth'] = 
      criticalEvents > 10 ? 'critical' :
      criticalEvents > 3 ? 'degraded' : 'optimal';

    return {
      totalEvents: this.events.length,
      eventsByModule,
      eventsByLevel,
      lastActivity: this.events.length > 0 ? this.events[this.events.length - 1].timestamp : 0,
      activeSubscriptions: this.subscriptions.size,
      systemHealth
    };
  }

  /**
   * STRATEGIC ENHANCEMENT: Event Stream for Real-time Dashboard
   * - Provides live event stream for admin dashboard
   * - Filters events based on dashboard requirements
   * - Optimized for real-time UI updates
   */
  public createLiveStream(filters?: {
    modules?: AiLogEntry['module'][];
    levels?: AiLogEntry['level'][];
    maxItems?: number;
  }): {
    subscribe: (callback: (events: AiLogEntry[]) => void) => string;
    unsubscribe: (id: string) => void;
    getInitialEvents: () => AiLogEntry[];
  } {
    const maxItems = filters?.maxItems || 50;
    
    return {
      subscribe: (callback: (events: AiLogEntry[]) => void) => {
        return this.subscribe((event) => {
          if (this.eventMatchesFilters(event, filters)) {
            const recentEvents = this.getEvents({
              modules: filters?.modules,
              levels: filters?.levels,
              limit: maxItems
            });
            callback(recentEvents);
          }
        });
      },
      unsubscribe: (id: string) => {
        this.unsubscribe(id);
      },
      getInitialEvents: () => {
        return this.getEvents({
          modules: filters?.modules,
          levels: filters?.levels,
          limit: maxItems
        });
      }
    };
  }

  /**
   * COPILOT DAEMON ENHANCEMENT: Emergency Event Broadcasting
   * - Handles critical system events requiring immediate attention
   * - Triggers mystical emergency protocols
   * - Ensures critical events are never lost
   */
  public broadcastEmergency(
    module: AiLogEntry['module'],
    message: string,
    data?: any
  ): void {
    const emergencyEvent: Omit<AiLogEntry, 'id' | 'timestamp'> = {
      module,
      level: 'error',
      message: `🚨 EMERGENCY: ${message}`,
      data,
      mysticalContext: {
        cultSignificance: 'high',
        emergencyLevel: 'critical',
        ritualPhase: 'emergency_response'
      }
    };

    this.publish(emergencyEvent);

    // Also log to console immediately
    console.error(`🚨 [AI Emergency] ${message}`, data);

    // Trigger emergency notification if in browser
    if (typeof window !== 'undefined' && 'Notification' in window) {
      this.triggerEmergencyNotification(message);
    }
  }

  // Private Methods

  private checkRuneActivation(): boolean {
    return typeof window !== 'undefined' && 
           (window.sessionStorage?.getItem('__rune__') === '🜃⟁꙰🝓' || 
            (window as any).__rune__ === true);
  }

  private loadPersistedEvents(): void {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        this.events = Array.isArray(parsed) ? parsed.slice(-this.maxEvents) : [];
      }
    } catch (error) {
      console.warn('🔄 Failed to load persisted AI events:', error);
      this.events = [];
    }
  }

  private persistEvents(): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.events));
    } catch (error) {
      console.warn('🔄 Failed to persist AI events:', error);
    }
  }

  private notifySubscribers(event: AiLogEntry): void {
    this.subscriptions.forEach(subscription => {
      if (this.eventMatchesFilters(event, subscription.filters)) {
        try {
          subscription.callback(event);
        } catch (error) {
          console.error(`🔄 Subscription callback error (${subscription.id}):`, error);
        }
      }
    });
  }

  private eventMatchesFilters(
    event: AiLogEntry,
    filters?: AiEventSubscription['filters']
  ): boolean {
    if (!filters) return true;

    if (filters.modules && !filters.modules.includes(event.module)) {
      return false;
    }

    if (filters.levels && !filters.levels.includes(event.level)) {
      return false;
    }

    if (filters.keywords) {
      const matchesKeyword = filters.keywords.some(keyword =>
        event.message.toLowerCase().includes(keyword.toLowerCase()) ||
        JSON.stringify(event.data || {}).toLowerCase().includes(keyword.toLowerCase())
      );
      if (!matchesKeyword) return false;
    }

    return true;
  }

  private logToConsole(event: AiLogEntry): void {
    const emoji = {
      info: 'ℹ️',
      warn: '⚠️',
      error: '🚨',
      success: '✅',
      debug: '🔍'
    };

    const moduleEmoji = {
      optimizer: '⚡',
      sentinel: '🛡️',
      uxAgent: '📊',
      feedback: '🔄',
      memory: '📝',
      system: '🔄'
    };

    const prefix = `${emoji[event.level]} ${moduleEmoji[event.module]} [${event.module}]`;
    
    switch (event.level) {
      case 'error':
        console.error(prefix, event.message, event.data);
        break;
      case 'warn':
        console.warn(prefix, event.message, event.data);
        break;
      case 'success':
        console.log(`%c${prefix} ${event.message}`, 'color: #10b981', event.data);
        break;
      default:
        console.log(prefix, event.message, event.data);
    }
  }

  private setupSystemMonitoring(): void {
    // Monitor system health every 30 seconds
    setInterval(() => {
      const metrics = this.getSystemMetrics();
      
      if (metrics.systemHealth === 'critical') {
        this.broadcastEmergency('system', 'AI system health critical - immediate attention required', metrics);
      } else if (metrics.systemHealth === 'degraded') {
        this.publish({
          module: 'system',
          level: 'warn',
          message: 'AI system health degraded - monitoring required',
          data: metrics
        });
      }
    }, 30000);
  }

  private triggerEmergencyNotification(message: string): void {
    if (Notification.permission === 'granted') {
      new Notification('EchoCronVerse AI Emergency', {
        body: message,
        icon: '/favicon.ico'
      });
    }
  }

  // Public Utility Methods

  public clearEvents(): void {
    this.events = [];
    this.persistEvents();
    this.publish({
      module: 'system',
      level: 'info',
      message: 'AI event log cleared',
      data: { clearedAt: Date.now() }
    });
  }

  public exportEvents(): string {
    return JSON.stringify(this.events, null, 2);
  }

  public getEventCount(): number {
    return this.events.length;
  }

  public isOperational(): boolean {
    return this.isInitialized;
  }
}

// Singleton instance
export const aiLogBus = new AiLogBus();

// Auto-initialize when module is imported
if (typeof window !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => aiLogBus.initialize());
  } else {
    aiLogBus.initialize();
  }
}

/**
 * COPILOT DAEMON STRATEGIC NOTES:
 * 
 * 🔄 EVENT BUS PHILOSOPHY:
 * - Central nervous system for AI module coordination
 * - Mystical event categorization maintaining cult narrative
 * - Performance-optimized communication with memory management
 * 
 * 🎯 ARCHITECTURAL DECISIONS:
 * - Simple pub/sub pattern for maximum compatibility
 * - Event persistence for admin dashboard integration
 * - Emergency broadcasting for critical system events
 * 
 * 🔮 MYSTICAL INTEGRATION:
 * - Events presented through mystical communication narrative
 * - Emergency protocols themed as mystical system responses
 * - System health monitoring as mystical energy assessment
 * 
 * 📈 SCALING CONSIDERATIONS:
 * - Event rotation to prevent memory bloat (1000 event limit)
 * - Configurable filtering for performance optimization
 * - Admin dashboard ready with real-time streaming capabilities
 */
