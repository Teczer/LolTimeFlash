'use client'

import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { memo } from 'react'
import { ImVolumeMedium, ImVolumeMute2 } from 'react-icons/im'
import { RxTrackPrevious } from 'react-icons/rx'

interface IGameControlsProps {
  volume: 'on' | 'off'
  onToggleVolume: () => void
}

const GameControlsComponent = (props: IGameControlsProps) => {
  const { volume, onToggleVolume } = props
  const router = useRouter()

  const handleGoBack = () => {
    router.push('/')
  }

  return (
    <>
      {/* Back Button */}
      <Button
        className="absolute left-6 top-6 sm:left-20 sm:top-10"
        onClick={handleGoBack}
        variant="outline"
        size="icon"
        aria-label="Go back to home"
      >
        <RxTrackPrevious className="h-4 w-4" />
      </Button>

      {/* Volume Button */}
      <Button
        className="absolute right-6 top-6 sm:left-20 sm:top-24"
        onClick={onToggleVolume}
        variant="outline"
        size="icon"
        aria-label={`Volume ${volume}`}
      >
        {volume === 'on' ? (
          <ImVolumeMedium className="h-4 w-4" />
        ) : (
          <ImVolumeMute2 className="h-4 w-4" />
        )}
      </Button>
    </>
  )
}

export const GameControls = memo(GameControlsComponent, (prev, next) => {
  return prev.volume === next.volume
})
