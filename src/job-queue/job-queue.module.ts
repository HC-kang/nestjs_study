import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { JobQueueConsumer } from '../job-queue/job-queue.consumer';
import { JobQueueProducerService } from '../job-queue/job-queue.producer.service';
import { EmailModule } from '../email/email.module';
import redisConfig from 'src/config/redis.config';

@Module({
  imports: [
    BullModule.forRootAsync({
      useFactory: redisConfig,
    }),
    BullModule.registerQueue({
      name: 'message-queue',
    }),
    EmailModule,
  ],
  providers: [JobQueueProducerService, JobQueueConsumer],
  exports: [JobQueueProducerService],
})
export class JobQueueModule {}
