#!/usr/bin/env tsx

/**
 * Champion Data Synchronization Script
 * 
 * Fetches the latest League of Legends champion data from Data Dragon API,
 * downloads all splash art images, compresses them to WebP format,
 * and saves everything locally for optimal performance.
 * 
 * Features:
 *   - Parallel downloads (5 champions at a time)
 *   - Resume capability (saves progress, skips completed)
 *   - Automatic retry with exponential backoff (3 attempts)
 *   - Rate limiting to avoid ECONNRESET errors
 * 
 * Usage:
 *   pnpm sync:champions           # Start or resume download
 *   pnpm sync:champions --fresh   # Force clean start (delete all)
 * 
 * Output:
 *   - apps/web/public/champions/data.json (metadata)
 *   - apps/web/public/champions/splash/{championId}_{skinNum}.webp (compressed images)
 *   - apps/web/public/champions/.progress.json (resume state, auto-deleted on completion)
 */

import { readdir, writeFile, mkdir, rm, stat, readFile, access } from 'fs/promises'
import { join } from 'path'
import { get } from 'https'
import { IncomingMessage } from 'http'
import sharp from 'sharp'
import { constants } from 'fs'

// =============================================================================
// Types
// =============================================================================

interface ChampionListResponse {
  data: Record<string, ChampionBasicData>
}

interface ChampionBasicData {
  id: string
  name: string
}

interface ChampionDetailResponse {
  data: Record<string, ChampionDetail>
}

interface ChampionDetail {
  id: string
  name: string
  skins: Skin[]
}

interface Skin {
  num: number
  name: string
}

interface ProcessedChampion {
  championName: string
  splashArts: ProcessedSkin[]
}

interface ProcessedSkin {
  skinName: string
  skinImageUrl: string
}

interface ProgressState {
  version: string
  completedChampions: string[] // Champion IDs that are fully downloaded
  lastUpdated: string
}

// =============================================================================
// Configuration
// =============================================================================

const DATA_DRAGON_BASE = 'https://ddragon.leagueoflegends.com'
const OUTPUT_DIR = join(process.cwd(), 'apps/web/public/champions')
const SPLASH_DIR = join(OUTPUT_DIR, 'splash')
const DATA_FILE = join(OUTPUT_DIR, 'data.json')
const PROGRESS_FILE = join(OUTPUT_DIR, '.progress.json')

// Performance settings
const PARALLEL_CHAMPIONS = 5 // Process 5 champions at a time
const MAX_RETRIES = 3
const INITIAL_RETRY_DELAY = 1000 // 1 second
const REQUEST_DELAY = 100 // 100ms between requests (rate limiting)

// WebP compression settings
const WEBP_QUALITY = 85
const WEBP_OPTIONS = {
  quality: WEBP_QUALITY,
  effort: 6,
}

// Check for --fresh flag
const FORCE_FRESH = process.argv.includes('--fresh')

// =============================================================================
// Utilities
// =============================================================================

/**
 * Sleep for a given duration
 */
function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

/**
 * Download file from URL with retry logic
 */
async function downloadFile(url: string, retries = MAX_RETRIES): Promise<Buffer> {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      return await new Promise((resolve, reject) => {
        const request = get(url, (response: IncomingMessage) => {
          if (response.statusCode === 301 || response.statusCode === 302) {
            // Handle redirect
            const redirectUrl = response.headers.location
            if (redirectUrl) {
              downloadFile(redirectUrl, retries)
                .then(resolve)
                .catch(reject)
              return
            }
          }

          if (response.statusCode !== 200) {
            reject(new Error(`HTTP ${response.statusCode} for ${url}`))
            return
          }

          const chunks: Buffer[] = []
          response.on('data', (chunk) => chunks.push(chunk))
          response.on('end', () => resolve(Buffer.concat(chunks)))
          response.on('error', reject)
        })

        request.on('error', reject)
        request.setTimeout(30000, () => {
          request.destroy()
          reject(new Error('Request timeout'))
        })
      })
    } catch (error) {
      if (attempt === retries) {
        throw error
      }
      const delay = INITIAL_RETRY_DELAY * Math.pow(2, attempt - 1)
      console.log(`  ⚠️  Retry ${attempt}/${retries} after ${delay}ms...`)
      await sleep(delay)
    }
  }
  throw new Error('Max retries exceeded')
}

/**
 * Fetch JSON from URL
 */
async function fetchJson<T>(url: string): Promise<T> {
  const buffer = await downloadFile(url)
  return JSON.parse(buffer.toString())
}

/**
 * Check if file exists
 */
async function fileExists(path: string): Promise<boolean> {
  try {
    await access(path, constants.F_OK)
    return true
  } catch {
    return false
  }
}

/**
 * Load progress state
 */
async function loadProgress(): Promise<ProgressState | null> {
  try {
    const content = await readFile(PROGRESS_FILE, 'utf-8')
    return JSON.parse(content)
  } catch {
    return null
  }
}

/**
 * Save progress state
 */
async function saveProgress(state: ProgressState): Promise<void> {
  await writeFile(PROGRESS_FILE, JSON.stringify(state, null, 2))
}

/**
 * Clean and recreate output directory
 */
async function cleanOutputDir(): Promise<void> {
  console.log('🧹 Cleaning output directory...')
  try {
    await rm(OUTPUT_DIR, { recursive: true, force: true })
  } catch (error) {
    // Directory might not exist, ignore error
  }
  await mkdir(SPLASH_DIR, { recursive: true })
  console.log(`✅ Created ${OUTPUT_DIR}`)
}

/**
 * Get latest League of Legends version
 */
async function getLatestVersion(): Promise<string> {
  console.log('🔍 Fetching latest League of Legends version...')
  const versions = await fetchJson<string[]>(`${DATA_DRAGON_BASE}/api/versions.json`)
  const latestVersion = versions[0]
  console.log(`✅ Latest version: ${latestVersion}`)
  return latestVersion
}

/**
 * Get all champions list
 */
async function getChampionsList(version: string): Promise<ChampionBasicData[]> {
  console.log('📋 Fetching champions list...')
  const url = `${DATA_DRAGON_BASE}/cdn/${version}/data/en_US/champion.json`
  const response = await fetchJson<ChampionListResponse>(url)
  const champions = Object.values(response.data)
  console.log(`✅ Found ${champions.length} champions`)
  return champions
}

/**
 * Get champion details with skins
 */
async function getChampionDetails(
  version: string,
  championId: string
): Promise<ChampionDetail> {
  const url = `${DATA_DRAGON_BASE}/cdn/${version}/data/en_US/champion/${championId}.json`
  const response = await fetchJson<ChampionDetailResponse>(url)
  return response.data[championId]
}

/**
 * Download and compress splash art image
 */
async function downloadAndCompressSplashArt(
  championId: string,
  skinNum: number
): Promise<string> {
  const originalUrl = `${DATA_DRAGON_BASE}/cdn/img/champion/splash/${championId}_${skinNum}.jpg`
  const filename = `${championId}_${skinNum}.webp`
  const outputPath = join(SPLASH_DIR, filename)

  // Rate limiting
  await sleep(REQUEST_DELAY)

  try {
    // Download original image
    const imageBuffer = await downloadFile(originalUrl)

    // Compress to WebP
    await sharp(imageBuffer).webp(WEBP_OPTIONS).toFile(outputPath)

    // Return relative URL for frontend
    return `/champions/splash/${filename}`
  } catch (error) {
    console.error(`  ❌ Failed to process ${championId}_${skinNum}:`, error)
    throw error
  }
}

/**
 * Check if champion is already fully downloaded
 */
async function isChampionComplete(championId: string, skinCount: number): Promise<boolean> {
  for (let i = 0; i < skinCount; i++) {
    const filename = `${championId}_${i}.webp`
    const filePath = join(SPLASH_DIR, filename)
    if (!(await fileExists(filePath))) {
      return false
    }
  }
  return true
}

/**
 * Process a single champion
 */
async function processChampion(
  version: string,
  champion: ChampionBasicData,
  index: number,
  total: number,
  completedChampions: Set<string>
): Promise<ProcessedChampion> {
  const progress = `[${index + 1}/${total}]`

  try {
    // Fetch champion details
    const details = await getChampionDetails(version, champion.id)
    const skinCount = details.skins.length

    // Check if already completed
    if (completedChampions.has(champion.id)) {
      const isComplete = await isChampionComplete(champion.id, skinCount)
      if (isComplete) {
        console.log(`⏭️  ${progress} ${champion.name} already complete (${skinCount} skins)`)
        const splashArts: ProcessedSkin[] = details.skins.map((skin) => ({
          skinName: skin.name === 'default' ? champion.name : skin.name,
          skinImageUrl: `/champions/splash/${champion.id}_${skin.num}.webp`,
        }))
        return { championName: champion.name, splashArts }
      }
    }

    console.log(`${progress} Processing ${champion.name}...`)

    // Process all skins
    const splashArts: ProcessedSkin[] = []
    for (const skin of details.skins) {
      const skinName = skin.name === 'default' ? champion.name : skin.name
      
      // Check if skin already exists
      const filename = `${champion.id}_${skin.num}.webp`
      const filePath = join(SPLASH_DIR, filename)
      if (await fileExists(filePath)) {
        console.log(`  ↳ ⏭️  ${skinName} (cached)`)
        splashArts.push({
          skinName,
          skinImageUrl: `/champions/splash/${filename}`,
        })
      } else {
        console.log(`  ↳ Downloading ${skinName}...`)
        const skinImageUrl = await downloadAndCompressSplashArt(champion.id, skin.num)
        splashArts.push({ skinName, skinImageUrl })
      }
    }

    console.log(`✅ ${progress} ${champion.name} complete (${splashArts.length} skins)`)
    return {
      championName: champion.name,
      splashArts,
    }
  } catch (error) {
    console.error(`❌ ${progress} Failed to process ${champion.name}:`, error)
    // Return at least the default skin
    return {
      championName: champion.name,
      splashArts: [
        {
          skinName: champion.name,
          skinImageUrl: `/champions/splash/${champion.id}_0.webp`,
        },
      ],
    }
  }
}

/**
 * Process champions in parallel batches
 */
async function processChampionsInBatches(
  version: string,
  champions: ChampionBasicData[],
  completedChampions: Set<string>,
  onBatchComplete: (completed: string[]) => Promise<void>
): Promise<ProcessedChampion[]> {
  const results: ProcessedChampion[] = []

  for (let i = 0; i < champions.length; i += PARALLEL_CHAMPIONS) {
    const batch = champions.slice(i, i + PARALLEL_CHAMPIONS)
    const batchPromises = batch.map((champ, batchIndex) =>
      processChampion(version, champ, i + batchIndex, champions.length, completedChampions)
    )

    const batchResults = await Promise.all(batchPromises)
    results.push(...batchResults)

    // Update progress file after each batch
    const newlyCompleted = batch.map((c) => c.id)
    newlyCompleted.forEach((id) => completedChampions.add(id))
    await onBatchComplete(newlyCompleted)
  }

  return results
}

/**
 * Save champions data to JSON
 */
async function saveChampionsData(champions: ProcessedChampion[]): Promise<void> {
  console.log('💾 Saving champions data...')
  const data = {
    version: await getLatestVersion(),
    lastUpdated: new Date().toISOString(),
    champions: champions.sort((a, b) => a.championName.localeCompare(b.championName)),
  }
  await writeFile(DATA_FILE, JSON.stringify(data, null, 2))
  console.log(`✅ Saved to ${DATA_FILE}`)
}

/**
 * Get folder size in MB
 */
async function getFolderSize(dir: string): Promise<number> {
  let size = 0
  const files = await readdir(dir, { recursive: true })
  for (const file of files) {
    const filePath = join(dir, file.toString())
    const stats = await stat(filePath)
    if (stats.isFile()) {
      size += stats.size
    }
  }
  return size / (1024 * 1024)
}

// =============================================================================
// Main Script
// =============================================================================

async function main(): Promise<void> {
  console.log('🚀 Starting Champion Data Synchronization...\n')

  const startTime = Date.now()

  try {
    // Step 1: Check for force fresh
    if (FORCE_FRESH) {
      console.log('🔥 --fresh flag detected, starting clean...\n')
      await cleanOutputDir()
    } else {
      // Ensure output directory exists
      await mkdir(SPLASH_DIR, { recursive: true })
    }

    // Step 2: Get latest version
    const version = await getLatestVersion()

    // Step 3: Load progress or start fresh
    let progressState = await loadProgress()
    const completedChampions = new Set<string>()

    if (progressState && progressState.version === version && !FORCE_FRESH) {
      console.log(`🔄 Resuming from previous session (${progressState.completedChampions.length} champions completed)\n`)
      progressState.completedChampions.forEach((id) => completedChampions.add(id))
    } else {
      console.log('🆕 Starting fresh download\n')
      progressState = {
        version,
        completedChampions: [],
        lastUpdated: new Date().toISOString(),
      }
      await saveProgress(progressState)
    }

    // Step 4: Get all champions
    const champions = await getChampionsList(version)

    // Step 5: Process champions in parallel batches
    console.log(`\n📥 Downloading and compressing splash arts (${PARALLEL_CHAMPIONS} at a time)...\n`)

    const processedChampions = await processChampionsInBatches(
      version,
      champions,
      completedChampions,
      async (newlyCompleted) => {
        // Update progress file
        progressState!.completedChampions.push(...newlyCompleted)
        progressState!.lastUpdated = new Date().toISOString()
        await saveProgress(progressState!)
      }
    )

    // Step 6: Save metadata
    await saveChampionsData(processedChampions)

    // Step 7: Clean up progress file
    try {
      await rm(PROGRESS_FILE)
      console.log('✅ Cleaned up progress file')
    } catch {
      // Ignore error
    }

    // Step 8: Stats
    const totalSkins = processedChampions.reduce((sum, champ) => sum + champ.splashArts.length, 0)
    const folderSizeMB = await getFolderSize(SPLASH_DIR)
    const duration = ((Date.now() - startTime) / 1000).toFixed(2)

    console.log('\n✅ Synchronization complete!')
    console.log(`\n📊 Statistics:`)
    console.log(`   • Champions: ${processedChampions.length}`)
    console.log(`   • Total skins: ${totalSkins}`)
    console.log(`   • Folder size: ${folderSizeMB.toFixed(2)} MB`)
    console.log(`   • Duration: ${duration}s`)
    console.log(`   • Average: ${(totalSkins / parseFloat(duration)).toFixed(1)} skins/sec`)
    console.log(`   • Output: ${OUTPUT_DIR}`)
  } catch (error) {
    console.error('\n❌ Synchronization failed:', error)
    console.log('\n💡 You can resume by running the command again')
    process.exit(1)
  }
}

// Run script
main()
