import Image from 'next/image'

interface ISkinItemProps {
  skinName: string
  skinImageUrl: string
  championName: string
  isDefault: boolean
  onSelect: (skinImageUrl: string) => void
}

export const SkinItem = (props: ISkinItemProps) => {
  const { skinName, skinImageUrl, championName, isDefault, onSelect } = props

  const displayName = isDefault ? championName : skinName

  return (
    <li
      className="flex cursor-pointer flex-col items-center justify-start transition-all hover:scale-110"
      onClick={() => onSelect(skinImageUrl)}
    >
      <Image
        quality={75}
        className="w-28 rounded-sm object-cover"
        src={skinImageUrl}
        alt={skinName}
        width={500}
        height={500}
      />
      <span className="w-28 overflow-hidden text-ellipsis whitespace-nowrap text-xs">
        {displayName}
      </span>
    </li>
  )
}

