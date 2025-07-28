import { Module } from '@nestjs/common';
import { HealthController } from './controllers/health.controller';
import { LogsController } from './controllers/logs.controller';

@Module({
  imports: [],
  controllers: [HealthController, LogsController],
})
export class HttpModule {}
