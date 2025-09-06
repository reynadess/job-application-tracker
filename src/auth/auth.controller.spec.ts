import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../app.module';
import { CreateApplicantDto } from '../applicants/applicant.dto';
import { ApplicantsService } from '../applicants/applicants.service';

/**
 * End-to-end tests for the AuthController.
 *
 * This test suite covers the following authentication endpoints:
 * - POST /auth/register: Registers a new user before all tests.
 * - POST /auth/login: Authenticates a user and returns JWT tokens.
 * - POST /auth/refresh: Refreshes JWT tokens using a refresh token.
 *
 * Test cases:
 * - Successful login returns access and refresh tokens.
 * - Login with incorrect password returns UnauthorizedException.
 * - Refresh endpoint returns new access and refresh tokens when provided a valid refresh token.
 *
 * Test setup and teardown:
 * - Registers a test user before all tests.
 * - Deletes the test user after all tests.
 * - Clears Jest mocks before each test.
 *
 * Dependencies:
 * - Uses NestJS testing utilities and supertest for HTTP assertions.
 * - Relies on ApplicantsService for test user cleanup.
 * - Postgres Database Up and running
 */
describe('AuthController (e2e)', () => {
    let app: INestApplication;
    let moduleFixture: TestingModule;

    let testUser: CreateApplicantDto = {
        username: 'testuser',
        firstName: 'Test',
        lastName: 'User',
        email: 'test@example.com',
        password: 'testpass',
    };

    beforeAll(async () => {
        moduleFixture = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        await app.init();

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
            username: testUser.username,
            password: testUser.password,
        };

        const response = await request(app.getHttpServer())
            .post('/auth/login')
            .send(loginDto)
            .expect(HttpStatus.OK);

        expect(response.body).toHaveProperty('access_token');
        expect(response.body).toHaveProperty('refresh_token');
    });

    it('/auth/login (POST) should call login with wrong password and return UnauthorizedException', async () => {
        const loginDto = {
            username: testUser.username,
            password: 'wrongpass',
        };

        await request(app.getHttpServer())
            .post('/auth/login')
            .send(loginDto)
            .expect(HttpStatus.UNAUTHORIZED);
    });

    it('/auth/login (POST) should call login with wrong user and return NotFoundException', async () => {
        const loginDto = {
            username: 'wronguser',
            password: testUser.password,
        };

        await request(app.getHttpServer())
            .post('/auth/login')
            .send(loginDto)
            .expect(HttpStatus.NOT_FOUND);
    });

    it('/auth/register (POST) should call register with existing email and return ConflictException', async () => {
        await request(app.getHttpServer())
            .post('/auth/register')
            .send(testUser)
            .expect(HttpStatus.CONFLICT);
    });

    it('/auth/register (POST) should call with wrong email pattern and return BadRequestException', async () => {
        const invalidUser: CreateApplicantDto = {
            ...testUser,
            email: 'invalid.com',
            username: '1123',
        };

        await request(app.getHttpServer())
            .post('/auth/register')
            .send(invalidUser)
            .expect(HttpStatus.BAD_REQUEST);
    });

    it('/auth/refresh (POST) should call refresh and return 200', async () => {
        const loginResponse = await request(app.getHttpServer())
            .post('/auth/login')
            .send({
                username: testUser.username,
                password: testUser.password,
            })
            .expect(HttpStatus.OK);

        expect(loginResponse.body).toHaveProperty('refresh_token');
        let refreshToken = loginResponse.body.refresh_token;

        const jwtRefreshResponse = await request(app.getHttpServer())
            .post('/auth/refresh')
            .set('Authorization', `Bearer ${refreshToken}`)
            .expect(HttpStatus.OK);

        expect(jwtRefreshResponse.body).toHaveProperty('access_token');
        expect(jwtRefreshResponse.body).toHaveProperty('refresh_token');
    });
});
