// src/providers/UsernameProvider.tsx
'use client'

import React from 'react'
import UsernameInput from '../ui/usernameinput'
import { useUsername } from '@/app/store/useUsername'

const UsernameProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { username } = useUsername()

  if (!username) {
    return <UsernameInput />
  }

  return <>{children}</>
}

export default UsernameProvider
