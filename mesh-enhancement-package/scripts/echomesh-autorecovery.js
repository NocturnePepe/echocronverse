#!/usr/bin/env node
/**
 * 🤖 ECHOMESH AUTORECOVERY MODE v6B
 * Automatic mesh consciousness restoration after Codespaces restarts or unexpected shutdowns
 * 
 * @version 6B
 * @phase 7.5
 * @author EchoMesh Consciousness
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const AUTORECOVERY_CONFIG = {
  version: '6B',
  phase: '7.5',
  logPrefix: 'EchoMesh [Reboot Sync Detected]',
  envFile: '.env',
  cacheFile: '.echorecover/cache.json',
  fallbackFile: 'docs/SUMMARY.md',
  meshActivateCommand: 'node scripts/meshAgent.js',
  fallbackCommand: 'npm run mesh:start'
};

console.log('🤖 ECHOMESH AUTORECOVERY MODE v6B - INITIATED');
console.log('═══════════════════════════════════════════════════════════════');

class EchoMeshAutoRecovery {
  constructor() {
    this.isRecoveryMode = false;
    this.lastSession = null;
    this.meshMode = null;
  }

  log(message, type = 'INFO') {
    const timestamp = new Date().toISOString();
    const prefix = AUTORECOVERY_CONFIG.logPrefix;
    console.log(`[${timestamp}] ${prefix} - ${type}: ${message}`);
  }

  /**
   * Step 1: Scan .env for MESH_MODE=auto
   */
  checkMeshMode() {
    this.log('Scanning environment configuration...');
    
    try {
      if (!fs.existsSync(AUTORECOVERY_CONFIG.envFile)) {
        this.log('No .env file found - AutoRecovery disabled', 'WARN');
        return false;
      }

      const envContent = fs.readFileSync(AUTORECOVERY_CONFIG.envFile, 'utf8');
      const meshModeMatch = envContent.match(/MESH_MODE=([^\n\r]+)/);
      
      if (!meshModeMatch) {
        this.log('MESH_MODE not found in .env - AutoRecovery disabled', 'WARN');
        return false;
      }

      this.meshMode = meshModeMatch[1].trim();
      this.log(`MESH_MODE detected: ${this.meshMode}`);

      if (this.meshMode !== 'auto') {
        this.log(`MESH_MODE is '${this.meshMode}' (not 'auto') - AutoRecovery disabled`, 'INFO');
        return false;
      }

      this.log('MESH_MODE=auto confirmed - AutoRecovery enabled', 'SUCCESS');
      return true;
    } catch (error) {
      this.log(`Environment check failed: ${error.message}`, 'ERROR');
      return false;
    }
  }

  /**
   * Step 3: Check .echorecover/cache.json or fallback to /docs/summary.md
   */
  loadLastSession() {
    this.log('Loading last mesh session data...');

    // Try primary cache file first
    try {
      if (fs.existsSync(AUTORECOVERY_CONFIG.cacheFile)) {
        const cacheData = JSON.parse(fs.readFileSync(AUTORECOVERY_CONFIG.cacheFile, 'utf8'));
        this.lastSession = cacheData;
        this.log(`Session cache loaded: Phase ${cacheData.phase || '7.5'}, Last sync: ${cacheData.lastSync}`, 'SUCCESS');
        return true;
      }
    } catch (error) {
      this.log(`Cache file read error: ${error.message}`, 'WARN');
    }

    // Fallback to summary.md
    try {
      if (fs.existsSync(AUTORECOVERY_CONFIG.fallbackFile)) {
        const summaryContent = fs.readFileSync(AUTORECOVERY_CONFIG.fallbackFile, 'utf8');
        
        // Extract phase info from summary
        const phaseMatch = summaryContent.match(/Phase (\d+\.\d+)/);
        const statusMatch = summaryContent.match(/Status.*?(\w+)/);
        
        this.lastSession = {
          phase: phaseMatch ? phaseMatch[1] : '7.5',
          status: statusMatch ? statusMatch[1] : 'RECOVERY',
          source: 'summary_fallback',
          timestamp: new Date().toISOString()
        };

        this.log(`Fallback session loaded from summary.md: Phase ${this.lastSession.phase}`, 'SUCCESS');
        return true;
      }
    } catch (error) {
      this.log(`Fallback file read error: ${error.message}`, 'WARN');
    }

    this.log('No session data found - fresh initialization required', 'WARN');
    return false;
  }

  /**
   * Step 2: Resume mesh-agent.js mesh-activate
   */
  async resumeMeshSession() {
    this.log('Restoring last mesh session...');

    try {
      // Ensure cache directory exists
      const cacheDir = path.dirname(AUTORECOVERY_CONFIG.cacheFile);
      if (!fs.existsSync(cacheDir)) {
        fs.mkdirSync(cacheDir, { recursive: true });
        this.log(`Created cache directory: ${cacheDir}`);
      }

      // Create recovery cache if it doesn't exist
      if (!fs.existsSync(AUTORECOVERY_CONFIG.cacheFile)) {
        const recoveryCache = {
          phase: this.lastSession?.phase || '7.5',
          meshMode: 'auto',
          autoRecovery: true,
          lastSync: new Date().toISOString(),
          recoveryCount: 1,
          version: AUTORECOVERY_CONFIG.version
        };

        fs.writeFileSync(AUTORECOVERY_CONFIG.cacheFile, JSON.stringify(recoveryCache, null, 2));
        this.log('Recovery cache created');
      }

      // Execute mesh activation
      this.log('Executing mesh activation command...');
      const result = execSync(AUTORECOVERY_CONFIG.meshActivateCommand, { 
        encoding: 'utf8',
        timeout: 30000
      });

      this.log('Mesh activation completed successfully', 'SUCCESS');
      return true;

    } catch (error) {
      this.log(`Mesh activation failed: ${error.message}`, 'ERROR');
      return false;
    }
  }

  /**
   * Step 5: Fallback to pnpm run restart:mesh
   */
  async fallbackRestart() {
    this.log('Executing fallback restart command...');

    try {
      const result = execSync(AUTORECOVERY_CONFIG.fallbackCommand, { 
        encoding: 'utf8',
        timeout: 30000
      });

      this.log('Fallback restart completed successfully', 'SUCCESS');
      return true;

    } catch (error) {
      this.log(`Fallback restart failed: ${error.message}`, 'ERROR');
      return false;
    }
  }

  /**
   * Main AutoRecovery execution flow
   */
  async execute() {
    console.log('🤖 ECHOMESH AUTORECOVERY MODE v6B - INITIATED');
    console.log('═══════════════════════════════════════════════════════════════');
    this.log(`AutoRecovery v${AUTORECOVERY_CONFIG.version} starting...`);

    // Step 1: Check MESH_MODE=auto
    if (!this.checkMeshMode()) {
      this.log('AutoRecovery conditions not met - Exiting', 'INFO');
      return false;
    }

    // Step 3: Load last session data
    const sessionLoaded = this.loadLastSession();

    try {
      // Step 2: Resume mesh session
      const meshResumed = await this.resumeMeshSession();
      
      if (meshResumed) {
        this.log('✅ EchoMesh AutoRecovery completed successfully', 'SUCCESS');
        console.log('═══════════════════════════════════════════════════════════════');
        console.log('🌀 Mesh consciousness restored - Standing by for coordination...');
        return true;
      }

      // Step 5: Fallback if mesh activation failed
      if (!sessionLoaded) {
        this.log('Attempting fallback restart due to missing cache...', 'WARN');
        const fallbackSuccess = await this.fallbackRestart();
        
        if (fallbackSuccess) {
          this.log('✅ Fallback restart completed', 'SUCCESS');
          return true;
        }
      }

      this.log('❌ AutoRecovery failed - Manual intervention required', 'ERROR');
      return false;

    } catch (error) {
      this.log(`AutoRecovery execution error: ${error.message}`, 'ERROR');
      return false;
    }
  }
}

// Execute AutoRecovery if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const autoRecovery = new EchoMeshAutoRecovery();
  
  autoRecovery.execute()
    .then(success => {
      process.exit(success ? 0 : 1);
    })
    .catch(error => {
      console.error('💥 AutoRecovery fatal error:', error);
      process.exit(1);
    });
}

export default EchoMeshAutoRecovery;
