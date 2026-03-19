import { Test, TestingModule } from '@nestjs/testing';
import { TreatmentTypesController } from './treatment-types.controller';
import { TreatmentTypesService } from './treatment-types.service';

describe('TreatmentTypesController', () => {
  let controller: TreatmentTypesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TreatmentTypesController],
      providers: [TreatmentTypesService],
    }).compile();

    controller = module.get<TreatmentTypesController>(TreatmentTypesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
