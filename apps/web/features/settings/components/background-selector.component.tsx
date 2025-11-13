/**
 * Background Selector
 * Sheet component to browse and select champion splash arts as background
 */

'use client'

import { getChampionSkins } from '@/lib/api'
import type { AllSkinsSplashArts } from '@loltimeflash/shared'
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
import { useQuery } from '@tanstack/react-query'
import Image from 'next/image'
import { useMemo, useState } from 'react'
import { CiImageOn } from 'react-icons/ci'
import { BackgroundSelectorLoader } from './background-selector-loader.component'

export const BackgroundSelector = () => {
  const { setImage } = useBackgroundImageStore()
  const [searchQuery, setSearchQuery] = useState<string>('')

  const {
    data: allSkinsSplashArts,
    isLoading,
    isError,
  } = useQuery<AllSkinsSplashArts[]>({
    queryKey: ['allSkinsSplashArts'],
    queryFn: async () => await getChampionSkins(),
  })

  const filteredItems = useMemo(() => {
    return allSkinsSplashArts?.filter((champion) =>
      champion.championName.toLowerCase().startsWith(searchQuery.toLowerCase())
    )
  }, [allSkinsSplashArts, searchQuery])

  const handleSkinSelect = (skinImageUrl: string) => {
    setImage(skinImageUrl)
    localStorage.setItem('cover-bg', skinImageUrl)
  }

  if (isError) {
    return <p className="text-destructive">Failed to load champions</p>
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
            <ul className="mt-4 flex h-full w-full flex-col items-center justify-start gap-3">
              {isLoading || !filteredItems ? (
                // Loading skeletons
                Array.from({ length: 3 }).map((_, index) => (
                  <li
                    key={index}
                    className="flex h-auto w-full border bg-[#052431]"
                  >
                    <BackgroundSelectorLoader />
                  </li>
                ))
              ) : (
                // Champions list
                filteredItems.map((champion, index) => (
                  <li
                    key={index}
                    className="flex h-auto w-full border bg-[#052431]"
                  >
                    {/* Champion Icon + Name */}
                    <div className="flex h-auto w-1/5 flex-col items-center justify-start gap-2 p-4">
                      <Image
                        className="w-14 border object-cover"
                        src={`https://ddragon.leagueoflegends.com/cdn/14.21.1/img/champion/${champion.championName}.png`}
                        alt={`${champion.championName} Square`}
                        width={200}
                        height={200}
                      />
                      <h2 className="text-md textstroke text-white">
                        {champion.championName}
                      </h2>
                    </div>

                    {/* Champion Skins Grid */}
                    <ul className="flex h-full w-4/5 flex-wrap items-center justify-start gap-4 p-4">
                      {champion.splashArts.map((splash, skinIndex) => (
                        <li
                          key={skinIndex}
                          className="flex cursor-pointer flex-col items-center justify-start transition-all hover:scale-110"
                          onClick={() => handleSkinSelect(splash.skinImageUrl)}
                        >
                          <Image
                            quality={75}
                            className="w-28 rounded-sm object-cover"
                            src={splash.skinImageUrl}
                            alt={splash.skinName}
                            width={500}
                            height={500}
                          />
                          <span className="w-28 overflow-hidden text-ellipsis whitespace-nowrap text-xs">
                            {skinIndex === 0
                              ? champion.championName
                              : splash.skinName}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </li>
                ))
              )}
            </ul>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  )
}

