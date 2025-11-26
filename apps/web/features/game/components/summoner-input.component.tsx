'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { toast } from '@/hooks/use-toast.hook'
import { fetchLiveGameData } from '@/lib/riot-api.service'
import { cn } from '@/lib/utils'
import type { RiotRegion } from '@loltimeflash/shared'
import { useState } from 'react'
import { LoadingSpinner } from './loading-spinner.component'

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
        'bg-background/30 flex flex-col items-center gap-3 rounded-lg p-4 backdrop-blur-sm sm:flex-row',
        className
      )}
    >
      <div className="flex w-full flex-col gap-2 sm:flex-row sm:items-center">
        <Input
          className="font-bold"
          type="text"
          name="summoner-name"
          autoComplete="on"
          placeholder="Summoner Name"
          value={summonerName}
          onChange={(e) => setSummonerName(e.target.value)}
          disabled={isLoading}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleFetchLiveGame()
            }
          }}
        />

        <Select
          value={region}
          onValueChange={(value) => setRegion(value as RiotRegion)}
          disabled={isLoading}
        >
          <SelectTrigger className="w-full sm:w-32">
            <SelectValue placeholder="Select region" />
          </SelectTrigger>
          <SelectContent>
            {REGIONS.map((r) => (
              <SelectItem key={r.value} value={r.value}>
                {r.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Button
        onClick={handleFetchLiveGame}
        disabled={isLoading || !summonerName.trim()}
        variant="secondary"
      >
        {isLoading ? (
          <span className="flex items-center gap-2">
            <LoadingSpinner className="h-4 w-4 animate-spin" />
            Fetching...
          </span>
        ) : (
          '🎮 Fetch Live Game'
        )}
      </Button>
    </div>
  )
}
