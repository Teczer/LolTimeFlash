/**
 * Audio hook for Flash sound effects
 */

import { useRef, useState, useEffect } from 'react'
import { FLASH_AUDIO_PATH, AUDIO_VOLUME } from '../constants/game.constants'

interface IUseAudioReturn {
  play: () => Promise<void>
  isPlaying: boolean
  volume: 'on' | 'off'
  toggleVolume: () => void
}

export const useAudio = (): IUseAudioReturn => {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [volume, setVolume] = useState<'on' | 'off'>('on')
  const [mounted, setMounted] = useState(false)

  // Initialize audio element
  useEffect(() => {
    setMounted(true)
    if (typeof window !== 'undefined') {
      audioRef.current = new Audio(FLASH_AUDIO_PATH)
      audioRef.current.volume = AUDIO_VOLUME

      // Load volume from localStorage
      const savedVolume = localStorage.getItem('volume') as 'on' | 'off' | null
      if (savedVolume) {
        setVolume(savedVolume)
      }
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current = null
      }
    }
  }, [])

  const play = async (): Promise<void> => {
    if (volume === 'off' || !audioRef.current) return

    try {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
      setIsPlaying(true)
      await audioRef.current.play()
      setIsPlaying(false)
    } catch (error) {
      console.error('Error playing audio:', error)
      setIsPlaying(false)
    }
  }

  const toggleVolume = (): void => {
    const newVolume = volume === 'on' ? 'off' : 'on'
    setVolume(newVolume)
    localStorage.setItem('volume', newVolume)
  }

  return {
    play,
    isPlaying,
    volume,
    toggleVolume,
  }
}

