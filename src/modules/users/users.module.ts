import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { AuthModule } from '../../modules/auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { EmailModule } from '../../email/email.module';
import { JobQueueModule } from '../../job-queue/job-queue.module';

@Module({
  imports: [EmailModule, TypeOrmModule.forFeature([UserEntity]), AuthModule, JobQueueModule],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
