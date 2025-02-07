import {
  Injectable,
  ServiceUnavailableException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Applicant } from 'src/applicants/applicant.entity';
import { ApplicantsService } from 'src/applicants/applicants.service';

export abstract class BaseAuthService {
  abstract validateUser(
    username: string,
    password: string,
  ): Promise<{ username: string; userId: number }>;
  abstract login(username: string, userId: number): Promise<any>;
  abstract register(User: Applicant): Promise<any>;
}

@Injectable()
export class JwtAuthService implements BaseAuthService {
  constructor(
    private applicantsService: ApplicantsService,
    private jwtService: JwtService,
  ) {}

  async validateUser(
    username: string,
    password: string,
  ): Promise<{ username: string; userId: number } | undefined> {
    try {
      const user: Applicant | undefined =
        await this.applicantsService.findOne(username);
      if (!user) {
        throw new UnauthorizedException('User not found');
      }
      const isMatch: boolean = user.password === password; // TODO Hashing
      if (!isMatch) {
        throw new UnauthorizedException('Password does not match');
      }
      return { username: user.username, userId: user.id };
    } catch (error) {
      throw new ServiceUnavailableException(error);
    }
  }

  async login(
    username: string,
    userId: number,
  ): Promise<{ access_token: string }> {
    const payload = { username, sub: userId };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async register(User: Applicant): Promise<void> {
    await this.applicantsService.createOne(User);
  }
}
