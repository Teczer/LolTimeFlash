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
import { Logger, UsePipes, ValidationPipe } from '@nestjs/common'
import type {
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData,
} from '../shared/types/socket.types'
import { GameService } from './game.service'
import { RoomService } from '../room/room.service'
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

  private readonly logger = new Logger(GameGateway.name)

  constructor(
    private readonly gameService: GameService,
    private readonly roomService: RoomService,
  ) {}

  /**
   * Handle client connection
   */
  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`)
  }

  /**
   * Handle client disconnection
   */
  handleDisconnect(client: Socket) {
    const { username, roomId } = client.data
    
    this.logger.log(`Client disconnected: ${client.id} (${username})`)

    if (roomId && username) {
      const room = this.roomService.removeUserFromRoom(roomId, username)
      
      if (room) {
        // Notify others that user left
        this.server.to(roomId).emit('room:user:left', {
          username,
          users: room.users,
        })
        
        this.logger.log(`User ${username} left room ${roomId}`)
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

    try {
      // Join Socket.IO room
      client.join(roomId)
      
      // Store user data in socket
      client.data.username = username
      client.data.roomId = roomId

      // Add user to room
      const room = this.roomService.addUserToRoom(roomId, username)

      // Send current state to the joining user
      client.emit('room:state', room)

      // Notify others that user joined
      client.to(roomId).emit('room:user:joined', {
        username,
        users: room.users,
      })

      this.logger.log(`User ${username} joined room ${roomId}`)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      this.logger.error(`Error joining room: ${errorMessage}`)
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
        }
      }

      this.logger.log(`User ${username} left room ${roomId}`)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      this.logger.error(`Error leaving room: ${errorMessage}`)
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

    if (!roomId || !username) {
      client.emit('error', {
        code: 'NOT_IN_ROOM',
        message: 'You must join a room first',
      })
      return
    }

    try {
      const flashData = this.gameService.useFlash(roomId, role, username)

      // Broadcast to all in room (including sender)
      this.server.to(roomId).emit('game:flash', flashData)

      this.logger.log(`${username} used Flash on ${role} in room ${roomId}`)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      this.logger.error(`Error using Flash: ${errorMessage}`)
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

    if (!roomId || !username) {
      client.emit('error', {
        code: 'NOT_IN_ROOM',
        message: 'You must join a room first',
      })
      return
    }

    try {
      this.gameService.cancelFlash(roomId, role)

      // Broadcast to all in room
      this.server.to(roomId).emit('game:flash:cancel', {
        role,
        username,
      })

      this.logger.log(`${username} cancelled Flash on ${role} in room ${roomId}`)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      this.logger.error(`Error cancelling Flash: ${errorMessage}`)
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

    if (!roomId || !username) {
      client.emit('error', {
        code: 'NOT_IN_ROOM',
        message: 'You must join a room first',
      })
      return
    }

    try {
      const itemData = this.gameService.toggleItem(roomId, role, item, username)

      // Broadcast to all in room
      this.server.to(roomId).emit('game:toggle:item', itemData)

      this.logger.log(
        `${username} toggled ${item} to ${itemData.value} for ${role} in room ${roomId}`,
      )
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      this.logger.error(`Error toggling item: ${errorMessage}`)
      client.emit('error', {
        code: 'TOGGLE_ITEM_ERROR',
        message: errorMessage,
      })
    }
  }
}

