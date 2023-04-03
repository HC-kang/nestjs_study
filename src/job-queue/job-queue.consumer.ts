import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';

@Processor('message-queue')
export class JobQueueConsumer {

  @Process('message-job')
  messageJob(job: Job<unknown>) {
    console.log(job.data, 'message-job');
  }
  @Process('message-job2')
  messageJob2(job: Job<unknown>) {
    console.log(job.data, 'message-job2');
  }
}
