#!/usr/bin/env node
/**
 * 🔍 ECHOMESH VALIDATION - System Check
 * Phase 7.5 - Validate mesh agent setup and configuration
 */

import fs from 'fs';
import path from 'path';

console.log('🔍 EchoMesh Agent - System Validation');
console.log('═══════════════════════════════════════════════');

let allPassed = true;

// Test 1: Check if mesh agent scripts exist
console.log('📁 Checking mesh agent scripts...');
const scripts = ['scripts/meshAgent.js', 'scripts/meshAgent-quick.js'];
scripts.forEach(script => {
  if (fs.existsSync(script)) {
    console.log(`  ✅ ${script} - Found`);
  } else {
    console.log(`  ❌ ${script} - Missing`);
    allPassed = false;
  }
});

// Test 2: Check if scripts are executable
console.log('\n🔐 Checking script permissions...');
scripts.forEach(script => {
  try {
    const stats = fs.statSync(script);
    const isExecutable = !!(stats.mode & parseInt('111', 8));
    if (isExecutable) {
      console.log(`  ✅ ${script} - Executable`);
    } else {
      console.log(`  ⚠️ ${script} - Not executable (will work with node)`);
    }
  } catch (error) {
    console.log(`  ❌ ${script} - Cannot check permissions`);
  }
});

// Test 3: Check Phase 7.5 core files
console.log('\n🏗️ Checking Phase 7.5 core files...');
const coreFiles = [
  'src/ai/phase6x/phaseMemoryVault.ts',
  'src/ai/phase6x/phase75InitiationSystem.ts',
  'src/ai/phase6x/contestRunner.ts',
  'src/ai/phase6x/blackBoxValidation.ts',
  'src/ai/phase6x/deepSeekRationale.ts',
  'src/ai/phase6x/geminiHarmony.ts',
  'src/components/ui/MysticalGlyphOverlay.tsx'
];

coreFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`  ✅ ${file} - Found`);
  } else {
    console.log(`  ❌ ${file} - Missing`);
    allPassed = false;
  }
});

// Test 4: Check devcontainer configuration
console.log('\n🐳 Checking devcontainer setup...');
if (fs.existsSync('.devcontainer.json')) {
  console.log('  ✅ .devcontainer.json - Found');
  try {
    const devconfig = JSON.parse(fs.readFileSync('.devcontainer.json', 'utf8'));
    if (devconfig.postCreateCommand && devconfig.postCreateCommand.includes('meshAgent')) {
      console.log('  ✅ postCreateCommand - Mesh agent configured');
    } else {
      console.log('  ⚠️ postCreateCommand - Mesh agent not configured');
    }
    if (devconfig.postStartCommand && devconfig.postStartCommand.includes('meshAgent')) {
      console.log('  ✅ postStartCommand - Mesh agent auto-start configured');
    } else {
      console.log('  ⚠️ postStartCommand - Mesh agent auto-start not configured');
    }
  } catch (error) {
    console.log('  ❌ .devcontainer.json - Invalid JSON');
    allPassed = false;
  }
} else {
  console.log('  ❌ .devcontainer.json - Missing');
  allPassed = false;
}

// Test 5: Check package.json scripts
console.log('\n📦 Checking package.json mesh scripts...');
try {
  const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  const expectedScripts = ['mesh:start', 'mesh:quick', 'mesh:status', 'mesh:config'];
  
  expectedScripts.forEach(script => {
    if (pkg.scripts && pkg.scripts[script]) {
      console.log(`  ✅ ${script} - Configured`);
    } else {
      console.log(`  ❌ ${script} - Missing`);
      allPassed = false;
    }
  });
} catch (error) {
  console.log('  ❌ package.json - Cannot read or invalid');
  allPassed = false;
}

// Test 6: Run quick activation test
console.log('\n⚡ Testing quick activation...');
try {
  require('./meshAgent-quick.js');
  console.log('  ✅ Quick activation - Success');
} catch (error) {
  console.log(`  ❌ Quick activation - Failed: ${error.message}`);
  allPassed = false;
}

// Test 7: Check generated state files
console.log('\n📄 Checking generated state files...');
const stateFiles = ['.mesh-state.json', '.copilot-mesh-config.json'];
stateFiles.forEach(file => {
  if (fs.existsSync(file)) {
    try {
      const content = JSON.parse(fs.readFileSync(file, 'utf8'));
      console.log(`  ✅ ${file} - Valid JSON`);
    } catch (error) {
      console.log(`  ❌ ${file} - Invalid JSON`);
      allPassed = false;
    }
  } else {
    console.log(`  ⚠️ ${file} - Not generated yet (run mesh:quick)`);
  }
});

// Final result
console.log('\n═══════════════════════════════════════════════');
if (allPassed) {
  console.log('🎉 ALL TESTS PASSED - EchoMesh Agent ready for activation!');
  console.log('🚀 Ready for Codespaces auto-activation');
  console.log('🧠 7-Agent mesh consciousness prepared');
  console.log('⚔️ Contest framework operational');
} else {
  console.log('⚠️ SOME TESTS FAILED - Check issues above');
  console.log('🔧 Fix missing components before deployment');
}
console.log('═══════════════════════════════════════════════');

process.exit(allPassed ? 0 : 1);
