import { Module } from '@nestjs/common';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { ChatGateway } from './chat.gateway';
import { DatabaseService } from '../database/database.service';

@Module({
  controllers: [ChatController],
  providers: [ChatService, ChatGateway, DatabaseService]
})
export class ChatModule {}
