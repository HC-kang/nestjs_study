import { Module } from '@nestjs/common';
import { GptController } from './gpt.controller';
import { HttpModule } from '@nestjs/axios';
import { GptService } from './gpt.service';
import { UploadModule } from '../upload/upload.module';

@Module({
  imports: [HttpModule, UploadModule],
  controllers: [GptController],
  providers: [GptService],
})
export class GptModule {}
