import { useUsername } from '@/app/store/useUsername'
import { useState } from 'react'
import { Input } from '../input'
import { Button } from '../button'
import { GrFormNextLink } from 'react-icons/gr'
import { useParams } from 'next/navigation'

const UsernameInput: React.FC = () => {
  const [inputValue, setInputValue] = useState<string>('')
  const { setUsername } = useUsername()
  const params = useParams()

  const handleSubmit = (e: React.FormEvent) => {
    if (inputValue.trim()) {
      setUsername(inputValue.trim())
    }
    location.reload()
  }

  return (
    <div className="min-h-screen max-w-screen-2xl mx-auto">
      <form
        onSubmit={handleSubmit}
        className="p-4 flex flex-col items-center justify-center gap-10 min-h-screen sm:p-20"
      >
        <h1 className="textstroke text-lg sm:text-2xl">
          You are joining lobby{' '}
          <span className="text-[#C89B3C]">{params.roomId}</span>
        </h1>
        <div className="w-full flex items-center justify-center gap-2 sm:w-1/2">
          <Input
            type="text"
            className="w-1/2 bg-background"
            placeholder="Enter your username"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />

          <Button type="submit" variant="outline" size="icon">
            <GrFormNextLink className="h-4 w-4" />
          </Button>
        </div>
      </form>
    </div>
  )
}

export default UsernameInput
