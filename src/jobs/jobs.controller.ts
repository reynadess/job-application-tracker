import { Controller, Get, Param } from '@nestjs/common';
import { BaseJobService } from './jobs.service';

@Controller('jobs')
export class JobsController {
  constructor(private jobsService: BaseJobService) {}

  @Get()
  getJobs(): string {
    return 'All jobs';
  }

  @Get(':id')
  getJob(@Param('id') id: any): string {
    return `A job with ${id}`;
  }
}
