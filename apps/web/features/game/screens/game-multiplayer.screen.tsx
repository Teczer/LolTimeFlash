'use client'

import { useSocket } from '@/hooks/use-socket.hook'
import { mapEnemyParticipantsToRoles } from '@/lib/riot-role-mapping.util'
import { useEffect } from 'react'
import { ConnectionStatus } from '../components/connection-status.component'
import { GameControls } from '../components/game-controls.component'
import { GameInfoDisplay } from '../components/game-info-display.component'
import { RoleCard } from '../components/role-card.component'
import { RoomInfo } from '../components/room-info.component'
import { SummonerInput } from '../components/summoner-input.component'
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
  const { gameState, setGameState, updateChampionData, audio } =
    useGameContext()

  // Socket hook for real-time communication
  const {
    gameState: backendGameState,
    isConnected,
    reconnectAttempts,
    useFlash: emitUseFlash,
    cancelFlash: emitCancelFlash,
    toggleItem: emitToggleItem,
    updateChampionData: emitUpdateChampionData,
  } = useSocket({
    enabled: true,
    roomId,
    username,
  })

  // ✅ Sync backend state to local state
  // Backend sends timestamps (endsAt), store them directly (no conversion)
  useEffect(() => {
    if (backendGameState) {
      setGameState((prevState) => {
        const newRoles = { ...prevState.roles }

        // Update roles with backend data while preserving champion info
        for (const roleKey in backendGameState.roles) {
          const role = roleKey as TRole
          const backendRoleData = backendGameState.roles[role]
          const currentRoleData = newRoles[role]

          // ✅ Store backend timestamps directly (no conversion to countdown)
          // Countdown will be calculated dynamically in components using getRemainingTime()
          const isFlashedValue: number | false = backendRoleData.isFlashed

          // Merge backend data with existing champion data
          newRoles[role] = {
            isFlashed: isFlashedValue,
            lucidityBoots: backendRoleData.lucidityBoots,
            cosmicInsight: backendRoleData.cosmicInsight,
            // Preserve champion data from backend or keep existing
            champion: backendRoleData.champion || currentRoleData?.champion,
          }
        }

        return {
          ...prevState,
          users: backendGameState.users,
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
      emitCancelFlash(role)
    } else {
      // Use Flash
      emitUseFlash(role)
    }
  }

  const handleToggleItem = (
    role: TRole,
    item: 'lucidityBoots' | 'cosmicInsight'
  ) => {
    emitToggleItem(role, item)
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

    const gameInfo = {
      gameId: data.gameId,
      gameStartTime: data.gameStartTime,
    }

    // Update local game state with champion data and game info
    updateChampionData(roleMapping, gameInfo)

    // Emit to socket for synchronization across room
    emitUpdateChampionData(roleMapping, gameInfo)
  }

  return (
    <main className="flex h-screen flex-col items-center justify-start gap-2 p-6 sm:gap-2 sm:p-10">
      {/* Connection Status */}
      <ConnectionStatus
        isConnected={isConnected}
        reconnectAttempts={reconnectAttempts}
      />

      {/* Controls */}
      <GameControls volume={audio.volume} onToggleVolume={audio.toggleVolume} />

      {/* User List & Room Info */}
      <div className="flex items-center justify-center gap-1">
        <UserList users={gameState.users} />
        <RoomInfo roomId={roomId} />
      </div>

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
              onToggleBoots={() => handleToggleItem(role.name, 'lucidityBoots')}
              onToggleRune={() => handleToggleItem(role.name, 'cosmicInsight')}
              isLastRole={isLastRole}
            />
          )
        })}
      </div>
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
