import { Test, TestingModule } from '@nestjs/testing';
import { MedicalTestsController } from './medical-tests.controller';
import { MedicalTestsService } from './medical-tests.service';

describe('MedicalTestsController', () => {
  let controller: MedicalTestsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MedicalTestsController],
      providers: [MedicalTestsService],
    }).compile();

    controller = module.get<MedicalTestsController>(MedicalTestsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
