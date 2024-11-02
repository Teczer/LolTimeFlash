import { Client } from 'shieldbow'
import { NextResponse } from 'next/server'

export type ChampionName = string

export interface SkinData {
  skinName: string
  skinImageUrl: string
}

export interface AllSkinsSplashArts {
  championName: ChampionName
  splashArts: SkinData[]
}

const client = new Client('RGAPI-c981eb1e-52f5-4425-8106-cb5c612c6a0d')

export async function GET() {
  let championsData: AllSkinsSplashArts[] = []

  const fetchChampions = async () => {
    try {
      const response = await fetch(
        'https://ddragon.leagueoflegends.com/cdn/14.21.1/data/en_US/champion.json'
      )
      const data = await response.json()
      // Récupérer les noms des champions
      const championNames: ChampionName[] = Object.keys(data.data)
      for (const championName of championNames) {
        championsData.push({
          championName: championName,
          splashArts: [],
        })
      }
    } catch (error) {
      console.error('Error fetching champion data:', error)
    }
  }

  await fetchChampions()

  await client.initialize({
    region: 'euw',
  })

  const allSplashArtsPromises = championsData.map(async (championData) => {
    const champion = await client.champions.fetch(championData.championName)
    championData.splashArts = champion.skins.map((skin) => ({
      skinName: skin.name,
      skinImageUrl: skin.splashArt, // Remplacer /pbe/ par /latest/,
    }))
  })

  await Promise.all(allSplashArtsPromises)

  return NextResponse.json(championsData)
}
