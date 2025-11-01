import { Body, Controller, Delete, Get, Patch, Post, Param, ParseIntPipe} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';  
import { UpdateUserDto } from './dto/update-user.dto';
import { UserRole } from '@prisma/client';


@Controller('user')
export class UserController {
    constructor (private readonly userService: UserService) { }

    @Get()
    findAll(UserRole?: UserRole) {
        return this.userService.getUser(UserRole);
    }

    @Get(':id')
    findOne(@Param('id', ParseIntPipe) user_id: number) {
        return this.userService.findOne(user_id);
    }

    @Patch(':id')
    update(@Body() updateUserDto: UpdateUserDto, @Param('id', ParseIntPipe) user_id: number) {
        return this.userService.updateUser(updateUserDto, user_id);
    }

    @Delete(':id')
    delete(@Param('id', ParseIntPipe) user_id: number) {
        return this.userService.deleteUser(user_id);
    }
}

