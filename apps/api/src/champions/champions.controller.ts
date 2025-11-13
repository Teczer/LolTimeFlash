import { Controller, Get, Logger } from '@nestjs/common'
import { ChampionsService } from './champions.service'
import type { AllSkinsSplashArts } from '@loltimeflash/shared'

@Controller('champions')
export class ChampionsController {
  private readonly logger = new Logger(ChampionsController.name)

  constructor(private readonly championsService: ChampionsService) {}

  /**
   * GET /champions/skins
   * Fetch all champions with their splash arts from Data Dragon API
   * Cached for 24 hours
   */
  @Get('skins')
  async getAllSkins(): Promise<AllSkinsSplashArts[]> {
    this.logger.log('Fetching all champion skins...')
    return this.championsService.getAllChampionSkins()
  }
}

