import { Match } from '../entities/match';

export interface MatchesRepository {
  create(match: Match): Promise<void>;
  createMany(matches: Match[]): Promise<void>;
  findById(matchId: string): Promise<Match | null>;
  findByExternalId(externalId: string): Promise<Match | null>;
  findMany(): Promise<Match[]>;
  update(match: Match): Promise<void>;
}
