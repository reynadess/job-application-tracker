import { PartialType } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import {
    IsEnum,
    IsNumber,
    IsOptional,
    IsString,
    IsUrl,
    Length,
} from 'class-validator';
import { ApplicationStatus } from '../application-status.enum';

export class CreateApplicationDto {
    @Length(1, 255)
    @IsString()
    @Expose()
    role: string;

    @Length(1, 255)
    @IsOptional()
    @Expose()
    company: string;

    @IsUrl()
    @Expose()
    jobLink: string;

    @IsOptional()
    @Expose()
    city: string;

    @IsOptional()
    @Expose()
    state: string;

    @IsOptional()
    @Expose()
    country: string;

    @IsOptional()
    @Expose()
    description: string;
}

export class ReturnApplicationDto extends PartialType(CreateApplicationDto) {
    @Expose()
    @IsNumber()
    id: number;

    @Expose()
    @IsNumber()
    userId: number;

    @Expose()
    @IsNumber()
    jobId: number;

    @Expose()
    @IsEnum(ApplicationStatus, {
        message: `Status must be one of the following: ${Object.values(ApplicationStatus)}`,
    })
    status: ApplicationStatus;
}
