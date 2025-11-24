import { cn } from '@/lib/utils'
import { memo } from 'react'
import { TimerControlButton } from './timer-control-button.component'

interface ITimerControlsProps {
  isOnCooldown: boolean
  onAdjust: (seconds: number) => void
  className?: string
}

const adjustMinusColor = 'rgba(239,68,68,0.6)'
const adjustPlusColor = 'rgba(84,140,180,0.6)'

const TimerControlsComponent = (props: ITimerControlsProps) => {
  const { isOnCooldown, onAdjust, className } = props

  return (
    <div
      className={cn(
        'flex items-center justify-center gap-3 sm:gap-4',
        !isOnCooldown && 'pointer-events-none invisible',
        className
      )}
    >
      <TimerControlButton
        iconSrc="/assets/w-zilean-icon.png"
        label="-2s"
        glowColor={adjustMinusColor}
        textColor="text-red-400"
        onClick={() => onAdjust(-2)}
        ariaLabel="Rewind 2 seconds (Zilean E)"
        isVisible={isOnCooldown}
      />

      <TimerControlButton
        iconSrc="/assets/e-zilean-icon.png"
        label="+2s"
        glowColor={adjustPlusColor}
        textColor="text-[#548CA4]"
        onClick={() => onAdjust(+2)}
        ariaLabel="Speed up 2 seconds (Zilean W)"
        isVisible={isOnCooldown}
      />
    </div>
  )
}

export const TimerControls = memo(TimerControlsComponent)
