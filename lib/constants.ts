import { GameData } from './types'

export const currentUsername =
  typeof window !== 'undefined'
    ? (localStorage.getItem('username') as string)
    : 'DefaultName'

export const userVolume =
  typeof window !== 'undefined'
    ? localStorage.getItem('volume')
    : 'DefaultVolume'

export const gameDefaultData: GameData = {
  users: [currentUsername],
  roles: {
    TOP: {
      isFlashed: false,
      lucidityBoots: false,
      cosmicInsight: false,
    },
    JUNGLE: {
      isFlashed: false,
      lucidityBoots: false,
      cosmicInsight: false,
    },
    MID: {
      isFlashed: false,
      lucidityBoots: false,
      cosmicInsight: false,
    },
    SUPPORT: {
      isFlashed: false,
      lucidityBoots: false,
      cosmicInsight: false,
    },
    ADC: {
      isFlashed: false,
      lucidityBoots: false,
      cosmicInsight: false,
    },
  },
}
