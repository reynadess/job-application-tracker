import { Injectable } from '@nestjs/common';
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

  async findOne(username: string): Promise<UserDTO | undefined> {
    return this.users.find((user) => user.username === username);
  }
}
