import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ApplicantsModule } from 'src/applicants/applicants.module';
import { AuthController } from './auth.controller';
import { JwtAuthGuard, LocalAuthGuard } from './auth.guard';
import { BaseAuthService, JwtAuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { LocalStrategy } from './local.strategy';

@Module({
  providers: [
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    { provide: BaseAuthService, useClass: JwtAuthService },
    LocalAuthGuard,
    LocalStrategy,
    JwtStrategy,
  ],
  controllers: [AuthController],
  imports: [
    ApplicantsModule,
    PassportModule,
    JwtModule.register({
      global: true,
      secret: 'secretKey', // FIXME Update JWT Secret Key
      signOptions: { expiresIn: '600s' }, // TODO Increase later
    }),
  ],
  exports: [],
})
export class AuthModule {}
