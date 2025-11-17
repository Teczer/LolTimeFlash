import Link from 'next/link'
import { IoIosSettings } from 'react-icons/io'
import { Button } from '@/components/ui/button'

export const SettingsButton = () => {
  return (
    <Link href="/settings">
      <Button variant="outline" size="icon">
        <IoIosSettings className="h-6 w-6" />
      </Button>
    </Link>
  )
}

