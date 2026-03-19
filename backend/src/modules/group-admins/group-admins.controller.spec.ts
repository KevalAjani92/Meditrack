import { Test, TestingModule } from '@nestjs/testing';
import { GroupAdminsController } from './group-admins.controller';
import { GroupAdminsService } from './group-admins.service';

describe('GroupAdminsController', () => {
  let controller: GroupAdminsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GroupAdminsController],
      providers: [GroupAdminsService],
    }).compile();

    controller = module.get<GroupAdminsController>(GroupAdminsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
