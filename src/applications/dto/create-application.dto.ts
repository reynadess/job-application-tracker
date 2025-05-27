import { IsEnum, IsNumber, IsOptional, IsString, IsUrl, Length, Min } from 'class-validator';
import { Job } from '../../jobs/job.entity';
import { ApplicationStatus } from '../application-status.enum';
import { Application } from '../entities/application.entity';

export class CreateApplicationDto {
    @Length(1, 255)
    @IsString()
    role: string;

    @Length(1, 255)
    @IsOptional()
    company: string;

    @IsUrl()
    jobLink: string;

    @IsOptional()
    city: string;

    @IsOptional()
    state: string;

    @IsOptional()
    country: string;

    @IsOptional()
    description: string;

    @IsOptional()
    @IsNumber()
    @Min(0)
    ctcOffered: number;

    @IsEnum(ApplicationStatus)
    status: ApplicationStatus;

    @IsOptional()
    appliedDate: Date;
}

export class ReturnApplicationDto {
    id: number;
    userId: number;
    jobId: number;

    @Length(1, 255)
    @IsString()
    role: string;

    @Length(1, 255)
    @IsOptional()
    company: string;

    @IsUrl()
    jobLink: string;

    @IsOptional()
    city: string;

    @IsOptional()
    state: string;

    @IsOptional()
    country: string;

    @IsOptional()
    description: string;

    @IsOptional()
    ctcOffered: number;

    @IsEnum(ApplicationStatus)
    status: ApplicationStatus;

    @IsOptional()
    appliedDate: Date;

    constructor(application?: Partial<Application>, job?: Partial<Job>) {
        this.id = application?.id;
        this.userId = application?.userId;
        this.jobId = application?.jobId;
        this.role = job?.role;
        this.company = job?.company;
        this.jobLink = job?.jobLink;
        this.city = job?.city;
        this.state = job?.state;
        this.country = job?.country;
        this.description = job?.description;
        this.status = application?.status;
        this.appliedDate = application?.appliedDate;
        this.ctcOffered = job?.ctcOffered
    }
}
