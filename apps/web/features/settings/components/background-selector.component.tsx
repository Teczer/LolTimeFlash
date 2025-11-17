'use client'

import { useBackgroundImageStore } from '@/app/store/background-image.store'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import championsData from '@/public/champions/data.json'
import type { AllSkinsSplashArts } from '@loltimeflash/shared'
import { useMemo, useState } from 'react'
import { CiImageOn } from 'react-icons/ci'
import { ChampionList } from './champion-list.component'

export const BackgroundSelector = () => {
  const { setImage } = useBackgroundImageStore()
  const [searchQuery, setSearchQuery] = useState<string>('')

  const allSkinsSplashArts: AllSkinsSplashArts[] =
    championsData.champions as AllSkinsSplashArts[]

  const filteredChampions = useMemo(() => {
    return allSkinsSplashArts?.filter((champion) =>
      champion.championName.toLowerCase().startsWith(searchQuery.toLowerCase())
    )
  }, [allSkinsSplashArts, searchQuery])

  const handleSkinSelect = (skinImageUrl: string) => {
    setImage(skinImageUrl)
    localStorage.setItem('cover-bg', skinImageUrl)
  }

  return (
    <div className="hidden sm:block">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon">
            <CiImageOn className="h-6 w-6" />
          </Button>
        </SheetTrigger>

        <SheetContent className="overflow-y-scroll">
          <SheetHeader>
            <SheetTitle>Select a New Cover</SheetTitle>
            <Input
              className="font-sans"
              type="text"
              placeholder="Find a champion"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </SheetHeader>

          <SheetFooter className="flex w-full flex-col items-center justify-start gap-3">
            <ChampionList
              champions={filteredChampions}
              onSkinSelect={handleSkinSelect}
            />
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  )
}
