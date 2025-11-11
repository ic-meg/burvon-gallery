import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';
import { CreateChatDto } from './dto/create-chat.dto';
import { Logger } from '@nestjs/common';

@WebSocketGateway({
  cors: {
    origin: [
      'http://localhost:5173',
      'http://localhost:3000',
      'https://burvon-gallery.website',
      process.env.VITE_FRONTEND_URL || 'https://burvon-gallery.website'
    ],
    credentials: true,
  },
  namespace: '/chat',
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;
  
  public getServer(): Server {
    return this.server;
  }

  private readonly logger = new Logger(ChatGateway.name);
  
  // Track connections
  private userConnections = new Map<number, Set<string>>(); // user_id -> socket_ids
  private sessionConnections = new Map<string, Set<string>>(); // session_id -> socket_ids
  private adminConnections = new Set<string>();
  private socketToUser = new Map<string, { type: 'user' | 'session' | 'admin'; id: string | number }>();

  constructor(private readonly chatService: ChatService) {}

  async handleConnection(client: Socket) {
    // Client connected
  }

  async handleDisconnect(client: Socket) {
    const userInfo = this.socketToUser.get(client.id);
    if (userInfo) {
      if (userInfo.type === 'user') {
        const userId = userInfo.id as number;
        const sockets = this.userConnections.get(userId);
        if (sockets) {
          sockets.delete(client.id);
          if (sockets.size === 0) {
            this.userConnections.delete(userId);
            // Notify admin that user went offline
            this.server.to('admin').emit('USER_OFFLINE', { user_id: userId });
          }
        }
      } else if (userInfo.type === 'session') {
        const sessionId = userInfo.id as string;
        const sockets = this.sessionConnections.get(sessionId);
        if (sockets) {
          sockets.delete(client.id);
          if (sockets.size === 0) {
            this.sessionConnections.delete(sessionId);
            // Notify admin that session went offline
            this.server.to('admin').emit('SESSION_OFFLINE', { session_id: sessionId });
          }
        }
      } else if (userInfo.type === 'admin') {
        this.adminConnections.delete(client.id);
        
        // Notify all customers if no admins are online
        if (this.adminConnections.size === 0) {
          this.server.emit('ADMIN_OFFLINE', { isOnline: false });
        }
      }
      this.socketToUser.delete(client.id);
    }
  }

  @SubscribeMessage('JOIN_CHAT')
  async handleJoin(
    @MessageBody() data: { user_id?: number; session_id?: string; email?: string; isAdmin?: boolean },
    @ConnectedSocket() client: Socket,
  ) {
    try {
      if (data.isAdmin) {
        // Admin joining
        await client.join('admin');
        this.adminConnections.add(client.id);
        this.socketToUser.set(client.id, { type: 'admin', id: 'admin' });
        
        // Notify all customers that admin is online
        this.server.emit('ADMIN_ONLINE', { isOnline: true });
        
        // Notify admin of all active conversations
        const { conversations } = await this.chatService.getAllConversations();
        client.emit('CONVERSATIONS_LIST', { conversations });
      } else if (data.user_id) {
        // Logged-in user
        const room = `user_${data.user_id}`;
        await client.join(room);
        
        if (!this.userConnections.has(data.user_id)) {
          this.userConnections.set(data.user_id, new Set());
        }
        this.userConnections.get(data.user_id)!.add(client.id);
        this.socketToUser.set(client.id, { type: 'user', id: data.user_id });
        
        // Notify admin that user is online
        this.server.to('admin').emit('USER_ONLINE', { user_id: data.user_id });
        
        // Send current admin online status to this customer
        client.emit(this.adminConnections.size > 0 ? 'ADMIN_ONLINE' : 'ADMIN_OFFLINE', {
          isOnline: this.adminConnections.size > 0
        });
      } else if (data.session_id) {
        // Anonymous user
        const room = `session_${data.session_id}`;
        await client.join(room);
        
        if (!this.sessionConnections.has(data.session_id)) {
          this.sessionConnections.set(data.session_id, new Set());
        }
        this.sessionConnections.get(data.session_id)!.add(client.id);
        this.socketToUser.set(client.id, { type: 'session', id: data.session_id });
        
        // Notify admin that session is online
        this.server.to('admin').emit('SESSION_ONLINE', { 
          session_id: data.session_id,
          email: data.email 
        });
        
        // Send current admin online status to this customer
        client.emit(this.adminConnections.size > 0 ? 'ADMIN_ONLINE' : 'ADMIN_OFFLINE', {
          isOnline: this.adminConnections.size > 0
        });
      }
    } catch (error) {
      this.logger.error(`Error in JOIN_CHAT: ${error.message}`);
      client.emit('ERROR', { message: 'Failed to join chat' });
    }
  }

  @SubscribeMessage('SEND_MESSAGE')
  async handleMessage(
    @MessageBody() data: {
      user_id?: number;
      session_id?: string;
      email?: string;
      customer_name?: string;
      message: string;
      admin_id?: number;
      sender_type?: string;
    },
    @ConnectedSocket() client: Socket,
  ) {
    try {
      if (!data.message || !data.message.trim()) {
        throw new Error('Message cannot be empty');
      }

      // Create message DTO
      const createDto: CreateChatDto = {
        user_id: data.user_id,
        session_id: data.session_id,
        email: data.email,
        customer_name: data.customer_name,
        admin_id: data.admin_id,
        message: data.message.trim(),
        sender_type: data.sender_type || 'user',
      };

      // Save to database
      const chatMessage = await this.chatService.createMessage(createDto);

      if (data.admin_id) {
        // Admin message - broadcast to target room and admin room
        if (data.user_id) {
          this.server.to(`user_${data.user_id}`).emit('NEW_MESSAGE', { chatMessage });
        } else if (data.session_id) {
          this.server.to(`session_${data.session_id}`).emit('NEW_MESSAGE', { chatMessage });
        }
        this.server.to('admin').emit('NEW_MESSAGE', { chatMessage });
      } else if (data.user_id) {
        this.server.to(`user_${data.user_id}`).emit('NEW_MESSAGE', { chatMessage });
        this.server.to('admin').emit('NEW_MESSAGE', { chatMessage });
      } else if (data.session_id) {
        this.server.to(`session_${data.session_id}`).emit('NEW_MESSAGE', { chatMessage });
        this.server.to('admin').emit('NEW_MESSAGE', { chatMessage });
      }
    } catch (error) {
      this.logger.error(`Error in SEND_MESSAGE: ${error.message}`);
      this.logger.error(`Error stack: ${error.stack}`);
      client.emit('ERROR', { 
        message: 'Failed to send message',
        error: error.message 
      });
    }
  }

  @SubscribeMessage('TYPING_START')
  async handleTypingStart(
    @MessageBody() data: { user_id?: number; session_id?: string },
    @ConnectedSocket() client: Socket,
  ) {
    if (data.user_id) {
      this.server.to('admin').emit('TYPING', { 
        user_id: data.user_id, 
        isTyping: true 
      });
    } else if (data.session_id) {
      this.server.to('admin').emit('TYPING', { 
        session_id: data.session_id, 
        isTyping: true 
      });
    }
  }

  @SubscribeMessage('TYPING_STOP')
  async handleTypingStop(
    @MessageBody() data: { user_id?: number; session_id?: string },
    @ConnectedSocket() client: Socket,
  ) {
    if (data.user_id) {
      this.server.to('admin').emit('TYPING', { 
        user_id: data.user_id, 
        isTyping: false 
      });
    } else if (data.session_id) {
      this.server.to('admin').emit('TYPING', { 
        session_id: data.session_id, 
        isTyping: false 
      });
    }
  }

  @SubscribeMessage('MARK_READ')
  async handleMarkRead(
    @MessageBody() data: { user_id?: number; session_id?: string },
    @ConnectedSocket() client: Socket,
  ) {
    try {
      if (data.user_id) {
        await this.chatService.markMessagesAsRead(data.user_id);
      } else if (data.session_id) {
        await this.chatService.markMessagesAsReadBySession(data.session_id);
      }
    } catch (error) {
      this.logger.error(`Error in MARK_READ: ${error.message}`);
    }
  }

  @SubscribeMessage('SUBSCRIBE_CONVERSATION')
  async handleSubscribeConversation(
    @MessageBody() data: { identifier: string },
    @ConnectedSocket() client: Socket,
  ) {
    try {
   
      const room = data.identifier; 
      await client.join(room);
    } catch (error) {
      this.logger.error(`Error in SUBSCRIBE_CONVERSATION: ${error.message}`);
    }
  }
}

