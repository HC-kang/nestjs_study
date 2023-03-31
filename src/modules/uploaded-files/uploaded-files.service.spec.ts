import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UploadedFileEntity } from './entities/uploaded-file.entity';
import { UploadedFilesService } from './uploaded-files.service';

class MockUploadedFileEntityRepository extends Repository<UploadedFileEntity> {}

describe('UploadedFilesService', () => {
  let service: UploadedFilesService;
  let fakeUploadedFilesRepository: Repository<UploadedFileEntity>;
  let fakeUploadedFileService: Partial<UploadedFilesService>;

  beforeEach(async () => {
    fakeUploadedFileService = {};
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UploadedFilesService,
        {
          provide: getRepositoryToken(UploadedFileEntity),
          useClass: MockUploadedFileEntityRepository,
        },
        {
          provide: UploadedFilesService,
          useValue: fakeUploadedFileService,
        },
      ],
    }).compile();

    service = module.get<UploadedFilesService>(UploadedFilesService);
    fakeUploadedFilesRepository = module.get<Repository<UploadedFileEntity>>(
      getRepositoryToken(UploadedFileEntity),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
