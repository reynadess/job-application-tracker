import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../app.module';
import { CreateApplicantDto } from '../applicants/applicant.dto';
import { ApplicantsService } from '../applicants/applicants.service';

describe('AuthController (e2e)', () => {
    let app: INestApplication;
    let accessToken: string;
    let moduleFixture: TestingModule;
    let testUser: CreateApplicantDto;

    beforeAll(async () => {
        moduleFixture = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        await app.init();

        testUser = {
            username: 'testuser',
            firstName: 'Test',
            lastName: 'User',
            email: 'test@example.com',
            password: 'testpass',
        };

        await request(app.getHttpServer())
            .post('/auth/register')
            .send(testUser)
            .expect(HttpStatus.CREATED);
    });

    afterAll(async () => {
        const applicantsService =
            moduleFixture.get<ApplicantsService>(ApplicantsService);
        await applicantsService.deleteOne(testUser.username);

        await app.close();
    });

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('/auth/login (POST) should call login and return 200', async () => {
        const loginDto = {
            username: 'testuser',
            password: 'testpass',
        };

        const response = await request(app.getHttpServer())
            .post('/auth/login')
            .send(loginDto)
            .expect(HttpStatus.OK);

        expect(response.body).toHaveProperty('access_token');
    });
});
