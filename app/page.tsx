import Image from 'next/image'
import Link from 'next/link'

import { Button } from '@/components/ui/button'
import ChangeCoverButton from '@/components/ui/dialogcover'
import FooterCopyrights from '@/components/ui/footercopyrights'

export default function Home() {
  return (
    <main className="flex flex-col justify-center items-center gap-24 min-h-screen">
      {/* <div className="hidden sm:block">
        <ChangeCoverButton />
      </div> */}
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
      <FooterCopyrights />
    </main>
  )
}
