import { memo } from 'react'

const LobbyDividerComponent = () => {
  return (
    <div className="h-[1px] w-4/5 bg-slate-500 sm:h-[600px] sm:w-[1px]" />
  )
}

export const LobbyDivider = memo(LobbyDividerComponent)

