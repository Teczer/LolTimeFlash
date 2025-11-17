import type { Role } from '../types/game.types';

/**
 * All League of Legends roles
 */
export const ROLES: readonly Role[] = [
  'TOP',
  'JUNGLE',
  'MID',
  'ADC',
  'SUPPORT',
] as const;

/**
 * Check if a string is a valid role
 */
export function isValidRole(role: string): role is Role {
  return ROLES.includes(role as Role);
}

/**
 * Default summoner data
 */
export const DEFAULT_SUMMONER_DATA = {
  isFlashed: false,
  lucidityBoots: false,
  cosmicInsight: false,
} as const;
