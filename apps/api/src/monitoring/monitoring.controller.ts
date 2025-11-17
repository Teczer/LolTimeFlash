import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { MetricsService } from './metrics.service';
import { RoomService } from '../room/room.service';

@ApiTags('monitoring')
@Controller('monitoring')
export class MonitoringController {
  constructor(
    private readonly metricsService: MetricsService,
    private readonly roomService: RoomService,
  ) {}

  /**
   * Health check endpoint
   * Returns 200 if server is healthy
   */
  @Get('health')
  @ApiOperation({
    summary: 'Health check',
    description: 'Returns server health status',
  })
  @ApiResponse({ status: 200, description: 'Server is healthy' })
  getHealth() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    };
  }

  /**
   * Detailed metrics endpoint
   * Returns comprehensive metrics about the server
   */
  @Get('metrics')
  @ApiOperation({
    summary: 'Get all metrics',
    description:
      'Returns comprehensive server metrics including Socket.IO, HTTP, memory, and CPU usage',
  })
  @ApiResponse({ status: 200, description: 'Metrics retrieved successfully' })
  getMetrics() {
    // Update room metrics before returning
    const rooms = this.roomService.getAllRooms();
    const totalUsers = rooms.reduce((acc, room) => acc + room.users.length, 0);

    this.metricsService.setActiveRooms(rooms.length);
    this.metricsService.setTotalUsers(totalUsers);

    return this.metricsService.getAllMetrics();
  }

  /**
   * Socket.IO specific metrics
   */
  @Get('metrics/socket')
  @ApiOperation({
    summary: 'Get Socket.IO metrics',
    description:
      'Returns Socket.IO specific metrics (connections, events, rooms)',
  })
  @ApiResponse({
    status: 200,
    description: 'Socket.IO metrics retrieved successfully',
  })
  getSocketMetrics() {
    const rooms = this.roomService.getAllRooms();
    const totalUsers = rooms.reduce((acc, room) => acc + room.users.length, 0);

    this.metricsService.setActiveRooms(rooms.length);
    this.metricsService.setTotalUsers(totalUsers);

    return this.metricsService.getSocketMetrics();
  }

  /**
   * HTTP specific metrics
   */
  @Get('metrics/http')
  @ApiOperation({
    summary: 'Get HTTP metrics',
    description:
      'Returns HTTP specific metrics (requests, response times, errors)',
  })
  @ApiResponse({
    status: 200,
    description: 'HTTP metrics retrieved successfully',
  })
  getHttpMetrics() {
    return this.metricsService.getHttpMetrics();
  }
}
