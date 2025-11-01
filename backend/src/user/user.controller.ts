import { Body, Controller, Delete, Get, Patch, Post, Param, ParseIntPipe, UseGuards, Request } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';  
import { UpdateUserDto } from './dto/update-user.dto';
import { UserRole } from '@prisma/client';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';

@Controller('user')
export class UserController {
    constructor (private readonly userService: UserService) { }

    // Legacy endpoints
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

    // Admin endpoints for user management
    @UseGuards(JwtAuthGuard)
    @Post('admin/create')
    createAdminUser(@Body() createUserDto: CreateUserDto) {
        return this.userService.createAdminUser(createUserDto);
    }

    @UseGuards(JwtAuthGuard)
    @Get('admin/all')
    getAllUsers(@Param('role') role?: UserRole) {
        return this.userService.getAllUsers(role);
    }

    @UseGuards(JwtAuthGuard)
    @Patch('admin/update/:id')
    updateAdminUser(
        @Body() updateUserDto: UpdateUserDto,
        @Param('id', ParseIntPipe) userId: number,
        @Request() req: any,
    ) {
        const requestingUserId = req.user?.user_id || 1;
        return this.userService.updateAdminUser(updateUserDto, userId, requestingUserId);
    }

    @UseGuards(JwtAuthGuard)
    @Delete('admin/delete/:id')
    deleteAdminUser(
        @Param('id', ParseIntPipe) userId: number,
        @Request() req: any,
    ) {
        const requestingUserId = req.user?.user_id || 1;
        return this.userService.deleteAdminUser(userId, requestingUserId);
    }
}

