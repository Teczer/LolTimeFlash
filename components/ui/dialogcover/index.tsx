'use client'

import Image from 'next/image'

import { useMemo, useState } from 'react'
import { useBackgroundImage } from '@/app/store/useBackgroundImage'

import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'

import { getChampion } from '@/app/api/shieldbow/methods'
import { AllSkinsSplashArts } from '@/app/api/shieldbow/route'

import { Input } from '../input'
import { Button } from '../button'
import { CiImageOn } from 'react-icons/ci'
import { useQuery } from '@tanstack/react-query'
import DialogCoverLoader from '../loader/dialogcoverloader'

const ChangeCoverButton: React.FC = () => {
  const { setImage } = useBackgroundImage()
  const [searchQuery, setSearchQuery] = useState<string>('')

  const {
    data: allSkinsSplashArts,
    isLoading,
    isError,
  } = useQuery<AllSkinsSplashArts[]>({
    queryKey: ['allSkinsSplashArts'],
    queryFn: async () => await getChampion(),
  })

  const filteredItems = useMemo(() => {
    return allSkinsSplashArts?.filter((champion) =>
      champion.championName.toLowerCase().startsWith(searchQuery.toLowerCase())
    )
  }, [allSkinsSplashArts, searchQuery])

  if (isError) return <p>An error</p>

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          className="fixed top-6 right-6 sm:top-10 sm:right-20"
          variant="outline"
          size="icon"
        >
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
        <SheetFooter className="flex flex-col justify-start items-center w-full gap-3">
          <ul className="flex flex-col justify-start items-center w-full gap-3 h-full mt-4">
            {isLoading || !filteredItems
              ? Array.from({ length: 3 }).map((_, index) => {
                  return (
                    <li
                      className="flex w-full h-auto bg-[#052431] border"
                      key={index}
                    >
                      <DialogCoverLoader />
                    </li>
                  )
                })
              : filteredItems.map((champion, index) => (
                  <li
                    className="flex w-full h-auto bg-[#052431] border"
                    key={index}
                  >
                    {/* CHAMP ICON + NAME */}
                    <div className="w-1/5 h-auto flex flex-col gap-2 justify-start items-center p-4">
                      <Image
                        className="w-14 object-cover border"
                        src={`https://ddragon.leagueoflegends.com/cdn/14.6.1/img/champion/${champion.championName}.png`}
                        alt={`${champion.championName} Square`}
                        width={200}
                        height={200}
                      />
                      <h2 className="text-white text-md textstroke">
                        {champion.championName}
                      </h2>
                    </div>

                    {/* LIST OF ALL CHAMPS SKINS */}
                    <ul
                      className="w-4/5 h-full flex flex-wrap gap-4 justify-start items-center p-4"
                      key={index}
                    >
                      {champion.splashArts.map((splash, index) => (
                        <li
                          className="cursor-pointer flex flex-col justify-start items-center transition-all hover:scale-110"
                          key={index}
                          onClick={() => {
                            setImage(splash.skinImageUrl)
                            localStorage.setItem(
                              'cover-bg',
                              splash.skinImageUrl
                            )
                          }}
                        >
                          <Image
                            quality={75}
                            className="w-28 object-cover rounded-sm"
                            src={splash.skinImageUrl}
                            alt={splash.skinName}
                            width={500}
                            height={500}
                          />
                          <span className="w-28 overflow-hidden text-xs whitespace-nowrap	text-ellipsis">
                            {index === 0
                              ? champion.championName
                              : splash.skinName}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </li>
                ))}
          </ul>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}

export default ChangeCoverButton
