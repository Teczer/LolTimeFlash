/**
 * Item Toggle Component
 * Toggle button for Lucidity Boots or Cosmic Insight
 */

'use client'

import { cn } from '@/lib/utils'
import Image from 'next/image'

interface IItemToggleProps {
  itemName: string
  iconSrc: string
  isActive: boolean
  onClick: () => void
  className?: string
}

export const ItemToggle = (props: IItemToggleProps) => {
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
          'size-12 rounded-full object-cover sm:size-20',
          isActive ? 'brightness-100' : 'brightness-50'
        )}
        width={60}
        height={60}
        src={iconSrc}
        alt={itemName}
        priority
      />
    </button>
  )
}
