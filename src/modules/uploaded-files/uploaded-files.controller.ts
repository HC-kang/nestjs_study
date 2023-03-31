import {
  Controller,
  Get,
  Post,
  Param,
  Delete,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { UploadedFilesService } from './uploaded-files.service';
import { UploadedFileEntity } from './entities/uploaded-file.entity';
import { ApiConsumes } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('uploaded-files')
export class UploadedFilesController {
  constructor(private readonly uploadedFilesService: UploadedFilesService) {}

  @ApiConsumes('multipart/form-data')
  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async createImage(@UploadedFile() uploadedFile: Express.Multer.File) {
    return await this.uploadedFilesService.createImage(uploadedFile);
  }

  @Get()
  async findAll(): Promise<UploadedFileEntity[]> {
    return await this.uploadedFilesService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<UploadedFileEntity> {
    return await this.uploadedFilesService.findOne(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.uploadedFilesService.remove(id);
  }
}
