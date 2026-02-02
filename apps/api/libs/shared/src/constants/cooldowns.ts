/**
 * Flash cooldown durations in seconds
 */
export const FLASH_COOLDOWNS = {
  /** Base Flash cooldown: 5 minutes */
  BASE: 300,

  /** With Lucidity Boots: 4:28 (10.67% CDR) */
  WITH_BOOTS: 268,
} as const;

/**
 * Calculate Flash cooldown based on items
 *
 * @param hasBoots - Whether the player has Lucidity Boots
 * @returns Flash cooldown in seconds
 */
export function calculateFlashCooldown(hasBoots: boolean): number {
  return hasBoots ? FLASH_COOLDOWNS.WITH_BOOTS : FLASH_COOLDOWNS.BASE;
}

/**
 * Format seconds to MM:SS
 *
 * @param seconds - Number of seconds
 * @returns Formatted string (e.g., "4:15")
 */
export function formatCooldown(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

/**
 * Default reaction time compensation (in seconds)
 * Applied when Flash is activated to account for human reaction delay
 * This compensates for:
 * - Average human reaction time (~1-2s)
 * - Communication delay in team (~1s)
 * - Safety margin for Flash return anticipation
 */
export const REACTION_TIME_COMPENSATION = 3;
