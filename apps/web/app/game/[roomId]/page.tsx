'use client'

import { UsernameProvider } from '@/components/providers/username-provider.component'
import { GameMultiplayerScreen } from '@/features/game/screens/game-multiplayer.screen'
import { use, useState } from 'react'

interface IGameRoomPageProps {
  params: Promise<{
    roomId: string
  }>
}

function GameRoomContent({ roomId }: { roomId: string }) {
  const [username] = useState<string | null>(
    typeof window !== 'undefined' ? localStorage.getItem('username') : null
  )

  if (!username) return null

  return <GameMultiplayerScreen roomId={roomId} username={username} />
}

export default function GameRoomPage({ params }: IGameRoomPageProps) {
  const { roomId } = use(params)

  return (
    <UsernameProvider>
      <GameRoomContent roomId={roomId} />
    </UsernameProvider>
  )
}
