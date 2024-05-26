'use client'

import { useEffect, useRef, useState } from 'react'

import Image from 'next/image'
import { useParams } from 'next/navigation'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useToast } from '@/components/ui/use-toast'

import { cn } from '@/lib/utils'
import { LeagueRoles, SummonerData } from '@/lib/types'
import { gameDefaultData } from '@/lib/constants'

import { RxTrackPrevious } from 'react-icons/rx'
import { FaCopy } from 'react-icons/fa'

import { socket } from '@/app/socket'
import UsernameProvider from '@/components/UsernameProvider'

const leagueRoles: LeagueRoles[] = [
  {
    name: 'TOP',
    src: '/toprole-icon.png',
  },
  {
    name: 'JUNGLE',
    src: '/junglerole-icon.png',
  },
  {
    name: 'MID',
    src: '/midrole-icon.png',
  },
  {
    name: 'ADC',
    src: '/adcrole-icon.png',
  },
  {
    name: 'SUPPORT',
    src: '/supportrole-icon.png',
  },
]

export default function GameComponent({
  useWebSocket,
}: {
  useWebSocket: boolean
}) {
  const { toast } = useToast()
  const audioRef = useRef<HTMLAudioElement>(null)

  const params = useParams()

  const staticName = ['Teczer', 'Poultine', 'Thuram', 'Saoobi', 'Zaiiro']

  const [isSummonerIsTimed, setIsSummonerIsTimed] = useState<{
    [key: string]: SummonerData
  }>(gameDefaultData)

  const userName =
    typeof window !== 'undefined'
      ? (localStorage.getItem('username') as string)
      : 'DefaultName'

  const [userList, setUserList] = useState<string[]>([userName])

  // COMPTE A REBOURS
  useEffect(() => {
    const interval = setInterval(() => {
      // Réduire le temps restant de chaque rôle actif
      const updatedTimers = { ...isSummonerIsTimed }
      for (const key in updatedTimers) {
        if (typeof updatedTimers[key].isFlashed === 'number') {
          updatedTimers[key].isFlashed =
            (updatedTimers[key].isFlashed as number) - 1 // Conversion de type explicite
          if (updatedTimers[key].isFlashed === 0) {
            // Si le temps restant est écoulé, remettre à false
            updatedTimers[key].isFlashed = false
          }
        }
      }

      setIsSummonerIsTimed(updatedTimers)

      if (useWebSocket) {
        socket.emit('updateSummonerData', updatedTimers, params.roomId)
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [isSummonerIsTimed, params.roomId, useWebSocket])

  // WEBSOCKETS
  useEffect(() => {
    if (!useWebSocket) return

    console.log('oui')
    socket.emit('join-room', params.roomId)

    socket.on('updateSummonerData', (newSummonersData) => {
      // console.log("newSummonersData", newSummonersData);
      setIsSummonerIsTimed((prevState) => ({
        ...prevState,
        ...newSummonersData,
      }))
    })

    socket.on('get-summoners-data', (serverSummonersData) => {
      if (
        JSON.stringify(isSummonerIsTimed) !==
        JSON.stringify(serverSummonersData)
      ) {
        socket.emit('get-summoners-data', params.roomId)
      }
    })
  }, [params.roomId, useWebSocket])

  // Fonction pour commencer le cooldown du Flash
  const startFlashCooldown = (role: string) => {
    if (audioRef.current) {
      audioRef.current.volume = 0.05
      audioRef.current.play() // Commence la lecture du fichier audio
    }

    const isBoots = isSummonerIsTimed[role].lucidityBoots
    const isRune = isSummonerIsTimed[role].cosmicInsight

    let summonerFlashTimeCalcul = 300 // Temps de recharge par défaut (5 minutes)

    if (isBoots && isRune) {
      summonerFlashTimeCalcul = 231 // 3 minutes et 51 secondes
    } else if (isBoots || isRune) {
      if (isBoots && !isRune) {
        summonerFlashTimeCalcul = 268 // 4 minutes et 28 secondes si uniquement les bottes sont activées
      } else if (!isBoots && isRune) {
        summonerFlashTimeCalcul = 255 // 4 minutes et 15 secondes si uniquement la rune est activée
      } else {
        summonerFlashTimeCalcul = 231 // 3 minutes et 51 secondes si les deux sont activées
      }
    } else {
      summonerFlashTimeCalcul = 300 // 5 minutes si aucun n'est activé
    }

    setIsSummonerIsTimed((prevState) => {
      const updatedData = {
        ...prevState,
        [role]: {
          ...prevState[role],
          isFlashed: summonerFlashTimeCalcul,
        },
      }

      // Utiliser l'état mis à jour pour émettre les données via le socket
      if (useWebSocket) {
        socket.emit('updateSummonerData', updatedData, params.roomId)
      }

      // Retourner les données mises à jour pour mettre à jour l'état local si nécessaire
      return updatedData
    })

    // Afficher une notification
    toast({
      title: `${role} FLASHED !!!`,
      description: 'Jungle can u gank no summs...',
    })
  }

  // Fonction pour annuler le cooldown du Flash
  const clearTimer = (role: string) => {
    setIsSummonerIsTimed((prevState) => {
      const updatedData = {
        ...prevState,
        [role]: {
          ...prevState[role],
          isFlashed: false,
        },
      }

      // Utiliser l'état mis à jour pour émettre les données via le socket
      if (useWebSocket) {
        socket.emit('updateSummonerData', updatedData, params.roomId)
      }

      // Retourner les données mises à jour pour mettre à jour l'état local si nécessaire
      return updatedData
    })
  }

  return (
    <UsernameProvider>
      <main className="h-screen flex flex-col justify-start items-center gap-6 p-6 sm:p-10 sm:justify-center sm:gap-0">
        <audio ref={audioRef} src="/flash-song.mp3"></audio>
        {/* BUTTON LEAVE */}
        <Button
          className="fixed top-6 left-6 sm:top-10 sm:left-20"
          onClick={() => {
            window.location.href = '/'
          }}
          variant="outline"
          size="icon"
        >
          <RxTrackPrevious className="h-4 w-4" />
        </Button>

        {/* LOBBY PAST CODE */}
        {useWebSocket && (
          <div className="flex justify-center items-center gap-1">
            <ul className="fixed top-6 right-6 w-1/6 h-auto p-4 flex flex-col items-center justify-center sm:top-10 sm:right-20">
              {userList.map((name, index) => {
                return (
                  <li
                    key={index}
                    className="w-full flex items-center justify-start gap-2"
                  >
                    <span className="h-2 w-2 bg-green-600 rounded-full animate-pulse drop"></span>
                    <p>{name}</p>
                  </li>
                )
              })}
            </ul>
            <Input
              className="font-bold bg-background"
              type="text"
              value={params.roomId}
              readOnly
            />
            <Button
              variant="outline"
              size="icon"
              onClick={() => {
                if (params.roomId) {
                  navigator.clipboard.writeText(params.roomId as string)
                  toast({
                    title: 'Your lobby code has been copied to your clipboard!',
                  })
                }
              }}
            >
              <FaCopy className="h-4 w-4" />
            </Button>
          </div>
        )}
        {/* LOGIC */}
        <div className="w-full h-4/5 flex flex-wrap sm:flex-nowrap">
          {leagueRoles.map((role, index) => (
            <div
              className={cn(
                'h-auto flex flex-col items-center justify-center gap-2 sm:gap-8',
                index === leagueRoles.length - 1
                  ? 'col-span-2 flex justify-center w-full'
                  : 'w-2/4 sm:w-full'
              )}
              key={index}
            >
              {/* COSMIC + LUCIDITY */}
              <div className="w-full flex items-center justify-center gap-8 sm:gap-4">
                {/* COSMIC */}
                <button
                  className="transition-all sm:hover:scale-110"
                  onClick={() => {
                    setIsSummonerIsTimed((prevState) => {
                      const updatedData = {
                        ...prevState,
                        [role.name]: {
                          ...prevState[role.name],
                          cosmicInsight: !prevState[role.name].cosmicInsight,
                        },
                      }

                      if (useWebSocket) {
                        socket.emit(
                          'updateSummonerData',
                          updatedData,
                          params.roomId
                        )
                      }
                      return updatedData
                    })
                  }}
                >
                  <Image
                    className={cn(
                      'rounded-full size-12 object-cover filter sm:size-20',
                      isSummonerIsTimed[role.name].cosmicInsight
                        ? 'brightness-100'
                        : 'brightness-50'
                    )}
                    width={600}
                    height={600}
                    src="/rune-cdr.webp"
                    alt="rune-cdr"
                  />
                </button>
                {/* LUCIDITY */}
                <button
                  className="transition-all sm:hover:scale-110"
                  onClick={() => {
                    setIsSummonerIsTimed((prevState) => {
                      const updatedData = {
                        ...prevState,
                        [role.name]: {
                          ...prevState[role.name],
                          lucidityBoots: !prevState[role.name].lucidityBoots,
                        },
                      }

                      if (useWebSocket) {
                        socket.emit(
                          'updateSummonerData',
                          updatedData,
                          params.roomId
                        )
                      }
                      return updatedData
                    })
                  }}
                >
                  <Image
                    className={cn(
                      'size-12 object-cover rounded-full filter sm:size-20',
                      isSummonerIsTimed[role.name].lucidityBoots
                        ? 'brightness-100'
                        : 'brightness-50'
                    )}
                    width={600}
                    height={600}
                    src="/lucidity-boots.png"
                    alt="lucidity-boots"
                  />
                </button>
              </div>
              {/* FLASH ROLE + TIMER */}
              <button
                className="relative size-28 transition-all sm:hover:scale-110 sm:size-64"
                onClick={() => {
                  if (
                    typeof isSummonerIsTimed[role.name].isFlashed === 'number'
                  ) {
                    clearTimer(role.name)
                  } else {
                    startFlashCooldown(role.name)
                  }
                }}
              >
                {/* TIMER */}
                {isSummonerIsTimed[role.name].isFlashed && (
                  <p className="absolute z-20 text-xl font-bold textstroke top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 sm:text-[3rem]">
                    {Math.floor(
                      (isSummonerIsTimed[role.name].isFlashed as number) / 60
                    )}
                    :
                    {(isSummonerIsTimed[role.name].isFlashed as number) % 60 <
                    10
                      ? '0' +
                        ((isSummonerIsTimed[role.name].isFlashed as number) %
                          60)
                      : (isSummonerIsTimed[role.name].isFlashed as number) % 60}
                  </p>
                )}
                {/* IMAGE ROLE */}
                <Image
                  className={cn('w-64 object-cover cursor-pointer', {
                    'filter brightness-50':
                      isSummonerIsTimed[role.name].isFlashed,
                  })}
                  width={600}
                  height={600}
                  src={role.src}
                  alt={role.name}
                />
              </button>
            </div>
          ))}
        </div>
      </main>
    </UsernameProvider>
  )
}
