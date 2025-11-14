import { Injectable, LoggerService } from '@nestjs/common'
import * as winston from 'winston'
import DailyRotateFile from 'winston-daily-rotate-file'
import { format } from 'winston'

@Injectable()
export class WinstonLoggerService implements LoggerService {
  private logger: winston.Logger

  constructor() {
    const isProduction = process.env.NODE_ENV === 'production'

    // Format pour les logs lisibles en développement
    const devFormat = format.combine(
      format.colorize(),
      format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
      format.printf(({ timestamp, level, message, context, ...meta }) => {
        const contextStr = context ? `[${context}]` : ''
        const metaStr = Object.keys(meta).length ? `\n${JSON.stringify(meta, null, 2)}` : ''
        return `${timestamp} ${level} ${contextStr} ${message}${metaStr}`
      })
    )

    // Format JSON pour la production (facile à parser)
    const prodFormat = format.combine(
      format.timestamp(),
      format.errors({ stack: true }),
      format.json()
    )

    // Transport pour la console
    const consoleTransport = new winston.transports.Console({
      format: isProduction ? prodFormat : devFormat,
    })

    // Transport pour les logs généraux (rotation quotidienne)
    const fileTransport = new DailyRotateFile({
      filename: 'logs/app-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxSize: '20m', // 20 MB max par fichier
      maxFiles: '14d', // Garde 14 jours d'historique
      format: prodFormat,
    })

    // Transport pour les erreurs uniquement
    const errorTransport = new DailyRotateFile({
      filename: 'logs/error-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '30d', // Garde 30 jours d'erreurs
      level: 'error',
      format: prodFormat,
    })

    this.logger = winston.createLogger({
      level: process.env.LOG_LEVEL || (isProduction ? 'info' : 'debug'),
      transports: [consoleTransport, fileTransport, errorTransport],
    })
  }

  log(message: string, context?: string): void {
    this.logger.info(message, { context })
  }

  error(message: string, trace?: string, context?: string): void {
    this.logger.error(message, { trace, context })
  }

  warn(message: string, context?: string): void {
    this.logger.warn(message, { context })
  }

  debug(message: string, context?: string): void {
    this.logger.debug(message, { context })
  }

  verbose(message: string, context?: string): void {
    this.logger.verbose(message, { context })
  }

  // Méthodes custom pour des logs structurés
  logSocketEvent(event: string, data: any, clientId?: string): void {
    this.logger.info('Socket event', {
      context: 'Socket.IO',
      event,
      clientId,
      data,
    })
  }

  logHttpRequest(method: string, url: string, statusCode: number, duration: number): void {
    this.logger.info('HTTP Request', {
      context: 'HTTP',
      method,
      url,
      statusCode,
      duration: `${duration}ms`,
    })
  }

  logError(error: Error, context?: string): void {
    this.logger.error(error.message, {
      context,
      stack: error.stack,
      name: error.name,
    })
  }
}

