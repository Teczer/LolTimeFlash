import type { TRole, IChampionData } from '@/features/game/types/game.types'

interface RiotParticipantWithChampion {
  championId: number
  riotId?: string
  summonerName?: string
  championIconUrl?: string
  spell1Id: number
  spell2Id: number
}

/**
 * Role mapping configuration
 * Since Riot API doesn't provide direct role info in spectator API,
 * we assign roles based on participant order (0-4 for one team)
 * 
 * Standard role order in League: TOP, JUNGLE, MID, ADC, SUPPORT
 */
const ROLE_ORDER: TRole[] = ['TOP', 'JUNGLE', 'MID', 'ADC', 'SUPPORT']

/**
 * Map enemy participants to roles
 * @param enemies - Array of enemy participants from Riot API (v5)
 * @returns Object mapping roles to champion data
 */
export function mapEnemyParticipantsToRoles(
  enemies: RiotParticipantWithChampion[]
): Partial<Record<TRole, IChampionData>> {
  const roleMapping: Partial<Record<TRole, IChampionData>> = {}

  // Sort enemies by role (Jungle first, then others)
  const sortedEnemies = sortEnemiesByRole(enemies)

  // Map first 5 enemies to the 5 roles
  sortedEnemies.slice(0, 5).forEach((enemy, index) => {
    const role = ROLE_ORDER[index]

    if (role) {
      // Extract summoner name from riotId (GameName#TAG)
      const riotId = enemy.riotId || enemy.summonerName || 'Unknown'
      const summonerName = riotId.split('#')[0] || riotId

      roleMapping[role] = {
        championId: enemy.championId,
        championName: getChampionName(enemy.championId),
        championIconUrl: enemy.championIconUrl || '',
        summonerName: summonerName,
      }
    }
  })

  return roleMapping
}

/**
 * Get champion name by ID (placeholder, will be replaced by actual data)
 * This is a temporary function until we fetch champion data properly
 */
function getChampionName(championId: number): string {
  // Champion name mapping will be done by the API route
  return `Champion ${championId}`
}

/**
 * Get Data Dragon champion icon URL
 */
export function getChampionIconUrl(
  championName: string,
  version: string = '14.1.1'
): string {
  return `https://ddragon.leagueoflegends.com/cdn/${version}/img/champion/${championName}.png`
}

/**
 * Sort enemies by their likely role based on champion type
 * This is a heuristic approach since Riot API doesn't provide role directly
 * 
 * Priority:
 * 1. Jungle champions (typically have Smite - spell ID 11)
 * 2. Support champions (typically take support items)
 * 3. Remaining champions by default order
 */
export function sortEnemiesByRole(
  enemies: RiotParticipantWithChampion[]
): RiotParticipantWithChampion[] {
  const sorted = [...enemies]

  // Sort by team position if available
  // Otherwise, keep original order (which usually follows role order)
  sorted.sort((a, b) => {
    // Jungle detection (Smite = spell ID 11)
    const aIsJungle = a.spell1Id === 11 || a.spell2Id === 11
    const bIsJungle = b.spell1Id === 11 || b.spell2Id === 11

    if (aIsJungle && !bIsJungle) return -1
    if (!aIsJungle && bIsJungle) return 1

    return 0
  })

  return sorted
}

