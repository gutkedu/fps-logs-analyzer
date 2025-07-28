import { describe, it, expect, beforeEach } from 'vitest';
import { GenerateGlobalPlayerRankingUseCase } from './generate-global-player-ranking.use-case';
import { InMemoryFragsRepository } from '../../../test/repositories/in-memory-frags-repository';
import { InMemoryMatchParticipationsRepository } from '../../../test/repositories/in-memory-match-participations-repository';
import { InMemoryPlayersRepository } from '../../../test/repositories/in-memory-players-repository';
import { Player } from '../entities/player';
import { MatchParticipation } from '../entities/match-participation';

describe('GenerateGlobalPlayerRankingUseCase', () => {
  let fragsRepository: InMemoryFragsRepository;
  let matchParticipationsRepository: InMemoryMatchParticipationsRepository;
  let playersRepository: InMemoryPlayersRepository;
  let useCase: GenerateGlobalPlayerRankingUseCase;

  beforeEach(() => {
    fragsRepository = new InMemoryFragsRepository();
    matchParticipationsRepository = new InMemoryMatchParticipationsRepository();
    playersRepository = new InMemoryPlayersRepository();
    useCase = new GenerateGlobalPlayerRankingUseCase(
      fragsRepository,
      matchParticipationsRepository,
      playersRepository,
    );
  });

  it('should return global ranking for all players', async () => {
    const player1 = await playersRepository.create(
      new Player({ name: 'Alice' }),
    );
    const player2 = await playersRepository.create(new Player({ name: 'Bob' }));

    await matchParticipationsRepository.create(
      new MatchParticipation({
        matchId: 'm1',
        playerId: player1.id,
        team: 'A',
        frags: 5,
        deaths: 2,
        score: 0,
        longestStreak: 0,
        currentStreak: 0,
        awards: [],
        joinedAt: new Date(),
      }),
    );
    await matchParticipationsRepository.create(
      new MatchParticipation({
        matchId: 'm2',
        playerId: player1.id,
        team: 'A',
        frags: 3,
        deaths: 1,
        score: 0,
        longestStreak: 0,
        currentStreak: 0,
        awards: [],
        joinedAt: new Date(),
      }),
    );
    await matchParticipationsRepository.create(
      new MatchParticipation({
        matchId: 'm1',
        playerId: player2.id,
        team: 'B',
        frags: 2,
        deaths: 4,
        score: 0,
        longestStreak: 0,
        currentStreak: 0,
        awards: [],
        joinedAt: new Date(),
      }),
    );

    const result = await useCase.execute();
    expect(result.ranking.length).toBe(2);
    const alice = result.ranking.find((r) => r.playerName === 'Alice');
    const bob = result.ranking.find((r) => r.playerName === 'Bob');
    expect(alice?.frags).toBe(8); // 5 + 3
    expect(alice?.deaths).toBe(3); // 2 + 1
    expect(alice?.matches).toBe(2);
    expect(bob?.frags).toBe(2);
    expect(bob?.deaths).toBe(4);
    expect(bob?.matches).toBe(1);
  });

  it('should return empty ranking if no participations', async () => {
    const result = await useCase.execute();
    expect(result.ranking.length).toBe(0);
  });
});
