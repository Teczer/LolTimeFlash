import { Global, Module } from '@nestjs/common';
import { MetricsService } from './metrics.service';
import { MonitoringController } from './monitoring.controller';
import { RoomModule } from '../room/room.module';

@Global() // Rend le service disponible partout
@Module({
  imports: [RoomModule],
  controllers: [MonitoringController],
  providers: [MetricsService],
  exports: [MetricsService],
})
export class MonitoringModule {}
