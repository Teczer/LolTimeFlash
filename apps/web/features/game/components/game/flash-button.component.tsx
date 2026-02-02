'use client'

import {
  formatCooldown,
  getRemainingTime,
} from '@/features/game/hooks/use-flash-cooldown.hook'
import { cn } from '@/lib/utils'
import Image from 'next/image'
import { memo, useEffect, useState } from 'react'

interface IFlashButtonProps {
  iconSrc: string
  cooldown: number | false
  onClick: () => void
  className?: string
}

const FlashButtonComponent = (props: IFlashButtonProps) => {
  const { iconSrc, cooldown, onClick, className } = props
  const isDDragonIcon = iconSrc.includes('ddragon.leagueoflegends.com')

  const [, setTick] = useState(0)

  useEffect(() => {
    if (typeof cooldown === 'number') {
      const interval = setInterval(() => {
        setTick((prev) => prev + 1)
      }, 1000)

      return () => clearInterval(interval)
    }
  }, [cooldown])

  const remainingSeconds = getRemainingTime(cooldown)
  const isOnCooldown = remainingSeconds > 0

  return (
    <button
      onClick={onClick}
      className={cn(
        'relative size-28 transition-all md:size-56 md:hover:scale-105',
        isDDragonIcon && 'size-24 md:size-40',
        className
      )}
      aria-label="Flash button"
    >
      {/* Timer overlay */}
      {isOnCooldown && (
        <p className="textstroke absolute left-1/2 top-1/2 z-20 -translate-x-1/2 -translate-y-1/2 transform text-2xl font-bold md:text-[2.5rem]">
          {formatCooldown(remainingSeconds)}
        </p>
      )}

      {/* Champion/Role icon */}
      <Image
        draggable={false}
        className={cn(
          'h-full w-full cursor-pointer rounded-xl transition-all duration-300',
          isOnCooldown ? 'brightness-50 grayscale' : 'brightness-100'
        )}
        width={600}
        height={600}
        src={iconSrc}
        alt="Role icon"
        priority
        unoptimized={isDDragonIcon}
      />
    </button>
  )
}

export const FlashButton = memo(FlashButtonComponent, (prev, next) => {
  return prev.cooldown === next.cooldown && prev.iconSrc === next.iconSrc
})
