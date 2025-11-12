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

### Tech Stack

#### Frontend

- **Framework**: Next.js 16.0.1 (App Router)
- **Language**: TypeScript 5.7.2
- **Styling**:
  - Tailwind CSS 3.3.0
  - Custom CSS variables for theming
  - Radix UI components
- **State Management**:
  - Zustand 5.0.2 (global state)
  - React Query (TanStack Query 5.90.8) for server state
- **Real-time Communication**: Socket.IO Client 4.8.1
- **UI Components**:
  - Radix UI (Dialog, Toast, Sheet)
  - Custom UI components library
- **Icons**: React Icons 5.0.1

#### Backend/API

- **Next.js API Routes** for server-side logic
- **Socket.IO Server** 4.8.1 for real-time communication
- **Data Dragon API** (Riot Games official static data API)

#### Deployment

- **Containerization**: Docker + Docker Compose
- **Base Image**: Node 20.9.0 Alpine
- **Package Manager**: pnpm
- **Port**: 6333

---

## 📁 Project Structure

```
LolTimeFlash/
├── app/                          # Next.js App Router
│   ├── api/                      # API Routes
│   │   └── shieldbow/           # Riot API integration
│   │       ├── route.ts         # Champion skins endpoint
│   │       └── methods.ts       # API helper methods
│   ├── game/                    # Game pages
│   │   ├── [roomId]/           # Dynamic room route
│   │   │   └── page.tsx        # Multiplayer game page
│   │   ├── gameComponent.tsx   # Main game logic component
│   │   └── page.tsx            # Solo game page
│   ├── lobby/                   # Lobby system
│   │   └── page.tsx            # Create/Join room page
│   ├── settings/                # User settings
│   │   └── page.tsx            # Username management
│   ├── store/                   # Zustand state stores
│   │   ├── useBackgroundImage.ts
│   │   └── useUsername.ts
│   ├── socket.js               # Socket.IO client setup
│   ├── layout.tsx              # Root layout
│   ├── page.tsx                # Home page
│   └── globals.css             # Global styles
│
├── components/                  # React components
│   ├── ui/                     # UI component library
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── dialog.tsx
│   │   ├── sheet.tsx
│   │   ├── toast.tsx
│   │   ├── dialogcover/       # Background selector
│   │   ├── wrapperbackground/ # Background wrapper
│   │   └── usernameinput/     # Username input modal
│   ├── QueryProvider/          # React Query provider
│   ├── UsernameProvider/       # Username gate component
│   └── settingsbutton/         # Settings navigation button
│
├── lib/                        # Utilities and helpers
│   ├── config.ts              # Configuration
│   ├── constants.ts           # Constants (default data, localStorage keys)
│   ├── types.ts               # TypeScript type definitions
│   └── utils.ts               # Utility functions (cn, generateLobbyCodeId)
│
├── data/                       # Static data
│   └── champions/             # Champion data by patch version
│       ├── 14.8/
│       └── 15.22/
│
├── public/                     # Static assets
│   ├── assets/                # Game assets (role icons, items)
│   └── flash-song.mp3         # Audio notification
│
├── fonts/                      # Custom fonts (Beaufort for LOL)
├── hooks/                      # Custom React hooks
│   └── useMediaQuery.tsx
│
├── docker-compose.yml          # Docker configuration
├── Dockerfile                  # Docker build instructions
├── package.json                # Dependencies
├── tailwind.config.ts          # Tailwind configuration
└── tsconfig.json               # TypeScript configuration
```

---

## 🔑 Key Components

### 1. **gameComponent.tsx** - Core Game Logic

**Location**: `app/game/gameComponent.tsx`

**Purpose**: Main component handling Flash timer logic, cooldown calculations, and real-time synchronization.

**Key Features**:

- **Flash Cooldown Calculation**:
  - Base: 300s (5 minutes)
  - With Lucidity Boots: 268s
  - With Cosmic Insight: 255s
  - With Both: 231s
- **Timer Management**: Countdown timer using `useEffect` with 1-second intervals
- **WebSocket Integration**: Emits and receives real-time updates
- **Audio System**: Plays notification sound on Flash usage
- **Volume Control**: Toggle audio on/off

**Props**:

- `useWebSocket: boolean` - Determines if it's solo mode (false) or multiplayer (true)

**State Management**:

```typescript
interface GameData {
  users: string[]
  roles: {
    TOP: SummonerData
    JUNGLE: SummonerData
    MID: SummonerData
    SUPPORT: SummonerData
    ADC: SummonerData
  }
}

interface SummonerData {
  isFlashed: boolean | number // false = available, number = seconds remaining
  lucidityBoots: boolean
  cosmicInsight: boolean
}
```

**Socket Events**:

- `join-room`: Join a room with username
- `updateSummonerData`: Broadcast game state changes
- `send-toast`: Notify room members of Flash usage
- `show-toast`: Trigger toast notification

---

### 2. **Socket.IO Integration**

**Location**: `app/socket.js`

**Configuration**:

```javascript
import { io } from 'socket.io-client'
import config from '@/lib/config'

export const socket = io(config.socketPort)
```

**Environment Variable**: `NEXT_PUBLIC_SOCKET_PORT`

**Room System**:

- Each game session has a unique 10-character room ID
- Users join rooms using `socket.emit('join-room', roomId, username)`
- All game state updates are synchronized across room members

---

### 3. **Lobby System**

**Location**: `app/lobby/page.tsx`

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

### 4. **State Management**

#### **Zustand Stores**

**useUsername Store** (`app/store/useUsername.ts`)

```typescript
interface UsernameState {
  username: string | null
  setUsername: (username: string) => void
}
```

- Persists to localStorage
- Used for room identification

**useBackgroundImage Store** (`app/store/useBackgroundImage.ts`)

```typescript
interface BackgroundImage {
  image: string
  setImage: (image: string) => void
}
```

- Manages selected champion splash art background

---

### 5. **Background Customization**

**Location**: `components/ui/dialogcover/index.tsx`

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

### 6. **Username Provider**

**Location**: `components/UsernameProvider/index.tsx`

**Purpose**: Gate component that blocks access until username is set

**Flow**:

1. Checks if username exists in Zustand store
2. If not, displays `UsernameInput` modal
3. Once set, renders children components
4. Username stored in localStorage for persistence

---

### 7. **Toast Notifications**

**Technology**: Radix UI Toast + Sonner

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

### Docker Setup

**Dockerfile Highlights**:

- Base: Node.js 20.9.0 Alpine (lightweight)
- Package Manager: pnpm
- Build Process:
  1. Install dependencies
  2. Build Next.js application (`pnpm build`)
  3. Expose port 6333
  4. Start production server

**docker-compose.yml**:

```yaml
services:
  loltimeflashfront:
    container_name: loltimeflashfront
    image: loltimeflashfront:latest
    ports:
      - 6333:6333
    restart: unless-stopped
```

### Environment Variables

- `NEXT_PUBLIC_SOCKET_PORT`: WebSocket server URL

---

## 🛠️ Development Workflow

### Installation

```bash
pnpm install
```

### Development Server

```bash
pnpm dev
# Runs on http://localhost:3000
```

### Build for Production

```bash
pnpm build
pnpm start
```

### Docker Build

```bash
docker-compose up --build
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

## 🎯 API Routes

### GET `/api/shieldbow`

**Purpose**: Fetch all champion splash arts from Riot Games Data Dragon API

**Implementation**:

1. Fetches latest League of Legends version from Data Dragon
2. Retrieves all champions list
3. For each champion, fetches detailed data including skins
4. Maps skin data to splash art URLs
5. Returns sorted array of champions with their skins

**Response**:

```typescript
AllSkinsSplashArts[] = [
  {
    championName: "Aatrox",
    splashArts: [
      {
        skinName: "Default",
        skinImageUrl: "https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Aatrox_0.jpg"
      },
      {
        skinName: "Justicar Aatrox",
        skinImageUrl: "https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Aatrox_1.jpg"
      },
      // ... more skins
    ]
  },
  // ... more champions (170+ total)
]
```

**Data Sources**:

- **Versions API**: `https://ddragon.leagueoflegends.com/api/versions.json`
- **Champions List**: `https://ddragon.leagueoflegends.com/cdn/{version}/data/en_US/champion.json`
- **Champion Details**: `https://ddragon.leagueoflegends.com/cdn/{version}/data/en_US/champion/{championName}.json`
- **Splash Arts**: `https://ddragon.leagueoflegends.com/cdn/img/champion/splash/{championName}_{skinNum}.jpg`

**Caching**: API route uses Next.js revalidation with 24-hour cache duration

**Error Handling**:

- If individual champion fetch fails, returns default skin only
- Returns 500 status with error message if entire API fails

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

## 🐛 Known Issues / Future Improvements

### Potential Areas for Enhancement

1. **Socket Server**: Not included in repository
   - Separate Socket.IO server needed
   - Room management logic required
   - Consider scaling for multiple concurrent rooms

2. **TypeScript**: Mixed `.js` and `.ts` files
   - `socket.js` should be converted to `socket.ts`

3. **Error Handling**:
   - No error boundaries for React components
   - Socket disconnection handling could be improved
   - API failure scenarios need better UI feedback

4. **Testing**: No test suite present
   - Consider adding unit tests for utilities
   - E2E tests for room creation/joining flow
   - Socket event testing

5. **Accessibility**:
   - Add ARIA labels for icon buttons
   - Keyboard navigation for Flash buttons
   - Screen reader announcements for timer updates

6. **Performance**:
   - Consider debouncing socket emissions
   - Optimize re-renders in gameComponent
   - Lazy load champion splash art images
   - Implement progressive loading for champion selector

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

## 🔄 Version History & Upgrades

### Version 0.2.0 - November 2025

**Major Dependency Upgrades**:

- ✅ **Next.js**: 14.1.4 → 16.0.1 (Turbopack par défaut, React Compiler intégré)
- ✅ **React**: 18 → 19.2.0 (Hooks optimisés, meilleure performance)
- ✅ **Socket.IO**: 4.7.5 → 4.8.1
- ✅ **TanStack Query**: 5.36.0 → 5.90.8
- ✅ **Zustand**: 4.5.2 → 5.0.2
- ✅ **TypeScript**: 5.x → 5.7.2
- ✅ **ESLint**: 8 → 9.17.0

**Breaking Changes**:

- Next.js 16: `fetch()` n'est plus caché par défaut
  - ✅ Déjà géré avec `export const revalidate = 86400` dans `/api/shieldbow/route.ts`
- React 19: Hooks optimisés automatiquement (pas de changements requis)
- Zustand 5: API reste compatible (pas de changements requis)

**Installation**:

```bash
# Supprimer node_modules et lock file
rm -rf node_modules pnpm-lock.yaml

# Réinstaller les dépendances
pnpm install

# Tester l'application
pnpm dev
```

**Nouveautés Next.js 16**:

- 🚀 **Turbopack** activé par défaut (build/dev plus rapide)
- 🚀 **React Compiler** intégré (mémoïsation automatique)
- 🚀 Amélioration des performances de navigation
- 🚀 Meilleure gestion du cache

### Version 0.1.0 - Initial Release

**Features**:

- Real-time Flash cooldown tracking
- Room-based multiplayer with Socket.IO
- Data Dragon API integration
- Customizable champion backgrounds
- Audio notifications
- Responsive design

---

## 📝 License & Credits

This project is a fan-made tool for League of Legends players. League of Legends and all associated properties are trademarks or registered trademarks of Riot Games, Inc.

**Built with**: Next.js, Socket.IO, TailwindCSS, and ❤️ by the community

---

## 🆘 Support & Contact

For questions, issues, or contributions:

- Open an issue on GitHub
- Check existing documentation
- Review Socket.IO server setup requirements

---

**Last Updated**: November 12, 2025
**Version**: 0.2.0
**Status**: Active Development
