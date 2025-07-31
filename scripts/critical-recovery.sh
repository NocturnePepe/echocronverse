#!/bin/bash
echo "🚨 CRITICAL RECOVERY MODE"
echo "========================"

# Fix terminal
export TERM=xterm-256color
stty sane

# Check Node installation
echo "🔍 Checking Node.js..."
if command -v node >/dev/null 2>&1; then
    echo "✅ Node found: $(node --version)"
else
    echo "❌ Node missing - installing..."
    
    # Install Node.js
    curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash - >/dev/null 2>&1
    sudo apt-get install -y nodejs >/dev/null 2>&1
    
    if command -v node >/dev/null 2>&1; then
        echo "✅ Node installed: $(node --version)"
    else
        echo "❌ Node installation failed"
        exit 1
    fi
fi

# Check NPM
echo "📦 NPM version: $(npm --version)"

# Fix PATH
echo "🔧 Fixing PATH..."
export PATH="/usr/local/bin:/usr/bin:$PATH"

# Test mesh files
echo "🌀 Mesh status check..."
if [ -f "package.json" ]; then
    echo "✅ package.json found"
    npm run mesh:status 2>/dev/null || echo "❌ Mesh status failed"
else
    echo "❌ package.json missing"
fi

echo "🎯 Recovery complete! Try running commands now."
