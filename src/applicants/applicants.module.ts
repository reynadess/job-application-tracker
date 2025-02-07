import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AbilityModule } from 'src/ability/ability.module';
import { Applicant } from './applicant.entity';
import { ApplicantsController } from './applicants.controller';
import { ApplicantsService } from './applicants.service';

@Module({
  imports: [TypeOrmModule.forFeature([Applicant]), AbilityModule],
  providers: [ApplicantsService],
  exports: [ApplicantsService],
  controllers: [ApplicantsController],
})
export class ApplicantsModule {}
