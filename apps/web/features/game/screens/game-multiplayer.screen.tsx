/**
 * Multiplayer Game Screen
 * Real-time sync via WebSocket
 */

'use client'

import { useSocket } from '@/hooks/use-socket.hook'
import { useEffect } from 'react'
import { GameControls } from '../components/game-controls.component'
import { RoleCard } from '../components/role-card.component'
import { RoomInfo } from '../components/room-info.component'
import { UserList } from '../components/user-list.component'
import { LEAGUE_ROLES } from '../constants/game.constants'
import { GameProvider, useGameContext } from '../contexts/game.context'
import { timestampToCountdown } from '../hooks/use-flash-cooldown.hook'
import type { TRole } from '../types/game.types'

interface IMultiplayerContentProps {
  roomId: string
  username: string
}

const MultiplayerGameContent = (props: IMultiplayerContentProps) => {
  const { roomId, username } = props
  const { gameState, setGameState, audio } = useGameContext()

  // Socket hook for real-time communication
  const {
    gameState: backendGameState,
    isConnected,
    useFlash: emitUseFlash,
    cancelFlash: emitCancelFlash,
    toggleItem: emitToggleItem,
  } = useSocket({
    enabled: true,
    roomId,
    username,
  })

  // Sync backend state to local state
  // Backend sends timestamps (endsAt), convert to countdown (seconds)
  useEffect(() => {
    if (backendGameState) {
      setGameState((prevState) => {
        const newRoles = { ...backendGameState.roles }

        // Convert backend timestamps (endsAt) to local countdown (seconds)
        for (const roleKey in newRoles) {
          const role = roleKey as TRole
          const backendRoleData = newRoles[role]

          // If backend has a timestamp (number), convert to countdown
          if (typeof backendRoleData.isFlashed === 'number') {
            const countdown = timestampToCountdown(backendRoleData.isFlashed)

            // If countdown reached 0, set to false
            newRoles[role] = {
              ...backendRoleData,
              isFlashed: countdown > 0 ? countdown : false,
            }
          }
        }

        return {
          ...backendGameState,
          roles: newRoles,
        }
      })
    }
  }, [backendGameState, setGameState])

  const handleFlashClick = (role: TRole) => {
    const roleData = gameState.roles[role]

    // Play audio locally
    audio.play()

    if (typeof roleData.isFlashed === 'number') {
      // Cancel Flash
      emitCancelFlash(roomId, role)
    } else {
      // Use Flash
      emitUseFlash(roomId, role)
    }
  }

  const handleToggleItem = (
    role: TRole,
    item: 'lucidityBoots' | 'cosmicInsight'
  ) => {
    emitToggleItem(roomId, role, item)
  }

  return (
    <main className="flex h-screen flex-col items-center justify-start gap-2 p-6 sm:gap-0 sm:p-10">
      {/* Controls */}
      <GameControls volume={audio.volume} onToggleVolume={audio.toggleVolume} />

      {/* User List & Room Info */}
      <div className="flex items-center justify-center gap-1">
        <UserList users={gameState.users} />
        <RoomInfo roomId={roomId} />
      </div>

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
              onToggleBoots={() => handleToggleItem(role.name, 'lucidityBoots')}
              onToggleRune={() => handleToggleItem(role.name, 'cosmicInsight')}
              isLastRole={isLastRole}
            />
          )
        })}
      </div>

      {/* Connection Status */}
      {!isConnected && (
        <div className="fixed bottom-4 right-4 rounded-md bg-red-500 px-4 py-2 text-white">
          Disconnected
        </div>
      )}
    </main>
  )
}

interface IGameMultiplayerScreenProps {
  roomId: string
  username: string
}

export const GameMultiplayerScreen = (props: IGameMultiplayerScreenProps) => {
  const { roomId, username } = props

  return (
    <GameProvider>
      <MultiplayerGameContent roomId={roomId} username={username} />
    </GameProvider>
  )
}
