import Link from 'next/link'

import { Button } from '../ui/button'

import { IoIosSettings } from 'react-icons/io'

const SettingsButton: React.FC = () => {
  return (
    <Link href={'/settings'}>
      <Button variant="outline" size="icon">
        <IoIosSettings className="h-6 w-6" />
      </Button>
    </Link>
  )
}

export default SettingsButton
