import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

interface IBackgroundImageState {
  image: string
}

interface IBackgroundImageActions {
  setImage: (image: string) => void
  reset: () => void
}

const DEFAULT_STATE: IBackgroundImageState = {
  image: '',
}

export const useBackgroundImageStore = create<
  IBackgroundImageState & IBackgroundImageActions
>()(
  persist(
    (set) => ({
      ...DEFAULT_STATE,
      setImage: (image) => set({ image }),
      reset: () => set(DEFAULT_STATE),
    }),
    {
      name: 'cover-bg',
      storage: createJSONStorage(() => localStorage),
    }
  )
)

