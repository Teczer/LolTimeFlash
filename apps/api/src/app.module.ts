import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GameModule } from './game/game.module';
import { RoomModule } from './room/room.module';

@Module({
  imports: [GameModule, RoomModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
