import { Test, TestingModule } from '@nestjs/testing';
import { UploadedFilesController } from './uploaded-files.controller';
import { UploadedFilesService } from './uploaded-files.service';

describe('UploadedFilesController', () => {
  let controller: UploadedFilesController;
  let fakeUploadedFileService: Partial<UploadedFilesService>;

  beforeEach(async () => {
    fakeUploadedFileService = {};
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UploadedFilesController],
      providers: [
        UploadedFilesService,
        {
          provide: UploadedFilesService,
          useValue: fakeUploadedFileService,
        },
      ],
    }).compile();

    controller = module.get<UploadedFilesController>(UploadedFilesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
