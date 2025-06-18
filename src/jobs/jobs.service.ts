import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { CreateJobDto, UpdateJobDto } from './job.dto';
import { Job } from './job.entity';
import { JobStatus } from './job-status.enum';

@Injectable()
export class JobService {
    private readonly logger = new Logger(JobService.name);
    constructor(
        @InjectRepository(Job) private readonly jobRepository: Repository<Job>,
    ) {}

    async addJob(jobDto: CreateJobDto): Promise<Job> {
        try {
            const job = this.jobRepository.create({
                ...jobDto,
                status: jobDto.status || JobStatus.Open,
            });
            const savedJob = await this.jobRepository.save(job);
            this.logger.log(`Job created with ID : ${savedJob.id}`);
            return savedJob;
        } catch (error) {
            this.logger.error(`Failed to create job : ${error.message}`);
            throw error;
        }
    }
    async getAllJobs(): Promise<Job[]> {
        try {
            return await this.jobRepository.find({
                order: { createdAt: 'DESC' },
            });
        } catch (error) {
            this.logger.error(`Failed to fetch jobs: ${error.message}`);
            throw error;
        }
    }

    async getJobsbyIds(jobIds: number[]): Promise<Job[]> {
        try {
            const jobs = await this.jobRepository.findBy({ id: In(jobIds) });
            return jobs;
        } catch (error) {
            this.logger.error(`Failed to fetch jobs by Ids : ${error.message}`);
            throw error;
        }
    }
    async getJob(id: number): Promise<Job> {
        try {
            const job: Job = await this.jobRepository.findOne({
                where: { id },
            });
            if (!job) {
                throw new NotFoundException(`Job with Id ${id} not found`);
            }
            return job;
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            this.logger.error(
                `Failed to fetch job with ID : ${id} : ${error.message}`,
            );
            throw error;
        }
    }
    async updateJob(id: number, jobDto: UpdateJobDto): Promise<Job> {
        try {
            const job = await this.getJob(id);
            Object.assign(job, jobDto);
            const updateJob = await this.jobRepository.save(job);
            this.logger.log(`Job with ID ${id} updated successfully`);
            return updateJob;
        } catch (error) {
            this.logger.error(
                `Failed to update job With ID ${id} : ${error.message}`,
            );
            throw error;
        }
    }
    async deleteJob(id: number): Promise<void> {
        try {
            const job = await this.getJob(id);
            await this.jobRepository.remove(job);
            this.logger.log(`Job with ID ${id} deleted successfully`);
        } catch (error) {
            this.logger.error(
                `Failed to delete job with id ${id} : ${error.message}`,
            );
            throw error;
        }
    }

    async getJobsByStatus(status: JobStatus): Promise<Job[]> {
        try {
            return await this.jobRepository.find({
                where: { status },
                order: { createdAt: 'DESC' },
            });
        } catch (error) {
            this.logger.error(
                `Failed to fetch jobs by status : ${error.message}`,
            );
            throw error;
        }
    }

    async getJobsByCompany(companyId: number): Promise<Job[]> {
        try {
            return this.jobRepository.find({
                where: { companyId },
                order: { createdAt: 'DESC' },
            });
        } catch (error) {
            this.logger.error(
                `Failed to Fetch jobs by company : ${error.message}`,
            );
            throw error;
        }
    }
}
