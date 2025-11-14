import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GameModule } from './game/game.module';
import { RoomModule } from './room/room.module';
import { ChampionsModule } from './champions/champions.module';
import { LoggerModule } from './logger/logger.module';
import { MonitoringModule } from './monitoring/monitoring.module';

@Module({
  imports: [LoggerModule, MonitoringModule, GameModule, RoomModule, ChampionsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
