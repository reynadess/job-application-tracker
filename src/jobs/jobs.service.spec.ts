import { Test, TestingModule } from '@nestjs/testing';
import { JobService } from './jobs.service';

describe('JobsService', () => {
    let service: JobService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [JobService],
        }).compile();

        service = module.get<JobService>(JobService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
