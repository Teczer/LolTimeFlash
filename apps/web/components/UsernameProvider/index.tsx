// src/providers/UsernameProvider.tsx
'use client'

import React from 'react'
import UsernameInput from '../ui/usernameinput'
import { useUsernameStore } from '@/app/store/username.store'

const UsernameProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { username } = useUsernameStore()

  if (!username) {
    return <UsernameInput />
  }

  return <>{children}</>
}

export default UsernameProvider
