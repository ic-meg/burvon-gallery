import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserRole } from '@prisma/client';
import { generateStrongPassword, hashPassword } from './utils/password.util';

@Injectable()
export class UserService {
  constructor(private readonly db: DatabaseService) {}


  async createAdminUser(createUserDto: CreateUserDto) {
    const existingUser = await this.db.userAccount.findUnique({
      where: { email: createUserDto.email },
    });

    if (existingUser) {
      throw new BadRequestException('User with this email already exists');
    }


    const generatedPassword = generateStrongPassword();
    const hashedPassword = await hashPassword(generatedPassword);

   
    const user = await this.db.userAccount.create({
      data: {
        ...createUserDto,
        password_hash: hashedPassword,
        can_access: createUserDto.can_access || [],
      },
      select: {
        user_id: true,
        full_name: true,
        email: true,
        role: true,
        status: true,
        can_access: true,
        created_at: true,
      },
    });

    return {
      ...user,
      generated_password: generatedPassword,
      message: 'User created successfully. Share this password with the user.',
    };
  }

  async getAllUsers(role?: UserRole) {
    const users = await this.db.userAccount.findMany({
      where: role ? { role } : {},
      select: {
        user_id: true,
        full_name: true,
        email: true,
        role: true,
        status: true,
        can_access: true,
        created_at: true,
      },
      orderBy: {
        created_at: 'desc',
      },
    });

    if (users.length === 0) {
      throw new NotFoundException('No users found');
    }
    return users;
  }


  async findOne(id: number) {
    const user = await this.db.userAccount.findUnique({
      where: { user_id: id },
      select: {
        user_id: true,
        full_name: true,
        email: true,
        role: true,
        status: true,
        can_access: true,
        created_at: true,
      },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  
  async updateAdminUser(updateUserDto: UpdateUserDto, id: number, requestingUserId: number) {
    
    const userToUpdate = await this.db.userAccount.findUnique({
      where: { user_id: id },
    });

    if (!userToUpdate) {
      throw new NotFoundException('User not found');
    }

    // Prevent updating other Super Admins
    if (userToUpdate.role === 'super_admin' && id !== requestingUserId) {
      throw new ForbiddenException('Cannot update other Super Admins');
    }

    const updatedUser = await this.db.userAccount.update({
      where: { user_id: id },
      data: {
        ...updateUserDto,
        can_access: updateUserDto.can_access,
      },
      select: {
        user_id: true,
        full_name: true,
        email: true,
        role: true,
        status: true,
        can_access: true,
        created_at: true,
      },
    });

    return { message: 'User updated successfully', user: updatedUser };
  }


  async deleteAdminUser(id: number, requestingUserId: number) {
   
    const userToDelete = await this.db.userAccount.findUnique({
      where: { user_id: id },
    });

    if (!userToDelete) {
      throw new NotFoundException('User not found');
    }

    
    if (userToDelete.role === 'super_admin' && id !== requestingUserId) {
      throw new ForbiddenException('Cannot delete other Super Admins');
    }

    
    if (id === requestingUserId) {
      throw new ForbiddenException('Cannot delete your own account');
    }

    const deletedUser = await this.db.userAccount.delete({
      where: { user_id: id },
      select: {
        user_id: true,
        full_name: true,
        email: true,
        role: true,
      },
    });

    return { message: 'User deleted successfully', user: deletedUser };
  }

 
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
