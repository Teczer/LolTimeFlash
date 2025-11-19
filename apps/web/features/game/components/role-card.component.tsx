'use client'

import { cn } from '@/lib/utils'
import { memo } from 'react'
import type { ILeagueRole, ISummonerData } from '../types/game.types'
import { FlashButton } from './flash-button.component'
import { ItemToggle } from './item-toggle.component'

interface IRoleCardProps {
  role: ILeagueRole
  data: ISummonerData
  onFlashClick: () => void
  onToggleBoots: () => void
  onToggleRune: () => void
  isLastRole?: boolean
  className?: string
}

const RoleCardComponent = (props: IRoleCardProps) => {
  const {
    role,
    data,
    onFlashClick,
    onToggleBoots,
    onToggleRune,
    isLastRole = false,
    className,
  } = props

  console.log('data', data)
  return (
    <div
      className={cn(
        'flex h-auto flex-col items-center justify-center gap-2 sm:gap-8',
        isLastRole ? 'col-span-2 w-full' : 'w-2/4 sm:w-full',
        className
      )}
    >
      {/* Items (Cosmic Insight + Lucidity Boots) */}
      <div className="flex w-full items-center justify-center gap-8 sm:gap-4">
        {/* Cosmic Insight */}
        <ItemToggle
          itemName="Cosmic Insight"
          iconSrc="https://res.cloudinary.com/dw3mwclgk/image/upload/v1717152630/LolTimeFlash/rune-cdr.webp"
          isActive={data.cosmicInsight}
          onClick={onToggleRune}
        />

        {/* Lucidity Boots */}
        <ItemToggle
          itemName="Lucidity Boots"
          iconSrc="https://res.cloudinary.com/dw3mwclgk/image/upload/v1717152629/LolTimeFlash/lucidity-boots.png"
          isActive={data.lucidityBoots}
          onClick={onToggleBoots}
        />
      </div>

      {/* Flash Button */}
      <FlashButton
        role={role.name}
        iconSrc={data.champion?.championIconUrl || role.src}
        cooldown={data.isFlashed}
        onClick={onFlashClick}
        summonerName={data.champion?.summonerName}
      />
    </div>
  )
}

export const RoleCard = memo(RoleCardComponent, (prev, next) => {
  return (
    prev.role.name === next.role.name &&
    prev.role.src === next.role.src &&
    prev.data.isFlashed === next.data.isFlashed &&
    prev.data.lucidityBoots === next.data.lucidityBoots &&
    prev.data.cosmicInsight === next.data.cosmicInsight &&
    prev.data.champion?.championIconUrl ===
      next.data.champion?.championIconUrl &&
    prev.data.champion?.summonerName === next.data.champion?.summonerName &&
    prev.isLastRole === next.isLastRole
  )
})
