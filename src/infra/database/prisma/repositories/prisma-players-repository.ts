import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { PrismaPlayerMapper } from '../mappers/prisma-player-mapper';
import { PlayersRepository } from '@/app/repositories/players-repository';
import { Player } from '@/app/entities/player';

@Injectable()
export class PrismaPlayersRepository implements PlayersRepository {
  constructor(private prisma: PrismaService) {}

  async create(player: Player): Promise<Player> {
    const raw = PrismaPlayerMapper.toPrisma(player);
    try {
      const created = await this.prisma.player.create({
        data: raw,
      });
      return PrismaPlayerMapper.toDomain(created);
    } catch (error) {
      // Handle unique constraint error (player already exists)
      if (
        typeof error === 'object' &&
        error !== null &&
        'code' in error &&
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        error.code === 'P2002'
      ) {
        const existing = await this.findByName(player.name);
        if (existing) {
          return existing;
        }
      }
      throw error;
    }
  }

  async createMany(players: Player[]): Promise<void> {
    const data = players.map((player) => PrismaPlayerMapper.toPrisma(player));

    await this.prisma.player.createMany({
      data,
    });
  }

  async findById(playerId: string): Promise<Player | null> {
    const player = await this.prisma.player.findUnique({
      where: {
        id: playerId,
      },
    });

    if (!player) {
      return null;
    }

    return PrismaPlayerMapper.toDomain(player);
  }

  async findByName(name: string): Promise<Player | null> {
    const player = await this.prisma.player.findUnique({
      where: {
        name,
      },
    });

    if (!player) {
      return null;
    }

    return PrismaPlayerMapper.toDomain(player);
  }

  async findMany(): Promise<Player[]> {
    const players = await this.prisma.player.findMany();

    return players.map((player) => PrismaPlayerMapper.toDomain(player));
  }
}
