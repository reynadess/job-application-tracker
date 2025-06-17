import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    ParseIntPipe,
    Post,
    Put,
    Query,
    UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Job } from './job.entity';
import { JobService } from './jobs.service';
import { CreateJobDto, UpdateJobDto } from './job.dto';
import { AccessGuard, Actions, UseAbility } from 'nest-casl';
import { JobStatus } from './job-status.enum';

@ApiBearerAuth()
@Controller('jobs')
export class JobsController {
    constructor(private readonly jobsService: JobService) {}

    @UseGuards(AccessGuard)
    @UseAbility(Actions.create, Job)
    @Post()
    async addJob(@Body() createJobDto: CreateJobDto) {
        return await this.jobsService.addJob(createJobDto);
    }
    @Get()
    async getAllJobs(@Query('status') status?: JobStatus) {
        if (status) {
            return await this.jobsService.getJobsByStatus(status);
        }
        return this.jobsService.getAllJobs();
    }

    @Get('company/:companyId')
    async getJobsByCompany(
        @Param('companyId', ParseIntPipe) companyId: number,
    ) {
        return await this.jobsService.getJobsByCompany(companyId);
    }

    @Get('bulk')
    async getJobsbyIds(@Query('ids') ids: string) {
        const jobIds = ids.split(',').map((id) => parseInt(id.trim()));

        return await this.jobsService.getJobsbyIds(jobIds);
    }

    @Get(':id')
    async getJob(@Param('id', ParseIntPipe) id: number) {
        return this.jobsService.getJob(id);
    }

    @UseGuards(AccessGuard)
    @UseAbility(Actions.update , Job)
    @Put(':id')
    async updateJob(
        @Param('id', ParseIntPipe) id: number,
        @Body() updateJobDto: UpdateJobDto,
    ) {
        return this.jobsService.updateJob(id, updateJobDto);
    }

    @UseGuards(AccessGuard)
    @UseAbility(Actions.delete , Job)
    @Delete(':id')
    async deleteJob(@Param('id' ,ParseIntPipe) id: number){
      await this.jobsService.deleteJob(id);  
    }
}
