'use client'

import { cn } from '@/lib/utils'
import Image from 'next/image'
import { memo, useEffect, useState } from 'react'
import {
  formatCooldown,
  getRemainingTime,
} from '../hooks/use-flash-cooldown.hook'
import type { TRole } from '../types/game.types'

interface IFlashButtonProps {
  role: TRole
  iconSrc: string
  cooldown: number | false
  onClick: () => void
  summonerName?: string
  className?: string
}

const FlashButtonComponent = (props: IFlashButtonProps) => {
  const { role, iconSrc, cooldown, onClick, summonerName, className } = props
  const isDDragonIcon = iconSrc.includes('ddragon.leagueoflegends.com')

  // ✅ Force re-render every second to update countdown display
  const [tick, setTick] = useState(0)

  useEffect(() => {
    // Only run interval if cooldown is active
    if (typeof cooldown === 'number') {
      const interval = setInterval(() => {
        setTick((prev) => prev + 1) // Force re-render
      }, 1000) // Update every second

      return () => clearInterval(interval)
    }
  }, [cooldown])

  // ✅ Calculate remaining time dynamically from timestamp (recalculated on every tick)
  const remainingSeconds = getRemainingTime(cooldown)
  const isOnCooldown = remainingSeconds > 0

  return (
    <div className="flex flex-col items-center gap-2">
      <button
        onClick={onClick}
        className={cn(
          'relative size-28 transition-all sm:size-64 sm:hover:scale-110',
          isDDragonIcon && 'size-12 sm:size-36',
          className
        )}
        aria-label={`Flash for ${role}`}
      >
        {/* Timer overlay */}
        {isOnCooldown && (
          <p className="textstroke absolute left-1/2 top-1/2 z-20 -translate-x-1/2 -translate-y-1/2 transform text-xl font-bold sm:text-[3rem]">
            {formatCooldown(remainingSeconds)}
          </p>
        )}

        {/* Champion/Role icon */}
        <Image
          draggable={false}
          className={cn(
            'h-full w-full cursor-pointer rounded-lg transition-all duration-300',
            isOnCooldown ? 'brightness-50 grayscale' : 'brightness-100'
          )}
          width={600}
          height={600}
          src={iconSrc}
          alt={summonerName || role}
          priority
          unoptimized={isDDragonIcon}
        />
      </button>

      {/* Summoner name */}
      {summonerName && (
        <p className="textstroke max-w-[112px] truncate text-center text-sm font-semibold text-white sm:max-w-[256px] sm:text-lg">
          {summonerName}
        </p>
      )}
    </div>
  )
}

export const FlashButton = memo(FlashButtonComponent, (prev, next) => {
  // ✅ Re-render when cooldown or iconSrc changes
  // Internal tick state will force re-renders every second during countdown
  return prev.cooldown === next.cooldown && prev.iconSrc === next.iconSrc
})
