import type { Metadata } from 'next'
import { Toaster } from '@/components/ui/toaster'

import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'

import './globals.css'
import WrapperBackground from '@/components/ui/wrapperbackground'
import QueryProvider from '@/components/QueryProvider'

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
    <html className={`${GeistSans.className} ${GeistMono.className}`} lang="en">
      <body>
        <QueryProvider>
          <WrapperBackground>
            <Toaster />
            <div className="min-h-screen max-w-screen-lg mx-auto">
              {children}
            </div>
          </WrapperBackground>
        </QueryProvider>
      </body>
    </html>
  )
}
