import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets'
import { Server, Socket } from 'socket.io'
import { UsePipes, ValidationPipe } from '@nestjs/common'
import type {
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData,
} from '../shared/types/socket.types'
import { GameService } from './game.service'
import { RoomService } from '../room/room.service'
import { WinstonLoggerService } from '../logger/logger.service'
import { MetricsService } from '../monitoring/metrics.service'
import { JoinRoomDto, FlashActionDto, ToggleItemDto } from './dto'

@WebSocketGateway({
  cors: {
    origin: '*', // TODO: Configure properly for production
    credentials: true,
  },
})
@UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
export class GameGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server<
    ClientToServerEvents,
    ServerToClientEvents,
    InterServerEvents,
    SocketData
  >

  constructor(
    private readonly gameService: GameService,
    private readonly roomService: RoomService,
    private readonly logger: WinstonLoggerService,
    private readonly metricsService: MetricsService,
  ) {}

  /**
   * Handle client connection
   */
  handleConnection(client: Socket) {
    this.metricsService.incrementConnection()
    this.logger.logSocketEvent('connect', { clientId: client.id }, client.id)
  }

  /**
   * Handle client disconnection
   */
  handleDisconnect(client: Socket) {
    const { username, roomId } = client.data
    
    this.metricsService.decrementConnection()
    this.logger.logSocketEvent('disconnect', { username, roomId }, client.id)

    if (roomId && username) {
      const room = this.roomService.removeUserFromRoom(roomId, username)
      
      if (room) {
        // Notify others that user left
        this.server.to(roomId).emit('room:user:left', {
          username,
          users: room.users,
        })
        
        this.metricsService.incrementEventEmitted('room:user:left')
        this.logger.logSocketEvent('room:user:left', { username, roomId, remainingUsers: room.users.length }, client.id)
      }
    }
  }

  /**
   * Handle room join
   */
  @SubscribeMessage('room:join')
  handleJoinRoom(
    @ConnectedSocket() client: Socket<any, any, any, SocketData>,
    @MessageBody() payload: JoinRoomDto,
  ) {
    const { roomId, username } = payload
    this.metricsService.incrementEventReceived('room:join')

    try {
      // Join Socket.IO room
      client.join(roomId)
      
      // Store user data in socket
      client.data.username = username
      client.data.roomId = roomId

      // Add user to room
      const room = this.roomService.addUserToRoom(roomId, username)

      // ✅ Broadcast updated room state to ALL clients in room (including joining client)
      this.server.to(roomId).emit('room:state', room)
      this.metricsService.incrementEventEmitted('room:state')

      // Notify others that user joined
      client.to(roomId).emit('room:user:joined', {
        username,
        users: room.users,
      })
      this.metricsService.incrementEventEmitted('room:user:joined')

      this.logger.logSocketEvent('room:join', { username, roomId, totalUsers: room.users.length }, client.id)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      this.logger.logError(error instanceof Error ? error : new Error(errorMessage), 'GameGateway')
      client.emit('error', {
        code: 'JOIN_ROOM_ERROR',
        message: errorMessage,
      })
    }
  }

  /**
   * Handle room leave
   */
  @SubscribeMessage('room:leave')
  handleLeaveRoom(
    @ConnectedSocket() client: Socket<any, any, any, SocketData>,
    @MessageBody() payload: { roomId: string },
  ) {
    const { roomId } = payload
    const { username } = client.data
    this.metricsService.incrementEventReceived('room:leave')

    try {
      client.leave(roomId)
      client.data.roomId = null

      if (username) {
        const room = this.roomService.removeUserFromRoom(roomId, username)
        
        if (room) {
          this.server.to(roomId).emit('room:user:left', {
            username,
            users: room.users,
          })
          this.metricsService.incrementEventEmitted('room:user:left')
        }
      }

      this.logger.logSocketEvent('room:leave', { username, roomId }, client.id)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      this.logger.logError(error instanceof Error ? error : new Error(errorMessage), 'GameGateway')
    }
  }

  /**
   * Handle Flash usage
   */
  @SubscribeMessage('game:flash')
  handleFlash(
    @ConnectedSocket() client: Socket<any, any, any, SocketData>,
    @MessageBody() payload: FlashActionDto,
  ) {
    const { role } = payload
    const { roomId, username } = client.data
    this.metricsService.incrementEventReceived('game:flash')

    if (!roomId || !username) {
      client.emit('error', {
        code: 'NOT_IN_ROOM',
        message: 'You must join a room first',
      })
      return
    }

    try {
      const flashData = this.gameService.useFlash(roomId, role, username)

      // Broadcast Flash event to all in room (including sender)
      this.server.to(roomId).emit('game:flash', flashData)
      this.metricsService.incrementEventEmitted('game:flash')

      // ✅ Broadcast updated room state so all clients sync
      const updatedRoom = this.roomService.getRoom(roomId)
      if (updatedRoom) {
        this.server.to(roomId).emit('room:state', updatedRoom)
        this.metricsService.incrementEventEmitted('room:state')
      }

      this.logger.logSocketEvent('game:flash', { username, role, roomId, cooldown: flashData.cooldown }, client.id)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      this.logger.logError(error instanceof Error ? error : new Error(errorMessage), 'GameGateway')
      client.emit('error', {
        code: 'FLASH_ERROR',
        message: errorMessage,
      })
    }
  }

  /**
   * Handle Flash cancel
   */
  @SubscribeMessage('game:flash:cancel')
  handleFlashCancel(
    @ConnectedSocket() client: Socket<any, any, any, SocketData>,
    @MessageBody() payload: FlashActionDto,
  ) {
    const { role } = payload
    const { roomId, username } = client.data
    this.metricsService.incrementEventReceived('game:flash:cancel')

    if (!roomId || !username) {
      client.emit('error', {
        code: 'NOT_IN_ROOM',
        message: 'You must join a room first',
      })
      return
    }

    try {
      this.gameService.cancelFlash(roomId, role)

      // Broadcast cancel event to all in room
      this.server.to(roomId).emit('game:flash:cancel', {
        role,
        username,
      })
      this.metricsService.incrementEventEmitted('game:flash:cancel')

      // ✅ Broadcast updated room state
      const updatedRoom = this.roomService.getRoom(roomId)
      if (updatedRoom) {
        this.server.to(roomId).emit('room:state', updatedRoom)
        this.metricsService.incrementEventEmitted('room:state')
      }

      this.logger.logSocketEvent('game:flash:cancel', { username, role, roomId }, client.id)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      this.logger.logError(error instanceof Error ? error : new Error(errorMessage), 'GameGateway')
      client.emit('error', {
        code: 'FLASH_CANCEL_ERROR',
        message: errorMessage,
      })
    }
  }

  /**
   * Handle item toggle
   */
  @SubscribeMessage('game:toggle:item')
  handleToggleItem(
    @ConnectedSocket() client: Socket<any, any, any, SocketData>,
    @MessageBody() payload: ToggleItemDto,
  ) {
    const { role, item } = payload
    const { roomId, username } = client.data
    this.metricsService.incrementEventReceived('game:toggle:item')

    if (!roomId || !username) {
      client.emit('error', {
        code: 'NOT_IN_ROOM',
        message: 'You must join a room first',
      })
      return
    }

    try {
      const itemData = this.gameService.toggleItem(roomId, role, item, username)

      // Broadcast item toggle event to all in room
      this.server.to(roomId).emit('game:toggle:item', itemData)
      this.metricsService.incrementEventEmitted('game:toggle:item')

      // ✅ Broadcast updated room state
      const updatedRoom = this.roomService.getRoom(roomId)
      if (updatedRoom) {
        this.server.to(roomId).emit('room:state', updatedRoom)
        this.metricsService.incrementEventEmitted('room:state')
      }

      this.logger.logSocketEvent('game:toggle:item', { username, role, item, value: itemData.value, roomId }, client.id)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      this.logger.logError(error instanceof Error ? error : new Error(errorMessage), 'GameGateway')
      client.emit('error', {
        code: 'TOGGLE_ITEM_ERROR',
        message: errorMessage,
      })
    }
  }
}

