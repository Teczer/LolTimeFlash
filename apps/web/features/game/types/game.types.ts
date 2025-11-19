/**
 * League of Legends role type
 */
export type TRole = 'TOP' | 'JUNGLE' | 'MID' | 'ADC' | 'SUPPORT'

/**
 * Champion data for a role
 */
export interface IChampionData {
  /**
   * Champion ID (e.g., 266 for Aatrox)
   */
  championId: number
  
  /**
   * Champion name (e.g., "Aatrox")
   */
  championName: string
  
  /**
   * Champion icon URL
   */
  championIconUrl: string
  
  /**
   * Summoner name of the player
   */
  summonerName: string
}

/**
 * Summoner spell data for a single role
 */
export interface ISummonerData {
  /**
   * Flash cooldown status
   * - false: Flash is available
   * - number: Countdown in seconds (local state)
   * 
   * Note: Backend stores timestamp (endsAt in ms), frontend converts to countdown
   */
  isFlashed: false | number
  lucidityBoots: boolean
  cosmicInsight: boolean
  
  /**
   * Champion data (optional, populated from live game)
   */
  champion?: IChampionData
}

/**
 * Complete role data for all 5 roles
 */
export interface IRoleData {
  TOP: ISummonerData
  JUNGLE: ISummonerData
  MID: ISummonerData
  SUPPORT: ISummonerData
  ADC: ISummonerData
}

/**
 * Complete game state
 */
export interface IGameData {
  users: string[]
  roles: IRoleData
  
  /**
   * Summoner name of the player (for Riot API integration)
   */
  summonerName?: string
  
  /**
   * Region of the player (e.g., 'euw1', 'na1')
   */
  region?: string

  /**
   * Riot game ID (from live game)
   */
  gameId?: number

  /**
   * Game start timestamp in milliseconds (from Riot API)
   */
  gameStartTime?: number
}

/**
 * League role with icon
 */
export interface ILeagueRole {
  name: TRole
  src: string
}

/**
 * Game mode type
 */
export type TGameMode = 'solo' | 'multiplayer'

