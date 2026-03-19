import { Test, TestingModule } from '@nestjs/testing';
import { MedicalTestsService } from './medical-tests.service';

describe('MedicalTestsService', () => {
  let service: MedicalTestsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MedicalTestsService],
    }).compile();

    service = module.get<MedicalTestsService>(MedicalTestsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
