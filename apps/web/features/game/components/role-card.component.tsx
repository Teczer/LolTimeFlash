/**
 * Role Card Component
 * Complete card for a single role (items + flash button)
 */

'use client'

import { cn } from '@/lib/utils'
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

export const RoleCard = (props: IRoleCardProps) => {
  const {
    role,
    data,
    onFlashClick,
    onToggleBoots,
    onToggleRune,
    isLastRole = false,
    className,
  } = props

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
        iconSrc={role.src}
        cooldown={data.isFlashed}
        onClick={onFlashClick}
      />
    </div>
  )
}
