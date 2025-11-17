import type { AllSkinsSplashArts } from '@loltimeflash/shared'
import { ChampionItem } from './champion-item.component'

interface IChampionListProps {
  champions: AllSkinsSplashArts[]
  onSkinSelect: (skinImageUrl: string) => void
}

export const ChampionList = (props: IChampionListProps) => {
  const { champions, onSkinSelect } = props

  return (
    <ul className="mt-4 flex h-full w-full flex-col items-center justify-start gap-3">
      {champions?.map((champion, index) => (
        <ChampionItem
          key={`${champion.championName}-${index}`}
          champion={champion}
          onSkinSelect={onSkinSelect}
        />
      ))}
    </ul>
  )
}
