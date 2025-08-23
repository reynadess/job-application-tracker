import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { IncomingMessage } from 'http';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Applicant } from '../applicants/applicant.entity';
import { ApplicantsService } from '../applicants/applicants.service';
import { Payload } from './auth.service';

@Injectable()
export class JwtAccessStrategy extends PassportStrategy(Strategy) {
    constructor(private readonly applicantsService: ApplicantsService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: 'accessTokenSecretKey', // FIXME Update JWT Secret Key
        });
    }

    async validate(payload: Payload) {
        const user: Applicant = await this.applicantsService.findOne(
            payload.username,
        );

        if (!user) {
            throw new UnauthorizedException('Invalid access token');
        }

        // This is required to be present in the payload for nest-casl authorization
        const roles = [user.constructor.name];

        return {
            username: user.username,
            id: user.id,
            sub: user.id,
            roles: roles,
        };
    }
}

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
    Strategy,
    'jwt-refresh',
) {
    constructor(private readonly applicantsService: ApplicantsService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: 'refreshTokenSecretKey', // FIXME Update JWT Secret Key
            passReqToCallback: true,
        });
    }

    async validate(request: IncomingMessage, payload: Payload) {
        const authHeader = request.headers.authorization;

        const refreshToken = authHeader.replace('Bearer', '').trim();

        // Validate the refresh token
        const user: Applicant | undefined =
            await this.applicantsService.findOne(payload.username);

        if (!user?.refreshToken || user.refreshToken !== refreshToken) {
            throw new UnauthorizedException('Invalid refresh token');
        }

        // This is required to be present in the payload for nest-casl authorization
        const roles = [user.constructor.name];

        return {
            ...payload,
            roles: roles,
        };
    }
}
