import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Job } from './job.entity';
import { JobsController } from './jobs.controller';
import { JobService } from './jobs.service';

@Module({
  imports: [TypeOrmModule.forFeature([Job])],
  controllers: [JobsController],
  providers: [JobService],
  exports: [JobService],
})
export class JobsModule {}
