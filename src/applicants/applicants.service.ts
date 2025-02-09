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

  async createOne(applicant: Applicant): Promise<Applicant> {
    applicant = this.applicantsRepository.create(applicant);
    applicant = await this.applicantsRepository.save(applicant);
    return applicant;
  }
}
