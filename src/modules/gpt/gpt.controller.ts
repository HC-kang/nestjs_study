import { Body, Controller, Post } from '@nestjs/common';
import { GptService } from './gpt.service';

@Controller('gpt')
export class GptController {
  constructor(private readonly gptService: GptService) {}

  @Post()
  async requestImage(@Body('value') value: string) {
    console.log('@#@#@#@#@#@#');
    console.log(value);
    return await this.gptService.requestImage(value);
  }
}
