import {
  Controller,
  Get,
  Param,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { GenerateMatchRankingUseCase } from '@/app/use-cases/generate-match-ranking.use-case';

@Controller('matches')
export class MatchRankingController {
  constructor(
    private readonly generateMatchRankingUseCase: GenerateMatchRankingUseCase,
  ) {}

  @Get(':externalId/ranking')
  async getMatchRanking(@Param('externalId') externalId: string) {
    try {
      const ranking =
        await this.generateMatchRankingUseCase.execute(externalId);
      return ranking;
    } catch {
      throw new HttpException(
        'Match not found or error generating ranking',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
