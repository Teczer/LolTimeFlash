import { cn } from '@/lib/utils'
import Image from 'next/image'
import { memo } from 'react'

interface ITimerControlButtonProps {
  iconSrc: string
  label: string
  glowColor: string
  textColor: string
  onClick: () => void
  ariaLabel: string
  className?: string
}

const TimerControlButtonComponent = (props: ITimerControlButtonProps) => {
  const {
    iconSrc,
    label,
    glowColor,
    textColor,
    onClick,
    ariaLabel,
    className,
  } = props

  return (
    <button
      onClick={onClick}
      className={cn(
        'group relative flex flex-col items-center justify-center gap-1',
        'rounded-lg p-2 transition-all duration-200',
        'hover:scale-110',
        'active:scale-95',
        className
      )}
      aria-label={ariaLabel}
      type="button"
    >
      <div className="relative h-12 w-12 sm:h-14 sm:w-14">
        <Image
          src={iconSrc}
          alt={ariaLabel}
          fill
          className={cn(
            'rounded-lg object-contain transition-all duration-300',
            'opacity-70 brightness-50 saturate-50',
            'group-hover:opacity-100 group-hover:brightness-110 group-hover:saturate-100',
            'group-active:opacity-100 group-active:brightness-100 group-active:saturate-100'
          )}
          style={{
            filter: 'drop-shadow(0 4px 6px rgba(0, 0, 0, 0.3))',
          }}
          sizes="56px"
        />
        <div
          className="pointer-events-none absolute inset-0 rounded-lg opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{
            boxShadow: `0 0 20px ${glowColor}, 0 0 90px ${glowColor}`,
          }}
        />
      </div>
      <span
        className={cn(
          'textstroke text-xs font-bold sm:text-sm',
          'opacity-80 transition-opacity group-hover:opacity-100',
          textColor
        )}
      >
        {label}
      </span>
    </button>
  )
}

export const TimerControlButton = memo(TimerControlButtonComponent)
