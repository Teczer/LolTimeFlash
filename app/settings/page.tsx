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
    <div className="min-h-screen max-w-screen-2xl mx-auto">
      <Link className="fixed top-6 left-6 sm:top-10 sm:left-20" href={'/'}>
        <Button variant="outline" size="icon">
          <RxTrackPrevious className="h-4 w-4" />
        </Button>
      </Link>
      <form
        onSubmit={handleSubmit}
        className="p-4 flex flex-col items-center justify-center gap-10 min-h-screen sm:p-20"
      >
        <h1 className="textstroke text-lg sm:text-2xl">
          Change or set your username
        </h1>
        {username && (
          <p className="text-sm font-medium ">
            Your username is :
            <span className="font-bold text-[#C89B3C] text-lg">
              {' '}
              {username}
            </span>
          </p>
        )}
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
