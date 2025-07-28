import { Injectable, Logger } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { randomUUID } from 'crypto';

@Injectable()
export class EventService {
  private readonly logger = new Logger(EventService.name);

  constructor(private eventEmitter: EventEmitter2) {}

  /**
   * Emits an event with the given type and data
   * @param eventName The name of the event to emit
   * @param data The data to include with the event
   * @returns The generated event ID
   */
  emit(eventName: string, data: unknown): string {
    const eventId = randomUUID();

    this.logger.log(`Emitting event: ${eventName} (ID: ${eventId})`);

    const hasListeners = this.eventEmitter.listenerCount(eventName) > 0;

    if (!hasListeners) {
      this.logger.warn(`No listeners found for event: ${eventName}`);
      return eventId;
    }

    const eventData = {
      id: eventId,
      data: JSON.stringify(data),
      emittedAt: new Date(),
    };

    // Fire and forget
    void this.eventEmitter.emit(eventName, eventData);

    return eventId;
  }
}
