import { useEffect } from 'react'
import type { IGameData, IRoleData } from '@/features/game/types/game.types'

interface IUseGameTimerOptions {
  gameState: IGameData
  setGameState: React.Dispatch<React.SetStateAction<IGameData>>
}

/**
 * ✅ NEW APPROACH: Calculate countdown dynamically based on timestamps
 * No more local decrement (prevents time drift and synchronization issues)
 *
 * This hook only updates state when timers expire (isFlashed becomes false)
 * The actual countdown display is calculated dynamically in components using getRemainingTime()
 */
export const useGameTimer = (options: IUseGameTimerOptions): void => {
  const { gameState, setGameState } = options

  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now()

      setGameState((prevState) => {
        const updatedRoles = { ...prevState.roles } as IRoleData
        let hasChanges = false

        // Check all active timers and update only expired ones
        for (const key in updatedRoles) {
          const roleKey = key as keyof IRoleData
          const roleData = updatedRoles[roleKey]

          // If Flash is on cooldown (isFlashed is a timestamp)
          if (typeof roleData.isFlashed === 'number') {
            const endsAt = roleData.isFlashed
            const remainingMs = endsAt - now

            // If timer expired, set Flash to available
            if (remainingMs <= 0) {
              updatedRoles[roleKey] = {
                ...roleData,
                isFlashed: false,
              }
              hasChanges = true
            }
            // Otherwise, timer is still running (no state change needed)
            // The render will calculate the countdown dynamically via getRemainingTime()
          }
        }

        return hasChanges ? { ...prevState, roles: updatedRoles } : prevState
      })
    }, 100) // Check every 100ms for smoother expiration detection

    return () => clearInterval(interval)
  }, [setGameState]) // Only depends on setGameState (stable reference)
}

