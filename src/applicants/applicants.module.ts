import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Applicant } from './applicant.entity';
import { ApplicantsService } from './applicants.service';

@Module({
  imports: [TypeOrmModule.forFeature([Applicant])],
  providers: [ApplicantsService],
  exports: [ApplicantsService],
})
export class ApplicantsModule {}
