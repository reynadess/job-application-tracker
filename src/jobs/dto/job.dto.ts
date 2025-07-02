import {
    IsEnum,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsString,
    IsUrl,
} from 'class-validator';
import { JobStatus } from '../job-status.enum';
import { Expose } from 'class-transformer';
import { PartialType } from '@nestjs/swagger';

export class CreateJobDto {
    @IsString()
    @IsNotEmpty()
    @Expose()
    role: string;

    @IsString()
    @IsNotEmpty()
    @Expose()
    company: string;

    @IsNumber()
    @Expose()
    ctcOffered: number;

    @IsEnum(JobStatus)
    @IsOptional()
    @Expose()
    status?: JobStatus;

    @IsString()
    @IsUrl()
    @IsNotEmpty()
    @Expose()
    jobLink: string;

    @IsString()
    @IsNotEmpty()
    @Expose()
    city: string;

    @IsString()
    @IsNotEmpty()
    @Expose()
    state: string;

    @IsString()
    @IsNotEmpty()
    @Expose()
    country: string;

    @IsString()
    @IsNotEmpty()
    @Expose()
    description: string;
}

export class UpdateJobDto extends PartialType(CreateJobDto) {}
export class ReturnJobDto extends PartialType(CreateJobDto) {
    @Expose()
    @IsNumber()
    id: number;

    @Expose()
    @IsNumber()
    recruiterId: number;

    @Expose()
    @IsNumber()
    companyId: number;

    @Expose()
    @IsEnum(JobStatus, {
        message: `Status must be one of the following: ${Object.values(JobStatus)}`,
    })
    @Expose()
    createdAt: Date;

    @Expose()
    updatedAt: Date;

    @Expose()
    deletedAt: Date;
}
