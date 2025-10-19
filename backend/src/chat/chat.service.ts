import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { CreateChatDto } from './dto/create-chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';

@Injectable()
export class ChatService {
    constructor(private readonly databaseService: DatabaseService) {}

    async createMessage(dto: CreateChatDto) {
        const chatMessage = await this.databaseService.chatMessage.create({
            data: {
                ...dto,
            },
            include: {
                user: true,
                admin: true,
            }
        });
        return { chatMessage };
    }

    async getUserChatHistory(user_id: number) {
        const chatMessages = await this.databaseService.chatMessage.findMany({
            where: { user_id },
            include: {
                user: true,
                admin: true,
            },
            orderBy: { created_at: 'asc' }
        });
        
        if (chatMessages.length === 0) {
            throw new NotFoundException('No chat history found');
        }
        return { chatMessages };
    }

    async getAdminChatHistory(admin_id: number) {
        const chatMessages = await this.databaseService.chatMessage.findMany({
            where: { admin_id },
            include: {
                user: true,
                admin: true,
            },
            orderBy: { created_at: 'asc' }
        });
        
        if (chatMessages.length === 0) {
            throw new NotFoundException('No chat history found');
        }
        return { chatMessages };
    }

    async getAllChats() {
        const chatMessages = await this.databaseService.chatMessage.findMany({
            include: {
                user: true,
                admin: true,
            },
            orderBy: { created_at: 'desc' }
        });
        
        if (chatMessages.length === 0) {
            throw new NotFoundException('No chats found');
        }
        return { chatMessages };
    }

    async findOne(chat_id: number) {
        const chatMessage = await this.databaseService.chatMessage.findUnique({
            where: { chat_id },
            include: {
                user: true,
                admin: true,
            }
        });
        
        if (!chatMessage) {
            throw new NotFoundException('Chat message not found');
        }
        return { chatMessage };
    }

    async updateMessage(chat_id: number, updateChatDto: UpdateChatDto) {
        const updateChat = await this.databaseService.chatMessage.update({
            where: { chat_id },
            data: { ...updateChatDto },
            include: {
                user: true,
                admin: true,
            }
        });
        
        if (!updateChat) {
            throw new NotFoundException('Chat message not found');
        }
        return { message: 'Chat message updated successfully', updateChat };
    }

    async deleteMessage(chat_id: number) {
        const deleteChat = await this.databaseService.chatMessage.delete({
            where: { chat_id },
        });
        
        if (!deleteChat) {
            throw new NotFoundException('Chat message not found');
        }
        return { message: 'Chat message deleted successfully', deleteChat };
    }

    async getUnreadMessagesCount(user_id: number) {
        const unreadCount = await this.databaseService.chatMessage.count({
            where: {
                user_id,
                is_from_admin: true,
                // Add a read status field laturr
            }
        });
        
        return { unreadCount };
    }

    async markMessagesAsRead(user_id: number) {
        // This would require adding a read status field to our schemaaa
        // For now, we'll just return a success message po
        return { message: 'Messages marked as read' };
    }
}