/**
 * Connection Status Component
 * Shows WebSocket connection status with animations
 */

'use client'

import { memo } from 'react'
import { cn } from '@/lib/utils'
import { ImSpinner2 } from 'react-icons/im'

interface IConnectionStatusProps {
  isConnected: boolean
  reconnectAttempts?: number
}

const ConnectionStatusComponent = (props: IConnectionStatusProps) => {
  const { isConnected, reconnectAttempts = 0 } = props

  if (isConnected) {
    return (
      <div className="fixed right-4 top-4 flex items-center gap-2 rounded-md bg-green-500/20 px-3 py-2 backdrop-blur-sm">
        <div className="h-2 w-2 animate-pulse rounded-full bg-green-500" />
        <span className="text-sm font-medium text-green-500">Connected</span>
      </div>
    )
  }

  return (
    <div
      className={cn(
        'fixed right-4 top-4 flex items-center gap-2 rounded-md px-3 py-2 backdrop-blur-sm',
        reconnectAttempts >= 3
          ? 'bg-red-500/20 animate-pulse'
          : 'bg-yellow-500/20'
      )}
    >
      <ImSpinner2
        className={cn(
          'h-4 w-4 animate-spin',
          reconnectAttempts >= 3 ? 'text-red-500' : 'text-yellow-500'
        )}
      />
      <span
        className={cn(
          'text-sm font-medium',
          reconnectAttempts >= 3 ? 'text-red-500' : 'text-yellow-500'
        )}
      >
        {reconnectAttempts >= 3 ? 'Connection lost' : 'Reconnecting...'}
      </span>
      {reconnectAttempts > 0 && (
        <span
          className={cn(
            'text-xs',
            reconnectAttempts >= 3 ? 'text-red-400' : 'text-yellow-400'
          )}
        >
          ({reconnectAttempts}/5)
        </span>
      )}
    </div>
  )
}

export const ConnectionStatus = memo(
  ConnectionStatusComponent,
  (prev, next) => {
    return (
      prev.isConnected === next.isConnected &&
      prev.reconnectAttempts === next.reconnectAttempts
    )
  }
)

