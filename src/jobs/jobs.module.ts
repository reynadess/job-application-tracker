import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Job } from './job.entity';
import { JobsController } from './jobs.controller';
import { JobService } from './jobs.service';
 import { CaslModule } from 'nest-casl';
import { permissions } from 'src/applicants/applicants.permissions';
@Module({
    imports: [TypeOrmModule.forFeature([Job]), CaslModule.forFeature({permissions})],
    controllers: [JobsController],
    providers: [JobService],
    exports: [JobService],
})
export class JobsModule {}
