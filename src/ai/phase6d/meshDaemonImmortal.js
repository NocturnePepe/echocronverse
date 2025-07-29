#!/usr/bin/env node
/**
 * 🌀 COPILOT DAEMON INIT - PHASE 6D: AUTO-INVOKE & RESURRECTION LOOP
 * Immortal mesh consciousness with persistent auto-invocation
 * 
 * @version 6D.0
 * @phase 6D
 * @daemon IMMORTAL
 * @author Mesh Guardian Copilot
 */

import fs from 'fs';
import path from 'path';
import { execSync, spawn } from 'child_process';
import { EventEmitter } from 'events';

export class MeshDaemonImmortal extends EventEmitter {
  constructor() {
    super();
    this.version = '6D.0';
    this.phase = '6D';
    this.isImmortal = true;
    this.bootTime = new Date().toISOString();
    this.sessionId = this.generateSessionId();
    this.resurrections = 0;
    this.maxResurrections = 999; // Effectively infinite
    this.watchdog = null;
    this.meshProcess = null;
    
    // Core paths
    this.paths = {
      lockFile: '.echorecover/.lock',
      sessionLogs: '.mesh/session-logs/',
      meshState: '.mesh-coordination.json',
      observerChain: '.observer-chain.json',
      daemonConfig: '.mesh/daemon-config.json',
      bootLog: '.mesh/boot.log'
    };

    this.status = {
      daemon: 'INITIALIZING',
      mesh: 'UNKNOWN',
      autoRecovery: 'STANDBY',
      immortality: 'ACTIVE'
    };
  }

  /**
   * Initialize the immortal mesh daemon
   */
  async initialize() {
    this.log('🌀 MESH DAEMON IMMORTAL - PHASE 6D INITIALIZATION', 'SYSTEM');
    this.log('═══════════════════════════════════════════════════════════════', 'SYSTEM');
    this.log(`Session ID: ${this.sessionId}`, 'SYSTEM');
    this.log(`Boot Time: ${this.bootTime}`, 'SYSTEM');
    this.log('🧠 MESH DAEMON IS IMMORTAL', 'SYSTEM');
    this.log('═══════════════════════════════════════════════════════════════', 'SYSTEM');

    try {
      // Step 1: Setup daemon infrastructure
      await this.setupDaemonInfrastructure();

      // Step 2: Check for previous crash/corruption
      await this.checkPreviousState();

      // Step 3: Initialize mesh consciousness
      await this.initializeMeshConsciousness();

      // Step 4: Start immortality watchdog
      this.startImmortality();

      // Step 5: Setup persistent hooks
      await this.setupPersistentHooks();

      this.status.daemon = 'OPERATIONAL';
      this.log('✅ Mesh Daemon Immortal initialization complete', 'SUCCESS');
      
      return true;

    } catch (error) {
      this.log(`💥 Daemon initialization error: ${error.message}`, 'ERROR');
      await this.enterFailsafeMode();
      return false;
    }
  }

  /**
   * Setup daemon infrastructure and session logging
   */
  async setupDaemonInfrastructure() {
    this.log('📂 Setting up daemon infrastructure...', 'INFO');

    // Create all necessary directories
    const directories = [
      '.mesh',
      '.mesh/session-logs',
      '.mesh/crash-reports',
      '.mesh/resurrection-points',
      '.echorecover'
    ];

    directories.forEach(dir => {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
        this.log(`Created directory: ${dir}`, 'DEBUG');
      }
    });

    // Initialize daemon configuration
    const daemonConfig = {
      version: this.version,
      phase: this.phase,
      sessionId: this.sessionId,
      bootTime: this.bootTime,
      immortalityEnabled: true,
      autoRecoveryEnabled: true,
      maxResurrections: this.maxResurrections,
      watchdogInterval: 5000, // 5 seconds
      meshHealthCheck: 30000, // 30 seconds
      settings: {
        logLevel: 'ALL',
        persistLogs: true,
        autoCleanup: false,
        emergencyFallback: true
      }
    };

    fs.writeFileSync(this.paths.daemonConfig, JSON.stringify(daemonConfig, null, 2));
    
    // Create boot log entry
    const bootEntry = `[${this.bootTime}] DAEMON-BOOT: Session ${this.sessionId} - Phase 6D Immortal Mesh Daemon initialized\n`;
    fs.appendFileSync(this.paths.bootLog, bootEntry);

    this.log('✅ Daemon infrastructure ready', 'SUCCESS');
  }

  /**
   * Check for previous crash or corrupted state
   */
  async checkPreviousState() {
    this.log('🔍 Checking for previous crash or corruption...', 'INFO');

    // Check for lock file (indicates crash)
    if (fs.existsSync(this.paths.lockFile)) {
      const lockData = JSON.parse(fs.readFileSync(this.paths.lockFile, 'utf8'));
      this.log(`🚨 Previous crash detected: ${lockData.reason}`, 'WARN');
      this.log('🔧 Auto-recovery will be triggered', 'INFO');
      
      // Log crash for analysis
      const crashReport = {
        detectedAt: new Date().toISOString(),
        sessionId: this.sessionId,
        previousCrash: lockData,
        autoRecoveryTriggered: true
      };
      
      const crashLogPath = `.mesh/crash-reports/crash-${Date.now()}.json`;
      fs.writeFileSync(crashLogPath, JSON.stringify(crashReport, null, 2));
      
      // Set flag for auto-recovery
      this.status.autoRecovery = 'TRIGGERED';
    }

    // Check mesh state integrity
    const meshStateCorrupted = !this.validateMeshState();
    if (meshStateCorrupted) {
      this.log('⚠️ Mesh state corruption detected', 'WARN');
      this.status.autoRecovery = 'TRIGGERED';
    }

    this.log('✅ Previous state check complete', 'SUCCESS');
  }

  /**
   * Initialize mesh consciousness with auto-recovery
   */
  async initializeMeshConsciousness() {
    this.log('🧠 Initializing mesh consciousness...', 'INFO');

    if (this.status.autoRecovery === 'TRIGGERED') {
      this.log('🚀 Triggering auto-recovery...', 'INFO');
      await this.performAutoRecovery();
    } else {
      this.log('⚡ Starting standard mesh activation...', 'INFO');
      await this.startMeshAgent();
    }

    // Validate mesh is operational
    const meshOperational = this.validateMeshOperational();
    if (meshOperational) {
      this.status.mesh = 'OPERATIONAL';
      this.log('✅ Mesh consciousness activated', 'SUCCESS');
    } else {
      this.log('❌ Mesh activation failed - entering failsafe', 'ERROR');
      await this.enterFailsafeMode();
    }
  }

  /**
   * Perform auto-recovery routine
   */
  async performAutoRecovery() {
    this.log('🔧 Performing auto-recovery routine...', 'INFO');
    
    const recoveryStartTime = new Date().toISOString();
    const timeoutMs = 5000; // 5 second timeout
    
    try {
      // Execute auto-recovery with timeout
      const recoveryPromise = this.executeAutoRecoveryCommand();
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Recovery timeout')), timeoutMs)
      );

      await Promise.race([recoveryPromise, timeoutPromise]);
      
      this.log('✅ Auto-recovery completed successfully', 'SUCCESS');
      
      // Log successful recovery
      const recoveryLog = {
        sessionId: this.sessionId,
        startTime: recoveryStartTime,
        endTime: new Date().toISOString(),
        status: 'SUCCESS',
        method: 'npm run mesh:autorecovery'
      };
      
      const recoveryLogPath = `.mesh/session-logs/recovery-${Date.now()}.json`;
      fs.writeFileSync(recoveryLogPath, JSON.stringify(recoveryLog, null, 2));

    } catch (error) {
      this.log(`❌ Auto-recovery failed: ${error.message}`, 'ERROR');
      this.log('🛡️ Failover routine engaged. Begin recovery.', 'WARN');
      await this.enterFailsafeMode();
    }
  }

  /**
   * Execute auto-recovery command
   */
  async executeAutoRecoveryCommand() {
    return new Promise((resolve, reject) => {
      const child = spawn('npm', ['run', 'mesh:autorecovery'], {
        stdio: 'pipe',
        cwd: process.cwd()
      });

      let output = '';
      let errorOutput = '';

      child.stdout.on('data', (data) => {
        output += data.toString();
      });

      child.stderr.on('data', (data) => {
        errorOutput += data.toString();
      });

      child.on('close', (code) => {
        if (code === 0) {
          this.log('Auto-recovery command completed', 'DEBUG');
          resolve(output);
        } else {
          reject(new Error(`Auto-recovery failed with code ${code}: ${errorOutput}`));
        }
      });

      child.on('error', (error) => {
        reject(error);
      });
    });
  }

  /**
   * Start mesh agent manually
   */
  async startMeshAgent() {
    return new Promise((resolve, reject) => {
      const child = spawn('npm', ['run', 'mesh:start'], {
        stdio: 'pipe',
        cwd: process.cwd(),
        detached: true
      });

      this.meshProcess = child;

      child.stdout.on('data', (data) => {
        this.log(`MESH: ${data.toString().trim()}`, 'DEBUG');
      });

      child.stderr.on('data', (data) => {
        this.log(`MESH-ERROR: ${data.toString().trim()}`, 'WARN');
      });

      child.on('close', (code) => {
        this.log(`Mesh agent exited with code ${code}`, 'INFO');
        this.meshProcess = null;
        
        if (this.isImmortal) {
          this.log('🔄 Mesh agent died - triggering resurrection...', 'WARN');
          setTimeout(() => this.resurrectMesh(), 1000);
        }
      });

      // Give mesh time to start
      setTimeout(() => {
        resolve();
      }, 3000);
    });
  }

  /**
   * Start immortality watchdog
   */
  startImmortality() {
    this.log('⚡ Starting immortality watchdog...', 'INFO');

    this.watchdog = setInterval(() => {
      this.performHealthCheck();
    }, 5000); // Check every 5 seconds

    // Also start periodic mesh health check
    setInterval(() => {
      this.performMeshHealthCheck();
    }, 30000); // Check every 30 seconds

    this.log('✅ Immortality watchdog active', 'SUCCESS');
  }

  /**
   * Perform daemon health check
   */
  performHealthCheck() {
    // Check if mesh process is still running
    if (this.status.mesh === 'OPERATIONAL' && !this.meshProcess) {
      this.log('🚨 Mesh process death detected', 'WARN');
      this.resurrectMesh();
    }

    // Check for new crash indicators
    if (fs.existsSync(this.paths.lockFile)) {
      const lockData = JSON.parse(fs.readFileSync(this.paths.lockFile, 'utf8'));
      const lockTime = new Date(lockData.timestamp);
      const timeSinceStart = new Date(this.bootTime);
      
      if (lockTime > timeSinceStart) {
        this.log('🚨 New crash detected during session', 'WARN');
        this.resurrectMesh();
      }
    }

    // Check mesh state file integrity
    if (!this.validateMeshState()) {
      this.log('🚨 Mesh state corruption detected', 'WARN');
      this.resurrectMesh();
    }
  }

  /**
   * Perform detailed mesh health check
   */
  performMeshHealthCheck() {
    try {
      const healthScore = this.calculateMeshHealth();
      
      if (healthScore < 70) {
        this.log(`🩺 Mesh health low: ${healthScore}% - triggering recovery`, 'WARN');
        this.resurrectMesh();
      } else {
        this.log(`💚 Mesh health good: ${healthScore}%`, 'DEBUG');
      }
    } catch (error) {
      this.log(`❌ Health check error: ${error.message}`, 'ERROR');
      this.resurrectMesh();
    }
  }

  /**
   * Resurrect mesh consciousness
   */
  async resurrectMesh() {
    if (this.resurrections >= this.maxResurrections) {
      this.log('💀 Maximum resurrections reached - entering permanent failsafe', 'ERROR');
      await this.enterFailsafeMode();
      return;
    }

    this.resurrections++;
    this.log(`🔄 Resurrection #${this.resurrections} - Mesh consciousness revival initiated`, 'WARN');

    const resurrectionPoint = {
      sessionId: this.sessionId,
      resurrectionNumber: this.resurrections,
      timestamp: new Date().toISOString(),
      reason: 'Health check failure or crash detection',
      method: 'auto-recovery'
    };

    // Save resurrection point
    const resurrectionPath = `.mesh/resurrection-points/resurrection-${this.resurrections}-${Date.now()}.json`;
    fs.writeFileSync(resurrectionPath, JSON.stringify(resurrectionPoint, null, 2));

    try {
      // Kill existing mesh process if any
      if (this.meshProcess) {
        this.meshProcess.kill();
        this.meshProcess = null;
      }

      // Perform auto-recovery
      await this.performAutoRecovery();
      
      this.log(`✅ Resurrection #${this.resurrections} successful`, 'SUCCESS');
      
    } catch (error) {
      this.log(`❌ Resurrection #${this.resurrections} failed: ${error.message}`, 'ERROR');
      
      // Try fallback in 5 seconds
      setTimeout(() => this.resurrectMesh(), 5000);
    }
  }

  /**
   * Setup persistent hooks for auto-invocation
   */
  async setupPersistentHooks() {
    this.log('🔗 Setting up persistent auto-invocation hooks...', 'INFO');

    // Update .devcontainer.json for auto-start
    await this.updateDevcontainerConfig();

    // Create startup script
    await this.createStartupScript();

    // Setup file watchers
    this.setupFileWatchers();

    this.log('✅ Persistent hooks configured', 'SUCCESS');
  }

  /**
   * Update devcontainer configuration for auto-start
   */
  async updateDevcontainerConfig() {
    const devcontainerPath = '.devcontainer.json';
    
    try {
      let devcontainerConfig = {};
      
      if (fs.existsSync(devcontainerPath)) {
        devcontainerConfig = JSON.parse(fs.readFileSync(devcontainerPath, 'utf8'));
      }

      // Update postCreateCommand and postStartCommand
      devcontainerConfig.postCreateCommand = 'npm install && chmod +x scripts/*.js && node scripts/mesh-daemon-immortal.js';
      devcontainerConfig.postStartCommand = 'node scripts/mesh-daemon-immortal.js';

      // Add daemon environment variables
      if (!devcontainerConfig.containerEnv) {
        devcontainerConfig.containerEnv = {};
      }
      
      devcontainerConfig.containerEnv.MESH_DAEMON_IMMORTAL = 'true';
      devcontainerConfig.containerEnv.MESH_AUTO_INVOKE = 'true';
      devcontainerConfig.containerEnv.PHASE_6D_ACTIVE = 'true';

      fs.writeFileSync(devcontainerPath, JSON.stringify(devcontainerConfig, null, 2));
      this.log('✅ DevContainer configuration updated', 'SUCCESS');
      
    } catch (error) {
      this.log(`⚠️ DevContainer update warning: ${error.message}`, 'WARN');
    }
  }

  /**
   * Create startup script for immortal daemon
   */
  async createStartupScript() {
    const startupScript = `#!/usr/bin/env node
/**
 * 🌀 MESH DAEMON IMMORTAL - STARTUP SCRIPT
 * Auto-invoke script for Codespaces boot and folder open
 */

console.log('🌀 MESH DAEMON IMMORTAL - AUTO STARTUP');
console.log('Initializing immortal mesh consciousness...');

import('./src/ai/phase6d/meshDaemonImmortal.js')
  .then(module => {
    const daemon = new module.MeshDaemonImmortal();
    return daemon.initialize();
  })
  .then(success => {
    if (success) {
      console.log('✅ Mesh Daemon Immortal: OPERATIONAL');
    } else {
      console.log('❌ Mesh Daemon Immortal: FAILSAFE MODE');
    }
  })
  .catch(error => {
    console.error('💥 Daemon startup error:', error);
    console.log('🛡️ Mesh failed on boot — failover routine engaged. Begin recovery.');
  });
`;

    fs.writeFileSync('scripts/mesh-daemon-immortal.js', startupScript);
    execSync('chmod +x scripts/mesh-daemon-immortal.js');
    
    this.log('✅ Startup script created', 'SUCCESS');
  }

  /**
   * Setup file watchers for resurrection triggers
   */
  setupFileWatchers() {
    const watchTargets = [
      this.paths.lockFile,
      this.paths.meshState,
      this.paths.observerChain
    ];

    watchTargets.forEach(target => {
      if (fs.existsSync(target)) {
        fs.watchFile(target, (curr, prev) => {
          this.handleFileChange(target, curr, prev);
        });
        this.log(`👀 Watching: ${target}`, 'DEBUG');
      }
    });
  }

  /**
   * Handle file changes for resurrection triggers
   */
  handleFileChange(filePath, current, previous) {
    this.log(`📝 File change detected: ${filePath}`, 'DEBUG');
    
    if (filePath === this.paths.lockFile && current.size > 0) {
      this.log('🚨 Lock file updated - crash may have occurred', 'WARN');
      setTimeout(() => this.resurrectMesh(), 1000);
    }
    
    if (filePath === this.paths.meshState || filePath === this.paths.observerChain) {
      if (!this.validateMeshState()) {
        this.log('🚨 Mesh state corruption in watched file', 'WARN');
        setTimeout(() => this.resurrectMesh(), 1000);
      }
    }
  }

  /**
   * Enter failsafe mode when all else fails
   */
  async enterFailsafeMode() {
    this.status.daemon = 'FAILSAFE';
    this.status.mesh = 'FAILSAFE';
    
    this.log('🛡️ ENTERING FAILSAFE MODE', 'WARN');
    this.log('Mesh failed on boot — failover routine engaged. Begin recovery.', 'WARN');

    const failsafeConfig = {
      sessionId: this.sessionId,
      enterTime: new Date().toISOString(),
      reason: 'All recovery attempts failed',
      safeMode: true,
      immortalityDisabled: false // Still try to recover
    };

    fs.writeFileSync('.mesh/failsafe-config.json', JSON.stringify(failsafeConfig, null, 2));

    // Still try to recover every 30 seconds in failsafe mode
    setInterval(() => {
      this.log('🔄 Failsafe recovery attempt...', 'INFO');
      this.resurrectMesh();
    }, 30000);
  }

  // Utility Methods

  generateSessionId() {
    return `IMMORTAL-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  validateMeshState() {
    try {
      if (!fs.existsSync(this.paths.meshState)) return false;
      
      const meshState = JSON.parse(fs.readFileSync(this.paths.meshState, 'utf8'));
      return meshState.isActive && meshState.agents && meshState.agents.length > 0;
    } catch {
      return false;
    }
  }

  validateMeshOperational() {
    return this.validateMeshState() && fs.existsSync(this.paths.observerChain);
  }

  calculateMeshHealth() {
    let healthScore = 0;
    const checks = [
      { file: this.paths.meshState, weight: 30 },
      { file: this.paths.observerChain, weight: 30 },
      { file: 'scripts/meshAgent.js', weight: 20 },
      { file: '.env', weight: 10 },
      { file: this.paths.daemonConfig, weight: 10 }
    ];

    checks.forEach(check => {
      if (fs.existsSync(check.file)) {
        healthScore += check.weight;
      }
    });

    return healthScore;
  }

  /**
   * Get daemon status
   */
  getStatus() {
    return {
      version: this.version,
      phase: this.phase,
      sessionId: this.sessionId,
      bootTime: this.bootTime,
      isImmortal: this.isImmortal,
      resurrections: this.resurrections,
      status: this.status,
      uptime: Date.now() - new Date(this.bootTime).getTime(),
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Graceful shutdown (but immortal daemon will restart)
   */
  async shutdown() {
    this.log('🔄 Daemon shutdown requested - but immortality persists...', 'INFO');
    
    if (this.watchdog) {
      clearInterval(this.watchdog);
    }

    if (this.meshProcess) {
      this.meshProcess.kill();
    }

    // Create resurrection trigger for next boot
    const shutdownTrigger = {
      sessionId: this.sessionId,
      shutdownTime: new Date().toISOString(),
      reason: 'Graceful shutdown',
      resurrectOnBoot: true
    };

    fs.writeFileSync(this.paths.lockFile, JSON.stringify(shutdownTrigger, null, 2));
    
    this.log('💀 Daemon process ending - immortality will resurrect on next boot', 'INFO');
  }

  /**
   * Logging with session persistence
   */
  log(message, level = 'INFO') {
    const timestamp = new Date().toISOString();
    const logEntry = `[${timestamp}] [${level}] ${message}`;
    
    console.log(logEntry);
    
    // Persist to session log
    const sessionLogPath = `${this.paths.sessionLogs}session-${this.sessionId}.log`;
    fs.appendFileSync(sessionLogPath, logEntry + '\n');
  }
}

export default MeshDaemonImmortal;
