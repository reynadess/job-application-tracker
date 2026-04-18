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
import { QueryDto } from 'src/common/dto/Query.dto';

@Injectable()
export class JobService {
    private readonly logger = new Logger(JobService.name);
    constructor(
        @InjectRepository(Job) private readonly jobRepository: Repository<Job>,
    ) {}

    async createJob(jobDto: CreateJobDto, userId: number): Promise<Job> {
        try {
            const job = this.jobRepository.create({
                ...jobDto,
                status: jobDto.status || JobStatus.Open,
            });

            const savedJob = await this.jobRepository.save(job);
            this.logger.log(`Job created with ID : ${savedJob.id}`);
            return savedJob;
        } catch (error) {
            this.logger.error(`Failed to create job : ${error}`);
            throw new InternalServerErrorException('Failed to create Job');
        }
    }
    async getJob(id: number): Promise<Job> {
        const job: Job = await this.jobRepository.findOne({
            where: { id },
        });
        if (!job) {
            throw new NotFoundException(`Job with Id ${id} not found`);
        }
        return plainToInstance(Job, job);
    }
    async getJobsbyIds(jobIds: number[]): Promise<Job[]> {
        const jobs = await this.jobRepository.findBy({ id: In(jobIds) });
        if (!jobs || jobs.length === 0) {
            throw new NotFoundException('Jobs not found');
        }
        return jobs.map((job) => plainToInstance(Job, job));
    }
    async getAllJobs(queryDto: QueryDto): Promise<ReturnJobDto[]> {
        let { page, limit } = queryDto;
        page = Math.min(queryDto.page, 50);
        limit = Math.min(queryDto.limit, 100);

        const skip = (page - 1) * limit;
        const take = limit;

        const jobs = await this.jobRepository.find({
            skip: skip,
            take: take,
            order: { createdAt: 'DESC' },
        });

        return jobs.map((job) => plainToInstance(ReturnJobDto, job));
    }

    async updateJob(id: number, jobDto: UpdateJobDto): Promise<Job> {
        try {
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
        } catch (error) {
            this.logger.log(`Failed to update job : ${error}`);
            throw new InternalServerErrorException(`Something went wrong`);
        }
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
