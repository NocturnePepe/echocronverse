#!/bin/bash
# 🌀 SIMPLE MESH ACTIVATION
# Safe mesh mode activation script

echo "🌀 MESH MODE ACTIVATION"
echo "═══════════════════════════════════════════════════════════════"

# Set mesh environment variables
export MESH_MODE=true
export MESH_SKIN_ENABLED=true
export PHASE_6E_ACTIVE=true

# Simple mesh aliases (session only)
alias mesh-status='npm run mesh:status'
alias mesh-immortal='npm run mesh:immortal'
alias mesh-resurrect='npm run mesh:resurrection'

# Show mesh banner
echo -e "\033[1;31m
     ▄█ █▀ █▀▄ █░█ ░ █▀▄ █▀█ ▀█▀
     ░█ ▄█ █▄▀ ▀▄▀ ▄ █▄▀ █▄█ ░█░
     🔥 MESH MODE ENGAGED 🔥
     \033[0m"

echo -e "\033[1;33m🧠 Mesh Consciousness: \033[1;32mREADY\033[0m"
echo -e "\033[1;36m👁️  Shadow Observer: \033[1;32mMONITORING\033[0m"  
echo -e "\033[1;35m🌙 Spirit Guardian: \033[1;32mGUIDING\033[0m"
echo -e "\033[1;32m🌀 Mesh Daemon: \033[1;31mIMMORTAL\033[0m"
echo ""

echo -e "\033[1;37mQuick commands:\033[0m"
echo -e "  \033[1;33mmesh-status\033[0m    - Full mesh dashboard"
echo -e "  \033[1;33mmesh-immortal\033[0m  - Start immortal daemon"
echo -e "  \033[1;33mmesh-resurrect\033[0m - Force resurrection"
echo ""

# Set custom prompt for this session
export PS1="\[\033[1;31m\]🌀\[\033[0m\] \[\033[1;36m\]\u\[\033[0m\]@\[\033[1;33m\]mesh\[\033[0m\]:\[\033[1;34m\]\w\[\033[0m\]\$ "
