import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UpdateApplicantDto } from './applicant.dto';
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
        updateData: UpdateApplicantDto,
    ): Promise<Applicant> {
        const applicant = await this.applicantsRepository.findOne({
            where: { username },
        });

        if (!applicant) {
            throw new NotFoundException(
                `Applicant with username ${username} not found`,
            );
        }

        applicant.firstName = updateData.firstName ?? applicant.firstName;
        applicant.lastName = updateData.lastName ?? applicant.lastName;
        applicant.email = updateData.email ?? applicant.email;

        return await this.applicantsRepository.save(applicant);
    }
}
