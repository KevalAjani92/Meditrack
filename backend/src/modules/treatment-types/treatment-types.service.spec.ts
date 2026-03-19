import { Test, TestingModule } from '@nestjs/testing';
import { TreatmentTypesService } from './treatment-types.service';

describe('TreatmentTypesService', () => {
  let service: TreatmentTypesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TreatmentTypesService],
    }).compile();

    service = module.get<TreatmentTypesService>(TreatmentTypesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
