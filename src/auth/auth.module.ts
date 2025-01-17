import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UsersModule } from 'src/users/users.module';
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
    UsersModule,
    PassportModule,
    JwtModule.register({
      global: true,
      secret: 'secretKey', // FIXME Update this
      signOptions: { expiresIn: '60s' }, // TODO Increase later
    }),
  ],
  exports: [],
})
export class AuthModule {}
