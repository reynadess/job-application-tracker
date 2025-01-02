import { Test, TestingModule } from '@nestjs/testing';
import { RecruitersService } from './recruiters.service';

describe('RecruitersService', () => {
  let service: RecruitersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RecruitersService],
    }).compile();

    service = module.get<RecruitersService>(RecruitersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
