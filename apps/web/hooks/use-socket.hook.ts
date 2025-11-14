/**
 * Socket Hook
 * Manages WebSocket connection to NestJS backend
 */

'use client'

import type {
  ClientToServerEvents,
  GameState,
  Role,
  ServerToClientEvents,
} from '@loltimeflash/shared'
import config from '@/lib/config'
import { useEffect, useRef, useState } from 'react'
import { io, Socket } from 'socket.io-client'

type TTypedSocket = Socket<ServerToClientEvents, ClientToServerEvents>

interface IUseSocketOptions {
  enabled?: boolean
  roomId?: string
  username?: string
}

interface IUseSocketReturn {
  socket: TTypedSocket | null
  isConnected: boolean
  reconnectAttempts: number
  gameState: GameState | null
  joinRoom: (roomId: string, username: string) => void
  leaveRoom: (roomId: string) => void
  useFlash: (role: Role) => void
  cancelFlash: (role: Role) => void
  toggleItem: (role: Role, item: 'lucidityBoots' | 'cosmicInsight') => void
}

export const useSocket = (
  options: IUseSocketOptions = {}
): IUseSocketReturn => {
  const { enabled = false, roomId, username } = options

  const socketRef = useRef<TTypedSocket | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [reconnectAttempts, setReconnectAttempts] = useState(0)
  const [gameState, setGameState] = useState<GameState | null>(null)

  // Initialize socket connection
  useEffect(() => {
    if (!enabled) return

    const socket: TTypedSocket = io(config.socketPort, {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    })

    socketRef.current = socket

    // Connection events
    socket.on('connect', () => {
      console.log('✅ Connected to backend:', socket.id)
      setIsConnected(true)
      setReconnectAttempts(0) // Reset on successful connection
    })

    socket.on('disconnect', (reason) => {
      console.warn('❌ Disconnected from backend:', reason)
      setIsConnected(false)
    })

    socket.io.on('reconnect_attempt', (attempt) => {
      console.log(`🔄 Reconnection attempt ${attempt}...`)
      setReconnectAttempts(attempt)
    })

    socket.io.on('reconnect_failed', () => {
      console.error('❌ Reconnection failed after max attempts')
    })

    // Game events
    socket.on('room:state', (updatedGameState) => {
      console.log('🔄 Room state updated:', updatedGameState)
      setGameState(updatedGameState)
    })

    socket.on('game:flash', (flashData) => {
      console.log('⚡ Flash used:', flashData)
    })

    socket.on('game:flash:cancel', (cancelData) => {
      console.log('❌ Flash cancelled:', cancelData)
    })

    socket.on('game:toggle:item', (itemData) => {
      console.log('🔧 Item toggled:', itemData)
    })

    socket.on('room:user:joined', (data) => {
      console.log('👤 User joined:', data.username)
    })

    socket.on('room:user:left', (data) => {
      console.log('👋 User left:', data.username)
    })

    socket.on('error', (error) => {
      console.error('❌ Socket error:', error)
    })

    return () => {
      console.log('🔌 Cleaning up socket connection')
      socket.disconnect()
    }
  }, [enabled])

  // Auto-join room when connected
  useEffect(() => {
    if (isConnected && roomId && username && socketRef.current) {
      console.log(`🚪 Auto-joining room: ${roomId} as ${username}`)
      socketRef.current.emit('room:join', { roomId, username })
    }
  }, [isConnected, roomId, username])

  const joinRoom = (roomId: string, username: string): void => {
    if (socketRef.current) {
      socketRef.current.emit('room:join', { roomId, username })
    }
  }

  const leaveRoom = (roomId: string): void => {
    if (socketRef.current) {
      socketRef.current.emit('room:leave', { roomId })
    }
  }

  const useFlash = (role: Role): void => {
    if (socketRef.current) {
      socketRef.current.emit('game:flash', { role })
    }
  }

  const cancelFlash = (role: Role): void => {
    if (socketRef.current) {
      socketRef.current.emit('game:flash:cancel', { role })
    }
  }

  const toggleItem = (
    role: Role,
    item: 'lucidityBoots' | 'cosmicInsight'
  ): void => {
    if (socketRef.current) {
      socketRef.current.emit('game:toggle:item', { role, item })
    }
  }

  return {
    socket: socketRef.current,
    isConnected,
    reconnectAttempts,
    gameState,
    joinRoom,
    leaveRoom,
    useFlash,
    cancelFlash,
    toggleItem,
  }
}
