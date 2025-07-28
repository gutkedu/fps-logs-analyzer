/* eslint-disable @typescript-eslint/require-await */
import { MatchParticipation } from '@/app/entities/match-participation';
import { MatchParticipationsRepository } from '@/app/repositories/match-participations-repository';

export class InMemoryMatchParticipationsRepository
  implements MatchParticipationsRepository
{
  public participations: MatchParticipation[] = [];

  async create(matchParticipation: MatchParticipation): Promise<void> {
    this.participations.push(matchParticipation);
  }

  async createMany(matchParticipations: MatchParticipation[]): Promise<void> {
    this.participations.push(...matchParticipations);
  }

  async findById(participationId: string): Promise<MatchParticipation | null> {
    const participation = this.participations.find(
      (item) => item.id === participationId,
    );

    if (!participation) {
      return null;
    }

    return participation;
  }

  async findByMatchId(matchId: string): Promise<MatchParticipation[]> {
    return this.participations.filter(
      (participation) => participation.matchId === matchId,
    );
  }

  async findByPlayerId(playerId: string): Promise<MatchParticipation[]> {
    return this.participations.filter(
      (participation) => participation.playerId === playerId,
    );
  }

  async findByMatchIdAndPlayerId(
    matchId: string,
    playerId: string,
  ): Promise<MatchParticipation | null> {
    const participation = this.participations.find(
      (item) => item.matchId === matchId && item.playerId === playerId,
    );

    if (!participation) {
      return null;
    }

    return participation;
  }
}
