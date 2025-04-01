import { Body, Controller, Post, Req } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { ApplicationsService } from './applications.service';
import { CreateApplicationDto } from './dto/create-application.dto';

@Controller('applications')
@ApiBearerAuth()
export class ApplicationsController {
  constructor(private readonly applicationsService: ApplicationsService) {}

  @Post()
  async create(@Req() req, @Body() createApplicationDto: CreateApplicationDto) {
    return this.applicationsService.create(createApplicationDto, req.user.id);
  }
}
