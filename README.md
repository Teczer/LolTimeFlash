# ⏰ LolTimeFlash

<div align="center">

**League of Legends Website Tool: Easily Time and Communicate Summoner Spells - THE FLASH! 🌟**

[![Next.js](https://img.shields.io/badge/Next.js-14.1.4-black?style=flat&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![Socket.IO](https://img.shields.io/badge/Socket.IO-4.7.5-010101?style=flat&logo=socket.io)](https://socket.io/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.3.0-38B2AC?style=flat&logo=tailwind-css)](https://tailwindcss.com/)

[Features](#-features) • [Quick Start](#-quick-start) • [How It Works](#-how-it-works) • [Documentation](#-documentation)

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
- pnpm (recommended) or npm

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/LolTimeFlash.git
cd LolTimeFlash

# Install dependencies
pnpm install

# Set up environment variables
echo "NEXT_PUBLIC_SOCKET_PORT=your_socket_server_url" > .env.local

# Run the development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Docker Deployment

```bash
# Build and run with Docker Compose
docker-compose up --build

# Access at http://localhost:6333
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

- **Frontend**: Next.js 14.1.4 (App Router), TypeScript, Tailwind CSS
- **State Management**: Zustand, TanStack Query
- **Real-time**: Socket.IO (client + server)
- **UI Components**: Radix UI, React Icons
- **API**: Data Dragon (Riot Games official API)
- **Deployment**: Docker, Node.js Alpine

---

## 📁 Project Structure

```
LolTimeFlash/
├── app/                    # Next.js App Router
│   ├── api/               # API routes (Shieldbow/Riot API)
│   ├── game/              # Game pages (solo + multiplayer)
│   ├── lobby/             # Room creation/joining
│   ├── settings/          # Username management
│   └── store/             # Zustand state stores
├── components/            # React components
│   ├── ui/               # UI component library
│   ├── QueryProvider/    # React Query setup
│   └── UsernameProvider/ # Auth gate component
├── lib/                   # Utilities and types
├── public/               # Static assets (icons, audio)
└── docker-compose.yml    # Docker configuration
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

## 🐛 Known Issues

- Socket.IO server not included in repository (separate deployment required)
- Mobile background customization disabled
- Champion data loading can be slow on first request (24h cache afterward)

See [AGENTS.md](./AGENTS.md#-known-issues--future-improvements) for full list and planned improvements.

---

## 📝 Environment Variables

Create a `.env.local` file:

```env
NEXT_PUBLIC_SOCKET_PORT=http://your-socket-server:port
```

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

**Built with ❤️ by the League of Legends community**

⭐ Star this repo if you find it helpful!

</div>
