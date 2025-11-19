import type {
  FetchLiveGameResponse,
  RiotActiveGame,
  RiotParticipant,
  RiotSummoner,
} from '@app/shared';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class RiotService {
  private readonly riotApiKey: string;

  // Flash summoner spell ID
  private readonly FLASH_SPELL_ID = 4;

  constructor(private configService: ConfigService) {
    this.riotApiKey = this.configService.get<string>('RIOT_API_KEY') || '';

    if (!this.riotApiKey) {
      console.warn(
        '⚠️  RIOT_API_KEY not found in environment variables. Live game feature will not work.',
      );
    }
  }

  /**
   * Get platform routing value from region
   */
  private getPlatform(region: string): string {
    return region.toLowerCase();
  }

  /**
   * Get regional routing value from region
   * https://developer.riotgames.com/docs/lol#routing-values
   */
  private getRegionalRouting(region: string): string {
    const mapping: Record<string, string> = {
      br1: 'americas',
      eun1: 'europe',
      euw1: 'europe',
      jp1: 'asia',
      kr: 'asia',
      la1: 'americas',
      la2: 'americas',
      na1: 'americas',
      oc1: 'sea',
      ph2: 'sea',
      ru: 'europe',
      sg2: 'sea',
      th2: 'sea',
      tr1: 'europe',
      tw2: 'sea',
      vn2: 'sea',
    };
    return mapping[region.toLowerCase()] || 'europe';
  }

  /**
   * Fetch account by Riot ID (gameName#tagLine)
   * Uses the new Riot Account API v1
   */
  private async fetchAccountByRiotId(
    gameName: string,
    tagLine: string,
    region: string,
  ): Promise<{ puuid: string; gameName: string; tagLine: string } | null> {
    const regionalRouting = this.getRegionalRouting(region);
    const url = `https://${regionalRouting}.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${encodeURIComponent(gameName)}/${encodeURIComponent(tagLine)}`;

    try {
      const response = await fetch(url, {
        headers: {
          'X-Riot-Token': this.riotApiKey,
        },
      });

      if (!response.ok) {
        if (response.status === 404) {
          console.log(
            `❌ Account not found: ${gameName}#${tagLine} in ${regionalRouting}`,
          );
          return null;
        }
        throw new Error(`Riot API error: ${response.status}`);
      }

      const data = (await response.json()) as {
        puuid: string;
        gameName: string;
        tagLine: string;
      };
      console.log(
        `✅ Account found: ${gameName}#${tagLine} - PUUID: ${data.puuid}`,
      );
      return data;
    } catch (error) {
      console.error('Error fetching account by Riot ID:', error);
      return null;
    }
  }

  /**
   * Fetch summoner by PUUID
   */
  private async fetchSummonerByPuuid(
    puuid: string,
    region: string,
  ): Promise<RiotSummoner | null> {
    const platform = this.getPlatform(region);
    const url = `https://${platform}.api.riotgames.com/lol/summoner/v4/summoners/by-puuid/${encodeURIComponent(puuid)}`;

    try {
      const response = await fetch(url, {
        headers: {
          'X-Riot-Token': this.riotApiKey,
        },
      });

      if (!response.ok) {
        if (response.status === 404) {
          return null;
        }
        throw new Error(`Riot API error: ${response.status}`);
      }

      return (await response.json()) as RiotSummoner;
    } catch (error) {
      console.error('Error fetching summoner by PUUID:', error);
      return null;
    }
  }

  /**
   * Fetch active game for a summoner by PUUID (new API v5)
   */
  private async fetchActiveGame(
    puuid: string,
    region: string,
  ): Promise<RiotActiveGame | null> {
    const platform = this.getPlatform(region);
    const url = `https://${platform}.api.riotgames.com/lol/spectator/v5/active-games/by-summoner/${encodeURIComponent(puuid)}`;

    try {
      const response = await fetch(url, {
        headers: {
          'X-Riot-Token': this.riotApiKey,
        },
      });

      if (!response.ok) {
        if (response.status === 404) {
          console.log(`❌ No active game found for PUUID: ${puuid}`);
          return null;
        }
        throw new Error(`Riot API error: ${response.status}`);
      }

      const data = (await response.json()) as RiotActiveGame;
      console.log(`✅ Active game found for PUUID: ${puuid}`);
      return data;
    } catch (error) {
      console.error('Error fetching active game:', error);
      return null;
    }
  }

  /**
   * Check if participant has Flash
   */
  private hasFlash(participant: RiotParticipant): boolean {
    return (
      participant.spell1Id === this.FLASH_SPELL_ID ||
      participant.spell2Id === this.FLASH_SPELL_ID
    );
  }

  /**
   * Get champion icon URL from Data Dragon
   */
  private async getChampionIconUrl(championId: number): Promise<string> {
    try {
      // Get latest version
      const versionsResponse = await fetch(
        'https://ddragon.leagueoflegends.com/api/versions.json',
      );
      const versions = (await versionsResponse.json()) as string[];
      const latestVersion = versions[0];

      // Get all champions data
      const championsResponse = await fetch(
        `https://ddragon.leagueoflegends.com/cdn/${latestVersion}/data/en_US/champion.json`,
      );
      const championsData = (await championsResponse.json()) as {
        data: Record<
          string,
          { key: string; id: string; name: string; title: string }
        >;
      };

      // Find champion by ID
      const champion = Object.values(championsData.data).find(
        (champ) => parseInt(champ.key, 10) === championId,
      );

      if (!champion) {
        return '';
      }

      // Return champion icon URL
      return `https://ddragon.leagueoflegends.com/cdn/${latestVersion}/img/champion/${champion.id}.png`;
    } catch (error) {
      console.error('Error fetching champion icon:', error);
      return '';
    }
  }

  /**
   * Get live game data for a summoner
   * Supports both formats:
   * - "GameName#TAG" (new Riot ID format)
   * - "GameName" (will try without tag)
   */
  async getLiveGameData(
    summonerName: string,
    region: string,
  ): Promise<FetchLiveGameResponse> {
    if (!this.riotApiKey) {
      throw new HttpException(
        'Riot API key not configured',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    if (!summonerName || !region) {
      throw new HttpException(
        'Missing summonerName or region',
        HttpStatus.BAD_REQUEST,
      );
    }

    // Parse Riot ID (gameName#tagLine)
    const parts = summonerName.split('#');
    const gameName = parts[0].trim();
    const tagLine = parts[1]?.trim() || 'EUW'; // Default tagline if not provided

    console.log(`🔍 Searching for: ${gameName}#${tagLine} in region ${region}`);

    // Step 1: Fetch account by Riot ID to get PUUID
    const account = await this.fetchAccountByRiotId(gameName, tagLine, region);

    if (!account) {
      return {
        success: false,
        error: `Summoner not found: ${gameName}#${tagLine}`,
      };
    }

    // Step 2: Fetch summoner by PUUID
    const summoner = await this.fetchSummonerByPuuid(account.puuid, region);

    if (!summoner) {
      return {
        success: false,
        error: 'Summoner data not found',
      };
    }

    // Step 3: Fetch active game by PUUID (using v5 API)
    const activeGame = await this.fetchActiveGame(account.puuid, region);

    if (!activeGame) {
      return {
        success: false,
        error: 'No active game found',
      };
    }

    // Find player's team using PUUID
    const playerParticipant = activeGame.participants.find(
      (p) => p.puuid === account.puuid,
    );

    if (!playerParticipant) {
      return {
        success: false,
        error: 'Player not found in game',
      };
    }

    const playerTeamId = playerParticipant.teamId;

    // Split participants into allies and enemies
    const allies = activeGame.participants.filter(
      (p) => p.teamId === playerTeamId,
    );
    const enemies = activeGame.participants.filter(
      (p) => p.teamId !== playerTeamId,
    );

    // Filter only enemies with Flash
    const enemiesWithFlash = enemies.filter((p) => this.hasFlash(p));

    // Add champion icons
    const enemiesWithData = await Promise.all(
      enemiesWithFlash.map(async (enemy) => {
        const championIconUrl = await this.getChampionIconUrl(enemy.championId);
        return {
          ...enemy,
          championIconUrl,
        };
      }),
    );

    const response: FetchLiveGameResponse = {
      success: true,
      data: {
        allies,
        enemies: enemiesWithData,
        gameId: activeGame.gameId,
        gameStartTime: activeGame.gameStartTime,
        gameLength: activeGame.gameLength,
      },
    };

    console.log('response', response);

    return response;
  }
}
