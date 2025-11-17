import { Image } from '@/components/ui/image.component'

interface ISkinItemProps {
  skinName: string
  skinImageUrl: string
  onSelect: (skinImageUrl: string) => void
}

export const SkinItem = (props: ISkinItemProps) => {
  const { skinName, skinImageUrl, onSelect } = props

  return (
    <li
      className="flex cursor-pointer flex-col items-center justify-start transition-all hover:scale-110"
      onClick={() => onSelect(skinImageUrl)}
    >
      <div className="h-[112px] w-28 overflow-hidden rounded-sm">
        <Image
          quality={75}
          className="h-full w-full object-cover"
          src={skinImageUrl}
          alt={skinName}
          width={500}
          height={500}
          skeletonClassName="rounded-sm"
        />
      </div>

      <span className="w-28 overflow-hidden text-ellipsis whitespace-nowrap text-xs">
        {skinName}
      </span>
    </li>
  )
}
