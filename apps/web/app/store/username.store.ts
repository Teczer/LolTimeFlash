/**
 * Username Store
 * Manages user's display name for multiplayer
 */

import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

interface IUsernameState {
  username: string | null
}

interface IUsernameActions {
  setUsername: (username: string) => void
  reset: () => void
}

const DEFAULT_STATE: IUsernameState = {
  username: null,
}

export const useUsernameStore = create<IUsernameState & IUsernameActions>()(
  persist(
    (set) => ({
      ...DEFAULT_STATE,
      setUsername: (username) => set({ username }),
      reset: () => set(DEFAULT_STATE),
    }),
    {
      name: 'username-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
)

