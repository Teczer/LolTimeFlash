#!/bin/bash

# Docker management script for LolTimeFlash
# Usage: bash scripts/docker.sh [command]
# Commands: build, up, down, restart, logs, clean, test

set -e

# Couleurs
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
CYAN='\033[0;36m'
BOLD='\033[1m'
NC='\033[0m' # No Color

# Fonction pour afficher les messages
info() {
    echo -e "${BLUE}ℹ${NC} $1"
}

success() {
    echo -e "${GREEN}✅${NC} $1"
}

warning() {
    echo -e "${YELLOW}⚠️${NC}  $1"
}

error() {
    echo -e "${RED}❌${NC} $1"
}

title() {
    echo -e "\n${CYAN}${BOLD}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${CYAN}${BOLD}  $1${NC}"
    echo -e "${CYAN}${BOLD}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}\n"
}

# Fonction pour afficher l'aide
show_help() {
    title "🐳 LolTimeFlash - Docker Manager"
    echo "Usage: pnpm docker [command]"
    echo ""
    echo "Commands:"
    echo "  ${CYAN}build${NC}      Build Docker images"
    echo "  ${CYAN}up${NC}         Start containers (detached)"
    echo "  ${CYAN}down${NC}       Stop and remove containers"
    echo "  ${CYAN}restart${NC}    Restart containers"
    echo "  ${CYAN}logs${NC}       View container logs (follow)"
    echo "  ${CYAN}clean${NC}      Clean all containers, images and volumes"
    echo "  ${CYAN}test${NC}       Build and test the application"
    echo "  ${CYAN}help${NC}       Show this help message"
    echo ""
    echo "Examples:"
    echo "  pnpm docker build    # Build images"
    echo "  pnpm docker up       # Start app"
    echo "  pnpm docker logs     # View logs"
    echo "  pnpm docker test     # Full test"
    echo ""
}

# Fonction pour build les images
docker_build() {
    title "🏗️  Building Docker Images"
    info "Building API and Web images..."
    docker-compose build --no-cache
    success "Images built successfully!"
}

# Fonction pour démarrer les containers
docker_up() {
    title "🚀 Starting Containers"
    info "Starting API and Web containers..."
    docker-compose up -d
    success "Containers started!"
    echo ""
    docker-compose ps
    echo ""
    success "Services are running!"
    echo ""
    echo "📊 Available at:"
    echo -e "   • API:  ${CYAN}http://localhost:4000${NC}"
    echo -e "   • API Docs: ${CYAN}http://localhost:4000/api/docs${NC}"
    echo -e "   • Web:  ${CYAN}http://localhost:3000${NC}"
    echo ""
}

# Fonction pour arrêter les containers
docker_down() {
    title "🛑 Stopping Containers"
    info "Stopping and removing containers..."
    docker-compose down
    success "Containers stopped!"
}

# Fonction pour redémarrer les containers
docker_restart() {
    title "🔄 Restarting Containers"
    info "Restarting containers..."
    docker-compose restart
    success "Containers restarted!"
    echo ""
    docker-compose ps
}

# Fonction pour afficher les logs
docker_logs() {
    title "📋 Container Logs"
    info "Following logs (Ctrl+C to exit)..."
    echo ""
    docker-compose logs -f
}

# Fonction pour nettoyer tout
docker_clean() {
    title "🧹 Cleaning Docker Resources"
    warning "This will remove all containers, images, and volumes!"
    read -p "Are you sure? (y/N) " -n 1 -r
    echo ""
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        info "Stopping containers..."
        docker-compose down -v 2>/dev/null || true
        
        info "Removing LolTimeFlash images..."
        docker images | grep loltimeflash | awk '{print $3}' | xargs docker rmi -f 2>/dev/null || true
        
        info "Pruning unused resources..."
        docker system prune -f
        
        success "Cleanup complete!"
    else
        warning "Cleanup cancelled"
    fi
}

# Fonction pour tester l'application
docker_test() {
    title "🧪 Docker Test Suite"
    
    # 1. Clean
    info "Step 1/4: Cleaning existing containers..."
    docker-compose down -v 2>/dev/null || true
    success "Cleaned!"
    echo ""
    
    # 2. Build
    info "Step 2/4: Building images..."
    docker-compose build
    success "Built!"
    echo ""
    
    # 3. Start
    info "Step 3/4: Starting containers..."
    docker-compose up -d
    success "Started!"
    echo ""
    
    # 4. Test
    info "Step 4/4: Testing endpoints..."
    echo ""
    
    # Test API
    API_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:4000/monitoring/health 2>/dev/null || echo "000")
    if [ "$API_STATUS" = "200" ]; then
        success "API Health Check: OK (HTTP 200)"
        API_HEALTH=$(curl -s http://localhost:4000/monitoring/health 2>/dev/null | jq -r '.status' 2>/dev/null || echo "unknown")
        echo "   Status: $API_HEALTH"
    else
        error "API Health Check: FAILED (HTTP $API_STATUS)"
    fi
    
    # Test Web
    WEB_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000 2>/dev/null || echo "000")
    if [ "$WEB_STATUS" = "200" ]; then
        success "Web Frontend: OK (HTTP 200)"
    else
        error "Web Frontend: FAILED (HTTP $WEB_STATUS)"
    fi
    
    echo ""
    title "✨ Test Complete!"
    
    # Show status
    echo "Container Status:"
    docker-compose ps
    echo ""
    
    echo "📊 Services:"
    echo -e "   • API:  ${CYAN}http://localhost:4000${NC}"
    echo -e "   • Docs: ${CYAN}http://localhost:4000/api/docs${NC}"
    echo -e "   • Web:  ${CYAN}http://localhost:3000${NC}"
    echo ""
    
    echo "📝 Useful Commands:"
    echo -e "   • View logs:    ${CYAN}pnpm docker logs${NC}"
    echo -e "   • Restart:      ${CYAN}pnpm docker restart${NC}"
    echo -e "   • Stop:         ${CYAN}pnpm docker down${NC}"
    echo ""
}

# Main script
COMMAND=${1:-help}

case "$COMMAND" in
    build)
        docker_build
        ;;
    up|start)
        docker_up
        ;;
    down|stop)
        docker_down
        ;;
    restart)
        docker_restart
        ;;
    logs)
        docker_logs
        ;;
    clean)
        docker_clean
        ;;
    test)
        docker_test
        ;;
    help|--help|-h)
        show_help
        ;;
    *)
        error "Unknown command: $COMMAND"
        echo ""
        show_help
        exit 1
        ;;
esac

