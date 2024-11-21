import { Injectable, Scope } from '@nestjs/common';
import { JobDTO } from './job.dto';

export interface JobService {
  addJob(job: JobDTO): boolean;
  getJobs(): JobDTO[];
  getJob(id: string): JobDTO;
  updateJob(job: JobDTO): boolean;
  deleteJob(id: string): boolean;
}

@Injectable({ scope: Scope.REQUEST })
export class JobsService implements JobService {
  addJob(job: JobDTO): boolean {
    throw new Error('Method not implemented.');
  }
  getJobs(): JobDTO[] {
    throw new Error('Method not implemented.');
  }
  getJob(id: string): JobDTO {
    throw new Error('Method not implemented.');
  }
  updateJob(job: JobDTO): boolean {
    throw new Error('Method not implemented.');
  }
  deleteJob(id: string): boolean {
    throw new Error('Method not implemented.');
  }
}
