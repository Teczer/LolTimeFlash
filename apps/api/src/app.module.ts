import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GameModule } from './game/game.module';
import { LoggerModule } from './logger/logger.module';
import { MonitoringModule } from './monitoring/monitoring.module';
import { RoomModule } from './room/room.module';

@Module({
  imports: [LoggerModule, MonitoringModule, GameModule, RoomModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
