import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { JobDTO } from './job.dto';
import { Job } from './job.entity';

@Injectable()
export class JobService {
  private readonly logger = new Logger(JobService.name);
  constructor(
    @InjectRepository(Job) private readonly jobRepository: Repository<Job>,
  ) {}

  addJob(job: JobDTO): boolean {
    throw new Error('Method not implemented.');
  }
  async getJobs(jobIds: number[]): Promise<Job[] | undefined> {
    const jobs: Job[] = await this.jobRepository.findBy({ id: In(jobIds) });
    return jobs;
  }
  async getJob(id: number): Promise<Job | undefined> {
    const job: Job = await this.jobRepository.findOne({ where: { id: id } });
    if (!job) {
      throw new NotFoundException('Job not found');
    }
    return job;
  }
  updateJob(_job: JobDTO): boolean {
    throw new Error('Method not implemented.');
  }
  deleteJob(_id: string): boolean {
    throw new Error('Method not implemented.');
  }
}
