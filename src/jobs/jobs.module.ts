import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Job } from './job.entity';
import { JobsController } from './jobs.controller';
import { BaseJobService, JobService } from './jobs.service';

@Module({
  imports: [TypeOrmModule.forFeature([Job])],
  controllers: [JobsController],
  providers: [{ provide: BaseJobService, useClass: JobService }],
  exports: [BaseJobService],
})
export class JobsModule {}
