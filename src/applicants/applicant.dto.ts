import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsEmail, IsString, Length, Matches, IsStrongPassword } from 'class-validator';

export class CreateApplicantDto {
    @ApiProperty({
        description: 'Username for the account',
        example: 'johndoe123',
        minLength: 3,
        maxLength: 30,
        pattern: '^[a-zA-Z0-9_]+$',
        title: 'Username',
        type: 'string'
    })
    @IsString({ message: 'Username must be a string' })
    @Length(3, 30, { message: 'Username must be between 3 and 30 characters long' })
    @Matches(/^[a-zA-Z0-9_]+$/, { 
        message: 'Username can only contain letters, numbers, and underscores' 
    })
    @Expose()
    username: string;

    @ApiProperty({
        description: 'First name of the applicant',
        example: 'John',
        minLength: 1,
        maxLength: 50,
        title: 'First Name',
        type: 'string'
    })
    @IsString({ message: 'First name must be a string' })
    @Length(1, 50, { message: 'First name must be between 1 and 50 characters long' })
    @Expose()
    firstName: string;

    @ApiProperty({
        description: 'Last name of the applicant',
        example: 'Doe',
        minLength: 1,
        maxLength: 50,
        title: 'Last Name',
        type: 'string'
    })
    @IsString({ message: 'Last name must be a string' })
    @Length(1, 50, { message: 'Last name must be between 1 and 50 characters long' })
    @Expose()
    lastName: string;

    @ApiProperty({
        description: 'Valid email address for the account',
        example: 'john.doe@example.com',
        format: 'email',
        title: 'Email Address',
        type: 'string'
    })
    @IsEmail({ 
        allow_display_name: false,
        require_display_name: false,
        allow_utf8_local_part: true,
        require_tld: true
    }, { message: 'Please provide a valid email address' })
    @Expose()
    email: string;

    @ApiProperty({
        description: 'Strong password meeting security requirements',
        example: 'MySecureP@ssw0rd!',
        minLength: 8,
        maxLength: 64,
        title: 'Password',
        type: 'string',
        format: 'password'
    })
    @IsStrongPassword({
        minLength: 8,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
    }, { message: 'Password must be 8-64 characters long, contain at least one uppercase letter, one lowercase letter, one number, and one special character (!@#$%^&*()_+=[]{}|;:,.<>?-)' })
    @Length(8, 64, { message: 'Password must be between 8 and 64 characters long' })
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
