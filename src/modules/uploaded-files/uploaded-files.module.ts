import { Module } from '@nestjs/common';
import { UploadedFilesService } from './uploaded-files.service';
import { UploadedFilesController } from './uploaded-files.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UploadedFileEntity } from './entities/uploaded-file.entity';
import { AzureBlobModule } from '../azure-blob/azure-blob.module';

@Module({
  imports: [AzureBlobModule, TypeOrmModule.forFeature([UploadedFileEntity])],
  controllers: [UploadedFilesController],
  providers: [UploadedFilesService]
})
export class UploadedFilesModule {}
