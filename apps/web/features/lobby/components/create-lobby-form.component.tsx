import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useToast } from '@/hooks/use-toast.hook'
import { generateLobbyCodeId } from '@/lib/utils'
import { useRouter } from 'next/navigation'
import { memo, useState } from 'react'
import { FaCopy } from 'react-icons/fa'
import { GrFormNextLink } from 'react-icons/gr'

const CreateLobbyFormComponent = () => {
  const router = useRouter()
  const { toast } = useToast()
  const [lobbyCode, setLobbyCode] = useState<string>('')

  const handleCreateLobby = () => {
    const code: string = generateLobbyCodeId(10)
    setLobbyCode(code)
  }

  const handleCopyCode = () => {
    if (lobbyCode) {
      navigator.clipboard.writeText(lobbyCode)
      toast({
        title: 'Your lobby code has been copied to your clipboard!',
      })
    }
  }

  const handleJoinLobby = () => {
    router.push(`/game/${lobbyCode}`)
  }

  return (
    <div className="flex flex-col items-center justify-center gap-4 sm:w-1/3 sm:gap-8">
      <h1 className="text-xl">Create a Lobby</h1>
      
      {!lobbyCode && (
        <Button variant="outline" onClick={handleCreateLobby}>
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
              value={lobbyCode}
              readOnly
            />
            <Button variant="outline" size="icon" onClick={handleCopyCode}>
              <FaCopy className="h-4 w-4" />
            </Button>
          </div>
          <Button onClick={handleJoinLobby} variant="outline" size="icon">
            <GrFormNextLink className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  )
}

export const CreateLobbyForm = memo(CreateLobbyFormComponent)

