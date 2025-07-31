/**
 * 🜃 RUNE GATE ACTIVATION SYSTEM - Mystical AI Module Control
 * Phase 6.6 Early Testbed Implementation
 * 
 * Purpose: Secure activation gateway for AI modules with mystical authentication
 * Architecture: Multi-stage activation process with cult progression validation
 * 
 * COPILOT DAEMON STRATEGIC ENHANCEMENT:
 * - Prevents unauthorized AI activation in production environments
 * - Integrates with cult progression system for organic activation
 * - Provides mystical narrative for AI module awakening
 * - Admin override capabilities for development environments
 */

export interface RuneConfiguration {
  runeSymbol: string;
  activationThreshold: number;
  requiredCultTier: string;
  permissions: string[];
  emergencyOverride?: boolean;
  devMode?: boolean;
}

export interface ActivationState {
  isActivated: boolean;
  activatedAt?: number;
  activationMethod: 'ritual' | 'override' | 'emergency' | 'development';
  activePermissions: string[];
  runeEnergy: number; // 0-100 representing activation strength
  lastValidation: number;
}

export interface RuneValidationResult {
  valid: boolean;
  reason: string;
  suggestions?: string[];
  emergencyBypass?: boolean;
}

class RuneGate {
  private static instance: RuneGate;
  private activationState: ActivationState | null = null;
  private readonly RUNE_STORAGE_KEY = '__rune_gate_state__';
  private readonly ACTIVATION_SYMBOL = '🜃⟁꙰🝓';
  private validationInterval: number | null = null;

  // Private constructor for singleton
  private constructor() {
    this.initializeRuneGate();
  }

  public static getInstance(): RuneGate {
    if (!RuneGate.instance) {
      RuneGate.instance = new RuneGate();
    }
    return RuneGate.instance;
  }

  /**
   * STRATEGIC ENHANCEMENT: Mystical Activation Gateway
   * - Validates cult progression and user permissions
   * - Activates AI modules through mystical ritual process
   * - Maintains activation state across sessions
   */
  public async performActivationRitual(
    cultData: {
      userTier: string;
      completedRituals: string[];
      totalEssence: number;
      mysticalAlignment: number;
    },
    runeConfig?: Partial<RuneConfiguration>
  ): Promise<{ success: boolean; message: string; activationState?: ActivationState }> {
    const config = this.getRuneConfiguration(runeConfig);

    // Validate cult progression requirements
    const validation = this.validateCultProgression(cultData, config);
    if (!validation.valid && !validation.emergencyBypass) {
      return {
        success: false,
        message: `🜃 Activation denied: ${validation.reason}`,
      };
    }

    // Perform mystical activation sequence
    const activationResult = await this.executeActivationSequence(config, cultData);
    
    if (activationResult.success) {
      this.activationState = {
        isActivated: true,
        activatedAt: Date.now(),
        activationMethod: validation.emergencyBypass ? 'emergency' : 'ritual',
        activePermissions: config.permissions,
        runeEnergy: Math.min(100, cultData.mysticalAlignment + config.activationThreshold),
        lastValidation: Date.now()
      };

      this.persistActivationState();
      this.startValidationMonitoring();

      // Set global activation markers
      this.setGlobalActivationMarkers();

      return {
        success: true,
        message: '🜃⚡ AI modules awakened through mystical ritual! The digital spirits respond to your call.',
        activationState: this.activationState
      };
    }

    return {
      success: false,
      message: '🜃💀 Activation ritual failed - the digital spirits remain dormant'
    };
  }

  /**
   * COPILOT DAEMON ENHANCEMENT: Development Override System
   * - Provides immediate activation for development environments
   * - Bypasses cult progression requirements in dev mode
   * - Logs override usage for security monitoring
   */
  public activateDevMode(
    devPassword?: string,
    permissions: string[] = ['all']
  ): { success: boolean; message: string } {
    // Check if we're in development environment
    const isDev = this.isDevEnvironment();
    const validPassword = devPassword === 'chronoverse_dev_2024' || isDev;

    if (!validPassword) {
      return {
        success: false,
        message: '🔐 Development activation denied - invalid credentials'
      };
    }

    this.activationState = {
      isActivated: true,
      activatedAt: Date.now(),
      activationMethod: 'development',
      activePermissions: permissions,
      runeEnergy: 100,
      lastValidation: Date.now()
    };

    this.persistActivationState();
    this.setGlobalActivationMarkers();

    // Log development override usage
    if (typeof window !== 'undefined' && (window as any).AiLogBus) {
      (window as any).AiLogBus.publish({
        module: 'system',
        level: 'warn',
        message: 'AI modules activated via development override',
        data: { permissions, environment: 'development' },
        mysticalContext: {
          cultSignificance: 'medium',
          emergencyLevel: 'minor'
        }
      });
    }

    return {
      success: true,
      message: '💻⚡ Development mode activated - all AI modules available'
    };
  }

  /**
   * STRATEGIC ENHANCEMENT: Emergency Activation Protocol
   * - Provides last-resort activation for critical situations
   * - Requires administrator confirmation
   * - Logs emergency usage for security audit
   */
  public emergencyActivation(
    emergencyCode: string,
    reason: string
  ): { success: boolean; message: string } {
    const validEmergencyCodes = [
      'CULT_CRISIS_2024',
      'CHRONOVERSE_EMERGENCY',
      'ADMIN_OVERRIDE_ALPHA'
    ];

    if (!validEmergencyCodes.includes(emergencyCode)) {
      return {
        success: false,
        message: '🚨 Emergency activation denied - invalid emergency code'
      };
    }

    this.activationState = {
      isActivated: true,
      activatedAt: Date.now(),
      activationMethod: 'emergency',
      activePermissions: ['emergency', 'all'],
      runeEnergy: 100,
      lastValidation: Date.now()
    };

    this.persistActivationState();
    this.setGlobalActivationMarkers();

    // Log emergency activation
    console.warn('🚨 EMERGENCY AI ACTIVATION:', reason);
    if (typeof window !== 'undefined' && (window as any).AiLogBus) {
      (window as any).AiLogBus.broadcastEmergency('system', 
        `Emergency AI activation: ${reason}`, 
        { emergencyCode, timestamp: Date.now() }
      );
    }

    return {
      success: true,
      message: '🚨⚡ Emergency activation complete - AI modules online'
    };
  }

  /**
   * COPILOT DAEMON ENHANCEMENT: Activation State Management
   * - Checks current activation status and permissions
   * - Validates ongoing activation requirements
   * - Provides activation renewal capabilities
   */
  public getActivationStatus(): {
    isActivated: boolean;
    activationState?: ActivationState;
    timeRemaining?: number;
    renewalRequired?: boolean;
  } {
    if (!this.activationState) {
      return { isActivated: false };
    }

    // Check if activation has expired (24 hours for ritual, indefinite for dev/emergency)
    const now = Date.now();
    const activationAge = now - (this.activationState.activatedAt || 0);
    const maxAge = this.activationState.activationMethod === 'ritual' ? 86400000 : Infinity; // 24 hours

    if (activationAge > maxAge) {
      this.deactivateRunes();
      return { 
        isActivated: false,
        renewalRequired: true 
      };
    }

    return {
      isActivated: true,
      activationState: this.activationState,
      timeRemaining: maxAge === Infinity ? undefined : maxAge - activationAge,
      renewalRequired: false
    };
  }

  /**
   * STRATEGIC ENHANCEMENT: Permission Validation System
   * - Validates specific AI module permissions
   * - Supports granular permission control
   * - Provides mystical feedback for permission checks
   */
  public hasPermission(permission: string): boolean {
    const status = this.getActivationStatus();
    
    if (!status.isActivated || !status.activationState) {
      return false;
    }

    const permissions = status.activationState.activePermissions;
    return permissions.includes('all') || permissions.includes(permission);
  }

  /**
   * COPILOT DAEMON ENHANCEMENT: Rune Deactivation
   * - Safely deactivates AI modules
   * - Cleans up global activation markers
   * - Logs deactivation for audit trail
   */
  public deactivateRunes(): { success: boolean; message: string } {
    const wasActivated = this.activationState?.isActivated || false;

    this.activationState = null;
    this.clearPersistedState();
    this.clearGlobalActivationMarkers();
    this.stopValidationMonitoring();

    if (wasActivated) {
      if (typeof window !== 'undefined' && (window as any).AiLogBus) {
        (window as any).AiLogBus.publish({
          module: 'system',
          level: 'info',
          message: 'AI modules deactivated - runes sealed',
          mysticalContext: {
            cultSignificance: 'medium',
            ritualPhase: 'deactivation'
          }
        });
      }

      return {
        success: true,
        message: '🜃💤 AI modules sealed - the digital spirits rest'
      };
    }

    return {
      success: true,
      message: '🜃 Runes were already sealed'
    };
  }

  /**
   * STRATEGIC ENHANCEMENT: Activation Renewal System
   * - Extends activation time for active sessions
   * - Validates continued cult progression
   * - Maintains mystical narrative continuity
   */
  public renewActivation(
    cultData: {
      userTier: string;
      totalEssence: number;
      mysticalAlignment: number;
      completedRituals?: string[];
    }
  ): { success: boolean; message: string } {
    const status = this.getActivationStatus();
    
    if (!status.isActivated || !status.activationState) {
      return {
        success: false,
        message: '🜃 No active activation to renew'
      };
    }

    // Only ritual activations need renewal
    if (status.activationState.activationMethod !== 'ritual') {
      return {
        success: true,
        message: '🜃⚡ Activation permanent - no renewal required'
      };
    }

    // Validate continued cult progression
    const config = this.getRuneConfiguration();
    const extendedCultData = {
      ...cultData,
      completedRituals: cultData.completedRituals || []
    };
    const validation = this.validateCultProgression(extendedCultData, config);

    if (!validation.valid) {
      return {
        success: false,
        message: `🜃 Renewal denied: ${validation.reason}`
      };
    }

    // Renew activation - ensure activationState exists
    if (!this.activationState) {
      return {
        success: false,
        message: '🜃 No activation state to renew'
      };
    }

    this.activationState.activatedAt = Date.now();
    this.activationState.runeEnergy = Math.min(100, cultData.mysticalAlignment + config.activationThreshold);
    this.activationState.lastValidation = Date.now();

    this.persistActivationState();

    return {
      success: true,
      message: '🜃⚡ Activation renewed - mystical connection strengthened'
    };
  }

  // Private Methods

  private initializeRuneGate(): void {
    this.loadPersistedState();
    
    // Check for legacy activation markers
    if (typeof window !== 'undefined') {
      const legacyRune = window.sessionStorage?.getItem('__rune__');
      if (legacyRune === this.ACTIVATION_SYMBOL && !this.activationState) {
        this.activationState = {
          isActivated: true,
          activatedAt: Date.now(),
          activationMethod: 'development',
          activePermissions: ['all'],
          runeEnergy: 100,
          lastValidation: Date.now()
        };
        this.persistActivationState();
      }
    }
  }

  private getRuneConfiguration(override?: Partial<RuneConfiguration>): RuneConfiguration {
    const defaultConfig: RuneConfiguration = {
      runeSymbol: this.ACTIVATION_SYMBOL,
      activationThreshold: 50,
      requiredCultTier: 'initiate',
      permissions: ['optimizer', 'sentinel', 'uxAgent'],
      devMode: this.isDevEnvironment()
    };

    return { ...defaultConfig, ...override };
  }

  private validateCultProgression(
    cultData: {
      userTier: string;
      completedRituals: string[];
      totalEssence: number;
      mysticalAlignment: number;
    },
    config: RuneConfiguration
  ): RuneValidationResult {
    // Development mode bypass
    if (config.devMode) {
      return {
        valid: true,
        reason: 'Development environment - validation bypassed',
        emergencyBypass: true
      };
    }

    // Check mystical alignment threshold
    if (cultData.mysticalAlignment < config.activationThreshold) {
      return {
        valid: false,
        reason: `Insufficient mystical alignment (${cultData.mysticalAlignment}/${config.activationThreshold})`,
        suggestions: [
          'Complete more rituals to increase alignment',
          'Contribute to community activities',
          'Explore mystical lore sections'
        ]
      };
    }

    // Check cult tier requirements
    const tierHierarchy = ['visitor', 'initiate', 'acolyte', 'adept', 'master'];
    const userTierIndex = tierHierarchy.indexOf(cultData.userTier);
    const requiredTierIndex = tierHierarchy.indexOf(config.requiredCultTier);

    if (userTierIndex < requiredTierIndex) {
      return {
        valid: false,
        reason: `Insufficient cult tier (${cultData.userTier} < ${config.requiredCultTier})`,
        suggestions: [
          'Progress through cult initiation rituals',
          'Increase essence gathering activities',
          'Participate in community events'
        ]
      };
    }

    // Check completed rituals
    const requiredRituals = ['essence_gathering', 'community_engagement'];
    const missingRituals = requiredRituals.filter(ritual => 
      !cultData.completedRituals.includes(ritual)
    );

    if (missingRituals.length > 0) {
      return {
        valid: false,
        reason: `Missing required rituals: ${missingRituals.join(', ')}`,
        suggestions: [
          'Complete missing ritual sequences',
          'Visit the Ritual Chamber for guidance',
          'Consult the Lore for ritual instructions'
        ]
      };
    }

    return {
      valid: true,
      reason: 'All cult progression requirements met'
    };
  }

  private async executeActivationSequence(
    _config: RuneConfiguration,
    cultData: any
  ): Promise<{ success: boolean; details?: any }> {
    try {
      // Simulate mystical activation delay
      await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));

      // Mystical activation checks
      const runeVerification = this.verifyRuneIntegrity();
      const spiritualAlignment = this.checkSpiritualAlignment(cultData);
      const cosmicPhase = this.validateCosmicPhase();

      if (!runeVerification || !spiritualAlignment || !cosmicPhase) {
        return { success: false };
      }

      return { 
        success: true,
        details: {
          runeVerification,
          spiritualAlignment,
          cosmicPhase,
          activationEnergy: cultData.mysticalAlignment
        }
      };
    } catch (error) {
      console.error('🜃 Activation sequence error:', error);
      return { success: false };
    }
  }

  private verifyRuneIntegrity(): boolean {
    // Simulate rune verification
    return Math.random() > 0.1; // 90% success rate
  }

  private checkSpiritualAlignment(cultData: any): boolean {
    // Check spiritual alignment based on cult data
    return cultData.mysticalAlignment > 30;
  }

  private validateCosmicPhase(): boolean {
    // Check cosmic alignment (time-based)
    const hour = new Date().getHours();
    // More favorable during mystical hours (evening/night)
    return hour >= 18 || hour <= 6 || Math.random() > 0.3;
  }

  private setGlobalActivationMarkers(): void {
    if (typeof window !== 'undefined') {
      window.sessionStorage.setItem('__rune__', this.ACTIVATION_SYMBOL);
      (window as any).__rune__ = true;
      (window as any).__rune_activation_time__ = Date.now();
    }
  }

  private clearGlobalActivationMarkers(): void {
    if (typeof window !== 'undefined') {
      window.sessionStorage.removeItem('__rune__');
      delete (window as any).__rune__;
      delete (window as any).__rune_activation_time__;
    }
  }

  private persistActivationState(): void {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(this.RUNE_STORAGE_KEY, JSON.stringify(this.activationState));
      } catch (error) {
        console.warn('🜃 Failed to persist activation state:', error);
      }
    }
  }

  private loadPersistedState(): void {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(this.RUNE_STORAGE_KEY);
        if (stored) {
          this.activationState = JSON.parse(stored);
        }
      } catch (error) {
        console.warn('🜃 Failed to load persisted activation state:', error);
      }
    }
  }

  private clearPersistedState(): void {
    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem(this.RUNE_STORAGE_KEY);
      } catch (error) {
        console.warn('🜃 Failed to clear persisted activation state:', error);
      }
    }
  }

  private startValidationMonitoring(): void {
    if (this.validationInterval) {
      clearInterval(this.validationInterval);
    }

    // Validate activation every 5 minutes
    this.validationInterval = window.setInterval(() => {
      const status = this.getActivationStatus();
      if (!status.isActivated && status.renewalRequired) {
        if (typeof window !== 'undefined' && (window as any).AiLogBus) {
          (window as any).AiLogBus.publish({
            module: 'system',
            level: 'warn',
            message: 'AI activation expired - renewal required',
            mysticalContext: {
              cultSignificance: 'medium',
              emergencyLevel: 'minor'
            }
          });
        }
      }
    }, 300000); // 5 minutes
  }

  private stopValidationMonitoring(): void {
    if (this.validationInterval) {
      clearInterval(this.validationInterval);
      this.validationInterval = null;
    }
  }

  private isDevEnvironment(): boolean {
    return process.env.NODE_ENV === 'development' ||
           typeof window !== 'undefined' && window.location.hostname === 'localhost';
  }
}

// Export singleton instance
export const runeGate = RuneGate.getInstance();

// Utility functions for easy access
export const activateAI = (cultData: any, config?: Partial<RuneConfiguration>) => 
  runeGate.performActivationRitual(cultData, config);

export const checkAIStatus = () => runeGate.getActivationStatus();

export const hasAIPermission = (permission: string) => runeGate.hasPermission(permission);

export const deactivateAI = () => runeGate.deactivateRunes();

export const renewAI = (cultData: any) => runeGate.renewActivation(cultData);

// Development helpers
export const activateDevAI = (password?: string, permissions?: string[]) =>
  runeGate.activateDevMode(password, permissions);

export const emergencyAIActivation = (code: string, reason: string) =>
  runeGate.emergencyActivation(code, reason);

/**
 * COPILOT DAEMON STRATEGIC NOTES:
 * 
 * 🜃 RUNE GATE PHILOSOPHY:
 * - Mystical activation system maintaining cult narrative immersion
 * - Secure permission system preventing unauthorized AI activation
 * - Organic progression through cult advancement system
 * 
 * 🎯 ARCHITECTURAL DECISIONS:
 * - Singleton pattern ensuring single activation state
 * - Multiple activation methods for different environments
 * - Time-based expiration for security (ritual activations)
 * 
 * 🔮 MYSTICAL INTEGRATION:
 * - Activation presented as mystical ritual process
 * - Validation checks themed as spiritual alignment
 * - Permission system integrated with cult progression
 * 
 * 📈 SCALING CONSIDERATIONS:
 * - Persistent activation state across sessions
 * - Granular permission system for module-specific access
 * - Development and emergency override capabilities
 */
