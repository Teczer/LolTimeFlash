'use client'

import { useMediaQuery } from '@/hooks/use-media-query.hook'
import { useEffect, useState } from 'react'
import { useBackgroundImageStore } from '@/app/store/background-image.store'

const WrapperBackground = ({ children }: { children: React.ReactNode }) => {
  const [selectedCover, setSelectedCover] = useState<string>('')
  const isMobile = useMediaQuery('(max-width: 768px)')

  const { image } = useBackgroundImageStore()

  useEffect(() => {
    const userCoverBackground =
      typeof window !== 'undefined'
        ? (localStorage.getItem('cover-bg') as string)
        : undefined

    if (userCoverBackground) {
      setSelectedCover(userCoverBackground)
    } else {
      setSelectedCover(
        'https://cdnb.artstation.com/p/assets/images/images/004/656/221/large/chengwei-pan-diana1.jpg?1485328717'
      )
    }
  }, [])

  if (!selectedCover) return null

  return (
    <div
      className="image-bg"
      style={{
        backgroundImage: isMobile
          ? `url(https://res.cloudinary.com/dw3mwclgk/image/upload/v1711629209/hrwisiiionr1ukmpclrd.png)`
          : `radial-gradient(at center top, 
              rgba(12, 59, 106, 0.2), 
              rgba(3, 16, 30, 0.7), 
              rgba(3, 16, 30, 0.98), 
              rgba(3, 16, 30, 1), 
              rgba(3, 16, 30, 1)
            ), url(${image || selectedCover})`,
      }}
    >
      {children}
    </div>
  )
}

export default WrapperBackground
