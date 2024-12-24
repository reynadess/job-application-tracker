import { Controller, Get, Param } from '@nestjs/common';
import { JobDTO } from './job.dto';
import { BaseJobService } from './jobs.service';

@Controller('jobs')
export class JobsController {
  constructor(private jobsService: BaseJobService) {}

  @Get()
  getJobs(): string {
    return 'All jobs';
  }

  @Get(':id')
  getJob(@Param('id') id: number): JobDTO {
    return this.jobsService.getJob(id);
  }
}
