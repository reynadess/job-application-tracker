import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';
import { DataSource, Repository, UpdateResult } from 'typeorm';
import { Job } from '../jobs/job.entity';
import { JobService } from '../jobs/jobs.service';
import { ApplicationStatus } from './application-status.enum';
import {
    CreateApplicationDto,
    ReturnApplicationDto,
} from './dto/create-application.dto';
import { UpdateApplicationDto } from './dto/update-application.dto';
import { Application } from './entities/application.entity';

@Injectable()
export class ApplicationsService {
    constructor(
        @InjectRepository(Application)
        private readonly applicationsReposirtory: Repository<Application>,
        private readonly dataSource: DataSource,
        private readonly jobService: JobService,
    ) {}

    private readonly logger = new Logger(ApplicationsService.name);

    async getApplications(
        userId: number,
        skip = 0,
        take = 100,
    ): Promise<undefined | ReturnApplicationDto[]> {
        const applications: Application[] =
            await this.applicationsReposirtory.find({
                where: { userId },
                skip: skip,
                take: take,
                order: {
                    updatedAt: 'DESC',
                },
            });
        const jobIds: number[] = applications.map(
            (application) => application.jobId,
        );
        const jobs: Job[] = await this.jobService.getJobs(jobIds);
        let returnApplications: ReturnApplicationDto[] = [];
        for (const application of applications) {
            const job: Job = jobs.find((job) => job.id === application.jobId);
            if (job) {
                returnApplications.push(
                    new ReturnApplicationDto(application, job),
                );
            }
        }
        return returnApplications;
    }

    async getApplication(id: number): Promise<Application | undefined> {
        const application: Application =
            await this.applicationsReposirtory.findOne({
                where: { id },
            });
        if (!application) {
            throw new NotFoundException(`Application with ID ${id} not found}`);
        }
        return application;
    }

    async findOne(
        id: number,
        userId: number,
    ): Promise<ReturnApplicationDto | undefined> {
        const application: Application =
            await this.applicationsReposirtory.findOne({
                where: { id, userId },
            });
        if (!application?.jobId) {
            throw new NotFoundException(
                `Application with ID ${id} not found for user ID ${userId}`,
            );
        }
        this.logger.debug(
            `Application found successfully: ${application.id} for user ID ${userId}`,
        );
        const job: Job = await this.jobService.getJob(application.jobId);
        if (!job) {
            throw new NotFoundException(
                `Job with ID ${application.jobId} not found for user ID ${userId}`,
            );
        }
        this.logger.debug(
            `Job found successfully: ${job.id} for user ID ${userId}`,
        );
        let returnApplicationDto: ReturnApplicationDto =
            new ReturnApplicationDto(application, job);
        return returnApplicationDto;
    }

    async create(
        application: CreateApplicationDto,
        userId: number,
    ): Promise<ReturnApplicationDto> {
        let job = plainToInstance(Job, application);
        let applicationEntity = new Application();
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            job = await queryRunner.manager.save(job);
            this.logger.debug(`Job created successfully: ${job.company}`);
            applicationEntity.jobId = job.id;
            applicationEntity.userId = userId;
            applicationEntity.status = application.status|| ApplicationStatus.Apply;
            applicationEntity.appliedDate = application.appliedDate || new Date();
            applicationEntity =
                await queryRunner.manager.save(applicationEntity);
            this.logger.debug(
                `Application created successfully for Application ID: ${applicationEntity.id} for Company ${job.company}`,
            );
            await queryRunner.commitTransaction();
        } catch (error) {
            this.logger.error('Error creating application', error);
            await queryRunner.rollbackTransaction();
            throw error;
        } finally {
            await queryRunner.release();
        }
        const returnApplicationDto = new ReturnApplicationDto(
            applicationEntity,
            job,
        );
        return returnApplicationDto;
    }

    async updateApplication(
        id: number,
        updateApplicationDto: UpdateApplicationDto,
    ): Promise<ReturnApplicationDto | undefined> {
        let application: Application =
            await this.applicationsReposirtory.findOne({
                where: { id },
            });

        if (!application) {
            throw new NotFoundException(`Application with ID ${id} not found`);
        }
        application.status = updateApplicationDto.status;
        application.appliedDate = updateApplicationDto.appliedDate;
        application = await this.applicationsReposirtory.save(application);
        const returnApplicationDto: ReturnApplicationDto =
            new ReturnApplicationDto(application);
        return returnApplicationDto;
    }

    async deleteApplication(id: number): Promise<boolean> {
        const deleteResult: UpdateResult =
            await this.applicationsReposirtory.softDelete(id);
        return deleteResult.affected > 0;
    }
}
