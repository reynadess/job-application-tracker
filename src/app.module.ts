import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CaslModule } from 'nest-casl';
import { ApplicantsModule } from './applicants/applicants.module';
import { ApplicationModule } from './applications/application.module';
import { ApplicationsController } from './applications/applications.controller';
import { ApplicationsService } from './applications/applications.service';
import { AuthModule } from './auth/auth.module';
import { Roles } from './auth/auth.roles';
import configuration from './config/configuration';
import { JobsModule } from './jobs/jobs.module';

@Module({
  imports: [
    JobsModule,
    AuthModule,
    ApplicantsModule,
    ConfigModule.forRoot({ isGlobal: true, load: [configuration] }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('database.host', 'localhost'),
        port: configService.get<number>('database.port', 5432),
        username: configService.get<string>('database.username', 'postgres'),
        password: configService.get<string>('database.password', 'postgres'),
        database: configService.get<string>(
          'database.name',
          'JobApplicationTracker',
        ),
        autoLoadEntities: true,
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
    CaslModule.forRoot<Roles>({}),
    ApplicationModule,
  ],
  controllers: [ApplicationsController],
  providers: [ApplicationsService],
})
export class AppModule {}
