/* eslint-disable @typescript-eslint/require-await */
import { Match } from '@/app/entities/match';
import { MatchesRepository } from '@/app/repositories/matches-repository';

export class InMemoryMatchesRepository implements MatchesRepository {
  public matches: Match[] = [];

  async create(match: Match): Promise<void> {
    this.matches.push(match);
  }

  async createMany(matches: Match[]): Promise<void> {
    this.matches.push(...matches);
  }

  async findById(matchId: string): Promise<Match | null> {
    const match = this.matches.find((item) => item.id === matchId);

    if (!match) {
      return null;
    }

    return match;
  }

  async findByExternalId(externalId: string): Promise<Match | null> {
    const match = this.matches.find((item) => item.externalId === externalId);

    if (!match) {
      return null;
    }

    return match;
  }

  async findMany(): Promise<Match[]> {
    return this.matches;
  }

  async update(match: Match): Promise<void> {
    const matchIndex = this.matches.findIndex((item) => item.id === match.id);

    if (matchIndex >= 0) {
      this.matches[matchIndex] = match;
    }
  }
}
