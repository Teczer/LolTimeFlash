/**
 * Solo Game Screen
 * Local-only Flash timer (no WebSocket)
 */

'use client'

import { GameProvider, useGameContext } from '../contexts/game.context'
import { GameControls } from '../components/game-controls.component'
import { RoleCard } from '../components/role-card.component'
import { LEAGUE_ROLES } from '../constants/game.constants'
import type { TRole } from '../types/game.types'

const SoloGameContent = () => {
  const { gameState, useFlash, cancelFlash, toggleItem, audio } = useGameContext()

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

  return (
    <main className="flex h-screen flex-col items-center gap-2 p-6 sm:gap-0 sm:p-10 justify-center">
      {/* Controls */}
      <GameControls volume={audio.volume} onToggleVolume={audio.toggleVolume} />

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

