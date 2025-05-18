import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AccessGuard, Actions, UseAbility } from 'nest-casl';
import { ApplicationHook } from './application.hook';
import { ApplicationsService } from './applications.service';
import {
  CreateApplicationDto,
  ReturnApplicationDto,
} from './dto/create-application.dto';
import { Application } from './entities/application.entity';

@Controller('applications')
@ApiBearerAuth()
export class ApplicationsController {
  constructor(private readonly applicationsService: ApplicationsService) {}

  @UseGuards(AccessGuard)
  @UseAbility(Actions.create, Application)
  @Post()
  async create(@Req() req, @Body() createApplicationDto: CreateApplicationDto) {
    this.applicationsService.create(createApplicationDto, req.user.id);
  }

  @UseGuards(AccessGuard)
  @UseAbility(Actions.read, Application, ApplicationHook)
  @Get(':id')
  async getApplicationById(@Req() req, @Param('id') id: number) {
    return await this.applicationsService.findOne(id, req.user.id);
  }

  @UseGuards(AccessGuard)
  @UseAbility(Actions.read, Application)
  @Get()
  async getAllApplications(@Req() req): Promise<ReturnApplicationDto[]> {
    return await this.applicationsService.getAllApplications(req.user.id);
  }
}
