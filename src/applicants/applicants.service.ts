import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateApplicantDto } from './applicant.dto';
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

  async createOne(createApplicantDto: CreateApplicantDto): Promise<void> {
    const applicant: Applicant =
      this.applicantsRepository.create(createApplicantDto);
    await this.applicantsRepository.save(applicant);
  }
}
