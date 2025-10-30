import { IsNotEmpty, IsNumber, IsString, IsOptional } from "class-validator";

export class CreateChatDto {
    @IsNumber()
    @IsNotEmpty()
    user_id: number;

    @IsNumber()
    @IsOptional()
    admin_id?: number;

    @IsString()
    @IsNotEmpty()
    message: string;

    @IsString()
    @IsOptional()
    sender_type?: string = 'user'; // 'user' or 'admin'
}
