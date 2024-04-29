import { Client } from 'shieldbow'
import { NextResponse } from 'next/server'

type ChampionName = string

const client = new Client('RGAPI-c981eb1e-52f5-4425-8106-cb5c612c6a0d')

export async function GET() {
  let championsData: {
    championName: ChampionName
    splashArts: string[]
  }[] = [] // Tableau pour stocker les données de chaque champion

  const fetchChampions = async () => {
    try {
      const response = await fetch(
        'https://ddragon.leagueoflegends.com/cdn/14.6.1/data/en_US/champion.json'
      )
      const data = await response.json()
      // Récupérer les noms des champions
      const championNames: ChampionName[] = Object.keys(data.data)
      console.log('championNames', championNames)
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

  await fetchChampions() // Appeler la fonction pour récupérer les noms des champions

  await client.initialize({
    region: 'euw', // defaults to 'na' anyways.
  })

  const allSplashArtsPromises = championsData.map(async (championData) => {
    const champion = await client.champions.fetch(championData.championName)
    championData.splashArts = champion.skins.map((skin) => skin.splashArt)
  })

  await Promise.all(allSplashArtsPromises)

  console.log('Champions Data:', championsData) // Données de tous les champions

  return NextResponse.json(championsData)
}
