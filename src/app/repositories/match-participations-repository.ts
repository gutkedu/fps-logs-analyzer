import { MatchParticipation } from '../entities/match-participation';

export interface MatchParticipationsRepository {
  create(matchParticipation: MatchParticipation): Promise<void>;
  createMany(matchParticipations: MatchParticipation[]): Promise<void>;
  findById(participationId: string): Promise<MatchParticipation | null>;
  findByMatchId(matchId: string): Promise<MatchParticipation[]>;
  findByPlayerId(playerId: string): Promise<MatchParticipation[]>;
  findByMatchIdAndPlayerId(
    matchId: string,
    playerId: string,
  ): Promise<MatchParticipation | null>;
  findMany(): Promise<MatchParticipation[]>;
  update(matchParticipation: MatchParticipation): Promise<void>;
}
