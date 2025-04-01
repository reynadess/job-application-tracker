import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { JwtAuthGuard } from '../src/auth/auth.guard';

describe('ApplicationsController (e2e)', () => {
  let app: INestApplication;
  const MockAuthGuard = {
    canActivate: jest.fn(() => true),
  };

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideGuard(JwtAuthGuard)
      .useClass(MockAuthGuard)
      .compile();
    app = module.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should create an application', async () => {
    return await request(app.getHttpServer())
      .post('/applications')
      .expect(201)
      .send({
        role: 'Software Engineer',
        jobLink: 'https://example.com/job-link',
        city: 'New York',
        state: 'NY',
        country: 'USA',
        description: 'Software Engineer position at Example Company',
        company: 'Test Company',
        dateApplied: new Date(),
      });
  });
});
