import config from '@/lib/config'
import type { FetchLiveGameResponse, RiotRegion } from '@loltimeflash/shared'

/**
 * Fetch live game data from Riot API via NestJS backend
 */
export async function fetchLiveGameData(
  summonerName: string,
  region: RiotRegion
): Promise<FetchLiveGameResponse> {
  try {
    // Call NestJS backend
    const apiUrl = config.apiUrl || config.socketPort || 'http://localhost:3001'
    const response = await fetch(`${apiUrl}/riot/live-game`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        summonerName,
        region,
      }),
    })

    const data: FetchLiveGameResponse = await response.json()
    return data
  } catch (error) {
    console.error('Error fetching live game data:', error)
    return {
      success: false,
      error: 'Failed to fetch live game data',
    }
  }
}
