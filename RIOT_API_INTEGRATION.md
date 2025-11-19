# 🎮 Riot API Integration - Live Game Feature

## 📋 Overview

This feature allows LolTimeFlash users to automatically fetch enemy champion data from a live League of Legends game using the Riot Games API. When you enter your summoner name and region, the app will:

1. Fetch your current live game data
2. Identify enemy champions and their roles
3. Display champion icons instead of generic role icons
4. Show enemy summoner names under their champions
5. Auto-enable Cosmic Insight rune if detected
6. Synchronize champion data across all room members (multiplayer)

---

## ⚙️ Setup

### 1. Get a Riot API Key

1. Go to https://developer.riotgames.com/
2. Sign in with your Riot Games account
3. Navigate to "Development API Key" section
4. Copy your API key (valid for 24 hours)
5. For production, apply for a Production API Key

### 2. Configure Environment Variables

Create a `.env.local` file in `apps/web/`:

```bash
# Riot API Key
RIOT_API_KEY=RGAPI-your-api-key-here

# Socket.IO Port (if different from default)
NEXT_PUBLIC_SOCKET_PORT=http://localhost:3001
```

### 3. Install Dependencies

```bash
pnpm install
```

### 4. Run the Application

```bash
# Terminal 1: Start backend
cd apps/api
pnpm dev

# Terminal 2: Start frontend
cd apps/web
pnpm dev
```

---

## 🎯 How to Use

### Solo Mode

1. Navigate to `/game` (solo mode)
2. You'll see a **Summoner Input** section at the top
3. Enter your **Summoner Name** (e.g., "Faker")
4. Select your **Region** (e.g., EUW, NA, KR)
5. Click **"Fetch Live Game"**
6. The app will fetch enemy champions and display them

### Multiplayer Mode

1. Create or join a room via `/lobby`
2. Once in the game room, you'll see the **Summoner Input** section
3. Enter your summoner name and region
4. Click **"Fetch Live Game"**
5. All room members will see the updated champion data
6. Champion data is synchronized in real-time via Socket.IO

---

## 🔍 Features

### ✅ Champion Display

- **Before**: Generic role icons (TOP, JUNGLE, MID, ADC, SUPPORT)
- **After**: Actual champion icons from the live game (e.g., Aatrox, Lee Sin, Yasuo, Jinx, Thresh)

### ✅ Summoner Names

- Enemy summoner names are displayed under their champion icons
- Text is truncated if too long (with ellipsis)

### ✅ Auto-Fill Cosmic Insight

- If an enemy has the Cosmic Insight rune selected, it will be automatically enabled
- This ensures accurate Flash cooldown calculations (255s instead of 300s)

### ✅ Real-Time Sync (Multiplayer)

- When one user fetches live game data, all room members see the update
- Socket.IO broadcasts champion data to all connected clients
- Backend persists champion data in room state

---

## 🛠️ Technical Architecture

### Frontend (`apps/web/`)

**New Components:**
- `summoner-input.component.tsx` - Input form for summoner name + region
- `riot-api.service.ts` - Service to call Riot API route
- `riot-role-mapping.util.ts` - Maps enemy participants to LOL roles

**Modified Components:**
- `flash-button.component.tsx` - Displays champion icon + summoner name
- `role-card.component.tsx` - Uses champion data if available
- `game-solo.screen.tsx` - Integrated Summoner Input
- `game-multiplayer.screen.tsx` - Integrated Summoner Input + Socket sync
- `game.context.tsx` - Added `updateChampionData()` function

### API Route (`apps/web/app/api/riot/live-game/route.ts`)

**Endpoint**: `POST /api/riot/live-game`

**Request Body:**
```json
{
  "summonerName": "Faker",
  "region": "kr"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "allies": [...],
    "enemies": [
      {
        "championId": 266,
        "championName": "Aatrox",
        "championIconUrl": "https://ddragon.leagueoflegends.com/cdn/.../Aatrox.png",
        "summonerName": "EnemyPlayer1"
      },
      ...
    ],
    "gameStartTime": 1700000000000
  }
}
```

### Backend (`apps/api/`)

**New Socket Event**: `game:champion:update`

**Flow:**
1. Client emits `game:champion:update` with `roleMapping`
2. Backend calls `gameService.updateChampionData()`
3. Backend updates room state with champion data
4. Backend broadcasts `game:champion:update` to all room members
5. Backend emits updated `room:state` to sync everyone

**Game Service Method:**
```typescript
updateChampionData(roomId: string, roleMapping: Partial<Record<Role, any>>): void
```

---

## 🧪 Testing Guide

### Test Case 1: Solo Mode - Fetch Live Game

**Steps:**
1. Start a live League of Legends game
2. Open LolTimeFlash app (`http://localhost:6333/game`)
3. Enter your summoner name and region
4. Click "Fetch Live Game"

**Expected Results:**
- ✅ Toast: "Success - Live game data fetched successfully!"
- ✅ Champion icons replace role icons
- ✅ Summoner names appear under champions
- ✅ Cosmic Insight auto-enabled (if enemy has it)

### Test Case 2: Multiplayer Mode - Sync Champion Data

**Steps:**
1. User A creates a room
2. User B joins the same room
3. User A enters summoner name (currently in a live game)
4. User A clicks "Fetch Live Game"

**Expected Results:**
- ✅ Both users see champion icons
- ✅ Both users see summoner names
- ✅ Cosmic Insight synced across both clients
- ✅ Socket.IO emits `game:champion:update` event

### Test Case 3: Error Handling - Not in Game

**Steps:**
1. Enter a summoner name NOT currently in a game
2. Click "Fetch Live Game"

**Expected Results:**
- ✅ Toast: "Error - No active game found"
- ✅ UI remains unchanged (still showing role icons)

### Test Case 4: Error Handling - Invalid Summoner

**Steps:**
1. Enter an invalid summoner name (e.g., "NonExistentPlayer123456")
2. Click "Fetch Live Game"

**Expected Results:**
- ✅ Toast: "Error - Summoner not found"
- ✅ UI remains unchanged

---

## 📊 API Rate Limits

### Development API Key
- **20 requests every 1 second**
- **100 requests every 2 minutes**
- Valid for **24 hours**

### Production API Key
- **3,000 requests every 10 seconds**
- **180,000 requests every 10 minutes**
- No expiration

**Note**: The app makes multiple API calls per fetch:
1. `/summoner/v4/summoners/by-name` (1 call)
2. `/spectator/v4/active-games/by-summoner` (1 call)
3. Data Dragon API for champion icons (cached by CDN)

---

## 🚀 Deployment Considerations

### Environment Variables

**Production `.env`:**
```bash
RIOT_API_KEY=<your-production-api-key>
NEXT_PUBLIC_SOCKET_PORT=https://your-backend-url.com
```

### Security

- ⚠️ **NEVER** expose your Riot API key in client-side code
- ✅ API key is only used in server-side Next.js API routes
- ✅ All Riot API calls go through our backend proxy

### Caching (Future Improvement)

- Consider caching champion data in Redis (TTL: game duration)
- Reduce Riot API calls for same summoner/game
- Cache Data Dragon champion icons locally

---

## 🐛 Troubleshooting

### "Riot API key not configured"
- Check that `RIOT_API_KEY` is set in `.env.local`
- Restart the Next.js dev server after adding env var

### "No active game found"
- Make sure the summoner is currently in a live game (not in queue)
- Game must be past champion select (actually started)

### "Summoner not found"
- Check spelling of summoner name (case-insensitive)
- Make sure the region is correct
- Some special characters may need encoding

### Champion Icons Not Loading
- Check Data Dragon API is accessible
- Verify champion name mapping is correct
- Check browser console for CORS errors

---

## 📝 Known Limitations

1. **Role Detection**: Riot Spectator API doesn't provide explicit roles, so we assign roles based on participant order (TOP, JUNGLE, MID, ADC, SUPPORT). This may be inaccurate if enemies swap roles.

2. **API Key Expiration**: Development API keys expire after 24 hours. You'll need to refresh manually.

3. **Flash Detection**: We assume all enemies have Flash. If an enemy doesn't have Flash, their card will still appear but the timer won't be useful.

4. **Multi-Region Support**: Frontend supports all regions, but make sure your API key has access to the selected region.

---

## 🔮 Future Improvements

- [ ] Add role detection algorithm (smite = jungle, support items = support)
- [ ] Cache live game data in backend (Redis)
- [ ] Support custom region endpoints (regional routing)
- [ ] Add summoner profile pictures
- [ ] Show champion level/mastery points
- [ ] Detect other summoner spells (Teleport, Ignite, etc.)
- [ ] Add "Refresh" button to update live game data mid-game
- [ ] Show game mode (Ranked, Normal, ARAM, etc.)

---

## 📚 Resources

- **Riot Developer Portal**: https://developer.riotgames.com/
- **API Documentation**: https://developer.riotgames.com/apis
- **Data Dragon**: https://developer.riotgames.com/docs/lol#data-dragon
- **Summoner Spell IDs**: https://static.developer.riotgames.com/docs/lol/summonerSpells.json
- **Rune IDs**: https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/perks.json

---

## ✅ Feature Checklist

- ✅ Riot API integration (fetch live game)
- ✅ Parse enemy participants by role
- ✅ Display champion icons
- ✅ Display summoner names
- ✅ Auto-fill Cosmic Insight rune
- ✅ Socket.IO synchronization (multiplayer)
- ✅ Error handling (not in game, invalid summoner)
- ✅ Toast notifications
- ✅ TypeScript types
- ✅ Backend service methods
- ✅ Testing guide

---

**Last Updated**: November 18, 2024
**Version**: 0.4.0
**Status**: ✅ Feature Complete

