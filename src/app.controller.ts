import { Controller, Get, Query } from '@nestjs/common';
import { MessageProducerService } from './message.producer.service';

@Controller()
export class AppController {
  constructor(private messageProducerService: MessageProducerService) {}

  @Get('test-send-message')
  sendMessage(
    @Query('msg') msg: string,
    @Query('job') job: string,
    ) {
    this.messageProducerService.sendMessage(msg, job);
    return msg;
  }
}
