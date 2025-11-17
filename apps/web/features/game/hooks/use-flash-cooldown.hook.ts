import type { TRole, ISummonerData } from '../types/game.types'
import {
  FLASH_BASE_COOLDOWN,
  FLASH_COOLDOWN_WITH_BOOTS,
  FLASH_COOLDOWN_WITH_RUNE,
  FLASH_COOLDOWN_WITH_BOTH,
} from '../constants/game.constants'

interface ICalculateCooldownOptions {
  lucidityBoots: boolean
  cosmicInsight: boolean
}

export const calculateFlashCooldown = (options: ICalculateCooldownOptions): number => {
  const { lucidityBoots, cosmicInsight } = options

  if (lucidityBoots && cosmicInsight) {
    return FLASH_COOLDOWN_WITH_BOTH
  }
  if (lucidityBoots) {
    return FLASH_COOLDOWN_WITH_BOOTS
  }
  if (cosmicInsight) {
    return FLASH_COOLDOWN_WITH_RUNE
  }
  return FLASH_BASE_COOLDOWN
}

/**
 * Convert endsAt timestamp to countdown in seconds
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
  const paddedSeconds = remainingSeconds < 10 ? `0${remainingSeconds}` : remainingSeconds
  return `${minutes}:${paddedSeconds}`
}

