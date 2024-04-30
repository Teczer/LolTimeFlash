'use client'

import { useEffect, useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'

import { CiImageOn } from 'react-icons/ci'
import Image from 'next/image'
import { Input } from '../input'
import { Button } from '../button'
import { getChampion } from '@/app/api/shieldbow/methods'
import { useBackgroundImage } from '@/app/store/useBackgroundImage'
import { AllSkinsSplashArts } from '@/app/api/shieldbow/route'

// Définition des types
type ChampionName = string

const ChangeCoverButton: React.FC = () => {
  const [rawChampions, setRawChampions] = useState<ChampionName[]>([])
  const [filteredChampions, setFilteredChampions] = useState<ChampionName[]>([])
  const [searchQuery, setSearchQuery] = useState<string>('')

  const [allSkinsSplashArts, setAllSkinsSplashArts] = useState<
    AllSkinsSplashArts[]
  >([])

  const { setImage } = useBackgroundImage()

  async function getChampionNextApi() {
    const nextApiResponse = await getChampion()
    setAllSkinsSplashArts(nextApiResponse)
    console.log('nextApiResponse', nextApiResponse)
  }

  useEffect(() => {
    // Appel à la fonction fetchChampions une seule fois après le rendu initial
    getChampionNextApi()
  }, []) // Dépendance vide pour garantir que le useEffect ne s'exécute qu'une seule fois

  // Fonction pour construire l'URL de l'image du splash art d'un champion
  const getChampionSquareUrl = (championName: ChampionName) => {
    return `https://ddragon.leagueoflegends.com/cdn/14.6.1/img/champion/${championName}.png`
  }

  // Filtrer les champions en fonction de la recherche de l'utilisateur
  const handleSearch = (query: string) => {
    setSearchQuery(query)
    if (query === '') {
      setFilteredChampions(rawChampions)
    } else {
      setFilteredChampions(
        rawChampions.filter((championName) =>
          championName.toLowerCase().startsWith(query.toLowerCase())
        )
      )
    }
  }

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
            onChange={(e) => handleSearch(e.target.value)}
          />
        </SheetHeader>
        <SheetFooter className="flex flex-col justify-start items-center w-full gap-3">
          <div className="flex flex-col justify-start items-center w-full gap-3 h-full mt-4">
            {allSkinsSplashArts.map((champion, index) => {
              return (
                <div
                  className="flex w-full h-auto bg-[#052431] border"
                  key={index}
                >
                  <div className="w-1/5 h-auto flex flex-col gap-2 justify-start items-center p-4">
                    <Image
                      className="w-14 object-cover border"
                      key={champion.championName}
                      src={getChampionSquareUrl(champion.championName)}
                      alt={`${champion.championName} Square`}
                      width={200}
                      height={200}
                    />
                    <h2 className="text-white text-md textstroke">
                      {champion.championName}
                    </h2>
                  </div>

                  <ul
                    className="w-4/5 h-full flex flex-wrap gap-4 justify-center items-center p-4"
                    key={index}
                  >
                    {champion.splashArts.map((splash, index) => {
                      return (
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
                      )
                    })}
                  </ul>
                </div>
              )
            })}
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}

export default ChangeCoverButton
