# AGENTS.md - LolTimeFlash Project Documentation

> **⚠️ IMPORTANT - Pour les agents/développeurs :**  
> **NE PAS créer de fichiers .md supplémentaires** (CHANGELOG.md, MIGRATION.md, QUICKSTART.md, etc.).  
> Toute la documentation doit rester centralisée dans ce fichier AGENTS.md et README.md uniquement.

---

## 📋 Project Overview

**LolTimeFlash** is a real-time web application designed for League of Legends players to track and communicate summoner spell cooldowns (especially Flash) during gameplay. The application enables players to create or join rooms where they can collaboratively monitor enemy summoner spell timers and coordinate ganks with their team.

### Key Features

- ⏰ Real-time Flash cooldown tracking for all 5 enemy roles (TOP, JUNGLE, MID, ADC, SUPPORT)
- 🎯 Automatic cooldown calculation based on Lucidity Boots and Cosmic Insight rune
- 🔄 Live synchronization across all room members via WebSocket
- 🎨 Customizable background with League of Legends champion splash arts
- 👤 Username management and room-based multiplayer
- 🔊 Audio notifications when enemy Flash is used
- 📱 Responsive design for desktop and mobile

---

## 🏗️ Architecture

### Overview

LolTimeFlash est une **application monorepo** composée d'un backend NestJS et d'un frontend Next.js qui communiquent en temps réel via WebSocket.

### Tech Stack

#### Frontend (Next.js)

- **Framework**: Next.js 16.0.1 (App Router + Turbopack)
- **Language**: TypeScript 5.7.2
- **Styling**:
  - Tailwind CSS 3.4.17
  - Custom CSS variables for theming
  - Radix UI components
- **State Management**:
  - Zustand 5.0.8 (global state with persistence)
  - React Query (TanStack Query 5.90.8) for server state
- **Real-time Communication**: Socket.IO Client 4.8.1
- **UI Components**:
  - Radix UI (Dialog, Toast, Sheet)
  - Custom UI components library
- **Icons**: React Icons 5.5.0
- **Port**: 6333

#### Backend (NestJS)

- **Framework**: NestJS 11.0 (Monorepo with internal libraries)
- **Language**: TypeScript 5.7.3
- **Real-time**: Socket.IO Server 4.8.1 (WebSocket Gateway)
- **Logging**: Winston 3.18.3 with daily file rotation
- **Validation**: class-validator + class-transformer
- **API Documentation**: Swagger (NestJS OpenAPI)
- **Monitoring**: Health checks endpoint + metrics
- **Port**: 8888

#### Shared Types

- **Location**: `apps/api/libs/shared` (source of truth)
- **Wrapper**: `packages/shared` (for Next.js compatibility)
- **Architecture**: NestJS internal library accessible par les deux apps

#### Deployment

- **Containerization**: Docker + Docker Compose (multi-stage builds)
- **Base Image**: Node 20.9.0 Alpine
- **Package Manager**: pnpm 9.10.0
- **Build System**: Turborepo for parallel builds
- **CI/CD Ready**: Optimized Dockerfiles with layer caching

---

## 📁 Project Structure

```
LolTimeFlash/                       # Monorepo Root
│
├── apps/                           # Applications
│   ├── api/                        # NestJS Backend
│   │   ├── src/
│   │   │   ├── game/              # Game Module
│   │   │   │   ├── game.gateway.ts    # WebSocket Gateway
│   │   │   │   ├── game.service.ts    # Game business logic
│   │   │   │   ├── game.module.ts     # Module definition
│   │   │   │   └── dto/              # Data Transfer Objects
│   │   │   ├── room/              # Room Management Module
│   │   │   │   ├── room.service.ts    # Room state management
│   │   │   │   └── room.module.ts     # Module definition
│   │   │   ├── riot/              # Riot API Module
│   │   │   │   ├── riot.service.ts    # Data Dragon integration
│   │   │   │   ├── riot.controller.ts # REST endpoints
│   │   │   │   └── riot.module.ts     # Module definition
│   │   │   ├── monitoring/        # Monitoring Module
│   │   │   │   ├── metrics.service.ts # Metrics collection
│   │   │   │   ├── monitoring.controller.ts # Health checks
│   │   │   │   └── monitoring.module.ts
│   │   │   ├── logger/            # Logger Module
│   │   │   │   ├── logger.service.ts  # Winston logger
│   │   │   │   └── logger.module.ts
│   │   │   ├── app.module.ts      # Root module
│   │   │   └── main.ts            # Application entry point
│   │   │
│   │   ├── libs/                  # NestJS Internal Libraries
│   │   │   └── shared/            # 🔑 SOURCE DE VÉRITÉ
│   │   │       ├── src/
│   │   │       │   ├── types/     # Shared TypeScript types
│   │   │       │   │   ├── game.types.ts
│   │   │       │   │   ├── socket.types.ts
│   │   │       │   │   ├── champion.types.ts
│   │   │       │   │   ├── riot-api.types.ts
│   │   │       │   │   └── index.ts
│   │   │       │   ├── constants/ # Shared constants
│   │   │       │   │   ├── roles.ts
│   │   │       │   │   ├── cooldowns.ts
│   │   │       │   │   └── index.ts
│   │   │       │   ├── shared.module.ts
│   │   │       │   └── index.ts
│   │   │       └── tsconfig.lib.json
│   │   │
│   │   ├── test/                  # E2E tests
│   │   ├── logs/                  # Winston log files
│   │   ├── Dockerfile             # API Docker build
│   │   ├── nest-cli.json          # NestJS CLI config (monorepo mode)
│   │   ├── tsconfig.json          # TypeScript config (@app/shared alias)
│   │   ├── tsconfig.app.json      # App-specific TS config
│   │   └── package.json           # API dependencies
│   │
│   └── web/                       # Next.js Frontend
│       ├── app/                   # Next.js App Router
│       │   ├── game/             # Game pages
│       │   │   ├── [roomId]/page.tsx  # Multiplayer room
│       │   │   └── page.tsx           # Solo mode
│       │   ├── lobby/page.tsx    # Create/Join lobby
│       │   ├── settings/page.tsx # User settings
│       │   ├── store/            # Zustand stores
│       │   │   └── background-image.store.ts
│       │   ├── socket.ts         # Socket.IO client
│       │   ├── layout.tsx        # Root layout
│       │   ├── page.tsx          # Home page
│       │   └── globals.css       # Global styles
│       │
│       ├── components/           # Shared components
│       │   ├── ui/              # UI primitives
│       │   ├── layout/          # Layout components
│       │   ├── providers/       # Context providers
│       │   └── error-boundary.component.tsx
│       │
│       ├── features/            # Feature modules
│       │   ├── game/
│       │   │   ├── components/  # Game-specific components
│       │   │   ├── contexts/    # Game context
│       │   │   ├── hooks/       # Game hooks
│       │   │   ├── screens/     # Game screens
│       │   │   ├── types/       # Game types
│       │   │   └── constants/   # Game constants
│       │   └── settings/
│       │       └── components/  # Settings components
│       │
│       ├── hooks/               # Global hooks
│       │   ├── use-socket.hook.ts
│       │   ├── use-toast.hook.ts
│       │   └── use-media-query.hook.ts
│       │
│       ├── lib/                 # Utilities
│       │   ├── config.ts        # App configuration
│       │   ├── utils.ts         # Helper functions
│       │   └── riot-api.service.ts
│       │
│       ├── public/              # Static assets
│       │   ├── assets/          # Icons, images
│       │   ├── champions/       # Champion splash arts (2000+ files)
│       │   └── flash-song.mp3   # Audio notification
│       │
│       ├── Dockerfile           # Web Docker build
│       ├── next.config.mjs      # Next.js config
│       ├── tailwind.config.ts   # Tailwind config
│       ├── tsconfig.json        # TypeScript config
│       └── package.json         # Web dependencies
│
├── packages/                    # Shared packages
│   └── shared/                  # 🔗 Wrapper pour Next.js
│       ├── src/
│       │   └── index.ts        # Re-exports depuis apps/api/libs/shared
│       └── package.json         # Package definition
│
├── scripts/                     # Build & maintenance scripts
│   ├── sync-champions.ts       # Download champion data
│   ├── docker.sh               # Docker helper scripts
│   └── clean.sh                # Cleanup script
│
├── docker-compose.yml          # Docker orchestration
├── Dockerfile                  # (obsolète - supprimé)
├── turbo.json                  # Turborepo configuration
├── pnpm-workspace.yaml         # pnpm workspace definition
├── pnpm-lock.yaml              # Lock file
├── package.json                # Root package (scripts + devDeps)
├── tsconfig.base.json          # Base TypeScript config
├── .dockerignore               # Docker build optimization
└── AGENTS.md                   # Cette documentation
```

---

## 🔄 Shared Types Architecture

### Flux des Types

```
apps/api/libs/shared/src/types/      ← 🔑 SOURCE DE VÉRITÉ
        ↓
        ↓ (import direct via @app/shared)
        ↓
apps/api/src/**/*.ts                  ← Backend NestJS
        ↓
        ↓ (re-export via packages/shared)
        ↓
apps/web/**/*.tsx                     ← Frontend Next.js
        (import via @loltimeflash/shared)
```

### Pourquoi cette architecture ?

**Problème** : Next.js (webpack) ne peut pas résoudre les alias NestJS (`@app/shared`)

**Solution** : Wrapper transparent dans `packages/shared`

```typescript
// apps/api/src/**/*.ts (Backend)
import { Role, GameState } from '@app/shared'

// apps/web/**/*.tsx (Frontend)
import { Role, GameState } from '@loltimeflash/shared'

// Les deux utilisent LES MÊMES types ! ✅
```

### Types Partagés Disponibles

**Location**: `apps/api/libs/shared/src/types/`

- `game.types.ts` - GameData, SummonerData, RoleData
- `socket.types.ts` - ClientToServerEvents, ServerToClientEvents
- `champion.types.ts` - ChampionData, SplashArt
- `riot-api.types.ts` - RiotAPIResponse, DDragonData

**Constants**: `apps/api/libs/shared/src/constants/`

- `roles.ts` - ROLES array, Role type
- `cooldowns.ts` - FLASH_COOLDOWN, CDR calculations

---

## 🔑 Key Components

### 1. **Backend - NestJS Gateway** (`apps/api`)

#### **GameGateway** - WebSocket Hub

**Location**: `apps/api/src/game/game.gateway.ts`

**Purpose**: Gère toutes les communications WebSocket temps réel

**Key Features**:

- **Connection Handling**: Authentification et tracking des clients
- **Room Management**: Join/leave rooms avec isolation
- **Event Broadcasting**: Synchronisation état du jeu
- **Error Handling**: Gestion gracieuse des déconnexions

**Socket Events**:

```typescript
// Client → Server
interface ClientToServerEvents {
  'join-room': (roomId: string, username: string) => void
  'flash-action': (data: FlashActionDto) => void
  'toggle-item': (data: ToggleItemDto) => void
}

// Server → Client
interface ServerToClientEvents {
  'room-state': (state: GameState) => void
  'user-joined': (username: string) => void
  'user-left': (username: string) => void
  'flash-notification': (role: Role, username: string) => void
}
```

#### **RoomService** - State Management

**Location**: `apps/api/src/room/room.service.ts`

**Purpose**: Gestion centralisée de l'état des rooms

**Features**:

- In-memory Map<roomId, GameState>
- Atomic state updates
- Room cleanup on empty
- State validation

---

### 2. **Frontend - Game Logic** (`apps/web`)

#### **GameContext** - State Container

**Location**: `apps/web/features/game/contexts/game.context.tsx`

**Purpose**: Context React pour gérer l'état global du jeu (solo et multiplayer)

**Features**:

- Flash timer management (timestamp-based)
- Socket.IO integration
- Audio notifications
- State synchronization

**Flash Cooldown Calculation**:

| Configuration  | Cooldown | Formula                              |
| -------------- | -------- | ------------------------------------ |
| Base           | 300s     | -                                    |
| Lucidity Boots | 268s     | 300 - (300 × 10.67%) = 268s          |
| Cosmic Insight | 255s     | 300 - (300 × 15%) = 255s             |
| **Both**       | **231s** | **300 - (300 × 10.67% + 300 × 15%)** |

#### **Game Screens**

**Solo Mode**: `apps/web/features/game/screens/game-solo.screen.tsx`

- No WebSocket
- Local state only
- Practice mode

**Multiplayer Mode**: `apps/web/features/game/screens/game-multiplayer.screen.tsx`

- Real-time sync via Socket.IO
- Room-based collaboration
- Live user list

---

### 3. **Socket.IO Hook**

**Location**: `apps/web/hooks/use-socket.hook.ts`

**Purpose**: Custom hook encapsulant la logique Socket.IO

**Configuration**:

```typescript
const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(
  config.socketPort,
  {
    autoConnect: true,
    reconnection: true,
    reconnectionAttempts: 5,
  }
)
```

**Features**:

- Typed events (TypeScript)
- Auto-reconnect (5 attempts)
- Connection status tracking
- Event cleanup

---

### 4. **Lobby System**

**Location**: `apps/web/app/lobby/page.tsx`

**Features**:

- **Create Lobby**: Generates a random 10-character alphanumeric code
- **Join Lobby**: Enter existing room code
- **Code Validation**: Enforces 10-character requirement
- **Copy to Clipboard**: Easy sharing of room codes

**Code Generation**:

```typescript
function generateLobbyCodeId(length: number): string {
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let result = ''
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length))
  }
  return result
}
```

---

### 5. **State Management**

#### **Username Management**

**Location**: Direct localStorage usage (no store)

- Username is stored directly in localStorage (`username` key)
- Simple and efficient for single value
- Used in settings page and username provider

```typescript
// Set username
localStorage.setItem('username', username)

// Get username
const username = localStorage.getItem('username')
```

#### **Background Store (Zustand)**

**Location**: `apps/web/app/store/background-image.store.ts`

```typescript
interface IBackgroundImageState {
  image: string
  setImage: (image: string) => void
  reset: () => void
}
```

- Persists to localStorage (`cover-bg` key)
- Champion splash art selection
- Default: Riot Games background

---

### 6. **Background Customization**

**Location**: `apps/web/features/settings/components/background-selector.component.tsx`

**Features**:

- Fetches all champion splash arts via React Query
- Search/filter champions by name
- Preview and select backgrounds
- Persists selection to localStorage (`cover-bg` key)

**API Integration**:

```typescript
const { data } = useQuery<AllSkinsSplashArts[]>({
  queryKey: ['allSkinsSplashArts'],
  queryFn: async () => await getChampion(),
})
```

**Champion Data Structure**:

```typescript
interface AllSkinsSplashArts {
  championName: string
  splashArts: {
    skinName: string
    skinImageUrl: string
  }[]
}
```

---

### 7. **Username Provider**

**Location**: `apps/web/components/providers/username-provider.component.tsx`

**Purpose**: Gate component qui bloque l'accès jusqu'à ce que l'utilisateur définisse un username

**Flow**:

1. Check Zustand store pour username
2. Si absent → affiche modal `UsernameInputModal`
3. Une fois défini → render children
4. Persist automatiquement dans localStorage

---

### 8. **Toast Notifications**

**Technology**: Radix UI Toast + Sonner

**Location**: `apps/web/hooks/use-toast.hook.ts`

**Usage**:

```typescript
toast({
  title: `${role} FLASHED !!!`,
  description: 'Jungle can u gank no summs...',
  duration: 1500,
})
```

**Triggered By**:

- Flash button click (local or remote via socket)
- Audio playback accompaniment

---

## 🎨 Styling System

### Theme Configuration

**Location**: `app/globals.css`

**Approach**: CSS variables for dynamic theming

```css
:root {
  --background: 209 87% 6%;
  --foreground: 240 6% 94%;
  --border: 30 25% 52%;
  /* ... more variables */
}
```

### Custom Utilities

- `.textstroke`: Black text outline for readability over backgrounds
- `.image-bg`: Background gradient overlay system
- Custom scrollbar styling (minimal, themed)

### Responsive Design

- Mobile-first approach with Tailwind breakpoints
- `sm:` breakpoint at 768px
- Background switches to static image on mobile
- Component layout adapts for small screens

---

## 🔄 Real-time Communication Flow

### Multiplayer Game Flow

1. **Room Creation/Join**
   - User generates or enters 10-char room code
   - Navigates to `/game/[roomId]`

2. **Socket Connection**
   - Component emits `join-room` with roomId and username
   - Server adds user to room
   - User list updates for all room members

3. **Game State Synchronization**
   - User clicks Flash button for a role
   - Local state updates immediately
   - Socket emits `updateSummonerData` to room
   - All clients receive update and sync state

4. **Toast Notifications**
   - Flash click triggers `show-toast` event
   - Server broadcasts `send-toast` to all room members
   - Each client displays notification and plays audio

5. **Countdown Timer**
   - `useEffect` decrements timers every second
   - When timer changes, emits updated state
   - Synchronizes across all clients

### Solo Mode

- `useWebSocket={false}` disables socket communication
- All functionality works locally
- No room code or user list displayed

---

## 📊 Game Mechanics

### Flash Cooldown Calculation Logic

```typescript
let flashTime = 300 // Base cooldown

if (lucidityBoots && cosmicInsight) {
  flashTime = 231 // -69s (23% CDR)
} else if (lucidityBoots && !cosmicInsight) {
  flashTime = 268 // -32s (10.67% CDR from boots)
} else if (!lucidityBoots && cosmicInsight) {
  flashTime = 255 // -45s (15% CDR from rune)
} else {
  flashTime = 300 // No CDR
}
```

### Timer Display Format

- **Format**: `MM:SS` (e.g., `4:15`)
- **Zero Padding**: Seconds under 10 show with leading zero
- **Visual Feedback**: Role icon darkens when Flash is on cooldown

### Toggle Logic

- **First Click**: Starts countdown timer
- **Click During Countdown**: Cancels timer (Flash is back up)
- **Click When Ready**: Starts new countdown

---

## 🚀 Deployment

### Docker Architecture

LolTimeFlash utilise **multi-stage builds** pour optimiser la taille des images et la sécurité.

#### API Docker (`apps/api/Dockerfile`)

**Stages**:

1. **deps**: Installation des dépendances (pnpm install)
2. **builder**: Build NestJS (`pnpm build`)
3. **runner**: Production runtime (non-root user)

**Key Points**:

- Build output: `dist/src/main.js`
- Non-root user: `nestjs:nestjs` (UID/GID 1001)
- Logs persistés via volume
- Health check endpoint: `/monitoring/health`

#### Web Docker (`apps/web/Dockerfile`)

**Stages**:

1. **deps**: Installation + copy shared types
2. **builder**: Build Next.js (`pnpm build`)
3. **runner**: Production runtime (standalone mode)

**Key Points**:

- Build output: `.next/standalone`
- Non-root user: `nextjs:nodejs` (UID/GID 1001)
- Static assets copiés séparément
- Champion data (2000+ webp) inclus

#### Docker Compose (`docker-compose.yml`)

```yaml
services:
  api:
    build: ./apps/api
    ports:
      - '8888:8888'
    environment:
      - NODE_ENV=production
      - PORT=8888
    healthcheck:
      test:
        [
          'CMD',
          'wget',
          '--quiet',
          '--tries=1',
          '--spider',
          'http://localhost:8888/monitoring/health',
        ]
      interval: 30s
      timeout: 10s
      retries: 3
    volumes:
      - api-logs:/app/logs
    networks:
      - loltimeflash-network

  web:
    build: ./apps/web
    ports:
      - '6333:6333'
    environment:
      - NODE_ENV=production
      - NEXT_PUBLIC_SOCKET_PORT=http://api:8888
    depends_on:
      api:
        condition: service_healthy
    networks:
      - loltimeflash-network

volumes:
  api-logs:

networks:
  loltimeflash-network:
    driver: bridge
```

### Docker Commands

```bash
# Development
pnpm dev             # Run both apps locally

# Docker
pnpm docker:build    # Build images
pnpm docker:up       # Start containers
pnpm docker:down     # Stop containers
pnpm docker:logs     # View logs
pnpm docker:test     # Full test suite (build + up + health check)

# Cleanup
pnpm docker:clean    # Remove images & volumes
```

### Environment Variables

**API** (`.env`):

```env
PORT=8888
NODE_ENV=development
LOG_LEVEL=info
RIOT_API_KEY=RGAPI-your-key-here
```

**Web** (`.env`):

```env
NEXT_PUBLIC_SOCKET_PORT=http://localhost:8888
NEXT_PUBLIC_API_URL=http://localhost:8888
```

### Configuration Pattern

**LolTimeFlash utilise exclusivement `ConfigService` de NestJS** pour toutes les variables d'environnement.

#### ✅ Pattern Recommandé : `ConfigService`

**Utilisation** : Toutes les variables d'environnement (PORT, LOG_LEVEL, API_KEY, etc.)

```typescript
// apps/api/src/riot/riot.service.ts
import { ConfigService } from '@nestjs/config'

@Injectable()
export class RiotService {
  private readonly riotApiKey: string

  constructor(private configService: ConfigService) {
    this.riotApiKey = this.configService.get<string>('RIOT_API_KEY') || ''
  }
}

// apps/api/src/main.ts
async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  const configService = app.get(ConfigService)

  const port = configService.get<number>('API_PORT') || 8888
  await app.listen(port)
}
```

**Avantages** :

- ✅ Respecte le lifecycle NestJS (variables chargées par `ConfigModule.forRoot()`)
- ✅ Testable via Dependency Injection
- ✅ Type-safe avec validation possible (class-validator)
- ✅ Une seule source de vérité pour toutes les variables
- ✅ Fonctionne dans `main.ts` via `app.get(ConfigService)`

**Configuration** (`apps/api/src/app.module.ts`):

```typescript
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '../../.env', // Load from project root
    }),
    // ... other modules
  ],
})
export class AppModule {}
```

---

## 🛠️ Development Workflow

### First Time Setup

```bash
# Clone repository
git clone https://github.com/yourusername/LolTimeFlash.git
cd LolTimeFlash

# Install dependencies (monorepo)
pnpm install

# Set up environment
cp .env.example .env  # Configure your env vars

# Run development servers
pnpm dev

# API: http://localhost:8888
# Web: http://localhost:6333
```

### Development Commands

```bash
# Start both apps (API + Web)
pnpm dev              # Turbo runs both in parallel

# Start individual apps
pnpm dev:api          # API only (NestJS)
pnpm dev:web          # Web only (Next.js)

# Build
pnpm build            # Build all apps
pnpm build:api        # Build API
pnpm build:web        # Build Web

# Production
pnpm start            # Start built apps
pnpm start:api        # API production server
pnpm start:web        # Web production server

# Type checking
pnpm type-check       # Check all TypeScript

# Linting & Formatting
pnpm lint             # Lint all apps
pnpm lint:fix         # Auto-fix lint errors
pnpm format           # Format with Prettier
pnpm format:check     # Check formatting

# Cleanup
pnpm clean            # Clean build artifacts
pnpm clean:full       # Clean + reinstall
```

### Monorepo Structure

**Turborepo** gère les builds en parallèle et le caching :

```json
// turbo.json
{
  "tasks": {
    "build": {
      "dependsOn": ["^build"], // Build dependencies first
      "outputs": ["dist/**", ".next/**"]
    },
    "dev": {
      "cache": false, // No caching for dev
      "persistent": true // Keep running
    }
  }
}
```

---

## 📦 Dependencies

### Production Dependencies

- **next**: 16.0.1 - React framework
- **react**: ^19.2.0 - UI library
- **socket.io**: ^4.8.1 - Real-time server
- **socket.io-client**: ^4.8.1 - Real-time client
- **zustand**: ^5.0.2 - State management
- **@tanstack/react-query**: ^5.90.8 - Server state
- **@radix-ui/\***: UI primitives
- **tailwindcss**: ^3.3.0 - Styling
- **react-icons**: ^5.0.1 - Icon library
- **sharp**: ^0.33.3 - Image optimization

### Dev Dependencies

- **typescript**: ^5.9.3
- **@types/\***: Type definitions
- **eslint**: ^9.39.1 - Linting (flat config)
- **eslint-config-prettier**: ^9.1.0 - ESLint + Prettier integration
- **prettier**: ^3.6.2 - Code formatter
- **prettier-plugin-tailwindcss**: ^0.6.14 - Auto-sort Tailwind classes
- **autoprefixer**: ^10 - CSS processing

### Code Quality Tools

- **ESLint**: Configured with Next.js flat config format
- **Prettier**: Auto-formatting with Tailwind class sorting
- **TypeScript**: Strict mode enabled
- **VSCode**: IntelliSense configuré pour Tailwind

### ⚠️ Tailwind CSS v3 vs v4

**Version actuelle** : Tailwind CSS v3.4.17

**Pourquoi pas v4 ?**

Tailwind CSS v4 (sorti janvier 2025) est une **réécriture complète** avec des changements cassants majeurs :

1. **Nouveau moteur Oxide** : Abandonne PostCSS pour un moteur standalone
2. **Configuration @theme** : Remplacement de `tailwind.config.ts` par config CSS
3. **Incompatibilités plugins** :
   - ❌ `tailwindcss-animate` v1.0.7 (pas compatible v4)
   - ❌ `tailwind-scrollbar` v3.1.0 (pas compatible v4)
   - ⚠️ `prettier-plugin-tailwindcss` (support partiel)

4. **Migration complexe** : Réécriture complète de la config, tests, composants
5. **Risques** : Bugs, régression, conflits avec Next.js 16

**Décision** : 🟢 **Rester sur v3.4.17** (version stable et éprouvée)

**Migration v4 planifiée** : Phase 4 ou 5, après stabilisation de l'architecture actuelle

**Note Tailwind config** : Le dossier `features/` a été ajouté dans `tailwind.config.ts` content array pour scanner les nouveaux composants de la Phase 3.5 (Architecture Refactor).

### Scripts disponibles

```bash
pnpm dev          # Dev avec Turbopack
pnpm build        # Build production
pnpm lint         # Linter
pnpm lint:fix     # Fix automatique
pnpm format       # Format avec Prettier
pnpm format:check # Check formatting
pnpm type-check   # Vérifier TypeScript
pnpm clean        # Nettoyer cache
pnpm clean:full   # Clean + reinstall
```

---

## 🎯 Champion Data System

### Static Champions Data

**Purpose**: Provide champion splash arts for background selection

**Implementation**: Direct file read from static JSON

The frontend reads directly from `public/champions/data.json`, which is generated by the `sync-champions.ts` script.

**Data Structure**:

```json
{
  "version": "15.22.1",
  "lastUpdated": "2025-11-13T18:42:36.441Z",
  "champions": [
    {
      "championName": "Aatrox",
      "splashArts": [
        {
          "skinName": "Aatrox",
          "skinImageUrl": "/champions/splash/Aatrox_0.webp"
        }
      ]
    }
  ]
}
```

**Synchronization Script**: `scripts/sync-champions.ts`

```bash
# Download and compress champion data
pnpm sync:champions

# Force clean start
pnpm sync:champions --fresh
```

**Features**:

- Fetches from Data Dragon API
- Downloads all splash arts
- Compresses to WebP format (85% quality)
- Parallel processing (5 champions at a time)
- Resume capability on failure
- Automatic retry with exponential backoff

**Output**:

- `apps/web/public/champions/data.json` - Metadata
- `apps/web/public/champions/splash/*.webp` - Compressed images (~2000+ files)

---

## 🔐 Data Persistence

### LocalStorage Keys

- `username`: User's display name
- `volume`: Audio setting ('on' | 'off')
- `cover-bg`: Selected background image URL

### Constants

**Location**: `lib/constants.ts`

```typescript
export const currentUsername = localStorage.getItem('username')
export const userVolume = localStorage.getItem('volume')
export const gameDefaultData: GameData = {
  users: [currentUsername],
  roles: {
    TOP: { isFlashed: false, lucidityBoots: false, cosmicInsight: false },
    JUNGLE: { isFlashed: false, lucidityBoots: false, cosmicInsight: false },
    MID: { isFlashed: false, lucidityBoots: false, cosmicInsight: false },
    SUPPORT: { isFlashed: false, lucidityBoots: false, cosmicInsight: false },
    ADC: { isFlashed: false, lucidityBoots: false, cosmicInsight: false },
  },
}
```

---

## 🎨 UI/UX Features

### Visual Feedback

- **Flash Active**: Full brightness role icon
- **Flash on CD**: Darkened icon with timer overlay
- **Boots/Rune Active**: Full brightness item icons
- **Boots/Rune Inactive**: 50% brightness
- **Hover Effects**: Scale transform (110%) on desktop
- **Text Stroke**: Black outline for text readability

### Audio System

- **File**: `public/flash-song.mp3`
- **Volume**: 15% (0.15)
- **Trigger**: Flash button click
- **Reset**: Audio stops and restarts on new trigger
- **Toggle**: Volume button in top-right

### Responsive Layouts

- **Desktop**: 5-column grid (one per role)
- **Mobile**: 2-column grid, wraps SUPPORT to full width
- **Navigation**: Fixed position buttons (top-left, top-right)
- **User List**: Fixed bottom-left on mobile, top-right on desktop

---

## 🤝 Contributing Guidelines

### Code Style

- **TypeScript**: Use explicit types, avoid `any`
- **Components**: Functional components with TypeScript
- **Naming**: PascalCase for components, camelCase for functions
- **Imports**: Group by external, internal, components, utils

### Git Workflow

1. Create feature branch from `main`
2. Commit with descriptive messages
3. Test locally before pushing
4. Submit PR with description of changes

### Commit Message Convention

**Format**: `<gitmoji> <type>(<scope>): <description>`

**Rules**:

- ✅ Use gitmoji in **text format** (`:art:` `:recycle:` `:sparkles:` etc.), NOT emoji unicode (🎨 ♻️ ✨)
- ✅ Max 72 characters for the title
- ✅ **NO body** (no line breaks, title only)
- ✅ Use imperative mood ("add", "fix", "refactor", not "added", "fixed")
- ✅ Lowercase after colon

**Examples**:

```bash
:recycle: refactor(game): migrate to timestamp-based timers
:sparkles: feat(socket): add connection status indicator
:bug: fix(timer): prevent reset on user join
:art: style(ui): apply kebab-case naming convention
:memo: docs: update AGENTS.md with Phase 3.5 changes
:zap: perf(game): optimize components with React.memo
```

**Common Gitmojis**:

- `:art:` - Code structure/format
- `:recycle:` - Refactor code
- `:sparkles:` - New feature
- `:bug:` - Bug fix
- `:memo:` - Documentation
- `:rocket:` - Deploy/performance
- `:white_check_mark:` - Tests
- `:zap:` - Performance
- `:wrench:` - Configuration

### Testing Checklist

- [ ] Solo mode works without errors
- [ ] Room creation generates valid code
- [ ] Room joining validates code length
- [ ] Flash timer calculates correctly
- [ ] Socket events synchronize properly
- [ ] Audio plays when enabled
- [ ] Background selector loads champions
- [ ] Username persists after refresh
- [ ] Mobile layout renders correctly

---

## 📦 Versioning & Merge Requests Guidelines

### Semantic Versioning

**Format** : `MAJOR.MINOR.PATCH` (e.g., `2.3.0`)

- **MAJOR** : Breaking changes, architecture majeure
- **MINOR** : Nouvelles features, améliorations non-breaking
- **PATCH** : Bug fixes, hotfixes

### Titre de MR (Merge Request)

**Format** : `<gitmoji> <type>(<scope>): <description> (vX.X.X)`

**Exemples** :

```bash
✨ feat(game): add timer calibration controls (v2.3.0)
🐛 fix(timer): resolve multi-device desync issue (v2.2.0)
📦 refactor(api): migrate to NestJS monorepo (v2.0.0)
```

**Gitmojis recommandés** :

- `✨ :sparkles:` - Nouvelle feature (MINOR)
- `🐛 :bug:` - Bug fix (PATCH)
- `📦 :package:` - Refactor/architecture (MAJOR/MINOR)
- `🎨 :art:` - UI/UX improvements
- `⚡ :zap:` - Performance improvements

### Description de MR

**Structure** :

```markdown
# <Feature/Fix Name>

## Summary

[1-2 phrases résumant le changement]

## New Features / Bug Fixes

- ✨ Feature 1
- 🐛 Fix 1
- 🎨 Visual improvement

## Technical Changes

### Backend (X files)

- File 1 - Description
- File 2 - Description

### Frontend (X files)

- File 1 - Description
- File 2 - Description

## Testing

- ✅ Test case 1
- ✅ Test case 2

## Version

`X.X.X` → `X.X.X`

## Breaking Changes

None / [Description si applicable]

## Ready to merge 🚀
```

### Checklist Avant Montée de Version

- [ ] Mettre à jour `package.json` (version)
- [ ] Mettre à jour `README.md` (badge version)
- [ ] Ajouter une entrée dans `VERSIONS.md`
- [ ] Mettre à jour footer de `AGENTS.md` (date + version + status)
- [ ] Tester en local (dev + build)
- [ ] Tester en Docker (si applicable)

---

## 📖 Additional Resources

### External Documentation

- [Next.js App Router](https://nextjs.org/docs/app)
- [Socket.IO Documentation](https://socket.io/docs/v4/)
- [Zustand Guide](https://docs.pmnd.rs/zustand)
- [TanStack Query](https://tanstack.com/query/latest/docs/react/overview)
- [Radix UI](https://www.radix-ui.com/docs/primitives/overview/introduction)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Shieldbow (League API)](https://github.com/TheDrone7/shieldbow)

### League of Legends Resources

- [Riot Developer Portal](https://developer.riotgames.com/)
- [Data Dragon (Champion Data)](https://developer.riotgames.com/docs/lol#data-dragon)
- [Community Dragon](https://www.communitydragon.org/)

---

## 📘 NestJS Monorepo Architecture

### Pourquoi NestJS + Next.js ?

**Séparation des responsabilités** :

- **NestJS** : WebSocket + game logic + monitoring + logging
- **Next.js** : UI + routing + client state + SEO

**Avantages** :

✅ **Types partagés** - Zero duplication, une seule source de vérité  
✅ **Scalabilité** - Microservices ready, chaque app peut scale indépendamment  
✅ **Performance** - Build optimisé avec Turborepo + Docker multi-stage  
✅ **DevEx** - Hot reload, TypeScript strict, ESLint unifié  
✅ **Production** - Health checks, logs, metrics, error handling

### NestJS Internal Library (`apps/api/libs/shared`)

**Concept** : Library interne NestJS accessible par les deux apps

**Configuration** (`apps/api/nest-cli.json`) :

```json
{
  "monorepo": true,
  "projects": {
    "shared": {
      "type": "library",
      "root": "libs/shared",
      "entryFile": "index",
      "sourceRoot": "libs/shared/src"
    }
  }
}
```

**Import dans l'API** :

```typescript
// apps/api/src/**/*.ts
import { Role, GameState } from '@app/shared'
// Résolu via tsconfig.json paths
```

**Import dans le Web** :

```typescript
// apps/web/**/*.tsx
import { Role, GameState } from '@loltimeflash/shared'
// Wrapper dans packages/shared re-exporte depuis apps/api/libs/shared
```

### Docker Build Optimization

**Problème** : Build lent, layers non cachés

**Solution** :

1. **Multi-stage builds** - Séparation deps / builder / runner
2. **Layer caching** - Dependencies copiés avant source code
3. **.dockerignore** - Exclusion node_modules, .git, dist
4. **Parallel builds** - Docker Compose build simultané

**Résultat** :

- Build initial: ~3-4min
- Build incrémental: ~30s (si dependencies inchangées)
- Image finale: ~200MB (Alpine + production deps only)

---

## 🔄 Version History

> **📌 Historique complet des versions disponible dans [`VERSIONS.md`](./VERSIONS.md)**  
> Consultez ce fichier pour voir toutes les versions, bug fixes et features ajoutées.

---

## 📝 License & Credits

This project is a fan-made tool for League of Legends players. League of Legends and all associated properties are trademarks or registered trademarks of Riot Games, Inc.

**Built with**: Next.js, Socket.IO, TailwindCSS, and ❤️ by the community

---

## 💻 Code Conventions & Architecture

### Project Structure (Next.js App Router)

```
apps/web/
├── app/                          # Next.js App Router
│   ├── (features)/              # Feature-based routing groups
│   │   ├── game/
│   │   ├── lobby/
│   │   └── settings/
│   ├── api/                     # API Routes
│   ├── store/                   # Global Zustand stores
│   └── layout.tsx
├── components/                   # Shared UI components
│   ├── ui/                      # Reusable UI primitives
│   ├── layout/                  # Layout components
│   └── providers/               # Context providers
├── features/                    # Feature modules (future)
│   └── [feature-name]/
│       ├── components/          # Feature-specific components
│       ├── hooks/              # Feature-specific hooks
│       ├── store/              # Feature-specific stores
│       ├── types/              # Feature-specific types
│       ├── constants/          # Feature constants
│       └── utils/              # Feature utilities
├── hooks/                       # Global hooks
├── lib/                         # Utilities & config
│   ├── utils.ts
│   ├── types.ts
│   ├── constants.ts
│   └── config.ts
└── public/                      # Static assets
```

### File Naming Conventions

All files use **kebab-case** with descriptive type suffixes:

- **Components**: `component-name.component.tsx`
- **Pages/Screens**: `page-name.page.tsx`
- **Hooks**: `use-hook-name.hook.ts`
- **Stores**: `store-name.store.ts`
- **Utils**: `util-name.util.ts`
- **Types**: `type-name.types.ts`
- **Constants**: `constant-name.constant.ts`

**Examples**:

```
✅ GOOD:
- game-room.component.tsx
- use-socket.hook.ts
- background-image.store.ts
- game.types.ts
- flash-cooldown.constant.ts

❌ BAD:
- GameRoom.tsx
- useSocket.ts
- backgroundImageStore.ts
- gameTypes.ts
- flashCooldown.ts
```

### TypeScript Conventions

**Interfaces and Types**:

- **Interfaces**: PascalCase with `I` prefix (e.g., `IUserData`, `IGameState`)
- **Types**: PascalCase with `T` prefix (e.g., `TRole`, `TErrorData`)
- Prefer interfaces for object shapes
- Use type aliases for unions and complex types

```typescript
// ✅ GOOD
interface IUserData {
  username: string
  id: string
}

type TRole = 'TOP' | 'JUNGLE' | 'MID' | 'ADC' | 'SUPPORT'

// ❌ BAD
interface UserData { ... }  // No I prefix
type Role = '...'  // No T prefix
```

**Function Parameters**:

- Always use explicit types
- No implicit `any`

```typescript
// ✅ GOOD
const handleClick = (role: TRole): void => {
  console.log(role)
}

// ❌ BAD
const handleClick = (role) => {
  // Implicit any
  console.log(role)
}
```

### Component Conventions

**Component Structure**:

```typescript
import { useState } from 'react'
import { cn } from '@/lib/utils'

interface ICardProps {
  title: string
  description?: string
  onPress?: () => void
  className?: string
}

export const Card = (props: ICardProps) => {
  const { title, description, onPress, className } = props
  const [isActive, setIsActive] = useState(false)

  return (
    <div className={cn('rounded-lg bg-white p-4', className)}>
      <h3 className="text-lg font-semibold">{title}</h3>
      {description && <p className="text-sm text-gray-600">{description}</p>}
    </div>
  )
}
```

**Component Rules**:

1. Use **named exports** (not default exports)
2. Use **arrow function** syntax
3. **Destructure props** inside component body
4. Define **props interface** above component
5. Use **TypeScript** for all props (no PropTypes)
6. Import `cn` utility for conditional classes
7. **No JSDoc comments** - A well-named component is self-documenting

### Naming Conventions

| Type           | Convention       | Example                           |
| -------------- | ---------------- | --------------------------------- |
| Components     | PascalCase       | `GameRoom`, `FlashTimer`          |
| Functions      | camelCase        | `calculateCooldown`, `formatTime` |
| Event Handlers | `handle` prefix  | `handleClick`, `handleSubmit`     |
| Hooks          | `use` prefix     | `useSocket`, `useGameState`       |
| Constants      | UPPER_SNAKE_CASE | `MAX_USERS`, `DEFAULT_COOLDOWN`   |
| Interfaces     | `I` prefix       | `IGameData`, `IUserState`         |
| Types          | `T` prefix       | `TRole`, `TSocketEvent`           |
| Stores         | `Store` suffix   | `useGameStore`, `useUserStore`    |

### Code Best Practices

1. **Named Exports**: Always use named exports for better IDE support

   ```typescript
   // ✅ GOOD
   export const GameRoom = () => {}

   // ❌ BAD
   export default GameRoom
   ```

2. **Named Imports**: Import React hooks by name

   ```typescript
   // ✅ GOOD
   import { useState, useEffect } from 'react'

   // ❌ BAD
   import React from 'react'
   React.useState()
   ```

3. **Early Returns**: Use guard clauses for better readability

   ```typescript
   // ✅ GOOD
   if (!user) return null
   if (isLoading) return <Loader />
   return <Content />

   // ❌ BAD
   if (user) {
     if (!isLoading) {
       return <Content />
     } else {
       return <Loader />
     }
   } else {
     return null
   }
   ```

4. **No Magic Values**: Use descriptive constants

   ```typescript
   // ✅ GOOD
   const FLASH_BASE_COOLDOWN = 300
   const timer = FLASH_BASE_COOLDOWN

   // ❌ BAD
   const timer = 300 // What is 300?
   ```

5. **Avoid Type Assertions**: Fix types at the source

   ```typescript
   // ✅ GOOD
   const role: TRole = 'TOP'

   // ❌ BAD
   const role = 'TOP' as TRole // Bypasses type checking
   ```

6. **Self-Documenting Code**: No comments for components or obvious code

   ```typescript
   // ✅ GOOD - Component file
   export const UserProfileCard = (props: IUserProfileCardProps) => {
     // Implementation
   }

   // ✅ GOOD - Complex utility function with JSDoc
   /**
    * Calculates Flash cooldown based on items and runes
    * @param lucidityBoots - Has Ionian Boots of Lucidity
    * @param cosmicInsight - Has Cosmic Insight rune
    * @returns Cooldown in seconds
    */
   export const calculateFlashCooldown = (
     lucidityBoots: boolean,
     cosmicInsight: boolean
   ): number => {
     // Implementation
   }

   // ✅ GOOD - Self-documenting variable
   const isFlashAvailable = flashCooldown === 0

   // ❌ BAD - Obvious component comment
   /**
    * User Profile Card Component
    * Displays user profile information
    */
   export const UserProfileCard = () => {}

   // ❌ BAD - Obvious inline comment
   // Check if flash is ready
   const f = c === 0
   ```

   **When to use comments**:
   - ✅ Complex utility functions with JSDoc
   - ✅ Business logic that requires context
   - ✅ Algorithm explanations
   - ❌ Component descriptions (name should be clear)
   - ❌ Obvious code behavior

### Zustand Store Pattern

**Store Structure**:

```typescript
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

interface IBackgroundImageState {
  image: string
}

interface IBackgroundImageActions {
  setImage: (image: string) => void
  reset: () => void
}

const DEFAULT_STATE: IBackgroundImageState = {
  image: '',
}

export const useBackgroundImageStore = create<
  IBackgroundImageState & IBackgroundImageActions
>()(
  persist(
    (set) => ({
      ...DEFAULT_STATE,
      setImage: (image) => set({ image }),
      reset: () => set(DEFAULT_STATE),
    }),
    {
      name: 'background-image-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
)
```

**Store Best Practices**:

1. Separate state and actions interfaces
2. Always include `reset()` action
3. Use `DEFAULT_STATE` constant
4. Name stores with `use` prefix and `Store` suffix
5. Use selective subscriptions to avoid re-renders
6. **For single values, prefer direct localStorage** (like username)

```typescript
// ✅ GOOD: Selective subscription
const image = useBackgroundImageStore((state) => state.image)

// ❌ BAD: Subscribe to entire store
const { image, setImage, reset } = useBackgroundImageStore()
```

### Custom Hooks Pattern

**Hook Structure**:

```typescript
import { useState, useEffect } from 'react'
import type { IGameState } from '@/lib/types'

interface IUseGameOptions {
  roomId: string
  enabled?: boolean
}

export const useGame = (options: IUseGameOptions) => {
  const { roomId, enabled = true } = options
  const [gameState, setGameState] = useState<IGameState | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!enabled) return

    // Hook logic here
  }, [enabled, roomId])

  return {
    gameState,
    isLoading,
  }
}
```

### Path Aliases

Configured in `tsconfig.json`:

```typescript
import { cn } from '@/lib/utils'
import { useSocket } from '@/hooks/use-socket.hook'
import type { IGameData } from '@/lib/types'
import { Button } from '@/components/ui/button.component'
```

### Styling with Tailwind

**Use `cn()` utility** for all conditional classes:

```typescript
import { cn } from '@/lib/utils'

<div className={cn(
  'base-class',
  isActive && 'active-class',
  className  // Allow prop override
)} />
```

---

## 🆘 Support & Contact

For questions, issues, or contributions:

- Open an issue on GitHub
- Check existing documentation
- Review Socket.IO server setup requirements

---

**Last Updated**: November 24, 2025
**Version**: 2.3.1 - Timer Controls UX Fixes & Username Refactor
**Status**: ✅ Production Ready (API + Web + Docker + Timer Sync + Calibration)
