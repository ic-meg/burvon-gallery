import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { CreateChatDto } from './dto/create-chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';
import { CreateTemplateDto } from './dto/create-template.dto';
import { UpdateTemplateDto } from './dto/update-template.dto';

@Injectable()
export class ChatService {
    constructor(private readonly databaseService: DatabaseService) {}

    async createMessage(dto: CreateChatDto) {
        if (!dto.user_id && (!dto.session_id || !dto.email)) {
            throw new BadRequestException('Either user_id or (session_id + email) is required');
        }

        if (dto.user_id) {
            const user = await this.databaseService.userAccount.findUnique({
                where: { user_id: dto.user_id }
            });
            if (!user) {
                throw new BadRequestException(`User with user_id ${dto.user_id} does not exist`);
            }
        }

        // If admin_id is provided, validate it exists
        if (dto.admin_id) {
            const admin = await this.databaseService.userAccount.findUnique({
                where: { user_id: dto.admin_id }
            });
            if (!admin) {
                throw new BadRequestException(`Admin with user_id ${dto.admin_id} does not exist`);
            }
        }

        // Set is_from_admin based on sender_type
        const is_from_admin = dto.sender_type === 'admin';

        const chatMessage = await this.databaseService.chatMessage.create({
            data: {
                user_id: dto.user_id || null,
                session_id: dto.session_id || null,
                email: dto.email || null,
                admin_id: dto.admin_id || null,
                message: dto.message,
                is_from_admin,
            },
            include: {
                user: true,
                admin: true,
            }
        });
        return chatMessage;
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
        
        return { chatMessages };
    }

    async getSessionChatHistory(session_id: string) {
        const chatMessages = await this.databaseService.chatMessage.findMany({
            where: { session_id },
            include: {
                user: true,
                admin: true,
            },
            orderBy: { created_at: 'asc' }
        });
        
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
                is_from_admin: false, // Count customer messages that admin hasn't read
                is_read: false,
            }
        });
        
        return { unreadCount };
    }

    async getUnreadMessagesCountBySession(session_id: string) {
        const unreadCount = await this.databaseService.chatMessage.count({
            where: {
                session_id,
                is_from_admin: false, 
                is_read: false,
            }
        });
        
        return { unreadCount };
    }

    async markMessagesAsRead(user_id: number) {
        await this.databaseService.chatMessage.updateMany({
            where: {
                user_id,
                is_from_admin: false, // Mark customer messages as read (admin has read them)
                is_read: false,
            },
            data: { is_read: true }
        });
        
        return { message: 'Messages marked as read' };
    }

    async markMessagesAsReadBySession(session_id: string) {
        await this.databaseService.chatMessage.updateMany({
            where: {
                session_id,
                is_from_admin: false, 
                is_read: false,
            },
            data: { is_read: true }
        });
        
        return { message: 'Messages marked as read' };
    }

    async markConversationAsResolved(user_id?: number, session_id?: string, admin_id?: number) {
        if (!user_id && !session_id) {
            throw new BadRequestException('Either user_id or session_id is required');
        }

        const whereClause = user_id 
            ? { user_id }
            : { session_id };

        // Get email from the conversation if session-based
        let email: string | null = null;
        if (session_id) {
            const lastMessage = await this.databaseService.chatMessage.findFirst({
                where: { session_id },
                orderBy: { created_at: 'desc' }
            });
            email = lastMessage?.email || null;
        }

        // Mark messages as resolved
        await this.databaseService.chatMessage.updateMany({
            where: {
                ...whereClause,
                is_resolved: false,
            },
            data: { is_resolved: true }
        });

        // Create automated message to inform customer
        const resolvedMessage = "This conversation has been marked as resolved. If you need further assistance, please feel free to contact us again. Thank you!";
        
        const automatedMessage = await this.createMessage({
            user_id: user_id || undefined,
            session_id: session_id || undefined,
            email: email || undefined,
            admin_id: admin_id || undefined,
            message: resolvedMessage,
            sender_type: 'admin',
        });
        
        return { 
            message: 'Conversation marked as resolved',
            automatedMessage 
        };
    }

    // Get all conversations grouped by user_id or session_id
    async getAllConversations() {
        // Get all unique conversations
        const messages = await this.databaseService.chatMessage.findMany({
            include: {
                user: true,
                admin: true,
            },
            orderBy: { created_at: 'desc' }
        });

        // Group by user_id or session_id
        const conversationsMap = new Map();

        messages.forEach(msg => {
            const key = msg.user_id ? `user_${msg.user_id}` : `session_${msg.session_id}`;
            
            if (!conversationsMap.has(key)) {
                conversationsMap.set(key, {
                    identifier: key,
                    user_id: msg.user_id,
                    session_id: msg.session_id,
                    email: msg.email,
                    customerName: msg.user?.full_name || msg.email || 'Anonymous User',
                    customerInitials: msg.user?.full_name 
                        ? msg.user.full_name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
                        : (msg.email ? msg.email[0].toUpperCase() : 'A'),
                    lastMessage: msg.message,
                    lastSender: msg.is_from_admin ? 'admin' : 'customer',
                    timestamp: msg.created_at,
                    unreadCount: 0,
                    messages: [],
                    isOnline: false, // Will be updated by WebSocket
                    isResolved: false,
                });
            }

            const conv = conversationsMap.get(key);
            conv.messages.push(msg);
            
            
            if (!msg.is_from_admin && !msg.is_read) {
                conv.unreadCount++;
            }
            
            if (msg.is_resolved) {
                conv.isResolved = true;
            }
        });

        // Convert map to array and sort by last message time
        const conversations = Array.from(conversationsMap.values()).map(conv => ({
            ...conv,
            messages: conv.messages.sort((a, b) => 
                new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
            )
        }));

        return { conversations };
    }

    // Link anonymous session to user when they log in
    async linkSessionToUser(session_id: string, user_id: number) {
        const updated = await this.databaseService.chatMessage.updateMany({
            where: { 
                session_id, 
                user_id: null 
            },
            data: { 
                user_id,
                session_id: null // Remove session_id after linking
            }
        });

        return { 
            message: 'Session linked to user successfully',
            updatedCount: updated.count
        };
    }

    // Get conversation by identifier (user_id or session_id)
    async getConversationByIdentifier(identifier: string) {
        const isUser = identifier.startsWith('user_');
        const isSession = identifier.startsWith('session_');

        let messages;

        if (isUser) {
            const user_id = parseInt(identifier.replace('user_', ''));
            messages = await this.databaseService.chatMessage.findMany({
                where: { user_id },
                include: { user: true, admin: true },
                orderBy: { created_at: 'asc' }
            });
        } else if (isSession) {
            const session_id = identifier.replace('session_', '');
            messages = await this.databaseService.chatMessage.findMany({
                where: { session_id },
                include: { user: true, admin: true },
                orderBy: { created_at: 'asc' }
            });
        } else {
            throw new BadRequestException('Invalid identifier format');
        }

        return { messages };
    }

    // Template/AutoReply CRUD operations
    async getAllTemplates() {
        const templates = await this.databaseService.autoReply.findMany({
            orderBy: { created_at: 'desc' }
        });
        return { templates };
    }

    async getTemplateById(auto_reply_id: number) {
        const template = await this.databaseService.autoReply.findUnique({
            where: { auto_reply_id }
        });
        if (!template) {
            throw new NotFoundException('Template not found');
        }
        return template;
    }

    async createTemplate(dto: CreateTemplateDto) {
        const template = await this.databaseService.autoReply.create({
            data: {
                title: dto.title,
                reply_message: dto.reply_message,
                trigger_keywords: dto.trigger_keywords || []
            }
        });
        return template;
    }

    async updateTemplate(auto_reply_id: number, dto: UpdateTemplateDto) {
        const template = await this.databaseService.autoReply.findUnique({
            where: { auto_reply_id }
        });
        if (!template) {
            throw new NotFoundException('Template not found');
        }

        const updated = await this.databaseService.autoReply.update({
            where: { auto_reply_id },
            data: {
                ...(dto.title !== undefined && { title: dto.title }),
                ...(dto.reply_message !== undefined && { reply_message: dto.reply_message }),
                ...(dto.trigger_keywords !== undefined && { trigger_keywords: dto.trigger_keywords })
            }
        });
        return updated;
    }

    async deleteTemplate(auto_reply_id: number) {
        const template = await this.databaseService.autoReply.findUnique({
            where: { auto_reply_id }
        });
        if (!template) {
            throw new NotFoundException('Template not found');
        }

        await this.databaseService.autoReply.delete({
            where: { auto_reply_id }
        });
        return { message: 'Template deleted successfully' };
    }
}