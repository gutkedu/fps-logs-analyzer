import { Injectable, Logger } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { EventName } from '../../infra/events/event-name.enum';
import { LogActionType } from '../entities/enums/log-action-type';
import { randomUUID } from 'crypto';
import { MatchDto } from '../dto/match.dto';

@Injectable()
export class ProcessLogFileUseCase {
  private readonly logger = new Logger(ProcessLogFileUseCase.name);

  constructor(private eventEmitter: EventEmitter2) {}

  execute(content: string): void {
    this.logger.log('Processing log content');

    try {
      const lines = content.split('\n').filter((line) => line.trim() !== '');
      this.logger.log(`Content has ${lines.length} lines`);

      this.processLogLines(lines);

      this.logger.log('Log content processed successfully');
    } catch (error) {
      this.logger.error('Error processing log content', error);
      throw error;
    }
  }

  private processLogLines(lines: string[]): void {
    let currentMatch: MatchDto | null = null;

    for (const line of lines) {
      const parsedLine = this.parseLogLine(line);
      if (!parsedLine) {
        continue;
      }

      const { timestamp, action, data } = parsedLine;

      switch (action) {
        case LogActionType.MATCH_START: {
          const parsedData = data as { matchId: string };
          const matchId = parsedData.matchId;

          currentMatch = {
            externalId: matchId,
            startedAt: timestamp,
            events: [],
          };

          this.logger.log(`Found new match: ${matchId}`);
          break;
        }
        case LogActionType.MATCH_END: {
          if (currentMatch) {
            const parsedData = data as { matchId: string };
            currentMatch.endedAt = timestamp;

            currentMatch.events.push({
              timestamp,
              action,
              data,
            });

            this.emitEventsForProcessing(currentMatch);

            this.logger.log(
              `Enqueued match ${parsedData.matchId} for processing`,
            );
            currentMatch = null;
          }
          break;
        }
        case LogActionType.KILL: {
          if (currentMatch) {
            currentMatch.events.push({
              timestamp,
              action,
              data,
            });
          }
          break;
        }
        default:
          this.logger.warn(
            `Unknown action type: ${String(action)} in log line: ${line}`,
          );
          break;
      }
    }

    if (currentMatch) {
      this.logger.warn(
        `Log file ended without a match_end event for match ${currentMatch.externalId}.`,
      );
      this.emitEventsForProcessing(currentMatch);
    }
  }

  private emitEventsForProcessing(match: {
    id?: string;
    externalId: string;
    startedAt: Date;
    endedAt?: Date | null;
    events: Array<{
      timestamp: Date;
      action: string;
      data: unknown;
    }>;
  }): void {
    const matchData = {
      match: {
        id: match.id,
        externalId: match.externalId,
        startedAt: match.startedAt.toISOString(),
        endedAt: match.endedAt ? match.endedAt.toISOString() : null,
      },
      events: match.events.map((event) => ({
        timestamp: event.timestamp.toISOString(),
        action: event.action,
        data: event.data,
      })),
    };

    // Emit event directly
    const jobId = randomUUID();
    this.eventEmitter.emit(EventName.PROCESS_MATCH, {
      id: jobId,
      type: EventName.PROCESS_MATCH,
      data: JSON.stringify(matchData),
      addedAt: new Date(),
    });
  }

  private parseLogLine(
    line: string,
  ): { timestamp: Date; action: LogActionType; data: unknown } | null {
    // Match start: DD/MM/YYYY HH:MM:SS - New match 12345678 has started
    const matchStartRegex =
      /(\d{2}\/\d{2}\/\d{4} \d{2}:\d{2}:\d{2}) - New match (\d+) has started/;

    // Match end: DD/MM/YYYY HH:MM:SS - Match 12345678 has ended
    const matchEndRegex =
      /(\d{2}\/\d{2}\/\d{4} \d{2}:\d{2}:\d{2}) - Match (\d+) has ended/;

    // Kill: DD/MM/YYYY HH:MM:SS - Player1 killed Player2 using WEAPON
    const killRegex =
      /(\d{2}\/\d{2}\/\d{4} \d{2}:\d{2}:\d{2}) - (.*?) killed (.*?) (?:using|by) (.*)/;

    let match: RegExpMatchArray | null;

    match = line.match(matchStartRegex);
    if (match) {
      return {
        timestamp: this.parseTimestamp(match[1]),
        action: LogActionType.MATCH_START,
        data: { matchId: match[2] },
      };
    }

    match = line.match(matchEndRegex);
    if (match) {
      return {
        timestamp: this.parseTimestamp(match[1]),
        action: LogActionType.MATCH_END,
        data: { matchId: match[2] },
      };
    }

    match = line.match(killRegex);
    if (match) {
      return {
        timestamp: this.parseTimestamp(match[1]),
        action: LogActionType.KILL,
        data: {
          killer: match[2],
          victim: match[3],
          weapon: match[4],
        },
      };
    }

    return null;
  }

  /**
   * Convert DD/MM/YYYY HH:MM:SS to a Date object
   */
  private parseTimestamp(dateStr: string): Date {
    const [datePart, timePart] = dateStr.split(' ');
    const [day, month, year] = datePart.split('/').map(Number);
    const [hours, minutes, seconds] = timePart.split(':').map(Number);

    return new Date(year, month - 1, day, hours, minutes, seconds);
  }
}
