import { Injectable, Logger } from '@nestjs/common'
import type { AllSkinsSplashArts, SkinData } from '@loltimeflash/shared'

@Injectable()
export class ChampionsService {
  private readonly logger = new Logger(ChampionsService.name)
  private readonly DATA_DRAGON_BASE = 'https://ddragon.leagueoflegends.com'

  /**
   * Fetch all champions with their splash arts from Data Dragon API
   * @returns Array of champions with their skins
   */
  async getAllChampionSkins(): Promise<AllSkinsSplashArts[]> {
    try {
      // 1. Get the latest version
      const versionsResponse = await fetch(
        `${this.DATA_DRAGON_BASE}/api/versions.json`
      )
      const versions: string[] = await versionsResponse.json()
      const latestVersion = versions[0]

      this.logger.log(`Latest LoL version: ${latestVersion}`)

      // 2. Get all champions list
      const championsResponse = await fetch(
        `${this.DATA_DRAGON_BASE}/cdn/${latestVersion}/data/en_US/champion.json`
      )
      const championsData = await championsResponse.json()
      const champions = Object.values(championsData.data) as any[]

      // 3. Fetch detailed data for each champion to get skins
      const allChampionsData: AllSkinsSplashArts[] = await Promise.all(
        champions.map(async (champion) => {
          try {
            // Fetch champion detailed data
            const championDetailResponse = await fetch(
              `${this.DATA_DRAGON_BASE}/cdn/${latestVersion}/data/en_US/champion/${champion.id}.json`
            )
            const championDetail = await championDetailResponse.json()
            const championData = championDetail.data[champion.id]

            // Map skins to our format
            const splashArts: SkinData[] = championData.skins.map(
              (skin: any) => ({
                skinName: skin.name,
                skinImageUrl: `${this.DATA_DRAGON_BASE}/cdn/img/champion/splash/${champion.id}_${skin.num}.jpg`,
              })
            )

            return {
              championName: champion.id,
              splashArts,
            }
          } catch (error) {
            this.logger.error(`Error fetching ${champion.id}:`, error)
            return {
              championName: champion.id,
              splashArts: [
                {
                  skinName: 'Default',
                  skinImageUrl: `${this.DATA_DRAGON_BASE}/cdn/img/champion/splash/${champion.id}_0.jpg`,
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

      this.logger.log(
        `Successfully fetched ${allChampionsData.length} champions`
      )

      return allChampionsData
    } catch (error) {
      this.logger.error('Error fetching champions data:', error)
      throw new Error('Failed to fetch champions data')
    }
  }
}

