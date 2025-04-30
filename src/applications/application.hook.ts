import { Injectable } from '@nestjs/common';
import { Request, SubjectBeforeFilterHook } from 'nest-casl';
import { ApplicationsService } from './applications.service';
import { Application } from './entities/application.entity';

@Injectable()
export class ApplicationHook
  implements SubjectBeforeFilterHook<Application, Request>
{
  constructor(private readonly applicationService: ApplicationsService) {}

  async run(req: Request): Promise<Application | undefined> {
    return await this.applicationService.findOne(
      Number(req.params.id),
      Number(req.user.id),
    );
  }
}
