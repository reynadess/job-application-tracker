import 'reflect-metadata';
import { validate } from 'class-validator';
import { IsStrongPassword } from './password-validation.decorator';

class TestDto {
    @IsStrongPassword({
        minLength: 8,
        maxLength: 128,
        requireUppercase: true,
        requireLowercase: true,
        requireNumbers: true,
        requireSpecialChars: true,
    })
    password: string;
}

describe('IsStrongPassword Decorator', () => {
    let testDto: TestDto;

    beforeEach(() => {
        testDto = new TestDto();
    });

    describe('Valid passwords', () => {
        it('should accept a strong password', async () => {
            testDto.password = 'StrongPass123!';
            const errors = await validate(testDto);
            expect(errors).toHaveLength(0);
        });

        it('should accept password with various special characters', async () => {
            const validPasswords = [
                'Password123@',
                'Password123#',
                'Password123$',
                'Password123%',
                'Password123^',
                'Password123&',
                'Password123*',
                'Password123(',
                'Password123)',
                'Password123_',
                'Password123+',
                'Password123-',
                'Password123=',
                'Password123[',
                'Password123]',
                'Password123{',
                'Password123}',
                'Password123|',
                'Password123;',
                'Password123:',
                'Password123,',
                'Password123.',
                'Password123<',
                'Password123>',
                'Password123?',
            ];

            for (const password of validPasswords) {
                testDto.password = password;
                const errors = await validate(testDto);
                expect(errors).toHaveLength(0);
            }
        });

        it('should accept minimum length password', async () => {
            testDto.password = 'Pass123!'; // 8 characters
            const errors = await validate(testDto);
            expect(errors).toHaveLength(0);
        });
    });

    describe('Invalid passwords', () => {
        it('should reject password without uppercase letter', async () => {
            testDto.password = 'password123!';
            const errors = await validate(testDto);
            expect(errors).toHaveLength(1);
            expect(errors[0].constraints).toHaveProperty('IsStrongPasswordConstraint');
        });

        it('should reject password without lowercase letter', async () => {
            testDto.password = 'PASSWORD123!';
            const errors = await validate(testDto);
            expect(errors).toHaveLength(1);
            expect(errors[0].constraints).toHaveProperty('IsStrongPasswordConstraint');
        });

        it('should reject password without numbers', async () => {
            testDto.password = 'Password!';
            const errors = await validate(testDto);
            expect(errors).toHaveLength(1);
            expect(errors[0].constraints).toHaveProperty('IsStrongPasswordConstraint');
        });

        it('should reject password without special characters', async () => {
            testDto.password = 'Password123';
            const errors = await validate(testDto);
            expect(errors.length).toBeGreaterThan(0);
            expect(errors[0].constraints).toHaveProperty('IsStrongPasswordConstraint');
        });

        it('should reject password that is too short', async () => {
            testDto.password = 'Pass12!'; // 7 characters
            const errors = await validate(testDto);
            expect(errors).toHaveLength(1);
            expect(errors[0].constraints).toHaveProperty('IsStrongPasswordConstraint');
        });

        it('should reject password that is too long', async () => {
            testDto.password = 'A'.repeat(126) + 'a1!'; // 130 characters
            const errors = await validate(testDto);
            expect(errors.length).toBeGreaterThan(0);
            expect(errors[0].constraints).toHaveProperty('IsStrongPasswordConstraint');
        });

        it('should reject null password', async () => {
            testDto.password = null;
            const errors = await validate(testDto);
            expect(errors).toHaveLength(1);
            expect(errors[0].constraints).toHaveProperty('IsStrongPasswordConstraint');
        });

        it('should reject undefined password', async () => {
            testDto.password = undefined;
            const errors = await validate(testDto);
            expect(errors).toHaveLength(1);
            expect(errors[0].constraints).toHaveProperty('IsStrongPasswordConstraint');
        });

        it('should reject empty password', async () => {
            testDto.password = '';
            const errors = await validate(testDto);
            expect(errors).toHaveLength(1);
            expect(errors[0].constraints).toHaveProperty('IsStrongPasswordConstraint');
        });
    });

    describe('Custom options', () => {
        class CustomTestDto {
            @IsStrongPassword({
                minLength: 6,
                maxLength: 20,
                requireUppercase: false,
                requireLowercase: true,
                requireNumbers: true,
                requireSpecialChars: false,
            })
            password: string;
        }

        it('should respect custom validation options', async () => {
            const customDto = new CustomTestDto();
            customDto.password = 'pass123'; // 7 chars, lowercase + numbers, no uppercase or special chars
            const errors = await validate(customDto);
            expect(errors).toHaveLength(0);
        });

        it('should reject when custom requirements are not met', async () => {
            const customDto = new CustomTestDto();
            customDto.password = 'password'; // no numbers
            const errors = await validate(customDto);
            expect(errors).toHaveLength(1);
        });
    });

    describe('Error messages', () => {
        it('should provide descriptive error message', async () => {
            testDto.password = 'weak';
            const errors = await validate(testDto);
            expect(errors).toHaveLength(1);
            expect(errors[0].constraints.IsStrongPasswordConstraint).toContain('Password must');
            expect(errors[0].constraints.IsStrongPasswordConstraint).toContain('8-128 characters long');
            expect(errors[0].constraints.IsStrongPasswordConstraint).toContain('uppercase letter');
            expect(errors[0].constraints.IsStrongPasswordConstraint).toContain('lowercase letter');
            expect(errors[0].constraints.IsStrongPasswordConstraint).toContain('number');
            expect(errors[0].constraints.IsStrongPasswordConstraint).toContain('special character');
        });
    });
});
