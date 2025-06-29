import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    ParseIntPipe,
    Patch,
    Post,
    Query,
    Req,
    UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Job } from './entities/job.entity';
import { JobService } from './jobs.service';
import { CreateJobDto, ReturnJobDto, UpdateJobDto } from './dto/job.dto';
import { AccessGuard, Actions, UseAbility } from 'nest-casl';

@ApiBearerAuth()
@Controller('jobs')
export class JobsController {
    constructor(private readonly jobsService: JobService) {}

    @UseGuards(AccessGuard)
    @UseAbility(Actions.create, Job)
    @Post()
    async createJob(@Req() req, @Body() createJobDto: CreateJobDto) {
        return await this.jobsService.createJob(createJobDto, req.user.id);
    }

    @UseGuards(AccessGuard)
    @UseAbility(Actions.read, Job)
    @Get('ids')
    async getJobsbyIds(@Query('ids') ids: string) {
        const jobIds = ids.split(',').map((id) => parseInt(id.trim()));

        return await this.jobsService.getJobsbyIds(jobIds);
    }
    @UseGuards(AccessGuard)
    @UseAbility(Actions.read, Job)
    @Get()
    async getAllJobs(): Promise<ReturnJobDto[]> {
        return this.jobsService.getAllJobs();
    }

    @UseGuards(AccessGuard)
    @UseAbility(Actions.read, Job)
    @Get(':id')
    async getJob(@Param('id', ParseIntPipe) id: number): Promise<ReturnJobDto> {
        return this.jobsService.getJob(id);
    }

    @UseGuards(AccessGuard)
    @UseAbility(Actions.update, Job)
    @Patch(':id')
    async updateJob(
        @Param('id', ParseIntPipe) id: number,
        @Body() updateJobDto: UpdateJobDto,
    ) {
        return this.jobsService.updateJob(id, updateJobDto);
    }

    @UseGuards(AccessGuard)
    @UseAbility(Actions.delete, Job)
    @Delete(':id')
    async deleteJob(@Param('id', ParseIntPipe) id: number) {
        await this.jobsService.deleteJob(id);
    }
}
