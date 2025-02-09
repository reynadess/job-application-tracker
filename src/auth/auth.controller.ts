import {
  Body,
  Controller,
  Logger,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiBody } from '@nestjs/swagger';
import {
  CreateApplicantDto,
  LoginApplicantDTO,
} from 'src/applicants/applicant.dto';
import { Applicant } from 'src/applicants/applicant.entity';
import { LocalAuthGuard } from './auth.guard';
import { BaseAuthService } from './auth.service';
import { Public } from './public.decorator';

@Controller('auth')
@Public()
export class AuthController {
  private readonly logger = new Logger(AuthController.name);
  constructor(private authService: BaseAuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @ApiBody({ type: LoginApplicantDTO })
  async login(@Request() req): Promise<{ access_token: string }> {
    this.logger.log(`Login request for User: ${req.user.username}`);
    return await this.authService.login(req.user);
  }

  @Post('register')
  @ApiBody({ type: CreateApplicantDto })
  async register(@Body() user: Applicant) {
    this.logger.log(`Register request for User: ${user.username}`);
    await this.authService.register(user);
  }
}
