import type { AllSkinsSplashArts } from '@loltimeflash/shared'
import Image from 'next/image'
import { SkinItem } from './skin-item.component'

interface IChampionItemProps {
  champion: AllSkinsSplashArts
  onSkinSelect: (skinImageUrl: string) => void
}

export const ChampionItem = (props: IChampionItemProps) => {
  const { champion, onSkinSelect } = props

  return (
    <li className="flex h-auto w-full border bg-[#052431]">
      {/* Champion Icon + Name */}
      <div className="flex h-auto w-1/5 flex-col items-center justify-start gap-2 p-4">
        <Image
          quality={75}
          className="size-10 border object-cover"
          src={champion.splashArts[0]?.skinImageUrl || ''}
          alt={`${champion.championName} - ${champion.splashArts[0]?.skinName || 'Default'}`}
          width={500}
          height={500}
        />
        <h2 className="text-md textstroke text-white">
          {champion.championName}
        </h2>
      </div>

      {/* Champion Skins Grid */}
      <ul className="flex h-full w-4/5 flex-wrap items-center justify-start gap-4 p-4">
        {champion.splashArts.map((splash, skinIndex) => (
          <SkinItem
            key={`${splash.skinImageUrl}-${skinIndex}`}
            skinName={splash.skinName}
            skinImageUrl={splash.skinImageUrl}
            championName={champion.championName}
            isDefault={skinIndex === 0}
            onSelect={onSkinSelect}
          />
        ))}
      </ul>
    </li>
  )
}
