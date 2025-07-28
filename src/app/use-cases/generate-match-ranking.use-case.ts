import { Injectable, Logger } from '@nestjs/common';
import { FragsRepository } from '../repositories/frags-repository';
import { MatchParticipationsRepository } from '../repositories/match-participations-repository';
import { PlayersRepository } from '../repositories/players-repository';
import { MatchesRepository } from '../repositories/matches-repository';

export interface MatchRankingEntry {
  playerId: string;
  playerName: string;
  frags: number;
  deaths: number;
}

export interface GenerateMatchRankingResponse {
  matchId: string;
  externalId?: string;
  ranking: MatchRankingEntry[];
}

@Injectable()
export class GenerateMatchRankingUseCase {
  private readonly logger = new Logger(GenerateMatchRankingUseCase.name);

  constructor(
    private readonly fragsRepository: FragsRepository,
    private readonly matchParticipationsRepository: MatchParticipationsRepository,
    private readonly playersRepository: PlayersRepository,
    private readonly matchesRepository: MatchesRepository,
  ) {}

  async execute(externalId: string): Promise<GenerateMatchRankingResponse> {
    const match = await this.matchesRepository.findByExternalId(externalId);

    if (!match) {
      throw new Error('Match not found');
    }

    const frags = await this.fragsRepository.findManyWithoutWorld(match.id);

    const participations =
      await this.matchParticipationsRepository.findByMatchId(match.id);

    const rankingMap = new Map<string, MatchRankingEntry>();

    for (const participation of participations) {
      const player = await this.playersRepository.findById(
        participation.playerId,
      );
      if (!player) continue;
      rankingMap.set(participation.playerId, {
        playerId: participation.playerId,
        playerName: player.name,
        frags: 0,
        deaths: 0,
      });
    }

    for (const frag of frags) {
      if (frag.killerId && rankingMap.has(frag.killerId)) {
        rankingMap.get(frag.killerId)!.frags++;
      }
      if (rankingMap.has(frag.victimId)) {
        rankingMap.get(frag.victimId)!.deaths++;
      }
    }

    // Sort by frags descending, limit to 20
    const ranking = Array.from(rankingMap.values())
      .sort((a, b) => b.frags - a.frags)
      .slice(0, 20);

    return {
      matchId: match.id,
      externalId: match.externalId,
      ranking,
    };
  }
}
