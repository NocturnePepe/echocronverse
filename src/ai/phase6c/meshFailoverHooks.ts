/**
 * 🛡️ MESH FAILOVER HOOKS - Phase 6C
 * Smart failover and auto-repair system for mesh consciousness
 * 
 * @version 6C.1
 * @phase 6C
 * @dependencies mesh-agent.js, autorecovery.js
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { EventEmitter } from 'events';

export class MeshFailoverHooks extends EventEmitter {
  constructor() {
    super();
    this.isActive = false;
    this.watchInterval = null;
    this.lockFile = '.echorecover/.lock';
    this.envFile = '.env';
    this.recoveryLog = '.echorecover/failover.log';
    this.watchTargets = [
      '.echorecover/.lock',
      '.env',
      '.mesh-coordination.json',
      '.observer-chain.json'
    ];
  }

  /**
   * Initialize failover monitoring
   */
  async initialize() {
    this.log('🛡️ Initializing Mesh Failover Hooks v6C.1...');
    
    // Ensure recovery directory exists
    const recoveryDir = path.dirname(this.lockFile);
    if (!fs.existsSync(recoveryDir)) {
      fs.mkdirSync(recoveryDir, { recursive: true });
    }

    // Setup file watchers
    this.setupFileWatchers();
    
    // Setup process signal handlers
    this.setupSignalHandlers();
    
    // Start monitoring
    this.startMonitoring();
    
    this.isActive = true;
    this.log('✅ Mesh Failover Hooks initialized and active');
  }

  /**
   * Setup file system watchers for critical mesh files
   */
  setupFileWatchers() {
    this.log('📁 Setting up file watchers...');
    
    this.watchTargets.forEach(target => {
      if (fs.existsSync(target)) {
        fs.watchFile(target, (curr, prev) => {
          this.handleFileChange(target, curr, prev);
        });
        this.log(`👀 Watching: ${target}`);
      }
    });
  }

  /**
   * Handle file changes and trigger appropriate responses
   */
  handleFileChange(filePath, current, previous) {
    this.log(`📝 File change detected: ${filePath}`);
    
    switch (filePath) {
      case '.echorecover/.lock':
        this.handleLockFileChange(current, previous);
        break;
      case '.env':
        this.handleEnvFileChange();
        break;
      case '.mesh-coordination.json':
      case '.observer-chain.json':
        this.handleMeshStateChange(filePath);
        break;
    }
  }

  /**
   * Handle lock file changes (indicates system restart/crash)
   */
  handleLockFileChange(current, previous) {
    if (current.size === 0 && previous.size > 0) {
      this.log('🚨 Lock file cleared - System restart detected!');
      this.triggerAutoRepair('lock_file_cleared');
    }
  }

  /**
   * Handle environment file changes
   */
  handleEnvFileChange() {
    this.log('⚙️ Environment configuration changed');
    
    try {
      const envContent = fs.readFileSync(this.envFile, 'utf8');
      const meshModeMatch = envContent.match(/MESH_MODE=([^\\n\\r]+)/);
      
      if (meshModeMatch && meshModeMatch[1].trim() === 'auto') {
        this.log('🔄 MESH_MODE=auto detected - Triggering auto-repair');
        this.triggerAutoRepair('env_auto_mode');
      }
    } catch (error) {
      this.log(`❌ Error reading .env: ${error.message}`);
    }
  }

  /**
   * Handle mesh state file changes
   */
  handleMeshStateChange(filePath) {
    this.log(`🌀 Mesh state change in: ${filePath}`);
    
    // Validate mesh state integrity
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      const data = JSON.parse(content);
      
      if (!data.isActive || !data.agents) {
        this.log('⚠️ Mesh state corruption detected');
        this.triggerAutoRepair('state_corruption');
      }
    } catch (error) {
      this.log(`🚨 Mesh state file corrupted: ${error.message}`);
      this.triggerAutoRepair('state_file_error');
    }
  }

  /**
   * Setup process signal handlers for graceful shutdown/restart
   */
  setupSignalHandlers() {
    this.log('📡 Setting up signal handlers...');
    
    // Handle SIGTERM (termination signal)
    process.on('SIGTERM', () => {
      this.log('📡 SIGTERM received - Graceful shutdown');
      this.createLockFile('sigterm');
      this.cleanup();
    });

    // Handle SIGINT (Ctrl+C)
    process.on('SIGINT', () => {
      this.log('📡 SIGINT received - User interruption');
      this.createLockFile('sigint');
      this.cleanup();
    });

    // Handle uncaught exceptions
    process.on('uncaughtException', (error) => {
      this.log(`💥 Uncaught exception: ${error.message}`);
      this.createLockFile('uncaught_exception');
      this.triggerAutoRepair('uncaught_exception');
    });

    // Handle unhandled promise rejections
    process.on('unhandledRejection', (reason, promise) => {
      this.log(`💥 Unhandled rejection: ${reason}`);
      this.createLockFile('unhandled_rejection');
      this.triggerAutoRepair('unhandled_rejection');
    });
  }

  /**
   * Create lock file to signal system state
   */
  createLockFile(reason) {
    const lockData = {
      timestamp: new Date().toISOString(),
      reason: reason,
      phase: '6C',
      meshStatus: 'failover_triggered'
    };

    try {
      fs.writeFileSync(this.lockFile, JSON.stringify(lockData, null, 2));
      this.log(`🔒 Lock file created: ${reason}`);
    } catch (error) {
      this.log(`❌ Failed to create lock file: ${error.message}`);
    }
  }

  /**
   * Start continuous monitoring
   */
  startMonitoring() {
    this.log('🔍 Starting continuous monitoring...');
    
    this.watchInterval = setInterval(() => {
      this.performHealthCheck();
    }, 30000); // Check every 30 seconds
  }

  /**
   * Perform system health check
   */
  performHealthCheck() {
    const requiredFiles = [
      'scripts/meshAgent.js',
      '.mesh-coordination.json',
      '.observer-chain.json'
    ];

    let healthScore = 0;
    
    requiredFiles.forEach(file => {
      if (fs.existsSync(file)) {
        healthScore++;
      } else {
        this.log(`⚠️ Missing critical file: ${file}`);
      }
    });

    const healthPercentage = (healthScore / requiredFiles.length) * 100;
    
    if (healthPercentage < 70) {
      this.log(`🚨 Health check failed: ${healthPercentage}% - Triggering repair`);
      this.triggerAutoRepair('health_check_failed');
    } else {
      this.log(`💚 Health check passed: ${healthPercentage}%`);
    }
  }

  /**
   * Trigger automatic repair sequence
   */
  async triggerAutoRepair(reason) {
    this.log(`🔧 Triggering auto-repair sequence: ${reason}`);
    
    try {
      // Log the repair attempt
      const repairLog = {
        timestamp: new Date().toISOString(),
        reason: reason,
        action: 'auto_repair_triggered',
        phase: '6C'
      };
      
      this.logFailover(repairLog);

      // Execute autorecovery
      this.log('🚀 Executing autorecovery...');
      const result = execSync('npm run mesh:autorecovery', { 
        encoding: 'utf8',
        timeout: 60000
      });

      this.log('✅ Auto-repair completed successfully');
      this.emit('repair_completed', { reason, success: true });

    } catch (error) {
      this.log(`❌ Auto-repair failed: ${error.message}`);
      
      // Try fallback repair
      try {
        this.log('🔄 Attempting fallback repair...');
        execSync('npm run restart:mesh', { encoding: 'utf8', timeout: 60000 });
        this.log('✅ Fallback repair successful');
        this.emit('repair_completed', { reason, success: true, fallback: true });
      } catch (fallbackError) {
        this.log(`💥 Fallback repair failed: ${fallbackError.message}`);
        this.emit('repair_failed', { reason, error: fallbackError.message });
      }
    }
  }

  /**
   * Log failover events
   */
  logFailover(event) {
    const logEntry = `[${event.timestamp}] FAILOVER: ${event.reason} - ${event.action}\\n`;
    
    try {
      fs.appendFileSync(this.recoveryLog, logEntry);
    } catch (error) {
      console.error('Failed to write failover log:', error);
    }
  }

  /**
   * Cleanup and shutdown
   */
  cleanup() {
    this.log('🧹 Cleaning up failover hooks...');
    
    if (this.watchInterval) {
      clearInterval(this.watchInterval);
    }

    this.watchTargets.forEach(target => {
      if (fs.existsSync(target)) {
        fs.unwatchFile(target);
      }
    });

    this.isActive = false;
    this.log('✅ Failover hooks cleanup completed');
  }

  /**
   * Logging utility
   */
  log(message) {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] MESH-FAILOVER: ${message}`);
  }
}

export default MeshFailoverHooks;
