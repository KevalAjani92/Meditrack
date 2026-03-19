import { Test, TestingModule } from '@nestjs/testing';
import { DoctorOpdService } from './doctor-opd.service';

describe('DoctorOpdService', () => {
  let service: DoctorOpdService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DoctorOpdService],
    }).compile();

    service = module.get<DoctorOpdService>(DoctorOpdService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
