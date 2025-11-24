'use client'

import { createContext, useCallback, useContext, useState } from 'react'
import { DEFAULT_GAME_DATA } from '../constants/game.constants'
import { useAudio } from '../hooks/use-audio.hook'
import { calculateFlashCooldown } from '../hooks/use-flash-cooldown.hook'
import { useGameTimer } from '../hooks/use-game-timer.hook'
import type { IChampionData, IGameData, TRole } from '../types/game.types'

interface IGameContextValue {
  gameState: IGameData
  setGameState: React.Dispatch<React.SetStateAction<IGameData>>
  useFlash: (role: TRole) => void
  cancelFlash: (role: TRole) => void
  toggleItem: (role: TRole, item: 'lucidityBoots' | 'cosmicInsight') => void
  adjustTimer: (role: TRole, adjustmentSeconds: number) => void
  updateChampionData: (
    roleMapping: Partial<Record<TRole, IChampionData>>,
    gameInfo?: { gameId: number; gameStartTime: number }
  ) => void
  audio: {
    play: () => Promise<void>
    volume: 'on' | 'off'
    toggleVolume: () => void
  }
}

const GameContext = createContext<IGameContextValue | undefined>(undefined)

interface IGameProviderProps {
  children: React.ReactNode
  initialState?: IGameData
}

export const GameProvider = (props: IGameProviderProps) => {
  const { children, initialState = DEFAULT_GAME_DATA } = props

  const [gameState, setGameState] = useState<IGameData>(initialState)
  const audio = useAudio()

  // Timer countdown (decrements every second)
  useGameTimer({ gameState, setGameState })

  // ✅ Use Flash for a role (timestamp-based)
  const useFlash = useCallback(
    (role: TRole) => {
      setGameState((prev) => {
        const roleData = prev.roles[role]

        // Calculate cooldown based on items (in seconds)
        const cooldownSeconds = calculateFlashCooldown({
          lucidityBoots: roleData.lucidityBoots,
          cosmicInsight: roleData.cosmicInsight,
        })

        // ✅ Apply 3s compensation and convert to timestamp
        const REACTION_COMPENSATION = 3 // seconds
        const adjustedCooldown = cooldownSeconds - REACTION_COMPENSATION
        const endsAt = Date.now() + adjustedCooldown * 1000

        return {
          ...prev,
          roles: {
            ...prev.roles,
            [role]: {
              ...roleData,
              isFlashed: endsAt, // Store timestamp instead of countdown
            },
          },
        }
      })

      // Play audio
      audio.play()
    },
    [audio]
  )

  // Cancel Flash cooldown
  const cancelFlash = useCallback((role: TRole) => {
    setGameState((prev) => ({
      ...prev,
      roles: {
        ...prev.roles,
        [role]: {
          ...prev.roles[role],
          isFlashed: false,
        },
      },
    }))
  }, [])

  // ✅ Toggle item (Boots or Rune) - timestamp-based
  const toggleItem = useCallback(
    (role: TRole, item: 'lucidityBoots' | 'cosmicInsight') => {
      setGameState((prev) => {
        const roleData = prev.roles[role]
        const newItemValue = !roleData[item]

        // If Flash is on cooldown, recalculate timestamp proportionally
        let newFlashValue = roleData.isFlashed
        if (typeof roleData.isFlashed === 'number') {
          const endsAt = roleData.isFlashed
          const now = Date.now()
          const remainingMs = Math.max(0, endsAt - now)

          // Calculate old and new max cooldowns (in seconds)
          const oldMaxCooldown = calculateFlashCooldown({
            lucidityBoots: roleData.lucidityBoots,
            cosmicInsight: roleData.cosmicInsight,
          })

          const newMaxCooldown = calculateFlashCooldown({
            lucidityBoots:
              item === 'lucidityBoots' ? newItemValue : roleData.lucidityBoots,
            cosmicInsight:
              item === 'cosmicInsight' ? newItemValue : roleData.cosmicInsight,
          })

          // Keep the same percentage remaining
          const percentageRemaining = remainingMs / (oldMaxCooldown * 1000)
          const newRemainingMs = percentageRemaining * newMaxCooldown * 1000

          // ✅ Recalculate new endsAt timestamp
          newFlashValue = now + newRemainingMs
        }

        return {
          ...prev,
          roles: {
            ...prev.roles,
            [role]: {
              ...roleData,
              [item]: newItemValue,
              isFlashed: newFlashValue,
            },
          },
        }
      })
    },
    []
  )

  // ✅ Adjust Flash timer manually (add or subtract seconds)
  const adjustTimer = useCallback((role: TRole, adjustmentSeconds: number) => {
    setGameState((prev) => {
      const roleData = prev.roles[role]

      // Only adjust if Flash is on cooldown
      if (typeof roleData.isFlashed === 'number') {
        const currentEndsAt = roleData.isFlashed
        const newEndsAt = currentEndsAt + adjustmentSeconds * 1000

        // Don't allow negative timers (min: current time)
        const adjustedEndsAt = Math.max(Date.now(), newEndsAt)

        return {
          ...prev,
          roles: {
            ...prev.roles,
            [role]: {
              ...roleData,
              isFlashed: adjustedEndsAt,
            },
          },
        }
      }

      return prev
    })
  }, [])

  // Update champion data from Riot API
  const updateChampionData = useCallback(
    (
      roleMapping: Partial<Record<TRole, IChampionData>>,
      gameInfo?: { gameId: number; gameStartTime: number }
    ) => {
      setGameState((prev) => {
        const newRoles = { ...prev.roles }

        // Update each role with champion data
        for (const roleKey in roleMapping) {
          const role = roleKey as TRole
          const championData = roleMapping[role]

          if (championData) {
            newRoles[role] = {
              ...newRoles[role],
              champion: {
                championId: championData.championId,
                championName: championData.championName,
                championIconUrl: championData.championIconUrl,
                summonerName: championData.summonerName,
              },
            }
          }
        }

        return {
          ...prev,
          roles: newRoles,
          ...(gameInfo && {
            gameId: gameInfo.gameId,
            gameStartTime: gameInfo.gameStartTime,
          }),
        }
      })
    },
    []
  )

  const value: IGameContextValue = {
    gameState,
    setGameState,
    useFlash,
    cancelFlash,
    toggleItem,
    adjustTimer,
    updateChampionData,
    audio: {
      play: audio.play,
      volume: audio.volume,
      toggleVolume: audio.toggleVolume,
    },
  }

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>
}

/**
 * Hook to use Game context
 */
export const useGameContext = (): IGameContextValue => {
  const context = useContext(GameContext)
  if (!context) {
    throw new Error('useGameContext must be used within GameProvider')
  }
  return context
}
