'use client'

import Link from 'next/link'

import { Button } from '@/components/ui/button'
import {
  CreateLobbyForm,
  JoinLobbyForm,
  LobbyDivider,
} from '@/features/lobby/components'

import { RxTrackPrevious } from 'react-icons/rx'

export default function LobbyPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-8 p-20 sm:flex sm:flex-row sm:justify-around sm:gap-0">
      <Link className="fixed left-6 top-6 sm:left-20 sm:top-10" href={'/'}>
        <Button variant="outline" size="icon">
          <RxTrackPrevious className="h-4 w-4" />
        </Button>
      </Link>
      <CreateLobbyForm />
      <LobbyDivider />
      <JoinLobbyForm />
    </main>
  )
}
