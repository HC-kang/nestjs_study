import { Injectable, Logger } from '@nestjs/common';
import * as uuid from 'uuid';
import { BlockBlobClient, BlobServiceClient } from '@azure/storage-blob';

@Injectable()
export class AzureBlobService {
  private readonly logger = new Logger(AzureBlobService.name);
  private readonly connectionString = process.env.AZURE_CONNECTION_STRING;
  private containerName: string;

  private async getBlobServiceInstance() {
    const blobClientService = await BlobServiceClient.fromConnectionString(
      this.connectionString,
    );
    return blobClientService;
  }

  private async getBlobClient(imageName: string): Promise<BlockBlobClient> {
    const blobService = await this.getBlobServiceInstance();
    const containerClient = blobService.getContainerClient(this.containerName);
    const BlockBlobClient = containerClient.getBlockBlobClient(imageName);

    return BlockBlobClient;
  }

  public async uploadFile(
    file: Express.Multer.File,
    containerName: string,
  ): Promise<string[]> {
    this.containerName = containerName;
    const fileName = this.createFilePath(file.originalname)
    const blockBlobClient = await this.getBlobClient(fileName);
    const fileUrl = blockBlobClient.url;
    await blockBlobClient.uploadData(file.buffer);

    return [fileName, fileUrl];
  }

  public async deleteFile(fileName: string, containerName: string) {
    try {
      this.containerName = containerName;
      const blockBlobClient = await this.getBlobClient(fileName);
      await blockBlobClient.deleteIfExists();
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  private getExtension(fileName: string): string {
    return fileName.split('.').pop();
  }

  private createFilePath(fileName: string): string {
    const extension = this.getExtension(fileName);
    const year = new Date().getFullYear();
    const month = new Date().getMonth() + 1;
    return `${year}/${month}/${uuid.v4()}.${extension}`;
  }
}
