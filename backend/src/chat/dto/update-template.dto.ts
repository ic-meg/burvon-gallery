import { IsOptional, IsString, IsArray } from "class-validator";

export class UpdateTemplateDto {
    @IsOptional()
    @IsString()
    title?: string;

    @IsOptional()
    @IsString()
    reply_message?: string;

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    trigger_keywords?: string[];
}

