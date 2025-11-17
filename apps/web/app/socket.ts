'use client'

import config from '@/lib/config'
import { io, Socket } from 'socket.io-client'
import type { ClientToServerEvents, ServerToClientEvents } from '@loltimeflash/shared'

const socketIoUrl = config.socketPort

export const socket: Socket<ServerToClientEvents, ClientToServerEvents> =
  io(socketIoUrl)

