import { IsNotEmpty, IsNumber, IsString, IsOptional, IsEmail } from "class-validator";

export class CreateChatDto {
    @IsNumber()
    @IsOptional()
    user_id?: number;
  
    @IsString()
    @IsOptional()
    session_id?: string; 
  
    @IsEmail()
    @IsOptional()
    email?: string; 
  
    @IsString()
    @IsOptional()
    customer_name?: string; 
  
    @IsNumber()
    @IsOptional()
    admin_id?: number;
  
    @IsString()
    @IsNotEmpty()
    message: string;
  
    @IsString()
    @IsOptional()
    sender_type?: string = 'user';
  }
