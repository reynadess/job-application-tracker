import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AccessGuard } from 'nest-casl/dist/access.guard';
import { ApplicationsService } from './applications.service';
import { Application } from './entities/application.entity';

@Controller('applications')
@ApiBearerAuth()
@UseGuards(AccessGuard)
// @UseAbility(Actions.read, Application, 'ApplicationHook')
export class ApplicationsController {
  constructor(private readonly applicationsService: ApplicationsService) {}
  @Get('/')
  async getAllApplications(@Req() request: Request): Promise<Application[]> {
    const userId: number = (request as any).user.userId;
    return await this.applicationsService.getAllApplications(userId);
  }
}
