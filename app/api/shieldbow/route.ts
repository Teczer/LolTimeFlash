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
  let championsData: AllSkinsSplashArts[] = [] // Tableau pour stocker les données de chaque champion

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
          splashArts: [], // Initialiser le tableau des splash arts pour chaque champion
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

  // Parcourir chaque champion pour récupérer les skins
  const allSplashArtsPromises = championsData.map(async (championData) => {
    const champion = await client.champions.fetch(championData.championName)
    championData.splashArts = champion.skins.map((skin) => ({
      skinName: skin.name,
      skinImageUrl: skin.splashArt.replace('/pbe/', '/latest/'), // Remplacer /pbe/ par /latest/,
    }))
  })

  // Attendre que toutes les promesses soient résolues
  await Promise.all(allSplashArtsPromises)

  console.log('Champions Data:', championsData) // Données de tous les champions

  // Retourner les données des champions au format JSON
  return NextResponse.json(championsData)
}
