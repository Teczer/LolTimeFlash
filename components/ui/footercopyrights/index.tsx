import Link from 'next/link'

const FooterCopyrights: React.FC = () => {
  return (
    <p className="flex gap-2 fixed text-xs bottom-8">
      Made with ❤️ by {''}
      <Link
        href={'https://github.com/Teczer'}
        target="_blank"
        className="block font-bold transition-all hover:scale-110"
      >
        @Teczer_
      </Link>
    </p>
  )
}

export default FooterCopyrights
