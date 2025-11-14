import Image from 'next/image'
import Link from 'next/link'
import { SettingsButton } from '@/components/layout/settings-button.component'
import { FooterCopyrights } from '@/components/layout/footer-copyrights.component'
import { BackgroundSelector } from '@/features/settings/components/background-selector.component'
import { Button } from '@/components/ui/button'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-24">
      <div className="fixed right-6 top-6 sm:right-20 sm:top-10">
        <BackgroundSelector />
      </div>
      <div className="fixed left-6 top-6 sm:left-20 sm:top-10">
        <SettingsButton />
      </div>
      <div className="flex items-center justify-center gap-4">
        <h1 className="textstroke text-xl font-bold sm:text-3xl">
          Welcome to LolTimeFlash!
        </h1>
        <Image
          className="w-10 rotate-6 rounded-md object-cover sm:w-20"
          width={500}
          height={500}
          src={'/assets/flash-icon.webp'}
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
