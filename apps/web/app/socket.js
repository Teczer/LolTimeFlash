'use client'

import config from '@/lib/config'
import { io } from 'socket.io-client'

const socketIoUrl = config.socketPort

export const socket = io(socketIoUrl)
