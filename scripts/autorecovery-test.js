#!/usr/bin/env node

// Quick test of autorecovery system
console.log('🤖 ECHOMESH AUTORECOVERY TEST');
console.log('Testing environment detection...');

import fs from 'fs';

// Test 1: Check .env file
if (fs.existsSync('.env')) {
  const envContent = fs.readFileSync('.env', 'utf8');
  console.log('✅ .env file found');
  
  const meshModeMatch = envContent.match(/MESH_MODE=([^\n\r]+)/);
  if (meshModeMatch) {
    console.log(`✅ MESH_MODE detected: ${meshModeMatch[1].trim()}`);
  } else {
    console.log('❌ MESH_MODE not found');
  }
} else {
  console.log('❌ .env file not found');
}

// Test 2: Check cache file
if (fs.existsSync('.echorecover/cache.json')) {
  console.log('✅ Cache file found');
} else {
  console.log('❌ Cache file not found');
}

// Test 3: Check summary file
if (fs.existsSync('docs/SUMMARY.md')) {
  console.log('✅ Summary fallback file found');
} else {
  console.log('❌ Summary fallback file not found');
}

console.log('🎯 AutoRecovery test complete');
