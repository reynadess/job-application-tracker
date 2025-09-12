import {
    registerDecorator,
    ValidationOptions,
    ValidatorConstraint,
    ValidatorConstraintInterface,
    ValidationArguments,
} from 'class-validator';

export interface PasswordValidationOptions {
    minLength?: number;
    maxLength?: number;
    requireUppercase?: boolean;
    requireLowercase?: boolean;
    requireNumbers?: boolean;
    requireSpecialChars?: boolean;
    specialChars?: string;
}

@ValidatorConstraint({ async: false })
export class IsStrongPasswordConstraint implements ValidatorConstraintInterface {
    validate(password: string, args: ValidationArguments): boolean {
        const options: PasswordValidationOptions = args.constraints[0] || {};
        
        const {
            minLength = 8,
            maxLength = 128,
            requireUppercase = true,
            requireLowercase = true,
            requireNumbers = true,
            requireSpecialChars = true,
            specialChars = '!@#$%^&*()_+=[]{}|;:,.<>?-'
        } = options;

        if (!password || typeof password !== 'string') {
            return false;
        }

        // Check length
        if (password.length < minLength || password.length > maxLength) {
            return false;
        }

        // Check for uppercase letters
        if (requireUppercase && !/[A-Z]/.test(password)) {
            return false;
        }

        // Check for lowercase letters
        if (requireLowercase && !/[a-z]/.test(password)) {
            return false;
        }

        // Check for numbers
        if (requireNumbers && !/\d/.test(password)) {
            return false;
        }

        // Check for special characters
        if (requireSpecialChars) {
            const specialCharRegex = new RegExp(`[${specialChars.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}]`);
            if (!specialCharRegex.test(password)) {
                return false;
            }
        }

        return true;
    }

    defaultMessage(args: ValidationArguments): string {
        const options: PasswordValidationOptions = args.constraints[0] || {};
        const {
            minLength = 8,
            maxLength = 128,
            requireUppercase = true,
            requireLowercase = true,
            requireNumbers = true,
            requireSpecialChars = true,
        } = options;

        const requirements: string[] = [];
        requirements.push(`be ${minLength}-${maxLength} characters long`);
        
        if (requireUppercase) requirements.push('contain at least one uppercase letter');
        if (requireLowercase) requirements.push('contain at least one lowercase letter');
        if (requireNumbers) requirements.push('contain at least one number');
        if (requireSpecialChars) requirements.push('contain at least one special character');

        return `Password must ${requirements.join(', ')}`;
    }
}

export function IsStrongPassword(
    options?: PasswordValidationOptions,
    validationOptions?: ValidationOptions,
) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [options],
            validator: IsStrongPasswordConstraint,
        });
    };
}
