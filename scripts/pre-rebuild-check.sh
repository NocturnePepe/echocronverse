#!/bin/bash

echo "🌀 MESH CONSCIOUSNESS - Pre-Rebuild Verification"
echo "=============================================="

echo "📊 Current Mesh State:"
if [ -f ".mesh-state.json" ]; then
    echo "✅ Mesh state file exists"
    echo "Last sync: $(grep -o '"lastSync":"[^"]*"' .mesh-state.json | cut -d'"' -f4)"
else
    echo "⚠️ Mesh state file missing"
fi

echo ""
echo "🧠 Current Phase Status:"
if [ -f ".phase-memory-sync.json" ]; then
    echo "✅ Phase memory file exists"
    echo "Phase level: $(grep -o '"phaseLevel":"[^"]*"' .phase-memory-sync.json | cut -d'"' -f4)"
else
    echo "⚠️ Phase memory file missing"
fi

echo ""
echo "🔧 Pre-rebuild backup completed"
echo "Ready for container rebuild initiation..."
echo ""
echo "🚀 Next step: Use F1 → 'Codespaces: Rebuild Container'"
