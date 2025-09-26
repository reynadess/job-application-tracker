import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ApplicantsModule } from '../applicants/applicants.module';
import { AuthController } from './auth.controller';
import { JwtAuthGuard, LocalAuthGuard } from './auth.guard';
import { BaseAuthService, JwtAuthService } from './auth.service';
import { JwtAccessStrategy, JwtRefreshStrategy } from './jwt.strategy';
import { LocalStrategy } from './local.strategy';
import { PasswordService } from './password.service';

@Module({
    providers: [
        { provide: APP_GUARD, useClass: JwtAuthGuard },
        { provide: BaseAuthService, useClass: JwtAuthService },
        LocalAuthGuard,
        LocalStrategy,
        JwtAccessStrategy,
        JwtRefreshStrategy,
        PasswordService,
    ],
    controllers: [AuthController],
    imports: [
        ApplicantsModule,
        PassportModule,
        JwtModule.register({
            global: true,
        }),
    ],
    exports: [],
})
export class AuthModule {}
