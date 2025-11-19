/**
 * Re-export types from NestJS shared library
 * 
 * NOTE: This package is a thin wrapper for Next.js webpack compatibility.
 * The actual tsconfig path resolution points directly to apps/api/libs/shared/src
 * This file exists primarily for webpack and runtime require() calls.
 */

// Re-export all types
export * from '../../apps/api/libs/shared/src/types/game.types'
export * from '../../apps/api/libs/shared/src/types/socket.types'
export * from '../../apps/api/libs/shared/src/types/champion.types'
export * from '../../apps/api/libs/shared/src/types/riot-api.types'

// Re-export all constants
export * from '../../apps/api/libs/shared/src/constants/roles'
export * from '../../apps/api/libs/shared/src/constants/cooldowns'
