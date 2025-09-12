import { OmitType, PartialType } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsEmail, IsString, MinLength, MaxLength } from 'class-validator';
import { IsStrongPassword } from '../common/decorators/password-validation.decorator';

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

    @IsEmail({ 
        allow_display_name: false,
        require_display_name: false,
        allow_utf8_local_part: true,
        require_tld: true
    }, { message: 'Please provide a valid email address' })
    @Expose()
    email: string;

    @IsString()
    @MinLength(8, { message: 'Password must be at least 8 characters long' })
    @MaxLength(128, { message: 'Password must not exceed 128 characters' })
    @IsStrongPassword({
        minLength: 8,
        maxLength: 128,
        requireUppercase: true,
        requireLowercase: true,
        requireNumbers: true,
        requireSpecialChars: true,
    }, { message: 'Password must be 8-128 characters long, contain at least one uppercase letter, one lowercase letter, one number, and one special character' })
    @Expose()
    password: string;
}

export class LoginApplicantDTO {
    @Expose()
    username: string;

    @Expose()
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
