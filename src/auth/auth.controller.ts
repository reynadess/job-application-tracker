import {
  Body,
  Controller,
  Logger,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiBody } from '@nestjs/swagger';
import { UserDTO } from 'src/users/user.dto';
import { User } from 'src/users/user.entity';
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
  @ApiBody({ type: UserDTO })
  async login(@Request() req) {
    this.logger.log(`Login request for User: ${req.user.username}`);
    return this.authService.login(req.User, req.userId);
  }

  @Post('register')
  async register(@Body() user: User) {
    this.logger.log(`Register request for User: ${user.username}`);
    this.authService.register(user);
  }
}
