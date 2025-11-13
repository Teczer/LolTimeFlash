import { useState } from 'react'

import { useUsernameStore } from '@/app/store/username.store'
import { useParams } from 'next/navigation'

import { Input } from '../input'
import { Button } from '../button'

import { GrFormNextLink } from 'react-icons/gr'

const UsernameInput: React.FC = () => {
  const [inputValue, setInputValue] = useState<string>('')
  const { setUsername } = useUsernameStore()
  const params = useParams()

  const handleSubmit = (e: React.FormEvent) => {
    if (inputValue.trim()) {
      setUsername(inputValue.trim())
    }
    location.reload()
  }

  return (
    <div className="mx-auto min-h-screen max-w-screen-2xl">
      <form
        onSubmit={handleSubmit}
        className="flex min-h-screen flex-col items-center justify-center gap-10 p-4 sm:p-20"
      >
        <h1 className="textstroke text-lg sm:text-2xl">
          You are joining lobby{' '}
          <span className="text-[#C89B3C]">{params.roomId}</span>
        </h1>
        <div className="flex w-full items-center justify-center gap-2 sm:w-1/2">
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
