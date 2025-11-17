import { Injectable } from '@nestjs/common';
import type {
  Role,
  FlashEventData,
  ItemToggleData,
} from '../shared/types/game.types';
import { calculateFlashCooldown } from '../shared/constants/cooldowns';
import { RoomService } from '../room/room.service';

@Injectable()
export class GameService {
  constructor(private readonly roomService: RoomService) {}

  /**
   * Handle Flash usage
   */
  useFlash(roomId: string, role: Role, username: string): FlashEventData {
    const room = this.roomService.getRoom(roomId);

    if (!room) {
      throw new Error(`Room ${roomId} not found`);
    }

    const summonerData = room.roles[role];
    const cooldown = calculateFlashCooldown(
      summonerData.lucidityBoots,
      summonerData.cosmicInsight,
    );
    const endsAt = Date.now() + cooldown * 1000;

    // ✅ Store endsAt timestamp instead of countdown
    room.roles[role].isFlashed = endsAt;
    this.roomService.updateRoom(roomId, { roles: room.roles });

    return {
      role,
      username,
      cooldown,
      endsAt,
    };
  }

  /**
   * Handle Flash cancel (Flash is back up)
   */
  cancelFlash(roomId: string, role: Role): void {
    const room = this.roomService.getRoom(roomId);

    if (!room) {
      throw new Error(`Room ${roomId} not found`);
    }

    room.roles[role].isFlashed = false;
    this.roomService.updateRoom(roomId, { roles: room.roles });
  }

  /**
   * Handle item toggle (Lucidity Boots or Cosmic Insight)
   */
  toggleItem(
    roomId: string,
    role: Role,
    item: 'lucidityBoots' | 'cosmicInsight',
    username: string,
  ): ItemToggleData {
    const room = this.roomService.getRoom(roomId);

    if (!room) {
      throw new Error(`Room ${roomId} not found`);
    }

    const roleData = room.roles[role];
    const currentValue = roleData[item];
    const newValue = !currentValue;

    // Toggle the item
    roleData[item] = newValue;

    // ✅ If Flash is on cooldown, recalculate endsAt based on new cooldown
    if (typeof roleData.isFlashed === 'number') {
      const currentEndsAt = roleData.isFlashed;
      const now = Date.now();
      const remainingTime = Math.max(0, currentEndsAt - now);

      // Calculate new cooldown with updated items
      const newCooldownTotal = calculateFlashCooldown(
        item === 'lucidityBoots' ? newValue : roleData.lucidityBoots,
        item === 'cosmicInsight' ? newValue : roleData.cosmicInsight,
      );

      // Adjust endsAt: keep the same remaining percentage
      const oldCooldownTotal = calculateFlashCooldown(
        item === 'lucidityBoots' ? currentValue : roleData.lucidityBoots,
        item === 'cosmicInsight' ? currentValue : roleData.cosmicInsight,
      );

      const percentageRemaining = remainingTime / (oldCooldownTotal * 1000);
      const newRemainingTime = percentageRemaining * newCooldownTotal * 1000;

      roleData.isFlashed = now + newRemainingTime;
    }

    this.roomService.updateRoom(roomId, { roles: room.roles });

    return {
      role,
      item,
      value: newValue,
      username,
    };
  }
}
