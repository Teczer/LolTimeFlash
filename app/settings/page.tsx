'use client'

import { useState, FormEvent } from 'react'

import Link from 'next/link'

import { currentUsername } from '@/lib/constants'

import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

import { GrFormNextLink } from 'react-icons/gr'
import { RxTrackPrevious } from 'react-icons/rx'

export default function Home() {
  const [inputValue, setInputValue] = useState<string>('')
  const [username, setUsername] = useState<string | null>(
    currentUsername || null
  )

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    localStorage.setItem('username', inputValue)
    setUsername(inputValue)
  }

  return (
    <div className="mx-auto min-h-screen max-w-screen-2xl">
      <Link className="fixed left-6 top-6 sm:left-20 sm:top-10" href={'/'}>
        <Button variant="outline" size="icon">
          <RxTrackPrevious className="h-4 w-4" />
        </Button>
      </Link>
      <form
        onSubmit={handleSubmit}
        className="flex min-h-screen flex-col items-center justify-center gap-10 p-4 sm:p-20"
      >
        <h1 className="textstroke text-lg sm:text-2xl">
          Change or set your username
        </h1>
        {username && (
          <p className="text-sm font-medium">
            Your username is :
            <span className="text-lg font-bold text-[#C89B3C]">
              {' '}
              {username}
            </span>
          </p>
        )}
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
