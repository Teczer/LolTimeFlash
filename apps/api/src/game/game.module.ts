import { Module } from '@nestjs/common'
import { GameGateway } from './game.gateway'
import { GameService } from './game.service'
import { RoomModule } from '../room/room.module'

@Module({
  imports: [RoomModule],
  providers: [GameGateway, GameService],
})
export class GameModule {}

