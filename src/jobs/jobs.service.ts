import { Injectable, Scope } from '@nestjs/common';
import { JobDTO } from './job.dto';

export abstract class BaseJobService {
  abstract addJob(job: JobDTO): boolean;
  abstract getJobs(): JobDTO[];
  abstract getJob(id: string): JobDTO;
  abstract updateJob(job: JobDTO): boolean;
  abstract deleteJob(id: string): boolean;
}

@Injectable({ scope: Scope.REQUEST })
export class JobService implements BaseJobService {
  addJob(_job: JobDTO): boolean {
    throw new Error('Method not implemented.');
  }
  getJobs(): JobDTO[] {
    throw new Error('Method not implemented.');
  }
  getJob(_id: string): JobDTO {
    throw new Error('Method not implemented.');
  }
  updateJob(_job: JobDTO): boolean {
    throw new Error('Method not implemented.');
  }
  deleteJob(_id: string): boolean {
    throw new Error('Method not implemented.');
  }
}
