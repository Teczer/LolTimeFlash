/**
 * Footer Copyrights
 * Fixed footer with author attribution
 */

import Link from 'next/link'

export const FooterCopyrights = () => {
  return (
    <p className="fixed bottom-8 flex gap-1 text-xs">
      Made with ❤️ by
      <Link
        href="https://github.com/Teczer"
        target="_blank"
        className="block font-bold transition-all hover:scale-110"
      >
        @Teczer_
      </Link>
    </p>
  )
}

