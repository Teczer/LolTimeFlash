'use client'

import { socket } from '@/app/socket'
import { useEffect, useRef, useState } from 'react'

import Image from 'next/image'
import { useParams } from 'next/navigation'

import UsernameProvider from '@/components/UsernameProvider'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useToast } from '@/components/ui/use-toast'

import { cn } from '@/lib/utils'
import { GameData, LeagueRoles, getRoleKey } from '@/lib/types'
import { currentUsername, gameDefaultData, userVolume } from '@/lib/constants'

import { ImVolumeMute2, ImVolumeMedium } from 'react-icons/im'
import { RxTrackPrevious } from 'react-icons/rx'
import { FaCopy } from 'react-icons/fa'

const leagueRoles: LeagueRoles[] = [
  {
    name: 'TOP',
    src: '/assets/toprole-icon.png',
  },
  {
    name: 'JUNGLE',
    src: '/assets/junglerole-icon.png',
  },
  {
    name: 'MID',
    src: '/assets/midrole-icon.png',
  },
  {
    name: 'ADC',
    src: '/assets/adcrole-icon.png',
  },
  {
    name: 'SUPPORT',
    src: '/assets/supportrole-icon.png',
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
  const username = currentUsername

  const [isSummonerIsTimed, setIsSummonerIsTimed] =
    useState<GameData>(gameDefaultData)

  const [localUserVolume, setLocalUserVolume] = useState<string>(
    userVolume || 'on'
  )

  async function playAudio() {
    if (localUserVolume === 'on' && audioRef.current) {
      try {
        audioRef.current.pause()
        audioRef.current.currentTime = 0
        audioRef.current.volume = 0.15
        await audioRef.current.play()
      } catch (error) {
        console.log('oui erreur')
        console.log('Error :', error)
        console.error('Error playing audio:', error)
      }
    }
  }

  // COMPTE A REBOURS
  useEffect(() => {
    const interval = setInterval(() => {
      // Réduire le temps restant de chaque rôle actif
      const updatedTimers = { ...isSummonerIsTimed.roles } // Copie des rôles uniquement
      for (const key in updatedTimers) {
        const roleKey = key as keyof typeof updatedTimers // Assertion de type
        if (typeof updatedTimers[roleKey].isFlashed === 'number') {
          ;(updatedTimers[roleKey].isFlashed as number) -= 1 // Décrémenter le timer de manière explicite
          if (updatedTimers[roleKey].isFlashed === 0) {
            updatedTimers[roleKey].isFlashed = false
          }
        }
      }

      // Mettre à jour l'état avec les nouveaux timers
      setIsSummonerIsTimed((prevState) => {
        const newState = {
          ...prevState,
          roles: updatedTimers,
        }

        // Utiliser l'état mis à jour pour émettre les données via le socket
        if (useWebSocket && username !== null) {
          socket.emit('updateSummonerData', newState, params.roomId)
        }

        return newState
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [isSummonerIsTimed, params.roomId, useWebSocket])

  // WEBSOCKETS
  useEffect(() => {
    if (!username) return
    if (!useWebSocket) return

    console.log('oui')
    socket.emit('join-room', params.roomId, username)

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

    // Ajout de l'écouteur pour 'send-toast'
    socket.on('send-toast', async ({ role }) => {
      toast({
        duration: 1500,
        title: `${role} FLASHED !!!`,
        description: 'Jungle can u gank no summs...',
      })
      await playAudio()
    })
  }, [params.roomId, useWebSocket])

  // Fonction pour commencer le cooldown du Flash
  const startFlashCooldown = async (role: string) => {
    if (localUserVolume === 'on') {
      await playAudio()
    }

    const isBoots =
      isSummonerIsTimed.roles[role as keyof typeof isSummonerIsTimed.roles]
        .lucidityBoots
    const isRune =
      isSummonerIsTimed.roles[role as keyof typeof isSummonerIsTimed.roles]
        .cosmicInsight

    let summonerFlashTimeCalcul = 300 // Temps de recharge par défaut (5 minutes)

    if (isBoots && isRune) {
      summonerFlashTimeCalcul = 231 // 3 minutes et 51 secondes
    } else if (isBoots || isRune) {
      if (isBoots && !isRune) {
        summonerFlashTimeCalcul = 268 // 4 minutes et 28 secondes si uniquement les bottes sont activées
      } else if (!isBoots && isRune) {
        summonerFlashTimeCalcul = 255 // 4 minutes et 15 secondes si uniquement la rune est activée
      }
    } else {
      summonerFlashTimeCalcul = 300 // 5 minutes si aucun n'est activé
    }

    const roleKey = getRoleKey(role)
    if (roleKey) {
      const updatedRoles = {
        ...isSummonerIsTimed.roles,
        [roleKey]: {
          ...isSummonerIsTimed.roles[roleKey],
          isFlashed: summonerFlashTimeCalcul,
        },
      }

      setIsSummonerIsTimed((prevState) => {
        const newState = {
          ...prevState,
          roles: updatedRoles,
        }

        console.log('newSSState', newState)
        // Utiliser l'état mis à jour pour émettre les données via le socket
        if (useWebSocket) {
          socket.emit('updateSummonerData', newState, params.roomId)
          socket.emit('show-toast', role, params.roomId)
        }

        return newState
      })
    }

    if (!useWebSocket) {
      toast({
        title: `${role} FLASHED !!!`,
        description: 'Jungle can u gank no summs...',
      })
    }
  }

  // Fonction pour annuler le cooldown du Flash
  const clearTimer = (role: string) => {
    const roleKey = getRoleKey(role)
    if (roleKey) {
      const updatedRoles = {
        ...isSummonerIsTimed.roles,
        [roleKey]: {
          ...isSummonerIsTimed.roles[roleKey],
          isFlashed: false,
        },
      }

      setIsSummonerIsTimed((prevState) => {
        const newState = {
          ...prevState,
          roles: updatedRoles,
        }

        // Utiliser l'état mis à jour pour émettre les données via le socket
        if (useWebSocket) {
          socket.emit('updateSummonerData', newState, params.roomId)
        }

        return newState
      })
    }
  }

  function toggleVolume() {
    const newVolume = localUserVolume === 'on' ? 'off' : 'on'
    console.log(newVolume)
    localStorage.setItem('volume', newVolume)
    setLocalUserVolume(newVolume)
  }

  return (
    <UsernameProvider>
      <main className="h-screen flex flex-col justify-start items-center gap-2 p-6 sm:p-10 sm:justify-center sm:gap-0">
        <audio ref={audioRef} src="/flash-song.mp3"></audio>
        {/* BUTTON LEAVE */}
        <Button
          className="absolute top-6 left-6 sm:top-10 sm:left-20"
          onClick={() => {
            window.location.href = '/'
          }}
          variant="outline"
          size="icon"
        >
          <RxTrackPrevious className="h-4 w-4" />
        </Button>
        {/* BUTTON SOUND */}
        <Button
          className="absolute top-6 right-6 sm:top-24 sm:left-20"
          onClick={toggleVolume}
          variant="outline"
          size="icon"
        >
          {localUserVolume === 'on' ? (
            <ImVolumeMedium className="h-4 w-4" />
          ) : (
            <ImVolumeMute2 className="h-4 w-4" />
          )}
        </Button>

        {/* LOBBY PAST CODE */}
        {useWebSocket && (
          <div className="flex justify-center items-center gap-1">
            <ul className="w-1/6 h-auto fixed z-50 p-4 flex flex-col items-center justify-center bottom-4 left-10 sm:bottom-auto sm:left-auto sm:top-10 sm:right-10">
              {isSummonerIsTimed.users.map((user, index) => {
                return (
                  <li
                    key={index}
                    className="w-[300%] flex items-center justify-start gap-2 sm:w-full"
                  >
                    <span className="h-2 w-2 bg-green-600 rounded-full animate-pulse shadow-green"></span>
                    <p className="w-full overflow-hidden text-ellipsis whitespace-nowrap">
                      {user}
                    </p>
                  </li>
                )
              })}
            </ul>
            <div className="flex flex-col items-center justify-center gap-1">
              <h3 className="w-auto text-lg whitespace-nowrap inline-block textstroke font-bold">
                ROOM ID
              </h3>
              <div className="flex justify-start items-center gap-1">
                <Input
                  className="font-bold bg-background"
                  type="text"
                  value={params.roomId}
                  readOnly
                />
                <Button
                  className="p-2"
                  variant="outline"
                  size="icon"
                  onClick={() => {
                    if (params.roomId) {
                      navigator.clipboard.writeText(params.roomId as string)
                      toast({
                        title:
                          'Your lobby code has been copied to your clipboard!',
                      })
                    }
                  }}
                >
                  <FaCopy className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        )}
        {/* LOGIC */}
        <div className="w-full h-4/5 flex flex-wrap sm:flex-nowrap">
          {leagueRoles.map((role, index) => {
            const roleKey = getRoleKey(role.name)

            if (roleKey) {
              return (
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
                        if (roleKey) {
                          setIsSummonerIsTimed((prevState) => {
                            const updatedData = {
                              ...prevState,
                              roles: {
                                ...prevState.roles,
                                [roleKey]: {
                                  ...prevState.roles[roleKey],
                                  cosmicInsight:
                                    !prevState.roles[roleKey].cosmicInsight,
                                },
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
                        }
                      }}
                    >
                      <Image
                        className={cn(
                          'rounded-full size-12 object-cover filter sm:size-20',
                          isSummonerIsTimed.roles[roleKey].cosmicInsight
                            ? 'brightness-100'
                            : 'brightness-50'
                        )}
                        width={600}
                        height={600}
                        src="/assets/rune-cdr.webp"
                        alt="rune-cdr"
                      />
                    </button>
                    {/* LUCIDITY */}
                    <button
                      className="transition-all sm:hover:scale-110"
                      onClick={() => {
                        if (roleKey) {
                          setIsSummonerIsTimed((prevState) => {
                            const updatedData = {
                              ...prevState,
                              roles: {
                                ...prevState.roles,
                                [roleKey]: {
                                  ...prevState.roles[roleKey],
                                  lucidityBoots:
                                    !prevState.roles[roleKey].lucidityBoots,
                                },
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
                        }
                      }}
                    >
                      <Image
                        className={cn(
                          'size-12 object-cover rounded-full filter sm:size-20',
                          isSummonerIsTimed.roles[roleKey].lucidityBoots
                            ? 'brightness-100'
                            : 'brightness-50'
                        )}
                        width={600}
                        height={600}
                        src="/assets/lucidity-boots.png"
                        alt="lucidity-boots"
                      />
                    </button>
                  </div>
                  {/* FLASH ROLE + TIMER */}
                  <button
                    className="relative size-28 transition-all sm:hover:scale-110 sm:size-64"
                    onClick={() => {
                      if (
                        typeof isSummonerIsTimed.roles[roleKey].isFlashed ===
                        'number'
                      ) {
                        clearTimer(role.name)
                      } else {
                        startFlashCooldown(role.name)
                      }
                    }}
                  >
                    {/* TIMER */}
                    {isSummonerIsTimed.roles[roleKey].isFlashed && (
                      <p className="absolute z-20 text-xl font-bold textstroke top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 sm:text-[3rem]">
                        {Math.floor(
                          (isSummonerIsTimed.roles[roleKey]
                            .isFlashed as number) / 60
                        )}
                        :
                        {(isSummonerIsTimed.roles[roleKey]
                          .isFlashed as number) %
                          60 <
                        10
                          ? '0' +
                            ((isSummonerIsTimed.roles[roleKey]
                              .isFlashed as number) %
                              60)
                          : (isSummonerIsTimed.roles[roleKey]
                              .isFlashed as number) % 60}
                      </p>
                    )}
                    {/* IMAGE ROLE */}
                    <Image
                      className={cn('w-64 object-cover cursor-pointer', {
                        'filter brightness-50':
                          isSummonerIsTimed.roles[roleKey].isFlashed,
                      })}
                      width={600}
                      height={600}
                      src={role.src}
                      alt={role.name}
                    />
                  </button>
                </div>
              )
            } else return null
          })}
        </div>
      </main>
    </UsernameProvider>
  )
}
