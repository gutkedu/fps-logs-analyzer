/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { ProcessMatchUseCase } from '../../app/use-cases/process-match.use-case';
import { EventName } from '../events/event-name.enum';

interface Event {
  id: string;
  type: EventName;
  data: string;
  addedAt: Date;
}

@Injectable()
export class MatchWorkerService {
  private readonly logger = new Logger(MatchWorkerService.name);

  constructor(private readonly processMatchUseCase: ProcessMatchUseCase) {}

  @OnEvent(EventName.PROCESS_MATCH)
  async handleEvent(event: Event): Promise<void> {
    this.logger.log(`Received match event: ${event.id}`);

    if (event.type !== EventName.PROCESS_MATCH) {
      this.logger.warn(
        `Event type mismatch: expected ${EventName.PROCESS_MATCH}, got ${event.type}`,
      );
      return;
    }

    try {
      await this.processMatchUseCase.execute(JSON.parse(event.data));
      this.logger.log(`Match processed successfully: ${event.id}`);
    } catch (error) {
      this.logger.error(`Error processing match event`, error);
      // No need to rethrow as this is now handled within the event
    }
  }
}
