import { IsEmail, IsString, IsEnum, IsOptional, IsArray } from 'class-validator';
import { UserRole, UserStatus } from '@prisma/client';

export class CreateUserDto {
  @IsString()
  full_name: string;

  @IsEmail()
  email: string;

  @IsEnum(UserRole)
  role: UserRole;

  @IsEnum(UserStatus)
  @IsOptional()
  status?: UserStatus = 'active';

  @IsArray()
  @IsOptional()
  can_access?: string[] = [];
}
        