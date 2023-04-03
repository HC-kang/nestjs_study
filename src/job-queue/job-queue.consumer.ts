import { Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';
import { EmailService } from 'src/email/email.service';

@Processor('message-queue')
export class JobQueueConsumer {
  private readonly logger = new Logger(JobQueueConsumer.name);
  constructor(private readonly emailService: EmailService,) {}

  @Process('message-job')
  messageJob(job: Job<unknown>) {
    console.log(job.data, 'message-job');
  }

  @Process('message-job2')
  messageJob2(job: Job<unknown>) {
    console.log(job.data, 'message-job2');
  }

  @Process('email-job')
  async emailJob(job: Job<any>) {
    try {
      console.log(job.data.emailAddress, 'email-job');
      console.log(job.data.signupVerifyToken, 'email-job');
      await this.emailService.sendMemberJoinVerification(job.data?.emailAddress, job.data?.signupVerifyToken);
    } catch (error) {
      this.logger.error(error);
      console.log(error);
    }
  }
}
