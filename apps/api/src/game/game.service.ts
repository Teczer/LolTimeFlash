import type { FlashEventData, ItemToggleData, Role } from '@app/shared';
import { calculateFlashCooldown } from '@app/shared';
import { Injectable } from '@nestjs/common';
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

    // Extract values explicitly to help ESLint type inference
    const summonerData = room.roles[role];
    const hasLucidityBoots: boolean = summonerData.lucidityBoots;
    const hasCosmicInsight: boolean = summonerData.cosmicInsight;

    const cooldown: number = calculateFlashCooldown(
      hasLucidityBoots,
      hasCosmicInsight,
    );
    const endsAt: number = Date.now() + cooldown * 1000;

    // ✅ Store endsAt timestamp instead of countdown
    room.roles[role].isFlashed = endsAt;
    this.roomService.updateRoom(roomId, { roles: room.roles });

    const result: FlashEventData = {
      role,
      username,
      cooldown,
      endsAt,
    };

    return result;
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

    // Extract values explicitly to help ESLint type inference
    const roleData = room.roles[role];
    const currentValue: boolean = roleData[item];
    const newValue: boolean = !currentValue;

    // Toggle the item
    roleData[item] = newValue;

    // ✅ If Flash is on cooldown, recalculate endsAt based on new cooldown
    if (typeof roleData.isFlashed === 'number') {
      const currentEndsAt: number = roleData.isFlashed;
      const now: number = Date.now();
      const remainingTime: number = Math.max(0, currentEndsAt - now);

      // Extract boot/rune states
      const hasBoots: boolean = roleData.lucidityBoots;
      const hasInsight: boolean = roleData.cosmicInsight;

      // Calculate new cooldown with updated items
      const newCooldownTotal: number = calculateFlashCooldown(
        item === 'lucidityBoots' ? newValue : hasBoots,
        item === 'cosmicInsight' ? newValue : hasInsight,
      );

      // Adjust endsAt: keep the same remaining percentage
      const oldCooldownTotal: number = calculateFlashCooldown(
        item === 'lucidityBoots' ? currentValue : hasBoots,
        item === 'cosmicInsight' ? currentValue : hasInsight,
      );

      const percentageRemaining: number =
        remainingTime / (oldCooldownTotal * 1000);
      const newRemainingTime: number =
        percentageRemaining * newCooldownTotal * 1000;

      roleData.isFlashed = now + newRemainingTime;
    }

    this.roomService.updateRoom(roomId, { roles: room.roles });

    const result: ItemToggleData = {
      role,
      item,
      value: newValue,
      username,
    };

    return result;
  }

  /**
   * Handle champion data update from Riot API
   */
  updateChampionData(
    roomId: string,
    roleMapping: Partial<
      Record<Role, import('@app/shared').ChampionUpdateData>
    >,
    gameInfo?: { gameId: number; gameStartTime: number },
  ): void {
    const room = this.roomService.getRoom(roomId);

    if (!room) {
      throw new Error(`Room ${roomId} not found`);
    }

    // Update each role with champion data
    for (const roleKey in roleMapping) {
      const role = roleKey as Role;
      const championData = roleMapping[role];

      if (championData && room.roles[role]) {
        const championId: number = championData.championId;
        const championName: string = championData.championName;
        const championIconUrl: string = championData.championIconUrl;
        const summonerName: string = championData.summonerName;

        room.roles[role].champion = {
          championId,
          championName,
          championIconUrl,
          summonerName,
        };
      }
    }

    // Update room with roles and game info
    this.roomService.updateRoom(roomId, {
      roles: room.roles,
      ...(gameInfo && {
        gameId: gameInfo.gameId,
        gameStartTime: gameInfo.gameStartTime,
      }),
    });
  }
}
