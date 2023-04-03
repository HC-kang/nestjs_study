import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { JobQueueConsumer } from 'src/job-queue/job-queue.consumer';
import { JobQueueProducerService } from 'src/job-queue/job-queue.producer.service';
import { EmailModule } from 'src/email/email.module';

@Module({
  imports: [
    BullModule.forRootAsync({
      useFactory: () => ({
        redis: {
          host: process.env.REDIS_HOST,
          port: Number(process.env.REDIS_PORT),
        },
      }),
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
