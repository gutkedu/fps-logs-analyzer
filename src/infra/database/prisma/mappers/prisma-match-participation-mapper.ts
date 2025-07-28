import { AwardType } from '@/app/entities/enums/award-type';
import { MatchParticipation } from '@/app/entities/match-participation';
import { MatchParticipation as PrismaMatchParticipation } from '@prisma/client';

export class PrismaMatchParticipationMapper {
  static toPrisma(matchParticipation: MatchParticipation) {
    return {
      id: matchParticipation.id,
      matchId: matchParticipation.matchId,
      playerId: matchParticipation.playerId,
      team: matchParticipation.team,
      frags: matchParticipation.frags,
      deaths: matchParticipation.deaths,
      score: matchParticipation.score,
      longestStreak: matchParticipation.longestStreak,
      currentStreak: matchParticipation.currentStreak,
      awards: JSON.stringify(matchParticipation.awards),
      joinedAt: matchParticipation.joinedAt,
    };
  }

  static toDomain(raw: PrismaMatchParticipation): MatchParticipation {
    return new MatchParticipation(
      {
        matchId: raw.matchId,
        playerId: raw.playerId,
        team: raw.team,
        frags: raw.frags,
        deaths: raw.deaths,
        score: raw.score,
        longestStreak: raw.longestStreak,
        currentStreak: raw.currentStreak,
        awards: (
          JSON.parse(raw.awards) as Array<{ type: string; value: number }>
        ).map((award) => ({
          type: award.type as AwardType,
          value: award.value,
        })),
        joinedAt: raw.joinedAt,
      },
      raw.id,
    );
  }
}
