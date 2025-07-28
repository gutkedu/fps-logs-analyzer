import { describe, it, expect, beforeEach } from 'vitest';
import { GenerateMatchRankingUseCase } from './generate-match-ranking.use-case';
import { InMemoryFragsRepository } from '../../../test/repositories/in-memory-frags-repository';
import { InMemoryMatchParticipationsRepository } from '../../../test/repositories/in-memory-match-participations-repository';
import { InMemoryPlayersRepository } from '../../../test/repositories/in-memory-players-repository';
import { InMemoryMatchesRepository } from '../../../test/repositories/in-memory-matches-repository';
import { Frag } from '../entities/frag';
import { Match } from '../entities/match';
import { MatchParticipation } from '../entities/match-participation';
import { Player } from '../entities/player';
import { WeaponType } from '../entities/enums/weapon-type';

describe('GenerateMatchRankingUseCase', () => {
  let fragsRepository: InMemoryFragsRepository;
  let matchParticipationsRepository: InMemoryMatchParticipationsRepository;
  let playersRepository: InMemoryPlayersRepository;
  let matchesRepository: InMemoryMatchesRepository;
  let useCase: GenerateMatchRankingUseCase;

  beforeEach(() => {
    fragsRepository = new InMemoryFragsRepository();
    matchParticipationsRepository = new InMemoryMatchParticipationsRepository();
    playersRepository = new InMemoryPlayersRepository();
    matchesRepository = new InMemoryMatchesRepository();
    useCase = new GenerateMatchRankingUseCase(
      fragsRepository,
      matchParticipationsRepository,
      playersRepository,
      matchesRepository,
    );
  });

  it('should return ranking for a match', async () => {
    // Setup match
    const match = new Match({ externalId: 'match1', startedAt: new Date() });
    await matchesRepository.create(match);

    // Setup players
    const player1 = await playersRepository.create(
      new Player({ name: 'Alice' }),
    );
    const player2 = await playersRepository.create(new Player({ name: 'Bob' }));

    // Setup participations
    await matchParticipationsRepository.create(
      new MatchParticipation({
        matchId: match.id,
        playerId: player1.id,
        team: 'A',
        frags: 0,
        deaths: 0,
        score: 0,
        longestStreak: 0,
        currentStreak: 0,
        awards: [],
        joinedAt: new Date(),
      }),
    );
    await matchParticipationsRepository.create(
      new MatchParticipation({
        matchId: match.id,
        playerId: player2.id,
        team: 'B',
        frags: 0,
        deaths: 0,
        score: 0,
        longestStreak: 0,
        currentStreak: 0,
        awards: [],
        joinedAt: new Date(),
      }),
    );

    // Setup frags
    await fragsRepository.create(
      new Frag({
        matchId: match.id,
        killerId: player1.id,
        victimId: player2.id,
        weapon: WeaponType.M16,
      }),
    );
    await fragsRepository.create(
      new Frag({
        matchId: match.id,
        killerId: player1.id,
        victimId: player2.id,
        weapon: WeaponType.AK47,
      }),
    );
    await fragsRepository.create(
      new Frag({
        matchId: match.id,
        killerId: player2.id,
        victimId: player1.id,
        weapon: WeaponType.M16,
      }),
    );

    const result = await useCase.execute(match.externalId);
    expect(result.matchId).toBe(match.id);
    expect(result.ranking.length).toBe(2);
    const alice = result.ranking.find((r) => r.playerName === 'Alice');
    const bob = result.ranking.find((r) => r.playerName === 'Bob');
    expect(alice?.frags).toBe(2);
    expect(alice?.deaths).toBe(1);
    expect(bob?.frags).toBe(1);
    expect(bob?.deaths).toBe(2);
  });

  it('should throw if match does not exist', async () => {
    await expect(useCase.execute('notfound')).rejects.toThrow(
      'Match not found',
    );
  });

  it('should return empty ranking if no participations', async () => {
    const match = new Match({ externalId: 'empty', startedAt: new Date() });
    await matchesRepository.create(match);
    const result = await useCase.execute(match.externalId);
    expect(result.ranking.length).toBe(0);
  });
});
