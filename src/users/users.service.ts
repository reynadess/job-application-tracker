import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async findOne(username: string): Promise<User | undefined> {
    return this.userRepository.findOne({
      select: ['id', 'username', 'password'],
      where: { username },
    });
  }

  async createOne(user: User): Promise<void> {
    user = this.userRepository.create(user);
    await this.userRepository.save(user);
  }
}
