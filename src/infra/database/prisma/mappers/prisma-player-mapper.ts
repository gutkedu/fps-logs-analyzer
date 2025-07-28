import { Player } from '@/app/entities/player';
import { Player as RawPlayer } from '@prisma/client';

export class PrismaPlayerMapper {
  static toPrisma(player: Player) {
    return {
      id: player.id,
      name: player.name,
      createdAt: player.createdAt,
    };
  }

  static toDomain(raw: RawPlayer): Player {
    return new Player(
      {
        name: raw.name,
        createdAt: raw.createdAt,
      },
      raw.id,
    );
  }
}
