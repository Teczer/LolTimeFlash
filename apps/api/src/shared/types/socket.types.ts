import type {
  Role,
  GameState,
  FlashEventData,
  ItemToggleData,
} from './game.types';

/**
 * Client → Server events
 */
export interface ClientToServerEvents {
  /**
   * Join a room
   */
  'room:join': (payload: { roomId: string; username: string }) => void;

  /**
   * Leave a room
   */
  'room:leave': (payload: { roomId: string }) => void;

  /**
   * Flash is used
   */
  'game:flash': (payload: { role: Role }) => void;

  /**
   * Cancel flash cooldown (Flash is back up)
   */
  'game:flash:cancel': (payload: { role: Role }) => void;

  /**
   * Toggle item (Lucidity Boots or Cosmic Insight)
   */
  'game:toggle:item': (payload: {
    role: Role;
    item: 'lucidityBoots' | 'cosmicInsight';
  }) => void;
}

/**
 * Server → Client events
 */
export interface ServerToClientEvents {
  /**
   * Room state update (sent on join or when state changes)
   */
  'room:state': (state: GameState) => void;

  /**
   * Flash event broadcast
   */
  'game:flash': (data: FlashEventData) => void;

  /**
   * Flash cancel broadcast
   */
  'game:flash:cancel': (data: { role: Role; username: string }) => void;

  /**
   * Item toggle broadcast
   */
  'game:toggle:item': (data: ItemToggleData) => void;

  /**
   * User joined the room
   */
  'room:user:joined': (data: { username: string; users: string[] }) => void;

  /**
   * User left the room
   */
  'room:user:left': (data: { username: string; users: string[] }) => void;

  /**
   * Error event
   */
  error: (data: { code: string; message: string }) => void;
}

/**
 * Inter-server events (for future scaling)
 */
export interface InterServerEvents {
  ping: () => void;
}

/**
 * Socket data (attached to each socket)
 */
export interface SocketData {
  /**
   * Username of the connected user
   */
  username: string;

  /**
   * Current room ID
   */
  roomId: string | null;
}
