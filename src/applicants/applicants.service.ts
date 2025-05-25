import {
    ConflictException,
    Injectable,
    Logger,
    NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';
import { Repository } from 'typeorm';
import { CreateApplicantDto, UpdateApplicantDto } from './applicant.dto';
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

    async createOne(
        createApplicantDto: CreateApplicantDto,
    ): Promise<Applicant> {
        const applicantExists = await this.applicantsRepository.findOne({
            select: {
                username: true,
                email: true,
            },
            where: [
                { username: createApplicantDto.username },
                { email: createApplicantDto.email },
            ],
        });

        if (applicantExists) {
            this.logger.error(
                `Applicant with username ${createApplicantDto.username} or email ${createApplicantDto.email} already exists`,
            );
            throw new ConflictException(
                `Applicant with username ${createApplicantDto.username} or email ${createApplicantDto.email} already exists`,
            );
        }

        let applicant: Applicant = plainToInstance(
            Applicant,
            createApplicantDto,
        );
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
