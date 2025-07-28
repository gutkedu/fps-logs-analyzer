import { Module } from '@nestjs/common';
import { HealthController } from './controllers/health.controller';
import { LogsController } from './controllers/logs.controller';
import { MatchRankingController } from './controllers/match-ranking.controller';
import { GlobalPlayerRankingController } from './controllers/global-player-ranking.controller';

import { UseCasesModule } from '@/app/use-cases/use-cases.module';

@Module({
  imports: [UseCasesModule],
  controllers: [
    HealthController,
    LogsController,
    MatchRankingController,
    GlobalPlayerRankingController,
  ],
})
export class HttpModule {}
