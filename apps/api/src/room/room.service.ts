import type { GameState } from '@app/shared';
import { DEFAULT_SUMMONER_DATA } from '@app/shared';
import { Injectable } from '@nestjs/common';

@Injectable()
export class RoomService {
  private readonly rooms: Map<string, GameState> = new Map();

  /**
   * Get or create a room
   */
  getOrCreateRoom(roomId: string): GameState {
    if (!this.rooms.has(roomId)) {
      this.rooms.set(roomId, this.createDefaultRoom(roomId));
    }
    return this.rooms.get(roomId)!;
  }

  /**
   * Get a room by ID
   */
  getRoom(roomId: string): GameState | undefined {
    return this.rooms.get(roomId);
  }

  /**
   * Add a user to a room
   */
  addUserToRoom(roomId: string, username: string): GameState {
    const room = this.getOrCreateRoom(roomId);

    if (!room.users.includes(username)) {
      room.users.push(username);
      room.updatedAt = new Date();
    }

    return room;
  }

  /**
   * Remove a user from a room
   */
  removeUserFromRoom(roomId: string, username: string): GameState | undefined {
    const room = this.getRoom(roomId);

    if (!room) {
      return undefined;
    }

    const index = room.users.indexOf(username);
    if (index !== -1) {
      room.users.splice(index, 1);
      room.updatedAt = new Date();
    }

    // Clean up empty rooms
    if (room.users.length === 0) {
      this.rooms.delete(roomId);
      return undefined;
    }

    return room;
  }

  /**
   * Update room state
   */
  updateRoom(roomId: string, partialState: Partial<GameState>): GameState {
    const room = this.getOrCreateRoom(roomId);
    Object.assign(room, partialState, { updatedAt: new Date() });
    return room;
  }

  /**
   * Create default room data
   */
  private createDefaultRoom(roomId: string): GameState {
    return {
      roomId,
      users: [],
      roles: {
        TOP: { ...DEFAULT_SUMMONER_DATA },
        JUNGLE: { ...DEFAULT_SUMMONER_DATA },
        MID: { ...DEFAULT_SUMMONER_DATA },
        SUPPORT: { ...DEFAULT_SUMMONER_DATA },
        ADC: { ...DEFAULT_SUMMONER_DATA },
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }

  /**
   * Get all rooms (for debugging)
   */
  getAllRooms(): GameState[] {
    return Array.from(this.rooms.values());
  }

  /**
   * Get room count (for monitoring)
   */
  getRoomCount(): number {
    return this.rooms.size;
  }
}
