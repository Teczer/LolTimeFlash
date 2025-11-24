'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useParams } from 'next/navigation'
import { useState } from 'react'
import { GrFormNextLink } from 'react-icons/gr'

export const UsernameInputModal = () => {
  const [inputValue, setInputValue] = useState<string>('')
  const params = useParams()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (inputValue.trim()) {
      localStorage.setItem('username', inputValue.trim())
      location.reload()
    }
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

