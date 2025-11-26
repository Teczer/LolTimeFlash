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

      {/* Summoner Input */}
      <div className="hidden sm:flex">
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

      {/* Role Grid */}
      <div className="flex h-4/5 w-full flex-wrap sm:flex-nowrap">
        {LEAGUE_ROLES.map((role, index) => {
          const roleData = gameState.roles[role.name]
          const isLastRole = index === LEAGUE_ROLES.length - 1

          return (
            <RoleCard
              key={role.name}
              role={role}
              data={roleData}
              onFlashClick={() => handleFlashClick(role.name)}
              onToggleBoots={() => toggleItem(role.name, 'lucidityBoots')}
              onToggleRune={() => toggleItem(role.name, 'cosmicInsight')}
              onAdjustTimer={(seconds) => adjustTimer(role.name, seconds)}
              isLastRole={isLastRole}
            />
          )
        })}
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
