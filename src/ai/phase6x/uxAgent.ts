/**
 * 📊 UX AGENT - User Experience Intelligence Oracle
 * Phase 6.6 Early Testbed Implementation
 * 
 * Purpose: Mystical oracle analyzing user behavior and adapting cult experience
 * Architecture: Behavioral pattern recognition with predictive UX enhancement
 * 
 * COPILOT DAEMON STRATEGIC ENHANCEMENT:
 * - User behavior analysis through mystical journey lens
 * - Frustration detection with cult-appropriate interventions
 * - Engagement prediction maintaining immersive experience
 * - Adaptive UX that evolves with user's cult progression
 */

export interface UserBehaviorPattern {
  id: string;
  timestamp: number;
  sessionId: string;
  patternType: 'navigation' | 'interaction' | 'engagement' | 'frustration' | 'flow_disruption';
  severity: 'normal' | 'concerning' | 'critical';
  data: {
    mouseTrajectory?: Array<{ x: number; y: number; timestamp: number }>;
    clickPattern?: Array<{ element: string; timestamp: number; coordinates: [number, number] }>;
    scrollBehavior?: { speed: number; direction: 'up' | 'down'; erratic: boolean };
    timeOnElement?: number;
    hesitationPoints?: Array<{ element: string; hesitationDuration: number }>;
  };
  cultContext: {
    memberTier: string;
    ritualProgress: number;
    currentPage: string;
    timeInSession: number;
    previousFrustrationEvents: number;
  };
}

export interface FrustrationMetrics {
  rageClicks: number;
  rapidBackButtonUsage: number;
  errorEncounters: number;
  hesitationTime: number;
  abandonmentSignals: number;
  mysticalInterventionsTriggered: number;
}

export interface EngagementPrediction {
  score: number; // 0-100, higher = more likely to remain engaged
  riskFactors: string[];
  protectiveFactors: string[];
  recommendedInterventions: Array<{
    type: 'mystical_guidance' | 'difficulty_adjustment' | 'content_suggestion' | 'ritual_assistance';
    urgency: 'low' | 'medium' | 'high';
    description: string;
    mysticalNarrative: string;
  }>;
}

export interface MysticalHeatmap {
  timestamp: number;
  pageUrl: string;
  interactionDensity: Array<{
    x: number;
    y: number;
    intensity: number;
    element: string;
    mysticalSignificance: 'low' | 'medium' | 'high';
  }>;
  attentionZones: Array<{
    area: { x: number; y: number; width: number; height: number };
    dwellTime: number;
    engagementLevel: 'browsing' | 'focused' | 'struggling' | 'mastering';
  }>;
}

class UXAgent {
  private behaviorPatterns: UserBehaviorPattern[] = [];
  private currentSession: string = '';
  private frustrationMetrics: FrustrationMetrics = {
    rageClicks: 0,
    rapidBackButtonUsage: 0,
    errorEncounters: 0,
    hesitationTime: 0,
    abandonmentSignals: 0,
    mysticalInterventionsTriggered: 0
  };
  private mouseTrajectory: Array<{ x: number; y: number; timestamp: number }> = [];
  private interactionHeatmap: Map<string, number> = new Map();
  private isActive = false;
  private observers: Map<string, any> = new Map();
  
  // Track activation state
  public get isOperational(): boolean {
    return this.isActive;
  }
  
  // Access observer count for monitoring
  public get observerCount(): number {
    return this.observers.size;
  }

  /**
   * STRATEGIC ENHANCEMENT: Cult-Aware UX Intelligence
   * - Initializes behavioral tracking with mystical context awareness
   * - Establishes user journey baselines for different cult progression levels
   * - Sets up predictive engagement monitoring with intervention triggers
   */
  public initialize(): void {
    if (!this.checkRuneActivation()) {
      console.log('📊 UX Oracle remains dormant - rune not activated');
      return;
    }

    this.isActive = true;
    this.currentSession = this.generateSessionId();
    this.initializeBehaviorTracking();
    this.startEngagementMonitoring();
    this.setupFrustrationDetection();
    
    this.logUXEvent('info', 'UX Oracle awakened - behavioral divination active', {
      sessionId: this.currentSession,
      cultContext: this.getCurrentCultContext(),
      deviceCapabilities: this.getDeviceCapabilities()
    });
  }

  /**
   * COPILOT DAEMON ENHANCEMENT: Advanced Mouse Trajectory Analysis
   * - Tracks pointer movement patterns indicating confusion or confidence
   * - Identifies navigation hesitation points in cult journey
   * - Detects exploration vs. goal-directed behavior patterns
   */
  private initializeMouseTracking(): void {
    let lastMouseTime = 0;
    
    document.addEventListener('mousemove', (event) => {
      const now = Date.now();
      
      // Throttle to every 100ms to prevent performance impact
      if (now - lastMouseTime > 100) {
        this.mouseTrajectory.push({
          x: event.clientX,
          y: event.clientY,
          timestamp: now
        });

        // Keep only last 100 points to prevent memory bloat
        if (this.mouseTrajectory.length > 100) {
          this.mouseTrajectory = this.mouseTrajectory.slice(-100);
        }

        lastMouseTime = now;
      }

      // Analyze trajectory for patterns
      if (this.mouseTrajectory.length >= 10) {
        this.analyzeMousePatterns();
      }
    }, { passive: true });
  }

  /**
   * STRATEGIC ARCHITECTURE: Rage-Click Detection with Mystical Intervention
   * - Detects rapid clicking patterns indicating user frustration
   * - Considers cult context when determining appropriate intervention
   * - Triggers mystical assistance while maintaining immersion
   */
  private setupRageClickDetection(): void {
    let clickBuffer: Array<{ timestamp: number; element: string; coordinates: [number, number] }> = [];
    
    document.addEventListener('click', (event) => {
      const now = Date.now();
      const target = event.target as HTMLElement;
      const coordinates: [number, number] = [event.clientX, event.clientY];
      
      clickBuffer.push({
        timestamp: now,
        element: this.getElementIdentifier(target),
        coordinates
      });

      // Keep only clicks from last 3 seconds
      clickBuffer = clickBuffer.filter(click => now - click.timestamp < 3000);

      // Rage clicking detection: 6+ clicks in 3 seconds on same general area
      const recentClicks = clickBuffer.filter(click => 
        Math.abs(click.coordinates[0] - coordinates[0]) < 50 &&
        Math.abs(click.coordinates[1] - coordinates[1]) < 50
      );

      if (recentClicks.length >= 6) {
        this.frustrationMetrics.rageClicks++;
        
        const behaviorPattern: UserBehaviorPattern = {
          id: `rage_click_${Date.now()}`,
          timestamp: now,
          sessionId: this.currentSession,
          patternType: 'frustration',
          severity: 'critical',
          data: {
            clickPattern: recentClicks
          },
          cultContext: this.getCurrentCultContext()
        };

        this.recordBehaviorPattern(behaviorPattern);
        this.triggerMysticalIntervention('rage_clicking', target);
        
        // Clear buffer after detection
        clickBuffer = [];
      }
    });
  }

  /**
   * COPILOT DAEMON ENHANCEMENT: Scroll Behavior Analysis
   * - Analyzes scroll patterns for engagement vs. scanning behavior
   * - Detects erratic scrolling indicating confusion or frustration
   * - Identifies content consumption patterns for optimization
   */
  private initializeScrollAnalysis(): void {
    let scrollBuffer: Array<{ timestamp: number; position: number; direction: 'up' | 'down' }> = [];
    let lastScrollPosition = window.scrollY;
    
    window.addEventListener('scroll', () => {
      const now = Date.now();
      const currentPosition = window.scrollY;
      const direction = currentPosition > lastScrollPosition ? 'down' : 'up';
      
      scrollBuffer.push({ timestamp: now, position: currentPosition, direction });
      
      // Keep only last 20 scroll events
      if (scrollBuffer.length > 20) {
        scrollBuffer = scrollBuffer.slice(-20);
      }

      // Analyze for erratic scrolling (rapid direction changes)
      if (scrollBuffer.length >= 10) {
        const recentScrolls = scrollBuffer.slice(-10);
        const directionChanges = recentScrolls.reduce((changes, scroll, index) => {
          if (index > 0 && scroll.direction !== recentScrolls[index - 1].direction) {
            changes++;
          }
          return changes;
        }, 0);

        // Erratic scrolling: 5+ direction changes in last 10 scrolls
        if (directionChanges >= 5) {
          const timespan = recentScrolls[recentScrolls.length - 1].timestamp - recentScrolls[0].timestamp;
          
          if (timespan < 3000) { // Within 3 seconds
            this.recordBehaviorPattern({
              id: `erratic_scroll_${Date.now()}`,
              timestamp: now,
              sessionId: this.currentSession,
              patternType: 'frustration',
              severity: 'concerning',
              data: {
                scrollBehavior: {
                  speed: Math.abs(currentPosition - lastScrollPosition) / (timespan / 1000),
                  direction,
                  erratic: true
                }
              },
              cultContext: this.getCurrentCultContext()
            });

            this.considerMysticalGuidance('content_navigation');
          }
        }
      }

      lastScrollPosition = currentPosition;
    }, { passive: true });
  }

  /**
   * STRATEGIC ENHANCEMENT: Hesitation Point Detection
   * - Identifies elements where users pause indicating uncertainty
   * - Maps hesitation patterns to cult progression obstacles
   * - Provides proactive assistance for common struggle points
   */
  private setupHesitationDetection(): void {
    let elementHoverStart: Map<string, number> = new Map();
    
    // Track mouse enter/leave events for hesitation analysis
    document.addEventListener('mouseenter', (event) => {
      const target = event.target as HTMLElement;
      if (this.isCultElement(target)) {
        const elementId = this.getElementIdentifier(target);
        elementHoverStart.set(elementId, Date.now());
      }
    }, true);

    document.addEventListener('mouseleave', (event) => {
      const target = event.target as HTMLElement;
      if (this.isCultElement(target)) {
        const elementId = this.getElementIdentifier(target);
        const startTime = elementHoverStart.get(elementId);
        
        if (startTime) {
          const hesitationDuration = Date.now() - startTime;
          
          // Significant hesitation: 3+ seconds on interactive element
          if (hesitationDuration > 3000) {
            this.frustrationMetrics.hesitationTime += hesitationDuration;
            
            this.recordBehaviorPattern({
              id: `hesitation_${Date.now()}`,
              timestamp: Date.now(),
              sessionId: this.currentSession,
              patternType: 'engagement',
              severity: hesitationDuration > 8000 ? 'concerning' : 'normal',
              data: {
                timeOnElement: hesitationDuration,
                hesitationPoints: [{ element: elementId, hesitationDuration }]
              },
              cultContext: this.getCurrentCultContext()
            });

            // Offer mystical guidance for prolonged hesitation
            if (hesitationDuration > 8000) {
              this.considerMysticalGuidance('hesitation_assistance');
            }
          }
          
          elementHoverStart.delete(elementId);
        }
      }
    }, true);
  }

  /**
   * COPILOT DAEMON ENHANCEMENT: Engagement Prediction Engine
   * - Analyzes behavioral patterns to predict user engagement likelihood
   * - Identifies risk factors for abandonment or frustration
   * - Recommends proactive interventions maintaining cult immersion
   */
  public predictEngagement(): EngagementPrediction {
    const recentPatterns = this.behaviorPatterns.filter(
      pattern => Date.now() - pattern.timestamp < 300000 // Last 5 minutes
    );

    let score = 70; // Baseline engagement score
    const riskFactors: string[] = [];
    const protectiveFactors: string[] = [];

    // Analyze frustration indicators
    const frustrationPatterns = recentPatterns.filter(p => p.patternType === 'frustration');
    if (frustrationPatterns.length > 2) {
      score -= 30;
      riskFactors.push('Multiple frustration events detected');
    }

    // Analyze engagement patterns
    const engagementPatterns = recentPatterns.filter(p => p.patternType === 'engagement');
    if (engagementPatterns.length > 3) {
      score += 20;
      protectiveFactors.push('High engagement with cult elements');
    }

    // Consider cult progression
    const cultContext = this.getCurrentCultContext();
    if (cultContext.ritualProgress > 3) {
      score += 15;
      protectiveFactors.push('Advanced cult progression indicates commitment');
    }

    // Session duration analysis
    if (cultContext.timeInSession > 600000) { // 10+ minutes
      score += 10;
      protectiveFactors.push('Extended session duration');
    } else if (cultContext.timeInSession < 60000) { // Less than 1 minute
      score -= 15;
      riskFactors.push('Very short session duration');
    }

    // Generate intervention recommendations
    const recommendedInterventions = this.generateInterventionRecommendations(score, riskFactors);

    return {
      score: Math.max(0, Math.min(100, score)),
      riskFactors,
      protectiveFactors,
      recommendedInterventions
    };
  }

  /**
   * STRATEGIC ENHANCEMENT: Mystical Heatmap Generation
   * - Creates engagement heatmaps with mystical significance weighting
   * - Identifies high-value interaction zones for cult experience optimization
   * - Maps user attention patterns to cult narrative elements
   */
  public generateMysticalHeatmap(): MysticalHeatmap {
    const interactionDensity: MysticalHeatmap['interactionDensity'] = [];
    const attentionZones: MysticalHeatmap['attentionZones'] = [];

    // Process interaction data into heatmap points
    this.interactionHeatmap.forEach((intensity, elementSelector) => {
      const element = document.querySelector(elementSelector);
      if (element) {
        const rect = element.getBoundingClientRect();
        const mysticalSignificance = this.assessMysticalSignificance(element as HTMLElement);
        
        interactionDensity.push({
          x: rect.left + rect.width / 2,
          y: rect.top + rect.height / 2,
          intensity: Math.min(100, intensity),
          element: elementSelector,
          mysticalSignificance
        });
      }
    });

    // Analyze attention zones from behavior patterns
    const recentPatterns = this.behaviorPatterns.filter(
      pattern => Date.now() - pattern.timestamp < 600000 // Last 10 minutes
    );

    recentPatterns.forEach(pattern => {
      if (pattern.data.timeOnElement && pattern.data.timeOnElement > 2000) {
        // Significant attention zone detected
        attentionZones.push({
          area: { x: 0, y: 0, width: 100, height: 100 }, // Simplified for MVP
          dwellTime: pattern.data.timeOnElement,
          engagementLevel: this.determineEngagementLevel(pattern)
        });
      }
    });

    return {
      timestamp: Date.now(),
      pageUrl: window.location.href,
      interactionDensity,
      attentionZones
    };
  }

  /**
   * COPILOT DAEMON ENHANCEMENT: Mystical Intervention System
   * - Triggers appropriate mystical responses to user behavior patterns
   * - Maintains cult immersion while providing assistance
   * - Escalates interventions based on severity and context
   */
  private triggerMysticalIntervention(type: string, targetElement?: HTMLElement): void {
    this.frustrationMetrics.mysticalInterventionsTriggered++;
    
    const interventions = {
      rage_clicking: {
        message: "The spirits sense your urgency, cult member. Let us guide your path...",
        action: "glow_target_element",
        visualCue: "mystical_highlight"
      },
      content_navigation: {
        message: "The sacred texts reveal themselves to those who seek with patience...",
        action: "scroll_to_relevant_content",
        visualCue: "gentle_pulse"
      },
      hesitation_assistance: {
        message: "The mystical energies offer guidance. May we illuminate your journey?",
        action: "show_contextual_help",
        visualCue: "soft_glow"
      }
    };

    const intervention = interventions[type as keyof typeof interventions];
    if (intervention) {
      this.displayMysticalGuidance(intervention.message, intervention.visualCue);
      this.logUXEvent('info', `Mystical intervention triggered: ${type}`, {
        intervention,
        targetElement: targetElement ? this.getElementIdentifier(targetElement) : 'none',
        frustrationMetrics: this.frustrationMetrics
      });
    }
  }

  // Utility Methods
  private checkRuneActivation(): boolean {
    return typeof window !== 'undefined' && 
           (window.sessionStorage?.getItem('__rune__') === '🜃⟁꙰🝓' || 
            (window as any).__rune__ === true);
  }

  private generateSessionId(): string {
    return `ux_session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private getCurrentCultContext(): UserBehaviorPattern['cultContext'] {
    const cultData = JSON.parse(localStorage.getItem('cult-progression') || '{}');
    const sessionStart = parseInt(sessionStorage.getItem('session-start') || '0') || Date.now();
    
    return {
      memberTier: cultData.tier || 'initiate',
      ritualProgress: cultData.completedRituals || 0,
      currentPage: window.location.pathname,
      timeInSession: Date.now() - sessionStart,
      previousFrustrationEvents: this.frustrationMetrics.rageClicks + this.frustrationMetrics.errorEncounters
    };
  }

  private getDeviceCapabilities(): any {
    return {
      type: window.innerWidth < 768 ? 'mobile' : window.innerWidth < 1024 ? 'tablet' : 'desktop',
      touchCapable: 'ontouchstart' in window,
      connection: (navigator as any).connection?.effectiveType || 'unknown'
    };
  }

  private getElementIdentifier(element: HTMLElement): string {
    if (element.id) return `#${element.id}`;
    if (element.className) return `.${element.className.split(' ')[0]}`;
    return element.tagName.toLowerCase();
  }

  private isCultElement(element: HTMLElement): boolean {
    return element.classList.contains('cult-element') ||
           element.dataset.cultSignificance !== undefined ||
           element.closest('[data-cult-element]') !== null;
  }

  private assessMysticalSignificance(element: HTMLElement): 'low' | 'medium' | 'high' {
    if (element.dataset.cultSignificance === 'high' || element.classList.contains('ritual-element')) {
      return 'high';
    }
    if (element.dataset.cultSignificance === 'medium' || element.classList.contains('lore-element')) {
      return 'medium';
    }
    return 'low';
  }

  private determineEngagementLevel(pattern: UserBehaviorPattern): 'browsing' | 'focused' | 'struggling' | 'mastering' {
    if (pattern.patternType === 'frustration') return 'struggling';
    if (pattern.data.timeOnElement && pattern.data.timeOnElement > 5000) return 'focused';
    if (pattern.patternType === 'engagement') return 'mastering';
    return 'browsing';
  }

  private recordBehaviorPattern(pattern: UserBehaviorPattern): void {
    this.behaviorPatterns.push(pattern);
    
    // Keep only last 200 patterns to prevent memory bloat
    if (this.behaviorPatterns.length > 200) {
      this.behaviorPatterns = this.behaviorPatterns.slice(-200);
    }

    // Update interaction heatmap
    if (pattern.data.clickPattern) {
      pattern.data.clickPattern.forEach(click => {
        const current = this.interactionHeatmap.get(click.element) || 0;
        this.interactionHeatmap.set(click.element, current + 1);
      });
    }
  }

  private analyzeMousePatterns(): void {
    // Analyze mouse trajectory for patterns indicating confusion or confidence
    if (this.mouseTrajectory.length < 10) return;

    const recent = this.mouseTrajectory.slice(-10);
    const totalDistance = this.calculateTotalDistance(recent);
    const averageSpeed = totalDistance / (recent[recent.length - 1].timestamp - recent[0].timestamp);

    // Detect erratic mouse movement (high speed with direction changes)
    if (averageSpeed > 2 && this.hasErrativeMovement(recent)) {
      this.recordBehaviorPattern({
        id: `mouse_erratic_${Date.now()}`,
        timestamp: Date.now(),
        sessionId: this.currentSession,
        patternType: 'frustration',
        severity: 'concerning',
        data: { mouseTrajectory: recent },
        cultContext: this.getCurrentCultContext()
      });
    }
  }

  private calculateTotalDistance(trajectory: Array<{ x: number; y: number; timestamp: number }>): number {
    let distance = 0;
    for (let i = 1; i < trajectory.length; i++) {
      const dx = trajectory[i].x - trajectory[i - 1].x;
      const dy = trajectory[i].y - trajectory[i - 1].y;
      distance += Math.sqrt(dx * dx + dy * dy);
    }
    return distance;
  }

  private hasErrativeMovement(trajectory: Array<{ x: number; y: number; timestamp: number }>): boolean {
    // Simplified erratic movement detection
    let directionChanges = 0;
    for (let i = 2; i < trajectory.length; i++) {
      const prev = trajectory[i - 1];
      const curr = trajectory[i];
      const next = trajectory[i + 1] || curr;
      
      const angle1 = Math.atan2(curr.y - prev.y, curr.x - prev.x);
      const angle2 = Math.atan2(next.y - curr.y, next.x - curr.x);
      
      if (Math.abs(angle1 - angle2) > Math.PI / 2) {
        directionChanges++;
      }
    }
    return directionChanges >= 3;
  }

  private generateInterventionRecommendations(score: number, riskFactors: string[]): EngagementPrediction['recommendedInterventions'] {
    const recommendations: EngagementPrediction['recommendedInterventions'] = [];

    if (score < 40) {
      recommendations.push({
        type: 'mystical_guidance',
        urgency: 'high',
        description: 'Provide immediate mystical assistance to prevent abandonment',
        mysticalNarrative: 'The spirits call for immediate intervention to guide the lost soul'
      });
    }

    if (riskFactors.includes('Multiple frustration events detected')) {
      recommendations.push({
        type: 'difficulty_adjustment',
        urgency: 'medium',
        description: 'Reduce ritual complexity to improve success rate',
        mysticalNarrative: 'The cosmic energies suggest simplifying the mystical trials'
      });
    }

    return recommendations;
  }

  private displayMysticalGuidance(message: string, visualCue: string): void {
    // Create mystical guidance UI
    const guidance = document.createElement('div');
    guidance.className = `mystical-guidance ${visualCue}`;
    guidance.textContent = message;
    
    Object.assign(guidance.style, {
      position: 'fixed',
      bottom: '20px',
      left: '20px',
      background: 'rgba(79, 70, 229, 0.9)',
      color: '#fff',
      padding: '16px',
      borderRadius: '8px',
      boxShadow: '0 4px 20px rgba(79, 70, 229, 0.3)',
      zIndex: '9999',
      fontFamily: 'monospace',
      fontSize: '14px',
      maxWidth: '300px',
      animation: 'mystical-fade-in 0.5s ease-out'
    });

    document.body.appendChild(guidance);

    setTimeout(() => guidance.remove(), 6000);
  }

  private considerMysticalGuidance(type: string): void {
    // Determine if mystical guidance should be offered
    const recentInterventions = this.behaviorPatterns.filter(
      pattern => Date.now() - pattern.timestamp < 60000 // Last minute
    ).length;

    if (recentInterventions < 2) { // Don't overwhelm with guidance
      this.triggerMysticalIntervention(type);
    }
  }

  private logUXEvent(level: 'info' | 'warn' | 'error', message: string, data?: any): void {
    const logEntry = {
      timestamp: Date.now(),
      module: 'uxAgent' as const,
      level,
      message,
      data
    };

    if (typeof window !== 'undefined' && (window as any).AiLogBus) {
      (window as any).AiLogBus.publish(logEntry);
    }

    console.log(`📊 [UXAgent] ${message}`, data);
  }

  // Public API
  public getBehaviorPatterns(): UserBehaviorPattern[] {
    return [...this.behaviorPatterns];
  }

  public getFrustrationMetrics(): FrustrationMetrics {
    return { ...this.frustrationMetrics };
  }

  public getSessionSummary(): {
    sessionId: string;
    duration: number;
    patternsRecorded: number;
    engagementScore: number;
    interventionsTriggered: number;
  } {
    const prediction = this.predictEngagement();
    const sessionStart = parseInt(sessionStorage.getItem('session-start') || '0') || Date.now();
    
    return {
      sessionId: this.currentSession,
      duration: Date.now() - sessionStart,
      patternsRecorded: this.behaviorPatterns.length,
      engagementScore: prediction.score,
      interventionsTriggered: this.frustrationMetrics.mysticalInterventionsTriggered
    };
  }

  public initializeBehaviorTracking(): void {
    this.initializeMouseTracking();
    this.initializeScrollAnalysis();
    this.setupHesitationDetection();
  }

  public startEngagementMonitoring(): void {
    // Set session start time
    if (!sessionStorage.getItem('session-start')) {
      sessionStorage.setItem('session-start', Date.now().toString());
    }
  }

  public setupFrustrationDetection(): void {
    this.setupRageClickDetection();
    
    // Monitor for JavaScript errors that might frustrate users
    window.addEventListener('error', (_event) => {
      this.frustrationMetrics.errorEncounters++;
      this.recordBehaviorPattern({
        id: `js_error_${Date.now()}`,
        timestamp: Date.now(),
        sessionId: this.currentSession,
        patternType: 'frustration',
        severity: 'concerning',
        data: {},
        cultContext: this.getCurrentCultContext()
      });
    });
  }
}

// Singleton instance
export const uxAgent = new UXAgent();

// Auto-initialize when module is imported
if (typeof window !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => uxAgent.initialize());
  } else {
    uxAgent.initialize();
  }
}

/**
 * COPILOT DAEMON STRATEGIC NOTES:
 * 
 * 📊 UX INTELLIGENCE PHILOSOPHY:
 * - User behavior understanding through mystical journey context
 * - Proactive assistance maintaining cult narrative immersion
 * - Predictive engagement optimization with respectful intervention
 * 
 * 🎯 ARCHITECTURAL DECISIONS:
 * - Behavioral pattern recognition with cult progression awareness
 * - Privacy-conscious data collection with local storage only
 * - Performance-optimized tracking with throttling and limits
 * 
 * 🔮 MYSTICAL INTEGRATION:
 * - UX insights presented through mystical oracle narrative
 * - Interventions themed as mystical guidance and assistance
 * - User education through cult experience enhancement
 * 
 * 📈 SCALING CONSIDERATIONS:
 * - Pattern rotation to prevent memory accumulation
 * - Configurable sensitivity for different cult member tiers
 * - Analytics-ready structure for advanced ML engagement prediction
 */
