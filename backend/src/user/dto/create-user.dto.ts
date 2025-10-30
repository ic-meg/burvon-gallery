import { IsEmail, IsIn, IsOptional, IsString } from 'class-validator';

const ALLOWED_USER_ROLES = ['customer', 'admin', 'manager', 'csr', 'clerk'] as const;
const ALLOWED_USER_STATUS = ['active', 'inactive', 'suspended'] as const;

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

  @IsIn([...ALLOWED_USER_ROLES])
  @IsOptional()
  role?: (typeof ALLOWED_USER_ROLES)[number];

  @IsIn([...ALLOWED_USER_STATUS])
  @IsOptional()
  status?: (typeof ALLOWED_USER_STATUS)[number];

  @IsOptional()
  can_access?: any; 
}
        