import {
    Injectable,
    InternalServerErrorException,
    Logger,
    NotFoundException,
    UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository, UpdateResult } from 'typeorm';
import { CreateJobDto, ReturnJobDto, UpdateJobDto } from './dto/job.dto';
import { Job } from './entities/job.entity';
import { JobStatus } from './job-status.enum';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class JobService {
    private readonly logger = new Logger(JobService.name);
    constructor(
        @InjectRepository(Job) private readonly jobRepository: Repository<Job>,
    ) {}

    async addJob(jobDto: CreateJobDto, userId: number): Promise<Job> {
        try {
            const job = this.jobRepository.create({
                ...jobDto,
                status: jobDto.status || JobStatus.Open,
                recruiterId: userId,
            });

            const savedJob = await this.jobRepository.save(job);
            if (!savedJob) {
                throw new InternalServerErrorException(
                    'Something went wrong try again',
                );
            }
            this.logger.log(`Job created with ID : ${savedJob.id}`);
            return savedJob;
        } catch (error) {
            this.logger.error(`Failed to create job : ${error.message}`);
            throw error;
        }
    }
    async getJob(id: number): Promise<ReturnJobDto> {
        const job: Job = await this.jobRepository.findOne({
            where: { id },
        });
        if (!job) {
            throw new NotFoundException(`Job with Id ${id} not found`);
        }
        return plainToInstance(ReturnJobDto, job);
    }
    async getJobsbyIds(jobIds: number[]): Promise<ReturnJobDto[]> {
        const jobs = await this.jobRepository.findBy({ id: In(jobIds) });
        if (!jobs || jobs.length === 0) {
            throw new NotFoundException('Jobs not found');
        }
        return jobs.map((job) => plainToInstance(ReturnJobDto, job));
    }
    async getAllJobs(): Promise<ReturnJobDto[]> {
        const jobs = await this.jobRepository.find({
            order: { createdAt: 'DESC' },
        });

        return jobs.map((job) => plainToInstance(ReturnJobDto, job));
    }

    async updateJob(id: number, jobDto: UpdateJobDto): Promise<Job> {
        const job = await this.getJob(id);
        if (!job) {
            throw new NotFoundException(`Job with id ${id} not found`);
        }
        Object.assign(job, jobDto);
        const updateJob = await this.jobRepository.save(job);
        if (!updateJob) {
            throw new InternalServerErrorException('Internal server error');
        }
        this.logger.log(`Job with ID ${id} updated successfully`);
        return updateJob;
    }
    async deleteJob(id: number): Promise<boolean> {
        const job = await this.getJob(id);
        const deletedJob: UpdateResult =
            await this.jobRepository.softDelete(id);
        if (deletedJob.affected === 0) {
            this.logger.log(`Job with id ${id} not deleted`);
            throw new UnprocessableEntityException('Job not deleted');
        }
        this.logger.log(`Job with Id ${id} soft deleted successfully`);
        return deletedJob.affected > 0;
    }
}
