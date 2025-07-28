import { EventName } from '@/infra/events/event-name.enum';
import {
  BadRequestException,
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { FileInterceptor } from '@nestjs/platform-express';
import { randomUUID } from 'crypto';
import { memoryStorage } from 'multer';
import { Express } from 'express';

@Controller('logs')
export class LogsController {
  constructor(private readonly eventEmitter: EventEmitter2) {}

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(),
      fileFilter: (req, file, callback) => {
        const isTextMimeType = file.mimetype.startsWith('text/');
        const isTxtExtension = file.originalname.toLowerCase().endsWith('.txt');

        if (isTextMimeType || isTxtExtension) {
          callback(null, true);
        } else {
          return callback(
            new Error('Only text files or .txt files are allowed'),
            false,
          );
        }
      },
    }),
  )
  uploadLog(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('Log file is required');
    }

    const fileContent = file.buffer.toString('utf-8');

    if (!fileContent) {
      throw new BadRequestException('Log file is empty');
    }

    const jobId = randomUUID();

    this.eventEmitter.emit(EventName.PROCESS_LOG, {
      id: jobId,
      type: EventName.PROCESS_LOG,
      data: JSON.stringify({ fileContent }),
      addedAt: new Date(),
    });

    return {
      message: 'Log file uploaded and sent for processing',
      jobId,
      fileName: file.originalname,
    };
  }
}
