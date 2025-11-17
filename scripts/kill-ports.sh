#!/bin/bash

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Ports to kill
API_PORT=8888
WEB_PORT=6333

echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}  🔫 Killing processes on ports ${API_PORT} and ${WEB_PORT}${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

# Function to kill process on a specific port
kill_port() {
  local port=$1
  local name=$2
  
  # Find process ID(s) using the port
  local pids=$(lsof -ti :$port 2>/dev/null)
  
  if [ -z "$pids" ]; then
    echo -e "${YELLOW}ℹ${NC}  No process found on port ${BLUE}$port${NC} ($name)"
  else
    echo -e "${BLUE}ℹ${NC}  Found process(es) on port ${BLUE}$port${NC} ($name): ${YELLOW}$pids${NC}"
    
    # Kill each process
    for pid in $pids; do
      kill -9 $pid 2>/dev/null
      if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅${NC} Killed process ${YELLOW}$pid${NC} on port ${BLUE}$port${NC}"
      else
        echo -e "${RED}❌${NC} Failed to kill process ${YELLOW}$pid${NC} on port ${BLUE}$port${NC}"
      fi
    done
  fi
}

# Kill API port
kill_port $API_PORT "API"

# Kill Web port
kill_port $WEB_PORT "Web"

echo ""
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}✨ Done!${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

