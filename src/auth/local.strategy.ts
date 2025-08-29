import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { IncomingMessage } from 'http';
import { Strategy } from 'passport-local';
import { BaseAuthService } from './auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
    constructor(private readonly authService: BaseAuthService) {
        super({
            passReqToCallback: true,
        });
    }

    async validate(
        req: IncomingMessage,
        username: string,
        password: string,
    ): Promise<any> {
        const user = await this.authService.validateUser(username, password);
        if (!user) {
            throw new UnauthorizedException();
        }
        return user;
    }
}
