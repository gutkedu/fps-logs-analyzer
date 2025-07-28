import { Module } from '@nestjs/common';
import { DatabaseModule } from '@/infra/database/database.module';
import { ProcessLogFileUseCase } from '@/app/use-cases/process-log-file.use-case';
import { ProcessMatchUseCase } from '@/app/use-cases/process-match.use-case';
import { GenerateMatchRankingUseCase } from '@/app/use-cases/generate-match-ranking.use-case';
import { MatchesRepository } from '@/app/repositories/matches-repository';
import { PlayersRepository } from '@/app/repositories/players-repository';
import { FragsRepository } from '@/app/repositories/frags-repository';
import { MatchParticipationsRepository } from '@/app/repositories/match-participations-repository';
import { REPOSITORIES } from '@/infra/database/database.module';
import { GenerateGlobalPlayerRankingUseCase } from './generate-global-player-ranking.use-case';

@Module({
  imports: [DatabaseModule],
  providers: [
    ProcessLogFileUseCase,
    {
      provide: ProcessMatchUseCase,
      useFactory: (
        matchesRepository: MatchesRepository,
        playersRepository: PlayersRepository,
        fragsRepository: FragsRepository,
        matchParticipationsRepository: MatchParticipationsRepository,
      ) =>
        new ProcessMatchUseCase(
          matchesRepository,
          playersRepository,
          fragsRepository,
          matchParticipationsRepository,
        ),
      inject: [
        REPOSITORIES.MATCHES_REPOSITORY,
        REPOSITORIES.PLAYERS_REPOSITORY,
        REPOSITORIES.FRAGS_REPOSITORY,
        REPOSITORIES.MATCH_PARTICIPATIONS_REPOSITORY,
      ],
    },
    {
      provide: GenerateMatchRankingUseCase,
      useFactory: (
        fragsRepository: FragsRepository,
        matchParticipationsRepository: MatchParticipationsRepository,
        playersRepository: PlayersRepository,
        matchesRepository: MatchesRepository,
      ) =>
        new GenerateMatchRankingUseCase(
          fragsRepository,
          matchParticipationsRepository,
          playersRepository,
          matchesRepository,
        ),
      inject: [
        REPOSITORIES.FRAGS_REPOSITORY,
        REPOSITORIES.MATCH_PARTICIPATIONS_REPOSITORY,
        REPOSITORIES.PLAYERS_REPOSITORY,
        REPOSITORIES.MATCHES_REPOSITORY,
      ],
    },
    {
      provide: GenerateGlobalPlayerRankingUseCase,
      useFactory: (
        fragsRepository: FragsRepository,
        matchParticipationsRepository: MatchParticipationsRepository,
        playersRepository: PlayersRepository,
      ) =>
        new GenerateGlobalPlayerRankingUseCase(
          fragsRepository,
          matchParticipationsRepository,
          playersRepository,
        ),
      inject: [
        REPOSITORIES.FRAGS_REPOSITORY,
        REPOSITORIES.MATCH_PARTICIPATIONS_REPOSITORY,
        REPOSITORIES.PLAYERS_REPOSITORY,
      ],
    },
    {
      provide: GenerateGlobalPlayerRankingUseCase,
      useFactory: (
        fragsRepository: FragsRepository,
        matchParticipationsRepository: MatchParticipationsRepository,
        playersRepository: PlayersRepository,
      ) =>
        new GenerateGlobalPlayerRankingUseCase(
          fragsRepository,
          matchParticipationsRepository,
          playersRepository,
        ),
      inject: [
        REPOSITORIES.FRAGS_REPOSITORY,
        REPOSITORIES.MATCH_PARTICIPATIONS_REPOSITORY,
        REPOSITORIES.PLAYERS_REPOSITORY,
      ],
    },
  ],
  exports: [
    ProcessLogFileUseCase,
    ProcessMatchUseCase,
    GenerateMatchRankingUseCase,
    GenerateGlobalPlayerRankingUseCase,
  ],
})
export class UseCasesModule {}
