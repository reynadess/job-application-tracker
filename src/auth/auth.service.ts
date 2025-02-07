import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Applicant } from 'src/applicants/applicant.entity';
import { ApplicantsService } from 'src/applicants/applicants.service';

export abstract class BaseAuthService {
  abstract validateUser(
    username: string,
    password: string,
  ): Promise<{ username: string; userId: number }>;
  abstract login(user: {
    username: string;
    userId: number;
  }): Promise<{ access_token: string }>;
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
    const user: Applicant | undefined =
      await this.applicantsService.findOne(username);
    if (!user) {
      throw new UnauthorizedException();
    }
    const isMatch: boolean = user.password === password; // TODO Hashing
    if (!isMatch) {
      throw new UnauthorizedException();
    }
    return { username: user.username, userId: user.id };
  }

  async login(user: {
    username: string;
    userId: number;
  }): Promise<{ access_token: string }> {
    const payload = { username: user.username, sub: user.userId };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async register(User: Applicant): Promise<void> {
    await this.applicantsService.createOne(User);
  }
}
