# ⏰ LolTimeFlash

<div align="center">

**League of Legends Website Tool: Easily Time and Communicate Summoner Spells - THE FLASH! 🌟**

[![Version](https://img.shields.io/badge/version-2.3.2-brightgreen?style=flat)](https://github.com/yourusername/LolTimeFlash/releases)
[![Next.js](https://img.shields.io/badge/Next.js-16.0.1-black?style=flat&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7.2-blue?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![Socket.IO](https://img.shields.io/badge/Socket.IO-4.8.1-010101?style=flat&logo=socket.io)](https://socket.io/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.3.0-38B2AC?style=flat&logo=tailwind-css)](https://tailwindcss.com/)
[![NestJS](https://img.shields.io/badge/NestJS-11.0-E0234E?style=flat&logo=nestjs)](https://nestjs.com/)

[Demo](#-demo) • [Features](#-features) • [Quick Start](#-quick-start) • [How It Works](#-how-it-works) • [Documentation](#-documentation)

</div>

---

## 🎬 Demo

<div align="center">

<!-- Replace this comment with your demo GIF/video -->
<!-- Example: ![LolTimeFlash Demo](./docs/demo.gif) -->
<!-- Or embed a video: [![Demo Video](./docs/thumbnail.png)](https://your-video-url.com) -->

![loltimeflash-demo-ezgif com-video-to-gif-converter](https://github.com/user-attachments/assets/5b0b68e7-f13e-4d8c-8e78-1456a014b401)

_Showcase the real-time Flash tracking, multiplayer synchronization, and customizable backgrounds_

</div>

---

## 🎯 What is LolTimeFlash?

**LolTimeFlash** is a real-time collaborative web application for League of Legends players to track enemy summoner spell cooldowns during gameplay. Create or join rooms with your teammates to monitor Flash timers across all 5 enemy roles and coordinate your ganks perfectly!

### 🌟 Key Features

- ⏱️ **Real-time Flash Tracking** - Monitor Flash cooldowns for TOP, JUNGLE, MID, ADC, and SUPPORT
- 🧮 **Automatic Cooldown Calculation** - Accounts for Lucidity Boots and Cosmic Insight rune
- 🔄 **Live Synchronization** - All room members see updates instantly via WebSocket
- 👥 **Multiplayer Rooms** - Create/join rooms with unique 10-character codes
- 🎨 **Customizable Backgrounds** - Choose from 100+ champion splash arts
- 🔊 **Audio Notifications** - Get notified when enemy Flash is used
- 📱 **Responsive Design** - Works perfectly on desktop and mobile
- 🎮 **Solo Mode** - Practice timing without multiplayer

---

## 🚀 Quick Start

### Prerequisites

- Node.js 20.9.0 or higher
- pnpm 9.10.0 or higher (recommended) or npm

### Local Development

```bash
# Clone the repository
git clone https://github.com/yourusername/LolTimeFlash.git
cd LolTimeFlash

# Install dependencies
pnpm get_started

# Set up environment variables
cp .env.example .env  # Configure your environment

# Run development servers (API + Web)
pnpm dev

# API: http://localhost:8888
# Web: http://localhost:6333
```

### Docker Deployment (Recommended)

```bash
# Quick start - build and run
pnpm docker:test

# Or manually
pnpm docker:build   # Build images
pnpm docker:up      # Start containers
pnpm docker:logs    # View logs
pnpm docker:down    # Stop containers

# Access:
# - Frontend: http://localhost:6333
# - API Health: http://localhost:8888/monitoring/health
```

---

## 🎮 How It Works

### Flash Cooldown Calculations

LolTimeFlash automatically calculates Flash cooldowns based on enemy items and runes:

| Configuration      | Cooldown    | Reduction |
| ------------------ | ----------- | --------- |
| **Base**           | 5:00 (300s) | -         |
| **Lucidity Boots** | 4:28 (268s) | -32s      |
| **Cosmic Insight** | 4:15 (255s) | -45s      |
| **Both**           | 3:51 (231s) | -69s      |

### Multiplayer Flow

1. **Create/Join Room** - Generate or enter a 10-character room code
2. **Set Username** - Identify yourself to teammates
3. **Track Flashes** - Click role icons when enemy uses Flash
4. **Sync with Team** - All changes sync in real-time
5. **Get Notified** - Audio + toast notifications for all team members

---

## 🛠️ Tech Stack

### Frontend (Next.js)

- **Framework**: Next.js 16.0.1 (App Router + Turbopack)
- **Language**: TypeScript 5.7.2
- **Styling**: Tailwind CSS 3.4.17
- **State**: Zustand 5.0.8, TanStack Query 5.90.8
- **Real-time**: Socket.IO Client 4.8.1
- **UI**: Radix UI, React Icons

### Backend (NestJS)

- **Framework**: NestJS 11.0 (Monorepo Architecture)
- **Real-time**: Socket.IO Server 4.8.1
- **Logging**: Winston with daily rotation
- **API**: Riot Games Data Dragon integration

### Deployment

- **Containerization**: Docker + Docker Compose
- **Base Image**: Node 20.9.0 Alpine
- **Package Manager**: pnpm 9.10.0
- **Monorepo**: Turborepo for builds

---

## 📁 Project Structure

```
LolTimeFlash/
├── apps/
│   ├── api/                      # NestJS Backend
│   │   ├── src/
│   │   │   ├── game/            # Game logic & WebSocket gateway
│   │   │   ├── room/            # Room management service
│   │   │   ├── riot/            # Riot API integration
│   │   │   ├── monitoring/      # Health checks & metrics
│   │   │   └── logger/          # Winston logging
│   │   ├── libs/shared/         # NestJS internal library
│   │   │   ├── types/           # Shared TypeScript types
│   │   │   └── constants/       # Shared constants
│   │   └── Dockerfile
│   │
│   └── web/                      # Next.js Frontend
│       ├── app/                  # App Router pages
│       ├── components/           # React components
│       ├── features/             # Feature modules
│       ├── hooks/                # Custom hooks
│       ├── lib/                  # Utils & config
│       ├── public/               # Static assets
│       └── Dockerfile
│
├── packages/
│   └── shared/                   # Shared types wrapper
│
├── scripts/                      # Build & sync scripts
├── docker-compose.yml            # Docker orchestration
└── turbo.json                    # Turborepo config
```

---

## 🎨 Features in Detail

### Real-time Synchronization

All room members see updates instantly when anyone:

- Clicks a Flash button
- Toggles Lucidity Boots or Cosmic Insight
- Cancels a timer

### Smart Timer Management

- **Click once**: Start Flash cooldown
- **Click during countdown**: Cancel timer (Flash is back)
- **Visual feedback**: Darkened icon + MM:SS timer overlay

### Customization

- Choose from all League of Legends champion splash arts
- Search champions by name
- Background persists across sessions

---

## 📖 Documentation

For detailed documentation including architecture, API routes, component structure, and development guidelines, see [AGENTS.md](./AGENTS.md).

### Quick Links

- [Architecture Overview](./AGENTS.md#-architecture)
- [Game Mechanics](./AGENTS.md#-game-mechanics)
- [Socket Events](./AGENTS.md#-real-time-communication-flow)
- [Deployment Guide](./AGENTS.md#-deployment)

---

## 🤝 Contributing

Contributions are welcome! Please read our [Contributing Guidelines](./AGENTS.md#-contributing-guidelines) before submitting a PR.

### Development Workflow

```bash
# Create feature branch
git checkout -b feature/your-feature

# Make changes and test
pnpm dev

# Build for production
pnpm build

# Submit PR
```

---

## 📝 Environment Variables

Create a `.env` file at the root:

```env
# API Configuration
PORT=8888
NODE_ENV=development
LOG_LEVEL=info

# Frontend Configuration
NEXT_PUBLIC_SOCKET_PORT=http://localhost:8888
NEXT_PUBLIC_API_URL=http://localhost:8888
```

See [AGENTS.md](./AGENTS.md#-known-issues--future-improvements) for advanced configuration.

---

## 📄 License

This project is a fan-made tool for League of Legends players. League of Legends and all associated properties are trademarks or registered trademarks of Riot Games, Inc.

---

## 🌐 Links

- **Documentation**: [AGENTS.md](./AGENTS.md)
- **Riot Developer Portal**: [developer.riotgames.com](https://developer.riotgames.com/)
- **Next.js Docs**: [nextjs.org/docs](https://nextjs.org/docs)
- **Socket.IO Docs**: [socket.io/docs](https://socket.io/docs)

---

<div align="center">

**Built with ❤️ by me**

⭐ Star this repo if you find it helpful!

</div>
