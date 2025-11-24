'use client'

import { UsernameInputModal } from '@/features/settings/components/username-input-modal.component'
import { useState, type ReactNode } from 'react'

interface IUsernameProviderProps {
  children: ReactNode
}

export const UsernameProvider = (props: IUsernameProviderProps) => {
  const { children } = props
  const [username] = useState<string | null>(
    typeof window !== 'undefined' ? localStorage.getItem('username') : null
  )

  if (!username) {
    return <UsernameInputModal />
  }

  return <>{children}</>
}
