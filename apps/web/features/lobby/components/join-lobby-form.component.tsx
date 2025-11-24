import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { useRouter } from 'next/navigation'
import { FormEvent, memo, useState } from 'react'
import { GrFormNextLink } from 'react-icons/gr'

const LOBBY_CODE_LENGTH = 10

const JoinLobbyFormComponent = () => {
  const router = useRouter()
  const [joinLobbyCode, setJoinLobbyCode] = useState<string>('')
  const [isError, setIsError] = useState<boolean>(false)

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (joinLobbyCode.length === LOBBY_CODE_LENGTH) {
      router.push(`/game/${joinLobbyCode}`)
    } else {
      setIsError(true)
    }
  }

  const handleChange = (value: string) => {
    setJoinLobbyCode(value)
  }

  return (
    <div className="flex flex-col items-center justify-center gap-4 sm:w-1/3 sm:gap-4">
      <h1 className="text-xl">Join a Lobby</h1>

      <form
        className="flex items-center justify-center gap-4"
        onSubmit={handleSubmit}
      >
        <Input
          type="text"
          className="bg-background font-sans"
          placeholder="Enter lobby code"
          value={joinLobbyCode}
          onChange={(e) => handleChange(e.target.value)}
        />
        <Button variant="outline" size="icon" type="submit">
          <GrFormNextLink className="h-4 w-4" />
        </Button>
      </form>

      {isError && (
        <p
          className={cn('text-xs font-bold text-red-700', {
            'text-green-500': joinLobbyCode.length === LOBBY_CODE_LENGTH,
          })}
        >
          The lobby code must be {LOBBY_CODE_LENGTH} characters,{' '}
          {joinLobbyCode.length} actual.
        </p>
      )}
    </div>
  )
}

export const JoinLobbyForm = memo(JoinLobbyFormComponent)
