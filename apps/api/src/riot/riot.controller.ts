import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { IsNotEmpty, IsString } from 'class-validator';
import { RiotService } from './riot.service';

export class GetLiveGameDto {
  @IsString()
  @IsNotEmpty()
  summonerName: string;

  @IsString()
  @IsNotEmpty()
  region: string;
}

@Controller('riot')
export class RiotController {
  constructor(private readonly riotService: RiotService) {}

  /**
   * POST /riot/live-game
   * Fetch live game data for a summoner
   */
  @Post('live-game')
  @HttpCode(HttpStatus.OK)
  async getLiveGame(@Body() dto: GetLiveGameDto) {
    return this.riotService.getLiveGameData(dto.summonerName, dto.region);
  }
}
