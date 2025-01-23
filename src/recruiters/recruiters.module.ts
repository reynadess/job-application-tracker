import { Module } from '@nestjs/common';
import { RecruitersController } from './recruiters.controller';
import { RecruitersService } from './recruiters.service';

@Module({
  controllers: [RecruitersController],
  providers: [RecruitersService]
})
export class RecruitersModule {}
