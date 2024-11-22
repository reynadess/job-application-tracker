import { Injectable, Scope, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserDTO } from 'src/users/user.dto';
import { UsersService } from 'src/users/users.service';
import { AuthDTO } from './auth.dto';

export abstract class BaseAuthService {
  abstract validateUser(
    username: string,
    password: string,
  ): Promise<{ username: string; userId: number }>;
  abstract login(username: string, userId: number): Promise<any>;
  abstract register(arg0: AuthDTO): Promise<any>;
}

@Injectable({ scope: Scope.REQUEST })
export class JwtAuthService implements BaseAuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(
    username: string,
    password: string,
  ): Promise<{ username: string; userId: number } | undefined> {
    const user: UserDTO = await this.usersService.findOne(username);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    const isMatch: boolean = user.password === password; // TODO Hashing
    if (!isMatch) {
      throw new UnauthorizedException('Password does not match');
    }
    return { username: user.username, userId: user.id };
  }

  async register(_AuthDTO: any): Promise<any> {
    throw new Error('Method not implemented.');
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
}
