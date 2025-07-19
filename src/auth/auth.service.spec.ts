import { Test, TestingModule } from '@nestjs/testing';
import { JwtAuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';
import { ApplicantsService } from '../applicants/applicants.service';
import { identity } from 'rxjs';

describe('AuthService', () => {
    let service: JwtAuthService;
    let applicantsService: ApplicantsService;
    let jwtService: JwtService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                JwtAuthService,
                {
                    provide: ApplicantsService,
                    useValue: {
                        findOne: jest.fn(),
                        createApplicant: jest.fn(),
                    },
                },
                {
                    provide: JwtService,
                    useValue: {
                        signAsync: jest.fn().mockResolvedValue('mocked_token'),
                    },
                },
            ],
        }).compile();

        service = module.get<JwtAuthService>(JwtAuthService);
        applicantsService = module.get<ApplicantsService>(ApplicantsService);
        jwtService = module.get<JwtService>(JwtService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    it('should validate user', async () => {
        (applicantsService.findOne as jest.Mock).mockResolvedValue({
            username: 'test',
            id: 1,
            password: 'pass',
        });
        const user = await service.validateUser('test', 'pass');
        expect(user).toEqual({ username: 'test', userId: 1 });
    });

    it('should throw UnauthorizedException for invalid user', async () => {
        (applicantsService.findOne as jest.Mock).mockResolvedValue(undefined);
        await expect(service.validateUser('bad', 'pass')).rejects.toThrow(UnauthorizedException);
    });

    it('should login and return token', async () => {
        const token = await service.login({ username: 'test', userId: 1 });
        expect(token).toEqual({ access_token: 'mocked_token' });
        expect(jwtService.signAsync).toHaveBeenCalledWith({ username: 'test', sub: 1 , id :1 });
    });

    it('should register user', async () => {
        (applicantsService.createApplicant as jest.Mock).mockResolvedValue(true);
        const result = await service.register({
            username: 'test',
            firstName: 'Test',
            lastName: 'User',
            email: 'test@test.com',
            password: 'pass',
        });
        expect(applicantsService.createApplicant).toHaveBeenCalled();
        expect(result).toEqual(true);
    });
});