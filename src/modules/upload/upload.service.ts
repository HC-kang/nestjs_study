import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class UploadService {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  private readonly s3Client = new S3Client({
    region: this.configService.getOrThrow('AWS_LOG_REGION'),
    credentials: {
      accessKeyId: this.configService.getOrThrow('AWS_LOG_ACCESS_KEY_ID'),
      secretAccessKey: this.configService.getOrThrow(
        'AWS_LOG_SECRET_ACCESS_KEY',
      ),
    },
  });

  async upload(fileName: string, url: string) {
    try {
      const response = await lastValueFrom(
        this.httpService.get(url, { responseType: 'arraybuffer' }),
      );
      const newFileName =
        this.formatDateToString() +
        Buffer.from(fileName).toString('base64') +
        '.png';
      await this.s3Client.send(
        new PutObjectCommand({
          Bucket: 'ford-new-year-card-bucket',
          Key: newFileName,
          Body: response.data,
        }),
      );
      console.log('Image uploaded successfully');
      return 'https://d3h4nb97xw12d7.cloudfront.net/' + newFileName;
    } catch (error) {
      console.error('Error in image upload:', error);
    }
  }

  private formatDateToString(date = new Date()) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    return `${year}${month}${day}${hours}${minutes}${seconds}`;
  }
}
