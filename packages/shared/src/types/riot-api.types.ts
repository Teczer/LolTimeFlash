/**
 * Riot API Region
 */
export type RiotRegion =
  | 'br1'
  | 'eun1'
  | 'euw1'
  | 'jp1'
  | 'kr'
  | 'la1'
  | 'la2'
  | 'na1'
  | 'oc1'
  | 'ph2'
  | 'ru'
  | 'sg2'
  | 'th2'
  | 'tr1'
  | 'tw2'
  | 'vn2'

/**
 * Riot API Perks (Runes)
 */
export interface RiotPerks {
  perkIds: number[]
  perkStyle: number
  perkSubStyle: number
}

/**
 * Riot API Participant (Player in game)
 */
export interface RiotParticipant {
  teamId: number
  spell1Id: number
  spell2Id: number
  championId: number
  championName?: string
  summonerName: string
  summonerId: string
  puuid: string
  perks: RiotPerks
  riotId?: string
}

/**
 * Riot API Active Game Response
 */
export interface RiotActiveGame {
  gameId: number
  gameType: string
  gameStartTime: number
  mapId: number
  gameLength: number
  participants: RiotParticipant[]
}

/**
 * Summoner Info from Riot API
 */
export interface RiotSummoner {
  id: string
  accountId: string
  puuid: string
  name: string
  profileIconId: number
  summonerLevel: number
}

/**
 * Request to fetch live game data
 */
export interface FetchLiveGameRequest {
  summonerName: string
  region: RiotRegion
}

/**
 * Response with live game data
 */
export interface FetchLiveGameResponse {
  success: boolean
  data?: {
    allies: RiotParticipant[]
    enemies: RiotParticipant[]
    gameStartTime: number
  }
  error?: string
}

