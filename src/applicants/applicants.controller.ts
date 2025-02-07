import { ForbiddenError } from '@casl/ability';
import {
  Controller,
  Get,
  NotFoundException,
  Param,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AbilitiesGuard } from 'src/ability/abilities.guard';
import { CheckAbilities } from 'src/ability/ability.decorator';
import { AbilityFactory } from 'src/ability/ability.factory';
import { Action } from 'src/ability/action.enum';
import { Applicant } from './applicant.entity';
import { ApplicantsService } from './applicants.service';

@Controller('applicants')
@ApiBearerAuth()
export class ApplicantsController {
  constructor(
    private readonly applicantsService: ApplicantsService,
    private readonly abilityFactory: AbilityFactory,
  ) {}

  @Get(':username')
  @UseGuards(AbilitiesGuard)
  @CheckAbilities({ action: Action.Read, subject: Applicant })
  async getApplicantById(
    @Req() req,
    @Param('username') username: string,
  ): Promise<Applicant | undefined> {
    const currentUser = await this.applicantsService.findOne(req.user.username);
    const applicant = await this.applicantsService.findOne(username);
    if (!applicant) {
      throw new NotFoundException(
        `Applicant with username ${username} not found`,
      );
    }
    const ability = this.abilityFactory.defineAbility(currentUser);
    ForbiddenError.from(ability).throwUnlessCan(Action.Read, Applicant);
    return applicant;
  }
}
