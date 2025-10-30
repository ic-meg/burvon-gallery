import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserRole } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(private readonly db: DatabaseService) {}

  async createUser(createUserDto: CreateUserDto) {
    const user = await this.db.userAccount.create({
      data: createUserDto,
    });
    return user;
  }

  async getUser(UserRole?: UserRole) {
    const users = await this.db.userAccount.findMany({
      where: { role: UserRole },
    });
    if (users.length === 0) {
      throw new NotFoundException('No users found');
    }
    return users;
  }

  async findOne(id: number) {
    const user = await this.db.userAccount.findUnique({
      where: { user_id: id },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async updateUser(updateUserDto: UpdateUserDto, id: number) {
    const updateUser = await this.db.userAccount.update({
      where: { user_id: id },
      data: updateUserDto,
    });
    if (!updateUser) {
      throw new NotFoundException('User not found');
    }
    return { message: 'User updated successfully', updateUser };
  }

  async deleteUser(id: number) { 

    const deleteUser = await this.db.userAccount.delete({
      where: { user_id: id },
    });
    if (!deleteUser) {
      throw new NotFoundException('User not found');
    }
    return { message: 'User deleted successfully', deleteUser };
  }
}
