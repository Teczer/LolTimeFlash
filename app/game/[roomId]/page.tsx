'use client'

import { useEffect, useRef, useState } from 'react'

import Image from 'next/image'
import Link from 'next/link'

import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/use-toast'

import { cn } from '@/lib/utils'

import { useParams } from 'next/navigation'
import { MdClear } from 'react-icons/md'
import { RxTrackPrevious } from 'react-icons/rx'

import { socket } from '@/app/socket'

interface LeagueRoles {
  name: string
  src: string
}

interface SummonerData {
  isFlashed: boolean | number
  lucidityBoots: boolean
  cosmicInsight: boolean
}

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

export default function Home() {
  const { toast } = useToast()
  const audioRef = useRef<HTMLAudioElement>(null)

  const params = useParams()

  const [isSummonerIsTimed, setIsSummonerIsTimed] = useState<{
    [key: string]: SummonerData
  }>({
    TOP: {
      isFlashed: false,
      lucidityBoots: false,
      cosmicInsight: false,
    },
    JUNGLE: {
      isFlashed: false,
      lucidityBoots: false,
      cosmicInsight: false,
    },
    MID: {
      isFlashed: false,
      lucidityBoots: false,
      cosmicInsight: false,
    },
    SUPPORT: {
      isFlashed: false,
      lucidityBoots: false,
      cosmicInsight: false,
    },
    ADC: {
      isFlashed: false,
      lucidityBoots: false,
      cosmicInsight: false,
    },
  })

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

      socket.emit('updateSummonerData', updatedTimers, params.roomId)
    }, 1000)

    return () => clearInterval(interval)
  }, [isSummonerIsTimed, params.roomId])

  // WEBSOCKETS
  useEffect(() => {
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
  }, [params.roomId])

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
      socket.emit('updateSummonerData', updatedData, params.roomId)

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
      socket.emit('updateSummonerData', updatedData, params.roomId)

      // Retourner les données mises à jour pour mettre à jour l'état local si nécessaire
      return updatedData
    })
  }

  return (
    <main className="min-h-screen font-mono flex flex-col justify-center items-center gap-14 sm:gap-24">
      <audio ref={audioRef} src="/flash-song.mp3"></audio>
      <a
        onClick={() => socket.emit('disconnecting')}
        className="fixed top-6 left-6 sm:top-10 sm:left-20"
        href={'/'}
      >
        <Button variant="outline" size="icon">
          <RxTrackPrevious className="h-4 w-4" />
        </Button>
      </a>
      <h1>ROOM ID: {params.roomId}</h1>
      <div className="w-full h-[400px] flex items-center justify-center gap-2 sm:flex sm:justify-around sm:items-center">
        {leagueRoles.map((role, index) => (
          <div
            className="w-full h-full flex flex-col items-center justify-center gap-8"
            key={index}
          >
            {/* COSMIC + LUCIDITY */}
            <div className="w-full flex items-center justify-center gap-4">
              {/* COSMIC */}
              <button
                className="transition-all hover:scale-110"
                onClick={() => {
                  console.log('cosmic')
                  // Mettre à jour l'état local avec setIsSummonerIsTimed
                  setIsSummonerIsTimed((prevState) => {
                    const updatedData = {
                      ...prevState,
                      [role.name]: {
                        ...prevState[role.name],
                        cosmicInsight: !prevState[role.name].cosmicInsight,
                      },
                    }

                    socket.emit(
                      'updateSummonerData',
                      updatedData,
                      params.roomId
                    )
                    // Retourner les données mises à jour pour mettre à jour l'état local si nécessaire
                    return updatedData
                  })
                }}
              >
                <Image
                  className={`w-14 h-14 object-cover filter ${
                    isSummonerIsTimed[role.name].cosmicInsight
                      ? 'brightness-100'
                      : 'brightness-50'
                  }`}
                  width={600}
                  height={600}
                  src="/rune-cdr.webp"
                  alt="rune-cdr"
                />
              </button>
              {/* LUCIDITY */}
              <button
                className="transition-all hover:scale-110"
                onClick={() => {
                  setIsSummonerIsTimed((prevState) => {
                    const updatedData = {
                      ...prevState,
                      [role.name]: {
                        ...prevState[role.name],
                        lucidityBoots: !prevState[role.name].lucidityBoots,
                      },
                    }

                    // Afficher les données mises à jour dans la console
                    console.log('updatedData', updatedData)

                    // Utiliser l'état mis à jour pour émettre les données via le socket
                    socket.emit(
                      'updateSummonerData',
                      updatedData,
                      params.roomId
                    )

                    // Retourner les données mises à jour pour mettre à jour l'état local si nécessaire
                    return updatedData
                  })
                }}
              >
                <Image
                  className={`w-14 h-14 object-cover rounded-full filter ${
                    isSummonerIsTimed[role.name].lucidityBoots
                      ? 'brightness-100'
                      : 'brightness-50'
                  }`}
                  width={600}
                  height={600}
                  src="/lucidity-boots.png"
                  alt="lucidity-boots"
                />
              </button>
            </div>
            {/* FLASH ROLE */}
            <button
              className="w-52 h-52 transition-all hover:scale-110"
              onClick={() => {
                if (
                  typeof isSummonerIsTimed[role.name].isFlashed === 'number'
                ) {
                  // Afficher une notification si le bouton est désactivé (c'est-à-dire qu'un compte à rebours est en cours)
                  toast({
                    variant: 'destructive',
                    title: 'You have to clear timer before retime summs',
                    description: "Don't try to int your mates...",
                  })
                } else {
                  // Sinon, démarrer le compte à rebours normalement
                  startFlashCooldown(role.name)
                }
              }}
            >
              <Image
                className={cn('w-64 object-cover cursor-pointer', {
                  'filter brightness-50 cursor-not-allowed':
                    isSummonerIsTimed[role.name].isFlashed,
                })}
                width={600}
                height={600}
                src={role.src}
                alt={role.name}
              />
            </button>
            {/* TIMER */}
            {isSummonerIsTimed[role.name].isFlashed && (
              <p className="absolute text-2xl font-bold textstroke">
                {Math.floor(
                  (isSummonerIsTimed[role.name].isFlashed as number) / 60
                )}
                :
                {(isSummonerIsTimed[role.name].isFlashed as number) % 60 < 10
                  ? '0' +
                    ((isSummonerIsTimed[role.name].isFlashed as number) % 60)
                  : (isSummonerIsTimed[role.name].isFlashed as number) % 60}
              </p>
            )}
            {/* CANCEL BUTTON */}
            {isSummonerIsTimed[role.name].isFlashed && (
              <Button
                variant="outline"
                size="icon"
                onClick={() => {
                  clearTimer(role.name)
                }}
              >
                <MdClear />
              </Button>
            )}
          </div>
        ))}
      </div>
    </main>
  )
}
