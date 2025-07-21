import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { BaseAuthService } from './auth.service';
import { CreateApplicantDto } from 'src/applicants/applicant.dto';

describe('AuthController', () => {
    let controller: AuthController;
    let service: BaseAuthService;
    beforeEach(async () => {
        const mockAuthService = {
            login: jest
                .fn()
                .mockResolvedValue({ access_token: 'mocked_token' }),
            register: jest.fn().mockResolvedValue(undefined),
        };
        const module: TestingModule = await Test.createTestingModule({
            controllers: [AuthController],
            providers: [
                {
                    provide: BaseAuthService,
                    useValue: mockAuthService,
                },
            ],
        }).compile();

        controller = module.get<AuthController>(AuthController);
        service = module.get<BaseAuthService>(BaseAuthService);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
    it('Should login and return token', async () => {
        const req = { user: { username: 'test', userId: 1 } };
        const result = await controller.login(req);
        expect(result).toEqual({ access_token: 'mocked_token' });
        expect(service.login).toHaveBeenCalledWith(req.user);
    });
    it('Should register the user', async () => {
        const user: CreateApplicantDto = {
            username: 'test',
            firstName: 'Test',
            lastName: 'User',
            email: 'test@test.com',
            password: 'pass',
        };

        await controller.register(user);
        expect(service.register).toHaveBeenCalledWith(user);
    });
});
