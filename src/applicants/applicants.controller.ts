import { Body, Controller, Get, Param, Patch, UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AccessGuard, Actions, UseAbility } from 'nest-casl';
import { ReturnApplicantDto, UpdateApplicantDto } from './applicant.dto';
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
    ): Promise<ReturnApplicantDto | undefined> {
        return await this.applicantsService.getApplicant(username);
    }

    @Patch(':username')
    @UseGuards(AccessGuard)
    @UseAbility(Actions.read, Applicant, ApplicantHook)
    async updateApplicant(
        @Param('username') username: string,
        @Body() updateData: UpdateApplicantDto,
    ): Promise<ReturnApplicantDto> {
        const updatedApplicant: ReturnApplicantDto =
            await this.applicantsService.updateOne(username, updateData);
        return updatedApplicant;
    }
}
