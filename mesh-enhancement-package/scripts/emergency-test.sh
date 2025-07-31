#!/bin/bash
echo "🔧 EMERGENCY MESH RECOVERY TEST"
echo "=============================="
echo "Date: $(date)"
echo "User: $(whoami)"
echo "Directory: $(pwd)"
echo "Node version: $(node --version 2>/dev/null || echo 'Node not found')"
echo "NPM version: $(npm --version 2>/dev/null || echo 'NPM not found')"
echo ""
echo "🌀 Mesh files check:"
ls -la .mesh* .copilot* .phase* 2>/dev/null || echo "No mesh files found"
echo ""
echo "📝 Package.json check:"
if [ -f "package.json" ]; then
    echo "✅ package.json exists"
    echo "Module type: $(grep '"type"' package.json || echo 'Not found')"
else
    echo "❌ package.json missing"
fi
echo ""
echo "🎯 Recovery test complete - if you see this, terminal is working!"
