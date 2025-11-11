import { IsNotEmpty, IsString, IsOptional, IsArray, MinLength } from "class-validator";

export class CreateTemplateDto {
    @IsString()
    @IsNotEmpty({ message: 'Title is required' })
    @MinLength(1, { message: 'Title cannot be empty' })
    title: string;

    @IsString()
    @IsNotEmpty({ message: 'Reply message is required' })
    @MinLength(1, { message: 'Reply message cannot be empty' })
    reply_message: string;

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    trigger_keywords?: string[];
}

