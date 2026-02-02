import {
  FLASH_BASE_COOLDOWN,
  FLASH_COOLDOWN_WITH_BOOTS,
} from '@/features/game/constants/game.constants'

/**
 * Calculate Flash cooldown based on Lucidity Boots
 */
export const calculateFlashCooldown = (hasBoots: boolean): number => {
  return hasBoots ? FLASH_COOLDOWN_WITH_BOOTS : FLASH_BASE_COOLDOWN
}

/**
 * ✅ Get remaining time for a Flash cooldown (timestamp-based)
 * Dynamically calculates countdown based on endsAt timestamp
 * @param isFlashed - Flash status (false or endsAt timestamp in ms)
 * @returns Remaining seconds (or 0 if not on cooldown)
 */
export const getRemainingTime = (isFlashed: false | number): number => {
  if (isFlashed === false) return 0

  const now = Date.now()
  const remainingMs = Math.max(0, isFlashed - now)
  return Math.ceil(remainingMs / 1000)
}

/**
 * Convert endsAt timestamp to countdown in seconds
 * @deprecated Use getRemainingTime() instead
 */
export const timestampToCountdown = (endsAt: number): number => {
  const now = Date.now()
  const remainingMs = Math.max(0, endsAt - now)
  return Math.ceil(remainingMs / 1000)
}

/**
 * Format cooldown time as MM:SS
 */
export const formatCooldown = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  const paddedSeconds =
    remainingSeconds < 10 ? `0${remainingSeconds}` : remainingSeconds
  return `${minutes}:${paddedSeconds}`
}
