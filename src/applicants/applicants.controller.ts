import {
  Controller,
  Get,
  NotFoundException,
  Param,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AccessGuard, Actions, UseAbility } from 'nest-casl';
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
}
