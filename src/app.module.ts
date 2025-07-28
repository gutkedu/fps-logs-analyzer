import { Module } from '@nestjs/common';
import { HttpModule } from './infra/http/http.module';
import { WorkersModule } from './infra/workers/workers.module';
import { EventEmitterModule } from '@nestjs/event-emitter';

@Module({
  imports: [
    EventEmitterModule.forRoot({
      // Configure global event emitter here if needed
      wildcard: false,
      delimiter: '.',
      maxListeners: 10,
      verboseMemoryLeak: true,
    }),
    HttpModule,
    WorkersModule,
  ],
})
export class AppModule {}
