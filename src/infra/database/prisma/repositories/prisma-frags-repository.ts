import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Frag } from '@/app/entities/frag';
import { FragsRepository } from '@/app/repositories/frags-repository';
import { PrismaFragMapper } from '../mappers/prisma-frag-mapper';

@Injectable()
export class PrismaFragsRepository implements FragsRepository {
  constructor(private prisma: PrismaService) {}

  async create(frag: Frag): Promise<void> {
    const raw = PrismaFragMapper.toPrisma(frag);

    await this.prisma.frag.create({
      data: raw,
    });
  }

  async createMany(frags: Frag[]): Promise<void> {
    const data = frags.map((frag) => PrismaFragMapper.toPrisma(frag));

    await this.prisma.frag.createMany({
      data,
    });
  }

  async findById(fragId: string): Promise<Frag | null> {
    const frag = await this.prisma.frag.findUnique({
      where: {
        id: fragId,
      },
    });

    if (!frag) {
      return null;
    }

    return PrismaFragMapper.toDomain(frag);
  }

  async findManyByMatchId(matchId: string): Promise<Frag[]> {
    const frags = await this.prisma.frag.findMany({
      where: {
        matchId,
      },
      orderBy: {
        killedAt: 'asc',
      },
    });

    return frags.map((frag) => PrismaFragMapper.toDomain(frag));
  }

  async findManyByPlayerId(playerId: string): Promise<Frag[]> {
    const frags = await this.prisma.frag.findMany({
      where: {
        killerId: playerId,
      },
      orderBy: {
        killedAt: 'desc',
      },
    });

    return frags.map((frag) => PrismaFragMapper.toDomain(frag));
  }

  async findManyByVictimId(victimId: string): Promise<Frag[]> {
    const frags = await this.prisma.frag.findMany({
      where: {
        victimId,
      },
      orderBy: {
        killedAt: 'desc',
      },
    });

    return frags.map((frag) => PrismaFragMapper.toDomain(frag));
  }

  async findMany(): Promise<Frag[]> {
    const frags = await this.prisma.frag.findMany({
      orderBy: {
        killedAt: 'desc',
      },
    });

    return frags.map((frag) => PrismaFragMapper.toDomain(frag));
  }
}
