'use client'

import { GameControls } from '@/features/game/components/controls'
import { RoleCard } from '@/features/game/components/game'
import { MobileUserListDrawer } from '@/features/game/components/room'
import { GameInfoDisplay } from '@/features/game/components/status'
import { SummonerInput } from '@/features/game/components/summoner-input.component'
import { LEAGUE_ROLES } from '@/features/game/constants/game.constants'
import {
  GameProvider,
  useGameContext,
} from '@/features/game/contexts/game.context'
import type { TRole } from '@/features/game/types/game.types'
import { mapEnemyParticipantsToRoles } from '@/lib/riot-role-mapping.util'

const SoloGameContent = () => {
  const {
    gameState,
    useFlash,
    cancelFlash,
    toggleItem,
    adjustTimer,
    updateChampionData,
    audio,
  } = useGameContext()

  const handleFlashClick = (role: TRole) => {
    const roleData = gameState.roles[role]

    if (typeof roleData.isFlashed === 'number') {
      // Flash is on cooldown, cancel it
      cancelFlash(role)
    } else {
      // Flash is available, use it
      useFlash(role)
    }
  }

  const handleGameDataFetched = (data: {
    enemies: Array<{
      championId: number
      riotId?: string
      summonerName?: string
      championIconUrl?: string
      spell1Id: number
      spell2Id: number
    }>
    gameId: number
    gameStartTime: number
    gameLength: number
  }) => {
    // Map enemy participants to roles
    const roleMapping = mapEnemyParticipantsToRoles(data.enemies)

    // Update game state with champion data and game info
    updateChampionData(roleMapping, {
      gameId: data.gameId,
      gameStartTime: data.gameStartTime,
    })
  }

  return (
    <main className="flex h-screen flex-col items-center justify-center gap-2 p-6 sm:gap-4 sm:p-10">
      {/* Controls */}
      <GameControls volume={audio.volume} onToggleVolume={audio.toggleVolume} />

      {/* Summoner Input - Desktop only */}
      <div className="hidden md:flex">
        <SummonerInput onGameDataFetched={handleGameDataFetched} />
      </div>

      {/* Mobile User List Drawer */}
      <MobileUserListDrawer
        users={[]}
        onGameDataFetched={handleGameDataFetched}
      />

      {/* Game Info Display */}
      {gameState.gameId && gameState.gameStartTime && (
        <GameInfoDisplay
          gameId={gameState.gameId}
          gameStartTime={gameState.gameStartTime}
        />
      )}

      {/* Role Grid - 2-1-2 on mobile/tablet, 5 columns on desktop */}
      <div className="flex h-4/5 w-full flex-col justify-evenly md:flex-row md:items-center">
        {/* Mobile/Tablet: 2-1-2 layout */}
        <div className="flex flex-col items-center justify-evenly gap-4 md:hidden">
          {/* Row 1: TOP, JUNGLE */}
          <div className="flex w-full justify-evenly">
            {LEAGUE_ROLES.slice(0, 2).map((role) => (
              <RoleCard
                key={role.name}
                role={role}
                data={gameState.roles[role.name]}
                onFlashClick={() => handleFlashClick(role.name)}
                onToggleBoots={() => toggleItem(role.name, 'lucidityBoots')}
                onAdjustTimer={(seconds) => adjustTimer(role.name, seconds)}
              />
            ))}
          </div>

          {/* Row 2: MID (centered) */}
          <div className="flex justify-center">
            <RoleCard
              role={LEAGUE_ROLES[2]}
              data={gameState.roles[LEAGUE_ROLES[2].name]}
              onFlashClick={() => handleFlashClick(LEAGUE_ROLES[2].name)}
              onToggleBoots={() =>
                toggleItem(LEAGUE_ROLES[2].name, 'lucidityBoots')
              }
              onAdjustTimer={(seconds) =>
                adjustTimer(LEAGUE_ROLES[2].name, seconds)
              }
            />
          </div>

          {/* Row 3: ADC, SUPPORT */}
          <div className="flex w-full justify-evenly">
            {LEAGUE_ROLES.slice(3, 5).map((role) => (
              <RoleCard
                key={role.name}
                role={role}
                data={gameState.roles[role.name]}
                onFlashClick={() => handleFlashClick(role.name)}
                onToggleBoots={() => toggleItem(role.name, 'lucidityBoots')}
                onAdjustTimer={(seconds) => adjustTimer(role.name, seconds)}
              />
            ))}
          </div>
        </div>

        {/* Desktop: 5 columns layout */}
        <div className="hidden w-full justify-evenly md:flex">
          {LEAGUE_ROLES.map((role) => (
            <RoleCard
              key={role.name}
              role={role}
              data={gameState.roles[role.name]}
              onFlashClick={() => handleFlashClick(role.name)}
              onToggleBoots={() => toggleItem(role.name, 'lucidityBoots')}
              onAdjustTimer={(seconds) => adjustTimer(role.name, seconds)}
            />
          ))}
        </div>
      </div>
    </main>
  )
}

export const GameSoloScreen = () => {
  return (
    <GameProvider>
      <SoloGameContent />
    </GameProvider>
  )
}
