import { Controller, Get } from '@nestjs/common';
import { GenerateGlobalPlayerRankingUseCase } from '@/app/use-cases/generate-global-player-ranking.use-case';

@Controller('players')
export class GlobalPlayerRankingController {
  constructor(
    private readonly generateGlobalPlayerRankingUseCase: GenerateGlobalPlayerRankingUseCase,
  ) {}

  @Get('ranking')
  async getGlobalRanking() {
    return await this.generateGlobalPlayerRankingUseCase.execute();
  }
}
