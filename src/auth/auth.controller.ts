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
import { ApiBody } from '@nestjs/swagger';
import {
    CreateApplicantDto,
    LoginApplicantDTO,
} from '../applicants/applicant.dto';
import { LocalAuthGuard } from './auth.guard';
import { BaseAuthService } from './auth.service';
import { Public } from './public.decorator';

@Controller('auth')
@Public()
export class AuthController {
    private readonly logger = new Logger(AuthController.name);
    constructor(private readonly authService: BaseAuthService) {}

    @UseGuards(LocalAuthGuard)
    @Post('login')
    @ApiBody({ type: LoginApplicantDTO })
    @HttpCode(HttpStatus.OK)
    async login(@Request() req): Promise<{ access_token: string }> {
        this.logger.log(`Login request for User: ${req.user.username}`);
        return await this.authService.login(req.user);
    }

    @Post('register')
    @ApiBody({ type: CreateApplicantDto })
    async register(@Body() user: CreateApplicantDto) {
        this.logger.log(`Register request for User: ${user.username}`);
        await this.authService.register(user);
    }
}
