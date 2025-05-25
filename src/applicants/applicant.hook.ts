import { Injectable } from '@nestjs/common';
import { Request, SubjectBeforeFilterHook } from 'nest-casl';
import { Applicant } from './applicant.entity';
import { ApplicantsService } from './applicants.service';

@Injectable()
export class ApplicantHook
    implements SubjectBeforeFilterHook<Applicant, Request>
{
    constructor(private readonly applicantsService: ApplicantsService) {}

    async run({ params }: Request): Promise<Applicant | undefined> {
        return await this.applicantsService.findOne(params.username);
    }
}
