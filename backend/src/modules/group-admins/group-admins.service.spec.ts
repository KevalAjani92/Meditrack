import { Test, TestingModule } from '@nestjs/testing';
import { GroupAdminsService } from './group-admins.service';

describe('GroupAdminsService', () => {
  let service: GroupAdminsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GroupAdminsService],
    }).compile();

    service = module.get<GroupAdminsService>(GroupAdminsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
