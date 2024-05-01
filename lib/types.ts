/* GAME TYPE */

export interface LeagueRoles {
  name: string
  src: string
}

export interface SummonerData {
  isFlashed: boolean | number
  lucidityBoots: boolean
  cosmicInsight: boolean
}

export interface GameData {
  [key: string]: SummonerData
}
