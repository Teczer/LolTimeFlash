'use client'

import { cn } from '@/lib/utils'
import Image from 'next/image'
import { memo } from 'react'

interface IItemToggleProps {
  itemName: string
  iconSrc: string
  isActive: boolean
  onClick: () => void
  className?: string
}

const ItemToggleComponent = (props: IItemToggleProps) => {
  const { itemName, iconSrc, isActive, onClick, className } = props

  return (
    <button
      onClick={onClick}
      className={cn('transition-all sm:hover:scale-110', className)}
      aria-label={`Toggle ${itemName}`}
    >
      <Image
        draggable={false}
        className={cn(
          'size-8 rounded-full object-cover sm:size-20',
          isActive ? 'brightness-100' : 'brightness-50'
        )}
        width={200}
        height={200}
        src={iconSrc}
        alt={itemName}
        priority
      />
    </button>
  )
}

export const ItemToggle = memo(ItemToggleComponent, (prev, next) => {
  return prev.isActive === next.isActive
})
