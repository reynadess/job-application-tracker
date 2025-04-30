import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';
import { DataSource, Repository } from 'typeorm';
import { Job } from '../jobs/job.entity';
import { CreateApplicationDto } from './dto/create-application.dto';
import { Application } from './entities/application.entity';

@Injectable()
export class ApplicationsService {
  constructor(
    @InjectRepository(Application)
    private readonly applicationsReposirtory: Repository<Application>,
    private readonly dataSource: DataSource,
  ) {}

  private readonly logger = new Logger(ApplicationsService.name);

  async getAllApplications(userId: number) {
    return 'Get all applications';
  }

  async getApplicationById(id: number, userId: number) {
    return 'Get application by id';
  }

  async create(
    application: CreateApplicationDto,
    userId: number,
  ): Promise<Application> {
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
      applicationEntity = await queryRunner.manager.save(applicationEntity);
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
    return applicationEntity;
  }
}
