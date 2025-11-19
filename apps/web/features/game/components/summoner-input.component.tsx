'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { fetchLiveGameData } from '@/lib/riot-api.service'
import type { RiotRegion } from '@loltimeflash/shared'
import { useState } from 'react'
import { toast } from '@/hooks/use-toast.hook'

interface ISummonerInputProps {
  onGameDataFetched: (data: any) => void
  className?: string
}

const REGIONS: { value: RiotRegion; label: string }[] = [
  { value: 'euw1', label: 'EUW' },
  { value: 'eun1', label: 'EUNE' },
  { value: 'na1', label: 'NA' },
  { value: 'br1', label: 'BR' },
  { value: 'kr', label: 'KR' },
  { value: 'jp1', label: 'JP' },
  { value: 'la1', label: 'LAN' },
  { value: 'la2', label: 'LAS' },
  { value: 'oc1', label: 'OCE' },
  { value: 'ph2', label: 'PH' },
  { value: 'ru', label: 'RU' },
  { value: 'sg2', label: 'SG' },
  { value: 'th2', label: 'TH' },
  { value: 'tr1', label: 'TR' },
  { value: 'tw2', label: 'TW' },
  { value: 'vn2', label: 'VN' },
]

export const SummonerInput = (props: ISummonerInputProps) => {
  const { onGameDataFetched, className } = props
  const [summonerName, setSummonerName] = useState('')
  const [region, setRegion] = useState<RiotRegion>('euw1')
  const [isLoading, setIsLoading] = useState(false)

  const handleFetchLiveGame = async () => {
    if (!summonerName.trim()) {
      toast({
        title: '⚠️ Missing Information',
        description: 'Please enter a summoner name (e.g., YourName#TAG)',
        duration: 2000,
      })
      return
    }

    setIsLoading(true)

    try {
      const response = await fetchLiveGameData(summonerName, region)

      if (response.success && response.data) {
        const enemyCount = response.data.enemies?.length || 0
        toast({
          title: '✅ Success!',
          description: `Found ${enemyCount} enemy champions in live game`,
          duration: 2000,
        })
        onGameDataFetched(response.data)
      } else {
        toast({
          title: '❌ Error',
          description: response.error || 'Failed to fetch live game data',
          duration: 3000,
        })
      }
    } catch (error) {
      toast({
        title: '❌ Error',
        description: 'Network error - please try again',
        duration: 3000,
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div
      className={cn(
        'flex flex-col items-center gap-3 rounded-lg bg-black/30 p-4 backdrop-blur-sm sm:flex-row',
        className
      )}
    >
      <div className="flex w-full flex-col gap-2 sm:flex-row sm:items-center">
        <Input
          type="text"
          placeholder="Summoner Name"
          value={summonerName}
          onChange={(e) => setSummonerName(e.target.value)}
          className="w-full border-[#8B4513] bg-black/50 text-white placeholder:text-gray-400 sm:w-48"
          disabled={isLoading}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleFetchLiveGame()
            }
          }}
        />

        <select
          value={region}
          onChange={(e) => setRegion(e.target.value as RiotRegion)}
          className="w-full rounded-md border border-[#8B4513] bg-black/50 px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#8B4513] sm:w-32"
          disabled={isLoading}
        >
          {REGIONS.map((r) => (
            <option key={r.value} value={r.value} className="bg-black">
              {r.label}
            </option>
          ))}
        </select>
      </div>

      <Button
        onClick={handleFetchLiveGame}
        disabled={isLoading || !summonerName.trim()}
        className="w-full bg-[#8B4513] text-white hover:bg-[#A0522D] disabled:opacity-50 disabled:cursor-not-allowed sm:w-auto"
      >
        {isLoading ? (
          <span className="flex items-center gap-2">
            <svg
              className="h-4 w-4 animate-spin"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            Fetching...
          </span>
        ) : (
          '🎮 Fetch Live Game'
        )}
      </Button>
    </div>
  )
}

