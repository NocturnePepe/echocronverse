# 🤖 AI Development Guidelines for Echocronverse

## 🎯 **Production Delivery Mode - ACTIVE**

### ✅ **Core Principles**
- **No prototypes or placeholders** unless explicitly instructed
- **Complete or fallback-ready** components only
- **Always auto-check** for conflicting imports
- **Never repeat** `import React` if already declared
- **Respect forward progress** - no regressions unless explicit

---

## 📋 **Current Project State**

### **Phase Status**: Phase 3A Complete ✅
- ✅ Ritual-based navigation system
- ✅ Rune loader animations  
- ✅ Progressive unlock mechanics
- ✅ Persistent state management

### **Active Features**
- **Navigation Rituals**: EchoDex (7 clicks), CronoXai (10s meditation), Wallet (5 sigils)
- **Mystical Animations**: Rune loaders, cosmic effects, particle systems
- **State Persistence**: localStorage for ritual progress and unlocks

---

## 🗂 **Directory Standards**

```
/src
  /components
    /layout      ← Nav, Footer, core layout
    /ai          ← CronoXai terminal and AI logic
    /runes       ← Shared UI glyphs, sigils, mystical elements
    /lore        ← Lore blocks, faction content
    /ui          ← Pure UI components (buttons, modals, etc)
  /pages         ← Route components
  /stores        ← State management (navigation, memory)
  /hooks         ← Custom React hooks
  /context       ← React contexts
  /data          ← Constants, static lore JSON
  /assets        ← Images, fonts, static files
```

---

## 🔧 **Technical Standards**

### **Component Standards**
- ✅ Always export named + default export
- ✅ TypeScript interfaces for all props
- ✅ Error boundaries for user-facing errors
- ✅ No anonymous arrow components
- ✅ Consistent naming: PascalCase for components

### **Styling Standards**
- ✅ TailwindCSS utility classes preferred
- ✅ `*.module.css` for complex animations only
- ✅ Cosmic theme variables in `/data/theme.json`
- ✅ Dark theme by default, light mode optional

### **State Management**
- ✅ React Context for global state
- ✅ localStorage for persistence
- ✅ Error handling with try/catch blocks

---

## 🚀 **Phase Roadmap Reference**

### **Phase 3B - Next Priority**
- [ ] ChronoSigil NFT → "Temporal Echo Spirits" 
- [ ] Enhanced Wallet Summoning Ritual
- [ ] CronoXai Memory Persistence
- [ ] Hidden Dark Mode Easter Eggs

### **Phase 3C - Web3 Integration**  
- [ ] Real wallet connections (MetaMask, WalletConnect)
- [ ] On-chain DEX functionality
- [ ] AI API integration (OpenAI/custom LLM)
- [ ] Smart contract deployment

---

## 🎨 **Design Philosophy**

### **Cosmic Cult Aesthetic**
- **Colors**: Purple/indigo/cyan cosmic accents on black base
- **Typography**: Unbounded (headers), Orbitron (body), JetBrains Mono (terminal)
- **Motion**: Mystical, ethereal, runic animations
- **Symbols**: ⟐ ⟡ ⟢ ⟣ ⟤ ⟥ ⟦ ⟧ ◉

### **User Experience**
- **Progressive Disclosure**: Ritual unlocks reveal features
- **Persistent Memory**: System remembers user progress
- **Mystical Feedback**: Every interaction has cosmic meaning
- **Dark by Default**: Light mode as optional enhancement

---

## 🧪 **Testing Standards**

### **When Tests Are Added**
- **Unit Tests**: Jest + React Testing Library
- **E2E Tests**: Cypress or Playwright for ritual flows
- **Visual Tests**: Storybook for component isolation

---

## 💾 **Commit Standards**

### **Phase Tagging Required**
- `[Phase 3B]` - Current phase features
- `[Hotfix]` - Critical bug fixes
- `[Lore Update]` - Content/narrative changes
- `[Enhancement]` - UI/UX improvements
- `[Refactor]` - Code structure improvements

### **Example Commits**
```
[Phase 3B] Implement Temporal Echo Spirits NFT preview
[Hotfix] Fix ritual progress persistence bug
[Lore Update] Add Chrono Order faction content
[Enhancement] Improve rune loader animation performance
```

---

## 🔍 **Key Files Reference**

### **Always Check Before Editing**
- `summary.md` - Complete feature breakdown
- `master-plan.md` - Strategic roadmap and vision
- `src/stores/navigationStore.ts` - Ritual system state
- `src/components/Nav.tsx` - Navigation with unlock system
- `data/theme.json` - Design system constants

### **Never Remove Without Backup**
- Ritual unlock system
- Persistent state mechanisms  
- Navigation unlock progress
- CronoXai memory systems (when implemented)

---

*Last Updated: July 26, 2025*
*Status: Phase 3A Complete - Production Ready* 
*AI Mode: Production Delivery - No Prototypes*
