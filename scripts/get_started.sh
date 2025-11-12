#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
MAGENTA='\033[0;35m'
NC='\033[0m' # No Color

echo -e "${MAGENTA}╔══════════════════════════════════════════════════════════╗${NC}"
echo -e "${MAGENTA}║                                                          ║${NC}"
echo -e "${MAGENTA}║       🚀 LolTimeFlash Monorepo - Get Started 🚀         ║${NC}"
echo -e "${MAGENTA}║                                                          ║${NC}"
echo -e "${MAGENTA}╚══════════════════════════════════════════════════════════╝${NC}"
echo ""

# Get the root directory
ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

# Check if pnpm is installed
if ! command -v pnpm &> /dev/null; then
    echo -e "${RED}❌ pnpm is not installed!${NC}"
    echo -e "${YELLOW}📦 Installing pnpm globally...${NC}"
    npm install -g pnpm
    echo ""
fi

# Display Node/PNPM versions
echo -e "${BLUE}📊 Environment Check:${NC}"
echo -e "   ${CYAN}Node version:${NC}  $(node -v)"
echo -e "   ${CYAN}PNPM version:${NC}  $(pnpm -v)"
echo ""

# ============================================================================
# INSTALLATION
# ============================================================================
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}  📦 INSTALLING DEPENDENCIES${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

echo -e "${YELLOW}⏳ Installing workspace dependencies...${NC}"
pnpm install

if [ $? -eq 0 ]; then
    echo ""
    echo -e "${GREEN}✓ Dependencies installed successfully!${NC}"
else
    echo ""
    echo -e "${RED}❌ Installation failed!${NC}"
    exit 1
fi

# ============================================================================
# PROJECT STRUCTURE
# ============================================================================
echo ""
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}  📁 PROJECT STRUCTURE${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo -e "${CYAN}LolTimeFlash/${NC}"
echo -e "  ├── ${GREEN}apps/${NC}"
echo -e "  │   ├── ${YELLOW}web/${NC}         # Frontend Next.js 16"
echo -e "  │   └── ${YELLOW}api/${NC}         # Backend NestJS (à venir)"
echo -e "  └── ${GREEN}packages/${NC}"
echo -e "      ├── ${YELLOW}shared/${NC}      # Types partagés"
echo -e "      └── ${YELLOW}eslint-config/${NC} # Config ESLint"
echo ""

# ============================================================================
# AVAILABLE COMMANDS
# ============================================================================
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}  🎮 AVAILABLE COMMANDS${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

echo -e "${MAGENTA}🚀 Development:${NC}"
echo -e "   ${GREEN}pnpm dev${NC}              # Lance tous les services"
echo -e "   ${GREEN}pnpm dev:web${NC}          # Lance seulement le frontend"
echo -e "   ${GREEN}pnpm dev:api${NC}          # Lance seulement le backend (quand prêt)"
echo ""

echo -e "${MAGENTA}🏗️  Build:${NC}"
echo -e "   ${GREEN}pnpm build${NC}            # Build tous les apps"
echo -e "   ${GREEN}pnpm build:web${NC}        # Build seulement le frontend"
echo -e "   ${GREEN}pnpm build:api${NC}        # Build seulement le backend"
echo ""

echo -e "${MAGENTA}🔍 Code Quality:${NC}"
echo -e "   ${GREEN}pnpm lint${NC}             # Lint tous les apps"
echo -e "   ${GREEN}pnpm lint:fix${NC}         # Fix les erreurs de lint"
echo -e "   ${GREEN}pnpm format${NC}           # Format le code avec Prettier"
echo -e "   ${GREEN}pnpm type-check${NC}       # Vérification TypeScript"
echo ""

echo -e "${MAGENTA}🧪 Testing:${NC}"
echo -e "   ${GREEN}pnpm test${NC}             # Lance tous les tests"
echo ""

echo -e "${MAGENTA}🧹 Maintenance:${NC}"
echo -e "   ${GREEN}pnpm clean${NC}            # Nettoie tous les caches"
echo -e "   ${GREEN}pnpm get_started${NC}      # Relance ce script"
echo ""

# ============================================================================
# SERVICE URLS
# ============================================================================
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}  🌐 SERVICE URLS (après 'pnpm dev')${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo -e "${CYAN}Frontend (Next.js):${NC}"
echo -e "   ${GREEN}http://localhost:3000${NC}"
echo -e "   ${YELLOW}→ Interface utilisateur${NC}"
echo ""
echo -e "${CYAN}Backend (NestJS):${NC}"
echo -e "   ${GREEN}http://localhost:4000${NC} ${YELLOW}(à venir)${NC}"
echo -e "   ${YELLOW}→ API + Socket.IO${NC}"
echo ""

# ============================================================================
# NEXT STEPS
# ============================================================================
echo -e "${GREEN}╔══════════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║                                                          ║${NC}"
echo -e "${GREEN}║           ✨ Setup Complete! Ready to go! ✨            ║${NC}"
echo -e "${GREEN}║                                                          ║${NC}"
echo -e "${GREEN}╚══════════════════════════════════════════════════════════╝${NC}"
echo ""
echo -e "${YELLOW}📝 Next steps:${NC}"
echo -e "   ${BLUE}1.${NC} Run ${GREEN}pnpm dev${NC} to start all services"
echo -e "   ${BLUE}2.${NC} Open ${GREEN}http://localhost:3000${NC} in your browser"
echo -e "   ${BLUE}3.${NC} Check ${CYAN}MIGRATION_MONOREPO.md${NC} for migration guide"
echo ""
echo -e "${CYAN}Happy coding! 🎮⚡${NC}"
echo ""

