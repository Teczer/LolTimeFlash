'use client'

import { cn } from '@/lib/utils'
import NextImage, { type ImageProps as NextImageProps } from 'next/image'
import { useState } from 'react'
import { Skeleton } from './skeleton.component'

interface IImageProps extends Omit<NextImageProps, 'onLoad' | 'onError'> {
  showSkeleton?: boolean
  skeletonClassName?: string
  fallbackSrc?: string
  onLoadComplete?: () => void
  onErrorOccurred?: () => void
}

export const Image = (props: IImageProps) => {
  const {
    showSkeleton = true,
    skeletonClassName,
    fallbackSrc,
    onLoadComplete,
    onErrorOccurred,
    className,
    alt,
    ...rest
  } = props

  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)

  const handleLoad = () => {
    setIsLoading(false)
    onLoadComplete?.()
  }

  const handleError = () => {
    setIsLoading(false)
    setHasError(true)
    onErrorOccurred?.()
  }

  return (
    <div className="relative h-full w-full">
      {isLoading && showSkeleton && (
        <Skeleton className={cn('absolute inset-0', skeletonClassName)} />
      )}

      {hasError && fallbackSrc ? (
        <NextImage
          {...rest}
          src={fallbackSrc}
          alt={alt}
          className={className}
        />
      ) : (
        <NextImage
          {...rest}
          src={rest.src}
          alt={alt}
          className={cn(
            'transition-opacity duration-300',
            isLoading ? 'opacity-0' : 'opacity-100',
            className
          )}
          onLoad={handleLoad}
          onError={handleError}
        />
      )}
    </div>
  )
}
