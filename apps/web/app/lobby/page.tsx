'use client'

import { useState } from 'react'

import { useRouter } from 'next/navigation'
import Link from 'next/link'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useToast } from '@/hooks/use-toast.hook'

import { RxTrackPrevious } from 'react-icons/rx'
import { GrFormNextLink } from 'react-icons/gr'
import { FaCopy } from 'react-icons/fa'
import { cn, generateLobbyCodeId } from '@/lib/utils'

export default function Home() {
  const router = useRouter()
  const { toast } = useToast()

  const [joinLobbyCode, setJoinLobbyCode] = useState<string>('')
  const [lobbyCode, setLobbyCode] = useState<string>('')
  const [isError, setIsError] = useState<boolean>(false)

  function createLobbyCode() {
    const code: string = generateLobbyCodeId(10)
    setLobbyCode(code)
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-8 p-20 sm:flex sm:flex-row sm:justify-around sm:gap-0">
      <Link className="fixed left-6 top-6 sm:left-20 sm:top-10" href={'/'}>
        <Button variant="outline" size="icon">
          <RxTrackPrevious className="h-4 w-4" />
        </Button>
      </Link>
      {/* CREATE LOBBY */}
      <div className="flex flex-col items-center justify-center gap-4 sm:w-1/3 sm:gap-8">
        <h1 className="text-xl">Create a Lobby</h1>
        {!lobbyCode && (
          <Button variant="outline" onClick={() => createLobbyCode()}>
            Create Lobby
          </Button>
        )}
        {lobbyCode && (
          <div className="flex w-full flex-col items-center justify-start gap-4">
            <p>Your lobby code is :</p>
            <div className="flex items-center justify-center gap-1">
              <Input
                className="bg-background font-sans"
                type="text"
                placeholder="Flash Timer"
                value={lobbyCode || ''}
                readOnly
              />
              <Button
                variant="outline"
                size="icon"
                onClick={() => {
                  if (lobbyCode) {
                    navigator.clipboard.writeText(lobbyCode)
                    toast({
                      title:
                        'Your lobby code has been copied to your clipboard!',
                    })
                  }
                }}
              >
                <FaCopy className="h-4 w-4" />
              </Button>
            </div>
            <Button
              onClick={() => {
                router.push(`/game/${lobbyCode}`)
              }}
              variant="outline"
              size="icon"
            >
              <GrFormNextLink className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
      {/* BORDER */}
      <div className="h-[1px] w-4/5 bg-slate-500 sm:h-[600px] sm:w-[1px]"></div>
      {/* JOIN LOBBY */}
      <div className="flex flex-col items-center justify-center gap-4 sm:w-1/3 sm:gap-8">
        <h1 className="text-xl">Join a Lobby</h1>
        <form
          className="flex items-center justify-center gap-4"
          onSubmit={(e) => {
            e.preventDefault()
            if (joinLobbyCode.length === 10) {
              router.push(`/game/${joinLobbyCode}`)
            } else {
              setIsError(true)
            }
          }}
        >
          <Input
            type="text"
            className="bg-background font-sans"
            placeholder="Enter lobby code"
            value={joinLobbyCode}
            onChange={(e) => setJoinLobbyCode(e.target.value)}
          />
          <Button
            variant="outline"
            size="icon"
            onClick={() => {
              if (joinLobbyCode.length === 10) {
                router.push(`/game/${joinLobbyCode}`)
              } else {
                setIsError(true)
              }
            }}
          >
            <GrFormNextLink className="h-4 w-4" />
          </Button>
        </form>
        {isError && (
          <p
            className={cn('text-xs font-bold text-red-700', {
              'text-green-500': joinLobbyCode.length === 10,
            })}
          >
            The lobby code must be 10 characters, {joinLobbyCode.length} actual.
          </p>
        )}
      </div>
    </main>
  )
}
