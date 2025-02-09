import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Applicant } from 'src/applicants/applicant.entity';
import { ApplicantsService } from 'src/applicants/applicants.service';
import { Payload } from './auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly applicantsService: ApplicantsService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: 'secretKey', // FIXME Update JWT Secret Key
    });
  }

  async validate(payload: Payload) {
    // TODO Roles should be added to the payload
    const user: Applicant = await this.applicantsService.findOne(
      payload.username,
    );
    if (!user) {
      throw new UnauthorizedException();
    }
    const roles = [user.constructor.name];
    return { username: user.username, id: user.id, sub: user.id, roles: roles };
  }
}
