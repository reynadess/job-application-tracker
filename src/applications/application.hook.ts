import { Injectable } from '@nestjs/common';
import { Request, SubjectBeforeFilterHook } from 'nest-casl';
import { ApplicantsService } from 'src/applicants/applicants.service';
import { Applicant } from '../applicants/applicant.entity';

@Injectable()
export class ApplicationHook
  implements SubjectBeforeFilterHook<Applicant, Request>
{
  constructor(private applicantsServices: ApplicantsService) {}

  async run({ params }: Request): Promise<Applicant | undefined> {
    return await this.applicantsServices.findOne(params.username);
  }
}
