import { Injectable, Logger } from '@nestjs/common';
import { FragsRepository } from '../repositories/frags-repository';
import { MatchParticipationsRepository } from '../repositories/match-participations-repository';
import { PlayersRepository } from '../repositories/players-repository';

export interface GlobalPlayerRankingEntry {
  playerId: string;
  playerName: string;
  frags: number;
  deaths: number;
  matches: number;
}

export interface GlobalPlayerRankingResponse {
  ranking: GlobalPlayerRankingEntry[];
}

@Injectable()
export class GenerateGlobalPlayerRankingUseCase {
  private readonly logger = new Logger(GenerateGlobalPlayerRankingUseCase.name);

  constructor(
    private readonly fragsRepository: FragsRepository,
    private readonly matchParticipationsRepository: MatchParticipationsRepository,
    private readonly playersRepository: PlayersRepository,
  ) {}

  async execute(): Promise<GlobalPlayerRankingResponse> {
    const participations = await this.matchParticipationsRepository.findMany();
    const rankingMap = new Map<string, GlobalPlayerRankingEntry>();

    for (const participation of participations) {
      let entry = rankingMap.get(participation.playerId);
      if (!entry) {
        const player = await this.playersRepository.findById(
          participation.playerId,
        );
        if (!player) {
          continue;
        }
        entry = {
          playerId: participation.playerId,
          playerName: player.name,
          frags: 0,
          deaths: 0,
          matches: 0,
        };
        rankingMap.set(participation.playerId, entry);
      }
      entry.frags += participation.frags;
      entry.deaths += participation.deaths;
      entry.matches += 1;
    }

    const ranking = Array.from(rankingMap.values())
      .sort((a, b) => b.frags - a.frags)
      .slice(0, 100); // limit to top 100

    return { ranking };
  }
}
