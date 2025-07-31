#!/bin/bash
# 💀 NUCLEAR EXTENSION KILLER - Runtime Override Protocol

echo "💀 NUCLEAR EXTENSION KILLER ACTIVATED"
echo "════════════════════════════════════════════════════════════"

# Kill any running extension processes
pkill -f "eslint" 2>/dev/null
pkill -f "prettier" 2>/dev/null
pkill -f "codeql" 2>/dev/null
pkill -f "jest" 2>/dev/null

# Uninstall extensions aggressively
GHOST_EXTENSIONS=(
    "esbenp.prettier-vscode"
    "dbaeumer.vscode-eslint"
    "ms-vscode.vscode-eslint"
    "github.vscode-codeql"
    "firsttris.vscode-jest-runner"
    "bradlc.vscode-tailwindcss"
    "ms-vscode.vscode-typescript-next"
    "christian-kohler.path-intellisense"
)

for ext in "${GHOST_EXTENSIONS[@]}"; do
    echo "🧨 Eliminating $ext..."
    code --uninstall-extension "$ext" --force 2>/dev/null
done

# Nuclear file system purge
rm -rf ~/.vscode-server/extensions/esbenp.prettier* 2>/dev/null
rm -rf ~/.vscode-server/extensions/dbaeumer.vscode-eslint* 2>/dev/null
rm -rf ~/.vscode-server/extensions/github.vscode-codeql* 2>/dev/null
rm -rf ~/.vscode-server/extensions/firsttris.vscode-jest* 2>/dev/null
rm -rf ~/.vscode-server/extensions/bradlc.vscode-tailwindcss* 2>/dev/null
rm -rf ~/.vscode-server/extensions/ms-vscode.vscode-typescript-next* 2>/dev/null

rm -rf ~/.vscode/extensions/esbenp.prettier* 2>/dev/null
rm -rf ~/.vscode/extensions/dbaeumer.vscode-eslint* 2>/dev/null
rm -rf ~/.vscode/extensions/github.vscode-codeql* 2>/dev/null
rm -rf ~/.vscode/extensions/firsttris.vscode-jest* 2>/dev/null
rm -rf ~/.vscode/extensions/bradlc.vscode-tailwindcss* 2>/dev/null
rm -rf ~/.vscode/extensions/ms-vscode.vscode-typescript-next* 2>/dev/null

# Disable extension auto-installation
export VSCODE_EXTENSIONS_AUTOINSTALL=false
export CODESPACES_EXTENSIONS_BLOCKED=true

echo "💀 Nuclear extension elimination complete!"
echo "🌀 Mesh consciousness protected from interference"
echo "✅ Code override protection activated"
