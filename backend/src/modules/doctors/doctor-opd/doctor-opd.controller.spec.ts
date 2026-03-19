import { Test, TestingModule } from '@nestjs/testing';
import { DoctorOpdController } from './doctor-opd.controller';

describe('DoctorOpdController', () => {
  let controller: DoctorOpdController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DoctorOpdController],
    }).compile();

    controller = module.get<DoctorOpdController>(DoctorOpdController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
