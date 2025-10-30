import { HomepageCreateDto } from './create-homepage.dto'
import { PartialType }  from '@nestjs/mapped-types';

export class UpdateHomepageDto extends PartialType(HomepageCreateDto) {}
