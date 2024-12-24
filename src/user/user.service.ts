import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async findOne(username: string): Promise<User | undefined> {
    try {
      return await this.userRepository.findOne({
        select: ['id', 'username', 'password'],
        where: { username },
      });
    } catch (error) {
      this.logger.error(`Finding User: ${username} failed`, error);
      throw error;
    }
  }

  async createOne(user: User): Promise<Boolean> {
    try {
      user = this.userRepository.create(user);
      await this.userRepository.save(user);
      return true;
    } catch (error) {
      this.logger.error(`Creating User: ${user.username} failed`, error);
      return false;
    }
  }
}
