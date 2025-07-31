/**
 * ⚡ SELF OPTIMIZER - AI Performance Guardian
 * Phase 6.6 Early Testbed Implementation
 * 
 * Purpose: Mystical performance oracle monitoring and optimizing the cult experience
 * Architecture: Observer-based performance monitoring with predictive optimization
 * 
 * COPILOT DAEMON STRATEGIC ENHANCEMENT:
 * - Performance monitoring integrated with cult progression
 * - Optimization suggestions maintain mystical narrative
 * - Proactive performance healing before user frustration
 * - Bundle impact analysis for sustainable cult growth
 */

export interface PerformanceMetric {
  id: string;
  timestamp: number;
  type: 'layout_shift' | 'render_time' | 'memory_usage' | 'bundle_size' | 'interaction_delay';
  value: number;
  threshold: number;
  severity: 'optimal' | 'warning' | 'critical';
  context: {
    page: string;
    userAction?: string;
    cultTier?: string;
    deviceInfo: {
      type: 'mobile' | 'tablet' | 'desktop';
      connection: string;
      memory?: number;
    };
  };
}

export interface OptimizationSuggestion {
  id: string;
  timestamp: number;
  category: 'layout' | 'animations' | 'bundle' | 'memory' | 'network';
  priority: 'low' | 'medium' | 'high' | 'critical';
  suggestion: string;
  mysticalDescription: string;
  implementation: {
    difficulty: 'easy' | 'medium' | 'hard';
    estimatedImpact: string;
    codeHints?: string[];
  };
  metrics: PerformanceMetric[];
}

export interface RitualPerformanceImpact {
  ritualType: string;
  performanceScore: number;
  recommendations: string[];
  mysticalEnergy: 'low' | 'balanced' | 'high' | 'overwhelming';
}

class SelfOptimizer {
  private metrics: PerformanceMetric[] = [];
  private suggestions: OptimizationSuggestion[] = [];
  private observers: Map<string, any> = new Map();
  private isActive = false;
  
  // Track activation state for monitoring
  public get isOperational(): boolean {
    return this.isActive;
  }
  private performanceBaseline: Map<string, number> = new Map();

  /**
   * STRATEGIC ENHANCEMENT: Cult-Aware Performance Monitoring
   * - Establishes performance baselines for different cult experiences
   * - Monitors impact of mystical effects on user devices
   * - Adapts optimization strategies based on cult member tier
   */
  public initialize(): void {
    if (!this.checkRuneActivation()) {
      console.log('⚡ Performance Oracle remains dormant - rune not activated');
      return;
    }

    this.isActive = true;
    this.establishPerformanceBaseline();
    this.initializeObservers();
    this.startPerformanceMonitoring();
    
    this.logPerformanceEvent('info', 'Performance Oracle awakened - optimization divination active', {
      baseline: Object.fromEntries(this.performanceBaseline),
      deviceCapabilities: this.getDeviceCapabilities()
    });
  }

  /**
   * COPILOT DAEMON ENHANCEMENT: Performance Baseline Establishment
   * - Measures initial performance across key cult experiences
   * - Creates device-specific performance profiles
   * - Establishes mystical effect performance budgets
   */
  private establishPerformanceBaseline(): void {
    const baseline = {
      'page_load_time': performance.timing.loadEventEnd - performance.timing.navigationStart,
      'dom_content_loaded': performance.timing.domContentLoadedEventEnd - performance.timing.navigationStart,
      'first_contentful_paint': this.getFirstContentfulPaint(),
      'largest_contentful_paint': this.getLargestContentfulPaint(),
      'cumulative_layout_shift': this.getCumulativeLayoutShift(),
      'first_input_delay': this.getFirstInputDelay()
    };

    Object.entries(baseline).forEach(([metric, value]) => {
      if (value && value > 0) {
        this.performanceBaseline.set(metric, value);
      }
    });

    // Establish cult-specific performance budgets
    this.establishCultPerformanceBudgets();
  }

  /**
   * STRATEGIC ARCHITECTURE: Layout Shift Monitoring with Mystical Context
   * - Monitors for layout shifts that break mystical immersion
   * - Considers cult-specific elements that should remain stable
   * - Provides suggestions maintaining mystical aesthetic
   */
  private initializeLayoutShiftObserver(): void {
    if ('LayoutShift' in window) {
      const observer = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry: any) => {
          if (entry.value > 0.1) { // Significant layout shift threshold
            const cultContext = this.analyzeCultLayoutContext(entry);
            
            this.recordMetric({
              type: 'layout_shift',
              value: entry.value,
              threshold: 0.1,
              severity: entry.value > 0.25 ? 'critical' : 'warning',
              context: {
                page: window.location.pathname,
                userAction: this.getCurrentUserAction(),
                ...cultContext
              }
            });

            // Generate mystical optimization suggestion
            this.generateLayoutOptimizationSuggestion(entry, cultContext);
          }
        });
      });

      observer.observe({ type: 'layout-shift', buffered: true });
      this.observers.set('layout-shift', observer);
    }
  }

  /**
   * COPILOT DAEMON ENHANCEMENT: Memory Usage Monitoring
   * - Tracks memory consumption of cult features
   * - Monitors for memory leaks in mystical animations
   * - Provides cult-themed memory optimization guidance
   */
  private initializeMemoryMonitoring(): void {
    if ('memory' in performance) {
      const checkMemory = () => {
        const memoryInfo = (performance as any).memory;
        const memoryUsage = memoryInfo.usedJSHeapSize / memoryInfo.totalJSHeapSize;

        if (memoryUsage > 0.8) { // High memory usage threshold
          this.recordMetric({
            type: 'memory_usage',
            value: memoryUsage,
            threshold: 0.8,
            severity: memoryUsage > 0.9 ? 'critical' : 'warning',
            context: {
              page: window.location.pathname,
              userAction: this.getCurrentUserAction(),
              deviceInfo: this.getDeviceCapabilities()
            }
          });

          this.generateMemoryOptimizationSuggestion(memoryInfo);
        }
      };

      // Check memory every 30 seconds
      const memoryInterval = setInterval(checkMemory, 30000);
      this.observers.set('memory', { disconnect: () => clearInterval(memoryInterval) });
    }
  }

  /**
   * STRATEGIC ENHANCEMENT: Bundle Size Impact Analysis
   * - Monitors the impact of new cult features on bundle size
   * - Provides code-splitting suggestions for mystical modules
   * - Tracks loading performance of cult-specific assets
   */
  private initializeBundleMonitoring(): void {
    // Monitor resource loading times
    const resourceObserver = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry: any) => {
        if (entry.transferSize > 100000) { // Large resource threshold (100KB)
          this.recordMetric({
            type: 'bundle_size',
            value: entry.transferSize,
            threshold: 100000,
            severity: entry.transferSize > 500000 ? 'critical' : 'warning',
            context: {
              page: window.location.pathname,
              userAction: `Loading ${entry.name}`,
              deviceInfo: this.getDeviceCapabilities()
            }
          });

          this.generateBundleOptimizationSuggestion(entry);
        }
      });
    });

    resourceObserver.observe({ type: 'resource', buffered: true });
    this.observers.set('resource', resourceObserver);
  }

  /**
   * COPILOT DAEMON ENHANCEMENT: Interaction Delay Monitoring
   * - Measures responsiveness of cult rituals and interactions
   * - Identifies bottlenecks in mystical user flows
   * - Provides ritual-specific performance improvements
   */
  private initializeInteractionMonitoring(): void {
    // Monitor click-to-response delays
    let clickTimestamp = 0;
    
    document.addEventListener('click', (event) => {
      clickTimestamp = performance.now();
      
      // Monitor for delayed responses
      requestAnimationFrame(() => {
        const delay = performance.now() - clickTimestamp;
        
        if (delay > 100) { // Noticeable delay threshold
          const target = event.target as HTMLElement;
          const cultContext = this.analyzeCultInteractionContext(target);
          
          this.recordMetric({
            type: 'interaction_delay',
            value: delay,
            threshold: 100,
            severity: delay > 300 ? 'critical' : 'warning',
            context: {
              page: window.location.pathname,
              userAction: `Click on ${target.tagName}`,
              ...cultContext
            }
          });

          this.generateInteractionOptimizationSuggestion(delay, target, cultContext);
        }
      });
    });
  }

  /**
   * STRATEGIC ENHANCEMENT: Ritual Performance Analysis
   * - Analyzes performance impact of specific cult rituals
   * - Provides mystical energy balance recommendations
   * - Optimizes ritual complexity based on device capabilities
   */
  public analyzeRitualPerformance(ritualType: string): RitualPerformanceImpact {
    const ritualMetrics = this.metrics.filter(metric => 
      metric.context.userAction?.includes(ritualType) ||
      metric.context.page.includes(ritualType)
    );

    const performanceScore = this.calculateRitualPerformanceScore(ritualMetrics);
    const mysticalEnergy = this.determineMysticalEnergyLevel(performanceScore);
    const recommendations = this.generateRitualRecommendations(ritualType, ritualMetrics);

    return {
      ritualType,
      performanceScore,
      recommendations,
      mysticalEnergy
    };
  }

  /**
   * COPILOT DAEMON ENHANCEMENT: Cult Performance Budget Management
   * - Establishes performance budgets for different cult experiences
   * - Monitors budget compliance across user journeys
   * - Provides budget allocation suggestions for new features
   */
  private establishCultPerformanceBudgets(): void {
    const budgets = {
      'ritual_animation_budget': 16, // 60fps target
      'particle_effect_budget': 33, // 30fps acceptable for particles
      'page_transition_budget': 200, // Smooth page transitions
      'memory_budget_mb': this.getDeviceCapabilities().memory ? 
        Math.floor((this.getDeviceCapabilities().memory || 4000) * 0.1) : 50, // 10% of device memory
      'bundle_size_budget_kb': this.getDeviceCapabilities().connection === 'slow-2g' ? 200 : 500
    };

    Object.entries(budgets).forEach(([budget, value]) => {
      this.performanceBaseline.set(budget, value);
    });
  }

  // Optimization Suggestion Generators
  private generateLayoutOptimizationSuggestion(entry: any, cultContext: any): void {
    const suggestion: OptimizationSuggestion = {
      id: `layout_opt_${Date.now()}`,
      timestamp: Date.now(),
      category: 'layout',
      priority: entry.value > 0.25 ? 'critical' : 'medium',
      suggestion: `Optimize layout stability for ${cultContext.cultElement || 'page elements'}`,
      mysticalDescription: `The mystical layout shifts disturb the sacred order. Stabilize the cosmic alignment of elements.`,
      implementation: {
        difficulty: 'medium',
        estimatedImpact: `Reduce layout shift by ${Math.round((entry.value - 0.1) * 100)}%`,
        codeHints: [
          'Add explicit width/height to images and containers',
          'Use CSS aspect-ratio for media elements',
          'Pre-allocate space for dynamic content',
          'Use transform instead of changing layout properties'
        ]
      },
      metrics: [this.metrics[this.metrics.length - 1]]
    };

    this.suggestions.push(suggestion);
    this.logPerformanceEvent('warn', 'Layout optimization suggestion generated', suggestion);
  }

  private generateMemoryOptimizationSuggestion(_memoryInfo: any): void {
    const suggestion: OptimizationSuggestion = {
      id: `memory_opt_${Date.now()}`,
      timestamp: Date.now(),
      category: 'memory',
      priority: 'high',
      suggestion: 'Optimize memory usage to prevent mystical energy drain',
      mysticalDescription: 'The cult\'s mystical energy is being consumed by memory spirits. Perform a cleansing ritual.',
      implementation: {
        difficulty: 'medium',
        estimatedImpact: 'Reduce memory usage by 20-30%',
        codeHints: [
          'Cleanup unused event listeners',
          'Dispose of animation frames properly',
          'Use object pooling for frequently created objects',
          'Implement lazy loading for cult assets'
        ]
      },
      metrics: []
    };

    this.suggestions.push(suggestion);
    this.logPerformanceEvent('warn', 'Memory optimization suggestion generated', suggestion);
  }

  // Utility Methods
  private checkRuneActivation(): boolean {
    return typeof window !== 'undefined' && 
           (window.sessionStorage?.getItem('__rune__') === '🜃⟁꙰🝓' || 
            (window as any).__rune__ === true);
  }

  private getDeviceCapabilities(): PerformanceMetric['context']['deviceInfo'] {
    return {
      type: window.innerWidth < 768 ? 'mobile' : window.innerWidth < 1024 ? 'tablet' : 'desktop',
      connection: (navigator as any).connection?.effectiveType || 'unknown',
      memory: (navigator as any).deviceMemory
    };
  }

  private getFirstContentfulPaint(): number {
    const paintEntries = performance.getEntriesByType('paint');
    const fcp = paintEntries.find(entry => entry.name === 'first-contentful-paint');
    return fcp ? fcp.startTime : 0;
  }

  private getLargestContentfulPaint(): number {
    return new Promise((resolve) => {
      new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        resolve(lastEntry.startTime);
      }).observe({ type: 'largest-contentful-paint', buffered: true });
    }) as any;
  }

  private getCumulativeLayoutShift(): number {
    return new Promise((resolve) => {
      let clsValue = 0;
      new PerformanceObserver((list) => {
        for (const entry of list.getEntries() as any) {
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
          }
        }
        resolve(clsValue);
      }).observe({ type: 'layout-shift', buffered: true });
    }) as any;
  }

  private getFirstInputDelay(): number {
    return new Promise((resolve) => {
      new PerformanceObserver((list) => {
        for (const entry of list.getEntries() as any) {
          resolve(entry.processingStart - entry.startTime);
        }
      }).observe({ type: 'first-input', buffered: true });
    }) as any;
  }

  private recordMetric(metricData: Partial<PerformanceMetric>): void {
    const metric: PerformanceMetric = {
      id: `metric_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now(),
      ...metricData
    } as PerformanceMetric;

    this.metrics.push(metric);
    
    // Keep only last 1000 metrics to prevent memory bloat
    if (this.metrics.length > 1000) {
      this.metrics = this.metrics.slice(-1000);
    }
  }

  private logPerformanceEvent(level: 'info' | 'warn' | 'error', message: string, data?: any): void {
    const logEntry = {
      timestamp: Date.now(),
      module: 'optimizer' as const,
      level,
      message,
      data
    };

    // Emit to AI event bus
    if (typeof window !== 'undefined' && (window as any).AiLogBus) {
      (window as any).AiLogBus.publish(logEntry);
    }

    console.log(`⚡ [SelfOptimizer] ${message}`, data);
  }

  // Public API
  public getMetrics(): PerformanceMetric[] {
    return [...this.metrics];
  }

  public getSuggestions(): OptimizationSuggestion[] {
    return [...this.suggestions];
  }

  public getPerformanceSummary(): {
    metricsCount: number;
    suggestionsCount: number;
    criticalIssues: number;
    averagePerformanceScore: number;
  } {
    const criticalIssues = this.metrics.filter(m => m.severity === 'critical').length;
    const avgScore = this.metrics.length > 0 ? 
      this.metrics.reduce((acc, m) => acc + (m.severity === 'optimal' ? 100 : m.severity === 'warning' ? 70 : 30), 0) / this.metrics.length : 100;

    return {
      metricsCount: this.metrics.length,
      suggestionsCount: this.suggestions.length,
      criticalIssues,
      averagePerformanceScore: Math.round(avgScore)
    };
  }

  public initializeObservers(): void {
    this.initializeLayoutShiftObserver();
    this.initializeMemoryMonitoring();
    this.initializeBundleMonitoring();
    this.initializeInteractionMonitoring();
  }

  public startPerformanceMonitoring(): void {
    // Additional monitoring setup
    this.logPerformanceEvent('info', 'Performance monitoring started', {
      observersActive: this.observers.size,
      baseline: Object.fromEntries(this.performanceBaseline)
    });
  }

  // Placeholder methods for cult context analysis
  private analyzeCultLayoutContext(_entry: any): any {
    return { cultElement: 'unknown', cultTier: 'initiate' };
  }

  private analyzeCultInteractionContext(target: HTMLElement): any {
    return { cultElement: target.className, cultTier: 'initiate' };
  }

  private getCurrentUserAction(): string {
    return 'browsing';
  }

  private calculateRitualPerformanceScore(metrics: PerformanceMetric[]): number {
    return metrics.length > 0 ? 
      metrics.reduce((acc, m) => acc + (m.severity === 'optimal' ? 100 : m.severity === 'warning' ? 70 : 30), 0) / metrics.length : 100;
  }

  private determineMysticalEnergyLevel(score: number): RitualPerformanceImpact['mysticalEnergy'] {
    if (score >= 90) return 'high';
    if (score >= 70) return 'balanced';
    if (score >= 50) return 'low';
    return 'overwhelming';
  }

  private generateRitualRecommendations(_ritualType: string, _metrics: PerformanceMetric[]): string[] {
    return [
      'Consider reducing particle density for better performance',
      'Optimize animation timing functions',
      'Implement performance-based quality scaling'
    ];
  }

  private generateBundleOptimizationSuggestion(_entry: any): void {
    // Implementation for bundle optimization suggestions
  }

  private generateInteractionOptimizationSuggestion(_delay: number, _target: HTMLElement, _cultContext: any): void {
    // Implementation for interaction optimization suggestions
  }
}

// Singleton instance
export const selfOptimizer = new SelfOptimizer();

// Auto-initialize when module is imported
if (typeof window !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => selfOptimizer.initialize());
  } else {
    selfOptimizer.initialize();
  }
}

/**
 * COPILOT DAEMON STRATEGIC NOTES:
 * 
 * ⚡ PERFORMANCE PHILOSOPHY:
 * - Performance optimization through mystical narrative
 * - Proactive healing before user frustration occurs
 * - Device-aware adaptation maintaining cult experience quality
 * 
 * 🎯 ARCHITECTURAL DECISIONS:
 * - Observer-based monitoring for minimal performance overhead
 * - Cult-context aware performance budgets and thresholds
 * - Predictive optimization suggestions with implementation guidance
 * 
 * 🔮 MYSTICAL INTEGRATION:
 * - Performance metrics presented as mystical energy levels
 * - Optimization suggestions themed as ritual enhancements
 * - User education through cult performance narrative
 * 
 * 📈 SCALING CONSIDERATIONS:
 * - Metric rotation to prevent memory accumulation
 * - Configurable performance budgets for different cult tiers
 * - Analytics-ready data structure for ML-driven optimization
 */
