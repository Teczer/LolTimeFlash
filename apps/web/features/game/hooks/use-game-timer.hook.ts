/**
 * Game timer hook - handles countdown logic
 */

import { useEffect } from 'react'
import type { IGameData, IRoleData } from '../types/game.types'

interface IUseGameTimerOptions {
  gameState: IGameData
  setGameState: React.Dispatch<React.SetStateAction<IGameData>>
}

export const useGameTimer = (options: IUseGameTimerOptions): void => {
  const { gameState, setGameState } = options

  useEffect(() => {
    const interval = setInterval(() => {
      setGameState((prevState) => {
        const updatedRoles = { ...prevState.roles } as IRoleData
        let hasChanges = false

        // Decrement all active timers
        for (const key in updatedRoles) {
          const roleKey = key as keyof IRoleData
          const roleData = updatedRoles[roleKey]

          if (typeof roleData.isFlashed === 'number') {
            const newValue = roleData.isFlashed - 1

            if (newValue <= 0) {
              updatedRoles[roleKey] = {
                ...roleData,
                isFlashed: false,
              }
            } else {
              updatedRoles[roleKey] = {
                ...roleData,
                isFlashed: newValue,
              }
            }
            hasChanges = true
          }
        }

        return hasChanges ? { ...prevState, roles: updatedRoles } : prevState
      })
    }, 1000) // Every second

    return () => clearInterval(interval)
  }, [setGameState]) // Only depends on setGameState (stable reference)
}

