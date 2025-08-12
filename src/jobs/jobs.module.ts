import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CaslModule } from 'nest-casl';
import { permissions } from '../applicants/applicants.permissions';
import { Job } from './entities/job.entity';
import { JobsController } from './jobs.controller';
import { JobService } from './jobs.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([Job]),
        CaslModule.forFeature({ permissions }),
    ],
    controllers: [JobsController],
    providers: [JobService],
    exports: [JobService],
})
export class JobsModule {}
