import { create } from 'zustand'

interface BackgroundImage {
  image: string
  setImage: (image: string) => void
}

export const useBackgroundImage = create<BackgroundImage>()((set) => ({
  image: '',
  setImage: (image) => set({ image: image }),
}))
