import { Module } from '@nestjs/common';
import { LogWorkerService } from './log-worker.service';
import { MatchWorkerService } from './match-worker.service';
import { DatabaseModule, REPOSITORIES } from '../database/database.module';
import { ProcessLogFileUseCase } from '../../app/use-cases/process-log-file.use-case';
import { ProcessMatchUseCase } from '../../app/use-cases/process-match.use-case';
import { MatchesRepository } from '@/app/repositories/matches-repository';
import { PlayersRepository } from '@/app/repositories/players-repository';
import { FragsRepository } from '@/app/repositories/frags-repository';
import { MatchParticipationsRepository } from '@/app/repositories/match-participations-repository';

@Module({
  imports: [DatabaseModule],
  providers: [
    LogWorkerService,
    MatchWorkerService,
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
  ],
})
export class WorkersModule {}
