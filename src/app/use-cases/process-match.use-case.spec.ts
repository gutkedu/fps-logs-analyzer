/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { describe, it, expect, beforeEach } from 'vitest';
import { LogActionType } from '../entities/enums/log-action-type';
import { WeaponType } from '../entities/enums/weapon-type';
import { ProcessMatchUseCase } from './process-match.use-case';
import { InMemoryMatchesRepository } from '../../../test/repositories/in-memory-matches-repository';
import { InMemoryPlayersRepository } from '../../../test/repositories/in-memory-players-repository';
import { InMemoryFragsRepository } from '../../../test/repositories/in-memory-frags-repository';
import { InMemoryMatchParticipationsRepository } from '../../../test/repositories/in-memory-match-participations-repository';

describe('ProcessMatchUseCase', () => {
  let matchesRepository: InMemoryMatchesRepository;
  let playersRepository: InMemoryPlayersRepository;
  let fragsRepository: InMemoryFragsRepository;
  let matchParticipationsRepository: InMemoryMatchParticipationsRepository;
  let useCase: ProcessMatchUseCase;

  beforeEach(() => {
    matchesRepository = new InMemoryMatchesRepository();
    playersRepository = new InMemoryPlayersRepository();
    fragsRepository = new InMemoryFragsRepository();
    matchParticipationsRepository = new InMemoryMatchParticipationsRepository();
    useCase = new ProcessMatchUseCase(
      matchesRepository,
      playersRepository,
      fragsRepository,
      matchParticipationsRepository,
    );
  });
  it('should process a match with kill and end events', async () => {
    const matchData = {
      match: {
        externalId: 'm1',
        startedAt: '2025-07-28T12:00:00.000Z',
      },
      events: [
        {
          timestamp: '2025-07-28T12:01:00.000Z',
          action: LogActionType.KILL,
          data: {
            killer: 'Player1',
            victim: 'Player2',
            weapon: WeaponType.M16,
          },
        },
        {
          timestamp: '2025-07-28T12:05:00.000Z',
          action: LogActionType.MATCH_END,
          data: {},
        },
      ],
    };

    await useCase.execute(matchData);

    // Validate match creation
    const match = await matchesRepository.findByExternalId('m1');
    expect(match).toBeDefined();
    expect(match?.externalId).toBe('m1');
    expect(match?.endedAt).toBeInstanceOf(Date);

    // Validate players
    const player1 = await playersRepository.findByName('Player1');
    const player2 = await playersRepository.findByName('Player2');
    expect(player1).toBeDefined();
    expect(player2).toBeDefined();

    // Validate frags
    expect(fragsRepository.frags.length).toBe(1);
    expect(fragsRepository.frags[0].killerId).toBe(player1?.id);
    expect(fragsRepository.frags[0].victimId).toBe(player2?.id);

    // Validate participations
    const participation1 =
      await matchParticipationsRepository.findByMatchIdAndPlayerId(
        match!.id,
        player1!.id,
      );
    const participation2 =
      await matchParticipationsRepository.findByMatchIdAndPlayerId(
        match!.id,
        player2!.id,
      );
    expect(participation1).toBeDefined();
    expect(participation2).toBeDefined();
    expect(participation1?.frags).toBe(1);
    expect(participation2?.deaths).toBe(1);
  });

  it('should not process events if match already ended', async () => {
    // Pre-create a match with endedAt
    await matchesRepository.create({
      externalId: 'm1',
      startedAt: new Date('2025-07-28T12:00:00.000Z'),
      endedAt: new Date(),
    } as any);
    const matchData = {
      match: {
        externalId: 'm1',
        startedAt: '2025-07-28T12:00:00.000Z',
      },
      events: [],
    };
    await useCase.execute(matchData);
    // Should not create new match or frags
    expect(fragsRepository.frags.length).toBe(0);
  });

  it('should ignore <WORLD> as killer and only count victim death', async () => {
    const matchData = {
      match: {
        externalId: 'm2',
        startedAt: '2025-07-28T12:00:00.000Z',
      },
      events: [
        {
          timestamp: '2025-07-28T12:01:00.000Z',
          action: LogActionType.KILL,
          data: {
            killer: '<WORLD>',
            victim: 'Player2',
            weapon: WeaponType.M16,
          },
        },
      ],
    };

    await useCase.execute(matchData);

    // Only victim should be created
    const player2 = await playersRepository.findByName('Player2');
    expect(player2).toBeDefined();
    expect(fragsRepository.frags.length).toBe(1);
    expect(fragsRepository.frags[0].killerId).toBeNull();
    expect(fragsRepository.frags[0].victimId).toBe(player2?.id);
    const participation2 =
      await matchParticipationsRepository.findByMatchIdAndPlayerId(
        fragsRepository.frags[0].matchId,
        player2!.id,
      );
    expect(participation2).toBeDefined();
    expect(participation2?.deaths).toBe(1);
  });
});
