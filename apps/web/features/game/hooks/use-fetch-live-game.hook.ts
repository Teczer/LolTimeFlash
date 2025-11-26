import { toast } from '@/hooks/use-toast.hook'
import { fetchLiveGameData } from '@/lib/riot-api.service'
import type { FetchLiveGameResponse, RiotRegion } from '@loltimeflash/shared'
import { useMutation } from '@tanstack/react-query'

interface IFetchLiveGameParams {
  summonerName: string
  region: RiotRegion
}

type TFetchLiveGameData = NonNullable<FetchLiveGameResponse['data']>

interface IUseFetchLiveGameOptions {
  onSuccess?: (data: TFetchLiveGameData) => void
}

interface IUseFetchLiveGameReturn {
  mutate: (params: IFetchLiveGameParams) => void
  mutateAsync: (params: IFetchLiveGameParams) => Promise<TFetchLiveGameData>
  isPending: boolean
}

export const useFetchLiveGame = (
  options?: IUseFetchLiveGameOptions
): IUseFetchLiveGameReturn => {
  const { mutate, mutateAsync, isPending } = useMutation({
    mutationFn: async ({ summonerName, region }: IFetchLiveGameParams) => {
      const response = await fetchLiveGameData(summonerName, region)
      if (!response.success || !response.data) {
        throw new Error(response.error || 'Failed to fetch live game data')
      }
      return response.data
    },
    onSuccess: (data) => {
      const enemyCount = data.enemies?.length || 0
      toast({
        title: '✅ Success!',
        description: `Found ${enemyCount} enemy champions in live game`,
        duration: 2000,
      })
      options?.onSuccess?.(data)
    },
    onError: (error: Error) => {
      toast({
        title: '❌ Error',
        description: error.message || 'Network error - please try again',
        duration: 3000,
      })
    },
  })

  return {
    mutate,
    mutateAsync,
    isPending,
  }
}
