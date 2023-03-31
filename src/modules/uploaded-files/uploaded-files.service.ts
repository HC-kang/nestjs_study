import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UploadedFileEntity } from './entities/uploaded-file.entity';
import { Strings } from 'src/common/constants';
import sizeOf from 'image-size';
import { AzureBlobService } from '../azure-blob/azure-blob.service';
import { ulid } from 'ulid';

@Injectable()
export class UploadedFilesService {
  private readonly logger = new Logger(UploadedFilesService.name);
  private readonly containerName = process.env.AZURE_STORAGE_CONTAINER;
  constructor(
    @InjectRepository(UploadedFileEntity)
    private uploadedFilesRepository: Repository<UploadedFileEntity>,
    private readonly azureBlobService: AzureBlobService,
  ) {}

  async createImage(uploadedFile: Express.Multer.File): Promise<UploadedFileEntity> {
    try {
      const [storedFileName, storedUrl] =
      await this.azureBlobService.uploadFile(
        uploadedFile,
        this.containerName,
        );
        
      const file = new UploadedFileEntity();
      file.id = ulid();
      file.filename = uploadedFile.originalname;
      file.mime = uploadedFile.mimetype;
      file.size = uploadedFile.size;
      file.path = storedFileName;
      file.url = storedUrl;
      file.width = this.getImageWidthHeight(uploadedFile)[0];
      file.height = this.getImageWidthHeight(uploadedFile)[1];

      await this.uploadedFilesRepository.save(file);
      return file;
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async findAll(): Promise<UploadedFileEntity[]> {
    try {
      return await this.uploadedFilesRepository.find();
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async findOne(id: string): Promise<UploadedFileEntity> {
    try {
      const result = await this.uploadedFilesRepository.findOne({
        where: { id },
      });
      if (!result) {
        throw new NotFoundException(Strings.UPLOADED_FILE_NOT_FOUND);
      }
      return result;
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async remove(id: string): Promise<string> {
    try {
      const file = await this.uploadedFilesRepository.findOne({
        where: { id },
      });

      if (!file) {
        throw new NotFoundException(Strings.UPLOADED_FILE_NOT_FOUND);
      }

      await this.azureBlobService.deleteFile(file.path, 'chuncheon');
      await this.uploadedFilesRepository.softDelete(id);
      return `File with id ${id} has been deleted`;
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  private getImageWidthHeight(image: Express.Multer.File) {
    const dimensions = sizeOf(image.buffer);
    return [dimensions.width, dimensions.height];
  }
}
