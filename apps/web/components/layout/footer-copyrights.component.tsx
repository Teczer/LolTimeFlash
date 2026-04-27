import Link from 'next/link'

export const FooterCopyrights = () => {
  return (
    <div className="fixed bottom-6 flex flex-col items-center gap-0.5">
      <p className="flex gap-1 text-xs">
        Made with ❤️ by
        <Link
          href="https://github.com/Teczer"
          target="_blank"
          className="block font-bold transition-all hover:scale-110"
        >
          @Teczer_
        </Link>
      </p>
      <p className="flex gap-0.5 text-[10px] italic opacity-50">
        QA & Designed by
        <Link
          href="https://www.linkedin.com/in/aryles-slimani/"
          target="_blank"
          className="font-semibold not-italic transition-all hover:scale-110 hover:opacity-100"
        >
          @Aryles
        </Link>
      </p>
    </div>
  )
}
