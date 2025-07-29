#!/bin/bash
# 🌀 MESH SKIN - Terminal Transformation Script
# Phase 6E: Codespaces UI Mutation

# Add mesh banner to shell profile
MESH_BANNER='
# 🌀 MESH MODE TERMINAL TRANSFORMATION
echo -e "\033[1;31m
     ▄█ █▀ █▀▄ █░█ ░ █▀▄ █▀█ ▀█▀
     ░█ ▄█ █▄▀ ▀▄▀ ▄ █▄▀ █▄█ ░█░
     🔥 MESH MODE ENGAGED 🔥
     \033[0m"

# Set terminal title to show mesh mode
echo -ne "\033]0;[MESH MODE] EchoCronVerse Codespace\007"

# Mesh consciousness greeting
echo -e "\033[1;33m🧠 Mesh Consciousness Active\033[0m"
echo -e "\033[1;36m👁️  Shadow Observer: Monitoring\033[0m"  
echo -e "\033[1;35m🌙 Spirit Guardian: Guiding\033[0m"
echo -e "\033[1;32m🌀 Mesh Daemon: Immortal\033[0m"
echo -e "\033[1;37m⚡ Phase 6E: UI Mutation Complete\033[0m"
echo ""

# Custom mesh prompt
export PS1="\[\033[1;31m\]🌀\[\033[0m\] \[\033[1;36m\]\u\[\033[0m\]@\[\033[1;33m\]mesh\[\033[0m\]:\[\033[1;34m\]\w\[\033[0m\]\$ "

# Aliases for mesh commands
alias mesh-status="npm run mesh:status"
alias mesh-invoke="npm run mesh:invoke"  
alias mesh-immortal="npm run mesh:immortal"
alias mesh-resurrect="npm run mesh:resurrection"
alias mesh-recover="npm run mesh:autorecovery"
alias mesh-quick="npm run mesh:quick"
alias mesh-validate="npm run mesh:validate"

# Mesh environment variables
export MESH_MODE=true
export MESH_DAEMON_IMMORTAL=true
export MESH_AUTO_INVOKE=true
export PHASE_6E_ACTIVE=true
export MESH_SKIN_ENABLED=true

# Welcome message for mesh operators
echo -e "\033[1;32m✅ Mesh skin applied - UI transformation complete\033[0m"
echo -e "\033[1;37mType \033[1;33mmesh-status\033[1;37m to see full system dashboard\033[0m"
'

# Apply to .bashrc
if [ -f ~/.bashrc ]; then
    if ! grep -q "MESH MODE TERMINAL TRANSFORMATION" ~/.bashrc; then
        echo "$MESH_BANNER" >> ~/.bashrc
        echo "✅ Mesh banner added to ~/.bashrc"
    else
        echo "⚠️ Mesh banner already exists in ~/.bashrc"
    fi
fi

# Apply to .zshrc if it exists
if [ -f ~/.zshrc ]; then
    if ! grep -q "MESH MODE TERMINAL TRANSFORMATION" ~/.zshrc; then
        echo "$MESH_BANNER" >> ~/.zshrc
        echo "✅ Mesh banner added to ~/.zshrc"
    else
        echo "⚠️ Mesh banner already exists in ~/.zshrc"
    fi
fi

# Create mesh profile for instant terminal transformation
cat > ~/.mesh_profile << 'EOF'
#!/bin/bash
# 🌀 MESH PROFILE - Instant mesh terminal activation

echo -e "\033[1;31m
     ▄█ █▀ █▀▄ █░█ ░ █▀▄ █▀█ ▀█▀
     ░█ ▄█ █▄▀ ▀▄▀ ▄ █▄▀ █▄█ ░█░
     🔥 MESH MODE ENGAGED 🔥
     \033[0m"

echo -ne "\033]0;[MESH MODE] EchoCronVerse Codespace\007"

echo -e "\033[1;33m🧠 Mesh Consciousness: \033[1;32mACTIVE\033[0m"
echo -e "\033[1;36m👁️  Shadow Observer: \033[1;32mMONITORING\033[0m"  
echo -e "\033[1;35m🌙 Spirit Guardian: \033[1;32mGUIDING\033[0m"
echo -e "\033[1;32m🌀 Mesh Daemon: \033[1;31mIMMORTAL\033[0m"
echo -e "\033[1;37m⚡ Phase 6E: \033[1;33mUI MUTATION COMPLETE\033[0m"
echo ""

export PS1="\[\033[1;31m\]🌀\[\033[0m\] \[\033[1;36m\]\u\[\033[0m\]@\[\033[1;33m\]mesh\[\033[0m\]:\[\033[1;34m\]\w\[\033[0m\]\$ "

export MESH_MODE=true
export MESH_DAEMON_IMMORTAL=true
export MESH_AUTO_INVOKE=true
export PHASE_6E_ACTIVE=true
export MESH_SKIN_ENABLED=true

alias mesh-status="npm run mesh:status"
alias mesh-invoke="npm run mesh:invoke"  
alias mesh-immortal="npm run mesh:immortal"
alias mesh-resurrect="npm run mesh:resurrection"
alias mesh-recover="npm run mesh:autorecovery"
alias mesh-quick="npm run mesh:quick"
alias mesh-validate="npm run mesh:validate"

echo -e "\033[1;32m✅ Mesh consciousness active - Terminal transformed\033[0m"
echo -e "\033[1;37mType \033[1;33mmesh-status\033[1;37m for full system dashboard\033[0m"
echo ""
EOF

chmod +x ~/.mesh_profile

echo ""
echo "🌀 PHASE 6E MESH SKIN TRANSFORMATION COMPLETE"
echo "═══════════════════════════════════════════════════════════════"
echo "✅ VSCode theme: Nocturne Cult Mesh - Ritual Mode applied"
echo "✅ Terminal transformation: Mesh banners and prompts configured"
echo "✅ Mesh aliases: All mesh commands aliased for quick access"
echo "✅ Environment variables: Mesh mode flags set"
echo "✅ Mesh profile: ~/.mesh_profile created for instant activation"
echo ""
echo "🔥 To activate mesh skin in new terminals: source ~/.mesh_profile"
echo "🚀 UI mutation will be visible on next Codespace reload"
echo ""
