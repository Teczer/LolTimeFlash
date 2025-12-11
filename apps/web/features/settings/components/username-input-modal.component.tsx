'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { MAX_USERNAME_LENGTH, MIN_USERNAME_LENGTH } from '@loltimeflash/shared'
import { useParams } from 'next/navigation'
import { useState } from 'react'
import { GrFormNextLink } from 'react-icons/gr'
import { UsernameValidationFeedback } from './username-validation-feedback.component'

export const UsernameInputModal = () => {
  const [inputValue, setInputValue] = useState<string>('')
  const [error, setError] = useState<string>('')
  const params = useParams()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const trimmedValue = inputValue.trim()

    if (!trimmedValue) {
      setError('Username cannot be empty')
      return
    }

    if (trimmedValue.length < MIN_USERNAME_LENGTH) {
      setError(`Username must be at least ${MIN_USERNAME_LENGTH} characters`)
      return
    }

    if (trimmedValue.length > MAX_USERNAME_LENGTH) {
      setError(`Username must be at most ${MAX_USERNAME_LENGTH} characters`)
      return
    }

    localStorage.setItem('username', trimmedValue)
      location.reload()
    }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setInputValue(value)
    setError('')
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
        
        <div className="flex w-full flex-col items-center justify-center gap-2 sm:w-1/2">
          <div className="flex w-full items-center justify-center gap-2">
          <Input
            type="text"
              className="bg-background w-1/2"
            placeholder="Enter your username"
            value={inputValue}
              onChange={handleChange}
          />

          <Button type="submit" variant="outline" size="icon">
            <GrFormNextLink className="h-4 w-4" />
          </Button>
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}

          <UsernameValidationFeedback
            usernameLength={inputValue.length}
            className={cn('invisible', {
              visible: inputValue.length > 0,
            })}
          />
        </div>
      </form>
    </div>
  )
}
