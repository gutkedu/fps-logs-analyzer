import { WeaponType } from '@/app/entities/enums/weapon-type';
import { Frag } from '@/app/entities/frag';
import { Frag as PrismaFrag } from '@prisma/client';

export class PrismaFragMapper {
  static toPrisma(frag: Frag) {
    return {
      id: frag.id,
      matchId: frag.matchId,
      killerId: frag.killerId,
      victimId: frag.victimId,
      weapon: frag.weapon,
      killedAt: frag.killedAt,
      isFriendlyFire: frag.isFriendlyFire,
    };
  }

  static toDomain(raw: PrismaFrag): Frag {
    return new Frag(
      {
        matchId: raw.matchId,
        killerId: raw.killerId,
        victimId: raw.victimId,
        weapon: raw.weapon as WeaponType,
        killedAt: raw.killedAt,
        isFriendlyFire: raw.isFriendlyFire,
      },
      raw.id,
    );
  }
}
