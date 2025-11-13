'use client'

import { useUsernameStore } from '@/app/store/username.store'
import UsernameProvider from '@/components/UsernameProvider'
import { GameMultiplayerScreen } from '@/features/game/screens/game-multiplayer.screen'
import { use } from 'react'

interface IGameRoomPageProps {
  params: Promise<{
    roomId: string
  }>
}

function GameRoomContent({ roomId }: { roomId: string }) {
  const { username } = useUsernameStore()

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
