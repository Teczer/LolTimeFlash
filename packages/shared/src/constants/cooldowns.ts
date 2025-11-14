/**
 * Flash cooldown durations in seconds
 */
export const FLASH_COOLDOWNS = {
  /** Base Flash cooldown: 5 minutes */
  BASE: 300,
  
  /** With Lucidity Boots only: 4:28 (10.67% CDR) */
  WITH_BOOTS: 268,
  
  /** With Cosmic Insight only: 4:15 (15% CDR) */
  WITH_RUNE: 255,
  
  /** With both Lucidity Boots and Cosmic Insight: 3:51 (23% CDR) */
  WITH_BOTH: 231,
} as const

/**
 * Calculate Flash cooldown based on items/runes
 * 
 * @param hasBoots - Whether the player has Lucidity Boots
 * @param hasRune - Whether the player has Cosmic Insight rune
 * @returns Flash cooldown in seconds
 */
export function calculateFlashCooldown(
  hasBoots: boolean,
  hasRune: boolean
): number {
  if (hasBoots && hasRune) {
    return FLASH_COOLDOWNS.WITH_BOTH
  }
  if (hasBoots) {
    return FLASH_COOLDOWNS.WITH_BOOTS
  }
  if (hasRune) {
    return FLASH_COOLDOWNS.WITH_RUNE
  }
  return FLASH_COOLDOWNS.BASE
}

/**
 * Format seconds to MM:SS
 * 
 * @param seconds - Number of seconds
 * @returns Formatted string (e.g., "4:15")
 */
export function formatCooldown(seconds: number): string {
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
}

