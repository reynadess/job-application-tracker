import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CaslModule } from 'nest-casl';
import { permissions } from '../applicants/applicants.permissions';
import { JobsModule } from '../jobs/jobs.module';
import { ApplicationsController } from './applications.controller';
import { ApplicationsService } from './applications.service';
import { Application } from './entities/application.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([Application]),
        CaslModule.forFeature({ permissions }),
        JobsModule,
    ],
    controllers: [ApplicationsController],
    providers: [ApplicationsService],
})
export class ApplicationsModule {}
