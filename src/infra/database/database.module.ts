import { Module } from '@nestjs/common';
import { PrismaMatchesRepository } from './prisma/repositories/prisma-matches-repository';
import { PrismaPlayersRepository } from './prisma/repositories/prisma-players-repository';
import { PrismaFragsRepository } from './prisma/repositories/prisma-frags-repository';
import { PrismaMatchParticipationsRepository } from './prisma/repositories/prisma-match-participations-repository';
import { PrismaService } from './prisma/prisma.service';

export const REPOSITORIES = {
  MATCHES_REPOSITORY: 'app.MatchesRepository',
  PLAYERS_REPOSITORY: 'app.PlayersRepository',
  FRAGS_REPOSITORY: 'app.FragsRepository',
  MATCH_PARTICIPATIONS_REPOSITORY: 'app.MatchParticipationsRepository',
};

@Module({
  providers: [
    PrismaService,
    {
      provide: REPOSITORIES.MATCHES_REPOSITORY,
      useClass: PrismaMatchesRepository,
    },
    {
      provide: REPOSITORIES.PLAYERS_REPOSITORY,
      useClass: PrismaPlayersRepository,
    },
    {
      provide: REPOSITORIES.FRAGS_REPOSITORY,
      useClass: PrismaFragsRepository,
    },
    {
      provide: REPOSITORIES.MATCH_PARTICIPATIONS_REPOSITORY,
      useClass: PrismaMatchParticipationsRepository,
    },
  ],
  exports: [
    REPOSITORIES.MATCHES_REPOSITORY,
    REPOSITORIES.PLAYERS_REPOSITORY,
    REPOSITORIES.FRAGS_REPOSITORY,
    REPOSITORIES.MATCH_PARTICIPATIONS_REPOSITORY,
  ],
})
export class DatabaseModule {}
