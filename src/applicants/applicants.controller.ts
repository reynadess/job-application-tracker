import {
    Body,
    Controller,
    Get,
    NotFoundException,
    Param,
    Patch,
    UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AccessGuard, Actions, UseAbility } from 'nest-casl';
import { UpdateApplicantDto } from './applicant.dto';
import { Applicant } from './applicant.entity';
import { ApplicantHook } from './applicant.hook';
import { ApplicantsService } from './applicants.service';
@Controller('applicants')
@ApiBearerAuth()
export class ApplicantsController {
    constructor(private readonly applicantsService: ApplicantsService) {}

    @Get(':username')
    @UseGuards(AccessGuard)
    @UseAbility(Actions.read, Applicant, ApplicantHook)
    async getApplicantByUsername(
        @Param('username') username: string,
    ): Promise<Applicant | undefined> {
        const applicant = await this.applicantsService.findOne(username);
        if (!applicant) {
            throw new NotFoundException(
                `Applicant with username ${username} not found`,
            );
        }
        return applicant;
    }

    @Patch(':username')
    @UseGuards(AccessGuard)
    @UseAbility(Actions.read, Applicant, ApplicantHook)
    async updateApplicant(
        @Param('username') username: string,
        @Body() updateData: UpdateApplicantDto,
    ): Promise<Applicant> {
        const updatedApplicant = await this.applicantsService.updateOne(
            username,
            updateData,
        );
        return updatedApplicant;
    }
}
