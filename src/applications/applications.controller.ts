import { Body, Controller, Post, Req } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { ApplicationsService } from './applications.service';
import { CreateApplicationDto } from './dto/create-application.dto';

@Controller('applications')
@ApiBearerAuth()
export class ApplicationsController {
  constructor(private readonly applicationsService: ApplicationsService) {}

  // TODO reynadess Guards for this route
  @Post()
  async create(@Req() req, @Body() createApplicationDto: CreateApplicationDto) {
    this.applicationsService.create(createApplicationDto, req.user.id);
  }
}
