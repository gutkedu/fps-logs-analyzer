import { Match } from '@/app/entities/match';
import { Match as PrismaMatch } from '@prisma/client';

export class PrismaMatchMapper {
  static toPrisma(match: Match) {
    return {
      id: match.id,
      externalId: match.externalId,
      startedAt: match.startedAt,
      endedAt: match.endedAt,
      createdAt: match.createdAt,
    };
  }

  static toDomain(raw: PrismaMatch): Match {
    return new Match(
      {
        externalId: raw.externalId,
        startedAt: raw.startedAt,
        endedAt: raw.endedAt,
        createdAt: raw.createdAt,
      },
      raw.id,
    );
  }
}
