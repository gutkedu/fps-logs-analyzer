import { Injectable } from '@nestjs/common';
import { PrismaMatchMapper } from '../mappers/prisma-match-mapper';
import { MatchesRepository } from '@/app/repositories/matches-repository';
import { Match } from '@/app/entities/match';
import { PrismaService } from '../prisma.service';

@Injectable()
export class PrismaMatchesRepository implements MatchesRepository {
  constructor(private prisma: PrismaService) {}

  async create(match: Match): Promise<void> {
    const raw = PrismaMatchMapper.toPrisma(match);

    await this.prisma.match.create({
      data: raw,
    });
  }

  async createMany(matches: Match[]): Promise<void> {
    const data = matches.map((match) => PrismaMatchMapper.toPrisma(match));

    await this.prisma.match.createMany({
      data,
    });
  }

  async findById(matchId: string): Promise<Match | null> {
    const match = await this.prisma.match.findUnique({
      where: {
        id: matchId,
      },
    });

    if (!match) {
      return null;
    }

    return PrismaMatchMapper.toDomain(match);
  }

  async findByExternalId(externalId: string): Promise<Match | null> {
    const match = await this.prisma.match.findFirst({
      where: {
        externalId,
      },
    });

    if (!match) {
      return null;
    }

    return PrismaMatchMapper.toDomain(match);
  }

  async findMany(): Promise<Match[]> {
    const matches = await this.prisma.match.findMany({
      orderBy: {
        startedAt: 'desc',
      },
    });

    return matches.map((match) => PrismaMatchMapper.toDomain(match));
  }

  async update(match: Match): Promise<void> {
    const raw = PrismaMatchMapper.toPrisma(match);

    await this.prisma.match.update({
      where: {
        id: raw.id,
      },
      data: raw,
    });
  }
}
