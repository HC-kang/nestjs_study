import { Injectable, Logger } from '@nestjs/common';
import { Cron, Interval, SchedulerRegistry, Timeout } from '@nestjs/schedule';
import { CronJob } from 'cron';

@Injectable()
export class TaskService {
  private readonly logger = new Logger(TaskService.name);

  constructor(private scheduleRegistry: SchedulerRegistry) {
    this.addCronJobToRegistry();
  }

  addCronJobToRegistry() {
    const name = 'cronSample';

    const job = new CronJob('* * * * * *', () => {
      this.logger.warn(`run ${name}`);
    });

    this.scheduleRegistry.addCronJob(name, job);

    this.logger.warn(`job ${name} added!`);
  }

  // @Cron('*/5 * * * * *', { name: 'cronTask' })
  // handleCron() {
  //   this.logger.log('Cron Task Called');
  // }

  // @Interval('intervalTask', 3000)
  // handleInterval() {
  //   this.logger.log('Interval Task Called');
  // }

  // @Timeout('timeoutTask', 5000)
  // handleTimeout() {
  //   this.logger.log('Timeout Task Called');
  // }
}
