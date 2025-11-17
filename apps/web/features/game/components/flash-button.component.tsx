'use client'

import { cn } from '@/lib/utils'
import Image from 'next/image'
import { memo } from 'react'
import { formatCooldown } from '../hooks/use-flash-cooldown.hook'
import type { TRole } from '../types/game.types'

interface IFlashButtonProps {
  role: TRole
  iconSrc: string
  cooldown: number | false
  onClick: () => void
  className?: string
}

const FlashButtonComponent = (props: IFlashButtonProps) => {
  const { role, iconSrc, cooldown, onClick, className } = props

  const isOnCooldown = typeof cooldown === 'number'

  return (
    <button
      onClick={onClick}
      className={cn(
        'relative size-28 transition-all sm:size-64 sm:hover:scale-110',
        className
      )}
      aria-label={`Flash for ${role}`}
    >
      {/* Timer overlay */}
      {isOnCooldown && (
        <p className="textstroke absolute left-1/2 top-1/2 z-20 -translate-x-1/2 -translate-y-1/2 transform text-xl font-bold sm:text-[3rem]">
          {formatCooldown(cooldown)}
        </p>
      )}

      {/* Role icon */}
      <Image
        draggable={false}
        className={cn(
          'h-full w-full cursor-pointer',
          isOnCooldown ? 'brightness-50' : 'brightness-100'
        )}
        width={600}
        height={600}
        src={iconSrc}
        alt={role}
        priority
      />
    </button>
  )
}

export const FlashButton = memo(FlashButtonComponent, (prev, next) => {
  return prev.cooldown === next.cooldown
})
