import { Module } from '@nestjs/common';
import { BatchController } from './batch.controller';
import { ScheduleModule } from '@nestjs/schedule';
import { TaskService } from './tasks/task.service';

@Module({
  imports: [ScheduleModule.forRoot()],
  controllers: [BatchController],
  providers: [TaskService],
})
export class BatchModule {}
