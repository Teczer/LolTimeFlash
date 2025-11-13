/**
 * Game Context - Shared state for game feature
 * Provides game state and actions to all child components
 */

'use client'

import { createContext, useContext, useState, useCallback } from 'react'
import type { IGameData, TRole } from '../types/game.types'
import { DEFAULT_GAME_DATA } from '../constants/game.constants'
import { calculateFlashCooldown } from '../hooks/use-flash-cooldown.hook'
import { useGameTimer } from '../hooks/use-game-timer.hook'
import { useAudio } from '../hooks/use-audio.hook'

interface IGameContextValue {
  gameState: IGameData
  setGameState: React.Dispatch<React.SetStateAction<IGameData>>
  useFlash: (role: TRole) => void
  cancelFlash: (role: TRole) => void
  toggleItem: (role: TRole, item: 'lucidityBoots' | 'cosmicInsight') => void
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

  // Use Flash for a role
  const useFlash = useCallback(
    (role: TRole) => {
      setGameState((prev) => {
        const roleData = prev.roles[role]

        // Calculate cooldown based on items
        const cooldown = calculateFlashCooldown({
          lucidityBoots: roleData.lucidityBoots,
          cosmicInsight: roleData.cosmicInsight,
        })

        return {
          ...prev,
          roles: {
            ...prev.roles,
            [role]: {
              ...roleData,
              isFlashed: cooldown,
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

  // Toggle item (Boots or Rune)
  const toggleItem = useCallback(
    (role: TRole, item: 'lucidityBoots' | 'cosmicInsight') => {
      setGameState((prev) => {
        const roleData = prev.roles[role]
        const newItemValue = !roleData[item]

        // If Flash is on cooldown, recalculate
        let newFlashValue = roleData.isFlashed
        if (typeof roleData.isFlashed === 'number') {
          newFlashValue = calculateFlashCooldown({
            lucidityBoots: item === 'lucidityBoots' ? newItemValue : roleData.lucidityBoots,
            cosmicInsight: item === 'cosmicInsight' ? newItemValue : roleData.cosmicInsight,
          })
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

  const value: IGameContextValue = {
    gameState,
    setGameState,
    useFlash,
    cancelFlash,
    toggleItem,
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

