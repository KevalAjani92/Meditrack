import { Test, TestingModule } from '@nestjs/testing';
import { OpdController } from './opd.controller';
import { OpdService } from './opd.service';

describe('OpdController', () => {
  let controller: OpdController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OpdController],
      providers: [OpdService],
    }).compile();

    controller = module.get<OpdController>(OpdController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
