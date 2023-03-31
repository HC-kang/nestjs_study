import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { UploadedFilesService } from './uploaded-files.service';
import { CreateUploadedFileDto } from './dto/create-uploaded-file.dto';
import { UpdateUploadedFileDto } from './dto/update-uploaded-file.dto';
import { UploadedFileEntity } from './entities/uploaded-file.entity';
import { ApiConsumes } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('uploaded-files')
export class UploadedFilesController {
  constructor(private readonly uploadedFilesService: UploadedFilesService) {}

  @ApiConsumes('multipart/form-data')
  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async create(@UploadedFile() uploadedFile: Express.Multer.File) {
    return await this.uploadedFilesService.create(uploadedFile);
  }

  @Get()
  async findAll(): Promise<UploadedFileEntity[]> {
    return await this.uploadedFilesService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<UploadedFileEntity> {
    return await this.uploadedFilesService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateUploadedFileDto: UpdateUploadedFileDto,
  ) {
    return this.uploadedFilesService.update(id, updateUploadedFileDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.uploadedFilesService.remove(id);
  }
}
