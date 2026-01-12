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
import { useFetchLiveGame } from '@/features/game/hooks/use-fetch-live-game.hook'
import { cn } from '@/lib/utils'
import type { RiotRegion } from '@loltimeflash/shared'
import { useState } from 'react'
import { IoGameController } from 'react-icons/io5'
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

  const { mutateAsync: fetchLiveGame, isPending: isLoading } = useFetchLiveGame(
    {
      onSuccess: onGameDataFetched,
    }
  )

  async function handleFetchLiveGame() {
    await fetchLiveGame({ summonerName, region })
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
          onKeyDown={async (e) => {
            if (e.key === 'Enter') {
              await fetchLiveGame({ summonerName, region })
            }
          }}
        />

        <Select
          value={region}
          onValueChange={(value: RiotRegion) => setRegion(value)}
          disabled={isLoading}
        >
          <SelectTrigger className="w-full sm:w-32">
            <SelectValue placeholder="Select region" />
          </SelectTrigger>
          <SelectContent>
            {REGIONS.map((region) => (
              <SelectItem key={region.value} value={region.value}>
                {region.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Button
        onClick={handleFetchLiveGame}
        disabled={isLoading || !summonerName.trim()}
        variant="outline"
      >
        {isLoading ? (
          <span className="flex items-center gap-2">
            <LoadingSpinner className="h-4 w-4 animate-spin" />
            Fetching...
          </span>
        ) : (
          <span className="flex items-center gap-2">
            <IoGameController className="h-5 w-5" />
            Fetch Live Game
          </span>
        )}
      </Button>
    </div>
  )
}
