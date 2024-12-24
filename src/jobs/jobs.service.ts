import { Injectable } from '@nestjs/common';
import { JobDTO, JobStatus } from './job.dto';

export abstract class BaseJobService {
  abstract addJob(job: JobDTO): boolean;
  abstract getJobs(): JobDTO[];
  abstract getJob(id: number): JobDTO;
  abstract updateJob(job: JobDTO): boolean;
  abstract deleteJob(id: string): boolean;
}

@Injectable()
export class JobService implements BaseJobService {
  addJob(job: JobDTO): boolean {
    throw new Error('Method not implemented.');
  }
  getJobs(): JobDTO[] {
    throw new Error('Method not implemented.');
  }
  getJob(id: number): JobDTO {
    return new JobDTO(
      id,
      'Software Developer',
      'Develop software',
      'Hyderabad',
      'Full-time',
      new Date(),
      JobStatus.APPLIED,
    );
  }
  updateJob(_job: JobDTO): boolean {
    throw new Error('Method not implemented.');
  }
  deleteJob(_id: string): boolean {
    throw new Error('Method not implemented.');
  }
}
