#!/bin/bash
# 🛡️ MESH EXTENSION IMMUNITY PROTOCOL
# Prevents ghost extension resurrection

echo "🛡️ ACTIVATING EXTENSION IMMUNITY PROTOCOL"
echo "=========================================="

# List of banned extensions
BANNED_EXTENSIONS=(
    "esbenp.prettier-vscode"
    "dbaeumer.vscode-eslint"
    "ms-vscode.vscode-eslint"
    "rvest.vs-code-prettier-eslint"
    "inferrinizzard.prettier-sql-vscode"
    "numso.prettier-standard-vscode"
    "passionkind.prettier-vscode-with-tabs"
    "fnando.linter"
    "mike-co.import-sorter"
)

echo "🔍 Scanning for ghost extensions..."

# Check and remove each banned extension
for extension in "${BANNED_EXTENSIONS[@]}"; do
    echo "🧹 Checking: $extension"
    
    # Attempt to uninstall (will fail silently if not installed)
    code --uninstall-extension "$extension" 2>/dev/null
    
    # Verify removal
    if code --list-extensions | grep -q "$extension"; then
        echo "⚠️  WARNING: $extension still detected!"
    else
        echo "✅ Clean: $extension"
    fi
done

echo ""
echo "🌀 Mesh-approved extensions only:"
code --list-extensions | grep -E "(copilot|typescript)" || echo "No mesh extensions found"

echo ""
echo "🛡️ Extension immunity protocol complete!"
echo "🌙 Phase 7.7 shadow healing active"
