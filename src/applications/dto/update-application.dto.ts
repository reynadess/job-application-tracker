import { IsDateString, IsEnum, IsOptional } from 'class-validator';
import { ApplicationStatus } from '../application-status.enum';

export class UpdateApplicationDto {
    @IsOptional()
    @IsEnum(ApplicationStatus, {
        message: `Status must be one of the following: ${Object.values(ApplicationStatus)}`,
    })
    status?: ApplicationStatus;
}
