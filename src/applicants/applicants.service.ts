import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
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

  async updateOne(
    username: string,
    updateData: Partial<Applicant>,
  ): Promise<Applicant> {
    const applicant = await this.applicantsRepository.findOne({
      where: { username },
    });

    if (!applicant) {
      throw new NotFoundException(
        `Applicant with username ${username} not found`,
      );
    }

    // Add validation logic here
    if (updateData.hasOwnProperty('username')) {
      throw new BadRequestException('Updating username is not allowed');
    }

    // Only allow updates to these fields
    const allowedFields = ['firstName', 'lastName', 'email'];

    const filteredUpdateData = Object.fromEntries(
      Object.entries(updateData).filter(([key]) => allowedFields.includes(key)),
    );

    Object.assign(applicant, filteredUpdateData);

    return await this.applicantsRepository.save(applicant);
  }
}
