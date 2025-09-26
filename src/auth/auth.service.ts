import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CreateApplicantDto } from '../applicants/applicant.dto';
import { Applicant } from '../applicants/applicant.entity';
import { ApplicantsService } from '../applicants/applicants.service';
import { ReturnAuthDTO } from './auth.dto';
import { PasswordService } from './password.service';

export type User = { username: string; userId: number };
export type Payload = { username: string; sub: number; id: number };

export abstract class BaseAuthService {
    abstract logout(userId: number): Promise<void>;
    abstract validateUser(username: string, password: string): Promise<User>;

    /**
     * Authenticates the given user and generates both access and refresh tokens.
     *
     * @param user - The user entity for whom the tokens are to be generated.
     * @returns A promise that resolves to an object containing the generated `access_token` and `refresh_token`.
     */
    abstract login(user: User): Promise<ReturnAuthDTO>;
    abstract register(User: CreateApplicantDto): Promise<void>;
    abstract jwtRefreshToken(user: User): Promise<ReturnAuthDTO>;
}

@Injectable()
export class JwtAuthService implements BaseAuthService {
    constructor(
        private readonly applicantsService: ApplicantsService,
        private readonly jwtService: JwtService,
        private readonly passwordService: PasswordService,
    ) {}

    /**
     * Authenticates the given user and generates both access and refresh tokens.
     *
     * @param user - The user entity for whom the tokens are to be generated.
     * @returns A promise that resolves to an object containing the generated `access_token` and `refresh_token`.
     */
    async login(user: User): Promise<ReturnAuthDTO> {
        const accessTokenPromise = this.getAccessToken(user);
        const refreshTokenPromise = this.getRefreshToken(user);

        const [accessToken, refreshToken] = await Promise.all([
            accessTokenPromise,
            refreshTokenPromise,
        ]);

        await this.applicantsService.updateRefreshToken(
            user.userId,
            refreshToken,
        );

        const returnAuthDto: ReturnAuthDTO = {
            access_token: accessToken,
            refresh_token: refreshToken,
        };

        return returnAuthDto;
    }

    async register(user: CreateApplicantDto): Promise<void> {
        // Hash the password before storing
        const hashedPassword = await this.passwordService.hashPassword(user.password);
        const userWithHashedPassword = {
            ...user,
            password: hashedPassword,
        };
        await this.applicantsService.createApplicant(userWithHashedPassword);
    }

    async logout(userId: number): Promise<void> {
        await this.applicantsService.updateRefreshToken(userId, null);
    }

    async jwtRefreshToken(user: User): Promise<ReturnAuthDTO> {
        return await this.login(user);
    }

    async validateUser(username: string, password: string): Promise<User> {
        const user: Applicant | undefined =
            await this.applicantsService.findOne(username);
        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }
        
        // Use bcrypt to compare the provided password with the hashed password
        const isMatch: boolean = await this.passwordService.comparePasswords(
            password,
            user.password,
        );
        
        if (!isMatch) {
            throw new UnauthorizedException('Invalid credentials');
        }
        
        // TODO Should think about roles for user
        return { username: user.username, userId: user.id };
    }

    async getAccessToken(user: User): Promise<string> {
        const payload: Payload = {
            username: user.username,
            sub: user.userId,
            id: user.userId,
        };

        return this.jwtService.signAsync(payload, {
            expiresIn: '900s', // Currently 15 mins.
            secret: 'accessTokenSecretKey', // TODO Generate a secure random key
        });
    }

    async getRefreshToken(user: User): Promise<string> {
        const payload: Payload = {
            username: user.username,
            sub: user.userId,
            id: user.userId,
        };

        return this.jwtService.signAsync(payload, {
            expiresIn: '7d', // Currently 7 days.
            secret: 'refreshTokenSecretKey', // TODO Generate a secure random key
        });
    }

    async updateRefreshToken(
        userId: number,
        refreshToken: string | null,
    ): Promise<void> {
        await this.applicantsService.updateRefreshToken(userId, refreshToken);
    }
}
