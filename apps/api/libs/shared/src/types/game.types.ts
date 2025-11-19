/**
 * League of Legends roles
 */
export type Role = 'TOP' | 'JUNGLE' | 'MID' | 'ADC' | 'SUPPORT';

/**
 * Champion data for a role
 */
export interface ChampionData {
  /**
   * Champion ID (e.g., 266 for Aatrox)
   */
  championId: number;

  /**
   * Champion name (e.g., "Aatrox")
   */
  championName: string;

  /**
   * Champion icon URL
   */
  championIconUrl: string;

  /**
   * Summoner name of the player
   */
  summonerName: string;
}

/**
 * Extended champion data (for live game updates)
 * Note: Cosmic Insight is NOT auto-detected (Riot API doesn't provide detailed rune data)
 * Players must manually toggle it
 */
export type ChampionUpdateData = ChampionData;

/**
 * Mapping of roles to champion data (for champion updates)
 */
export type ChampionRoleMapping = Partial<Record<Role, ChampionUpdateData>>;

/**
 * Summoner spell data for a single role
 */
export interface SummonerData {
  /**
   * Flash cooldown status
   * - false: Flash is available
   * - number: Timestamp (ms) when Flash will be available again (endsAt)
   */
  isFlashed: false | number;

  /**
   * Whether the player has Lucidity Boots (10.67% CDR)
   */
  lucidityBoots: boolean;

  /**
   * Whether the player has Cosmic Insight rune (15% CDR)
   */
  cosmicInsight: boolean;

  /**
   * Champion data (optional, populated from live game)
   */
  champion?: ChampionData;
}

/**
 * Complete role data for all 5 roles
 */
export interface RoleData {
  TOP: SummonerData;
  JUNGLE: SummonerData;
  MID: SummonerData;
  SUPPORT: SummonerData;
  ADC: SummonerData;
}

/**
 * Complete game state for a room
 */
export interface GameState {
  /**
   * Room ID (10 character alphanumeric string)
   */
  roomId: string;

  /**
   * List of usernames in the room
   */
  users: string[];

  /**
   * Role data for all 5 enemy champions
   */
  roles: RoleData;

  /**
   * Riot game ID (from live game)
   */
  gameId?: number;

  /**
   * Game start timestamp in milliseconds (from Riot API)
   */
  gameStartTime?: number;

  /**
   * Room creation timestamp
   */
  createdAt: Date;

  /**
   * Last update timestamp
   */
  updatedAt: Date;

  /**
   * Summoner name of the player (for Riot API integration)
   */
  summonerName?: string;

  /**
   * Region of the player (e.g., 'euw1', 'na1')
   */
  region?: string;
}

/**
 * Flash event data
 */
export interface FlashEventData {
  /**
   * Role that used Flash
   */
  role: Role;

  /**
   * Username of the player who triggered the event
   */
  username: string;

  /**
   * Cooldown duration in seconds
   */
  cooldown: number;

  /**
   * Timestamp when Flash will be available again
   */
  endsAt: number;
}

/**
 * Item toggle event data
 */
export interface ItemToggleData {
  /**
   * Role that toggled an item
   */
  role: Role;

  /**
   * Item that was toggled
   */
  item: 'lucidityBoots' | 'cosmicInsight';

  /**
   * New value for the item
   */
  value: boolean;

  /**
   * Username of the player who triggered the event
   */
  username: string;
}
