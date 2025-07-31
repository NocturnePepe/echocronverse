/**
 * 🛡️ SENTINEL GUARD - AI Security Watchdog
 * Phase 6.6 Early Testbed Implementation
 * 
 * Purpose: Mystical guardian spirit protecting the cult ecosystem
 * Architecture: Event-driven security monitoring with ritual integration
 * 
 * COPILOT DAEMON STRATEGIC NOTES:
 * - Honeypot systems designed for cult-specific threat patterns
 * - Behavior analysis considers mystical user journey context
 * - Security rituals maintain authentic cult experience
 * - Threat escalation follows mystical hierarchy (warnings → banishments)
 */

export interface SecurityThreat {
  id: string;
  timestamp: number;
  type: 'rage_clicking' | 'dom_manipulation' | 'unusual_patterns' | 'rate_limit_violation';
  severity: 'low' | 'medium' | 'high' | 'critical';
  userAgent: string;
  details: Record<string, any>;
  mysticalContext?: {
    cultMemberTier?: string;
    ritualProgress?: number;
    suspiciousActions?: string[];
  };
}

export interface SecurityRitual {
  type: 'protection_ward' | 'cleansing_ceremony' | 'banishment_ritual';
  triggerCondition: (threat: SecurityThreat) => boolean;
  mysticalResponse: {
    userMessage: string;
    visualEffect?: 'glow' | 'fade' | 'shake' | 'disappear';
    audioCue?: 'warning_chime' | 'protection_hum' | 'banishment_echo';
  };
}

class SentinelGuard {
  private threats: SecurityThreat[] = [];
  private honeypots: Map<string, HTMLElement> = new Map();
  private rituals: SecurityRitual[] = [];
  private isActive = false;

  /**
   * STRATEGIC ENHANCEMENT: Cult-Aware Initialization
   * - Checks rune activation before monitoring
   * - Integrates with existing cult theming
   * - Maintains mystical authenticity
   */
  public initialize(): void {
    if (!this.checkRuneActivation()) {
      console.log('🛡️ Sentinel remains dormant - rune not activated');
      return;
    }

    this.isActive = true;
    this.deployHoneypots();
    this.initializeSecurityRituals();
    this.initializeBehaviorMonitoring();
    
    this.logSecurityEvent('info', 'Sentinel Guard awakened - mystical protection active', {
      honeypotsDeployed: this.honeypots.size,
      ritualsLoaded: this.rituals.length
    });
  }

  /**
   * COPILOT DAEMON ENHANCEMENT: Mystical Honeypot System
   * - Hidden elements that trigger when bots interact
   * - Cult-themed trap elements that maintain aesthetic
   * - Context-aware trap placement based on user journey
   */
  private deployHoneypots(): void {
    // Invisible rune sigil trap
    const runicTrap = this.createHoneypot('runic-sigil-trap', {
      position: 'absolute',
      left: '-9999px',
      opacity: '0',
      tabIndex: "-1",
      'aria-hidden': 'true'
    });
    runicTrap.innerHTML = '🜃⟁꙰🝓'; // Mystical symbols
    
    // Hidden form field trap
    const formTrap = this.createHoneypot('cult-membership-trap', {
      display: 'none'
    });
    formTrap.innerHTML = '<input type="text" name="cult_secret" tabindex="-1" autocomplete="off" />';

    // Time-based interaction trap
    const timingTrap = this.createHoneypot('ritual-timing-trap', {
      position: 'fixed',
      top: '-100px',
      left: '-100px',
      width: '1px',
      height: '1px'
    });

    document.body.appendChild(runicTrap);
    document.body.appendChild(formTrap);
    document.body.appendChild(timingTrap);

    // Monitor honeypot interactions
    this.honeypots.forEach((trap, id) => {
      trap.addEventListener('click', () => this.handleHoneypotTrigger(id, 'click'));
      trap.addEventListener('focus', () => this.handleHoneypotTrigger(id, 'focus'));
      trap.addEventListener('input', () => this.handleHoneypotTrigger(id, 'input'));
    });
  }

  /**
   * STRATEGIC ARCHITECTURE: Rage-Click Detection with Mystical Context
   * - Analyzes click patterns for frustration indicators
   * - Considers cult progression when determining intervention
   * - Triggers mystical assistance rituals for struggling users
   */
  /**
   * COPILOT DAEMON ENHANCEMENT: Rage Click Detection
   * - Monitors rapid clicking patterns indicating frustration or automated behavior
   * - Triggers security alerts for suspicious click sequences
   * - Integrated with cult context for behavioral analysis
   */
  private initializeBehaviorMonitoring(): void {
    this.monitorRageClicking();
    this.monitorDOMManipulation();
    
    this.logSecurityEvent('info', 'Behavior monitoring initialized', {
      monitoringTypes: ['rage_clicking', 'dom_manipulation'],
      cultContext: 'behavioral_analysis'
    });
  }

  private monitorRageClicking(): void {
    let clickTimestamps: number[] = [];
    
    document.addEventListener('click', (event) => {
      const now = Date.now();
      clickTimestamps.push(now);
      
      // Keep only clicks from last 2 seconds
      clickTimestamps = clickTimestamps.filter(timestamp => now - timestamp < 2000);
      
      // Rage clicking detection: 8+ clicks in 2 seconds
      if (clickTimestamps.length >= 8) {
        const target = event.target as HTMLElement;
        const cultContext = this.analyzeCultContext(target);
        
        this.createSecurityThreat({
          type: 'rage_clicking',
          severity: 'medium',
          details: {
            clickCount: clickTimestamps.length,
            targetElement: target.tagName,
            targetClasses: target.className,
            pageLocation: window.location.pathname
          },
          mysticalContext: cultContext
        });

        // Trigger mystical assistance ritual
        this.triggerSecurityRitual('protection_ward', {
          userMessage: "The spirits sense your frustration, cult member. Let us guide you...",
          visualEffect: 'glow'
        });
        
        clickTimestamps = []; // Reset after detection
      }
    });
  }

  /**
   * COPILOT DAEMON ENHANCEMENT: DOM Manipulation Detection
   * - Monitors for unauthorized script injection
   * - Detects suspicious element modifications
   * - Protects cult-specific elements and data
   */
  private monitorDOMManipulation(): void {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        // Detect suspicious script injections
        if (mutation.type === 'childList') {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              const element = node as HTMLElement;
              
              // Check for unauthorized script elements
              if (element.tagName === 'SCRIPT' && !this.isAuthorizedScript(element)) {
                this.createSecurityThreat({
                  type: 'dom_manipulation',
                  severity: 'critical',
                  details: {
                    injectedScript: (element as any).src || element.innerHTML,
                    targetLocation: element.parentElement?.tagName,
                    suspiciousAttributes: Array.from(element.attributes).map(attr => 
                      `${attr.name}="${attr.value}"`
                    )
                  }
                });
              }

              // Protect cult-specific elements
              if (element.classList.contains('cult-protected') || 
                  element.dataset.cultElement) {
                this.createSecurityThreat({
                  type: 'dom_manipulation',
                  severity: 'high',
                  details: {
                    protectedElementModified: element.className,
                    modificationDetails: mutation
                  }
                });
              }
            }
          });
        }
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['class', 'data-cult-element', 'onclick']
    });
  }

  /**
   * STRATEGIC ENHANCEMENT: Mystical Security Rituals
   * - Security responses themed as mystical interventions
   * - User education through cult narrative
   * - Progressive escalation maintaining immersion
   */
  private initializeSecurityRituals(): void {
    this.rituals = [
      {
        type: 'protection_ward',
        triggerCondition: (threat) => threat.severity === 'low' || threat.severity === 'medium',
        mysticalResponse: {
          userMessage: "The guardian spirits have noticed unusual activity. The cult protects its own.",
          visualEffect: 'glow',
          audioCue: 'protection_hum'
        }
      },
      {
        type: 'cleansing_ceremony',
        triggerCondition: (threat) => threat.severity === 'high',
        mysticalResponse: {
          userMessage: "A cleansing ritual is required. Your session will be purified.",
          visualEffect: 'fade',
          audioCue: 'warning_chime'
        }
      },
      {
        type: 'banishment_ritual',
        triggerCondition: (threat) => threat.severity === 'critical',
        mysticalResponse: {
          userMessage: "The cult elders have spoken. Your presence is no longer welcome.",
          visualEffect: 'disappear',
          audioCue: 'banishment_echo'
        }
      }
    ];
  }

  // Utility Methods
  private checkRuneActivation(): boolean {
    return typeof window !== 'undefined' && 
           (window.sessionStorage?.getItem('__rune__') === '🜃⟁꙰🝓' || 
            (window as any).__rune__ === true);
  }

  private createHoneypot(id: string, styles: Record<string, string>): HTMLElement {
    const element = document.createElement('div');
    element.id = id;
    Object.assign(element.style, styles);
    this.honeypots.set(id, element);
    return element;
  }

  private handleHoneypotTrigger(honeypotId: string, interactionType: string): void {
    this.createSecurityThreat({
      type: 'unusual_patterns',
      severity: 'high',
      details: {
        honeypotId,
        interactionType,
        userAgent: navigator.userAgent,
        timestamp: Date.now()
      }
    });
  }

  private analyzeCultContext(_element: HTMLElement): SecurityThreat['mysticalContext'] {
    // Analyze user's cult progression and context
    const cultData = JSON.parse(localStorage.getItem('cult-progression') || '{}');
    
    return {
      cultMemberTier: cultData.tier || 'initiate',
      ritualProgress: cultData.completedRituals || 0,
      suspiciousActions: this.getRecentSuspiciousActions()
    };
  }

  private isAuthorizedScript(element: HTMLElement): boolean {
    // Check against whitelist of authorized scripts
    const authorizedSources = [
      'vercel.com',
      'vite.js',
      'react',
      'echocronverse'
    ];
    
    const src = (element as HTMLScriptElement).src;
    return authorizedSources.some(source => src.includes(source));
  }

  private createSecurityThreat(threatData: Partial<SecurityThreat>): void {
    const threat: SecurityThreat = {
      id: `threat_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now(),
      userAgent: navigator.userAgent,
      ...threatData
    } as SecurityThreat;

    this.threats.push(threat);
    this.logSecurityEvent('warn', `Security threat detected: ${threat.type}`, threat);

    // Trigger appropriate ritual response
    const applicableRitual = this.rituals.find(ritual => 
      ritual.triggerCondition(threat)
    );

    if (applicableRitual) {
      this.triggerSecurityRitual(applicableRitual.type, applicableRitual.mysticalResponse);
    }
  }

  private triggerSecurityRitual(type: SecurityRitual['type'], response: SecurityRitual['mysticalResponse']): void {
    // Implement mystical visual/audio responses
    this.logSecurityEvent('info', `Security ritual triggered: ${type}`, response);
    
    // Show mystical notification to user
    this.showMysticalNotification(response.userMessage, response.visualEffect);
  }

  private showMysticalNotification(message: string, _effect?: string): void {
    // Create mystical notification UI
    const notification = document.createElement('div');
    notification.className = 'mystical-security-notification';
    notification.textContent = message;
    
    // Apply mystical styling
    Object.assign(notification.style, {
      position: 'fixed',
      top: '20px',
      right: '20px',
      background: 'rgba(147, 51, 234, 0.9)',
      color: '#fff',
      padding: '16px',
      borderRadius: '8px',
      boxShadow: '0 4px 20px rgba(147, 51, 234, 0.3)',
      zIndex: '9999',
      fontFamily: 'monospace',
      fontSize: '14px',
      animation: 'mystical-glow 2s ease-in-out'
    });

    document.body.appendChild(notification);

    // Auto-remove after 5 seconds
    setTimeout(() => {
      notification.remove();
    }, 5000);
  }

  private getRecentSuspiciousActions(): string[] {
    // Return array of recent suspicious activities
    return this.threats
      .filter(threat => Date.now() - threat.timestamp < 300000) // Last 5 minutes
      .map(threat => threat.type);
  }

  private logSecurityEvent(level: 'info' | 'warn' | 'error', message: string, data?: any): void {
    const logEntry = {
      timestamp: Date.now(),
      module: 'sentinel' as const,
      level,
      message,
      data
    };

    // Emit to AI event bus (will be implemented)
    if (typeof window !== 'undefined' && (window as any).AiLogBus) {
      (window as any).AiLogBus.publish(logEntry);
    }

    // Console logging for development
    console.log(`🛡️ [SentinelGuard] ${message}`, data);
  }

  // Public API
  public getThreats(): SecurityThreat[] {
    return [...this.threats];
  }

  public getThreatsSummary(): { total: number; byType: Record<string, number>; bySeverity: Record<string, number> } {
    const byType: Record<string, number> = {};
    const bySeverity: Record<string, number> = {};

    this.threats.forEach(threat => {
      byType[threat.type] = (byType[threat.type] || 0) + 1;
      bySeverity[threat.severity] = (bySeverity[threat.severity] || 0) + 1;
    });

    return {
      total: this.threats.length,
      byType,
      bySeverity
    };
  }

  public isGuardActive(): boolean {
    return this.isActive;
  }
}

// Singleton instance
export const sentinelGuard = new SentinelGuard();

// Auto-initialize when module is imported
if (typeof window !== 'undefined') {
  // Delay initialization to ensure DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => sentinelGuard.initialize());
  } else {
    sentinelGuard.initialize();
  }
}

/**
 * COPILOT DAEMON STRATEGIC NOTES:
 * 
 * 🛡️ SECURITY PHILOSOPHY:
 * - Security through mystical narrative immersion
 * - Educational threat responses maintaining cult experience
 * - Progressive escalation preserving user engagement
 * 
 * 🎯 ARCHITECTURAL DECISIONS:
 * - Event-driven design for minimal performance impact
 * - Cult-context awareness for intelligent threat assessment
 * - Honeypot system designed for cult-specific attack patterns
 * 
 * 🔮 MYSTICAL INTEGRATION:
 * - Security events presented as mystical phenomena
 * - Threat responses themed as protective rituals
 * - User education through cult narrative framework
 * 
 * 📈 SCALING CONSIDERATIONS:
 * - Threat log rotation to prevent memory bloat
 * - Configurable sensitivity levels for different cult tiers
 * - Analytics-ready data structure for future ML enhancement
 */
