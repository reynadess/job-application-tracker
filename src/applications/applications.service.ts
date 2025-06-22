import {
    Injectable,
    Logger,
    NotFoundException,
    UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { instanceToPlain, plainToInstance } from 'class-transformer';
import { DataSource, Repository, UpdateResult } from 'typeorm';
import { JobService } from '../jobs/jobs.service';
import { ApplicationStatus } from './application-status.enum';
import {
    CreateApplicationDto,
    ReturnApplicationDto,
} from './dto/create-application.dto';
import { UpdateApplicationDto } from './dto/update-application.dto';
import { Application } from './entities/application.entity';
import { Job } from 'src/jobs/entities/job.entity';
import { ReturnJobDto } from 'src/jobs/dto/job.dto';
import { JobStatus } from 'src/jobs/job-status.enum';

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
    ): Promise<ReturnApplicationDto[]> {
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
        const jobs: ReturnJobDto[] = await this.jobService.getJobsbyIds(jobIds);
        let returnApplications: ReturnApplicationDto[] = [];
        for (const application of applications) {
            const job: ReturnJobDto = jobs.find(
                (job) => job.id === application.jobId,
            );
            if (job) {
                const returnApplication: ReturnApplicationDto =
                    await this.getReturnApplicationDto(job, application);
                returnApplications.push(returnApplication);
            }
        }
        return returnApplications;
    }

    async getApplication(id: number): Promise<Application> {
        const application: Application =
            await this.applicationsReposirtory.findOne({
                where: { id },
            });
        if (!application) {
            throw new NotFoundException(`Application with ID ${id} not found`);
        }
        return application;
    }

    async findOne(id: number, userId: number): Promise<ReturnApplicationDto> {
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
        const job: ReturnJobDto = await this.jobService.getJob(
            application.jobId,
        );
        if (!job) {
            throw new NotFoundException(
                `Job with ID ${application.jobId} not found for user ID ${userId}`,
            );
        }
        this.logger.debug(
            `Job found successfully: ${job.id} for user ID ${userId}`,
        );
        const returnApplicationDto = await this.getReturnApplicationDto(
            job,
            application,
        );
        return returnApplicationDto;
    }

    async create(
        application: CreateApplicationDto,
        userId: number,
    ): Promise<ReturnApplicationDto> {
        // Create a Job entity instance instead of DTO
        let jobEntity = new Job();
        jobEntity.role = application.role;
        jobEntity.company = application.company;
        jobEntity.jobLink = application.jobLink;
        jobEntity.city = application.city;
        jobEntity.state = application.state;
        jobEntity.country = application.country;
        jobEntity.description = application.description;
        jobEntity.ctcOffered = application.ctcOffered;
        jobEntity.status = JobStatus.Open;

        let applicationEntity = new Application();
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        let returnApplicationDto: ReturnApplicationDto;

        try {
            // Save the Job entity
            const savedJob = await queryRunner.manager.save(jobEntity);
            this.logger.debug(`Job created successfully: ${savedJob.company}`);

            // Create application with the saved job ID
            applicationEntity.jobId = savedJob.id;
            applicationEntity.userId = userId;
            applicationEntity.status =
                application.status || ApplicationStatus.Apply;
            applicationEntity.appliedDate =
                application.appliedDate || new Date();

            const savedApplication =
                await queryRunner.manager.save(applicationEntity);
            this.logger.debug(
                `Application created successfully for Application ID: ${savedApplication.id} for Company ${savedJob.company}`,
            );

            await queryRunner.commitTransaction();

            // Convert saved job to ReturnJobDto for the response
            const jobDto = plainToInstance(ReturnJobDto, savedJob);
            returnApplicationDto = await this.getReturnApplicationDto(
                jobDto,
                savedApplication,
            );
        } catch (error) {
            this.logger.error('Error creating application', error);
            await queryRunner.rollbackTransaction();
            throw error;
        } finally {
            await queryRunner.release();
        }

        return returnApplicationDto;
    }

    async updateApplication(
        id: number,
        updateApplicationDto: UpdateApplicationDto,
    ): Promise<ReturnApplicationDto> {
        let application: Application =
            await this.applicationsReposirtory.findOne({
                where: { id },
            });

        if (!application) {
            throw new NotFoundException(`Application with ID ${id} not found`);
        }
        const updateApplicationPlainObject = instanceToPlain(
            updateApplicationDto,
            { exposeUnsetFields: false },
        );
        application = plainToInstance(Application, {
            ...application,
            ...updateApplicationPlainObject,
        });
        const savedApplication =
            await this.applicationsReposirtory.save(application);
        const returnApplicationDto: ReturnApplicationDto =
            await this.getReturnApplicationDto(undefined, savedApplication);
        return returnApplicationDto;
    }

    async deleteApplication(id: number): Promise<boolean> {
        const deleteResult: UpdateResult =
            await this.applicationsReposirtory.softDelete(id);
        if (deleteResult.affected === 0) {
            this.logger.error(`Application not deleted ID: ${id}`);
            throw new UnprocessableEntityException(`Application not deleted`);
        }
        return deleteResult.affected > 0;
    }

    async getReturnApplicationDto(
        job: ReturnJobDto,
        application: Application,
    ): Promise<ReturnApplicationDto> {
        const returnApplicationDto: ReturnApplicationDto = plainToInstance(
            ReturnApplicationDto,
            {
                ...application,
                ...job,
            },
        );
        returnApplicationDto.id = application?.id ?? undefined;
        returnApplicationDto.jobId = job?.id ?? undefined;
        returnApplicationDto.userId = application?.userId ?? undefined;
        returnApplicationDto.status = application?.status ?? undefined;
        return returnApplicationDto;
    }
}
