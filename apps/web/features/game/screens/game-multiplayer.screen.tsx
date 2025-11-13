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

  // Sync backend state to local state (smart merge to preserve local timers)
  useEffect(() => {
    if (backendGameState) {
      setGameState((prevState) => {
        const newRoles = { ...backendGameState.roles }

        // Preserve local timer values if they're already counting down
        for (const roleKey in newRoles) {
          const role = roleKey as TRole
          const prevRoleData = prevState.roles[role]
          const newRoleData = newRoles[role]

          // If timer was already running locally, keep the local countdown
          // Only update if the backend value changed (new Flash usage or cancel)
          if (
            typeof prevRoleData.isFlashed === 'number' &&
            typeof newRoleData.isFlashed === 'number'
          ) {
            // If backend has a NEW higher value, it means someone triggered Flash again
            // Otherwise, keep the local countdown
            if (newRoleData.isFlashed > prevRoleData.isFlashed) {
              // New Flash triggered, accept backend value
              newRoles[role] = newRoleData
            } else {
              // Keep local countdown
              newRoles[role] = {
                ...newRoleData,
                isFlashed: prevRoleData.isFlashed,
              }
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
