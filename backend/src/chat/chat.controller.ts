import { Body, Controller, Get, ParseIntPipe, Post, Param, Patch, Delete } from '@nestjs/common';
import { ChatService } from './chat.service';
import { CreateChatDto } from './dto/create-chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';

@Controller('chat')
export class ChatController {
    constructor(private readonly chatService: ChatService) {}

    @Post()
    create(@Body() createChatDto: CreateChatDto) {
        return this.chatService.createMessage(createChatDto);
    }

    @Get('user/:user_id')
    getUserChatHistory(@Param('user_id', ParseIntPipe) user_id: number) {
        return this.chatService.getUserChatHistory(user_id);
    }

    @Get('admin/:admin_id')
    getAdminChatHistory(@Param('admin_id', ParseIntPipe) admin_id: number) {
        return this.chatService.getAdminChatHistory(admin_id);
    }

    @Get('all')
    getAllChats() {
        return this.chatService.getAllChats();
    }

    @Get('unread/:user_id')
    getUnreadMessagesCount(@Param('user_id', ParseIntPipe) user_id: number) {
        return this.chatService.getUnreadMessagesCount(user_id);
    }

    @Get(':chat_id')
    findOne(@Param('chat_id', ParseIntPipe) chat_id: number) {
        return this.chatService.findOne(chat_id);
    }

    @Patch(':chat_id')
    update(@Param('chat_id', ParseIntPipe) chat_id: number, @Body() updateChatDto: UpdateChatDto) {
        return this.chatService.updateMessage(chat_id, updateChatDto);
    }

    @Delete(':chat_id')
    remove(@Param('chat_id', ParseIntPipe) chat_id: number) {
        return this.chatService.deleteMessage(chat_id);
    }

    @Post('mark-read/:user_id')
    markMessagesAsRead(@Param('user_id', ParseIntPipe) user_id: number) {
        return this.chatService.markMessagesAsRead(user_id);
    }
}