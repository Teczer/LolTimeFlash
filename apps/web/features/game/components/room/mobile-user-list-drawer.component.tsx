'use client'

import { Button } from '@/components/ui/button'
import {
  Drawer,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer'
import { SummonerInput } from '@/features/game/components/summoner-input.component'
import { memo } from 'react'
import { HiOutlineMenuAlt4 } from 'react-icons/hi'
import { MobileUserList } from './mobile-user-list.component'

interface IMobileUserListDrawerProps {
  users: string[]
  onGameDataFetched: (data: any) => void
}

const MobileUserListDrawerComponent = (props: IMobileUserListDrawerProps) => {
  const { users, onGameDataFetched } = props

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button
          className="absolute right-6 top-10 flex sm:hidden"
          variant="outline"
          size="icon"
          aria-label="Open user list drawer"
        >
          <HiOutlineMenuAlt4 className="h-4 w-4" />
        </Button>
      </DrawerTrigger>
      <DrawerContent className="border-x-0">
        <DrawerTitle></DrawerTitle>
        <DrawerHeader>
          <SummonerInput onGameDataFetched={onGameDataFetched} />
        </DrawerHeader>
        <DrawerFooter className="mb-4">
          <MobileUserList users={users} />
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}

export const MobileUserListDrawer = memo(
  MobileUserListDrawerComponent,
  (prev, next) => {
    if (prev.users.length !== next.users.length) return false
    return prev.users.every((user, index) => user === next.users[index])
  }
)
