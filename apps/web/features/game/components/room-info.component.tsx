import { memo } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useToast } from '@/hooks/use-toast.hook'
import { FaCopy } from 'react-icons/fa'

interface IRoomInfoProps {
  roomId: string
}

const RoomInfoComponent = (props: IRoomInfoProps) => {
  const { roomId } = props
  const { toast } = useToast()

  const handleCopyRoomId = () => {
    navigator.clipboard.writeText(roomId)
    toast({
      title: 'Your lobby code has been copied to your clipboard!',
    })
  }

  return (
    <div className="flex items-center justify-center gap-1">
      <div className="flex flex-col items-center justify-center gap-1">
        <h3 className="textstroke inline-block w-auto whitespace-nowrap text-lg font-bold">
          ROOM ID
        </h3>
        <div className="flex items-center justify-start gap-1">
          <Input
            className="bg-background font-bold"
            type="text"
            value={roomId}
            readOnly
          />
          <Button
            className="p-2"
            variant="outline"
            size="icon"
            onClick={handleCopyRoomId}
            aria-label="Copy room ID"
          >
            <FaCopy className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}

export const RoomInfo = memo(RoomInfoComponent, (prev, next) => {
  return prev.roomId === next.roomId
})
