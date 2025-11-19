'use client'

import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'

interface IGameInfoDisplayProps {
  gameId?: number
  gameStartTime?: number
  className?: string
}

export const GameInfoDisplay = (props: IGameInfoDisplayProps) => {
  const { gameId, gameStartTime, className } = props
  const [elapsedTime, setElapsedTime] = useState('00:00:00')

  useEffect(() => {
    if (!gameStartTime) {
      setElapsedTime('00:00:00')
      return
    }

    const calculateElapsedTime = () => {
      const now = Date.now()
      const elapsed = Math.floor((now - gameStartTime) / 1000) // Convert to seconds

      const hours = Math.floor(elapsed / 3600)
      const minutes = Math.floor((elapsed % 3600) / 60)
      const seconds = elapsed % 60

      const formatted = `${hours.toString().padStart(2, '0')}:${minutes
        .toString()
        .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`

      setElapsedTime(formatted)
    }

    // Calculate immediately
    calculateElapsedTime()

    // Update every second
    const interval = setInterval(calculateElapsedTime, 1000)

    return () => clearInterval(interval)
  }, [gameStartTime])

  if (!gameId || !gameStartTime) {
    return null
  }

  return (
    <div
      className={cn(
        'flex flex-col items-center gap-1 rounded-lg border border-border/50 bg-background/80 px-4 py-2 backdrop-blur-sm',
        className
      )}
    >
      <div className="flex items-center gap-2">
        <span className="text-xs text-muted-foreground">Game ID:</span>
        <span className="font-mono text-sm font-semibold text-foreground">
          {gameId}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-xs text-muted-foreground">Elapsed Time:</span>
        <span className="font-mono text-lg font-bold text-primary">
          {elapsedTime}
        </span>
      </div>
    </div>
  )
}

