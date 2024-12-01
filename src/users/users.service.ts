import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user';
import { UserDTO } from './user.dto';

@Injectable()
export class UsersService {
  private readonly users: UserDTO[] = [
    {
      id: 1,
      username: 'john',
      password: 'changeme',
      firstName: 'John',
      lastName: 'Wick',
      email: 'john.wick@x.com',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async findOne(username: string): Promise<UserDTO | undefined> {
    // return this.userRepository.findOneBy({ username });
    return this.users.find((user) => user.username === username);
  }
}
