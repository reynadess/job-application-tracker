import { IsDateString, IsEnum, IsOptional } from 'class-validator';
import { ApplicationStatus } from '../application-status.enum';

export class UpdateApplicationDto {
    @IsOptional()
    @IsEnum(ApplicationStatus, {
        message: `Status must be one of the following: ${Object.values(ApplicationStatus)}`,
    })
    status?: ApplicationStatus;

    @IsOptional()
    @IsDateString(
        {
            strict: true,
            strictSeparator: true,
        },
        {
            message: 'Date must be in 2025-05-22T07:16:54.162Z format',
        },
    )
    appliedDate?: Date;
}
