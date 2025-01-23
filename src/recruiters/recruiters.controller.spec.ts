import { Test, TestingModule } from '@nestjs/testing';
import { RecruitersController } from './recruiters.controller';

describe('RecruitersController', () => {
  let controller: RecruitersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RecruitersController],
    }).compile();

    controller = module.get<RecruitersController>(RecruitersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
