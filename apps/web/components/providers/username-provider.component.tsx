/**
 * Username Provider
 * Gates content until username is set
 * Shows UsernameInput modal if username is not present
 */

'use client'

import { useUsernameStore } from '@/app/store/username.store'
import { UsernameInputModal } from '@/features/settings/components/username-input-modal.component'
import type { ReactNode } from 'react'

interface IUsernameProviderProps {
  children: ReactNode
}

export const UsernameProvider = (props: IUsernameProviderProps) => {
  const { children } = props
  const { username } = useUsernameStore()

  if (!username) {
    return <UsernameInputModal />
  }

  return <>{children}</>
}

