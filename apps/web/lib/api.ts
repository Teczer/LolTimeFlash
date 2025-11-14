import config from './config'
import type { AllSkinsSplashArts } from '@loltimeflash/shared'

/**
 * Fetch all champions with their splash arts from the backend API
 * @returns Array of champions with their skins
 */
export async function getChampionSkins(): Promise<AllSkinsSplashArts[]> {
  const url = `${config.apiUrl}/champions/skins`
  const res = await fetch(url)

  if (!res.ok) {
    throw new Error(`Failed to fetch champions: ${res.statusText}`)
  }

  const champions = await res.json()
  return champions
}

