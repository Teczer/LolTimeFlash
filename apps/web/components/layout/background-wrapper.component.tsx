'use client'

import { useBackgroundImageStore } from '@/app/store/background-image.store'
import { useMediaQuery } from '@/hooks/use-media-query.hook'
import type { ReactNode } from 'react'
import { useEffect, useState } from 'react'

interface IBackgroundWrapperProps {
  children: ReactNode
}

const DEFAULT_BACKGROUND =
  'https://cdnb.artstation.com/p/assets/images/images/004/656/221/large/chengwei-pan-diana1.jpg?1485328717'

const MOBILE_BACKGROUND =
  'https://res.cloudinary.com/dw3mwclgk/image/upload/v1711629209/hrwisiiionr1ukmpclrd.png'

export const BackgroundWrapper = (props: IBackgroundWrapperProps) => {
  const { children } = props
  const [selectedCover, setSelectedCover] = useState<string>('')
  const isMobile = useMediaQuery('(max-width: 768px)')
  const { image } = useBackgroundImageStore()

  useEffect(() => {
    const userCoverBackground =
      typeof window !== 'undefined'
        ? (localStorage.getItem('cover-bg') as string)
        : undefined

    setSelectedCover(userCoverBackground || DEFAULT_BACKGROUND)
  }, [])

  if (!selectedCover) return null

  const backgroundImage = isMobile
    ? `url(${MOBILE_BACKGROUND})`
    : `radial-gradient(at center top, 
        rgba(12, 59, 106, 0.2), 
        rgba(3, 16, 30, 0.7), 
        rgba(3, 16, 30, 0.98), 
        rgba(3, 16, 30, 1), 
        rgba(3, 16, 30, 1)
      ), url(${image || selectedCover})`

  return (
    <div className="image-bg" style={{ backgroundImage }}>
      {children}
    </div>
  )
}

