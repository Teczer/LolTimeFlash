import type { IGameData, ILeagueRole, ISummonerData } from '@/features/game/types/game.types'

/**
 * Flash cooldown durations in seconds
 */
export const FLASH_BASE_COOLDOWN = 300 // 5 minutes
export const FLASH_COOLDOWN_WITH_BOOTS = 268 // 4:28
export const FLASH_COOLDOWN_WITH_RUNE = 255 // 4:15
export const FLASH_COOLDOWN_WITH_BOTH = 231 // 3:51

/**
 * League of Legends roles with icons
 */
export const LEAGUE_ROLES: ILeagueRole[] = [
  {
    name: 'TOP',
    src: '/assets/toprole-icon.png',
  },
  {
    name: 'JUNGLE',
    src: '/assets/junglerole-icon.png',
  },
  {
    name: 'MID',
    src: '/assets/midrole-icon.png',
  },
  {
    name: 'ADC',
    src: '/assets/adcrole-icon.png',
  },
  {
    name: 'SUPPORT',
    src: '/assets/supportrole-icon.png',
  },
]

/**
 * Default summoner data (Flash available, no items)
 */
export const DEFAULT_SUMMONER_DATA: ISummonerData = {
  isFlashed: false,
  lucidityBoots: false,
  cosmicInsight: false,
}

/**
 * Default game data (empty users, all roles with default data)
 */
export const DEFAULT_GAME_DATA: IGameData = {
  users: [],
  roles: {
    TOP: { ...DEFAULT_SUMMONER_DATA },
    JUNGLE: { ...DEFAULT_SUMMONER_DATA },
    MID: { ...DEFAULT_SUMMONER_DATA },
    SUPPORT: { ...DEFAULT_SUMMONER_DATA },
    ADC: { ...DEFAULT_SUMMONER_DATA },
  },
}

/**
 * Flash audio file path
 */
export const FLASH_AUDIO_PATH = '/flash-song.mp3'

/**
 * Audio volume level (0-1)
 */
export const AUDIO_VOLUME = 0.15
