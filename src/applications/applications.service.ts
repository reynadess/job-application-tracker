import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Application } from './entities/application.entity';

@Injectable()
export class ApplicationsService {
  private readonly logger = new Logger(ApplicationsService.name);

  constructor(
    @InjectRepository(Application)
    private readonly applicationsReposirtory: Repository<Application>,
  ) {}

  async getAllApplications(userId: number) {
    return await this.applicationsReposirtory.find({ where: { userId } });
  }

  async getApplicationById(id: number, userId: number) {
    return await this.applicationsReposirtory.findOne({
      where: { id, userId },
    });
  }

  async createApplication(application: Application) {
    const newApplication = this.applicationsReposirtory.create(application);
    return await this.applicationsReposirtory.save(newApplication);
  }
}
