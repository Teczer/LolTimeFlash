/**
 * GAME Types
 */
export interface LeagueRoles {
  name: string
  src: string
}

export interface SummonerData {
  isFlashed: boolean | number
  lucidityBoots: boolean
  cosmicInsight: boolean
}

export interface RoleData {
  TOP: SummonerData
  JUNGLE: SummonerData
  MID: SummonerData
  SUPPORT: SummonerData
  ADC: SummonerData
}

export interface GameData {
  users: string[]
  roles: RoleData
}

/**
 * Récupère la clé correspondante à un rôle donné si elle est valide.
 * Cette fonction est utilisée pour s'assurer que le rôle fourni est l'un des rôles définis dans RoleData.
 * Si le rôle est valide, elle retourne la clé de type spécifique à RoleData, sinon elle retourne null.
 */

export function getRoleKey(role: string): keyof RoleData | null {
  const validRoles: Record<string, boolean> = {
    TOP: true,
    JUNGLE: true,
    MID: true,
    SUPPORT: true,
    ADC: true,
  }

  return validRoles[role] ? (role as keyof RoleData) : null
}
