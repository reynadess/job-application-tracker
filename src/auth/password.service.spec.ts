import { Test, TestingModule } from '@nestjs/testing';
import { PasswordService } from './password.service';

describe('PasswordService', () => {
    let service: PasswordService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [PasswordService],
        }).compile();

        service = module.get<PasswordService>(PasswordService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('hashPassword', () => {
        it('should hash a password successfully', async () => {
            const password = 'TestPassword123!';
            const hashedPassword = await service.hashPassword(password);

            expect(hashedPassword).toBeDefined();
            expect(hashedPassword).not.toBe(password);
            expect(hashedPassword.length).toBeGreaterThan(50); // bcrypt hashes are typically 60 characters
        });

        it('should generate different hashes for the same password', async () => {
            const password = 'TestPassword123!';
            const hash1 = await service.hashPassword(password);
            const hash2 = await service.hashPassword(password);

            expect(hash1).not.toBe(hash2); // Due to salt, hashes should be different
        });

        it('should handle empty password', async () => {
            const password = '';
            const hashedPassword = await service.hashPassword(password);

            expect(hashedPassword).toBeDefined();
            expect(hashedPassword).not.toBe(password);
        });
    });

    describe('comparePasswords', () => {
        it('should return true for matching passwords', async () => {
            const password = 'TestPassword123!';
            const hashedPassword = await service.hashPassword(password);
            const isMatch = await service.comparePasswords(password, hashedPassword);

            expect(isMatch).toBe(true);
        });

        it('should return false for non-matching passwords', async () => {
            const password = 'TestPassword123!';
            const wrongPassword = 'WrongPassword456@';
            const hashedPassword = await service.hashPassword(password);
            const isMatch = await service.comparePasswords(wrongPassword, hashedPassword);

            expect(isMatch).toBe(false);
        });

        it('should return false when comparing with empty password', async () => {
            const password = 'TestPassword123!';
            const hashedPassword = await service.hashPassword(password);
            const isMatch = await service.comparePasswords('', hashedPassword);

            expect(isMatch).toBe(false);
        });

        it('should return false when comparing with invalid hash', async () => {
            const password = 'TestPassword123!';
            const invalidHash = 'invalid_hash';
            
            const isMatch = await service.comparePasswords(password, invalidHash);
            expect(isMatch).toBe(false);
        });
    });

    describe('generateSalt', () => {
        it('should generate a salt successfully', async () => {
            const salt = await service.generateSalt();

            expect(salt).toBeDefined();
            expect(typeof salt).toBe('string');
            expect(salt.length).toBeGreaterThan(20); // bcrypt salts are typically longer
        });

        it('should generate different salts', async () => {
            const salt1 = await service.generateSalt();
            const salt2 = await service.generateSalt();

            expect(salt1).not.toBe(salt2);
        });
    });
});
