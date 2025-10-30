import { IsEmail, IsEnum, IsOptional, IsString } from 'class-validator';
import { UserRole, UserStatus } from '@prisma/client'; 

export class CreateUserDto {
  @IsString()
  @IsOptional()
  full_name: string;

  @IsEmail()
  @IsOptional()
  email: string;

  @IsString()
  @IsOptional()
  password_hash: string;

  @IsEnum(UserRole)
  @IsOptional() 
  role?: UserRole;

  @IsOptional()
  status?: UserStatus; 

  @IsOptional()
  can_access?: any; 
}
        