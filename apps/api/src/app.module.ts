import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GameModule } from './game/game.module';
import { LoggerModule } from './logger/logger.module';
import { MonitoringModule } from './monitoring/monitoring.module';
import { RoomModule } from './room/room.module';
import { RiotModule } from './riot/riot.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '../../.env', // Load from project root
    }),
    LoggerModule,
    MonitoringModule,
    GameModule,
    RoomModule,
    RiotModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
