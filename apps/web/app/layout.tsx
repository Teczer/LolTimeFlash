import type { Metadata } from 'next'
import { Toaster } from '@/components/ui/toaster'

import localFont from 'next/font/local'

import './globals.css'
import WrapperBackground from '@/components/ui/wrapperbackground'
import QueryProvider from '@/components/QueryProvider'

const BeaufortforLOL = localFont({
  src: [
    {
      path: '../fonts/BeaufortforLOL-Medium.otf',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../fonts/BeaufortforLOL-MediumItalic.otf',
      weight: '400',
      style: 'italic',
    },
    {
      path: '../fonts/BeaufortforLOL-Bold.otf',
      weight: '700',
      style: 'normal',
    },
    {
      path: '../fonts/BeaufortforLOL-BoldItalic.otf',
      weight: '700',
      style: 'italic',
    },
  ],
})

export const metadata: Metadata = {
  title: 'LolTimeFlash',
  description:
    'League of Legends Website Tool: Easily Time and Communicate Summoner Spells ⏰ THE FLASH! 🌟',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html className={BeaufortforLOL.className} lang="en">
      <body>
        <QueryProvider>
          <WrapperBackground>
            <Toaster />
            <div className="mx-auto min-h-screen max-w-screen-2xl">
              {children}
            </div>
          </WrapperBackground>
        </QueryProvider>
      </body>
    </html>
  )
}
