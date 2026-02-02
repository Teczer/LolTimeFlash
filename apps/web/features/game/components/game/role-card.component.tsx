'use client'

import { getRemainingTime } from '@/features/game/hooks/use-flash-cooldown.hook'
import type {
  ILeagueRole,
  ISummonerData,
} from '@/features/game/types/game.types'
import { cn } from '@/lib/utils'
import Image from 'next/image'
import { memo } from 'react'
import { FlashButton } from './flash-button.component'
import { TimerControls } from './timer-controls.component'

const LUCIDITY_BOOTS_ICON =
  'https://res.cloudinary.com/dw3mwclgk/image/upload/v1717152629/LolTimeFlash/lucidity-boots.png'

interface IRoleCardProps {
  role: ILeagueRole
  data: ISummonerData
  onFlashClick: () => void
  onToggleBoots: () => void
  onAdjustTimer?: (seconds: number) => void
  className?: string
}

const RoleCardComponent = (props: IRoleCardProps) => {
  const { role, data, onFlashClick, onToggleBoots, onAdjustTimer, className } =
    props

  const remainingSeconds = getRemainingTime(data.isFlashed)
  const isOnCooldown = remainingSeconds > 0

  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-2 md:gap-4',
        className
      )}
    >
      {/* Flash Button with Lucidity Boots overlay */}
      <div className="relative">
        <FlashButton
          iconSrc={data.champion?.championIconUrl || role.src}
          cooldown={data.isFlashed}
          onClick={onFlashClick}
        />

        {/* Lucidity Boots toggle - absolute positioned top-right */}
        <button
          onClick={onToggleBoots}
          className="absolute -right-2 -top-2 z-10 rounded-lg bg-black/50 p-0.5 transition-transform hover:scale-110 active:scale-95 md:-right-3 md:-top-3"
          aria-label="Toggle Lucidity Boots"
        >
          <Image
            src={LUCIDITY_BOOTS_ICON}
            alt="Lucidity Boots"
            width={80}
            height={80}
            className={cn(
              'size-10 rounded-md md:size-14',
              !data.lucidityBoots && 'opacity-50'
            )}
          />
        </button>
      </div>

      {/* Timer Controls (±2s buttons) - always rendered for consistent layout */}
      {onAdjustTimer && (
        <TimerControls
          isOnCooldown={isOnCooldown}
          onAdjust={(seconds) => onAdjustTimer(seconds)}
        />
      )}
    </div>
  )
}

export const RoleCard = memo(RoleCardComponent, (prev, next) => {
  return (
    prev.role.name === next.role.name &&
    prev.role.src === next.role.src &&
    prev.data.isFlashed === next.data.isFlashed &&
    prev.data.lucidityBoots === next.data.lucidityBoots &&
    prev.data.champion?.championIconUrl === next.data.champion?.championIconUrl
  )
})
