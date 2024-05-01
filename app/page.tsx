import Image from 'next/image'
import Link from 'next/link'

import { Button } from '@/components/ui/button'
import ChangeCoverButton from '@/components/ui/dialogcover'

export default function Home() {
  return (
    <main className="font-mono flex flex-col justify-center items-center gap-24 min-h-screen">
      <div className="hidden sm:block">
        <ChangeCoverButton />
      </div>
      <div className="flex justify-center items-center gap-4">
        <h1 className="text-xl font-bold textstroke sm:text-3xl">
          Welcome to LolTimeFlash!
        </h1>
        <Image
          className="w-10 object-cover rounded-md rotate-6 sm:w-20"
          width={500}
          height={500}
          src={'/flash-icon.webp'}
          alt="flash-icon"
        />
      </div>
      <Link href={'/lobby'}>
        <Button variant="outline">Create or join a lobby</Button>
      </Link>
      <Link href={'/game'}>
        <Button variant="outline">Solo Lobby</Button>
      </Link>
      <p className="flex gap-2 fixed text-xs bottom-8">
        Designed and built by {''}
        <Link
          href={'https://github.com/Teczer'}
          target="_blank"
          className="block font-bold transition-all hover:scale-110"
        >
          @Teczer_
        </Link>
      </p>
    </main>
  )
}
