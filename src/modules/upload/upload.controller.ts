import {
  Controller,
  FileTypeValidator,
  MaxFileSizeValidator,
  ParseFilePipe,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadService } from './upload.service';

@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 2 }),
          new FileTypeValidator({ fileType: 'image/png' }),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    return await this.uploadService.upload(
      file.originalname,
      'https://oaidalleapiprodscus.blob.core.windows.net/private/org-HUmhLpvjcoeBqp9TlE8cfks7/user-Zp1NpGZDgtz05f607Rx5nrTF/img-sYeNeEmBqWgYYOnLud1jJ9ji.png?st=2023-12-30T05%3A38%3A48Z&se=2023-12-30T07%3A38%3A48Z&sp=r&sv=2021-08-06&sr=b&rscd=inline&rsct=image/png&skoid=6aaadede-4fb3-4698-a8f6-684d7786b067&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2023-12-29T15%3A05%3A50Z&ske=2023-12-30T15%3A05%3A50Z&sks=b&skv=2021-08-06&sig=LF8rqAy2kn1l8o4zTBk5WU7eeVIMpNNBKWs2qdCkvis%3D',
    );
  }
}
