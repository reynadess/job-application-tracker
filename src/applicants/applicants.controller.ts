import {
  Controller,
  Get,
  NotFoundException,
  Param,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AbilitiesGuard } from 'src/ability/abilities.guard';
import { CheckAbilities } from 'src/ability/ability.decorator';
import { Action } from 'src/ability/action.enum';
import { Applicant } from './applicant.entity';
import { ApplicantsService } from './applicants.service';

@Controller('applicants')
@ApiBearerAuth()
export class ApplicantsController {
  constructor(private readonly applicantsService: ApplicantsService) {}

  @Get(':username')
  @UseGuards(AbilitiesGuard)
  @CheckAbilities({ action: Action.Read, subject: Applicant })
  async getApplicantById(
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
