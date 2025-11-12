import { Injectable } from '@nestjs/common'
import type { Role, FlashEventData, ItemToggleData } from '../shared/types/game.types'
import { calculateFlashCooldown } from '../shared/constants/cooldowns'
import { RoomService } from '../room/room.service'

@Injectable()
export class GameService {
  constructor(private readonly roomService: RoomService) {}

  /**
   * Handle Flash usage
   */
  useFlash(roomId: string, role: Role, username: string): FlashEventData {
    const room = this.roomService.getRoom(roomId)
    
    if (!room) {
      throw new Error(`Room ${roomId} not found`)
    }

    const summonerData = room.roles[role]
    const cooldown = calculateFlashCooldown(
      summonerData.lucidityBoots,
      summonerData.cosmicInsight
    )
    const endsAt = Date.now() + cooldown * 1000

    // Update room state
    room.roles[role].isFlashed = cooldown
    this.roomService.updateRoom(roomId, { roles: room.roles })

    return {
      role,
      username,
      cooldown,
      endsAt,
    }
  }

  /**
   * Handle Flash cancel (Flash is back up)
   */
  cancelFlash(roomId: string, role: Role): void {
    const room = this.roomService.getRoom(roomId)
    
    if (!room) {
      throw new Error(`Room ${roomId} not found`)
    }

    room.roles[role].isFlashed = false
    this.roomService.updateRoom(roomId, { roles: room.roles })
  }

  /**
   * Handle item toggle (Lucidity Boots or Cosmic Insight)
   */
  toggleItem(
    roomId: string,
    role: Role,
    item: 'lucidityBoots' | 'cosmicInsight',
    username: string
  ): ItemToggleData {
    const room = this.roomService.getRoom(roomId)
    
    if (!room) {
      throw new Error(`Room ${roomId} not found`)
    }

    // Toggle the item
    const currentValue = room.roles[role][item]
    room.roles[role][item] = !currentValue
    this.roomService.updateRoom(roomId, { roles: room.roles })

    return {
      role,
      item,
      value: !currentValue,
      username,
    }
  }
}

