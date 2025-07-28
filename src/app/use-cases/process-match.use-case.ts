import { Injectable, Logger } from '@nestjs/common';
import { Match } from '../entities/match';
import { Player } from '../entities/player';
import { Frag } from '../entities/frag';
import { WeaponType } from '../entities/enums/weapon-type';
import { LogActionType } from '../entities/enums/log-action-type';
import { MatchesRepository } from '../repositories/matches-repository';
import { PlayersRepository } from '../repositories/players-repository';
import { FragsRepository } from '../repositories/frags-repository';
import { MatchParticipation } from '../entities/match-participation';
import { MatchParticipationsRepository } from '../repositories/match-participations-repository';

interface ProcessMatchUseCaseRequest {
  match: {
    id?: string;
    externalId: string;
    startedAt: string;
    endedAt?: string | null;
  };
  events: Array<{
    timestamp: string;
    action: string;
    data: {
      killer?: string;
      victim?: string;
      weapon?: WeaponType;
      matchId?: string;
    };
  }>;
}

@Injectable()
export class ProcessMatchUseCase {
  private readonly logger = new Logger(ProcessMatchUseCase.name);

  constructor(
    private matchesRepository: MatchesRepository,
    private playersRepository: PlayersRepository,
    private fragsRepository: FragsRepository,
    private matchParticipationsRepository: MatchParticipationsRepository,
  ) {}

  async execute(matchData: ProcessMatchUseCaseRequest): Promise<void> {
    this.logger.log(`Processing match: ${matchData.match.externalId}`);

    try {
      const match = await this.processMatch(matchData.match);

      if (match && matchData.events.length > 0) {
        await this.processEvents(match, matchData.events);
        this.logger.log(`Match processed successfully: ${match.id}`);
      } else if (match) {
        this.logger.log(
          `No events to process for match: ${matchData.match.externalId}`,
        );
      } else {
        this.logger.warn(
          `Match ${matchData.match.externalId} already exists and has ended. Skipping processing.`,
        );
      }
    } catch (error) {
      this.logger.error(
        `Error processing match: ${matchData.match.externalId}`,
        error,
      );
      throw error;
    }
  }

  private async processMatch(matchInfo: {
    id?: string;
    externalId: string;
    startedAt: string;
    endedAt?: string | null;
  }): Promise<Match | null> {
    const existingMatch = await this.matchesRepository.findByExternalId(
      matchInfo.externalId,
    );

    if (existingMatch && existingMatch.endedAt) {
      this.logger.log(
        `Match ${matchInfo.externalId} already exists and has ended. Skipping processing.`,
      );
      return null;
    }

    if (existingMatch) {
      return existingMatch;
    }

    const match = new Match(
      {
        externalId: matchInfo.externalId,
        startedAt: new Date(matchInfo.startedAt),
      },
      matchInfo.id,
    );
    await this.matchesRepository.create(match);
    this.logger.log(`Created new match: ${match.id}`);

    return match;
  }

  private async processEvents(
    match: Match,
    events: Array<{
      timestamp: string;
      action: string;
      data: {
        killer?: string;
        victim?: string;
        weapon?: string;
        matchId?: string;
      };
    }>,
  ): Promise<void> {
    const playerMap = new Map<string, string>(); // Map player names to IDs
    const matchParticipants = new Set<string>(); // Track unique combinations of match ID + player ID
    const frags: Frag[] = [];

    for (const event of events) {
      switch (event.action as LogActionType) {
        case LogActionType.MATCH_END: {
          match.setEndedAt(new Date(event.timestamp));
          await this.matchesRepository.update(match);
          this.logger.log(`Updated match ${match.id} with end time.`);
          break;
        }
        case LogActionType.KILL: {
          const { killer, victim, weapon } = event.data;
          if (!victim || !weapon) break;

          let killerId: string | null = null;
          if (killer && killer !== '<WORLD>') {
            killerId = await this.getOrCreatePlayer(killer, playerMap);
            await this.ensureMatchParticipation(
              match.id,
              killerId,
              matchParticipants,
              { isKiller: true },
            );
          }

          const victimId = await this.getOrCreatePlayer(victim, playerMap);
          await this.ensureMatchParticipation(
            match.id,
            victimId,
            matchParticipants,
            { isVictim: true },
          );

          const frag = new Frag({
            matchId: match.id,
            killerId: killerId,
            victimId: victimId,
            weapon: this.mapToWeaponType(weapon),
          });
          frags.push(frag);
          break;
        }

        default:
          this.logger.warn(`Unknown event action: ${event.action}`);
          break;
      }
    }

    if (frags.length > 0) {
      for (const frag of frags) {
        await this.fragsRepository.create(frag);
      }
      this.logger.log(`Persisted ${frags.length} frags for match ${match.id}`);
    }
  }

  private mapToWeaponType(weapon: string | undefined): WeaponType {
    if (!weapon) {
      this.logger.warn(`Unknown weapon type: ${weapon}, defaulting to M16`);
      return WeaponType.M16;
    }
    if (Object.values(WeaponType).includes(weapon as WeaponType)) {
      return weapon as WeaponType;
    }
    this.logger.warn(`Unknown weapon type: ${weapon}, defaulting to UNKNOWN`);
    return WeaponType.UNKNOWN;
  }

  private async getOrCreatePlayer(
    playerName: string,
    playerMap: Map<string, string>,
  ): Promise<string> {
    if (playerMap.has(playerName)) {
      return playerMap.get(playerName)!;
    }

    let player = await this.playersRepository.findByName(playerName);

    if (!player) {
      player = new Player({ name: playerName });
      try {
        await this.playersRepository.create(player);
        this.logger.log(`Created new player: ${playerName}`);
      } catch (error) {
        // Handle unique constraint error (player already exists)
        if (
          typeof error === 'object' &&
          error !== null &&
          'code' in error &&
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          error.code === 'P2002'
        ) {
          this.logger.warn(
            `Player with name '${playerName}' already exists. Fetching existing player.`,
          );
          player = await this.playersRepository.findByName(playerName);
        } else {
          throw error;
        }
      }
    }

    if (!player) {
      throw new Error(`Failed to get or create player: ${playerName}`);
    }

    playerMap.set(playerName, player.id);
    return player.id;
  }

  private async ensureMatchParticipation(
    matchId: string,
    playerId: string,
    participantSet: Set<string>,
    update?: { isKiller?: boolean; isVictim?: boolean },
  ): Promise<void> {
    const key = `${matchId}-${playerId}`;

    let participation =
      await this.matchParticipationsRepository.findByMatchIdAndPlayerId(
        matchId,
        playerId,
      );

    let isNew = false;
    if (!participation) {
      participation = new MatchParticipation({
        matchId,
        playerId,
        team: 'unknown',
        frags: 0,
        deaths: 0,
        score: 0,
        longestStreak: 0,
        currentStreak: 0,
        awards: [],
        joinedAt: new Date(),
      });
      isNew = true;
    }

    let updated = false;
    if (update?.isKiller) {
      participation.addFrag();
      updated = true;
    }
    if (update?.isVictim) {
      participation.addDeath();
      updated = true;
    }

    // TODO: update streaks, awards

    if (isNew) {
      await this.matchParticipationsRepository.create(participation);
      this.logger.log(
        `Created match participation for player ${playerId} in match ${matchId}`,
      );
    } else if (updated) {
      await this.matchParticipationsRepository.update(participation);
      this.logger.log(
        `Updated match participation for player ${playerId} in match ${matchId}`,
      );
    }

    participantSet.add(key);
  }
}
