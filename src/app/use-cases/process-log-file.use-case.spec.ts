/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ProcessLogFileUseCase } from './process-log-file.use-case';

// Simple mock for EventEmitter2
class EventEmitter2Mock {
  public emit = vi.fn();
}

describe('ProcessLogFileUseCase', () => {
  let eventEmitter: EventEmitter2Mock;
  let useCase: ProcessLogFileUseCase;

  beforeEach(() => {
    eventEmitter = new EventEmitter2Mock();
    useCase = new ProcessLogFileUseCase(eventEmitter as any);
  });

  it('should process a simple log and emit an event with correct payload', () => {
    const log = [
      '01/01/2025 12:00:00 - New match 1234 has started',
      '01/01/2025 12:01:00 - Player1 killed Player2 using M16',
      '01/01/2025 12:05:00 - Match 1234 has ended',
    ].join('\n');
    useCase.execute(log);
    expect(eventEmitter.emit).toHaveBeenCalledTimes(1);
    const [eventName, payload] = eventEmitter.emit.mock.calls[0];
    expect(eventName).toBeDefined();
    expect(eventName).toMatch('process-match');
    expect(payload).toBeDefined();
    expect(typeof payload).toBe('object');
    expect(payload.type).toBeDefined();
    expect(payload.data).toContain('1234');
    expect(payload.addedAt).toBeInstanceOf(Date);
    const parsed = JSON.parse(payload.data);
    expect(parsed.match.externalId).toBe('1234');
    expect(parsed.events.length).toBe(2); // kill + match_end
    expect(parsed.events[0].action).toBe('kill');
    expect(parsed.events[1].action).toBe('match_end');
  });

  it('should handle empty log gracefully', () => {
    useCase.execute('');
    expect(eventEmitter.emit).not.toHaveBeenCalled();
  });

  it('should process log without match_end and still emit event', () => {
    const log = [
      '01/01/2025 12:00:00 - New match 5678 has started',
      '01/01/2025 12:01:00 - PlayerA killed PlayerB using AK47',
    ].join('\n');
    useCase.execute(log);
    expect(eventEmitter.emit).toHaveBeenCalledTimes(1);
    const [, payload] = eventEmitter.emit.mock.calls[0];
    expect(payload.data).toContain('5678');
    const parsed = JSON.parse(payload.data);
    expect(parsed.match.externalId).toBe('5678');
    expect(parsed.events.length).toBe(1); // only kill event
    expect(parsed.events[0].action).toBe('kill');
  });

  it('should handle empty log gracefully', () => {
    useCase.execute('');
    expect(eventEmitter.emit).not.toHaveBeenCalled();
  });
});
