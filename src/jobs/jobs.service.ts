import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JobDTO } from './job.dto';
import { Job } from './job.entity';

export abstract class BaseJobService {
  abstract addJob(job: JobDTO): boolean;
  abstract getJobs(): JobDTO[];
  abstract getJob(id: number): Promise<Job>;
  abstract updateJob(job: JobDTO): boolean;
  abstract deleteJob(id: string): boolean;
}

@Injectable()
export class JobService implements BaseJobService {
  private readonly logger = new Logger(JobService.name);
  constructor(
    @InjectRepository(Job) private readonly jobRepository: Repository<Job>,
  ) {}

  addJob(job: JobDTO): boolean {
    throw new Error('Method not implemented.');
  }
  getJobs(): JobDTO[] {
    throw new Error('Method not implemented.');
  }
  async getJob(id: number): Promise<Job> {
    return this.jobRepository.findOne({ where: { id: id } });
  }
  updateJob(_job: JobDTO): boolean {
    throw new Error('Method not implemented.');
  }
  deleteJob(_id: string): boolean {
    throw new Error('Method not implemented.');
  }
}
