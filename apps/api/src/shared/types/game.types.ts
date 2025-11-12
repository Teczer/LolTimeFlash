/**
 * League of Legends roles
 */
export type Role = 'TOP' | 'JUNGLE' | 'MID' | 'ADC' | 'SUPPORT'

/**
 * Summoner spell data for a single role
 */
export interface SummonerData {
  /**
   * Flash cooldown status
   * - false: Flash is available
   * - number: Seconds remaining on cooldown
   */
  isFlashed: boolean | number
  
  /**
   * Whether the player has Lucidity Boots (10.67% CDR)
   */
  lucidityBoots: boolean
  
  /**
   * Whether the player has Cosmic Insight rune (15% CDR)
   */
  cosmicInsight: boolean
}

/**
 * Complete role data for all 5 roles
 */
export interface RoleData {
  TOP: SummonerData
  JUNGLE: SummonerData
  MID: SummonerData
  SUPPORT: SummonerData
  ADC: SummonerData
}

/**
 * Complete game state for a room
 */
export interface GameState {
  /**
   * Room ID (10 character alphanumeric string)
   */
  roomId: string
  
  /**
   * List of usernames in the room
   */
  users: string[]
  
  /**
   * Role data for all 5 enemy champions
   */
  roles: RoleData
  
  /**
   * Room creation timestamp
   */
  createdAt: Date
  
  /**
   * Last update timestamp
   */
  updatedAt: Date
}

/**
 * Flash event data
 */
export interface FlashEventData {
  /**
   * Role that used Flash
   */
  role: Role
  
  /**
   * Username of the player who triggered the event
   */
  username: string
  
  /**
   * Cooldown duration in seconds
   */
  cooldown: number
  
  /**
   * Timestamp when Flash will be available again
   */
  endsAt: number
}

/**
 * Item toggle event data
 */
export interface ItemToggleData {
  /**
   * Role that toggled an item
   */
  role: Role
  
  /**
   * Item that was toggled
   */
  item: 'lucidityBoots' | 'cosmicInsight'
  
  /**
   * New value for the item
   */
  value: boolean
  
  /**
   * Username of the player who triggered the event
   */
  username: string
}

