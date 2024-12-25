import { Controller, Logger, Post, Request, UseGuards } from '@nestjs/common';
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
  async login(@Request() req) {
    this.logger.log(`Login request for User: ${req.user.username}`);
    return this.authService.login(req.User, req.userId);
  }

  @Post('register')
  async register(@Request() req) {
    this.logger.log(`Register request for User: ${req.body.username}`);
    this.authService.register(req.body);
  }
}
