import { Injectable } from '@nestjs/common';
import { MatchParticipation } from '@/app/entities/match-participation';
import { MatchParticipationsRepository } from '@/app/repositories/match-participations-repository';
import { PrismaMatchParticipationMapper } from '../mappers/prisma-match-participation-mapper';
import { PrismaService } from '../prisma.service';

@Injectable()
export class PrismaMatchParticipationsRepository
  implements MatchParticipationsRepository
{
  constructor(private prisma: PrismaService) {}
  async update(matchParticipation: MatchParticipation): Promise<void> {
    const raw = PrismaMatchParticipationMapper.toPrisma(matchParticipation);

    await this.prisma.matchParticipation.update({
      where: {
        id: raw.id,
      },
      data: raw,
    });
  }

  async findMany(): Promise<MatchParticipation[]> {
    const matchParticipations = await this.prisma.matchParticipation.findMany();
    return matchParticipations.map((mp) =>
      PrismaMatchParticipationMapper.toDomain(mp),
    );
  }

  async create(matchParticipation: MatchParticipation): Promise<void> {
    const raw = PrismaMatchParticipationMapper.toPrisma(matchParticipation);

    await this.prisma.matchParticipation.create({
      data: raw,
    });
  }

  async createMany(matchParticipations: MatchParticipation[]): Promise<void> {
    const data = matchParticipations.map((mp) =>
      PrismaMatchParticipationMapper.toPrisma(mp),
    );

    await this.prisma.matchParticipation.createMany({
      data,
    });
  }

  async findById(
    matchParticipationId: string,
  ): Promise<MatchParticipation | null> {
    const matchParticipation = await this.prisma.matchParticipation.findUnique({
      where: {
        id: matchParticipationId,
      },
    });

    if (!matchParticipation) {
      return null;
    }

    return PrismaMatchParticipationMapper.toDomain(matchParticipation);
  }

  async findByMatchIdAndPlayerId(
    matchId: string,
    playerId: string,
  ): Promise<MatchParticipation | null> {
    const matchParticipation = await this.prisma.matchParticipation.findUnique({
      where: {
        matchId_playerId: {
          matchId,
          playerId,
        },
      },
    });

    if (!matchParticipation) {
      return null;
    }

    return PrismaMatchParticipationMapper.toDomain(matchParticipation);
  }

  async findByMatchId(matchId: string): Promise<MatchParticipation[]> {
    const matchParticipations = await this.prisma.matchParticipation.findMany({
      where: {
        matchId,
      },
      orderBy: {
        score: 'desc',
      },
    });

    return matchParticipations.map((mp) =>
      PrismaMatchParticipationMapper.toDomain(mp),
    );
  }

  async findByPlayerId(playerId: string): Promise<MatchParticipation[]> {
    const matchParticipations = await this.prisma.matchParticipation.findMany({
      where: {
        playerId,
      },
      orderBy: {
        joinedAt: 'desc',
      },
    });

    return matchParticipations.map((mp) =>
      PrismaMatchParticipationMapper.toDomain(mp),
    );
  }

  async save(matchParticipation: MatchParticipation): Promise<void> {
    const raw = PrismaMatchParticipationMapper.toPrisma(matchParticipation);

    await this.prisma.matchParticipation.update({
      where: {
        id: raw.id,
      },
      data: raw,
    });
  }
}
