import { Controller, Get, Param } from '@nestjs/common';
import { Job } from './job.entity';
import { BaseJobService } from './jobs.service';

@Controller('jobs')
export class JobsController {
  constructor(private jobsService: BaseJobService) {}

  @Get()
  getJobs(): string {
    return 'All jobs';
  }

  @Get(':id')
  async getJob(@Param('id') id: number): Promise<Job> {
    return this.jobsService.getJob(id);
  }
}
