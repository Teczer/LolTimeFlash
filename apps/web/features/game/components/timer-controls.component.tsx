'use client'

import { cn } from '@/lib/utils'
import { memo } from 'react'

interface ITimerControlsProps {
  isOnCooldown: boolean
  onAdjust: (seconds: number) => void
  className?: string
}

const TimerControlsComponent = (props: ITimerControlsProps) => {
  const { isOnCooldown, onAdjust, className } = props

  if (!isOnCooldown) return null

  return (
    <div
      className={cn(
        'flex items-center justify-center gap-2 sm:gap-3',
        className
      )}
    >
      <button
        onClick={() => onAdjust(-2)}
        className={cn(
          'group relative flex items-center justify-center gap-1',
          'h-8 min-w-[60px] rounded-lg px-3 sm:h-10 sm:min-w-[70px] sm:px-4',
          'border border-red-500/30 bg-gradient-to-br from-red-600/90 to-red-700/90',
          'text-xs font-bold text-white shadow-lg sm:text-sm',
          'transition-all duration-200',
          'hover:border-red-400/50 hover:from-red-500/90 hover:to-red-600/90 hover:shadow-red-500/20',
          'active:scale-95 active:shadow-inner',
          'backdrop-blur-sm'
        )}
        aria-label="Subtract 2 seconds"
        type="button"
      >
        <span className="text-base sm:text-lg">−</span>
        <span>2s</span>
      </button>

      <button
        onClick={() => onAdjust(+2)}
        className={cn(
          'group relative flex items-center justify-center gap-1',
          'h-8 min-w-[60px] rounded-lg px-3 sm:h-10 sm:min-w-[70px] sm:px-4',
          'border border-green-500/30 bg-gradient-to-br from-green-600/90 to-green-700/90',
          'text-xs font-bold text-white shadow-lg sm:text-sm',
          'transition-all duration-200',
          'hover:border-green-400/50 hover:from-green-500/90 hover:to-green-600/90 hover:shadow-green-500/20',
          'active:scale-95 active:shadow-inner',
          'backdrop-blur-sm'
        )}
        aria-label="Add 2 seconds"
        type="button"
      >
        <span className="text-base sm:text-lg">+</span>
        <span>2s</span>
      </button>
    </div>
  )
}

export const TimerControls = memo(TimerControlsComponent)
