import request from 'supertest';
import { INestApplication, HttpStatus } from '@nestjs/common';
import { TestingModule, Test } from '@nestjs/testing';
import { AppModule } from 'src/app.module';
import { CreateApplicantDto } from 'src/applicants/applicant.dto';
import { ApplicantsService } from 'src/applicants/applicants.service';
import { CreateApplicationDto } from 'src/applications/dto/create-application.dto';
import { ApplicationStatus } from 'src/applications/application-status.enum';
import { Application } from 'src/applications/entities/application.entity';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm/dist/common/typeorm.utils';

describe('ApplicationsControllerTest', () => {
    let app: INestApplication;
    let moduleFixture: TestingModule;

    let testUser: CreateApplicantDto = {
        username: 'testuser1',
        firstName: 'Test',
        lastName: 'User',
        email: 'test@example.com',
        password: 'Testpass123!',
    };

    let testUserId: number;

    let accessToken: string;

    let createdApplicationDto: CreateApplicationDto = {
        role: 'Software Engineer',
        company: 'Tech Company',
        jobLink: 'https://techcompany.com/jobs/123',
        city: 'San Francisco',
        state: 'CA',
        country: 'USA',
        description: 'Exciting opportunity to work on cutting-edge technology.',
        ctcOffered: 120000,
        status: ApplicationStatus.Applied,
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

        const loginRes = await request(app.getHttpServer())
            .post('/auth/login')
            .send({
                username: testUser.username,
                password: testUser.password,
            })
            .expect(HttpStatus.OK);

        accessToken = loginRes.body.access_token;
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

    afterEach(async () => {
        const applicationsRepository = moduleFixture.get<
            Repository<Application>
        >(getRepositoryToken(Application));
    });

    it('/applications (POST) should create a new job application', async () => {
        await request(app.getHttpServer())
            .post('/applications')
            .set('Authorization', `Bearer ${accessToken}`)
            .send(createdApplicationDto);

        await request(app.getHttpServer())
            .get('/applications')
            .set('Authorization', `Bearer ${accessToken}`)
            .expect(HttpStatus.OK)
            .then((response) => {
                expect(response.body).toBeInstanceOf(Array);
                const createdApplication = response.body.find(
                    (app) => app.role === createdApplicationDto.role,
                );
                expect(createdApplication).toBeDefined();
                expect(createdApplication.company).toBe(
                    createdApplicationDto.company,
                );
                expect(createdApplication.jobLink).toBe(
                    createdApplicationDto.jobLink,
                );
                expect(createdApplication.city).toBe(
                    createdApplicationDto.city,
                );
                expect(createdApplication.state).toBe(
                    createdApplicationDto.state,
                );
                expect(createdApplication.country).toBe(
                    createdApplicationDto.country,
                );
                expect(createdApplication.description).toBe(
                    createdApplicationDto.description,
                );
                expect(createdApplication.ctcOffered).toBe(
                    createdApplicationDto.ctcOffered,
                );
                expect(createdApplication.status).toBe(
                    createdApplicationDto.status,
                );
            });
    });

    it('/applications (POST) should return newly created application', async () => {
        let createdApplicationId: number;

        await request(app.getHttpServer())
            .post('/applications')
            .set('Authorization', `Bearer ${accessToken}`)
            .send(createdApplicationDto)
            .expect(HttpStatus.CREATED)
            .then((response) => {
                const createdApplication = response.body;
                createdApplicationId = createdApplication.id;
                expect(createdApplication).toBeDefined();
                expect(createdApplication.role).toBe(
                    createdApplicationDto.role,
                );
                expect(createdApplication.company).toBe(
                    createdApplicationDto.company,
                );
                expect(createdApplication.jobLink).toBe(
                    createdApplicationDto.jobLink,
                );
                expect(createdApplication.city).toBe(
                    createdApplicationDto.city,
                );
                expect(createdApplication.state).toBe(
                    createdApplicationDto.state,
                );
                expect(createdApplication.country).toBe(
                    createdApplicationDto.country,
                );
                expect(createdApplication.description).toBe(
                    createdApplicationDto.description,
                );
                expect(createdApplication.ctcOffered).toBe(
                    createdApplicationDto.ctcOffered,
                );
                expect(createdApplication.status).toBe(
                    createdApplicationDto.status,
                );
            });

        // Removing the created application from the database.

        const applicationsRepository = moduleFixture.get<
            Repository<Application>
        >(getRepositoryToken(Application));

        const applicationInDb = await applicationsRepository.findOne({
            where: { id: createdApplicationId },
        });

        expect(applicationInDb).toBeDefined();
        expect(applicationInDb.id).toBe(createdApplicationId);

        applicationsRepository.remove(applicationInDb);
    });

    it('/applications (POST) should get specific application', async () => {
        const response = await request(app.getHttpServer())
            .post('/applications')
            .set('Authorization', `Bearer ${accessToken}`)
            .send(createdApplicationDto);

        const createdApplicationId = response.body.id;

        await request(app.getHttpServer())
            .get(`/applications/${createdApplicationId}`)
            .set('Authorization', `Bearer ${accessToken}`)
            .expect(HttpStatus.OK)
            .then((response) => {
                const application = response.body;
                expect(application).toBeDefined();
                expect(application.id).toBe(createdApplicationId);
                expect(application.role).toBe(createdApplicationDto.role);
                expect(application.company).toBe(createdApplicationDto.company);
                expect(application.jobLink).toBe(createdApplicationDto.jobLink);
                expect(application.city).toBe(createdApplicationDto.city);
                expect(application.state).toBe(createdApplicationDto.state);
                expect(application.country).toBe(createdApplicationDto.country);
                expect(application.description).toBe(
                    createdApplicationDto.description,
                );
                expect(application.ctcOffered).toBe(
                    createdApplicationDto.ctcOffered,
                );
                expect(application.status).toBe(createdApplicationDto.status);
            });

        const applicationsRepository = moduleFixture.get<
            Repository<Application>
        >(getRepositoryToken(Application));

        const applicationInDb = await applicationsRepository.findOne({
            where: { id: createdApplicationId },
        });

        expect(applicationInDb).toBeDefined();
        expect(applicationInDb.id).toBe(createdApplicationId);

        applicationsRepository.remove(applicationInDb);
    });

    it('/applications (POST) should return 403 for unauthorized access', async () => {
        // register another test user
        const anotherUser: CreateApplicantDto = {
            username: 'anotheruser',
            firstName: 'Another',
            lastName: 'User',
            email: 'anotherUser@email.com',
            password: 'AnotherPass123!',
        };

        await request(app.getHttpServer())
            .post('/auth/register')
            .send(anotherUser)
            .expect(HttpStatus.CREATED);

        const loginRes = await request(app.getHttpServer())
            .post('/auth/login')
            .send({
                username: anotherUser.username,
                password: anotherUser.password,
            })
            .expect(HttpStatus.OK);

        const anotherUserAccessToken = loginRes.body.access_token;
    });
});
