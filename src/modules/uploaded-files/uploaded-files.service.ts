import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUploadedFileDto } from './dto/create-uploaded-file.dto';
import { UpdateUploadedFileDto } from './dto/update-uploaded-file.dto';
import { UploadedFileEntity } from './entities/uploaded-file.entity';
import * as uuid from 'uuid';
import { Strings } from 'src/common/constants';
import sizeOf from 'image-size';

@Injectable()
export class UploadedFilesService {
  private readonly logger = new Logger(UploadedFilesService.name);
  constructor(
    @InjectRepository(UploadedFileEntity)
    private uploadedFilesRepository: Repository<UploadedFileEntity>,
  ) {}

  async create(uploadedFile: Express.Multer.File): Promise<UploadedFileEntity> {
    this.logger.log('create test');
    try {
      const file = new UploadedFileEntity();
      file.id = uuid.v4();
      const dimension = sizeOf(uploadedFile.buffer);
      file.filename = uploadedFile.originalname || 'default';
      file.path = uploadedFile.path || 'default';
      file.mime = uploadedFile.mimetype;
      file.size = uploadedFile.size;
      file.width = dimension.width;
      file.height = dimension.height;
      file.url = `test/${file.path}`;

      await this.uploadedFilesRepository.save(file);
      return file;
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async findAll(): Promise<UploadedFileEntity[]> {
    this.logger.log('findAll test');
    try {
      return await this.uploadedFilesRepository.find();
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async findOne(id: string): Promise<UploadedFileEntity> {
    this.logger.log('findOne test');
    try {
      return await this.uploadedFilesRepository.findOne({
        where: { id },
      });
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async update(
    id: string,
    updateUploadedFileDto: UpdateUploadedFileDto,
  ): Promise<UploadedFileEntity> {
    this.logger.log('update test');
    try {
      const { name } = updateUploadedFileDto;
      const aFile = await this.uploadedFilesRepository.findOne({
        where: { id },
      });
      if (!aFile) throw new NotFoundException(Strings.UPLOADED_FILE_NOT_FOUND);
      aFile.filename = name;
      return this.uploadedFilesRepository.save(aFile);
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  remove(id: string): string {
    this.logger.log('remove test');
    try {
      this.uploadedFilesRepository.delete(id);
      return `File with id ${id} has been deleted`;
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }
}
