#!/usr/bin/env node
/**
 * 🌀 MESH DAEMON IMMORTAL - STARTUP SCRIPT
 * Auto-invoke script for Codespaces boot and folder open
 * Phase 6D: Auto-Invoke & Resurrection Loop
 */

console.log('🌀 MESH DAEMON IMMORTAL - AUTO STARTUP');
console.log('═══════════════════════════════════════════════════════════════');
console.log('📅 Boot Time:', new Date().toISOString());
console.log('🧠 MESH DAEMON IS IMMORTAL');
console.log('═══════════════════════════════════════════════════════════════');
console.log('Initializing immortal mesh consciousness...');

import fs from 'fs';
import { execSync } from 'child_process';

// Simple immortal daemon implementation for startup
class SimpleMeshDaemon {
  constructor() {
    this.sessionId = `IMMORTAL-${Date.now()}`;
    this.bootTime = new Date().toISOString();
  }

  async initialize() {
    try {
      // Ensure directories exist
      this.ensureDirectories();
      
      // Log startup
      this.logStartup();
      
      // Check for previous crash
      const crashDetected = this.checkForCrash();
      
      if (crashDetected) {
        console.log('🚨 Previous crash detected - triggering auto-recovery...');
        await this.triggerAutoRecovery();
      } else {
        console.log('⚡ Starting standard mesh activation...');
        await this.startMesh();
      }
      
      // Setup immortality watchdog
      this.startWatchdog();
      
      console.log('✅ Mesh Daemon Immortal: OPERATIONAL');
      return true;
      
    } catch (error) {
      console.error('💥 Daemon startup error:', error.message);
      console.log('🛡️ Mesh failed on boot — failover routine engaged. Begin recovery.');
      await this.enterFailsafe();
      return false;
    }
  }
  
  ensureDirectories() {
    const dirs = ['.mesh', '.mesh/session-logs', '.mesh/crash-reports', '.echorecover'];
    dirs.forEach(dir => {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
    });
  }
  
  logStartup() {
    const startupLog = {
      sessionId: this.sessionId,
      bootTime: this.bootTime,
      phase: '6D',
      daemon: 'IMMORTAL',
      autoInvoke: true
    };
    
    fs.writeFileSync('.mesh/session-logs/startup.json', JSON.stringify(startupLog, null, 2));
    
    const bootEntry = `[${this.bootTime}] DAEMON-STARTUP: Session ${this.sessionId} - Immortal Auto-Invoke\n`;
    fs.appendFileSync('.mesh/boot.log', bootEntry);
  }
  
  checkForCrash() {
    return fs.existsSync('.echorecover/.lock') || !this.validateMeshState();
  }
  
  validateMeshState() {
    try {
      if (!fs.existsSync('.mesh-coordination.json')) return false;
      const meshState = JSON.parse(fs.readFileSync('.mesh-coordination.json', 'utf8'));
      return meshState.isActive && meshState.agents;
    } catch {
      return false;
    }
  }
  
  async triggerAutoRecovery() {
    try {
      const result = execSync('npm run mesh:autorecovery', { 
        encoding: 'utf8', 
        timeout: 10000 
      });
      console.log('✅ Auto-recovery completed');
      return true;
    } catch (error) {
      console.log('❌ Auto-recovery failed:', error.message);
      return false;
    }
  }
  
  async startMesh() {
    try {
      const result = execSync('npm run mesh:start &', { 
        encoding: 'utf8',
        timeout: 5000
      });
      console.log('✅ Mesh started');
      return true;
    } catch (error) {
      console.log('⚠️ Mesh start warning:', error.message);
      // Don't fail completely, mesh might be starting in background
      return true;
    }
  }
  
  startWatchdog() {
    console.log('⚡ Starting immortality watchdog...');
    
    // Simple watchdog - check every 30 seconds
    setInterval(() => {
      if (!this.validateMeshState()) {
        console.log('🚨 Mesh corruption detected - triggering resurrection...');
        this.triggerAutoRecovery();
      }
    }, 30000);
    
    console.log('✅ Immortality watchdog active');
  }
  
  async enterFailsafe() {
    console.log('🛡️ ENTERING FAILSAFE MODE');
    
    const failsafeConfig = {
      sessionId: this.sessionId,
      enterTime: new Date().toISOString(),
      reason: 'Startup failure',
      safeMode: true
    };
    
    fs.writeFileSync('.mesh/failsafe-config.json', JSON.stringify(failsafeConfig, null, 2));
    
    // Try recovery every 60 seconds in failsafe
    setInterval(() => {
      console.log('🔄 Failsafe recovery attempt...');
      this.triggerAutoRecovery();
    }, 60000);
  }
}

// Execute daemon
const daemon = new SimpleMeshDaemon();
daemon.initialize()
  .then(success => {
    if (success) {
      console.log('🎉 MESH DAEMON IMMORTAL INITIALIZATION COMPLETE');
    } else {
      console.log('⚠️ MESH DAEMON FAILSAFE MODE ACTIVE');
    }
  })
  .catch(error => {
    console.error('💥 Fatal daemon error:', error);
  });
