import { Body, Controller, Get, ParseIntPipe, Post, Param, Patch, Delete, BadRequestException, Inject, forwardRef } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatGateway } from './chat.gateway';
import { CreateChatDto } from './dto/create-chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';
import { CreateTemplateDto } from './dto/create-template.dto';
import { UpdateTemplateDto } from './dto/update-template.dto';

@Controller('chat')
export class ChatController {
    constructor(
        private readonly chatService: ChatService,
        @Inject(forwardRef(() => ChatGateway))
        private readonly chatGateway: ChatGateway,
    ) {}

    @Post()
    create(@Body() createChatDto: CreateChatDto) {
        return this.chatService.createMessage(createChatDto);
    }

    @Get('user/:user_id')
    getUserChatHistory(@Param('user_id', ParseIntPipe) user_id: number) {
        return this.chatService.getUserChatHistory(user_id);
    }

    @Get('session/:session_id')
    getSessionChatHistory(@Param('session_id') session_id: string) {
        return this.chatService.getSessionChatHistory(session_id);
    }

    @Get('conversations')
    getAllConversations() {
        return this.chatService.getAllConversations();
    }

    @Get('conversation/:identifier')
    getConversationByIdentifier(@Param('identifier') identifier: string) {
        return this.chatService.getConversationByIdentifier(identifier);
    }

    @Get('admin/:admin_id')
    getAdminChatHistory(@Param('admin_id', ParseIntPipe) admin_id: number) {
        return this.chatService.getAdminChatHistory(admin_id);
    }

    @Get('all')
    getAllChats() {
        return this.chatService.getAllChats();
    }

    @Get('unread/user/:user_id')
    getUnreadMessagesCount(@Param('user_id', ParseIntPipe) user_id: number) {
        return this.chatService.getUnreadMessagesCount(user_id);
    }

    @Get('unread/session/:session_id')
    getUnreadMessagesCountBySession(@Param('session_id') session_id: string) {
        return this.chatService.getUnreadMessagesCountBySession(session_id);
    }

    // Template/AutoReply endpoints (must come before :chat_id route)
    @Get('templates')
    getAllTemplates() {
        return this.chatService.getAllTemplates();
    }

    @Get('templates/:auto_reply_id')
    getTemplateById(@Param('auto_reply_id', ParseIntPipe) auto_reply_id: number) {
        return this.chatService.getTemplateById(auto_reply_id);
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

    @Post('mark-read/user/:user_id')
    markMessagesAsRead(@Param('user_id', ParseIntPipe) user_id: number) {
        return this.chatService.markMessagesAsRead(user_id);
    }

    @Post('mark-read/session/:session_id')
    markMessagesAsReadBySession(@Param('session_id') session_id: string) {
        return this.chatService.markMessagesAsReadBySession(session_id);
    }

    @Post('link-session')
    linkSessionToUser(@Body() body: { session_id: string; user_id: number }) {
        return this.chatService.linkSessionToUser(body.session_id, body.user_id);
    }

    @Post('mark-resolved')
    async markConversationAsResolved(@Body() body: { user_id?: number; session_id?: string; admin_id?: number }) {
        const result = await this.chatService.markConversationAsResolved(body.user_id, body.session_id, body.admin_id);
        
        if (result.automatedMessage) {
            const chatMessage = result.automatedMessage;
            const server = this.chatGateway.getServer();
            
            if (body.admin_id) {
                // Admin message - broadcast to target room and admin room
                if (body.user_id) {
                    server.to(`user_${body.user_id}`).emit('NEW_MESSAGE', { chatMessage });
                } else if (body.session_id) {
                    server.to(`session_${body.session_id}`).emit('NEW_MESSAGE', { chatMessage });
                }
                // Also notify admin room
                server.to('admin').emit('NEW_MESSAGE', { chatMessage });
            }
        }
        
        return result;
    }

    // Template/AutoReply endpoints
    @Post('templates')
    async createTemplate(@Body() createTemplateDto: CreateTemplateDto) {
        try {
            return await this.chatService.createTemplate(createTemplateDto);
        } catch (error) {
            throw new BadRequestException(error.message || 'Failed to create template');
        }
    }

    @Patch('templates/:auto_reply_id')
    updateTemplate(
        @Param('auto_reply_id', ParseIntPipe) auto_reply_id: number,
        @Body() updateTemplateDto: UpdateTemplateDto
    ) {
        return this.chatService.updateTemplate(auto_reply_id, updateTemplateDto);
    }

    @Delete('templates/:auto_reply_id')
    deleteTemplate(@Param('auto_reply_id', ParseIntPipe) auto_reply_id: number) {
        return this.chatService.deleteTemplate(auto_reply_id);
    }
}