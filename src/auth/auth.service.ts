import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CreateApplicantDto } from '../applicants/applicant.dto';
import { Applicant } from '../applicants/applicant.entity';
import { ApplicantsService } from '../applicants/applicants.service';

export type User = { username: string; userId: number };
export type Payload = { username: string; sub: number; id: number };

export abstract class BaseAuthService {
    abstract validateUser(username: string, password: string): Promise<User>;
    abstract login(user: User): Promise<{ access_token: string }>;
    abstract register(User: CreateApplicantDto): Promise<void>;
}

@Injectable()
export class JwtAuthService implements BaseAuthService {
    constructor(
        private readonly applicantsService: ApplicantsService,
        private readonly jwtService: JwtService,
    ) {}

    async validateUser(username: string, password: string): Promise<User> {
        const user: Applicant | undefined =
            await this.applicantsService.findOne(username);
        if (!user) {
            throw new UnauthorizedException();
        }
        const isMatch: boolean = user.password === password; // TODO Hashing
        if (!isMatch) {
            throw new UnauthorizedException();
        }
        // TODO Should think about roles for user
        return { username: user.username, userId: user.id };
    }

    async login(user: User): Promise<{ access_token: string }> {
        const payload: Payload = {
            username: user.username,
            sub: user.userId,
            id: user.userId,
        };
        return {
            access_token: await this.jwtService.signAsync(payload),
        };
    }

    async register(User: CreateApplicantDto): Promise<void> {
        await this.applicantsService.createApplicant(User);
    }
}
