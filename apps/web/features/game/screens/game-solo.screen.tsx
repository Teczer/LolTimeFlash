'use client'

import { mapEnemyParticipantsToRoles } from '@/lib/riot-role-mapping.util'
import { GameControls } from '../components/game-controls.component'
import { GameInfoDisplay } from '../components/game-info-display.component'
import { RoleCard } from '../components/role-card.component'
import { SummonerInput } from '../components/summoner-input.component'
import { LEAGUE_ROLES } from '../constants/game.constants'
import { GameProvider, useGameContext } from '../contexts/game.context'
import type { TRole } from '../types/game.types'

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
      <SummonerInput onGameDataFetched={handleGameDataFetched} />

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
