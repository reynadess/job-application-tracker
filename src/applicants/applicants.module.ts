import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CaslModule } from 'nest-casl';
import { permissions } from '../auth/permissions';
import { Applicant } from './applicant.entity';
import { ApplicantsController } from './applicants.controller';
import { ApplicantsService } from './applicants.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Applicant]),
    CaslModule.forFeature({ permissions }),
  ],
  providers: [ApplicantsService],
  exports: [ApplicantsService],
  controllers: [ApplicantsController],
})
export class ApplicantsModule {}
