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

// Data Dragon API endpoints
const DATA_DRAGON_BASE = 'https://ddragon.leagueoflegends.com'
const COMMUNITY_DRAGON_BASE = 'https://raw.communitydragon.org/latest'

// Cache duration (revalidate every 24 hours)
export const revalidate = 86400

export async function GET() {
  try {
    // 1. Get the latest version
    const versionsResponse = await fetch(
      `${DATA_DRAGON_BASE}/api/versions.json`
    )
    const versions: string[] = await versionsResponse.json()
    const latestVersion = versions[0]

    console.log('Latest LoL version:', latestVersion)

    // 2. Get all champions list
    const championsResponse = await fetch(
      `${DATA_DRAGON_BASE}/cdn/${latestVersion}/data/en_US/champion.json`
    )
    const championsData = await championsResponse.json()
    const champions = Object.values(championsData.data) as any[]

    // 3. Fetch detailed data for each champion to get skins
    const allChampionsData: AllSkinsSplashArts[] = await Promise.all(
      champions.map(async (champion) => {
        try {
          // Fetch champion detailed data
          const championDetailResponse = await fetch(
            `${DATA_DRAGON_BASE}/cdn/${latestVersion}/data/en_US/champion/${champion.id}.json`
          )
          const championDetail = await championDetailResponse.json()
          const championData = championDetail.data[champion.id]

          // Map skins to our format
          const splashArts: SkinData[] = championData.skins.map(
            (skin: any) => ({
              skinName: skin.name,
              skinImageUrl: `${DATA_DRAGON_BASE}/cdn/img/champion/splash/${champion.id}_${skin.num}.jpg`,
            })
          )

          return {
            championName: champion.id,
            splashArts,
          }
        } catch (error) {
          console.error(`Error fetching ${champion.id}:`, error)
          return {
            championName: champion.id,
            splashArts: [
              {
                skinName: 'Default',
                skinImageUrl: `${DATA_DRAGON_BASE}/cdn/img/champion/splash/${champion.id}_0.jpg`,
              },
            ],
          }
        }
      })
    )

    // Sort alphabetically by champion name
    allChampionsData.sort((a, b) =>
      a.championName.localeCompare(b.championName)
    )

    console.log(`Successfully fetched ${allChampionsData.length} champions`)

    return NextResponse.json(allChampionsData)
  } catch (error) {
    console.error('Error fetching champions data:', error)
    return NextResponse.json(
      { error: 'Failed to fetch champions data' },
      { status: 500 }
    )
  }
}
