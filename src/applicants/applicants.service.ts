import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Applicant } from './applicant.entity';

@Injectable()
export class ApplicantsService {
  private readonly logger = new Logger(ApplicantsService.name);

  constructor(
    @InjectRepository(Applicant)
    private readonly applicantsRepository: Repository<Applicant>,
  ) {}

  async findOne(username: string): Promise<Applicant | undefined> {
    return await this.applicantsRepository.findOne({
      where: { username },
    });
  }

  async createOne(user: Applicant): Promise<void> {
    user = this.applicantsRepository.create(user);
    await this.applicantsRepository.save(user);
  }
}
