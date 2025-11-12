import { create } from 'zustand'

interface UsernameState {
  username: string | null
  setUsername: (username: string) => void
}

export const useUsername = create<UsernameState>((set) => ({
  username:
    typeof window !== 'undefined' ? localStorage.getItem('username') : null,
  setUsername: (username: string) => {
    localStorage.setItem('username', username)
    set({ username })
  },
}))
