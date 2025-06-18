import {
    IsEnum,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsString,
    IsUrl,
} from 'class-validator';
import { JobStatus } from './job-status.enum';

export class CreateJobDto {
    @IsString()
    @IsNotEmpty()
    role: string;

    @IsString()
    @IsNotEmpty()
    company: string;

    @IsNumber()
    ctcOffered: number;

    @IsEnum(JobStatus)
    @IsOptional()
    status?: JobStatus;

    @IsString()
    @IsUrl()
    @IsNotEmpty()
    jobLink: string;

    @IsString()
    @IsNotEmpty()
    city: string;

    @IsString()
    @IsNotEmpty()
    state: string;

    @IsString()
    @IsNotEmpty()
    country: string;

    @IsString()
    @IsNotEmpty()
    description: string;
}

export class UpdateJobDto {
    @IsString()
    @IsOptional()
    role?: string;
    r;

    @IsString()
    @IsOptional()
    company?: string;

    @IsNumber()
    @IsOptional()
    ctcOffered?: number;

    @IsEnum(JobStatus)
    @IsOptional()
    status?: JobStatus;

    @IsString()
    @IsUrl()
    @IsOptional()
    jobLink?: string;

    @IsString()
    @IsOptional()
    city?: string;

    @IsString()
    @IsOptional()
    state?: string;

    @IsString()
    @IsOptional()
    country?: string;

    @IsString()
    @IsOptional()
    description?: string;
}
