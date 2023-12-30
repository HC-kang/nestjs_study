import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UploadService } from '../upload/upload.service';

@Injectable()
export class GptService {
  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
    private readonly uploadService: UploadService,
  ) {}

  async requestImage(value: string) {
    try {
      const basePrompt =
        "I wanna make a happy new year card for my friend. it should have 'happy new year' on top of it and looks like A kindergartener's crayon drawing. make a simple image using this keywords: ";

      const response = await this.httpService.axiosRef.post(
        'https://api.openai.com/v1/images/generations',
        {
          model: 'dall-e-2',
          prompt: basePrompt + value,
          n: 1,
          size: '1024x1024',
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this.configService.get<string>(
              'OPENAI_API_KEY',
            )}`,
          },
        },
      );
      if (response.status !== 200) throw new Error('OpenAI API Error');
      if (!response?.data?.data[0]) throw new Error('OpenAI API Error');
      return this.uploadService.upload(value, response?.data?.data[0].url);
    } catch (e) {
      console.log(e);
    }
  }
}
