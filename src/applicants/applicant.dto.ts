import { OmitType, PartialType } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsEmail, IsString } from 'class-validator';

export class CreateApplicantDto {
    @IsString()
    @Expose()
    username: string;

    @IsString()
    @Expose()
    firstName: string;

    @IsString()
    @Expose()
    lastName: string;

    @IsEmail()
    @Expose()
    email: string;

    // TODO - Password Validation
    @IsString()
    @Expose()
    password: string;
}

export class LoginApplicantDTO {
    username: string;
    password: string;
}

export class PasswordOmittedApplicantDto extends OmitType(CreateApplicantDto, [
    'password',
] as const) {}

export class UpdateOmittedApplicantDto extends OmitType(
    PasswordOmittedApplicantDto,
    ['username', 'email'] as const,
) {}

export class UpdateApplicantDto extends PartialType(
    UpdateOmittedApplicantDto,
) {}

export class ReturnApplicantDto extends PasswordOmittedApplicantDto {}
