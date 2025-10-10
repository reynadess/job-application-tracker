import {
    ConflictException,
    Injectable,
    Logger,
    NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { instanceToPlain, plainToInstance } from 'class-transformer';
import { Repository } from 'typeorm';
import {
    CreateApplicantDto,
    ReturnApplicantDto,
    UpdateApplicantDto,
} from './applicant.dto';
import { Applicant } from './applicant.entity';

@Injectable()
export class ApplicantsService {
    private readonly logger = new Logger(ApplicantsService.name);

    constructor(
        @InjectRepository(Applicant)
        private readonly applicantsRepository: Repository<Applicant>,
    ) {}

    async findOne(username: string): Promise<Applicant | undefined> {
        const applicant: Applicant = await this.applicantsRepository.findOne({
            where: { username },
        });

        if (!applicant) {
            this.logger.error(`Applicant with username ${username} not found`);
            throw new NotFoundException(
                `Applicant with username ${username} not found`,
            );
        }

        return applicant;
    }

    async getApplicant(username: string): Promise<ReturnApplicantDto> {
        const applicant: Applicant = await this.applicantsRepository.findOne({
            where: { username },
        });

        if (!applicant) {
            this.logger.error(`Applicant with username ${username} not found`);
            throw new NotFoundException(
                `Applicant with username ${username} not found`,
            );
        }

        const returnApplicantDto = plainToInstance(
            ReturnApplicantDto,
            applicant,
        );
        return returnApplicantDto;
    }

    async createApplicant(
        createApplicantDto: CreateApplicantDto,
    ): Promise<boolean> {
        const countOfApplicants: number = await this.applicantsRepository.count(
            {
                where: [
                    { username: createApplicantDto.username },
                    { email: createApplicantDto.email },
                ],
            },
        );

        if (countOfApplicants > 0) {
            throw new ConflictException(
                `Applicant with username ${createApplicantDto.username} or email ${createApplicantDto.email} already exists`,
            );
        }

        let applicant: Applicant = plainToInstance(
            Applicant,
            createApplicantDto,
        );
        applicant = this.applicantsRepository.create(applicant);
        await this.applicantsRepository.save(applicant);
        return true;
    }

    /**
     * Check if a username is available for registration
     * @param username - The username to check
     * @returns Promise<boolean> - True if username is available, false if taken
     */
    async isUsernameAvailable(username: string): Promise<boolean> {
        const existingUser = await this.applicantsRepository.findOne({
            where: { username },
        });
        return !existingUser;
    }

    /**
     * Check if an email is available for registration
     * @param email - The email to check
     * @returns Promise<boolean> - True if email is available, false if taken
     */
    async isEmailAvailable(email: string): Promise<boolean> {
        const existingUser = await this.applicantsRepository.findOne({
            where: { email },
        });
        return !existingUser;
    }

    /**
     * Get detailed availability status for username and email
     * @param username - The username to check
     * @param email - The email to check
     * @returns Promise with availability details
     */
    async checkAvailability(username?: string, email?: string): Promise<{
        usernameAvailable?: boolean;
        emailAvailable?: boolean;
        suggestions?: string[];
    }> {
        const result: {
            usernameAvailable?: boolean;
            emailAvailable?: boolean;
            suggestions?: string[];
        } = {};

        if (username) {
            result.usernameAvailable = await this.isUsernameAvailable(username);
            
            // Generate username suggestions if not available
            if (!result.usernameAvailable) {
                result.suggestions = await this.generateUsernameSuggestions(username);
            }
        }

        if (email) {
            result.emailAvailable = await this.isEmailAvailable(email);
        }

        return result;
    }

    /**
     * Generate username suggestions based on the original username
     * @param originalUsername - The original username that's taken
     * @returns Promise<string[]> - Array of suggested usernames
     */
    private async generateUsernameSuggestions(originalUsername: string): Promise<string[]> {
        const suggestions: string[] = [];
        const baseUsername = originalUsername.toLowerCase();
        
        // Try with numbers
        for (let i = 1; i <= 5; i++) {
            const suggestion = `${baseUsername}${i}`;
            if (await this.isUsernameAvailable(suggestion)) {
                suggestions.push(suggestion);
            }
        }

        // Try with random numbers
        for (let i = 0; i < 3 && suggestions.length < 5; i++) {
            const randomNum = Math.floor(Math.random() * 9999) + 1;
            const suggestion = `${baseUsername}${randomNum}`;
            if (await this.isUsernameAvailable(suggestion)) {
                suggestions.push(suggestion);
            }
        }

        // Try with underscore and numbers
        for (let i = 1; i <= 3 && suggestions.length < 5; i++) {
            const suggestion = `${baseUsername}_${i}`;
            if (await this.isUsernameAvailable(suggestion)) {
                suggestions.push(suggestion);
            }
        }

        return suggestions.slice(0, 5); // Return max 5 suggestions
    }

    async updateOne(
        username: string,
        updateApplicantDto: UpdateApplicantDto,
    ): Promise<ReturnApplicantDto> {
        let applicant = await this.applicantsRepository.findOne({
            where: { username },
        });

        if (!applicant) {
            throw new NotFoundException(
                `Applicant with username ${username} not found`,
            );
        }

        // doing this step to ensure that only defined fields are updated
        // and undefined fields are not updated
        updateApplicantDto = instanceToPlain(updateApplicantDto, {
            exposeUnsetFields: false,
        });
        applicant = plainToInstance(
            Applicant,
            {
                ...applicant,
                ...updateApplicantDto,
            },
            {
                exposeUnsetFields: false,
            },
        );

        applicant = await this.applicantsRepository.save(applicant);
        const returnApplicantDto: ReturnApplicantDto = plainToInstance(
            ReturnApplicantDto,
            applicant,
        );
        return returnApplicantDto;
    }

    /**
     * Deletes an applicant by their username.
     * Do not use this method lightly, as it permanently removes the applicant from the database.
     * @param username - The username of the applicant to delete.
     * @returns A promise that resolves when the applicant has been deleted.
     * @throws NotFoundException if no applicant with the given username is found.
     */
    async deleteOne(username: string): Promise<void> {
        const applicant = await this.applicantsRepository.findOne({
            where: { username },
            select: { id: true, username: true },
        });

        if (!applicant) {
            throw new NotFoundException(
                `Applicant with username ${username} not found`,
            );
        }

        await this.applicantsRepository.remove(applicant);
    }

    async updateRefreshToken(userId: number, refreshToken: string | null) {
        const applicant: Applicant | undefined =
            await this.applicantsRepository.findOne({
                where: { id: userId },
                select: { id: true, username: true, refreshToken: true },
            });

        if (!applicant) {
            throw new NotFoundException(
                `Applicant with id ${userId} not found`,
            );
        }

        applicant.refreshToken = refreshToken;

        await this.applicantsRepository.save(applicant);
    }
}
