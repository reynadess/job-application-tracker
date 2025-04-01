import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from 'src/app.module';
import * as request from 'supertest';

describe('ApplicationsController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = module.createNestApplication();
    await app.init();
  });

  it('should create an application', async () => {
    return request(app.getHttpServer()).post('/applications').expect(201).send({
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
