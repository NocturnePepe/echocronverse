// Simple script to check if build is working
const { exec } = require('child_process');

console.log('🔍 Checking TypeScript compilation...');

exec('npx tsc --noEmit', (error, stdout, stderr) => {
  if (error) {
    console.error('❌ TypeScript compilation failed:');
    console.error(stderr);
    return;
  }
  
  if (stdout) {
    console.log('📝 TypeScript output:', stdout);
  }
  
  console.log('✅ TypeScript compilation successful!');
  
  // Now check Vite build
  console.log('🏗️ Checking Vite build...');
  exec('npm run build', (buildError, buildStdout, buildStderr) => {
    if (buildError) {
      console.error('❌ Vite build failed:');
      console.error(buildStderr);
      return;
    }
    
    console.log('✅ Vite build successful!');
    console.log('🎉 Phase 6.4 Community Features - BUILD READY! 🎉');
  });
});
