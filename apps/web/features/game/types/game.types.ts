/**
 * Game feature types
 * Following I/T prefix conventions
 */

/**
 * League of Legends role type
 */
export type TRole = 'TOP' | 'JUNGLE' | 'MID' | 'ADC' | 'SUPPORT'

/**
 * Summoner spell data for a single role
 */
export interface ISummonerData {
  isFlashed: false | number
  lucidityBoots: boolean
  cosmicInsight: boolean
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

