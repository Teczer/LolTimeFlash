import type { Metadata } from 'next'
import localFont from 'next/font/local'
import { ErrorBoundary } from '@/components/error-boundary.component'
import { QueryProvider } from '@/components/providers/query-provider.component'
import { BackgroundWrapper } from '@/components/layout/background-wrapper.component'
import { Toaster } from '@/components/ui/toaster'
import './globals.css'

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
        <ErrorBoundary>
          <QueryProvider>
            <BackgroundWrapper>
              <Toaster />
              <div className="mx-auto min-h-screen max-w-screen-2xl">
                {children}
              </div>
            </BackgroundWrapper>
          </QueryProvider>
        </ErrorBoundary>
      </body>
    </html>
  )
}
