import {
    Body,
    Controller,
    HttpCode,
    HttpStatus,
    Logger,
    Post,
    Request,
    UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import {
    CreateApplicantDto,
    LoginApplicantDTO,
} from '../applicants/applicant.dto';
import { ReturnAuthDTO } from './auth.dto';
import { JwtRefreshStrategy, LocalAuthGuard } from './auth.guard';
import { BaseAuthService } from './auth.service';
import { Public } from './public.decorator';

@Controller('auth')
export class AuthController {
    private readonly logger = new Logger(AuthController.name);
    constructor(private readonly authService: BaseAuthService) {}

    @UseGuards(LocalAuthGuard)
    @Post('login')
    @ApiBody({ type: LoginApplicantDTO })
    @HttpCode(HttpStatus.OK)
    @Public()
    async login(@Request() req): Promise<ReturnAuthDTO> {
        this.logger.log(`Login request for User: ${req.user.username}`);
        return await this.authService.login(req.user);
    }

    @Post('register')
    @ApiBody({ type: CreateApplicantDto })
    @Public()
    async register(@Body() user: CreateApplicantDto) {
        this.logger.log(`Register request for User: ${user.username}`);
        await this.authService.register(user);
    }

    @Post('logout')
    @ApiBearerAuth()
    @HttpCode(HttpStatus.OK)
    async logout(@Request() req): Promise<void> {
        await this.authService.logout(req.user.id);
    }

    @UseGuards(JwtRefreshStrategy)
    @Post('jwt/refresh')
    @ApiBearerAuth()
    @HttpCode(HttpStatus.OK)
    @Public()
    // This endpoint is public because clients may only have a refresh token (not an access token) when requesting a new acces token JWT.
    async jwtRefreshToken(@Request() req): Promise<ReturnAuthDTO> {
        return await this.authService.jwtRefreshToken(req.user);
    }
}
