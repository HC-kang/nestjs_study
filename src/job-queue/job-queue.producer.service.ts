import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';

@Injectable()
export class JobQueueProducerService {
  constructor(
    @InjectQueue('message-queue')
    private readonly queue: Queue,
  ) {}

  async sendMessage(msg: string, job: string) {
    await this.queue.add(job, { text: msg, date: new Date()}, { delay: 1000 });
  }

  async scheduleJoinEmailJob(emailAddress: string, signupVerifyToken: string) {
    await this.queue.add('email-job', { emailAddress, signupVerifyToken});
  }
}
