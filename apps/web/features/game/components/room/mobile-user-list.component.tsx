'use client'

import { memo } from 'react'

interface IMobileUserListProps {
  users: string[]
}

const MobileUserListComponent = (props: IMobileUserListProps) => {
  const { users } = props

  if (users.length === 0) return null

  return (
    <ul className="flex h-full w-full flex-row flex-wrap items-center justify-center gap-4">
      {users.map((user, index) => (
        <li
          key={`${user}-${index}`}
          className="flex w-auto items-center justify-center gap-x-2"
        >
          <span className="shadow-green h-2 w-2 animate-pulse rounded-full bg-green-600"></span>
          <p className="textstroke w-full overflow-hidden text-ellipsis whitespace-nowrap text-lg font-semibold text-white">
            {user}
          </p>
        </li>
      ))}
    </ul>
  )
}

export const MobileUserList = memo(MobileUserListComponent, (prev, next) => {
  if (prev.users.length !== next.users.length) return false
  return prev.users.every((user, index) => user === next.users[index])
})
