import { Module } from '@nestjs/common';
import { JobsController } from './jobs.controller';
import { BaseJobService, JobService } from './jobs.service';

@Module({
  controllers: [JobsController],
  providers: [{ provide: BaseJobService, useClass: JobService }],
  exports: [BaseJobService],
})
export class JobsModule {}
