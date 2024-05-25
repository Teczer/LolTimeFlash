'use client'

import { useState } from 'react'

import { useRouter } from 'next/navigation'
import Link from 'next/link'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useToast } from '@/components/ui/use-toast'

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
    <main className="min-h-screen flex flex-col items-center justify-center gap-8 p-20 sm:flex sm:flex-row sm:justify-around sm:gap-0">
      <Link className="fixed top-6 left-6 sm:top-10 sm:left-20" href={'/'}>
        <Button variant="outline" size="icon">
          <RxTrackPrevious className="h-4 w-4" />
        </Button>
      </Link>
      {/* CREATE LOBBY */}
      <div className="flex flex-col justify-center items-center gap-4 sm:gap-8 sm:w-1/3">
        <h1 className="text-xl">Create a Lobby</h1>
        {!lobbyCode && (
          <Button variant="outline" onClick={() => createLobbyCode()}>
            Create Lobby
          </Button>
        )}
        {lobbyCode && (
          <div className="w-full flex flex-col justify-start items-center gap-4">
            <p>Your lobby code is :</p>
            <div className="flex justify-center items-center gap-1">
              <Input
                className="font-sans bg-background"
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
      <div className="bg-slate-500 w-4/5 h-[1px] sm:w-[1px] sm:h-[600px]"></div>
      {/* JOIN LOBBY */}
      <div className="flex flex-col justify-center items-center gap-4 sm:gap-8 sm:w-1/3">
        <h1 className="text-xl">Join a Lobby</h1>
        <form
          className="flex justify-center items-center gap-4"
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
            className="font-sans bg-background"
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
            className={cn('text-xs text-red-700 font-bold', {
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
