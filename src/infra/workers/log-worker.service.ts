import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { ProcessLogFileUseCase } from '../../app/use-cases/process-log-file.use-case';
import { EventName } from '../events/event-name.enum';

interface Job {
  id: string;
  type: EventName;
  data: string;
  addedAt: Date;
}

interface LogJobData {
  fileContent: string;
}

@Injectable()
export class LogWorkerService {
  private readonly logger = new Logger(LogWorkerService.name);

  constructor(private readonly processLogFileUseCase: ProcessLogFileUseCase) {}

  @OnEvent(EventName.PROCESS_LOG)
  handleEvent(job: Job): void {
    const data = JSON.parse(job.data) as LogJobData;

    this.logger.log(`Processing log file content (Event ID: ${job.id})`);

    try {
      this.processLogFileUseCase.execute(data.fileContent);
      this.logger.log(`Finished processing log file content`);
    } catch (error) {
      this.logger.error(`Error processing log file content`, error);
      // No need to rethrow as this is now handled within the event
    }
  }
}
