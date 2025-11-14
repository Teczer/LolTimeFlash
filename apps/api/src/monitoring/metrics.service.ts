import { Injectable } from '@nestjs/common'

interface SocketMetrics {
  activeConnections: number
  totalConnections: number
  totalDisconnections: number
  eventsReceived: {
    [eventName: string]: number
  }
  eventsEmitted: {
    [eventName: string]: number
  }
  activeRooms: number
  totalUsers: number
}

interface HttpMetrics {
  totalRequests: number
  requestsByMethod: {
    [method: string]: number
  }
  averageResponseTime: number
  errorCount: number
}

@Injectable()
export class MetricsService {
  private socketMetrics: SocketMetrics = {
    activeConnections: 0,
    totalConnections: 0,
    totalDisconnections: 0,
    eventsReceived: {},
    eventsEmitted: {},
    activeRooms: 0,
    totalUsers: 0,
  }

  private httpMetrics: HttpMetrics = {
    totalRequests: 0,
    requestsByMethod: {},
    averageResponseTime: 0,
    errorCount: 0,
  }

  private startTime: Date = new Date()

  // Socket.IO Metrics
  incrementConnection(): void {
    this.socketMetrics.activeConnections++
    this.socketMetrics.totalConnections++
  }

  decrementConnection(): void {
    this.socketMetrics.activeConnections--
    this.socketMetrics.totalDisconnections++
  }

  incrementEventReceived(eventName: string): void {
    if (!this.socketMetrics.eventsReceived[eventName]) {
      this.socketMetrics.eventsReceived[eventName] = 0
    }
    this.socketMetrics.eventsReceived[eventName]++
  }

  incrementEventEmitted(eventName: string): void {
    if (!this.socketMetrics.eventsEmitted[eventName]) {
      this.socketMetrics.eventsEmitted[eventName] = 0
    }
    this.socketMetrics.eventsEmitted[eventName]++
  }

  setActiveRooms(count: number): void {
    this.socketMetrics.activeRooms = count
  }

  setTotalUsers(count: number): void {
    this.socketMetrics.totalUsers = count
  }

  // HTTP Metrics
  incrementHttpRequest(method: string, duration: number): void {
    this.httpMetrics.totalRequests++

    if (!this.httpMetrics.requestsByMethod[method]) {
      this.httpMetrics.requestsByMethod[method] = 0
    }
    this.httpMetrics.requestsByMethod[method]++

    // Update average response time
    const currentAvg = this.httpMetrics.averageResponseTime
    const totalRequests = this.httpMetrics.totalRequests
    this.httpMetrics.averageResponseTime =
      (currentAvg * (totalRequests - 1) + duration) / totalRequests
  }

  incrementHttpError(): void {
    this.httpMetrics.errorCount++
  }

  // Getters
  getSocketMetrics(): SocketMetrics {
    return { ...this.socketMetrics }
  }

  getHttpMetrics(): HttpMetrics {
    return { ...this.httpMetrics }
  }

  getAllMetrics() {
    const uptime = Date.now() - this.startTime.getTime()
    return {
      uptime: {
        milliseconds: uptime,
        seconds: Math.floor(uptime / 1000),
        formatted: this.formatUptime(uptime),
      },
      startTime: this.startTime.toISOString(),
      socket: this.getSocketMetrics(),
      http: this.getHttpMetrics(),
      memory: process.memoryUsage(),
      cpu: process.cpuUsage(),
    }
  }

  resetMetrics(): void {
    this.socketMetrics = {
      activeConnections: 0,
      totalConnections: 0,
      totalDisconnections: 0,
      eventsReceived: {},
      eventsEmitted: {},
      activeRooms: 0,
      totalUsers: 0,
    }
    this.httpMetrics = {
      totalRequests: 0,
      requestsByMethod: {},
      averageResponseTime: 0,
      errorCount: 0,
    }
    this.startTime = new Date()
  }

  private formatUptime(ms: number): string {
    const seconds = Math.floor(ms / 1000)
    const minutes = Math.floor(seconds / 60)
    const hours = Math.floor(minutes / 60)
    const days = Math.floor(hours / 24)

    if (days > 0) return `${days}d ${hours % 24}h ${minutes % 60}m`
    if (hours > 0) return `${hours}h ${minutes % 60}m ${seconds % 60}s`
    if (minutes > 0) return `${minutes}m ${seconds % 60}s`
    return `${seconds}s`
  }
}

