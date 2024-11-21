import { Controller, Get, Param } from '@nestjs/common';
import { JobsService } from './jobs.service';

@Controller('jobs')
export class JobsController {
  constructor(private jobsService: JobsService) {}

  @Get()
  getJobs(): string {
    return 'All jobs';
  }

  @Get(':id')
  getJob(@Param('id') id: any): string {
    return `A job with ${id}`;
  }
}
