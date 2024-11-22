import { Module } from '@nestjs/common';
import { JobsModule } from './jobs/jobs.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [JobsModule, AuthModule, UsersModule],
})
export class AppModule {}
