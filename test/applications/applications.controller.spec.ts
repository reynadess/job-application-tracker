import request from 'supertest';
import { INestApplication, HttpStatus } from '@nestjs/common';
import { TestingModule, Test } from '@nestjs/testing';
import { AppModule } from 'src/app.module';
import { CreateApplicantDto } from 'src/applicants/applicant.dto';
import {
    CreateApplicationDto,
    ReturnApplicationDto,
} from 'src/applications/dto/create-application.dto';
import { ApplicationStatus } from 'src/applications/application-status.enum';
import { Application } from 'src/applications/entities/application.entity';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm/dist/common/typeorm.utils';
import { Applicant } from 'src/applicants/applicant.entity';
import { ReturnAuthDTO } from 'src/auth/auth.dto';

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

    let createApplicationDto: CreateApplicationDto = {
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
            .expect(HttpStatus.OK)
            .expect((response) => {
                const body: ReturnAuthDTO = response.body;
                expect(body).toBeDefined();
                expect(body.access_token).toBeDefined();
                expect(body.refresh_token).toBeDefined();
                expect(body.userId).toBeGreaterThanOrEqual(0);
                testUserId = body.userId;
            });

        accessToken = loginRes.body.access_token;
    });

    afterAll(async () => {
        const applicantRepository = moduleFixture.get<Repository<Applicant>>(
            getRepositoryToken(Applicant),
        );

        const applicantInDb = await applicantRepository.findOne({
            where: { username: testUser.username },
        });

        if (applicantInDb) {
            await applicantRepository.remove(applicantInDb);
        }

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
        let createdApplicationId: number;
        try {
            await request(app.getHttpServer())
                .post('/applications')
                .set('Authorization', `Bearer ${accessToken}`)
                .send(createApplicationDto)
                .expect(HttpStatus.CREATED)
                .expect((response) => {
                    const createdApplication: ReturnApplicationDto =
                        response.body;
                    expect(createdApplication).toBeDefined();
                    expect(createdApplication.id).toBeGreaterThanOrEqual(0);
                    createdApplicationId = createdApplication.id;
                    expect(createdApplication.userId).toBe(testUserId);
                    expect(createdApplication.jobId).toBeGreaterThanOrEqual(0);
                    expect(createdApplication.role).toBe(
                        createApplicationDto.role,
                    );
                    expect(createdApplication.company).toBe(
                        createApplicationDto.company,
                    );
                    expect(createdApplication.jobLink).toBe(
                        createApplicationDto.jobLink,
                    );
                    expect(createdApplication.city).toBe(
                        createApplicationDto.city,
                    );
                    expect(createdApplication.state).toBe(
                        createApplicationDto.state,
                    );
                    expect(createdApplication.country).toBe(
                        createApplicationDto.country,
                    );
                    expect(createdApplication.description).toBe(
                        createApplicationDto.description,
                    );
                    expect(createdApplication.ctcOffered).toBe(
                        createApplicationDto.ctcOffered,
                    );
                    expect(createdApplication.status).toBe(
                        createApplicationDto.status,
                    );
                });
        } finally {
            // Clean up: Remove the created application from the database.

            const applicationsRepository = moduleFixture.get<
                Repository<Application>
            >(getRepositoryToken(Application));

            const applicationInDb = await applicationsRepository.findOne({
                where: { id: createdApplicationId },
            });
            if (applicationInDb) {
                await applicationsRepository.remove(applicationInDb);
            }
        }
    });

    it('/applications (POST) should return newly created application', async () => {
        let createdApplicationId: number;

        try {
            await request(app.getHttpServer())
                .post('/applications')
                .set('Authorization', `Bearer ${accessToken}`)
                .send(createApplicationDto)
                .expect(HttpStatus.CREATED)
                .then((response) => {
                    const createdApplication = response.body;
                    createdApplicationId = createdApplication.id;
                    expect(createdApplication).toBeDefined();
                    expect(createdApplication.role).toBe(
                        createApplicationDto.role,
                    );
                    expect(createdApplication.company).toBe(
                        createApplicationDto.company,
                    );
                    expect(createdApplication.jobLink).toBe(
                        createApplicationDto.jobLink,
                    );
                    expect(createdApplication.city).toBe(
                        createApplicationDto.city,
                    );
                    expect(createdApplication.state).toBe(
                        createApplicationDto.state,
                    );
                    expect(createdApplication.country).toBe(
                        createApplicationDto.country,
                    );
                    expect(createdApplication.description).toBe(
                        createApplicationDto.description,
                    );
                    expect(createdApplication.ctcOffered).toBe(
                        createApplicationDto.ctcOffered,
                    );
                    expect(createdApplication.status).toBe(
                        createApplicationDto.status,
                    );
                });
        } finally {
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
        }
    });

    it('/applications (POST) should get specific application', async () => {
        let createdApplicationId: number;

        try {
            const response = await request(app.getHttpServer())
                .post('/applications')
                .set('Authorization', `Bearer ${accessToken}`)
                .send(createApplicationDto);

            createdApplicationId = response.body.id;

            await request(app.getHttpServer())
                .get(`/applications/${createdApplicationId}`)
                .set('Authorization', `Bearer ${accessToken}`)
                .expect(HttpStatus.OK)
                .then((response) => {
                    const application = response.body;
                    expect(application).toBeDefined();
                    expect(application.id).toBe(createdApplicationId);
                    expect(application.role).toBe(createApplicationDto.role);
                    expect(application.company).toBe(
                        createApplicationDto.company,
                    );
                    expect(application.jobLink).toBe(
                        createApplicationDto.jobLink,
                    );
                    expect(application.city).toBe(createApplicationDto.city);
                    expect(application.state).toBe(createApplicationDto.state);
                    expect(application.country).toBe(
                        createApplicationDto.country,
                    );
                    expect(application.description).toBe(
                        createApplicationDto.description,
                    );
                    expect(application.ctcOffered).toBe(
                        createApplicationDto.ctcOffered,
                    );
                    expect(application.status).toBe(
                        createApplicationDto.status,
                    );
                });
        } finally {
            const applicationsRepository = moduleFixture.get<
                Repository<Application>
            >(getRepositoryToken(Application));

            const applicationInDb = await applicationsRepository.findOne({
                where: { id: createdApplicationId },
            });

            expect(applicationInDb).toBeDefined();
            expect(applicationInDb.id).toBe(createdApplicationId);

            applicationsRepository.remove(applicationInDb);
        }
    });

    it('/applications (POST) should return 403 for unauthorized access', async () => {
        // register another test user
        const anotherUser: CreateApplicantDto = {
            username: 'smartuser2',
            firstName: 'Smart',
            lastName: 'User',
            email: 'smartuser@email.com',
            password: 'SmartPass123!',
        };

        try {
            await request(app.getHttpServer())
                .post('/auth/register')
                .send(anotherUser)
                .expect(HttpStatus.CREATED);

            let anotherUserLoginAccessToken: string;

            await request(app.getHttpServer())
                .post('/auth/login')
                .send({
                    username: anotherUser.username,
                    password: anotherUser.password,
                })
                .expect(HttpStatus.OK)
                .expect((response) => {
                    const returnAuthDto: ReturnAuthDTO = response.body;
                    expect(returnAuthDto).toBeDefined();
                    expect(returnAuthDto.access_token).toBeDefined();
                    anotherUserLoginAccessToken = returnAuthDto.access_token;
                });

            // create an application with the first test user
            const createAppResponse = await request(app.getHttpServer())
                .post('/applications')
                .set('Authorization', `Bearer ${accessToken}`)
                .send(createApplicationDto)
                .expect(HttpStatus.CREATED);

            const createdApplicationId = createAppResponse.body.id;

            // try to access the application with the second user
            await request(app.getHttpServer())
                .get(`/applications/${createdApplicationId}`)
                .set('Authorization', `Bearer ${anotherUserLoginAccessToken}`)
                .expect(HttpStatus.FORBIDDEN);
        } finally {
            // Clean up: Remove the second test user from the database.
            const applicantRepository = moduleFixture.get<
                Repository<Applicant>
            >(getRepositoryToken(Applicant));

            const anotherUserInDb = await applicantRepository.findOne({
                where: { username: anotherUser.username },
            });

            if (anotherUserInDb) {
                await applicantRepository.remove(anotherUserInDb);
            }
        }
    });
});
