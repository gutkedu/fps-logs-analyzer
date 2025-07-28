import { Module } from '@nestjs/common';
import { LogWorkerService } from './log-worker.service';
import { MatchWorkerService } from './match-worker.service';
import { DatabaseModule, REPOSITORIES } from '../database/database.module';
import { UseCasesModule } from '@/app/use-cases/use-cases.module';
import { MatchesRepository } from '@/app/repositories/matches-repository';
import { PlayersRepository } from '@/app/repositories/players-repository';
import { FragsRepository } from '@/app/repositories/frags-repository';
import { MatchParticipationsRepository } from '@/app/repositories/match-participations-repository';

@Module({
  imports: [DatabaseModule, UseCasesModule],
  providers: [LogWorkerService, MatchWorkerService],
})
export class WorkersModule {}
